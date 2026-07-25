import { Game } from './game/Game';
import { LEVEL_1 } from './config/levels';

const root = document.getElementById('game-root');
if (!root) throw new Error('#game-root not found');

const game = new Game(root, LEVEL_1);
game.init().catch((err) => {
  console.error('游戏启动失败：', err);
  const loading = document.getElementById('loading');
  if (loading) loading.textContent = '😿 启动失败，请查看控制台';
});
