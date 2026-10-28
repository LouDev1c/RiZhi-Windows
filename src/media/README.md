# 媒体领域模块

媒体注释属于日织基础数据，不属于 AI 专属数据。即使用户没有启用 AI，事件时间、事件描述和关联任务仍应可以查看和编辑。

计划在数据结构阶段新增：

- `mediaAnnotation.js`：兼容旧字符串注释并规范化结构化时间线字段。
- `mediaAnnotationValidation.js`：校验时间、任务引用和 AI 使用开关。

V1 建议在现有媒体条目上保留 `annotation` 文本，并增加：

```js
timeline: {
  eventTime: '15:30',
  eventTitle: '讨论实验方案',
  relatedTaskId: 'task-123',
  includeInAi: true
}
```

旧媒体没有 `timeline` 时必须继续正常加载和显示。
