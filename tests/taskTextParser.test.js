const assert = require('assert/strict');
const { parseTaskText, parseTaskTextList } = require('../src/parsers/taskTextParser');
const {
  clockDigitsToTime,
  completeClockInput,
  formatClockDisplay,
  formatClockDigits,
  isAllDayRange,
  rangeToComparableIntervals,
  rangesOverlap
} = require('../src/shared/taskTimeUtils');

assert.equal(rangesOverlap(rangeToComparableIntervals('09:00', '10:00'), rangeToComparableIntervals('10:00', '11:00')), false, '相邻任务应允许前一任务结束时间等于后一任务开始时间。');
assert.equal(rangesOverlap(rangeToComparableIntervals('09:00', '10:30'), rangeToComparableIntervals('10:00', '11:00')), true, '真正重叠的任务必须判定为冲突。');
assert.equal(isAllDayRange('00:00', '00:00'), true, '零点到零点应表示全天任务。');
assert.equal(rangesOverlap(rangeToComparableIntervals('00:00', '00:00'), rangeToComparableIntervals('09:00', '10:00')), true, '全天任务应与当天任何有时间的任务冲突。');
assert.equal(completeClockInput(''), '00:00');
assert.equal(completeClockInput('9'), '09:00');
assert.equal(completeClockInput('09'), '09:00');
assert.equal(completeClockInput('930'), '09:30');
assert.equal(completeClockInput('0930'), '09:30');
assert.equal(completeClockInput('2460'), '', '不存在的时间不能提交。');
assert.equal(formatClockDigits('09:30'), '0930');
assert.equal(formatClockDigits('2965'), '2965');
assert.equal(formatClockDisplay('0900'), '09:00');
assert.equal(formatClockDisplay('09:3'), '09:3');
assert.equal(clockDigitsToTime('0930'), '09:30');
assert.equal(clockDigitsToTime('930'), '');
assert.equal(clockDigitsToTime('2400'), '');
assert.equal(clockDigitsToTime('1260'), '');

const allDayTask = parseTaskText('今天 00:00 到 00:00 和 Pipi 一起过节', { referenceDate: '2026-09-26' });
assert.equal(allDayTask.startTime, '00:00');
assert.equal(allDayTask.endTime, '00:00');
assert.deepEqual(allDayTask.warnings, [], '零点到零点的全天安排不应被标记为跨日异常。');

function expectParsed(text, referenceDate, expected) {
  const result = parseTaskText(text, { referenceDate });
  Object.entries(expected).forEach(([key, value]) => {
    assert.deepEqual(result[key], value, `${text} 的 ${key} 不符合预期`);
  });
  return result;
}

expectParsed('明天下午三点到五点写论文，算学习任务', '2026-09-18', {
  date: '2026-09-19',
  startTime: '15:00',
  endTime: '17:00',
  title: '写论文',
  type: '学习',
  missingFields: [],
  warnings: []
});

expectParsed('今天上午九点到十一点上课，课程任务', '2026-09-18', {
  date: '2026-09-18',
  startTime: '09:00',
  endTime: '11:00',
  title: '上课',
  type: '课程',
  missingFields: [],
  warnings: []
});

expectParsed('下周一晚上八点到九点半运动，生活任务', '2026-09-18', {
  date: '2026-09-21',
  startTime: '20:00',
  endTime: '21:30',
  title: '运动',
  type: '生活',
  missingFields: [],
  warnings: []
});

expectParsed('9月20日15:30到17:00开会', '2026-09-18', {
  date: '2026-09-20',
  startTime: '15:30',
  endTime: '17:00',
  title: '开会',
  type: '工作',
  missingFields: [],
  warnings: []
});

const incomplete = expectParsed('明天写论文', '2026-09-18', {
  date: '2026-09-19',
  startTime: '',
  endTime: '',
  title: '写论文',
  type: '学习',
  missingFields: ['startTime', 'endTime'],
  warnings: []
});
assert.ok(incomplete.warnings.length === 0);

const ambiguousTime = parseTaskText('周日三点半到五点读书', { referenceDate: '2026-09-18' });
assert.equal(ambiguousTime.date, '2026-09-20');
assert.equal(ambiguousTime.startTime, '03:30');
assert.equal(ambiguousTime.endTime, '05:00');
assert.equal(ambiguousTime.type, '学习');
assert.ok(ambiguousTime.warnings.includes('时间未说明上午、下午或晚上，已按 24 小时制的凌晨时段解析。'));

