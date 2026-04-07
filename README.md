<div align="center">

# 含妈量 CLI

`mama-counter`

</div>

**含妈量**（Maternal Profanity Index，MPI）是衡量开发者当日心理健康状况的核心量化指标之一。

`mama-counter` 是一款面向 AI 辅助编程场景的情绪遥测工具，支持对 Claude Code、Codex、Cursor 等主流 coding agent 的对话数据进行实时采集与多维度分析，并于每日工作结束后生成标准化的骂 AI 报告。

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

## 指标说明

**含妈量（MPI）** 定义为：单日对话输入中，含有"妈"字相关骂法的句次总数。

MPI 是总脏话数的重要子集，因其高度稳定的文化显著性，在各方言区均具备良好的跨地域可比性。当日 MPI 占总骂量比例超过 50% 时，系统将自动触发高含妈量预警。

| MPI 范围 | 参考解读 |
|---|---|
| 0 | 今日状态良好，或尚未开始工作 |
| 1–10 | 正常波动范围，无需干预 |
| 11–30 | 建议在键盘旁放一杯茶 |
| 30+ | 今天的 bug 大概率不是你的问题 |

## 安装

```bash
npm install -g mama-counter
```

## 使用

```bash
mama setup          # 初始化数据采集（首次运行，配置 Claude Code hook）
mama report         # 生成今日报告
mama report --week  # 查看本周 MPI 趋势
mama history        # 查看近30日历史数据
```

## 数据采集方式

| 工具 | 采集机制 | 触发时机 |
|---|---|---|
| Claude Code | UserPromptSubmit hook，写入本地日志 | 实时 |
| Codex app / CLI | 读取 `~/.codex/sessions/` | 生成报告时 |
| Cursor | 读取本地 SQLite 数据库 | 生成报告时 |

欢迎贡献新的 adapter 以支持更多工具，详见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 隐私

本工具仅记录命中词列表，**不存储原始对话内容**。所有数据写入本地 `~/.mama-counter/`，无任何网络请求。

## 参与贡献

词库质量直接影响 MPI 的测量精度。目前收录了普通话、部分英语骂法，**强烈欢迎**提交各地方言词汇（粤语、闽南语、东北话、四川话等）。

同样欢迎贡献：今日诊断文案、新的 agent adapter。

详见 [CONTRIBUTING.md](CONTRIBUTING.md)。

---

<details>
<summary>English README</summary>

# mama-counter

The **Maternal Profanity Index (MPI)** is a key quantitative indicator of developer psychological wellbeing.

`mama-counter` is an emotion telemetry tool for AI-assisted development. It collects and analyzes conversational data from Claude Code, Codex, and Cursor in real time, generating a standardized daily Scold-AI Report at the end of each working session.

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

## Metric Definition

The **Maternal Profanity Index (MPI)** is defined as the total number of "mama"-variant profanities detected in a developer's daily AI prompts.

MPI is a culturally stable sub-metric of total profanity count, with strong cross-regional comparability across Chinese dialect groups. When MPI exceeds 50% of total profanity count, the system automatically flags a high-MPI alert.

## Install

```bash
npm install -g mama-counter
```

## Usage

```bash
mama setup          # Initialize data collection (first run only)
mama report         # Generate today's report
mama report --week  # View weekly MPI trend
mama history        # View 30-day historical data
```

## Data Collection

| Agent | Mechanism | Timing |
|---|---|---|
| Claude Code | UserPromptSubmit hook → local log | Real-time |
| Codex app / CLI | Reads `~/.codex/sessions/` | At report time |
| Cursor | Reads local SQLite database | At report time |

## Privacy

Stores matched word lists only — **never raw prompt content**. All data is written to local `~/.mama-counter/`. No network requests of any kind.

## Contributing

Word library quality directly affects MPI measurement accuracy. Contributions of dialect-specific profanity (Cantonese, Hokkien, Northeastern Mandarin, Sichuan dialect, etc.) are strongly encouraged.

See [CONTRIBUTING.md](CONTRIBUTING.md).

</details>
