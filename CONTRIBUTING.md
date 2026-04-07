# Contributing to mama-counter

## 贡献骂法词库

这个项目最重要的贡献方式就是贡献你的方言骂法。

### 怎么加词

编辑 `wordlist/zh.json` 或 `wordlist/en.json`，找到合适的分类加入：

- `mama`：含"妈"的骂法，会单独统计「含妈量」
- `general`：通用骂法
- `dialect`：方言骂法（粤语、闽南语、东北话、川话……都欢迎）

格式要求：
- 不要重复已有的词
- PR 标题格式：`词库: 新增 XX 方言骂法`

### 贡献诊断文案

在 `src/diagnoses.ts` 的 `getDiagnosis` 函数里加新规则或文案。  
PR 标题格式：`文案: 新增 XX 情景`

欢迎提 PR 加你觉得好笑的段子 😂

### 贡献新的 Agent Adapter

1. 实现 `src/adapters/types.ts` 里的 `AgentAdapter` 接口
2. 放进 `src/adapters/` 目录
3. 在 `src/cli.ts` 的 `ADAPTERS` 数组里注册
4. 附上 `tests/adapters/` 里对应的测试文件
5. PR 标题格式：`adapter: 新增 XX 支持`
