const assert = require('assert/strict');
const { parseDailyPlanSheets } = require('../src/parsers/dailyPlanImportParser');

const rowPlan = parseDailyPlanSheets([{
  name: '每日安排',
  rows: [
    ['日期', '开始时间', '结束时间', '任务', '具体内容', '分类'],
    ['2026-10-23', '09:00', '10:30', '写论文', '整理第二章结构', '学习'],
    ['2026-10-24', '14:00', '15:00', '项目会议', '确认下一步', '工作']
  ]
}], { targetDate: '2026-10-23' });

assert.equal(rowPlan.selectedDate, '2026-10-23');
assert.equal(rowPlan.candidates.length, 1);
assert.deepEqual(rowPlan.candidates[0], {
  startTime: '09:00',
  endTime: '10:30',
  title: '写论文',
  details: '整理第二章结构',
  category: '学习',
  date: '2026-10-23',
  sheetName: '每日安排',
  source: 'list'
});

const timetable = parseDailyPlanSheets([{
  name: '课表',
  rows: [
    ['时间', '周一', '周二', '周三', '周四', '周五'],
    ['08:00-09:40', '数学', '英语', '物理', '化学', '写作'],
    ['10:00-11:40', '实验', '', '', '研讨', '']
  ]
}], { targetDate: '2026-10-23' });

assert.equal(timetable.mode, 'timetable');
assert.deepEqual(timetable.candidates.map((item) => ({
  startTime: item.startTime,
  endTime: item.endTime,
  title: item.title
})), [{ startTime: '08:00', endTime: '09:40', title: '写作' }]);

const fallbackDate = parseDailyPlanSheets([{
  name: '安排',
  rows: [
    ['日期', '时间段', '任务'],
    ['2026/10/24', '09:00-10:00', '阅读'],
    ['2026/10/25', '10:00-11:00', '运动']
  ]
}], { targetDate: '2026-10-23' });

assert.equal(fallbackDate.selectedDate, '2026-10-24');
assert.equal(fallbackDate.candidates[0].title, '阅读');

console.log('dailyPlanImportParser tests passed');
