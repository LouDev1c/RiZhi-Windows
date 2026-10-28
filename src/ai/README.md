# AI 模块边界

`src/ai` 是日织的 AI 业务层，负责“要完成什么”，不直接承担页面渲染、原始文件存储或厂商专属网络细节。

计划中的调用方向：

```text
renderer UI
  -> preload 白名单接口
  -> main IPC
  -> AI feature
  -> context / timeline / prompt / validation
  -> model provider
```

约束：

- API Key、会员令牌和模型网络请求只能存在于主进程侧。
- 图片和视频默认不发送给模型；V1 使用用户填写的结构化媒体注释。
- 任务数量、完成率和计划时长由本地代码计算，模型不负责重新统计。
- AI 结果先进入可编辑预览，未经确认不得覆盖日记或报告。
- 记录页仅提供润色、续写和素材成文；周期总结统一属于统计页。
- 新增业务文件前，先在 `contracts.js` 中确认跨层名称，避免 IPC、页面和服务层各用一套字符串。

子目录职责见各目录中的 README。完整实施与验收步骤见 `docs/AI功能实现指南_Version1.md`。
