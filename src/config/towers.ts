import type { TowerDef } from '../core/types';

// ===== 塔（猫咪炮台）定义 — 纯数据，社区可直接扩展 =====

export const TOWERS: TowerDef[] = [
  {
    id: 'thrower',
    name: '投手猫',
    emoji: '🐱',
    color: 0x378add,
    description: '射速快、性价比高的前期主力，逗猫棒精准打击。',
    projectileEmoji: '🧶',
    levels: [
      { damage: 8, range: 130, fireRate: 1.6, upgradeCost: 50 },
      { damage: 14, range: 145, fireRate: 1.9, upgradeCost: 60 },
      { damage: 24, range: 165, fireRate: 2.2, upgradeCost: 110 },
    ],
  },
  {
    id: 'sniper',
    name: '狙击猫',
    emoji: '😼',
    color: 0xef9f27,
    description: '超远射程、高爆发，专点血厚精英，射速偏慢。',
    projectileEmoji: '✨',
    levels: [
      { damage: 40, range: 240, fireRate: 0.6, upgradeCost: 120 },
      { damage: 70, range: 270, fireRate: 0.7, upgradeCost: 130 },
      { damage: 120, range: 300, fireRate: 0.85, upgradeCost: 220 },
    ],
  },
  {
    id: 'froster',
    name: '减速猫',
    emoji: '🙀',
    color: 0x53c5d4,
    description: '喷出冰奶昔，范围减速敌人，伤害低但控场强。',
    projectileEmoji: '❄️',
    slow: 0.45,
    slowDuration: 1.6,
    splash: 46,
    levels: [
      { damage: 4, range: 120, fireRate: 1.2, upgradeCost: 80 },
      { damage: 7, range: 135, fireRate: 1.4, upgradeCost: 90 },
      { damage: 12, range: 150, fireRate: 1.6, upgradeCost: 150 },
    ],
  },
  {
    id: 'bomber',
    name: '范围猫',
    emoji: '😻',
    color: 0x639922,
    description: '毛线球爆炸溅射，克制成群小怪，单发不俗。',
    projectileEmoji: '🎁',
    splash: 64,
    levels: [
      { damage: 18, range: 140, fireRate: 0.8, upgradeCost: 150 },
      { damage: 30, range: 150, fireRate: 0.9, upgradeCost: 160 },
      { damage: 50, range: 170, fireRate: 1.0, upgradeCost: 280 },
    ],
  },
];

export const TOWER_MAP: Record<string, TowerDef> = Object.fromEntries(
  TOWERS.map((t) => [t.id, t]),
);
