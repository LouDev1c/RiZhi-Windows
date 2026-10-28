const fs = require('fs/promises');
const path = require('path');
const { parseDelimitedText } = require('./scheduleParser');

const DATE_HEADER = /日期|date|day|星期|周次|week/i;
const START_HEADER = /开始|起始|start/i;
const END_HEADER = /结束|终止|end/i;
const TIME_HEADER = /时间段|时段|时间|time/i;
const TITLE_HEADER = /任务|事项|安排|课程|名称|项目|内容|task|title|subject|course/i;
const DETAIL_HEADER = /具体内容|详情|备注|说明|计划|plan|detail|note/i;
const CATEGORY_HEADER = /分类|类型|类别|标签|type|category/i;

async function parseDailyPlanImport(filePath, options = {}) {
  const sheets = await readSheets(filePath);
  const targetDate = normalizeDate(options.targetDate) || '';
  const candidates = sheets.flatMap((sheet) => parseSheet(sheet.rows, {
    sheetName: sheet.name,
    targetDate,
    fallbackYear: targetDate ? Number(targetDate.slice(0, 4)) : new Date().getFullYear()
  }));
  const uniqueCandidates = dedupeCandidates(candidates);
  const selection = selectCandidatesForTarget(uniqueCandidates, targetDate);
  return {
    status: 'ok',
    mode: selection.mode,
    candidates: selection.candidates,
    selectedDate: selection.selectedDate,
    availableDates: [...new Set(uniqueCandidates.map((item) => item.date).filter(Boolean))].sort(),
    sheetCount: sheets.length,
    message: buildMessage(selection, targetDate)
  };
}

async function readSheets(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.csv' || ext === '.tsv') {
    const text = await fs.readFile(filePath, 'utf8');
    return [{ name: path.basename(filePath), rows: parseDelimitedText(text, ext === '.tsv' ? '\t' : ',') }];
  }
  if (ext !== '.xlsx' && ext !== '.xls') {
    throw new Error('暂不支持该文件类型，请选择 xlsx、xls、csv 或 tsv 表格文件。');
  }
  let XLSX;
  try {
    XLSX = require('xlsx');
  } catch (error) {
    throw new Error('解析 Excel 需要安装 xlsx 依赖。');
  }
  const workbook = XLSX.readFile(filePath, { cellDates: false });
  return workbook.SheetNames.map((name) => {
    const sheet = workbook.Sheets[name];
    fillMergedCells(XLSX, sheet);
    return { name, rows: XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) };
  });
}

function fillMergedCells(XLSX, sheet) {
  (sheet['!merges'] || []).forEach((range) => {
    const source = sheet[XLSX.utils.encode_cell(range.s)];
    if (!source) return;
    for (let row = range.s.r; row <= range.e.r; row += 1) {
      for (let col = range.s.c; col <= range.e.c; col += 1) {
        const address = XLSX.utils.encode_cell({ r: row, c: col });
        if (!sheet[address]) sheet[address] = { ...source };
      }
    }
  });
}

function parseSheet(rawRows, context) {
  const rows = normalizeRows(rawRows);
  if (!rows.length) return [];
  const listTasks = parseLabeledList(rows, context);
  if (listTasks.length) return listTasks;
  const horizontalTasks = parseHorizontalGrid(rows, context);
  if (horizontalTasks.length) return horizontalTasks;
  const verticalTasks = parseVerticalGrid(rows, context);
  if (verticalTasks.length) return verticalTasks;
  return parseLooseRows(rows, context);
}

function normalizeRows(rows) {
  return rows
    .map((row) => (Array.isArray(row) ? row : []).map((cell) => String(cell ?? '').replace(/\r?\n+/g, ' ').trim()))
    .filter((row) => row.some(Boolean));
}

