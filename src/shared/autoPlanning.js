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
        generatedAt: String(record.generatedAt || '').trim(),
        addedCount: nonNegativeInteger(record.addedCount),
        duplicateCount: nonNegativeInteger(record.duplicateCount),
        existingTaskCount: nonNegativeInteger(record.existingTaskCount)
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

  function nextGenerationAt(config, value) {
    if (!config || !config.enabled) return null;
    const now = value instanceof Date ? new Date(value.getTime()) : new Date(value);
    if (Number.isNaN(now.getTime())) return null;
    const generationMinutes = taskTimeUtils.timeToMinutes(normalizeGenerationTime(config.generationTime));
    const next = new Date(now.getTime());
    next.setHours(Math.floor(generationMinutes / 60), generationMinutes % 60, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    return next;
  }

  function partitionTemplateItemsForDate(existingTasks, templateItems, date) {
    const seen = new Set((Array.isArray(existingTasks) ? existingTasks : [])
      .map((task) => planItemIdentity(task, date))
      .filter(Boolean));
    const missingItems = [];
    const duplicateItems = [];

    (Array.isArray(templateItems) ? templateItems : []).forEach((item) => {
      const identity = planItemIdentity(item, date);
      if (!identity || seen.has(identity)) {
        duplicateItems.push(item);
        return;
      }
      seen.add(identity);
      missingItems.push(item);
    });

    return { missingItems, duplicateItems };
  }

  function planItemIdentity(value, date) {
    if (!value || typeof value !== 'object') return '';
    const normalizedDate = dateUtils.normalizeStrictDate(date || value.date);
    const startMinutes = taskTimeUtils.timeToMinutes(value.startTime);
    const endMinutes = taskTimeUtils.timeToMinutes(value.endTime);
    const title = comparableText(value.title);
    if (!normalizedDate || startMinutes === null || endMinutes === null || !title) return '';
    return [
      normalizedDate,
      startMinutes,
      endMinutes,
      title,
      comparableText(value.planDetails),
      comparableText(value.typeId || value.type)
    ].join('|');
  }

  function comparableText(value) {
    return String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
  }

  function nonNegativeInteger(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
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
    nextGenerationAt,
    normalizeAutoPlanning,
    normalizeGenerationTime,
    partitionTemplateItemsForDate,
    planItemIdentity,
    pruneGeneratedDates,
    templateIdForDate
  };
}));
