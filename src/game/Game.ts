import { Application, Container, Text } from 'pixi.js';
import type { LevelDef, TargetingMode } from '../core/types';
import { CONFIG } from '../config/gameConfig';
import { EventBus } from '../core/EventBus';
import { GameState } from '../core/GameState';
import { Grid } from '../core/Grid';
import { MapRenderer } from '../systems/MapRenderer';
import { WaveManager } from '../systems/WaveManager';
import { Enemy } from '../entities/Enemy';
import { Tower } from '../entities/Tower';
import { Projectile } from '../entities/Projectile';
import { TOWER_MAP } from '../config/towers';
import { AudioManager } from '../audio/AudioManager';
import { UIManager } from '../ui/UIManager';

/**
 * 游戏总控：持有 PixiJS Application、所有系统与实体列表，
 * 驱动固定步长主循环，串联建塔 / 波次 / 战斗 / 经济 / 胜负逻辑。
 */
export class Game {
  private app!: Application;
  private bus = new EventBus();
  private audio = new AudioManager();
  private state!: GameState;
  private grid!: Grid;
  private map!: MapRenderer;
  private waves!: WaveManager;
  private ui!: UIManager;

  private worldLayer = new Container();  // 随 HUD 下移的游戏世界
  private enemyLayer = new Container();
  private towerLayer = new Container();
  private projLayer = new Container();

  private enemies: Enemy[] = [];
  private towers: Tower[] = [];
  private projectiles: Projectile[] = [];

  private selectedTowerType: string | null = null;
  private selectedTower: Tower | null = null;
  private accumulator = 0;

  constructor(private root: HTMLElement, private level: LevelDef) {}

  async init() {
    this.grid = new Grid(this.level);
    const w = this.grid.pixelWidth;
    const h = this.grid.pixelHeight + CONFIG.hudHeight + CONFIG.buildBarHeight;

    this.app = new Application();
    await this.app.init({
      width: w,
      height: h,
      background: 0x1c1a17,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
    });
    this.root.appendChild(this.app.canvas);
    document.getElementById('loading')?.remove();

    // 世界层整体下移，给 HUD 让位
    this.worldLayer.y = CONFIG.hudHeight;
    this.app.stage.addChild(this.worldLayer);

    this.map = new MapRenderer(this.grid);
    this.worldLayer.addChild(this.map, this.enemyLayer, this.projLayer, this.towerLayer);

    this.state = new GameState(this.bus, {
      gold: this.level.startGold,
      lives: this.level.startLives,
      totalWaves: this.level.waves.length,
    });

    this.waves = new WaveManager(
      this.level,
      this.grid.getPathPixels(),
      this.bus,
      (e) => this.spawnEnemy(e),
    );

    this.ui = new UIManager(this.root, this.bus, this.state, {
      onSelectTowerType: (id) => (this.selectedTowerType = id),
      onStartWave: () => this.startWave(),
      onSetSpeed: (m) => (this.state.speed = m),
      onTogglePause: () => this.togglePause(),
      onUpgrade: () => this.upgradeSelected(),
      onSell: () => this.sellSelected(),
      onSetTargeting: (m) => this.setTargeting(m),
      onToggleMute: () => (this.audio.muted = !this.audio.muted),
      onRestart: () => this.restart(),
    });

    this.bindInput();
    this.state.setState('ready');
    this.app.ticker.add((t) => this.tick(t.deltaMS / 1000));
  }

  // ===== 输入 =====
  private bindInput() {
    const unlock = () => this.audio.unlock();
    window.addEventListener('pointerdown', unlock, { once: true });

    this.app.stage.eventMode = 'static';
    this.app.stage.hitArea = this.app.screen;

    this.app.stage.on('pointermove', (e) => {
      const local = this.toWorld(e.global.x, e.global.y);
      if (!this.inBoard(local.x, local.y) || !this.selectedTowerType) {
        this.map.hideHover();
        return;
      }
      const cell = this.grid.pixelToCell(local.x, local.y);
      this.map.showHover(cell.col, cell.row, this.grid.isBuildable(cell.col, cell.row));
    });

    this.app.stage.on('pointertap', (e) => {
      const local = this.toWorld(e.global.x, e.global.y);
      if (!this.inBoard(local.x, local.y)) return;
      const cell = this.grid.pixelToCell(local.x, local.y);

      // 若点到已有塔 -> 选中
      const hit = this.towers.find((t) => t.cell.col === cell.col && t.cell.row === cell.row);
      if (hit && !this.selectedTowerType) {
        this.selectTower(hit);
        return;
      }
      if (this.selectedTowerType) {
        this.tryBuild(cell.col, cell.row);
      } else {
        this.selectTower(null);
      }
    });
  }

