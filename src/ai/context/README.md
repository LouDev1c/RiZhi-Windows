# Context

这里负责从日织本地数据构建“最小必要上下文”。

按阶段计划新增：

- `buildJournalContext.js`：已有正文、日期、任务状态和用户选择的素材。
- `buildDailyTimelineContext.js`：已标准化的当日事件、冲突和未定时事件。
- `buildReportContext.js`：周期内的本地统计结果、日记、任务备注和事件摘要。

上下文构建必须过滤文件路径、密钥等无关信息，并记录本次实际使用的数据类型，供结果预览和隐私说明展示。
