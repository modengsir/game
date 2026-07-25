import type { EnemyDef } from '../core/types';

// ===== 怪物（偷猫粮大军）定义 — 纯数据 =====

export const ENEMIES: EnemyDef[] = [
  {
    id: 'mouse',
    name: '快速鼠',
    emoji: '🐭',
    maxHp: 28,
    speed: 78,
    reward: 6,
    damage: 1,
    size: 15,
  },
  {
    id: 'rat',
    name: '坦克鼠',
    emoji: '🐀',
    maxHp: 120,
    speed: 42,
    reward: 14,
    damage: 2,
    size: 19,
    armor: 3,
  },
  {
    id: 'swarm',
    name: '群冲鼠',
    emoji: '🐹',
    maxHp: 16,
    speed: 95,
    reward: 3,
    damage: 1,
    size: 13,
  },
  {
    id: 'roomba',
    name: '扫地机器人',
    emoji: '🤖',
    maxHp: 260,
    speed: 34,
    reward: 30,
    damage: 3,
    size: 22,
    armor: 6,
  },
  {
    id: 'boss',
    name: '恶霸大猫头目',
    emoji: '🦝',
    maxHp: 900,
    speed: 30,
    reward: 120,
    damage: 8,
    size: 28,
    armor: 10,
  },
];

export const ENEMY_MAP: Record<string, EnemyDef> = Object.fromEntries(
  ENEMIES.map((e) => [e.id, e]),
);
