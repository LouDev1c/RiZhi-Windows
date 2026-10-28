const assert = require('assert');

const {
  AI_CONTRACT_VERSION,
  JOURNAL_AI_ACTIONS,
  REPORT_PERIOD_TYPES,
  AI_PROVIDER_MODES,
  isJournalAiAction,
  isReportPeriodType,
  isAiProviderMode
} = require('../src/ai');

assert.strictEqual(AI_CONTRACT_VERSION, 1);

assert.deepStrictEqual(Object.values(JOURNAL_AI_ACTIONS), ['polish', 'continue', 'compose']);
assert.strictEqual(isJournalAiAction('polish'), true);
assert.strictEqual(isJournalAiAction('summarize'), false);

assert.deepStrictEqual(Object.values(REPORT_PERIOD_TYPES), ['day', 'week', 'month', 'quarter', 'year']);
assert.strictEqual(isReportPeriodType('quarter'), true);
assert.strictEqual(isReportPeriodType('daily'), false);

assert.deepStrictEqual(Object.values(AI_PROVIDER_MODES), ['managed', 'byok']);
assert.strictEqual(isAiProviderMode('managed'), true);
assert.strictEqual(isAiProviderMode('custom'), false);

console.log('AI contract tests passed.');
