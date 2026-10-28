# Timeline

这里放确定性的时间线整理逻辑。先由本地代码匹配和发现冲突，再把结果交给模型组织语言。

按阶段计划新增：

- `buildDailyTimeline.js`：合并当天任务和媒体事件。
- `matchMediaToTasks.js`：按“用户关联优先、时间匹配其次”关联素材与任务。
- `detectTimelineConflicts.js`：发现重叠、多个候选任务、缺失时间等情况。

时间线模块不得根据媒体注释自动修改任务完成状态，也不得自行判断冲突双方哪一个更真实。
