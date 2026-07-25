// ===== 极简类型化事件总线：解耦系统间通信 =====

export type GameEvents = {
  goldChanged: { gold: number };
  livesChanged: { lives: number };
  waveChanged: { current: number; total: number };
  waveCleared: { wave: number };
  enemyKilled: { reward: number };
  enemyLeaked: { damage: number };
  towerSelected: { instanceId: number | null };
  gameOver: { win: boolean };
  stateChanged: { state: string };
  sfx: { name: string };
};

type Handler<T> = (payload: T) => void;

export class EventBus {
  private handlers: { [K in keyof GameEvents]?: Handler<GameEvents[K]>[] } = {};

  on<K extends keyof GameEvents>(event: K, handler: Handler<GameEvents[K]>): () => void {
    const list = (this.handlers[event] ?? (this.handlers[event] = [])) as Handler<GameEvents[K]>[];
    list.push(handler);
    return () => this.off(event, handler);
  }

  off<K extends keyof GameEvents>(event: K, handler: Handler<GameEvents[K]>) {
    const list = this.handlers[event];
    if (!list) return;
    const idx = list.indexOf(handler);
    if (idx >= 0) list.splice(idx, 1);
  }

  emit<K extends keyof GameEvents>(event: K, payload: GameEvents[K]) {
    this.handlers[event]?.forEach((h) => h(payload));
  }
}