function parseLabeledList(rows, context) {
  const headerIndex = rows.slice(0, 12).findIndex((row) => {
    const labels = row.map(normalizeLabel);
    const hasTime = labels.some((label) => START_HEADER.test(label)) && labels.some((label) => END_HEADER.test(label))
      || labels.some((label) => TIME_HEADER.test(label));
    return hasTime && labels.some((label) => TITLE_HEADER.test(label));
  });
  if (headerIndex < 0) return [];
  const columns = mapColumns(rows[headerIndex]);
  const result = [];
  rows.slice(headerIndex + 1).forEach((row) => {
    const range = extractRange(cellAt(row, columns.time) || row.join(' '));
    const startTime = normalizeClock(cellAt(row, columns.start)) || range?.startTime || '';
    const endTime = normalizeClock(cellAt(row, columns.end)) || range?.endTime || '';
    const date = extractDate(cellAt(row, columns.date) || row.join(' '), context.fallbackYear);
    const title = cleanTitle(cellAt(row, columns.title) || firstUsableTitleCell(row, columns), startTime, endTime);
    if (!startTime || !endTime || !title) return;
    result.push(createCandidate({
      startTime, endTime, title, date,
      details: cellAt(row, columns.details),
      category: cellAt(row, columns.category),
      sheetName: context.sheetName,
      source: 'list'
    }));
  });
  return result;
}

function mapColumns(header) {
  return header.reduce((columns, cell, index) => {
    const label = normalizeLabel(cell);
    if (columns.date === undefined && DATE_HEADER.test(label)) columns.date = index;
    if (columns.start === undefined && START_HEADER.test(label)) columns.start = index;
    if (columns.end === undefined && END_HEADER.test(label)) columns.end = index;
    if (columns.time === undefined && TIME_HEADER.test(label)) columns.time = index;
    if (columns.details === undefined && DETAIL_HEADER.test(label)) columns.details = index;
    if (columns.category === undefined && CATEGORY_HEADER.test(label)) columns.category = index;
    if (columns.title === undefined && TITLE_HEADER.test(label) && !DETAIL_HEADER.test(label)) columns.title = index;
    return columns;
  }, {});
}

function parseHorizontalGrid(rows, context) {
  const headerIndex = rows.slice(0, 16).findIndex((row) => dateHeaderCount(row, context.fallbackYear) >= 2);
  if (headerIndex < 0) return [];
  const header = rows[headerIndex];
  const dateColumns = header
    .map((cell, index) => ({ index, marker: parseDateMarker(cell, context.fallbackYear) }))
    .filter((item) => item.marker);
  const matchingColumns = matchingDateColumns(dateColumns, context.targetDate);
  if (!matchingColumns.length) return [];
  const timeColumn = findTimeColumn(header, dateColumns);
  const result = [];
  rows.slice(headerIndex + 1).forEach((row) => {
    const range = extractRange(cellAt(row, timeColumn));
    if (!range) return;
    matchingColumns.forEach(({ index, marker }) => {
      const title = cleanTitle(cellAt(row, index), range.startTime, range.endTime);
      if (!title) return;
      result.push(createCandidate({
        ...range, title, date: marker.date || context.targetDate,
        sheetName: context.sheetName, source: 'timetable'
      }));
    });
  });
  return result;
}

function parseVerticalGrid(rows, context) {
  const timeHeaderIndex = rows.slice(0, 16).findIndex((row) => row.filter((cell) => Boolean(extractRange(cell))).length >= 2);
  if (timeHeaderIndex < 0) return [];
  const dateColumn = findDateColumn(rows, context.fallbackYear);
  if (dateColumn < 0) return [];
  const timeColumns = rows[timeHeaderIndex]
    .map((cell, index) => ({ index, range: extractRange(cell) }))
    .filter((item) => item.range);
  const result = [];
  rows.slice(timeHeaderIndex + 1).forEach((row) => {
    const marker = parseDateMarker(cellAt(row, dateColumn), context.fallbackYear);
    if (!marker || !markerMatchesTarget(marker, context.targetDate)) return;
    timeColumns.forEach(({ index, range }) => {
      const title = cleanTitle(cellAt(row, index), range.startTime, range.endTime);
      if (!title) return;
      result.push(createCandidate({
        ...range, title, date: marker.date || context.targetDate,
        sheetName: context.sheetName, source: 'timetable'
      }));
    });
  });
  return result;
}

