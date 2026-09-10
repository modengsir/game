import type { EventBus } from '../core/EventBus';
import type { GameState } from '../core/GameState';
import type { TargetingMode } from '../core/types';
import type { Tower } from '../entities/Tower';
import { TOWERS } from '../config/towers';
import { UI_CSS } from './styles';

export interface UICallbacks {
  onSelectTowerType: (towerId: string | null) => void;
  onStartWave: () => void;
  onSetSpeed: (mult: number) => void;
  onTogglePause: () => void;
  onUpgrade: () => void;
  onSell: () => void;
  onSetTargeting: (mode: TargetingMode) => void;
  onToggleMute: () => boolean;
  onToggleEnglishVoice: () => boolean;
  onRestart: () => void;
}

const TARGET_LABELS: Record<TargetingMode, string> = {
  first: '最前',
  last: '最后',
  strongest: '最强',
  closest: '最近',
};

/**
 * DOM UI 层：HUD、建造栏、塔详情面板、结算界面。只读订阅 EventBus，
 * 操作通过回调回传给 Game。
 */
export class UIManager {
  private hud!: HTMLElement;
  private goldEl!: HTMLElement;
  private livesEl!: HTMLElement;
  private waveEl!: HTMLElement;
  private startBtn!: HTMLButtonElement;
  private speedBtn!: HTMLButtonElement;
  private pauseBtn!: HTMLButtonElement;
  private muteBtn!: HTMLButtonElement;
  private englishBtn!: HTMLButtonElement;
  private buildBar!: HTMLElement;
  private panel: HTMLElement | null = null;
  private toast!: HTMLElement;
  private selectedType: string | null = null;
  private currentTower: Tower | null = null;

  constructor(
    private root: HTMLElement,
    private bus: EventBus,
    private state: GameState,
    private cb: UICallbacks,
  ) {
    this.injectCSS();
    this.buildHUD();
    this.buildBuildBar();
    this.buildToast();
    this.subscribe();
    this.refreshAll();
  }

  private injectCSS() {
    const style = document.createElement('style');
    style.textContent = UI_CSS;
    document.head.appendChild(style);
  }

  private buildHUD() {
    this.hud = el('div', 'md-hud');
    this.goldEl = stat('🐟', '猫粮币', '0');
    this.livesEl = stat('❤️', '猫粮罐', '0');
    this.waveEl = stat('🌊', '波次', '0/0');
    this.hud.append(this.goldEl, this.livesEl, this.waveEl);

    const spacer = el('div', 'spacer');
    this.hud.appendChild(spacer);

    this.pauseBtn = btn('⏸ 暂停', () => this.cb.onTogglePause());
    this.speedBtn = btn('⏩ 1x', () => {
      const next = this.state.speed === 1 ? 2 : this.state.speed === 2 ? 3 : 1;
      this.cb.onSetSpeed(next);
      this.speedBtn.textContent = `⏩ ${next}x`;
    });
    this.muteBtn = btn('🔊', () => {
      const muted = this.cb.onToggleMute();
      this.muteBtn.textContent = muted ? '🔇' : '🔊';
    });
    this.englishBtn = btn('🇺🇸 英语开', () => {
      const enabled = this.cb.onToggleEnglishVoice();
      this.englishBtn.textContent = enabled ? '🇺🇸 英语开' : '🇺🇸 英语关';
    });
    this.startBtn = btn('▶ 开始下一波', () => this.cb.onStartWave());
    this.startBtn.classList.add('primary');

    this.hud.append(this.pauseBtn, this.speedBtn, this.muteBtn, this.englishBtn, this.startBtn);
    this.root.appendChild(this.hud);
  }

  private buildBuildBar() {
    this.buildBar = el('div', 'md-buildbar');
    const hint = el('div');
    hint.style.cssText = 'color:#b7ada0;font-size:12px;min-width:64px;';
    hint.innerHTML = '点击卡片<br>再点地图<br>建塔';
    this.buildBar.appendChild(hint);

    for (const t of TOWERS) {
      const card = el('div', 'md-tower-card');
      card.dataset.tower = t.id;
      card.innerHTML =
        `<div class="emoji">${t.emoji}</div>` +
        `<div class="nm">${t.name}</div>` +
        `<div class="cost">🐟 ${t.levels[0].upgradeCost}</div>`;
      card.title = t.description;
      card.addEventListener('click', () => this.toggleType(t.id));
      this.buildBar.appendChild(card);
    }
    this.root.appendChild(this.buildBar);
  }

  private buildToast() {
    this.toast = el('div', 'md-toast');
    this.root.appendChild(this.toast);
  }

  private toggleType(id: string) {
    this.selectedType = this.selectedType === id ? null : id;
    this.cb.onSelectTowerType(this.selectedType);
    this.hideTowerPanel();
    this.refreshBuildBar();
  }

  clearTypeSelection() {
    this.selectedType = null;
    this.refreshBuildBar();
  }

  private subscribe() {
    this.bus.on('goldChanged', () => this.refreshBuildBar());
    this.bus.on('goldChanged', ({ gold }) => (val(this.goldEl, String(gold))));
    this.bus.on('livesChanged', ({ lives }) => val(this.livesEl, `${lives}/${this.state.maxLives}`));
    this.bus.on('waveChanged', ({ current, total }) => val(this.waveEl, `${current}/${total}`));
    this.bus.on('stateChanged', ({ state }) => this.onStateChange(state));
    this.bus.on('gameOver', ({ win }) => this.showGameOver(win));
  }

