import { Container, Graphics, Text } from 'pixi.js';
import type { EnemyDef, LearningWord, Point } from '../core/types';
import { PALETTE } from '../config/gameConfig';

let ENEMY_UID = 1;

/**
 * 怪物实体：沿预设像素路径点巡逻移动，支持减速状态与血条显示。
 */
export class Enemy extends Container {
  readonly uid = ENEMY_UID++;
  readonly def: EnemyDef;
  hp: number;
  alive = true;
  reachedEnd = false;
  learningWord?: LearningWord;

  private path: Point[];
  private targetIndex = 1; // 正前往的路径点索引
  private baseSpeed: number;
  private slowFactor = 1;   // 当前减速系数（1 = 正常）
  private slowTimer = 0;

  private hpBarBack: Graphics;
  private hpBarFront: Graphics;
  private body: Graphics;

  constructor(def: EnemyDef, path: Point[], learningWord?: LearningWord) {
    super();
    this.def = def;
    this.learningWord = learningWord;
    this.hp = def.maxHp;
    this.baseSpeed = def.speed;
    this.path = path;

    // 起点
    this.position.set(path[0].x, path[0].y);

    // 身体底盘
    this.body = new Graphics()
      .circle(0, 0, def.size)
      .fill({ color: 0x000000, alpha: 0.18 });
    this.addChild(this.body);

    // emoji
    const face = new Text({
      text: def.emoji,
      style: { fontSize: def.size * 1.7, align: 'center' },
    });
    face.anchor.set(0.5);
    this.addChild(face);

    if (learningWord) {
      const wordLabel = new Text({
        text: learningWord.word,
        style: {
          fontSize: 13,
          fill: 0x1c1a17,
          fontWeight: 'bold',
          align: 'center',
          stroke: { color: 0xffffff, width: 4 },
        },
      });
      wordLabel.anchor.set(0.5);
      wordLabel.position.set(0, def.size + 16);
      this.addChild(wordLabel);
    }

    // 血条
    const barW = def.size * 2.2;
    this.hpBarBack = new Graphics()
      .rect(-barW / 2, -def.size - 10, barW, 5)
      .fill({ color: PALETTE.hpBack, alpha: 0.5 });
    this.hpBarFront = new Graphics().rect(-barW / 2, -def.size - 10, barW, 5).fill(PALETTE.hpFront);
    this.addChild(this.hpBarBack, this.hpBarFront);
  }

  /** 承受伤害，返回是否致死 */
  takeDamage(amount: number): boolean {
    const real = Math.max(1, amount - (this.def.armor ?? 0));
    this.hp -= real;
    this.updateHpBar();
    if (this.hp <= 0 && this.alive) {
      this.alive = false;
      return true;
    }
    return false;
  }

  applySlow(factor: number, duration: number) {
    // 取更强的减速，并刷新时长
    this.slowFactor = Math.min(this.slowFactor, 1 - factor);
    this.slowTimer = Math.max(this.slowTimer, duration);
  }

  private updateHpBar() {
    const ratio = Math.max(0, this.hp / this.def.maxHp);
    const barW = this.def.size * 2.2;
    this.hpBarFront.clear();
    this.hpBarFront
      .rect(-barW / 2, -this.def.size - 10, barW * ratio, 5)
      .fill(ratio > 0.35 ? PALETTE.hpFront : PALETTE.hpLow);
  }

  /** 沿路径推进；到达终点时设置 reachedEnd */
  update(dt: number) {
    if (!this.alive) return;

    // 减速计时
    if (this.slowTimer > 0) {
      this.slowTimer -= dt;
      if (this.slowTimer <= 0) this.slowFactor = 1;
    }
    // 冰冻视觉：减速时轻微偏蓝
    this.tint = this.slowFactor < 1 ? 0x9fd8ff : 0xffffff;

    if (this.targetIndex >= this.path.length) {
      this.reachedEnd = true;
      this.alive = false;
      return;
    }

    const target = this.path[this.targetIndex];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.hypot(dx, dy);
    const step = this.baseSpeed * this.slowFactor * dt;

    if (dist <= step) {
      this.position.set(target.x, target.y);
      this.targetIndex++;
    } else {
      this.x += (dx / dist) * step;
      this.y += (dy / dist) * step;
    }
  }

  /** 供狙击“最前方”策略：已走过的路程 */
  get progress(): number {
    return this.targetIndex + 1 - Math.min(1, this.distToTarget());
  }

  private distToTarget(): number {
    if (this.targetIndex >= this.path.length) return 0;
    const t = this.path[this.targetIndex];
    return Math.hypot(t.x - this.x, t.y - this.y) / 100;
  }
}
