const assert = require('assert/strict');
const {
  datesDueForGeneration,
  normalizeAutoPlanning,
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
assert.deepEqual(pruneGeneratedDates({
  '2025-01-01': { templateId: 'old' },
  '2026-10-26': { templateId: 'workday' }
}, '2026-10-26', 400), {
  '2026-10-26': { templateId: 'workday' }
});

console.log('autoPlanning tests passed');
