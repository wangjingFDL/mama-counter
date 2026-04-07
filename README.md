# cursetrack

> 你今天骂了多少次 AI？

统计你每天在 Claude Code / Codex / Cursor 对话里用了多少脏话，睡前跑一下，出「今日骂 AI 报告」。

```
╔═══════════════════════════════════════════════╗
║  今日骂 AI 报告  2026-04-07                   ║
╠═══════════════════════════════════════════════╣
║  Claude Code    ████░░░░░░       8 句          ║
║  Codex          ██████████      23 句          ║
║  Cursor         ██░░░░░░░░       3 句          ║
╠═══════════════════════════════════════════════╣
║  今日含妈量     ███████░░░      19 次  🏆      ║
╠═══════════════════════════════════════════════╣
║  今日诊断：Codex 让你骂得最狠，建议换个工具冷静一下  ║
╚═══════════════════════════════════════════════╝
```

## 安装

```bash
npm install -g cursetrack
```

## 使用

```bash
cursetrack setup          # 配置 Claude Code hook（只需一次）
cursetrack report         # 今日骂 AI 报告
cursetrack report --week  # 本周趋势
cursetrack history        # 近30天记录
```

## 支持的 Agent

| Agent | 采集方式 |
|---|---|
| Claude Code | 自动（hook 实时采集，运行 `setup` 后生效） |
| Codex app / CLI | 自动读取 `~/.codex/sessions/` |
| Cursor | 自动读取本地 SQLite |

## 隐私

只存分析结果（匹配到的词），**不存原始提示词**。所有数据在 `~/.cursetrack/` 本地，不上传任何东西。

## 贡献词库

见 [CONTRIBUTING.md](CONTRIBUTING.md)。

欢迎 PR 贡献你们方言的骂法、新的诊断文案、新的 Agent adapter 🙏
