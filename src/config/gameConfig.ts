// ===== 全局常量与主题配色 =====

export const CONFIG = {
  tileSize: 56,          // 单格像素
  hudHeight: 64,         // 顶部 HUD 高度
  buildBarHeight: 96,    // 底部建造栏高度
  fixedTimeStep: 1 / 60, // 固定逻辑步长（秒）
  sellRefundRate: 0.6,   // 卖塔返还比例
} as const;

/** 主题配色（猫咖暖色调） */
export const PALETTE = {
  grass: 0x8fca6a,
  grassDark: 0x7db958,
  path: 0xd8c6a6,
  pathEdge: 0xbfa77f,
  buildHint: 0xffffff,
  rangeCircle: 0x378add,
  hpBack: 0x000000,
  hpFront: 0x4ade4a,
  hpLow: 0xe24b4a,
  text: 0xf4efe6,
  gold: 0xffb64c,
  canFood: 0xef9f27,
} as const;

export type Palette = typeof PALETTE;
