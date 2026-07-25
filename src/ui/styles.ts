// UI 样式注入（保持与 index.html 主题一致）
export const UI_CSS = `
.md-hud {
  position: absolute; top: 0; left: 0; right: 0; height: 64px;
  display: flex; align-items: center; gap: 8px; padding: 0 14px;
  background: rgba(42,38,34,0.92); color: #f4efe6; z-index: 20;
  font-size: 15px; user-select: none;
}
.md-stat { display: flex; align-items: center; gap: 6px; font-weight: 600; }
.md-stat .lbl { font-size: 12px; color: #b7ada0; font-weight: 400; }
.md-hud .spacer { flex: 1; }
.md-btn {
  background: #3a352f; color: #f4efe6; border: 1px solid #524a41;
  border-radius: 8px; padding: 7px 12px; font-size: 14px; cursor: pointer;
  transition: all .12s; font-family: inherit;
}
.md-btn:hover { background: #4a433b; }
.md-btn:active { transform: translateY(1px); }
.md-btn.primary { background: #ffb64c; color: #2a2622; border-color: #ffb64c; font-weight: 600; }
.md-btn.primary:hover { background: #ffc46b; }
.md-btn:disabled { opacity: .4; cursor: not-allowed; }
.md-btn.active { background: #ffb64c; color: #2a2622; }

.md-buildbar {
  position: absolute; left: 0; right: 0; bottom: 0; height: 96px;
  display: flex; align-items: center; gap: 10px; padding: 0 14px;
  background: rgba(42,38,34,0.94); z-index: 20; overflow-x: auto;
}
.md-tower-card {
  min-width: 92px; background: #33302b; border: 2px solid #4a433b;
  border-radius: 10px; padding: 8px 6px; text-align: center; cursor: pointer;
  transition: all .12s; color: #f4efe6; flex-shrink: 0;
}
.md-tower-card:hover { border-color: #6c6355; transform: translateY(-2px); }
.md-tower-card.selected { border-color: #ffb64c; background: #40382c; }
.md-tower-card.poor { opacity: .5; }
.md-tower-card .emoji { font-size: 28px; line-height: 1; }
.md-tower-card .nm { font-size: 13px; margin-top: 3px; font-weight: 600; }
.md-tower-card .cost { font-size: 12px; color: #ffb64c; margin-top: 2px; }

.md-panel {
  position: absolute; right: 14px; top: 78px; width: 210px;
  background: rgba(42,38,34,0.96); border: 1px solid #524a41; border-radius: 12px;
  padding: 12px; z-index: 25; color: #f4efe6; font-size: 13px;
}
.md-panel h3 { font-size: 15px; margin-bottom: 6px; display:flex; align-items:center; gap:6px; }
.md-panel .row { display: flex; justify-content: space-between; margin: 4px 0; color: #d8cfc2; }
.md-panel .row b { color: #f4efe6; }
.md-panel .actions { display: flex; gap: 6px; margin-top: 10px; }
.md-panel .actions .md-btn { flex: 1; padding: 8px 4px; font-size: 13px; }
.md-target { display: flex; gap: 4px; margin-top: 8px; }
.md-target .md-btn { flex: 1; padding: 5px 2px; font-size: 11px; }

.md-overlay {
  position: absolute; inset: 0; z-index: 40; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 14px;
  background: rgba(20,18,15,0.82); color: #f4efe6; text-align: center;
}
.md-overlay h1 { font-size: 44px; }
.md-overlay p { font-size: 16px; color: #d8cfc2; }
.md-toast {
  position: absolute; left: 50%; top: 76px; transform: translateX(-50%);
  background: rgba(226,75,74,0.95); color: #fff; padding: 6px 16px; border-radius: 20px;
  font-size: 13px; z-index: 30; opacity: 0; transition: opacity .2s; pointer-events: none;
}
.md-toast.show { opacity: 1; }
`;
