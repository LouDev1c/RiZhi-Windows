# AI Storage

这里负责 AI 专属配置，不保存日记正文和报告正文。

按阶段计划新增：

- `aiSettingsStore.js`：Provider 模式、Base URL、模型名、超时等非敏感设置。
- `aiSecretStore.js`：使用 Electron `safeStorage` 加密保存 BYOK API Key。

会员令牌由未来的账户模块管理。密钥不得通过 preload 返回渲染进程，界面只能获得“已配置/未配置”等状态。
