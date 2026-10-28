'use strict';

(function exposeAutoPlanning(root, factory) {
  const dateUtils = root && root.RizhiDateUtils
    ? root.RizhiDateUtils
    : (typeof require === 'function' ? require('./dateUtils') : null);
  const taskTimeUtils = root && root.RizhiTaskTimeUtils
    ? root.RizhiTaskTimeUtils
    : (typeof require === 'function' ? require('./taskTimeUtils') : null);
  const api = factory(dateUtils, taskTimeUtils);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.RizhiAutoPlanning = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, (dateUtils, taskTimeUtils) => {
  const DEFAULT_GENERATION_TIME = '21:00';
  const WEEKDAY_KEYS = ['1', '2', '3', '4', '5', '6', '0'];

  function normalizeGenerationTime(value) {
    const minutes = taskTimeUtils.timeToMinutes(value);
    if (minutes === null) return DEFAULT_GENERATION_TIME;
    return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  }

  function normalizeAutoPlanning(value, validTemplateIds = []) {
    const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    const allowedIds = new Set(validTemplateIds.map(String));
    const weekdayTemplateIds = {};
    WEEKDAY_KEYS.forEach((key) => {
      const templateId = String(source.weekdayTemplateIds && source.weekdayTemplateIds[key] || '').trim();
      weekdayTemplateIds[key] = allowedIds.has(templateId) ? templateId : '';
    });

    const generatedDates = {};
    Object.entries(source.generatedDates || {}).forEach(([date, record]) => {
      const normalizedDate = dateUtils.normalizeStrictDate(date);
      if (!normalizedDate || !record || typeof record !== 'object') return;
      generatedDates[normalizedDate] = {
        templateId: String(record.templateId || '').trim(),
        generatedAt: String(record.generatedAt || '').trim()
      };
    });

    return {
      enabled: Boolean(source.enabled),
      generationTime: normalizeGenerationTime(source.generationTime),
      weekdayTemplateIds,
      generatedDates
    };
  }

  function templateIdForDate(config, date) {
    const parsed = dateUtils.parseLocalDate(date);
    if (!parsed) return '';
    return String(config && config.weekdayTemplateIds && config.weekdayTemplateIds[String(parsed.getDay())] || '').trim();
  }

  function datesDueForGeneration(config, value) {
    if (!config || !config.enabled) return [];
    const now = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(now.getTime())) return [];
    const today = dateUtils.formatLocalDate(now);
    const dates = [today];
    const generationMinutes = taskTimeUtils.timeToMinutes(normalizeGenerationTime(config.generationTime));
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    if (currentMinutes >= generationMinutes) dates.push(dateUtils.shiftDate(today, 1));
    return dates;
  }

  function pruneGeneratedDates(generatedDates, referenceDate, keepDays = 400) {
    const threshold = dateUtils.shiftDate(referenceDate, -Math.max(1, Number(keepDays) || 400));
    return Object.fromEntries(Object.entries(generatedDates || {}).filter(([date]) => (
      dateUtils.normalizeStrictDate(date) && (!threshold || date >= threshold)
    )));
  }

  return {
    DEFAULT_GENERATION_TIME,
    WEEKDAY_KEYS,
    datesDueForGeneration,
    normalizeAutoPlanning,
    normalizeGenerationTime,
    pruneGeneratedDates,
    templateIdForDate
  };
}));
