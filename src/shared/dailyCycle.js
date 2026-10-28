'use strict';

(function exposeDailyCycle(root, factory) {
  const dateUtils = root && root.RizhiDateUtils
    ? root.RizhiDateUtils
    : (typeof require === 'function' ? require('./dateUtils') : null);
  const taskTimeUtils = root && root.RizhiTaskTimeUtils
    ? root.RizhiTaskTimeUtils
    : (typeof require === 'function' ? require('./taskTimeUtils') : null);
  const api = factory(dateUtils, taskTimeUtils);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.RizhiDailyCycle = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, (dateUtils, taskTimeUtils) => {
  const START_DATE_TIME_MODEL = 'start-date-v1';
  const LOGICAL_DAY_TIME_MODEL = 'logical-day-v1';
  const LEGACY_TIME_MODEL = 'legacy-calendar-v1';
  const AUTO_AFTER_END_STATUS_POLICY = 'auto-after-end';

  function calendarDayWindow(day) {
    const normalizedDay = dateUtils.normalizeStrictDate(day);
    const start = dateUtils.parseLocalDate(normalizedDay, { allowEarlierYears: true });
    if (!start) return null;
    start.setHours(0, 0, 0, 0);
    const end = new Date(start.getTime());
    end.setDate(end.getDate() + 1);
    return { start, end };
  }

  function isContinuousTaskModel(task) {
    return Boolean(task && [START_DATE_TIME_MODEL, LOGICAL_DAY_TIME_MODEL].includes(task.timeModel));
  }

  function taskTimeModel(task) {
    return isContinuousTaskModel(task)
      ? START_DATE_TIME_MODEL
      : LEGACY_TIME_MODEL;
  }

  function taskInterval(task) {
    if (!task || !dateUtils.normalizeStrictDate(task.date)) return null;
    const startMinutes = taskTimeUtils.timeToMinutes(task.startTime);
    const endMinutes = taskTimeUtils.timeToMinutes(task.endTime);
    if (startMinutes === null || endMinutes === null) return null;

    const dayWindow = calendarDayWindow(task.date);
    if (!dayWindow) return null;
    if (taskTimeUtils.isAllDayRange(task.startTime, task.endTime)) return dayWindow;
    if (startMinutes === endMinutes) return null;

    const baseDate = dateUtils.parseLocalDate(task.date, { allowEarlierYears: true });
    const start = instantForClock(baseDate, startMinutes);
    const end = instantForClock(baseDate, endMinutes);
    if (end <= start) end.setDate(end.getDate() + 1);
    return { start, end };
  }

  function instantForClock(baseDate, clockMinutes) {
    const instant = new Date(baseDate.getTime());
    instant.setHours(Math.floor(clockMinutes / 60), clockMinutes % 60, 0, 0);
    return instant;
  }

  function classifyTaskAt(task, value) {
    const interval = taskInterval(task);
    const instant = value instanceof Date ? value : new Date(value);
    if (!interval || Number.isNaN(instant.getTime())) return '';
    if (instant < interval.start) return 'future';
    if (instant >= interval.end) return 'past';
    return 'current';
  }

  function inferredTaskStatus(task, value) {
    const explicitStatus = String(task && task.status || '').trim();
    if (['已完成', '部分完成', '未完成'].includes(explicitStatus)) return explicitStatus;
    if (!task || task.statusPolicy !== AUTO_AFTER_END_STATUS_POLICY) return '未评价';
    return classifyTaskAt(task, value) === 'past' ? '推定完成' : '未评价';
  }

  return {
    AUTO_AFTER_END_STATUS_POLICY,
    LEGACY_TIME_MODEL,
    LOGICAL_DAY_TIME_MODEL,
    START_DATE_TIME_MODEL,
    calendarDayWindow,
    classifyTaskAt,
    inferredTaskStatus,
    isContinuousTaskModel,
    taskInterval,
    taskTimeModel
  };
}));
