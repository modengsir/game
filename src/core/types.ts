// ===== 全局类型定义 =====

/** 网格坐标（列、行） */
export interface Cell {
  col: number;
  row: number;
}

/** 像素坐标 */
export interface Point {
  x: number;
  y: number;
}

/** 目标选择策略 */
export type TargetingMode = 'first' | 'last' | 'strongest' | 'closest';

/** 塔的单级数值 */
export interface TowerLevelStats {
  damage: number;      // 单发伤害
  range: number;       // 射程（像素）
  fireRate: number;    // 每秒攻击次数
  upgradeCost: number; // 升到此级的花费（level 1 为建造价）
}

/** 塔的完整定义（数据驱动） */
export interface TowerDef {
  id: string;
  name: string;
  emoji: string;
  color: number;         // 主题色（用于射程圈、投射物）
  description: string;
  splash?: number;       // 溅射半径（像素），存在则为 AOE
  slow?: number;         // 减速比例 0~1，存在则附带减速
  slowDuration?: number; // 减速持续（秒）
  projectileEmoji: string;
  levels: TowerLevelStats[];
}

/** 怪物定义（数据驱动） */
export interface EnemyDef {
  id: string;
  name: string;
  emoji: string;
  maxHp: number;
  speed: number;    // 像素/秒
  reward: number;   // 击杀奖励猫粮币
  damage: number;   // 抵达终点扣除的猫粮罐数
  size: number;     // 渲染半径
  armor?: number;   // 固定减伤
}

/** 英语学习词条 */
export interface LearningWord {
  word: string;
  meaning: string;
  group: string;
}

/** 单波中的一个生成组 */
export interface WaveSpawn {
  enemyId: string;
  count: number;
  interval: number; // 组内每只间隔（秒）
  delay?: number;   // 相对波次开始的延迟（秒）
}

/** 一波配置 */
export interface Wave {
  spawns: WaveSpawn[];
  reward?: number; // 清波奖励
  learningWords?: string[]; // 本波重点英语单词
}

/** 关卡（地图 + 波次） */
export interface LevelDef {
  id: string;
  name: string;
  cols: number;
  rows: number;
  path: Cell[];       // 怪物行进路径（网格点序列）
  buildable: 'all-except-path' | Cell[]; // 可建造格
  startGold: number;
  startLives: number;
  waves: Wave[];
}