  private toWorld(gx: number, gy: number) {
    return { x: gx, y: gy - CONFIG.hudHeight };
  }
  private inBoard(x: number, y: number): boolean {
    return x >= 0 && x < this.grid.pixelWidth && y >= 0 && y < this.grid.pixelHeight;
  }

  // ===== 建塔 / 选塔 / 升级 / 卖塔 =====
  private tryBuild(col: number, row: number) {
    const def = this.selectedTowerType ? TOWER_MAP[this.selectedTowerType] : null;
    if (!def) return;
    if (!this.grid.isBuildable(col, row)) {
      this.ui.showToast('这里不能建塔！');
      this.audio.play('error');
      return;
    }
    const cost = def.levels[0].upgradeCost;
    if (!this.state.spendGold(cost)) {
      this.ui.showToast('猫粮币不够啦～');
      this.audio.play('error');
      return;
    }
    const pos = this.grid.cellToPixel({ col, row });
    const tower = new Tower(def, { col, row }, pos);
    this.towers.push(tower);
    this.towerLayer.addChild(tower);
    this.grid.occupy(col, row);
    this.audio.play('build');
  }

  private selectTower(tower: Tower | null) {
    this.selectedTower?.showRange(false);
    this.selectedTower = tower;
    if (tower) {
      tower.showRange(true);
      this.ui.showTowerPanel(tower);
      this.ui.clearTypeSelection();
      this.selectedTowerType = null;
    } else {
      this.ui.hideTowerPanel();
    }
  }

  private upgradeSelected() {
    const t = this.selectedTower;
    if (!t || t.isMaxLevel) return;
    if (!this.state.spendGold(t.upgradeCost)) {
      this.ui.showToast('猫粮币不够升级～');
      this.audio.play('error');
      return;
    }
    t.upgrade();
    t.showRange(true);
    this.audio.play('upgrade');
    this.ui.refreshTowerPanel();
  }

  private sellSelected() {
    const t = this.selectedTower;
    if (!t) return;
    this.state.addGold(t.sellValue);
    this.grid.vacate(t.cell.col, t.cell.row);
    this.towers = this.towers.filter((x) => x !== t);
    t.destroy();
    this.audio.play('sell');
    this.selectTower(null);
  }

  private setTargeting(m: TargetingMode) {
    if (this.selectedTower) this.selectedTower.targeting = m;
  }

  // ===== 波次控制 =====
  private startWave() {
    if (this.state.runState === 'wave') return;
    if (this.waves.startNextWave()) {
      this.state.setState('wave');
      this.audio.play('wave');
    }
  }

  private togglePause() {
    if (this.state.runState === 'paused') {
      this.state.setState(this.enemies.length ? 'wave' : 'building');
    } else if (this.state.runState === 'wave' || this.state.runState === 'building') {
      this.state.setState('paused');
    }
  }

  private spawnEnemy(e: Enemy) {
    this.enemies.push(e);
    this.enemyLayer.addChild(e);
  }

  // ===== 主循环（固定步长） =====
  private tick(dtReal: number) {
    if (this.state.runState === 'paused' || this.state.runState === 'won' || this.state.runState === 'lost') {
      return;
    }
    const dt = Math.min(dtReal, 0.05) * this.state.speed;
    this.accumulator += dt;
    while (this.accumulator >= CONFIG.fixedTimeStep) {
      this.step(CONFIG.fixedTimeStep);
      this.accumulator -= CONFIG.fixedTimeStep;
    }
  }