expectParsed('后天上午九点到十一点复习', '2026-09-18', {
  date: '2026-09-20',
  startTime: '09:00',
  endTime: '11:00',
  title: '复习',
  type: '学习',
  missingFields: [],
  warnings: []
});

const weekdayDates = ['2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24', '2026-09-18', '2026-09-19', '2026-09-20'];
['一', '二', '三', '四', '五', '六', '日'].forEach((weekday, index) => {
  assert.equal(parseTaskText(`周${weekday}下午三点到五点学习`, { referenceDate: '2026-09-18' }).date, weekdayDates[index]);
});
expectParsed('下周三三点半到五点读书', '2026-09-18', {
  date: '2026-09-23',
  startTime: '03:30',
  endTime: '05:00',
  title: '读书',
  type: '学习',
  missingFields: [],
  warnings: ['时间未说明上午、下午或晚上，已按 24 小时制的凌晨时段解析。']
});

const fullDay = parseTaskTextList(
  '九月十九号。上午零点到一点是半夜的工作，一点到八点是休息，八点到十一点半是上午工作，十一点半到两点是午休。下午两点到下午五点半是下午的工作，下午五点半到七点是晚饭，还有晚上的休息，然后七点到零点是晚上的工作。',
  { referenceDate: '2026-09-18' }
);
assert.equal(fullDay.tasks.length, 7);
assert.deepEqual(fullDay.tasks.map((task) => ({
  date: task.date,
  startTime: task.startTime,
  endTime: task.endTime,
  title: task.title,
  type: task.type
})), [
  { date: '2026-09-19', startTime: '00:00', endTime: '01:00', title: '半夜的工作', type: '工作' },
  { date: '2026-09-19', startTime: '01:00', endTime: '08:00', title: '休息', type: '生活' },
  { date: '2026-09-19', startTime: '08:00', endTime: '11:30', title: '上午工作', type: '工作' },
  { date: '2026-09-19', startTime: '11:30', endTime: '14:00', title: '午休', type: '生活' },
  { date: '2026-09-19', startTime: '14:00', endTime: '17:30', title: '下午的工作', type: '工作' },
  { date: '2026-09-19', startTime: '17:30', endTime: '19:00', title: '晚饭', type: '生活' },
  { date: '2026-09-19', startTime: '19:00', endTime: '00:00', title: '晚上的工作', type: '工作' }
]);
assert.ok(fullDay.tasks[6].warnings.includes('结束时间不晚于开始时间，已按跨日时间段保留，请在确认前检查。'));
assert.equal(fullDay.tasks[5].details, '还有晚上的休息');

const sequencedTasks = parseTaskTextList(
  '下午三点到五点写论文，整理第二章文献，算学习任务。五点到七点开会，讨论项目排期，工作任务。',
  { referenceDate: '2026-09-18' }
);
assert.deepEqual(sequencedTasks.tasks.map((task) => ({
  startTime: task.startTime,
  endTime: task.endTime,
  title: task.title,
  details: task.details,
  type: task.type
})), [
  { startTime: '15:00', endTime: '17:00', title: '写论文', details: '整理第二章文献', type: '学习' },
  { startTime: '17:00', endTime: '19:00', title: '开会', details: '讨论项目排期', type: '工作' }
]);

const midnightRegression = parseTaskTextList(
  '零点到一点，晚上工作；一点到八点，睡觉；八点到十一点半，上午工作；十一点半到两点，午休；下午两点到五点半，下午工作；五点半到七点，晚饭；七点到零点，晚上工作。',
  { referenceDate: '2026-09-18' }
);
assert.deepEqual(midnightRegression.tasks.map((task) => `${task.startTime}-${task.endTime}`), ['00:00-01:00', '01:00-08:00', '08:00-11:30', '11:30-14:00', '14:00-17:30', '17:30-19:00', '19:00-00:00']);
const dailyDuration = (task) => { const start = Number(task.startTime.slice(0, 2)) * 60 + Number(task.startTime.slice(3)); const end = Number(task.endTime.slice(0, 2)) * 60 + Number(task.endTime.slice(3)); return (end <= start ? end + 1440 : end) - start; };
assert.ok(midnightRegression.tasks.reduce((total, task) => total + dailyDuration(task), 0) <= 1440, '一天内连续任务的总时长不应超过 24 小时。');

const customCategory = parseTaskTextList(
  '上午九点到十点慢跑，公园五公里，类型：运动。',
  { referenceDate: '2026-09-18', taskCategories: ['深度工作', '运动'] }
);
assert.equal(customCategory.tasks[0].type, '运动');

console.log('taskTextParser tests passed');
