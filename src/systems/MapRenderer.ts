import { Container, Graphics } from 'pixi.js';
import type { Grid } from '../core/Grid';
import { CONFIG, PALETTE } from '../config/gameConfig';

/**
 * 地图渲染：绘制草地棋盘、猫爪路径、可建造格高亮与终点猫粮罐。
 */
export class MapRenderer extends Container {
  private hover: Graphics;

  constructor(private grid: Grid) {
    super();
    this.drawGround();
    this.drawPath();
    this.drawGoal();

    this.hover = new Graphics();
    this.hover.visible = false;
    this.addChild(this.hover);
  }

  private drawGround() {
    const g = new Graphics();
    const t = this.grid.tile;
    for (let r = 0; r < this.grid.rows; r++) {
      for (let c = 0; c < this.grid.cols; c++) {
        const color = (r + c) % 2 === 0 ? PALETTE.grass : PALETTE.grassDark;
        g.rect(c * t, r * t, t, t).fill(color);
      }
    }
    this.addChild(g);
  }

  private drawPath() {
    const pts = this.grid.getPathPixels();
    const g = new Graphics();
    const w = this.grid.tile * 0.82;

    // 路径底
    g.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i].x, pts[i].y);
    g.stroke({ color: PALETTE.pathEdge, width: w + 8, cap: 'round', join: 'round' });

    g.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i].x, pts[i].y);
    g.stroke({ color: PALETTE.path, width: w, cap: 'round', join: 'round' });

    // 猫爪虚线中缝
    g.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i].x, pts[i].y);
    g.stroke({ color: PALETTE.pathEdge, width: 3, cap: 'round', join: 'round', alpha: 0.5 });

    this.addChild(g);
  }

  private drawGoal() {
    const path = this.grid.getPathPixels();
    const end = path[path.length - 1];
    const g = new Graphics();
    // 终点收窄到场地内一点
    const x = Math.min(end.x, this.grid.pixelWidth - 18);
    g.roundRect(x - 16, end.y - 20, 32, 40, 6).fill(PALETTE.canFood);
    g.roundRect(x - 16, end.y - 20, 32, 8, 3).fill(0xf7d488);
    this.addChild(g);
  }

  showHover(col: number, row: number, buildable: boolean) {
    const t = this.grid.tile;
    this.hover.clear();
    this.hover
      .roundRect(col * t + 2, row * t + 2, t - 4, t - 4, 6)
      .fill({ color: buildable ? 0x4ade4a : 0xe24b4a, alpha: 0.28 })
      .stroke({ color: buildable ? 0x4ade4a : 0xe24b4a, width: 2 });
    this.hover.visible = true;
  }

  hideHover() {
    this.hover.visible = false;
  }

  get boardSize() {
    return { w: this.grid.pixelWidth, h: this.grid.pixelHeight, hud: CONFIG.hudHeight };
  }
}
