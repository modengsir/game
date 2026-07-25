import type { Cell, Point, LevelDef } from './types';
import { CONFIG } from '../config/gameConfig';

/**
 * 网格系统：负责网格 <-> 像素坐标转换、可建造判定、路径像素点生成。
 * 所有坐标以“游戏场地”左上角为原点（不含 HUD）。
 */
export class Grid {
  readonly cols: number;
  readonly rows: number;
  readonly tile = CONFIG.tileSize;
  private readonly occupied: Set<string> = new Set(); // 已建塔的格子
  private readonly pathCells: Set<string> = new Set(); // 路径占用的格子

  constructor(private level: LevelDef) {
    this.cols = level.cols;
    this.rows = level.rows;
    this.markPathCells();
  }

  get pixelWidth(): number {
    return this.cols * this.tile;
  }
  get pixelHeight(): number {
    return this.rows * this.tile;
  }

  private key(col: number, row: number): string {
    return `${col},${row}`;
  }

  /** 网格中心 -> 像素坐标 */
  cellToPixel(cell: Cell): Point {
    return {
      x: cell.col * this.tile + this.tile / 2,
      y: cell.row * this.tile + this.tile / 2,
    };
  }

  /** 像素 -> 网格坐标 */
  pixelToCell(x: number, y: number): Cell {
    return {
      col: Math.floor(x / this.tile),
      row: Math.floor(y / this.tile),
    };
  }

  /** 生成怪物行进的像素路径点（路径网格点 -> 像素中心） */
  getPathPixels(): Point[] {
    return this.level.path.map((c) => this.cellToPixel(c));
  }

  private markPathCells() {
    // 将折线路径经过的整数格标记为不可建造
    const path = this.level.path;
    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i];
      const b = path[i + 1];
      const steps = Math.abs(b.col - a.col) + Math.abs(b.row - a.row);
      const dc = Math.sign(b.col - a.col);
      const dr = Math.sign(b.row - a.row);
      for (let s = 0; s <= steps; s++) {
        this.pathCells.add(this.key(a.col + dc * s, a.row + dr * s));
      }
    }
  }

  isInside(col: number, row: number): boolean {
    return col >= 0 && col < this.cols && row >= 0 && row < this.rows;
  }

  isOnPath(col: number, row: number): boolean {
    return this.pathCells.has(this.key(col, row));
  }

  isBuildable(col: number, row: number): boolean {
    if (!this.isInside(col, row)) return false;
    if (this.isOnPath(col, row)) return false;
    if (this.occupied.has(this.key(col, row))) return false;
    return true;
  }

  occupy(col: number, row: number) {
    this.occupied.add(this.key(col, row));
  }

  vacate(col: number, row: number) {
    this.occupied.delete(this.key(col, row));
  }
}
