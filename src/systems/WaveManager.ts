import type { LevelDef, Point } from '../core/types';
import { ENEMY_MAP } from '../config/enemies';
import { Enemy } from '../entities/Enemy';
import type { EventBus } from '../core/EventBus';

interface PendingSpawn {
  enemyId: string;
  time: number; // 相对波次开始的绝对生成时刻（秒）
}

/**
 * 波次管理：解析波次配置为时间轴，按时生成怪物；
 * 判断当前波是否出怪完毕，并对外提供“开始下一波”。
 */
export class WaveManager {
  private waveIndex = -1;      // 当前波索引（-1 未开始）
  private timeline: PendingSpawn[] = [];
  private elapsed = 0;
  private spawnCursor = 0;
  private waveActive = false;

  constructor(
    private level: LevelDef,
    private path: Point[],
    private bus: EventBus,
    private onSpawn: (enemy: Enemy) => void,
  ) {}

  get isLastWave(): boolean {
    return this.waveIndex >= this.level.waves.length - 1;
  }

  get currentWaveNumber(): number {
    return this.waveIndex + 1;
  }

  get totalWaves(): number {
    return this.level.waves.length;
  }

  /** 是否所有波都已开始 */
  get allWavesStarted(): boolean {
    return this.waveIndex >= this.level.waves.length - 1 && !this.hasPending;
  }

  get hasPending(): boolean {
    return this.waveActive && this.spawnCursor < this.timeline.length;
  }

  get isSpawningDone(): boolean {
    return this.waveActive && this.spawnCursor >= this.timeline.length;
  }

  /** 开始下一波，构建时间轴 */
  startNextWave(): boolean {
    if (this.waveIndex >= this.level.waves.length - 1) return false;
    this.waveIndex++;
    const wave = this.level.waves[this.waveIndex];
    this.timeline = [];
    for (const spawn of wave.spawns) {
      const base = spawn.delay ?? 0;
      for (let i = 0; i < spawn.count; i++) {
        this.timeline.push({ enemyId: spawn.enemyId, time: base + i * spawn.interval });
      }
    }
    this.timeline.sort((a, b) => a.time - b.time);
    this.elapsed = 0;
    this.spawnCursor = 0;
    this.waveActive = true;
    this.bus.emit('waveChanged', {
      current: this.currentWaveNumber,
      total: this.totalWaves,
    });
    return true;
  }

  update(dt: number) {
    if (!this.waveActive) return;
    this.elapsed += dt;
    while (
      this.spawnCursor < this.timeline.length &&
      this.timeline[this.spawnCursor].time <= this.elapsed
    ) {
      const item = this.timeline[this.spawnCursor];
      const def = ENEMY_MAP[item.enemyId];
      if (def) this.onSpawn(new Enemy(def, this.path));
      this.spawnCursor++;
    }
  }

  /** 当前波清波奖励 */
  currentWaveReward(): number {
    return this.level.waves[this.waveIndex]?.reward ?? 0;
  }
}