  private onStateChange(s: string) {
    // 波次进行中禁用开始按钮
    this.startBtn.disabled = s === 'wave' || s === 'won' || s === 'lost';
    if (s === 'wave') this.startBtn.textContent = '⚔ 战斗中…';
    else if (s === 'ready' || s === 'building') this.startBtn.textContent = '▶ 开始下一波';
    this.pauseBtn.textContent = s === 'paused' ? '▶ 继续' : '⏸ 暂停';
  }

  showToast(msg: string) {
    this.toast.textContent = msg;
    this.toast.classList.add('show');
    setTimeout(() => this.toast.classList.remove('show'), 1400);
  }

  // ===== 塔详情面板 =====
  showTowerPanel(tower: Tower) {
    this.currentTower = tower;
    this.hideTowerPanel();
    const p = el('div', 'md-panel');
    this.renderPanel(p, tower);
    this.root.appendChild(p);
    this.panel = p;
  }

  private renderPanel(p: HTMLElement, tower: Tower) {
    const s = tower.stats;
    const up = tower.upgradeCost;
    p.innerHTML =
      `<h3>${tower.def.emoji} ${tower.def.name} <span style="color:#ffd94c;font-size:12px;">Lv.${tower.level}</span></h3>` +
      `<div class="row"><span>伤害</span><b>${s.damage}</b></div>` +
      `<div class="row"><span>射程</span><b>${Math.round(s.range)}</b></div>` +
      `<div class="row"><span>射速</span><b>${s.fireRate.toFixed(1)}/s</b></div>` +
      (tower.def.slow ? `<div class="row"><span>减速</span><b>${Math.round(tower.def.slow * 100)}%</b></div>` : '') +
      (tower.def.splash ? `<div class="row"><span>溅射</span><b>${tower.def.splash}</b></div>` : '');

    const target = el('div', 'md-target');
    (['first', 'last', 'strongest', 'closest'] as TargetingMode[]).forEach((m) => {
      const b = btn(TARGET_LABELS[m], () => {
        this.cb.onSetTargeting(m);
        this.showTowerPanel(tower);
      });
      if (tower.targeting === m) b.classList.add('active');
      target.appendChild(b);
    });
    p.appendChild(target);

    const actions = el('div', 'actions');
    const upBtn = btn(tower.isMaxLevel ? '已满级' : `升级 🐟${up}`, () => this.cb.onUpgrade());
    upBtn.classList.add('primary');
    upBtn.disabled = tower.isMaxLevel || !this.state.canAfford(up);
    const sellBtn = btn(`卖 🐟${tower.sellValue}`, () => this.cb.onSell());
    actions.append(upBtn, sellBtn);
    p.appendChild(actions);
  }

  refreshTowerPanel() {
    if (this.currentTower && this.panel) this.renderPanel(this.panel, this.currentTower);
  }

  hideTowerPanel() {
    this.panel?.remove();
    this.panel = null;
    this.currentTower = null;
  }

  private refreshBuildBar() {
    this.buildBar.querySelectorAll('.md-tower-card').forEach((c) => {
      const card = c as HTMLElement;
      const id = card.dataset.tower!;
      const def = TOWERS.find((t) => t.id === id)!;
      card.classList.toggle('selected', this.selectedType === id);
      card.classList.toggle('poor', !this.state.canAfford(def.levels[0].upgradeCost));
    });
  }

  private refreshAll() {
    val(this.goldEl, String(this.state.gold));
    val(this.livesEl, `${this.state.lives}/${this.state.maxLives}`);
    val(this.waveEl, `${this.state.currentWave}/${this.state.totalWaves}`);
    this.refreshBuildBar();
  }

  private showGameOver(win: boolean) {
    const o = el('div', 'md-overlay');
    o.innerHTML =
      `<h1>${win ? '🎉 猫咖守住了！' : '😿 猫粮被偷光了…'}</h1>` +
      `<p>${win ? '24 波挑战完成，英语单词也复习了一轮！' : '别灰心，重新布防再来一次～'}</p>`;
    const b = btn(win ? '🔁 再玩一局' : '🔁 重新挑战', () => {
      o.remove();
      this.cb.onRestart();
    });
    b.classList.add('primary');
    b.style.fontSize = '16px';
    b.style.padding = '10px 24px';
    o.appendChild(b);
    this.root.appendChild(o);
  }
}

// ===== DOM 小工具 =====
function el(tag: string, cls?: string): HTMLElement {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
}
function btn(text: string, onClick: () => void): HTMLButtonElement {
  const b = document.createElement('button');
  b.className = 'md-btn';
  b.textContent = text;
  b.addEventListener('click', onClick);
  return b;
}
function stat(icon: string, label: string, value: string): HTMLElement {
  const s = el('div', 'md-stat');
  s.innerHTML = `<span>${icon}</span><span class="lbl">${label}</span><span class="v">${value}</span>`;
  return s;
}
function val(statEl: HTMLElement, v: string) {
  const t = statEl.querySelector('.v');
  if (t) t.textContent = v;
}
