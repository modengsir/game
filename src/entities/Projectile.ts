import { Container, Text } from 'pixi.js';
import type { Point, TowerDef } from '../core/types';
import type { Enemy } from './Enemy';

/**
 * 投射物：追踪目标飞行，命中后由 ProjectileSystem 结算伤害/溅射/减速。
 */
export class Projectile extends Container {
  alive = true;
  readonly damage: number;
  readonly def: TowerDef;
  readonly target: Enemy;
  private speed = 520;

  constructor(from: Point, target: Enemy, damage: number, def: TowerDef) {
    super();
    this.target = target;
    this.damage = damage;
    this.def = def;
    this.position.set(from.x, from.y);

    const sprite = new Text({
      text: def.projectileEmoji,
      style: { fontSize: 20 },
    });
    sprite.anchor.set(0.5);
    this.addChild(sprite);
  }

  /** 返回 true 表示命中（应结算并销毁） */
  update(dt: number): boolean {
    if (!this.target.alive) {
      this.alive = false;
      return false;
    }
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.hypot(dx, dy);
    const step = this.speed * dt;
    this.rotation = Math.atan2(dy, dx);

    if (dist <= step + this.target.def.size) {
      this.alive = false;
      return true;
    }
    this.x += (dx / dist) * step;
    this.y += (dy / dist) * step;
    return false;
  }
}
