# Validation

这里验证传入 AI 层的请求和模型返回结果。

按阶段计划新增：

- `validateJournalRequest.js`
- `validateReportRequest.js`
- `validateModelResponse.js`

校验失败应转换为 `contracts.js` 中定义的稳定错误码，界面不直接显示厂商返回的原始错误体。
