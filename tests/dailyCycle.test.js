const assert = require('assert');
const {
  AUTO_AFTER_END_STATUS_POLICY,
  LOGICAL_DAY_TIME_MODEL,
  START_DATE_TIME_MODEL,
  calendarDayWindow,
  classifyTaskAt,
  inferredTaskStatus,
  isContinuousTaskModel,
  taskInterval,
  taskTimeModel
} = require('../src/shared/dailyCycle');

function localInstant(year, month, day, hour, minute) {
  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

const window = calendarDayWindow('2026-10-26');
assert.equal(window.start.getTime(), localInstant(2026, 10, 26, 0, 0).getTime());
assert.equal(window.end.getTime(), localInstant(2026, 10, 27, 0, 0).getTime());

const logicalCrossMidnightTask = {
  date: '2026-10-26',
  startTime: '23:00',
  endTime: '01:30',
  timeModel: START_DATE_TIME_MODEL,
  status: '未评价',
  statusPolicy: AUTO_AFTER_END_STATUS_POLICY
};
const logicalInterval = taskInterval(logicalCrossMidnightTask);
assert.equal(logicalInterval.start.getTime(), localInstant(2026, 10, 26, 23, 0).getTime());
assert.equal(logicalInterval.end.getTime(), localInstant(2026, 10, 27, 1, 30).getTime());
assert.equal(classifyTaskAt(logicalCrossMidnightTask, localInstant(2026, 10, 27, 0, 30)), 'current');
assert.equal(inferredTaskStatus(logicalCrossMidnightTask, localInstant(2026, 10, 27, 1, 31)), '推定完成');
assert.equal(isContinuousTaskModel(logicalCrossMidnightTask), true);

const compatibilityTask = { ...logicalCrossMidnightTask, timeModel: LOGICAL_DAY_TIME_MODEL };
assert.equal(taskTimeModel(compatibilityTask), START_DATE_TIME_MODEL);
assert.equal(taskInterval(compatibilityTask).end.getTime(), localInstant(2026, 10, 27, 1, 30).getTime());

const legacyTask = {
  date: '2026-10-27',
  startTime: '00:00',
  endTime: '01:30',
  status: '未评价'
};
const legacyInterval = taskInterval(legacyTask);
assert.equal(taskTimeModel(legacyTask), 'legacy-calendar-v1');
assert.equal(legacyInterval.start.getTime(), localInstant(2026, 10, 27, 0, 0).getTime());
assert.equal(legacyInterval.end.getTime(), localInstant(2026, 10, 27, 1, 30).getTime());
assert.equal(inferredTaskStatus(legacyTask, localInstant(2026, 10, 28, 0, 0)), '未评价');

const explicitlyMissedTask = { ...logicalCrossMidnightTask, status: '未完成' };
assert.equal(inferredTaskStatus(explicitlyMissedTask, localInstant(2026, 10, 27, 2, 0)), '未完成');

console.log('dailyCycle tests passed');