  private step(dt: number) {
    this.waves.update(dt);

    // 怪物移动
    for (const e of this.enemies) {
      e.update(dt);
      if (e.reachedEnd) {
        this.state.loseLives(e.def.damage);
        this.audio.play('leak');
      }
    }

    // 塔开火
    for (const t of this.towers) {
      const target = t.update(dt, this.enemies);
      if (target) {
        const p = new Projectile(t.muzzle, target, t.stats.damage, t.def);
        this.projectiles.push(p);
        this.projLayer.addChild(p);
        this.audio.play('shoot');
      }
    }

    // 投射物飞行与结算
    for (const p of this.projectiles) {
      if (p.update(dt)) this.resolveHit(p);
    }

    this.cleanup();
    this.checkProgress();
  }

  /** 命中结算：单体 / 溅射 / 减速 */
  private resolveHit(p: Projectile) {
    const def = p.def;
    this.audio.play('hit');
    if (def.splash) {
      for (const e of this.enemies) {
        if (!e.alive) continue;
        const d = Math.hypot(e.x - p.x, e.y - p.y);
        if (d <= def.splash) {
          this.damageEnemy(e, p.damage);
          if (def.slow) e.applySlow(def.slow, def.slowDuration ?? 1);
        }
      }
    } else {
      this.damageEnemy(p.target, p.damage);
      if (def.slow) p.target.applySlow(def.slow, def.slowDuration ?? 1);
    }
  }

  private damageEnemy(e: Enemy, dmg: number) {
    if (e.takeDamage(dmg)) {
      this.state.addGold(e.def.reward);
      this.audio.play('kill');
      this.spawnCoin(e.x, e.y, e.def.reward);
    }
  }

  private spawnCoin(x: number, y: number, amount: number) {
    const txt = new Text({
      text: `+${amount}`,
      style: { fontSize: 14, fill: 0xffd94c, fontWeight: 'bold' },
    });
    txt.anchor.set(0.5);
    txt.position.set(x, y);
    this.enemyLayer.addChild(txt);
    let life = 0.7;
    const anim = (ticker: any) => {
      const d = ticker.deltaMS / 1000;
      life -= d;
      txt.y -= 30 * d;
      txt.alpha = Math.max(0, life / 0.7);
      if (life <= 0) {
        this.app.ticker.remove(anim);
        txt.destroy();
      }
    };
    this.app.ticker.add(anim);
  }

  private cleanup() {
    // 死亡 / 到达终点的怪物
    this.enemies = this.enemies.filter((e) => {
      if (!e.alive) {
        e.destroy();
        return false;
      }
      return true;
    });
    // 命中或目标消失的投射物
    this.projectiles = this.projectiles.filter((p) => {
      if (!p.alive) {
        p.destroy();
        return false;
      }
      return true;
    });
    if (this.selectedTower) this.ui.refreshTowerPanel();
  }

  private checkProgress() {
    if (this.state.runState !== 'wave') return;
    const waveDone = this.waves.isSpawningDone && this.enemies.length === 0;
    if (!waveDone) return;

    // 清波奖励
    const bonus = this.waves.currentWaveReward() + 30 + this.waves.currentWaveNumber * 5;
    this.state.addGold(bonus);
    this.ui.showToast(`第 ${this.waves.currentWaveNumber} 波清空！+${bonus} 🐟`);
    this.bus.emit('waveCleared', { wave: this.waves.currentWaveNumber });

    if (this.waves.isLastWave) {
      this.state.setState('won');
      this.audio.play('win');
    } else {
      this.state.setState('building');
    }
  }

  private restart() {
    this.enemies.forEach((e) => e.destroy());
    this.towers.forEach((t) => t.destroy());
    this.projectiles.forEach((p) => p.destroy());
    this.enemies = [];
    this.towers = [];
    this.projectiles = [];
    this.app.destroy(true, { children: true });
    this.ui.hideTowerPanel();
    // 清空 root 内除 canvas 外的 UI，由重新 init 重建
    this.root.querySelectorAll('.md-hud, .md-buildbar, .md-panel, .md-overlay, .md-toast')
      .forEach((n) => n.remove());
    const fresh = new Game(this.root, this.level);
    fresh.init();
  }
}
