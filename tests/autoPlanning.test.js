const assert = require('assert/strict');
const {
  datesDueForGeneration,
  nextGenerationAt,
  normalizeAutoPlanning,
  partitionTemplateItemsForDate,
  pruneGeneratedDates,
  templateIdForDate
} = require('../src/shared/autoPlanning');

const config = normalizeAutoPlanning({
  enabled: true,
  generationTime: '21:00',
  weekdayTemplateIds: { 1: 'workday', 2: 'workday', 0: 'sunday', 3: 'missing' },
  generatedDates: {
    '2026-10-25': { templateId: 'sunday', generatedAt: '2026-10-24T21:00:00.000Z' },
    invalid: { templateId: 'workday' }
  }
}, ['workday', 'sunday']);

assert.equal(config.weekdayTemplateIds['1'], 'workday');
assert.equal(config.weekdayTemplateIds['3'], '');
assert.equal(Object.hasOwn(config.generatedDates, 'invalid'), false);
assert.equal(templateIdForDate(config, '2026-10-26'), 'workday');
assert.equal(templateIdForDate(config, '2026-10-25'), 'sunday');
assert.deepEqual(datesDueForGeneration(config, new Date(2026, 9, 26, 20, 59)), ['2026-10-26']);
assert.deepEqual(datesDueForGeneration(config, new Date(2026, 9, 26, 21, 0)), ['2026-10-26', '2026-10-27']);
assert.deepEqual(datesDueForGeneration({ ...config, enabled: false }, new Date(2026, 9, 26, 22, 0)), []);
assert.equal(nextGenerationAt(config, new Date(2026, 9, 26, 20, 0)).getTime(), new Date(2026, 9, 26, 21, 0).getTime());
assert.equal(nextGenerationAt(config, new Date(2026, 9, 26, 21, 0)).getTime(), new Date(2026, 9, 27, 21, 0).getTime());
assert.equal(nextGenerationAt({ ...config, enabled: false }, new Date(2026, 9, 26, 20, 0)), null);
assert.deepEqual(pruneGeneratedDates({
  '2025-01-01': { templateId: 'old' },
  '2026-10-26': { templateId: 'workday' }
}, '2026-10-26', 400), {
  '2026-10-26': { templateId: 'workday' }
});

const existingTasks = [{
  date: '2026-10-27',
  startTime: '23:00',
  endTime: '07:30',
  title: '睡觉',
  planDetails: '早点休息',
  typeId: 'sleep'
}];
const partitioned = partitionTemplateItemsForDate(existingTasks, [{
  startTime: '23:00',
  endTime: '07:30',
  title: '睡觉',
  planDetails: '早点休息',
  typeId: 'sleep'
}, {
  startTime: '23:00',
  endTime: '07:30',
  title: '睡觉',
  planDetails: '睡前阅读',
  typeId: 'sleep'
}, {
  startTime: '09:00',
  endTime: '12:00',
  title: '工作',
  planDetails: '',
  typeId: 'work'
}], '2026-10-27');
assert.equal(partitioned.duplicateItems.length, 1, '完全相同的任务不应重复添加。');
assert.equal(partitioned.missingItems.length, 2, '详情不同或时间内容不同的任务仍应补充。');
assert.equal(partitioned.missingItems[0].planDetails, '睡前阅读');

const sevenTemplateItems = Array.from({ length: 7 }, (_, index) => ({
  startTime: `${String(8 + index).padStart(2, '0')}:00`,
  endTime: `${String(9 + index).padStart(2, '0')}:00`,
  title: `任务 ${index + 1}`,
  planDetails: '',
  typeId: 'work'
}));
const sixExistingTasks = sevenTemplateItems.slice(0, 6).map((item) => ({ ...item, date: '2026-10-27' }));
const sevenItemReuse = partitionTemplateItemsForDate(sixExistingTasks, sevenTemplateItems, '2026-10-27');
assert.equal(sevenItemReuse.duplicateItems.length, 6, '复用模板时应识别已经存在的六条任务。');
assert.equal(sevenItemReuse.missingItems.length, 1, '七条模板任务只缺一条时应只新增一条。');
assert.equal(sevenItemReuse.missingItems[0].title, '任务 7');

console.log('autoPlanning tests passed');
