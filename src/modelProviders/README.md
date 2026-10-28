# Model Providers

这里放模型服务适配器，负责“怎样调用模型”，不负责日记或报告业务。

计划实现：

- `providerRegistry.js`：按 `managed` / `byok` 选择 Provider。
- `openAiCompatibleProvider.js`：用户自备 API，支持可配置 Base URL 和模型名。
- `managedProvider.js`：调用日织服务端，不在客户端内置模型厂商密钥。
- `providerErrors.js`：把厂商错误转换为统一错误码。

Provider 的统一能力至少包括：配置检查、连接测试、生成、取消和超时。流式输出不是首个里程碑的必要条件。
