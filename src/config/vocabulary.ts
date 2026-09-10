import type { LearningWord } from '../core/types';

export const VOCABULARY: LearningWord[] = [
  { word: 'cat', meaning: '猫', group: '动物' },
  { word: 'dog', meaning: '狗', group: '动物' },
  { word: 'fish', meaning: '鱼', group: '动物' },
  { word: 'bird', meaning: '鸟', group: '动物' },
  { word: 'mouse', meaning: '老鼠', group: '动物' },
  { word: 'duck', meaning: '鸭子', group: '动物' },
  { word: 'apple', meaning: '苹果', group: '食物' },
  { word: 'milk', meaning: '牛奶', group: '食物' },
  { word: 'cake', meaning: '蛋糕', group: '食物' },
  { word: 'rice', meaning: '米饭', group: '食物' },
  { word: 'egg', meaning: '鸡蛋', group: '食物' },
  { word: 'water', meaning: '水', group: '食物' },
  { word: 'red', meaning: '红色', group: '颜色' },
  { word: 'blue', meaning: '蓝色', group: '颜色' },
  { word: 'green', meaning: '绿色', group: '颜色' },
  { word: 'yellow', meaning: '黄色', group: '颜色' },
  { word: 'black', meaning: '黑色', group: '颜色' },
  { word: 'white', meaning: '白色', group: '颜色' },
  { word: 'book', meaning: '书', group: '学习用品' },
  { word: 'pen', meaning: '钢笔', group: '学习用品' },
  { word: 'bag', meaning: '书包', group: '学习用品' },
  { word: 'ruler', meaning: '尺子', group: '学习用品' },
  { word: 'pencil', meaning: '铅笔', group: '学习用品' },
  { word: 'desk', meaning: '书桌', group: '学习用品' },
];

export const VOCABULARY_MAP: Record<string, LearningWord> = Object.fromEntries(
  VOCABULARY.map((item) => [item.word, item]),
);
