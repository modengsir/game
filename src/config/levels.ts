import type { LevelDef } from '../core/types';

// ===== 关卡定义（地图路径 + 24 波） =====
// 网格 14 列 × 9 行；path 为怪物途经的网格点序列。

export const LEVEL_1: LevelDef = {
  id: 'catcafe',
  name: '猫咖一号店',
  cols: 14,
  rows: 9,
  path: [
    { col: -1, row: 1 },
    { col: 3, row: 1 },
    { col: 3, row: 4 },
    { col: 1, row: 4 },
    { col: 1, row: 7 },
    { col: 6, row: 7 },
    { col: 6, row: 3 },
    { col: 9, row: 3 },
    { col: 9, row: 6 },
    { col: 12, row: 6 },
    { col: 12, row: 1 },
    { col: 14, row: 1 },
  ],
  buildable: 'all-except-path',
  startGold: 200,
  startLives: 20,
  waves: [
    { spawns: [{ enemyId: 'mouse', count: 6, interval: 0.9 }], learningWords: ['cat', 'dog'] },
    { spawns: [{ enemyId: 'mouse', count: 10, interval: 0.7 }], learningWords: ['fish', 'bird'] },
    {
      spawns: [
        { enemyId: 'mouse', count: 8, interval: 0.6 },
        { enemyId: 'swarm', count: 6, interval: 0.4, delay: 5 },
      ],
      learningWords: ['mouse', 'duck'],
    },
    { spawns: [{ enemyId: 'rat', count: 5, interval: 1.2 }], learningWords: ['apple', 'milk'] },
    {
      spawns: [
        { enemyId: 'swarm', count: 14, interval: 0.3 },
        { enemyId: 'rat', count: 3, interval: 1.5, delay: 6 },
      ],
      learningWords: ['cake', 'rice'],
    },
    {
      spawns: [
        { enemyId: 'mouse', count: 12, interval: 0.5 },
        { enemyId: 'rat', count: 6, interval: 1.0, delay: 4 },
      ],
      learningWords: ['egg', 'water'],
    },
    { spawns: [{ enemyId: 'roomba', count: 3, interval: 2.0 }], learningWords: ['red', 'blue'] },
    {
      spawns: [
        { enemyId: 'swarm', count: 20, interval: 0.25 },
        { enemyId: 'roomba', count: 2, interval: 2.5, delay: 5 },
      ],
      learningWords: ['green', 'yellow'],
    },
    {
      spawns: [
        { enemyId: 'rat', count: 10, interval: 0.8 },
        { enemyId: 'mouse', count: 15, interval: 0.4, delay: 3 },
      ],
      learningWords: ['black', 'white'],
    },
    {
      spawns: [
        { enemyId: 'roomba', count: 5, interval: 1.6 },
        { enemyId: 'swarm', count: 20, interval: 0.3, delay: 4 },
      ],
      learningWords: ['book', 'pen'],
    },
    {
      spawns: [
        { enemyId: 'rat', count: 14, interval: 0.6 },
        { enemyId: 'roomba', count: 4, interval: 2.0, delay: 6 },
      ],
      learningWords: ['bag', 'ruler'],
    },
    {
      spawns: [
        { enemyId: 'swarm', count: 24, interval: 0.25 },
        { enemyId: 'roomba', count: 4, interval: 2.0, delay: 4 },
        { enemyId: 'boss', count: 1, interval: 1, delay: 12 },
      ],
      reward: 200,
      learningWords: ['pencil', 'desk'],
    },
    {
      spawns: [
        { enemyId: 'mouse', count: 14, interval: 0.45 },
        { enemyId: 'swarm', count: 12, interval: 0.28, delay: 5 },
      ],
      learningWords: ['cat', 'apple'],
    },
    {
      spawns: [
        { enemyId: 'swarm', count: 24, interval: 0.24 },
        { enemyId: 'rat', count: 5, interval: 1.1, delay: 6 },
      ],
      learningWords: ['dog', 'milk'],
    },
    {
      spawns: [
        { enemyId: 'mouse', count: 18, interval: 0.42 },
        { enemyId: 'rat', count: 8, interval: 0.85, delay: 4 },
      ],
      learningWords: ['fish', 'cake'],
    },
    {
      spawns: [
        { enemyId: 'rat', count: 10, interval: 0.8 },
        { enemyId: 'roomba', count: 3, interval: 1.8, delay: 7 },
      ],
      learningWords: ['bird', 'rice'],
    },
    {
      spawns: [
        { enemyId: 'swarm', count: 30, interval: 0.22 },
        { enemyId: 'mouse', count: 16, interval: 0.36, delay: 5 },
      ],
      learningWords: ['red', 'blue'],
    },
    {
      spawns: [
        { enemyId: 'roomba', count: 5, interval: 1.5 },
        { enemyId: 'rat', count: 8, interval: 0.75, delay: 5 },
      ],
      learningWords: ['green', 'yellow'],
    },
    {
      spawns: [
        { enemyId: 'mouse', count: 24, interval: 0.34 },
        { enemyId: 'roomba', count: 4, interval: 1.6, delay: 6 },
      ],
      learningWords: ['book', 'pen'],
    },
    {
      spawns: [
        { enemyId: 'swarm', count: 34, interval: 0.2 },
        { enemyId: 'rat', count: 12, interval: 0.65, delay: 4 },
      ],
      learningWords: ['bag', 'ruler'],
    },
    {
      spawns: [
        { enemyId: 'rat', count: 14, interval: 0.58 },
        { enemyId: 'roomba', count: 6, interval: 1.45, delay: 5 },
      ],
      learningWords: ['pencil', 'desk'],
    },
    {
      spawns: [
        { enemyId: 'mouse', count: 28, interval: 0.3 },
        { enemyId: 'swarm', count: 32, interval: 0.2, delay: 4 },
        { enemyId: 'roomba', count: 4, interval: 1.5, delay: 9 },
      ],
      learningWords: ['black', 'white'],
    },
    {
      spawns: [
        { enemyId: 'rat', count: 16, interval: 0.55 },
        { enemyId: 'roomba', count: 7, interval: 1.35, delay: 6 },
      ],
      reward: 260,
      learningWords: ['egg', 'water'],
    },
    {
      spawns: [
        { enemyId: 'swarm', count: 36, interval: 0.2 },
        { enemyId: 'roomba', count: 6, interval: 1.35, delay: 5 },
        { enemyId: 'boss', count: 2, interval: 8, delay: 14 },
      ],
      reward: 360,
      learningWords: ['mouse', 'duck'],
    },
  ],
};

export const LEVELS: LevelDef[] = [LEVEL_1];
