import type { EventBus } from './EventBus';

export type RunState = 'ready' | 'building' | 'wave' | 'paused' | 'won' | 'lost';

/**
 * 集中管理经济、生命、波次进度等可变状态，
 * 所有变更通过 EventBus 广播，UI 只读订阅。
 */
export class GameState {
  gold: number;
  lives: number;
  maxLives: number;
  currentWave = 0; // 已开始的波次数（0 表示还没开打）
  totalWaves: number;
  speed = 1; // 游戏速度倍率
  runState: RunState = 'ready';

  constructor(
    private bus: EventBus,
    opts: { gold: number; lives: number; totalWaves: number },
  ) {
    this.gold = opts.gold;
    this.lives = opts.lives;
    this.maxLives = opts.lives;
    this.totalWaves = opts.totalWaves;
  }

  canAfford(cost: number): boolean {
    return this.gold >= cost;
  }

  addGold(amount: number) {
    this.gold += amount;
    this.bus.emit('goldChanged', { gold: this.gold });
  }

  spendGold(amount: number): boolean {
    if (!this.canAfford(amount)) return false;
    this.gold -= amount;
    this.bus.emit('goldChanged', { gold: this.gold });
    return true;
  }

  loseLives(amount: number) {
    this.lives = Math.max(0, this.lives - amount);
    this.bus.emit('livesChanged', { lives: this.lives });
    if (this.lives <= 0) this.setState('lost');
  }

  setWave(n: number) {
    this.currentWave = n;
    this.bus.emit('waveChanged', { current: n, total: this.totalWaves });
  }

  setState(s: RunState) {
    if (this.runState === s) return;
    this.runState = s;
    this.bus.emit('stateChanged', { state: s });
    if (s === 'won' || s === 'lost') {
      this.bus.emit('gameOver', { win: s === 'won' });
    }
  }
}
