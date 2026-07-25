import { Container, Graphics, Text } from 'pixi.js';
import type { Cell, Point, TargetingMode, TowerDef } from '../core/types';
import { Enemy } from './Enemy';

let TOWER_UID = 1;

/**
 * 塔实体：锁定射程内目标、按射速开火。
 * 实际的投射物生成与伤害结算交给上层系统，塔只负责“决定何时对谁开火”。
 */
export class Tower extends Container {
  readonly uid = TOWER_UID++;
  readonly def: TowerDef;
  readonly cell: Cell;
  readonly muzzle: Point;
  level = 1; // 1~3
  targeting: TargetingMode = 'first';
  totalInvested: number;

  private cooldown = 0;
  private rangeCircle: Graphics;
  private base: Graphics;
  private face: Text;
  private levelPips: Container;

  constructor(def: TowerDef, cell: Cell, pos: Point) {
    super();
    this.def = def;
    this.cell = cell;
    this.muzzle = pos;
    this.position.set(pos.x, pos.y);
    this.totalInvested = def.levels[0].upgradeCost;

    // 射程圈（默认隐藏）
    this.rangeCircle = new Graphics();
    this.rangeCircle.visible = false;
    this.addChild(this.rangeCircle);

    // 底座
    this.base = new Graphics();
    this.addChild(this.base);

    // 猫脸
    this.face = new Text({ text: def.emoji, style: { fontSize: 34 } });
    this.face.anchor.set(0.5);
    this.addChild(this.face);

    // 等级星标
    this.levelPips = new Container();
    this.addChild(this.levelPips);

    this.redraw();
    this.eventMode = 'static';
    this.cursor = 'pointer';
  }

  get stats() {
    return this.def.levels[this.level - 1];
  }

  get isMaxLevel(): boolean {
    return this.level >= this.def.levels.length;
  }

  get upgradeCost(): number {
    return this.isMaxLevel ? 0 : this.def.levels[this.level].upgradeCost;
  }

  get sellValue(): number {
    return Math.floor(this.totalInvested * 0.6);
  }

  upgrade() {
    if (this.isMaxLevel) return;
    this.totalInvested += this.def.levels[this.level].upgradeCost;
    this.level++;
    this.redraw();
  }

  showRange(show: boolean) {
    this.rangeCircle.visible = show;
  }

  private redraw() {
    this.base.clear();
    this.base
      .circle(0, 0, 22)
      .fill({ color: this.def.color, alpha: 0.22 })
      .circle(0, 0, 22)
      .stroke({ color: this.def.color, width: 2 });

    this.rangeCircle.clear();
    this.rangeCircle
      .circle(0, 0, this.stats.range)
      .fill({ color: this.def.color, alpha: 0.08 })
      .circle(0, 0, this.stats.range)
      .stroke({ color: this.def.color, width: 1.5, alpha: 0.6 });

    // 等级点
    this.levelPips.removeChildren();
    for (let i = 0; i < this.level; i++) {
      const pip = new Graphics().circle(0, 0, 3).fill(0xffd94c);
      pip.position.set(-8 + i * 8, 18);
      this.levelPips.addChild(pip);
    }
  }

  /** 在射程内选择目标 */
  private pickTarget(enemies: Enemy[]): Enemy | null {
    const range = this.stats.range;
    let best: Enemy | null = null;
    let bestScore = -Infinity;
    for (const e of enemies) {
      if (!e.alive) continue;
      const d = Math.hypot(e.x - this.x, e.y - this.y);
      if (d > range) continue;
      let score: number;
      switch (this.targeting) {
        case 'last': score = -e.progress; break;
        case 'strongest': score = e.hp; break;
        case 'closest': score = -d; break;
        case 'first':
        default: score = e.progress; break;
      }
      if (score > bestScore) {
        bestScore = score;
        best = e;
      }
    }
    return best;
  }

  /**
   * 推进冷却，若可开火则返回目标（上层据此生成投射物）。
   */
  update(dt: number, enemies: Enemy[]): Enemy | null {
    if (this.cooldown > 0) this.cooldown -= dt;
    if (this.cooldown > 0) return null;
    const target = this.pickTarget(enemies);
    if (!target) return null;
    this.cooldown = 1 / this.stats.fireRate;
    // 炮口朝向目标
    this.face.rotation = 0;
    return target;
  }
}
