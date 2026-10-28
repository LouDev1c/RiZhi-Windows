'use strict';

/**
 * AI 功能跨主进程、preload 和渲染进程使用的稳定名称。
 *
 * 这个文件只定义协议，不执行网络请求，也不包含提示词或密钥。
 * 后续阶段应优先扩展这里的契约，再实现对应业务，避免界面直接依赖模型厂商。
 */

const AI_CONTRACT_VERSION = 1;

const JOURNAL_AI_ACTIONS = Object.freeze({
  POLISH: 'polish',
  CONTINUE: 'continue',
  COMPOSE: 'compose'
});

const REPORT_PERIOD_TYPES = Object.freeze({
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year'
});

const AI_PROVIDER_MODES = Object.freeze({
  MANAGED: 'managed',
  BYOK: 'byok'
});

const AI_REQUEST_STATES = Object.freeze({
  IDLE: 'idle',
  RUNNING: 'running',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELED: 'canceled'
});

const AI_ERROR_CODES = Object.freeze({
  INVALID_REQUEST: 'invalid_request',
  NOT_CONFIGURED: 'not_configured',
  AUTHENTICATION_FAILED: 'authentication_failed',
  MEMBERSHIP_REQUIRED: 'membership_required',
  QUOTA_EXCEEDED: 'quota_exceeded',
  RATE_LIMITED: 'rate_limited',
  TIMEOUT: 'timeout',
  NETWORK_ERROR: 'network_error',
  INVALID_RESPONSE: 'invalid_response',
  CANCELED: 'canceled',
  UNKNOWN: 'unknown'
});

function enumValues(enumObject) {
  return Object.values(enumObject);
}

function isJournalAiAction(value) {
  return enumValues(JOURNAL_AI_ACTIONS).includes(value);
}

function isReportPeriodType(value) {
  return enumValues(REPORT_PERIOD_TYPES).includes(value);
}

function isAiProviderMode(value) {
  return enumValues(AI_PROVIDER_MODES).includes(value);
}

module.exports = {
  AI_CONTRACT_VERSION,
  JOURNAL_AI_ACTIONS,
  REPORT_PERIOD_TYPES,
  AI_PROVIDER_MODES,
  AI_REQUEST_STATES,
  AI_ERROR_CODES,
  isJournalAiAction,
  isReportPeriodType,
  isAiProviderMode
};
