# 开发进度追踪 · Meow Defense

> 本文件用于**多轮递进式协作**的上下文维护：每轮对话开工前先读此文件了解已完成模块与关键决策，收工后更新。

## 关键决策记录

| 项 | 决策 | 理由 |
|---|---|---|
| 主题 | 🐱 喵喵防线·猫咖保卫战 | 萌系动物 meme，传播性强、美术易表达 |
| 渲染 | PixiJS v8（WebGL） | 2D 专业渲染，性能与效果最佳；塔防无需物理引擎/3D |
| 美术 | Emoji + CSS/Graphics | 零素材依赖，先跑通玩法，后期可替换精灵图 |
| 架构 | 数据驱动 + 事件总线 | 塔/怪/波次/关卡全部 config 化，社区易二开 |
| UI | DOM 覆盖层 | HUD/建造栏/面板用 DOM，比 Canvas 文本更易维护 |

## 阶段进度

- [x] **阶段一** 工程结构 + 场景渲染 + 地图（网格、主循环、草地/路径渲染）
- [x] **阶段二** 怪物路径系统 + 波次生成（时间轴驱动、12 波配置）
- [x] **阶段三** 建塔 + 攻击 + 三级升级（4 种塔、4 种目标策略、投射物）
- [x] **阶段四** 经济 + 血量 + 胜负判定（猫粮币收支、漏怪扣血、结算）
- [x] **阶段五** UI + 音效 + 平衡（HUD、塔面板、WebAudio 合成音效、加速/暂停）
- [x] **阶段六（文档）** 开源文档整理完成：重写 README（自述，含 mermaid 架构图/目录树/徽章/路线图）、新增 CONTRIBUTING / CODE_OF_CONDUCT / CHANGELOG / .github Issue&PR 模板、确认 MIT LICENSE
- [x] **阶段六（git）** 已 `git init`（main 分支）+ 初始提交（31 文件，node_modules/dist 已忽略）
- [ ] **阶段六（推送）** 待用户手动 push 到 `https://github.com/modengsir/game.git`（本机代理限制，见下）

## 目录结构

```
src/
  main.ts                 入口
  config/                 ★ 数据层（社区二开主要改这里）
    gameConfig.ts         全局常量与配色
    towers.ts             塔定义
    enemies.ts            怪物定义
    levels.ts             关卡与波次
  core/                   基础设施
    types.ts  Grid.ts  EventBus.ts  GameState.ts
  entities/               实体
    Enemy.ts  Tower.ts  Projectile.ts
  systems/                系统
    MapRenderer.ts  WaveManager.ts
  ui/                     DOM UI 层
    UIManager.ts  styles.ts
  audio/
    AudioManager.ts       WebAudio 合成音效
  game/
    Game.ts               总控 / 主循环
```

## 下一步（Next）

1. 部署到静态托管，产出可玩链接。
2. （可选增强）多关卡地图、塔连击特效、存档、排行榜。

---

## 阶段六 · 推送网络坑（重要，2026-07-25）

本机（macOS）开着本地代理 `127.0.0.1:57923`（环境变量 HTTP(S)_PROXY）。

- `github.com:443` 被代理判为「直连」→ `502 / 不通`；`api.github.com`、`codeload.github.com` 经代理可达。
- `ssh.github.com:443` 经代理 = `200 Connection Established`（GitHub 的 SSH-over-HTTPS 入口可用）。
- 因此普通 `git push`（https 或 ssh:22）都失败。**两条可用通道**：
  - 方案 A（推荐）：SSH over 443 → 把 `github.com` 在 `~/.ssh/config` 映射为 `ssh.github.com:443` + `ProxyCommand nc -X connect -x 127.0.0.1:57923 %h %p`，remote 用 `git@github.com:modengsir/game.git`。
  - 方案 B：把 `github.com`（及 `*.github.com`）加入代理软件的「代理」规则，再 `git push`（仓库已设 http(s).proxy = 127.0.0.1:57923）。
- 用户选择**手动上传**，模型不代为推送。
- 注：sandbox 内写 `~/.ssh` 被拒（Operation not permitted），用户本机正常。