function parseLooseRows(rows, context) {
  const result = [];
  rows.forEach((row) => {
    const raw = row.join(' ');
    const range = extractRange(raw);
    if (!range) return;
    const date = extractDate(raw, context.fallbackYear);
    const title = cleanTitle(row.filter((cell) => !extractRange(cell) && !extractDate(cell, context.fallbackYear)).join(' '), range.startTime, range.endTime);
    if (!title) return;
    result.push(createCandidate({ ...range, title, date, sheetName: context.sheetName, source: 'row' }));
  });
  return result;
}

function selectCandidatesForTarget(candidates, targetDate) {
  if (!candidates.length) return { candidates: [], selectedDate: '', mode: 'empty' };
  const dated = candidates.filter((item) => item.date);
  if (!targetDate || !dated.length) return { candidates, selectedDate: targetDate, mode: candidates[0].source || 'plan' };
  const matching = candidates.filter((item) => !item.date || item.date === targetDate);
  if (matching.some((item) => item.date === targetDate)) {
    return { candidates: matching, selectedDate: targetDate, mode: matching[0].source || 'plan' };
  }
  const selectedDate = [...new Set(dated.map((item) => item.date))].sort()[0];
  return {
    candidates: candidates.filter((item) => !item.date || item.date === selectedDate),
    selectedDate,
    mode: candidates[0].source || 'plan'
  };
}

function matchingDateColumns(dateColumns, targetDate) {
  if (!targetDate) return dateColumns;
  return dateColumns.filter(({ marker }) => markerMatchesTarget(marker, targetDate));
}

function findTimeColumn(header, dateColumns) {
  const explicit = header.findIndex((cell) => /时间|时段|节次|课节|time/i.test(String(cell)));
  if (explicit >= 0) return explicit;
  return Math.max(0, Math.min(...dateColumns.map((item) => item.index)) - 1);
}

function findDateColumn(rows, fallbackYear) {
  const width = Math.max(...rows.map((row) => row.length), 0);
  let bestIndex = -1;
  let bestCount = 0;
  for (let index = 0; index < width; index += 1) {
    const count = rows.filter((row) => Boolean(parseDateMarker(cellAt(row, index), fallbackYear))).length;
    if (count > bestCount) {
      bestIndex = index;
      bestCount = count;
    }
  }
  return bestCount >= 2 ? bestIndex : -1;
}

function dateHeaderCount(row, fallbackYear) {
  return row.filter((cell) => Boolean(parseDateMarker(cell, fallbackYear))).length;
}

function parseDateMarker(value, fallbackYear) {
  const text = String(value || '').trim();
  const date = extractDate(text, fallbackYear);
  const weekday = extractWeekday(text);
  if (!date && weekday === null) return null;
  return { date, weekday };
}

function markerMatchesTarget(marker, targetDate) {
  if (!targetDate) return true;
  if (marker.date) return marker.date === targetDate;
  return marker.weekday === weekdayIndex(targetDate);
}

function extractDate(value, fallbackYear) {
  const text = String(value || '').trim();
  const full = text.match(/(20\d{2})\s*[-/.年]\s*(\d{1,2})\s*[-/.月]\s*(\d{1,2})\s*日?/);
  if (full) return formatDate(Number(full[1]), Number(full[2]), Number(full[3]));
  const short = text.match(/(?:^|[^\d])(\d{1,2})\s*[-/.月]\s*(\d{1,2})\s*日?(?:$|[^\d])/);
  if (short && fallbackYear) return formatDate(fallbackYear, Number(short[1]), Number(short[2]));
  return '';
}

function normalizeDate(value) {
  return extractDate(value, 0);
}

function extractWeekday(value) {
  const match = String(value || '').match(/(?:星期|周)\s*([一二三四五六日天])/);
  if (!match) return null;
  return ({ 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 日: 0, 天: 0 })[match[1]];
}

function weekdayIndex(date) {
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.getDay();
}

