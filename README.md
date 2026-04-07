# mama-counter

> 含妈量，是衡量一个程序员今天过得好不好的重要指标。

`mama-counter` 会悄悄记录你每天在 Claude Code / Codex / Cursor 里说了多少脏话。睡前跑一下，出「今日骂 AI 报告」。

```
╔═══════════════════════════════════════════════╗
║        今日骂 AI 报告  2026-04-07             ║
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

> *Codex 让你骂得最狠。这不是你的问题，这是工具的问题。*

## 安装

```bash
npm install -g mama-counter
```

## 使用

```bash
mama setup          # 配置 Claude Code hook（只需一次，之后自动采集）
mama report         # 今日骂 AI 报告
mama report --week  # 本周含妈量趋势
mama history        # 近30天记录
```

## 支持的工具

| 工具 | 采集方式 |
|---|---|
| Claude Code | hook 实时采集，运行 `mama setup` 后自动生效 |
| Codex app / CLI | 自动读取 `~/.codex/sessions/` |
| Cursor | 自动读取本地 SQLite 数据库 |

后续想支持其他工具？欢迎贡献 adapter，见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 隐私说明

- 只记录「匹配到了哪些词」，**不存原始提示词**
- 所有数据保存在 `~/.mama-counter/` 本地，不联网，不上传

## 贡献词库

这个工具的灵魂在词库。欢迎 PR：

- 各地方言骂法（粤语、闽南语、东北话、四川话……）
- 新的「今日诊断」文案
- 新的 Agent adapter

见 [CONTRIBUTING.md](CONTRIBUTING.md) 了解贡献方式 🙏

---

<details>
<summary>English README</summary>

# mama-counter

> Track how many times you swear at AI coding agents every day.

`mama-counter` silently records your profanity usage across Claude Code, Codex, and Cursor. Run it before bed for your daily **Scold-AI Report**.

```
╔═══════════════════════════════════════════════╗
║        Today's Scold-AI Report  2026-04-07    ║
╠═══════════════════════════════════════════════╣
║  Claude Code    ████░░░░░░       8             ║
║  Codex          ██████████      23             ║
║  Cursor         ██░░░░░░░░       3             ║
╠═══════════════════════════════════════════════╣
║  Mama Index     ███████░░░      19  🏆         ║
╠═══════════════════════════════════════════════╣
║  Diagnosis: Codex made you the angriest today  ║
╚═══════════════════════════════════════════════╝
```

## Install

```bash
npm install -g mama-counter
```

## Usage

```bash
mama setup          # Configure Claude Code hook (once)
mama report         # Today's report
mama report --week  # 7-day trend
mama history        # 30-day history
```

## Supported Agents

| Agent | Method |
|---|---|
| Claude Code | Real-time via hook (run `mama setup` once) |
| Codex app / CLI | Reads `~/.codex/sessions/` automatically |
| Cursor | Reads local SQLite database automatically |

## Privacy

- Stores matched words only — **never your raw prompts**
- All data lives in `~/.mama-counter/` locally, no network calls

## Contributing

Contributions welcome: dialect swear words, diagnosis messages, new agent adapters.  
See [CONTRIBUTING.md](CONTRIBUTING.md).

</details>
