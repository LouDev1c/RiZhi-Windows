# Features

这里放面向产品用例的编排代码，不放 DOM 操作。

按阶段计划新增：

- `journalPolisher.js`：在不改变事实的前提下润色已有日记。
- `journalContinuation.js`：结合已有正文和已确认上下文续写。
- `journalComposer.js`：根据任务和媒体注释时间线生成日记草稿。
- `periodicReportGenerator.js`：生成日、周、月、季、年报。

每个 feature 只依赖标准化上下文和统一 Provider 接口，不识别具体模型厂商。