function formatDate(year, month, day) {
  if (month < 1 || month > 12 || day < 1 || day > 31) return '';
  const value = new Date(year, month - 1, day);
  if (value.getFullYear() !== year || value.getMonth() !== month - 1 || value.getDate() !== day) return '';
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function extractRange(value) {
  const text = String(value || '').replace(/：/g, ':');
  const matched = text.match(/(\d{1,2})\s*:\s*(\d{2})\s*(?:[-~至到—–])\s*(\d{1,2})\s*:\s*(\d{2})/);
  if (!matched) return null;
  const startTime = formatClock(matched[1], matched[2]);
  const endTime = formatClock(matched[3], matched[4]);
  return startTime && endTime ? { startTime, endTime } : null;
}

function normalizeClock(value) {
  const match = String(value || '').trim().replace(/：/g, ':').match(/^(\d{1,2})\s*:\s*(\d{2})$/);
  return match ? formatClock(match[1], match[2]) : '';
}

function formatClock(hour, minute) {
  const h = Number(hour);
  const m = Number(minute);
  if (!Number.isInteger(h) || !Number.isInteger(m) || h < 0 || h > 23 || m < 0 || m > 59) return '';
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function firstUsableTitleCell(row, columns) {
  const excluded = new Set(Object.values(columns).filter((value) => value !== undefined));
  return row.find((cell, index) => !excluded.has(index) && cleanTitle(cell)) || '';
}

function cleanTitle(value, startTime = '', endTime = '') {
  let text = String(value || '').replace(/\s+/g, ' ').replace(/(?:第?\s*\d+\s*[-~至]\s*\d+\s*节|第?\s*\d+\s*节)/g, '').trim();
  if (startTime && endTime) {
    const [startHour, startMinute] = startTime.split(':');
    const [endHour, endMinute] = endTime.split(':');
    const range = new RegExp(`0?${Number(startHour)}\\s*[:：.]\\s*${startMinute}\\s*[-~至到—–]\\s*0?${Number(endHour)}\\s*[:：.]\\s*${endMinute}`, 'g');
    text = text.replace(range, '').trim();
  }
  return text.replace(/^[,，;；、|]+|[,，;；、|]+$/g, '').trim();
}

function createCandidate(candidate) {
  return {
    startTime: candidate.startTime,
    endTime: candidate.endTime,
    title: candidate.title,
    details: candidate.details || '',
    category: candidate.category || '',
    date: candidate.date || '',
    sheetName: candidate.sheetName || '',
    source: candidate.source || 'plan'
  };
}

function dedupeCandidates(candidates) {
  const seen = new Set();
  return candidates.filter((candidate) => {
    const key = [candidate.date, candidate.startTime, candidate.endTime, candidate.title, candidate.details].join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeLabel(value) {
  return String(value || '').replace(/\s+/g, '').toLowerCase();
}

function cellAt(row, index) {
  return index === undefined ? '' : String(row[index] || '').trim();
}

function buildMessage(selection, targetDate) {
  if (!selection.candidates.length) return '没有识别到可导入的时间段和任务名称。';
  if (targetDate && selection.selectedDate && selection.selectedDate !== targetDate) {
    return `当前日期没有匹配安排，已改为导入 ${selection.selectedDate} 的内容。`;
  }
  if (selection.mode === 'timetable') return '已按日期或星期列识别课表，并预填对应当天的课程。';
  return '已按日期与时间列识别安排，并预填到任务表。';
}

module.exports = {
  parseDailyPlanImport,
  parseDailyPlanSheets: (sheets, options = {}) => {
    const targetDate = normalizeDate(options.targetDate) || '';
    const candidates = (sheets || []).flatMap((sheet) => parseSheet(normalizeRows(sheet.rows || sheet), {
      sheetName: sheet.name || '',
      targetDate,
      fallbackYear: targetDate ? Number(targetDate.slice(0, 4)) : new Date().getFullYear()
    }));
    return selectCandidatesForTarget(dedupeCandidates(candidates), targetDate);
  },
  extractRange,
  extractDate,
  parseSheet
};
