const pageTitle = document.querySelector('#pageTitle');
const appIconLink = document.querySelector('link[rel="icon"]');
const brandMark = document.querySelector('.brand-mark');
const systemTime = document.querySelector('#systemTime');
const navItems = document.querySelectorAll('.nav-item');
const pages = {
  tasks: document.querySelector('#tasksPage'),
  profile: document.querySelector('#profilePage'),
  records: document.querySelector('#recordsPage'),
  settings: document.querySelector('#settingsPage')
};
const UNASSIGNED_CATEGORY_ID = 'category-unassigned';
const MICROPHONE_TEST_SAMPLE_RATE = 48000;
const {
  MIN_DATE_VALUE,
  enumerateDates,
  formatClockDate,
  formatClockTime,
  formatLocalDate,
  isCompleteDate,
  isSelectableDate,
  normalizeDate,
  parseLocalDate,
  sanitizeDateSegmentLengths,
  shiftDate,
  weekdayFromDate
} = globalThis.RizhiDateUtils;
const {
  clockDigitsToTime,
  extractTimeRangeFromInput,
  formatClockDisplay,
  formatClockDigits,
  formatTimeRangeInput,
  inputRangeToComparableIntervals,
  isAllDayRange,
  isValidClockPart,
  normalizeTime,
  rangesOverlap,
  rangeToComparableIntervals,
  timeToMinutes
} = globalThis.RizhiTaskTimeUtils;
const {
  DEFAULT_JOURNAL_TAGS,
  legacyRatingToTagId,
  normalizeJournalTagIds: normalizeRawJournalTagIds
} = globalThis.RizhiJournalTags;
const {
  cloneDefaultTaskCategories,
  legacyTaskTypeToCategoryId,
  normalizeTaskCategories: normalizeRawTaskCategories,
  resolveTaskCategoryId
} = globalThis.RizhiTaskCategories;
const emptyState = document.querySelector('#emptyState');
const taskWorkspace = document.querySelector('#taskWorkspace');
const taskList = document.querySelector('#taskList');
const taskDurationSummary = document.querySelector('#taskDurationSummary');
const statusBox = document.querySelector('#statusBox');
const manualTaskButton = document.querySelector('#manualTaskButton');
const importFileButton = document.querySelector('#importFileButton');
const backToCurrentTaskButton = document.querySelector('#backToCurrentTaskButton');
const contextualNowButtonLabel = document.querySelector('#contextualNowButtonLabel');
const saveTaskTemplateButton = document.querySelector('#saveTaskTemplateButton');
const saveTaskTemplateModal = document.querySelector('#saveTaskTemplateModal');
const closeSaveTaskTemplateModalButton = document.querySelector('#closeSaveTaskTemplateModalButton');
const cancelSaveTaskTemplateButton = document.querySelector('#cancelSaveTaskTemplateButton');
const saveTaskTemplateForm = document.querySelector('#saveTaskTemplateForm');
const taskTemplateName = document.querySelector('#taskTemplateName');
const taskTemplateSaveSummary = document.querySelector('#taskTemplateSaveSummary');
const taskTemplateSaveError = document.querySelector('#taskTemplateSaveError');
const reuseTemplateButton = document.querySelector('#reuseTemplateButton');
const reuseTemplateModal = document.querySelector('#reuseTemplateModal');
const closeReuseTemplateModalButton = document.querySelector('#closeReuseTemplateModalButton');
const cancelReuseTemplateButton = document.querySelector('#cancelReuseTemplateButton');
const confirmReuseTemplateButton = document.querySelector('#confirmReuseTemplateButton');
const taskTemplateList = document.querySelector('#taskTemplateList');
const taskTemplateEmpty = document.querySelector('#taskTemplateEmpty');
const importMoreButton = document.querySelector('#importMoreButton');
const taskDateFilter = document.querySelector('#taskDateFilter');
const taskTimePicker = document.querySelector('#taskTimePicker');
const taskTimePickerTitle = document.querySelector('#taskTimePickerTitle');
const taskTimePickerHour = document.querySelector('#taskTimePickerHour');
const taskTimePickerMinute = document.querySelector('#taskTimePickerMinute');
const cancelTaskTimePickerButton = document.querySelector('#cancelTaskTimePickerButton');
const confirmTaskTimePickerButton = document.querySelector('#confirmTaskTimePickerButton');
const journalDate = document.querySelector('#journalDate');
const journalTag = document.querySelector('#journalTag');
const journalTagPaletteButton = document.querySelector('#journalTagPaletteButton');
const journalTagPalette = document.querySelector('#journalTagPalette');
const journalContent = document.querySelector('#journalContent');
const saveJournalButton = document.querySelector('#saveJournalButton');
const openMediaUploadButton = document.querySelector('#openMediaUploadButton');
const journalSaveState = document.querySelector('#journalSaveState');
const journalVoiceStartButton = document.querySelector('#journalVoiceStartButton');
const journalVoiceCancelButton = document.querySelector('#journalVoiceCancelButton');
const journalVoiceTimer = document.querySelector('#journalVoiceTimer');
const journalVoiceStatus = document.querySelector('#journalVoiceStatus');
const journalFilterModeButtons = Array.from(document.querySelectorAll('[data-journal-filter-mode]'));
const journalSearchInput = document.querySelector('#journalSearchInput');
const journalTagFilter = document.querySelector('#journalTagFilter');
const journalTagFilterPaletteButton = document.querySelector('#journalTagFilterPaletteButton');
const journalTagFilterPalette = document.querySelector('#journalTagFilterPalette');
const journalTagFilterField = document.querySelector('#journalTagFilterField');
const journalViewDateField = document.querySelector('#journalViewDateField');
const journalViewDate = document.querySelector('#journalViewDate');
const journalList = document.querySelector('#journalList');
const recordsLayout = document.querySelector('.records-layout');
const journalEditorPanel = document.querySelector('#journalEditorPanel');
const recordsListPanel = document.querySelector('#recordsListPanel');
const showJournalListButton = document.querySelector('#showJournalListButton');
const backToJournalEditorButton = document.querySelector('#backToJournalEditorButton');
const storageRootPath = document.querySelector('#storageRootPath');
const dataFilePath = document.querySelector('#dataFilePath');
const settingsFilePath = document.querySelector('#settingsFilePath');
const mediaDirectoryPath = document.querySelector('#mediaDirectoryPath');
const modelDownloadPath = document.querySelector('#modelDownloadPath');
const changeStorageRootButton = document.querySelector('#changeStorageRootButton');
const openDataPathButton = document.querySelector('#openDataPathButton');
const openMediaDirectoryButton = document.querySelector('#openMediaDirectoryButton');
const openSettingsPathButton = document.querySelector('#openSettingsPathButton');
const openModelDirectoryButton = document.querySelector('#openModelDirectoryButton');
const settingsMenuButtons = document.querySelectorAll('.settings-menu-item');
const settingsPanels = document.querySelectorAll('[data-settings-panel].panel');
const settingsEmptyPanel = document.querySelector('#settingsEmptyPanel');
const updateCurrentVersion = document.querySelector('#updateCurrentVersion');
const updateCheckStatus = document.querySelector('#updateCheckStatus');
const checkForUpdatesButton = document.querySelector('#checkForUpdatesButton');
const downloadUpdateButton = document.querySelector('#downloadUpdateButton');
const asrTestStartButton = document.querySelector('#asrTestStartButton');
const asrTestStopButton = document.querySelector('#asrTestStopButton');
const asrTestStatus = document.querySelector('#asrTestStatus');
const asrModelStatus = document.querySelector('#asrModelStatus');
const asrModelDownloadButton = document.querySelector('#asrModelDownloadButton');
const settingsAsrDownloadProgress = document.querySelector('#settingsAsrDownloadProgress');
const asrPartialResult = document.querySelector('#asrPartialResult');
const asrFinalResult = document.querySelector('#asrFinalResult');
const asrInputDeviceSelect = document.querySelector('#asrInputDeviceSelect');
const asrRefreshDevicesButton = document.querySelector('#asrRefreshDevicesButton');
const asrMicTestStartButton = document.querySelector('#asrMicTestStartButton');
const asrMicTestStopButton = document.querySelector('#asrMicTestStopButton');
const asrInputWaveform = document.querySelector('#asrInputWaveform');
const asrInputFeedback = document.querySelector('#asrInputFeedback');
const journalTagSettingsList = document.querySelector('#journalTagSettingsList');
const addJournalTagButton = document.querySelector('#addJournalTagButton');
const taskCategorySettingsList = document.querySelector('#taskCategorySettingsList');
const contextualNowShortcutValue = document.querySelector('#contextualNowShortcutValue');
const customizeContextualNowShortcutButton = document.querySelector('#customizeContextualNowShortcutButton');
const resetContextualNowShortcutButton = document.querySelector('#resetContextualNowShortcutButton');
const shortcutSettingsStatus = document.querySelector('#shortcutSettingsStatus');
const addTaskCategoryButton = document.querySelector('#addTaskCategoryButton');
const taskCategorySettingsStatus = document.querySelector('#taskCategorySettingsStatus');
const deleteMultipleDates = document.querySelector('#deleteMultipleDates');
const deleteStartDate = document.querySelector('#deleteStartDate');
const deleteStartDateLabel = document.querySelector('#deleteStartDateLabel');
const deleteEndDate = document.querySelector('#deleteEndDate');
const deleteEndDateField = document.querySelector('#deleteEndDateField');
const openDeletePeriodButton = document.querySelector('#openDeletePeriodButton');
const openResetButton = document.querySelector('#openResetButton');
const resetModal = document.querySelector('#resetModal');
const resetTitle = document.querySelector('#resetTitle');
const resetDescription = document.querySelector('#resetDescription');
const closeResetModalButton = document.querySelector('#closeResetModalButton');
const cancelResetButton = document.querySelector('#cancelResetButton');
const confirmResetButton = document.querySelector('#confirmResetButton');
const resetConfirmCheck = document.querySelector('#resetConfirmCheck');
const resetConfirmText = document.querySelector('#resetConfirmText');
const resetDeleteOptions = document.querySelector('#resetDeleteOptions');
const resetPathList = document.querySelector('#resetPathList');
const taskEditModal = document.querySelector('#taskEditModal');
const taskEditForm = document.querySelector('#taskEditForm');
const taskEditTitle = document.querySelector('#taskEditTitle');
const closeTaskEditModalButton = document.querySelector('#closeTaskEditModalButton');
const cancelTaskEditButton = document.querySelector('#cancelTaskEditButton');
const taskDetails = document.querySelector('#taskDetails');
const profileStatsStartDate = document.querySelector('#profileStatsStartDate');
const profileStatsPeriod = document.querySelector('#profileStatsPeriod');
const profileStatsReferencePicker = document.querySelector('#profileStatsReferencePicker');
const profileStatsReferenceLabel = document.querySelector('#profileStatsReferenceLabel');
const profileStatsDateControl = document.querySelector('#profileStatsDateControl');
const profileStatsMonth = document.querySelector('#profileStatsMonth');
const profileStatsQuarterControl = document.querySelector('#profileStatsQuarterControl');
const profileStatsQuarterYear = document.querySelector('#profileStatsQuarterYear');
const profileStatsQuarter = document.querySelector('#profileStatsQuarter');
const profileStatsYear = document.querySelector('#profileStatsYear');
const profileStatsSummary = document.querySelector('#profileStatsSummary');
const profileStatsRangeText = document.querySelector('#profileStatsRangeText');
const profileStatsPie = document.querySelector('#profileStatsPie');
const profileStatsDaily = document.querySelector('#profileStatsDaily');
const importChoiceModal = document.querySelector('#importChoiceModal');
const closeImportChoiceModalButton = document.querySelector('#closeImportChoiceModalButton');
const manualScheduleButton = document.querySelector('#manualScheduleButton');
const fileScheduleButton = document.querySelector('#fileScheduleButton');
const manualDailyPlanButton = document.querySelector('#manualDailyPlanButton');
const scheduleTableModal = document.querySelector('#scheduleTableModal');
const closeScheduleTableModalButton = document.querySelector('#closeScheduleTableModalButton');
const termStartDate = document.querySelector('#termStartDate');
const termEndDate = document.querySelector('#termEndDate');
const scheduleTableBody = document.querySelector('#scheduleTableBody');
const addScheduleRowButton = document.querySelector('#addScheduleRowButton');
const cancelScheduleTableButton = document.querySelector('#cancelScheduleTableButton');
const saveScheduleTableButton = document.querySelector('#saveScheduleTableButton');
const dailyPlanTableModal = document.querySelector('#dailyPlanTableModal');
const dailyPlanModalCard = dailyPlanTableModal && dailyPlanTableModal.querySelector('.daily-plan-modal-card');
const dailyPlanLaunchPanel = document.querySelector('#dailyPlanLaunchPanel');
const dailyPlanVoicePage = document.querySelector('#dailyPlanVoicePage');
const openDailyPlanVoicePageButton = document.querySelector('#openDailyPlanVoicePageButton');
const backDailyPlanVoicePageButton = document.querySelector('#backDailyPlanVoicePageButton');
const closeDailyPlanVoicePageButton = document.querySelector('#closeDailyPlanVoicePageButton');
const dailyPlanMultiDay = document.querySelector('#dailyPlanMultiDay');
const dailyPlanSingleDateRow = document.querySelector('#dailyPlanSingleDateRow');
const dailyPlanRangeRow = document.querySelector('#dailyPlanRangeRow');
const dailyPlanDate = document.querySelector('#dailyPlanDate');
const dailyPlanStartDate = document.querySelector('#dailyPlanStartDate');
const dailyPlanEndDate = document.querySelector('#dailyPlanEndDate');
const dailyPlanTableBody = document.querySelector('#dailyPlanTableBody');
const addDailyPlanRowButton = document.querySelector('#addDailyPlanRowButton');
const cancelDailyPlanTableButton = document.querySelector('#cancelDailyPlanTableButton');
const saveDailyPlanTableButton = document.querySelector('#saveDailyPlanTableButton');
const dailyPlanVoiceStartButton = document.querySelector('#dailyPlanVoiceStartButton');
const dailyPlanVoiceCancelButton = document.querySelector('#dailyPlanVoiceCancelButton');
const dailyPlanVoiceConfirmButton = document.querySelector('#dailyPlanVoiceConfirmButton');
const dailyPlanVoiceStatus = document.querySelector('#dailyPlanVoiceStatus');
const dailyPlanVoiceTimer = document.querySelector('#dailyPlanVoiceTimer');
const dailyPlanVoiceText = document.querySelector('#dailyPlanVoiceText');
const dailyPlanVoiceApplyButton = document.querySelector('#dailyPlanVoiceApplyButton');
const journalViewModal = document.querySelector('#journalViewModal');
const journalViewTitle = document.querySelector('#journalViewTitle');
const journalViewContent = document.querySelector('#journalViewContent');
const closeJournalViewModalButton = document.querySelector('#closeJournalViewModalButton');
const closeJournalViewButton = document.querySelector('#closeJournalViewButton');
const mediaUploadModal = document.querySelector('#mediaUploadModal');
const mediaUploadQr = document.querySelector('#mediaUploadQr');
const mediaUploadHint = document.querySelector('#mediaUploadHint');
const mediaNetworkDebug = document.querySelector('#mediaNetworkDebug');
const mediaUploadStatus = document.querySelector('#mediaUploadStatus');
const mediaUploadPreviewList = document.querySelector('#mediaUploadPreviewList');
const closeMediaUploadModalButton = document.querySelector('#closeMediaUploadModalButton');
const cancelMediaUploadButton = document.querySelector('#cancelMediaUploadButton');
const confirmMediaUploadButton = document.querySelector('#confirmMediaUploadButton');
const mediaViewModal = document.querySelector('#mediaViewModal');
const mediaViewTitle = document.querySelector('#mediaViewTitle');
const mediaViewContent = document.querySelector('#mediaViewContent');
const closeMediaViewModalButton = document.querySelector('#closeMediaViewModalButton');
const journalUnsavedModal = document.querySelector('#journalUnsavedModal');
const closeJournalUnsavedModalButton = document.querySelector('#closeJournalUnsavedModalButton');
const discardJournalChangesButton = document.querySelector('#discardJournalChangesButton');
const cancelJournalNavigationButton = document.querySelector('#cancelJournalNavigationButton');
const saveJournalBeforeLeaveButton = document.querySelector('#saveJournalBeforeLeaveButton');
const tutorialButton = document.querySelector('#tutorialButton');
const refreshStatusButton = document.querySelector('#refreshStatusButton');
const tutorialConfirmModal = document.querySelector('#tutorialConfirmModal');
const tutorialConfirmNoButton = document.querySelector('#tutorialConfirmNoButton');
const tutorialNoButton = document.querySelector('#tutorialNoButton');
const tutorialYesButton = document.querySelector('#tutorialYesButton');
const tutorialOverlay = document.querySelector('#tutorialOverlay');
const tutorialHighlight = document.querySelector('#tutorialHighlight');
const tutorialArrow = document.querySelector('#tutorialArrow');
const tutorialArrowLine = document.querySelector('#tutorialArrowLine');
const tutorialCard = document.querySelector('#tutorialCard');
const tutorialCounter = document.querySelector('#tutorialCounter');
const tutorialTitle = document.querySelector('#tutorialTitle');
const tutorialText = document.querySelector('#tutorialText');
const tutorialPrevButton = document.querySelector('#tutorialPrevButton');
const tutorialNextButton = document.querySelector('#tutorialNextButton');
const tutorialCloseButton = document.querySelector('#tutorialCloseButton');
const versionBadge = document.querySelector('#versionBadge');

let tasks = [];
let journals = [];
let profile = {};
let storagePaths = {
  storageRoot: '',
  dataFilePath: '',
  settingsFilePath: '',
  legacyStorageKeys: ['whbr.tasks', 'whbr.journals']
};
let asrModelDownloadDirectory = '';
let editingTaskId = '';
let draggedTaskId = '';
let deleteMode = 'all';
let selectedTaskTemplateId = '';
let expandedTaskTemplateId = '';
let editingTaskTemplateId = '';
let pendingTaskCategoryDeleteId = '';
const taskCategoryColorSaveTimers = new Map();
let activeMediaAnnotationEditor = null;
let highlightedTaskId = '';
let currentEffectiveNow = new Date();
let activeTaskTimePicker = null;
let previousFloatingTaskStateKey = '';
let floatingTaskStateInitialized = false;
let statusTimer = null;
let tutorialStepIndex = 0;
let appStatusRefreshInFlight = false;
let previousTutorialPage = 'tasks';
let appliedJournalTagFilters = [];
let appliedJournalSearch = '';
let journalFilterMode = 'all';
let recordsView = 'editor';
let taskHistoryOperationInProgress = false;
let committedProfileStatsStartDate = '';
let pendingJournalUnsavedResolver = null;
let journalDateChangePending = false;
let activeMediaUploadSession = null;
let pendingMediaItems = [];
const mediaUrlCache = new Map();
let asrTestCapture = null;
let asrTestCaptureUnsubscribe = null;
let asrTestRecording = false;
let asrModelDownloadInFlight = false;
let latestAsrModelStatus = null;
let latestUpdateStatus = { status: 'idle', version: '', progress: null, error: '' };
let microphoneTestCapture = null;
let microphoneTestUnsubscribe = null;
let microphoneTestRecording = false;
let microphoneSilenceTimer = null;
let lastMicrophoneSoundAt = 0;
let journalVoiceCapture = null;
let journalVoiceCaptureUnsubscribe = null;
let journalVoiceRecording = false;
let journalVoiceProcessing = false;
let journalVoiceCanceled = false;
let journalVoiceInsertionPoint = null;
let journalVoiceFinalInserted = false;
let journalLastCursorPosition = null;
let journalVoiceHasInsertedSegment = false;
let journalVoiceOriginalContent = '';
let journalVoiceOriginalInsertionPoint = null;
let journalVoiceSilenceTimer = null;
let journalVoiceLastSoundAt = 0;
let shortcutCaptureActive = false;

const DEFAULT_SHORTCUTS = Object.freeze({
  contextualNow: 'Ctrl+Alt+C'
});
const RESERVED_SHORTCUTS = new Set([
  'Ctrl+S',
  'Ctrl+Z',
  'Ctrl+Y',
  'Ctrl+Shift+Z',
  'Ctrl+C',
  'Ctrl+V',
  'Ctrl+X',
  'Ctrl+A',
  'Ctrl+R',
  'Ctrl+W',
  'Ctrl+Shift+I'
]);
let journalVoiceWarningTimer = null;
let journalVoiceMaximumTimer = null;
let journalVoiceTimerInterval = null;
let journalVoiceRecordingStartedAt = 0;
let journalVoiceConversionStartedAt = 0;
let journalVoiceCapturedSeconds = 0;
let journalVoiceDecodedSeconds = 0;
let journalVoiceDecodeRealtimeFactor = 0;
let dailyPlanVoiceCapture = null;
let dailyPlanVoiceCaptureUnsubscribe = null;
let dailyPlanVoiceRecording = false;
let dailyPlanVoiceCanceled = false;
let dailyPlanVoiceFinalReceived = false;
let dailyPlanVoiceProcessing = false;
let dailyPlanVoiceWarningActive = false;
let dailyPlanVoiceWarningTimer = null;
let dailyPlanVoiceMaximumTimer = null;
let dailyPlanVoiceTimerInterval = null;
let dailyPlanVoiceRecordingStartedAt = 0;
let dailyPlanVoiceConversionStartedAt = 0;
let dailyPlanVoiceCapturedSeconds = 0;
let dailyPlanVoiceDecodedSeconds = 0;
let dailyPlanVoiceDecodeRealtimeFactor = 0;
let dailyPlanVoiceParsedCandidates = [];
let dailyPlanVoiceParsedText = '';
const activePlanningDates = new Set();
const dateInputControllers = new WeakMap();
const taskUndoStack = [];
const taskRedoStack = [];
const TASK_HISTORY_LIMIT = 50;
const MISSED_REMINDER_BACKLOG_LIMIT_MINUTES = 2;
const tutorialSteps = [
  {
    page: 'tasks',
    targetSelector: '#importMoreButton',
    title: '批量创建任务',
    text: '这里可以手动填写或导入课表、复用安排模板，也可以为单日或连续多日填写每日安排。每日安排还支持使用本地语音识别批量生成任务。'
  },
  {
    page: 'tasks',
    targetSelector: '#saveTaskTemplateButton',
    title: '保存安排模板',
    text: '将当前日期的完整安排保存为模板后，可以在“批量创建任务”中复用。模板只保存时间段、任务名称和任务分类，不会带入完成记录。'
  },
  {
    page: 'tasks',
    targetSelector: '#taskList',
    title: '完成情况与备注',
    text: '点击任务条的开始或结束时间可以打开时间选择器。右侧可选择完成情况；铅笔按钮用于填写可选备注。'
  },
  {
    page: 'records',
    recordsView: 'editor',
    targetSelector: '.journal-editor',
    title: '每日生活记录',
    text: '选择日期后，可以写下当天发生的事、状态与整体复盘，并按需添加一个或多个日子印记。切换日期或离开记录页时，如果内容尚未保存，软件会先询问如何处理。'
  },
  {
    page: 'records',
    recordsView: 'editor',
    targetSelector: '#journalVoiceStartButton',
    title: '语音填写记录',
    text: '语音会在本机识别并逐段插入记录文本。首次使用需要下载离线语音模型；识别结果仍可修改，并需要点击“保存记录”后才会写入数据。'
  },
  {
    page: 'records',
    recordsView: 'editor',
    targetSelector: '#openMediaUploadButton',
    title: '归档照片和视频',
    text: '电脑和手机连接同一局域网时，可以扫描二维码上传照片、动态图片和视频。确认后，附件会归档到当前记录日期。'
  },
  {
    page: 'records',
    recordsView: 'editor',
    targetSelector: '#showJournalListButton',
    title: '查看记录列表',
    text: '保存记录旁边可以进入记录列表；平时记录页只显示每日生活记录，减少页面上下滚动和干扰。'
  },
  {
    page: 'records',
    recordsView: 'list',
    targetSelector: '.record-filter-modes',
    title: '记录列表',
    text: '可以直接选择“全部”“日期”或“标签”筛选。标签支持多选，结果会同时满足所有已选标签；左侧搜索框还可以和筛选条件组合使用。'
  },
  {
    page: 'profile',
    targetSelector: '.profile-dashboard .panel',
    scrollBlock: 'start',
    title: '周期回顾',
    text: '先选择每日、每周、每月、每季度或每年，右侧筛选器会切换为对应的日期形式。饼状图展示分类占比，条形图按日期或月份展示周期内分布。'
  },
  {
    page: 'settings',
    settingPanel: 'data',
    targetSelector: '.settings-data-panel',
    title: '数据文件',
    text: '这里显示日织内容的统一存放位置，以及数据、设置、媒体和语音模型的实际路径。更改存放位置时，这些内容会一起迁移。'
  },
  {
    page: 'settings',
    settingPanel: 'updates',
    targetSelector: '.settings-updates-panel',
    title: '版本更新',
    text: '这里可手动查看版本更新。已是最新版本时会明确提示；发现新版本后可以点击升级并下载，完成后日织会重启安装。'
  },
  {
    page: 'settings',
    settingPanel: 'danger',
    targetSelector: '.danger-panel',
    title: '删除本地内容',
    text: '可以按单日或日期范围删除任务、生活记录和附件，也可以重置全部本地内容。删除前需要选择具体范围并再次确认。'
  },
  {
    page: 'settings',
    settingPanel: 'task-categories',
    targetSelector: '.settings-task-categories-panel',
    title: '任务分类',
    text: '任务分类可以自行增减、改名、换色和排序。每个分类可单独决定是否启用专注与休息周期，并设置分钟数；停用分类不会影响历史任务。'
  },
  {
    page: 'settings',
    settingPanel: 'tags',
    targetSelector: '.settings-tags-panel',
    title: '标签',
    text: '标签作为可选的日子印记使用。可以自定义名称与颜色，一天允许选择多个标签，也可以不设置。'
  },
  {
    page: 'settings',
    settingPanel: 'shortcuts',
    targetSelector: '.settings-shortcuts-panel',
    title: '快捷键',
    text: '带有“自定义”的操作可以设置组合键，定位快捷键默认是 Ctrl+Alt+C。复制、粘贴、剪切等常用编辑快捷键会固定保留。'
  },
  {
    page: 'settings',
    settingPanel: 'asr-test',
    targetSelector: '.settings-asr-test-panel',
    title: '离线语音识别',
    text: '这里可以下载和检查离线语音模型、选择麦克风，并分别测试输入波形和识别结果。模型安装完成后，记录与任务语音都在本机处理。'
  },
  {
    page: 'tasks',
    targetSelector: '#backToCurrentTaskButton',
    title: '定位按钮',
    text: '左下角定位键会随页面变化：任务和设置显示“现”，记录显示“今”，统计会显示今、周、月、季或年。点击后会回到当前任务、当天记录或当前统计周期。'
  },
  {
    page: 'tasks',
    title: '教程已结束',
    text: '教程已结束，祝使用愉快。'
  }
];

navItems.forEach((item) => {
  item.addEventListener('click', async () => {
    const targetPage = item.dataset.page;
    if (!(await confirmLeaveRecordsPageIfNeeded(targetPage))) return;
    if (targetPage === 'tasks') {
      goToCurrentTask();
      return;
    }
    showPage(targetPage);
  });
});

settingsMenuButtons.forEach((button) => {
  button.addEventListener('click', () => showSettingsPanel(button.dataset.settingsPanel));
});

if (asrTestStartButton) asrTestStartButton.addEventListener('click', startRecording);
if (asrTestStopButton) asrTestStopButton.addEventListener('click', stopRecording);
if (asrModelDownloadButton) asrModelDownloadButton.addEventListener('click', downloadAsrModelFromSettings);
if (checkForUpdatesButton) checkForUpdatesButton.addEventListener('click', () => void checkForApplicationUpdates());
if (downloadUpdateButton) downloadUpdateButton.addEventListener('click', () => void downloadApplicationUpdate());
if (asrRefreshDevicesButton) asrRefreshDevicesButton.addEventListener('click', refreshAudioInputDevices);
if (asrMicTestStartButton) asrMicTestStartButton.addEventListener('click', startMicrophoneTest);
if (asrMicTestStopButton) asrMicTestStopButton.addEventListener('click', stopMicrophoneTest);
if (journalVoiceStartButton) journalVoiceStartButton.addEventListener('click', toggleJournalVoiceInput);
if (journalVoiceCancelButton) journalVoiceCancelButton.addEventListener('click', cancelJournalVoiceInput);
if (journalContent) {
  ['focus', 'click', 'keyup', 'select', 'input'].forEach((eventName) => {
    journalContent.addEventListener(eventName, rememberJournalCursorPosition);
  });
  journalContent.addEventListener('input', updateJournalDirtyState);
}
subscribeToAsrTestEvents();
subscribeToUpdateEvents();

document.querySelectorAll('.date-step-button').forEach((button) => {
  button.addEventListener('mousedown', (event) => event.preventDefault());
  button.addEventListener('click', handleDateStepButton);
});
if (tutorialButton) tutorialButton.addEventListener('click', openTutorialConfirmModal);
if (refreshStatusButton) refreshStatusButton.addEventListener('click', refreshApplicationStatus);
if (tutorialConfirmNoButton) tutorialConfirmNoButton.addEventListener('click', closeTutorialConfirmModal);
if (tutorialNoButton) tutorialNoButton.addEventListener('click', closeTutorialConfirmModal);
if (tutorialYesButton) tutorialYesButton.addEventListener('click', startTutorial);
if (tutorialPrevButton) tutorialPrevButton.addEventListener('click', showPreviousTutorialStep);
if (tutorialNextButton) tutorialNextButton.addEventListener('click', showNextTutorialStep);
if (tutorialCloseButton) tutorialCloseButton.addEventListener('click', finishTutorial);
if (customizeContextualNowShortcutButton) {
  customizeContextualNowShortcutButton.addEventListener('click', beginContextualNowShortcutCapture);
}
if (resetContextualNowShortcutButton) {
  resetContextualNowShortcutButton.addEventListener('click', () => void resetContextualNowShortcut());
}
tutorialConfirmModal.addEventListener('click', (event) => {
  if (event.target === tutorialConfirmModal) closeTutorialConfirmModal();
});
if (closeJournalUnsavedModalButton) closeJournalUnsavedModalButton.addEventListener('click', () => resolveJournalUnsavedChoice('cancel'));
if (discardJournalChangesButton) discardJournalChangesButton.addEventListener('click', () => resolveJournalUnsavedChoice('discard'));
if (cancelJournalNavigationButton) cancelJournalNavigationButton.addEventListener('click', () => resolveJournalUnsavedChoice('cancel'));
if (saveJournalBeforeLeaveButton) saveJournalBeforeLeaveButton.addEventListener('click', () => resolveJournalUnsavedChoice('save'));
if (journalUnsavedModal) {
  journalUnsavedModal.addEventListener('click', (event) => {
    if (event.target === journalUnsavedModal) resolveJournalUnsavedChoice('cancel');
  });
}
window.addEventListener('resize', () => {
  if (!tutorialOverlay.classList.contains('hidden')) positionTutorialOverlay();
  positionTaskTimePicker();
});
document.addEventListener('click', closeTagPalettesOnOutsideClick);
document.addEventListener('pointerdown', (event) => {
  if (!activeTaskTimePicker) return;
  if (taskTimePicker.contains(event.target) || event.target.closest('.task-time-button')) return;
  closeTaskTimePicker();
});
document.addEventListener('keydown', handleShortcutCapture, true);
document.addEventListener('keydown', handleConfiguredShortcut, true);
document.addEventListener('keydown', handleTaskHistoryShortcut);
taskList.addEventListener('scroll', positionTaskTimePicker);
cancelTaskTimePickerButton.addEventListener('click', closeTaskTimePicker);
confirmTaskTimePickerButton.addEventListener('click', () => void confirmTaskTimePicker());
[taskTimePickerHour, taskTimePickerMinute].forEach((input) => {
  const max = input === taskTimePickerHour ? 23 : 59;
  input.addEventListener('focus', () => input.select());
  input.addEventListener('input', () => sanitizeTaskTimePickerUnit(input, max));
  input.addEventListener('blur', () => normalizeTaskTimePickerUnit(input, max));
  input.addEventListener('keydown', handleTaskTimePickerKeydown);
  input.addEventListener('wheel', handleTaskTimePickerWheel, { passive: false });
});
taskTimePicker.querySelectorAll('[data-time-step]').forEach((button) => {
  button.addEventListener('click', () => stepTaskTimePickerUnit(button.dataset.timeUnit, Number(button.dataset.timeStep)));
});
if (window.whbr.onHistoryUndo) window.whbr.onHistoryUndo(handleTaskHistoryUndo);
if (window.whbr.onHistoryRedo) window.whbr.onHistoryRedo(handleTaskHistoryRedo);

backToCurrentTaskButton.addEventListener('click', () => void goToContextualNow());
if (manualTaskButton) manualTaskButton.addEventListener('click', openImportChoiceModal);
if (saveTaskTemplateButton) saveTaskTemplateButton.addEventListener('click', openSaveTaskTemplateModal);
if (reuseTemplateButton) reuseTemplateButton.addEventListener('click', openReuseTemplateModal);
if (importFileButton) importFileButton.addEventListener('click', openImportChoiceModal);
importMoreButton.addEventListener('click', openImportChoiceModal);
window.addEventListener('keydown', (event) => {
  if (isSaveShortcut(event) && canSaveJournalWithShortcut()) {
    event.preventDefault();
    saveSelectedJournal();
    return;
  }

  if (event.key === 'Escape' && !resetModal.classList.contains('hidden')) {
    closeResetModal();
  }
  if (event.key === 'Escape' && !taskEditModal.classList.contains('hidden')) {
    closeTaskEditModal();
  }
  if (event.key === 'Escape' && !importChoiceModal.classList.contains('hidden')) {
    closeImportChoiceModal();
  }
  if (event.key === 'Escape' && saveTaskTemplateModal && !saveTaskTemplateModal.classList.contains('hidden')) {
    closeSaveTaskTemplateModal();
  }
  if (event.key === 'Escape' && reuseTemplateModal && !reuseTemplateModal.classList.contains('hidden')) {
    closeReuseTemplateModal();
  }
  if (event.key === 'Escape' && !scheduleTableModal.classList.contains('hidden')) {
    closeScheduleTableModal();
  }
  if (event.key === 'Escape' && !dailyPlanTableModal.classList.contains('hidden')) {
    closeDailyPlanTableModal();
  }
  if (event.key === 'Escape' && !journalViewModal.classList.contains('hidden')) {
    closeJournalViewModal();
  }
  if (event.key === 'Escape' && mediaUploadModal && !mediaUploadModal.classList.contains('hidden')) {
    void closeMediaUploadModal();
  }
  if (event.key === 'Escape' && mediaViewModal && !mediaViewModal.classList.contains('hidden')) {
    closeMediaViewModal();
  }
  if (event.key === 'Escape' && journalUnsavedModal && !journalUnsavedModal.classList.contains('hidden')) {
    resolveJournalUnsavedChoice('cancel');
  }
  if (event.key === 'Escape' && !tutorialConfirmModal.classList.contains('hidden')) {
    closeTutorialConfirmModal();
  }
});

function isSaveShortcut(event) {
  return !event.repeat && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's';
}

function canSaveJournalWithShortcut() {
  if (!pages.records.classList.contains('active')) return false;
  if (recordsView !== 'editor') return false;
  return [
    resetModal,
    taskEditModal,
    importChoiceModal,
    saveTaskTemplateModal,
    reuseTemplateModal,
    scheduleTableModal,
    dailyPlanTableModal,
    journalViewModal,
    mediaUploadModal,
    mediaViewModal,
    journalUnsavedModal,
    tutorialConfirmModal
  ].every((modal) => modal.classList.contains('hidden'));
}

if (importFileButton) {
  importFileButton.addEventListener('dragover', handleDragOver);
  importFileButton.addEventListener('dragleave', handleDragLeave);
  importFileButton.addEventListener('drop', handleDrop);
}
importMoreButton.addEventListener('dragover', handleDragOver);
importMoreButton.addEventListener('dragleave', handleDragLeave);
importMoreButton.addEventListener('drop', handleDrop);
registerDateInput(taskDateFilter, { onCommit: renderTasks });
registerDateInput(profileStatsStartDate, {
  onCommit: (date) => {
    setProfileStatsReferenceDate(date);
  }
});
if (profileStatsPeriod) profileStatsPeriod.addEventListener('change', handleProfileStatsPeriodChange);
if (profileStatsMonth) profileStatsMonth.addEventListener('change', commitProfileStatsMonthReference);
if (profileStatsQuarterYear) {
  profileStatsQuarterYear.addEventListener('change', commitProfileStatsQuarterReference);
  profileStatsQuarterYear.addEventListener('keydown', blurOnEnter);
}
if (profileStatsQuarter) profileStatsQuarter.addEventListener('change', commitProfileStatsQuarterReference);
if (profileStatsYear) {
  profileStatsYear.addEventListener('change', commitProfileStatsYearReference);
  profileStatsYear.addEventListener('keydown', blurOnEnter);
}
registerDateInput(journalDate, { onCommit: handleJournalDateCommit });
if (journalTag) journalTag.addEventListener('change', () => {
  renderTagPicker(journalTag, journalTagPaletteButton, journalTagPalette);
  updateJournalDirtyState();
});
if (journalTagFilter) {
  journalTagFilter.addEventListener('change', () => {
    renderTagPicker(journalTagFilter, journalTagFilterPaletteButton, journalTagFilterPalette);
    if (journalFilterMode === 'tag') {
      appliedJournalTagFilters = selectedJournalTagIds(journalTagFilter);
      renderJournalListPreservingScroll();
    }
  });
}
if (journalTagPaletteButton) journalTagPaletteButton.addEventListener('click', () => toggleTagPalette(journalTagPalette));
if (journalTagFilterPaletteButton) journalTagFilterPaletteButton.addEventListener('click', () => toggleTagPalette(journalTagFilterPalette));
journalFilterModeButtons.forEach((button) => {
  button.addEventListener('click', () => setJournalFilterMode(button.dataset.journalFilterMode));
});
if (journalSearchInput) {
  journalSearchInput.addEventListener('blur', commitJournalSearch);
  journalSearchInput.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    journalSearchInput.blur();
  });
}
if (showJournalListButton) showJournalListButton.addEventListener('click', () => showRecordsView('list'));
if (backToJournalEditorButton) backToJournalEditorButton.addEventListener('click', () => showRecordsView('editor'));
if (openMediaUploadButton) openMediaUploadButton.addEventListener('click', () => void openMediaUploadModal());
saveJournalButton.addEventListener('click', saveSelectedJournal);
registerDateInput(journalViewDate, {
  onCommit: () => {
    if (journalFilterMode === 'date') renderJournalListPreservingScroll();
  }
});
registerDateInput(deleteStartDate);
registerDateInput(deleteEndDate);
registerDateInput(termStartDate);
registerDateInput(termEndDate);
registerDateInput(dailyPlanDate);
registerDateInput(dailyPlanStartDate, { onCommit: constrainDailyPlanEndDate });
registerDateInput(dailyPlanEndDate);
if (changeStorageRootButton) changeStorageRootButton.addEventListener('click', chooseStorageRoot);
if (openDataPathButton) openDataPathButton.addEventListener('click', openDataPath);
if (openMediaDirectoryButton) openMediaDirectoryButton.addEventListener('click', openMediaDirectory);
if (openSettingsPathButton) openSettingsPathButton.addEventListener('click', openDataPath);
if (openModelDirectoryButton) openModelDirectoryButton.addEventListener('click', openModelDirectory);
if (addJournalTagButton) addJournalTagButton.addEventListener('click', addJournalTag);
if (addTaskCategoryButton) addTaskCategoryButton.addEventListener('click', addTaskCategory);
openDeletePeriodButton.addEventListener('click', openDeletePeriodModal);
if (deleteMultipleDates) deleteMultipleDates.addEventListener('change', updateDeletePeriodFields);
openResetButton.addEventListener('click', openResetModal);
closeResetModalButton.addEventListener('click', closeResetModal);
cancelResetButton.addEventListener('click', closeResetModal);
resetConfirmCheck.addEventListener('change', () => {
  updateResetConfirmButton();
});
if (resetDeleteOptions) {
  resetDeleteOptions.addEventListener('change', () => {
    renderResetPaths();
    updateResetConfirmButton();
  });
}
confirmResetButton.addEventListener('click', confirmReset);
resetModal.addEventListener('click', (event) => {
  if (event.target === resetModal) closeResetModal();
});
if (closeSaveTaskTemplateModalButton) closeSaveTaskTemplateModalButton.addEventListener('click', closeSaveTaskTemplateModal);
if (cancelSaveTaskTemplateButton) cancelSaveTaskTemplateButton.addEventListener('click', closeSaveTaskTemplateModal);
if (saveTaskTemplateForm) saveTaskTemplateForm.addEventListener('submit', saveCurrentDayAsTemplate);
if (taskTemplateName) taskTemplateName.addEventListener('input', clearTaskTemplateSaveError);
if (saveTaskTemplateModal) {
  saveTaskTemplateModal.addEventListener('click', (event) => {
    if (event.target === saveTaskTemplateModal) closeSaveTaskTemplateModal();
  });
}
if (closeReuseTemplateModalButton) closeReuseTemplateModalButton.addEventListener('click', closeReuseTemplateModal);
if (cancelReuseTemplateButton) cancelReuseTemplateButton.addEventListener('click', closeReuseTemplateModal);
if (confirmReuseTemplateButton) confirmReuseTemplateButton.addEventListener('click', confirmReuseTemplate);
if (reuseTemplateModal) {
  reuseTemplateModal.addEventListener('click', (event) => {
    if (event.target === reuseTemplateModal) closeReuseTemplateModal();
  });
}
taskEditForm.addEventListener('submit', saveTaskEdit);
closeTaskEditModalButton.addEventListener('click', closeTaskEditModal);
cancelTaskEditButton.addEventListener('click', closeTaskEditModal);
taskEditModal.addEventListener('click', (event) => {
  if (event.target === taskEditModal) closeTaskEditModal();
});
closeImportChoiceModalButton.addEventListener('click', closeImportChoiceModal);
manualScheduleButton.addEventListener('click', () => openScheduleTableModal());
fileScheduleButton.addEventListener('click', importScheduleFile);
manualDailyPlanButton.addEventListener('click', openDailyPlanTableModal);
importChoiceModal.addEventListener('click', (event) => {
  if (event.target === importChoiceModal) closeImportChoiceModal();
});
closeScheduleTableModalButton.addEventListener('click', closeScheduleTableModal);
cancelScheduleTableButton.addEventListener('click', closeScheduleTableModal);
addScheduleRowButton.addEventListener('click', () => addScheduleTableRow());
saveScheduleTableButton.addEventListener('click', saveScheduleTable);
scheduleTableModal.addEventListener('click', (event) => {
  if (event.target === scheduleTableModal) closeScheduleTableModal();
});
if (closeDailyPlanVoicePageButton) closeDailyPlanVoicePageButton.addEventListener('click', closeDailyPlanTableModal);
if (openDailyPlanVoicePageButton) openDailyPlanVoicePageButton.addEventListener('click', openDailyPlanVoicePage);
if (backDailyPlanVoicePageButton) backDailyPlanVoicePageButton.addEventListener('click', closeDailyPlanVoicePage);
cancelDailyPlanTableButton.addEventListener('click', closeDailyPlanTableModal);
addDailyPlanRowButton.addEventListener('click', () => {
  addDailyPlanRow();
  focusDailyPlanGridCell(dailyPlanTableBody.querySelectorAll('tr').length - 1, 0);
});
saveDailyPlanTableButton.addEventListener('click', saveDailyPlanTable);
if (dailyPlanVoiceStartButton) dailyPlanVoiceStartButton.addEventListener('click', toggleDailyPlanVoiceInput);
if (dailyPlanVoiceCancelButton) dailyPlanVoiceCancelButton.addEventListener('click', cancelDailyPlanVoiceInput);
if (dailyPlanVoiceConfirmButton) dailyPlanVoiceConfirmButton.addEventListener('click', confirmDailyPlanVoiceText);
if (dailyPlanVoiceApplyButton) dailyPlanVoiceApplyButton.addEventListener('click', applyDailyPlanVoiceTasks);
if (dailyPlanVoiceText) dailyPlanVoiceText.addEventListener('input', invalidateDailyPlanVoiceParse);
if (dailyPlanMultiDay) dailyPlanMultiDay.addEventListener('change', handleDailyPlanDateModeChange);
if (dailyPlanStartDate) dailyPlanStartDate.addEventListener('change', constrainDailyPlanEndDate);
if (dailyPlanEndDate) dailyPlanEndDate.addEventListener('change', constrainDailyPlanEndDate);
dailyPlanTableModal.addEventListener('click', (event) => {
  if (event.target === dailyPlanTableModal) closeDailyPlanTableModal();
});
closeJournalViewModalButton.addEventListener('click', closeJournalViewModal);
closeJournalViewButton.addEventListener('click', closeJournalViewModal);
journalViewModal.addEventListener('click', (event) => {
  if (event.target === journalViewModal) closeJournalViewModal();
});
if (closeMediaUploadModalButton) closeMediaUploadModalButton.addEventListener('click', () => void closeMediaUploadModal());
if (cancelMediaUploadButton) cancelMediaUploadButton.addEventListener('click', () => void closeMediaUploadModal());
if (confirmMediaUploadButton) confirmMediaUploadButton.addEventListener('click', () => void confirmMediaUpload());
if (mediaUploadModal) mediaUploadModal.addEventListener('click', (event) => {
  if (event.target === mediaUploadModal) void closeMediaUploadModal();
});
if (closeMediaViewModalButton) closeMediaViewModalButton.addEventListener('click', closeMediaViewModal);
if (mediaViewModal) mediaViewModal.addEventListener('click', (event) => {
  if (event.target === mediaViewModal) closeMediaViewModal();
});
if (mediaViewContent) mediaViewContent.addEventListener('pointerdown', (event) => {
  if (activeMediaAnnotationEditor && event.target !== activeMediaAnnotationEditor) activeMediaAnnotationEditor.blur();
});
if (window.whbr && window.whbr.media) {
  window.whbr.media.onUploaded(handleMobileMediaUploaded);
  window.whbr.media.onNetworkEvent(handleMediaNetworkEvent);
  window.whbr.media.onSessionExpired(handleMediaUploadExpired);
}
function getSelectedAudioInputDeviceId() {
  return asrInputDeviceSelect ? asrInputDeviceSelect.value : '';
}

async function refreshAudioInputDevices() {
  if (!asrInputDeviceSelect || !window.RizhiAsrAudioCapture) return;
  const previousDeviceId = asrInputDeviceSelect.value;
  asrRefreshDevicesButton.disabled = true;
  try {
    const devices = await window.RizhiAsrAudioCapture.getAudioInputDevices();
    asrInputDeviceSelect.replaceChildren();
    if (!devices.length) {
      const option = new Option('未发现可用麦克风', '');
      asrInputDeviceSelect.add(option);
      asrInputDeviceSelect.disabled = true;
      return;
    }

    devices.forEach((device, index) => {
      const label = device.label || `语音输入设备 ${index + 1}（授权后显示名称）`;
      asrInputDeviceSelect.add(new Option(label, device.deviceId));
    });
    asrInputDeviceSelect.disabled = false;
    const matchingDevice = devices.some((device) => device.deviceId === previousDeviceId);
    asrInputDeviceSelect.value = matchingDevice ? previousDeviceId : devices[0].deviceId;
  } catch (error) {
    asrInputDeviceSelect.replaceChildren(new Option('无法读取语音输入设备', ''));
    asrInputDeviceSelect.disabled = true;
    setInputFeedback(`无法读取设备：${error.message || String(error)}`, 'warning');
  } finally {
    asrRefreshDevicesButton.disabled = microphoneTestRecording || asrTestRecording;
  }
}

async function startMicrophoneTest() {
  if (microphoneTestRecording) return;
  if (journalVoiceRecording || dailyPlanVoiceRecording) {
    setInputFeedback('请先停止正在进行的语音输入，再开始麦克风测试。', 'warning');
    return;
  }
  if (asrTestRecording) {
    setInputFeedback('请先停止语音识别录音，再开始麦克风测试。', 'warning');
    return;
  }

  setMicrophoneTestControls(true);
  clearInputWaveform();
  setInputFeedback('正在请求麦克风权限…');
  try {
    await ensureMicrophoneTestCapture();
    const captureResult = await microphoneTestCapture.start();
    microphoneTestRecording = true;
    lastMicrophoneSoundAt = Date.now();
    setMicrophoneTestControls(true);
    setInputFeedback(`正在测试：输入 ${captureResult.inputSampleRate} Hz，波形已重采样至 ${captureResult.sampleRate} Hz。`, 'warning');
    startMicrophoneSilenceWatch();
    await refreshAudioInputDevices();
    setMicrophoneTestControls(true);
  } catch (error) {
    microphoneTestRecording = false;
    setMicrophoneTestControls(false);
    setInputFeedback(describeMicrophoneError(error), 'warning');
  }
}

async function stopMicrophoneTest() {
  if (!microphoneTestRecording) return;
  setMicrophoneTestControls(true, true);
  try {
    await microphoneTestCapture.stop();
    setInputFeedback('麦克风测试已停止。未保存或发送任何音频。');
  } catch (error) {
    setInputFeedback(describeMicrophoneError(error), 'warning');
  } finally {
    microphoneTestRecording = false;
    stopMicrophoneSilenceWatch();
    setMicrophoneTestControls(false);
  }
}

async function ensureMicrophoneTestCapture() {
  if (!window.RizhiAsrAudioCapture || !window.RizhiAsrAudioCapture.AudioCapture) {
    throw new Error('未能加载 AudioWorklet 麦克风采集模块。');
  }
  const deviceId = getSelectedAudioInputDeviceId();
  if (!microphoneTestCapture) {
    // This test does not invoke ASR, so it uses a neutral browser-audio target
    // rather than duplicating the model sample-rate configuration in renderer.
    microphoneTestCapture = new window.RizhiAsrAudioCapture.AudioCapture({
      sampleRate: MICROPHONE_TEST_SAMPLE_RATE,
      deviceId
    });
    microphoneTestUnsubscribe = microphoneTestCapture.onAudioFrame((frame) => {
      if (frame.error) {
        setInputFeedback(describeMicrophoneError(frame.error), 'warning');
        return;
      }
      drawInputWaveform(frame.samples);
      const level = calculateRms(frame.samples);
      if (level >= 0.012) {
        lastMicrophoneSoundAt = Date.now();
        setInputFeedback('麦克风工作正常，正在接收声音。', 'active');
      }
    });
  } else {
    microphoneTestCapture.setDeviceId(deviceId);
  }
  await microphoneTestCapture.initialize();
}

function calculateRms(samples) {
  if (!samples || !samples.length) return 0;
  let total = 0;
  for (let index = 0; index < samples.length; index += 1) total += samples[index] * samples[index];
  return Math.sqrt(total / samples.length);
}

function drawInputWaveform(samples) {
  if (!asrInputWaveform) return;
  const rect = asrInputWaveform.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(rect.width * ratio));
  const height = Math.max(1, Math.round(rect.height * ratio));
  if (asrInputWaveform.width !== width || asrInputWaveform.height !== height) {
    asrInputWaveform.width = width;
    asrInputWaveform.height = height;
  }

  const context = asrInputWaveform.getContext('2d');
  context.clearRect(0, 0, width, height);
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.strokeStyle = '#dbe2e8';
  context.lineWidth = ratio;
  context.beginPath();
  context.moveTo(0, height / 2);
  context.lineTo(width, height / 2);
  context.stroke();

  context.strokeStyle = '#21865e';
  context.lineWidth = Math.max(1, ratio * 1.5);
  context.beginPath();
  const step = Math.max(1, Math.ceil(samples.length / width));
  for (let x = 0, sampleIndex = 0; x < width; x += 1, sampleIndex += step) {
    const sample = samples[Math.min(sampleIndex, samples.length - 1)] || 0;
    const y = height / 2 - sample * height * 0.42;
    if (x === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.stroke();
}

function clearInputWaveform() {
  if (!asrInputWaveform) return;
  const context = asrInputWaveform.getContext('2d');
  if (!context) return;
  const rect = asrInputWaveform.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  asrInputWaveform.width = Math.max(1, Math.round(rect.width * ratio));
  asrInputWaveform.height = Math.max(1, Math.round(rect.height * ratio));
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, asrInputWaveform.width, asrInputWaveform.height);
  context.strokeStyle = '#dbe2e8';
  context.beginPath();
  context.moveTo(0, asrInputWaveform.height / 2);
  context.lineTo(asrInputWaveform.width, asrInputWaveform.height / 2);
  context.stroke();
}

function startMicrophoneSilenceWatch() {
  stopMicrophoneSilenceWatch();
  microphoneSilenceTimer = window.setInterval(() => {
    if ((microphoneTestRecording || asrTestRecording) && Date.now() - lastMicrophoneSoundAt >= 1200) {
      setInputFeedback('未接收到声音', 'warning');
    }
  }, 350);
}

function stopMicrophoneSilenceWatch() {
  if (microphoneSilenceTimer) window.clearInterval(microphoneSilenceTimer);
  microphoneSilenceTimer = null;
}

function startJournalVoiceSilenceWatch() {
  stopJournalVoiceSilenceWatch();
  journalVoiceSilenceTimer = window.setInterval(() => {
    if (journalVoiceRecording && Date.now() - journalVoiceLastSoundAt >= 1200) {
      setJournalVoiceStatus('未检测到声音输入。请检查麦克风或开始说话。', 'warning');
    }
  }, 350);
}

function stopJournalVoiceSilenceWatch() {
  if (journalVoiceSilenceTimer) window.clearInterval(journalVoiceSilenceTimer);
  journalVoiceSilenceTimer = null;
}

function startJournalVoiceDurationTimers(maxDurationSeconds) {
  stopJournalVoiceDurationTimers();
  const timers = scheduleVoiceDurationTimers(maxDurationSeconds, {
    isRecording: () => journalVoiceRecording,
    onWarning: () => {
      setJournalVoiceStatus('还有 10 秒录制时间，请准备结束本段录音。', 'warning');
      playJournalVoiceWarningTone(journalVoiceCapture);
    },
    onMaximum: () => void stopJournalVoiceInput({ automatic: true })
  });
  journalVoiceWarningTimer = timers.warningTimer;
  journalVoiceMaximumTimer = timers.maximumTimer;
}

function scheduleVoiceDurationTimers(maxDurationSeconds, handlers) {
  const maxSeconds = Math.max(1, Number(maxDurationSeconds) || 90);
  const warningDelayMs = Math.max(0, (maxSeconds - 10) * 1000);
  const warningTimer = window.setTimeout(() => {
    if (!handlers || typeof handlers.isRecording !== 'function' || !handlers.isRecording()) return;
    if (typeof handlers.onWarning === 'function') handlers.onWarning();
  }, warningDelayMs);
  const maximumTimer = window.setTimeout(() => {
    if (!handlers || typeof handlers.isRecording !== 'function' || !handlers.isRecording()) return;
    if (typeof handlers.onMaximum === 'function') handlers.onMaximum();
  }, maxSeconds * 1000);
  return { warningTimer, maximumTimer };
}

function stopJournalVoiceDurationTimers() {
  if (journalVoiceWarningTimer) window.clearTimeout(journalVoiceWarningTimer);
  if (journalVoiceMaximumTimer) window.clearTimeout(journalVoiceMaximumTimer);
  journalVoiceWarningTimer = null;
  journalVoiceMaximumTimer = null;
}

function formatVoiceDuration(totalSeconds) {
  const seconds = Math.max(0, Math.ceil(Number(totalSeconds) || 0));
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function setJournalVoiceTimer(text, hidden = false) {
  if (!journalVoiceTimer) return;
  journalVoiceTimer.textContent = text;
  journalVoiceTimer.classList.toggle('hidden', hidden);
}

function clearJournalVoiceTimer({ hide = false } = {}) {
  if (journalVoiceTimerInterval) window.clearInterval(journalVoiceTimerInterval);
  journalVoiceTimerInterval = null;
  if (hide) setJournalVoiceTimer('', true);
}

function startJournalVoiceRecordingTimer(maxDurationSeconds) {
  clearJournalVoiceTimer({ hide: true });
  journalVoiceRecordingStartedAt = Date.now();
  const maxSeconds = Math.max(1, Number(maxDurationSeconds) || 90);
  const render = () => {
    const elapsed = (Date.now() - journalVoiceRecordingStartedAt) / 1000;
    setJournalVoiceTimer(
      `录音 ${formatVoiceDuration(elapsed)} / ${formatVoiceDuration(maxSeconds)}（剩余 ${formatVoiceDuration(maxSeconds - elapsed)}）`
    );
  };
  render();
  journalVoiceTimerInterval = window.setInterval(render, 250);
}

function startJournalVoiceConversionTimer() {
  clearJournalVoiceTimer();
  journalVoiceConversionStartedAt = Date.now();
  const pendingAudioSeconds = Math.max(0.5, journalVoiceCapturedSeconds - journalVoiceDecodedSeconds);
  // The estimate uses actual speed from already decoded VAD segments. A
  // conservative fallback is used for the first segment of a fresh session.
  const realtimeFactor = journalVoiceDecodeRealtimeFactor || 1.2;
  const estimatedSeconds = Math.max(1, Math.ceil(pendingAudioSeconds * realtimeFactor));
  const render = () => {
    const elapsed = (Date.now() - journalVoiceConversionStartedAt) / 1000;
    const remaining = estimatedSeconds - elapsed;
    const suffix = remaining > 0
      ? `预计剩余 ${formatVoiceDuration(remaining)}`
      : '正在完成最后一段';
    setJournalVoiceTimer(`转换 ${formatVoiceDuration(elapsed)}（${suffix}）`);
  };
  render();
  journalVoiceTimerInterval = window.setInterval(render, 250);
}

function finishJournalVoiceConversionTimer() {
  if (!journalVoiceConversionStartedAt) return;
  const elapsed = (Date.now() - journalVoiceConversionStartedAt) / 1000;
  clearJournalVoiceTimer();
  setJournalVoiceTimer(`转换完成，耗时 ${formatVoiceDuration(elapsed)}`);
  journalVoiceConversionStartedAt = 0;
}

function updateJournalVoiceDecodeEstimate(payload) {
  const segmentSeconds = Number(payload && payload.segmentDurationSeconds);
  const decodeMilliseconds = Number(payload && payload.decodeElapsedMs);
  if (!(segmentSeconds > 0) || !(decodeMilliseconds >= 0)) return;
  journalVoiceDecodedSeconds += segmentSeconds;
  const observedFactor = decodeMilliseconds / (segmentSeconds * 1000);
  journalVoiceDecodeRealtimeFactor = journalVoiceDecodeRealtimeFactor > 0
    ? journalVoiceDecodeRealtimeFactor * 0.7 + observedFactor * 0.3
    : observedFactor;
}

function playJournalVoiceWarningTone(audioCapture = journalVoiceCapture) {
  const audioContext = audioCapture && audioCapture.audioContext;
  if (!audioContext || audioContext.state === 'closed') return;
  try {
    if (audioContext.state === 'suspended') void audioContext.resume();
    const startAt = audioContext.currentTime + 0.02;
    [0, 0.18].forEach((offset) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, startAt + offset);
      gain.gain.exponentialRampToValueAtTime(0.16, startAt + offset + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + offset + 0.13);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(startAt + offset);
      oscillator.stop(startAt + offset + 0.14);
    });
  } catch (error) {
    // The visible 10-second warning remains available if the system blocks sound.
  }
}

function setMicrophoneTestControls(recording, stopping = false) {
  if (asrMicTestStartButton) asrMicTestStartButton.disabled = recording;
  if (asrMicTestStopButton) asrMicTestStopButton.disabled = !recording || stopping;
  setInputDeviceControlsDisabled(recording);
}

function setInputDeviceControlsDisabled(disabled) {
  if (asrInputDeviceSelect) asrInputDeviceSelect.disabled = disabled;
  if (asrRefreshDevicesButton) asrRefreshDevicesButton.disabled = disabled;
}

function setInputFeedback(message, state = '') {
  if (!asrInputFeedback) return;
  asrInputFeedback.classList.remove('hidden');
  asrInputFeedback.classList.toggle('is-active', state === 'active');
  asrInputFeedback.classList.toggle('is-warning', state === 'warning');
  renderStatusContent(
    asrInputFeedback,
    message,
    state === 'warning' ? () => hideInlineStatus(asrInputFeedback) : null
  );
}

function describeMicrophoneError(error) {
  if (error && error.code === 'MIC_PERMISSION_DENIED') return `麦克风权限被拒绝：${error.message}`;
  if (error && error.code === 'MIC_DEVICE_NOT_FOUND') return `未找到语音输入设备：${error.message}`;
  return `麦克风测试失败：${error && error.message ? error.message : String(error)}`;
}

async function toggleJournalVoiceInput() {
  if (journalVoiceRecording) {
    await stopJournalVoiceInput();
    return;
  }
  await startJournalVoiceInput();
}

async function startJournalVoiceInput() {
  if (asrTestRecording || microphoneTestRecording || dailyPlanVoiceRecording) {
    setJournalVoiceStatus('请先停止设置页正在进行的音频操作。', true);
    return;
  }

  journalVoiceCanceled = false;
  journalVoiceProcessing = false;
  journalVoiceFinalInserted = false;
  journalVoiceHasInsertedSegment = false;
  journalVoiceOriginalContent = journalContent.value;
  journalVoiceCapturedSeconds = 0;
  journalVoiceDecodedSeconds = 0;
  journalVoiceDecodeRealtimeFactor = 0;
  journalVoiceConversionStartedAt = 0;
  clearJournalVoiceTimer({ hide: true });
  journalVoiceInsertionPoint = Number.isInteger(journalLastCursorPosition)
    ? journalLastCursorPosition
    : journalContent.value.length;
  journalVoiceOriginalInsertionPoint = journalVoiceInsertionPoint;
  setJournalVoiceControls('starting');
  setJournalVoiceStatus('正在加载本地语音识别器…');

  let serviceStarted = false;
  try {
    const api = getAsrTestApi();
    const initialization = await initializeAsrForUse(api);
    await ensureJournalVoiceCapture(initialization.sampleRate, api);
    const startResult = await api.start();
    ensureAsrSuccess(startResult);
    serviceStarted = true;

    await journalVoiceCapture.start();
    journalVoiceRecording = true;
    journalVoiceLastSoundAt = Date.now();
    startJournalVoiceSilenceWatch();
    startJournalVoiceDurationTimers(startResult.maxRecordingDurationSeconds || 90);
    startJournalVoiceRecordingTimer(startResult.maxRecordingDurationSeconds || 90);
    setJournalVoiceControls('recording');
    setJournalVoiceStatus(
      `单次录音最多 ${startResult.maxRecordingDurationSeconds || 90} 秒，建议以午休为界分别录制上、下午音频。VAD 已开启。`,
      'active'
    );
  } catch (error) {
    journalVoiceCanceled = true;
    if (serviceStarted) {
      try {
        await getAsrTestApi().cancel();
      } catch (cancelError) {
        // The original microphone/model error is more useful to the user.
      }
    }
    await stopJournalVoiceCapture();
    journalVoiceRecording = false;
    stopJournalVoiceSilenceWatch();
    clearJournalVoiceTimer({ hide: true });
    resetJournalVoiceControls();
    setJournalVoiceStatus(describeJournalVoiceError(error), true);
  }
}

async function stopJournalVoiceInput({ automatic = false } = {}) {
  if (!journalVoiceRecording) return;
  // Keep journalVoiceRecording true until the Worker finishes draining the
  // buffered frames, so its final VAD segments can still reach the textarea.
  journalVoiceProcessing = true;
  stopJournalVoiceSilenceWatch();
  stopJournalVoiceDurationTimers();
  startJournalVoiceConversionTimer();
  setJournalVoiceControls('processing');
  setJournalVoiceStatus('已结束本次录制，正在转成文本…');
  try {
    // AudioCapture.stop() immediately releases media tracks, then flushes only
    // the already buffered PCM before the Worker performs final decoding.
    await stopJournalVoiceCapture();
    const result = await getAsrTestApi().stop();
    ensureAsrSuccess(result);
    if (!journalVoiceCanceled && !journalVoiceFinalInserted) {
      finalizeJournalVoiceInput(result.finalText || '');
    }
    if (automatic) setJournalVoiceStatus('已结束本次录制，语音文本已转换并插入记录。');
  } catch (error) {
    clearJournalVoiceTimer({ hide: true });
    setJournalVoiceStatus(describeJournalVoiceError(error), true);
  } finally {
    journalVoiceRecording = false;
    journalVoiceProcessing = false;
    stopJournalVoiceSilenceWatch();
    stopJournalVoiceDurationTimers();
    resetJournalVoiceControls();
  }
}

async function cancelJournalVoiceInput() {
  if (!journalVoiceRecording) return;
  journalVoiceCanceled = true;
  journalVoiceProcessing = true;
  clearJournalVoiceTimer({ hide: true });
  setJournalVoiceControls('processing');
  setJournalVoiceStatus('正在取消本次语音输入…');
  try {
    await stopJournalVoiceCapture();
    const result = await getAsrTestApi().cancel();
    ensureAsrSuccess(result);
    journalContent.value = journalVoiceOriginalContent;
    const restorePosition = Math.max(
      0,
      Math.min(journalVoiceOriginalInsertionPoint || 0, journalContent.value.length)
    );
    journalContent.focus();
    journalContent.setSelectionRange(restorePosition, restorePosition);
    journalLastCursorPosition = restorePosition;
    setJournalVoiceStatus('已取消本次语音输入，未写入记录。');
  } catch (error) {
    setJournalVoiceStatus(describeJournalVoiceError(error), true);
  } finally {
    journalVoiceRecording = false;
    journalVoiceProcessing = false;
    stopJournalVoiceSilenceWatch();
    stopJournalVoiceDurationTimers();
    resetJournalVoiceControls();
  }
}

async function ensureJournalVoiceCapture(sampleRate, api) {
  if (!window.RizhiAsrAudioCapture || !window.RizhiAsrAudioCapture.AudioCapture) {
    throw new Error('未能加载本地音频采集模块。');
  }
  if (journalVoiceCapture && journalVoiceCapture.sampleRate !== sampleRate) {
    await journalVoiceCapture.dispose();
    journalVoiceCapture = null;
  }
  if (!journalVoiceCapture) {
    journalVoiceCapture = new window.RizhiAsrAudioCapture.AudioCapture({
      sampleRate,
      deviceId: getSelectedAudioInputDeviceId()
    });
    journalVoiceCaptureUnsubscribe = journalVoiceCapture.onAudioFrame((frame) => {
      if (frame.error) {
        setJournalVoiceStatus(describeJournalVoiceError(frame.error), true);
        return;
      }
      if (calculateRms(frame.samples) >= 0.012) {
        journalVoiceLastSoundAt = Date.now();
      }
      journalVoiceCapturedSeconds += frame.samples.length / frame.sampleRate;
      try {
        api.sendAudioFrame(frame.sampleRate, frame.samples);
      } catch (error) {
        setJournalVoiceStatus(describeJournalVoiceError(error), true);
      }
    });
  } else {
    journalVoiceCapture.setDeviceId(getSelectedAudioInputDeviceId());
  }
  await journalVoiceCapture.initialize();
}

async function stopJournalVoiceCapture() {
  if (journalVoiceCapture) await journalVoiceCapture.stop();
}

function insertJournalVoiceSegmentText(value) {
  if (journalVoiceCanceled) return false;
  const segmentText = clean(value);
  if (!segmentText) return false;
  const currentValue = journalContent.value;
  const rawPosition = Number.isInteger(journalVoiceInsertionPoint)
    ? journalVoiceInsertionPoint
    : currentValue.length;
  const position = Math.max(0, Math.min(rawPosition, currentValue.length));
  const before = currentValue.slice(0, position);
  const after = currentValue.slice(position);
  const insertedText = segmentText;
  journalContent.value = `${before}${insertedText}${after}`;
  const caretPosition = position + insertedText.length;
  journalContent.focus();
  journalContent.setSelectionRange(caretPosition, caretPosition);
  journalLastCursorPosition = caretPosition;
  journalVoiceInsertionPoint = caretPosition;
  journalVoiceHasInsertedSegment = true;
  journalSaveState.textContent = '已插入语音文本，尚未保存';
  return true;
}

function finalizeJournalVoiceInput(value) {
  if (journalVoiceCanceled || journalVoiceFinalInserted) return;
  journalVoiceFinalInserted = true;
  if (!journalVoiceHasInsertedSegment) insertJournalVoiceSegmentText(value);
  if (journalVoiceProcessing) finishJournalVoiceConversionTimer();
  setJournalVoiceStatus(
    journalVoiceHasInsertedSegment
      ? '语音段已直接插入记录。请按“保存记录”写入本地数据。'
      : '未识别到清晰语音，未修改记录。'
  );
}

function rememberJournalCursorPosition() {
  if (Number.isInteger(journalContent.selectionStart)) {
    journalLastCursorPosition = journalContent.selectionStart;
  }
}

function setJournalVoiceControls(state) {
  if (!journalVoiceStartButton || !journalVoiceCancelButton) return;
  if (state === 'recording') {
    journalVoiceStartButton.disabled = false;
    journalVoiceStartButton.textContent = '● 正在聆听，点击停止';
    journalVoiceCancelButton.classList.remove('hidden');
    journalVoiceCancelButton.disabled = false;
    return;
  }
  if (state === 'starting' || state === 'processing') {
    journalVoiceStartButton.disabled = true;
    journalVoiceStartButton.textContent = state === 'processing' ? '正在识别…' : '正在准备…';
    journalVoiceCancelButton.classList.toggle('hidden', state === 'starting');
    journalVoiceCancelButton.disabled = true;
    return;
  }
  resetJournalVoiceControls();
}

function resetJournalVoiceControls() {
  if (!journalVoiceStartButton || !journalVoiceCancelButton) return;
  journalVoiceStartButton.disabled = false;
  journalVoiceStartButton.textContent = '🎤 语音输入';
  journalVoiceCancelButton.disabled = false;
  journalVoiceCancelButton.classList.add('hidden');
}

function setJournalVoiceStatus(message, state = '') {
  if (!journalVoiceStatus) return;
  journalVoiceStatus.classList.remove('hidden');
  const normalizedState = state === true ? 'error' : state;
  journalVoiceStatus.classList.toggle('is-error', normalizedState === 'error');
  journalVoiceStatus.classList.toggle('is-active', normalizedState === 'active');
  journalVoiceStatus.classList.toggle('is-warning', normalizedState === 'warning');
  renderStatusContent(
    journalVoiceStatus,
    message,
    normalizedState === 'warning' ? () => hideInlineStatus(journalVoiceStatus) : null
  );
}

function describeJournalVoiceError(error) {
  if (error && error.code === 'ASR_MODEL_DOWNLOADING') return '模型正在下载中，请稍后使用。';
  if (error && error.code === 'ASR_MODEL_DOWNLOAD_CANCELED') return '已取消模型下载。需要时可再次点击“语音输入”。';
  if (error && error.code === 'MIC_PERMISSION_DENIED') return `无法开始语音输入：${error.message}`;
  if (error && error.code === 'MIC_DEVICE_NOT_FOUND') return `无法开始语音输入：${error.message}`;
  return `语音输入失败：${error && error.message ? error.message : String(error)}`;
}

function getAsrTestApi() {
  const api = window.whbr && window.whbr.asr;
  if (!api) throw new Error('ASR IPC 接口不可用。请重新启动应用后重试。');
  return api;
}

function formatAsrModelSize(bytes) {
  const value = Number(bytes || 0);
  if (!Number.isFinite(value) || value <= 0) return '较大的模型文件';
  return `${Math.round((value / 1024 / 1024) * 10) / 10} MB`;
}

function formatAsrModelName(status = {}) {
  const modelId = clean(status.modelId);
  const qwenMatch = modelId.match(/qwen3-asr-([\d.]+[a-z]?)-int8/i);
  if (qwenMatch) return `Qwen3-ASR ${qwenMatch[1].toUpperCase()}（INT8）`;
  return modelId || '离线语音模型';
}

function updateAsrModelStatus(status = {}) {
  latestAsrModelStatus = status;
  if (status.downloadDirectory) {
    asrModelDownloadDirectory = status.downloadDirectory;
    updateStoragePathView();
  }
  if (!asrModelStatus) return;
  const state = status.state || 'not-installed';
  const progress = status.progress || {};
  const downloadSize = formatAsrModelSize(status.downloadSizeBytes);
  const modelName = formatAsrModelName(status);
  let message = `未安装：${modelName}。点击右侧按钮下载。`;
  if (state === 'downloading') {
    message = `正在下载：${modelName}。`;
  } else if (state === 'installed') {
    message = status.source === 'development'
      ? `已安装：${modelName}（开发模型目录）。`
      : `已安装：${modelName}。`;
  } else if (state === 'failed') {
    message = `未安装：${modelName}。下载失败，请重试。`;
  } else {
    message = `未安装：${modelName}（约 ${downloadSize}）。点击右侧按钮下载。`;
  }
  asrModelStatus.textContent = message;
  asrModelStatus.classList.toggle('is-ready', state === 'installed');
  asrModelStatus.classList.toggle('is-error', state === 'failed');
  updateSettingsAsrDownloadProgress(status);

  if (!asrModelDownloadButton) return;
  const canDownload = status.canDownload !== false;
  asrModelDownloadButton.classList.toggle('hidden', state === 'installed' || !canDownload);
  asrModelDownloadButton.disabled = state === 'downloading' || !canDownload;
  asrModelDownloadButton.textContent = state === 'failed' ? '重试下载' : `下载 ${modelName}`;
}

function updateSettingsAsrDownloadProgress(status = latestAsrModelStatus) {
  if (!settingsAsrDownloadProgress) return;
  const isDownloading = status && status.state === 'downloading' && currentPageKey() === 'settings';
  settingsAsrDownloadProgress.classList.toggle('hidden', !isDownloading);
  if (!isDownloading) return;
  const progress = status.progress || {};
  if (progress.phase === 'extracting') settingsAsrDownloadProgress.textContent = '正在解压语音模型…';
  else if (progress.phase === 'verifying') settingsAsrDownloadProgress.textContent = '正在校验语音模型…';
  else if (Number.isFinite(progress.percent)) settingsAsrDownloadProgress.textContent = `正在下载模型 ${progress.percent}%`;
  else settingsAsrDownloadProgress.textContent = '正在准备模型下载…';
}

function getUpdateApi() {
  return window.whbr && window.whbr.updates ? window.whbr.updates : null;
}

function formatUpdateVersion(version) {
  const value = clean(version);
  if (!value) return '';
  return value.startsWith('v') ? value : `v${value}`;
}

function updateVersionPanel(status = latestUpdateStatus) {
  latestUpdateStatus = status && typeof status === 'object' ? status : { status: 'idle' };
  const state = latestUpdateStatus.status || 'idle';
  const version = formatUpdateVersion(latestUpdateStatus.version);
  const currentVersion = formatUpdateVersion(latestUpdateStatus.currentVersion);
  if (updateCurrentVersion && currentVersion) updateCurrentVersion.textContent = `版本 ${currentVersion}`;

  const message = {
    idle: '尚未检查更新。',
    checking: '正在检查新版本…',
    'up-to-date': '已经是最新版本。',
    available: `发现 ${version || '新版本'}，可以升级。`,
    downloaded: `${version || '新版本'} 已下载完成，正在准备安装。`,
    unavailable: latestUpdateStatus.error || '当前环境无法检查版本更新。',
    error: latestUpdateStatus.error || '检查更新失败，请稍后重试。'
  }[state] || '尚未检查更新。';
  const downloadingMessage = Number.isFinite(Number(latestUpdateStatus.progress))
    ? `正在下载 ${version || '新版本'}：${Math.round(Number(latestUpdateStatus.progress))}%`
    : `正在下载 ${version || '新版本'}…`;

  if (updateCheckStatus) {
    updateCheckStatus.textContent = state === 'downloading' ? downloadingMessage : message;
    updateCheckStatus.classList.toggle('is-error', state === 'error');
  }
  if (checkForUpdatesButton) {
    checkForUpdatesButton.disabled = state === 'checking' || state === 'downloading';
    checkForUpdatesButton.textContent = state === 'checking' ? '检查中…' : '查看版本更新';
  }
  if (downloadUpdateButton) {
    const canDownload = state === 'available';
    downloadUpdateButton.classList.toggle('hidden', !canDownload);
    downloadUpdateButton.disabled = !canDownload;
    downloadUpdateButton.textContent = version ? `升级至 ${version}` : '升级至新版本';
  }
}

function subscribeToUpdateEvents() {
  const api = getUpdateApi();
  if (!api || typeof api.onStatus !== 'function') return;
  api.onStatus((status) => updateVersionPanel(status));
}

async function refreshUpdateStatus() {
  const api = getUpdateApi();
  if (!api || typeof api.getStatus !== 'function') return;
  try {
    updateVersionPanel(await api.getStatus());
  } catch (error) {
    updateVersionPanel({ status: 'error', error: error.message || String(error) });
  }
}

async function checkForApplicationUpdates() {
  const api = getUpdateApi();
  if (!api || typeof api.check !== 'function') return;
  updateVersionPanel({ ...latestUpdateStatus, status: 'checking', error: '' });
  try {
    updateVersionPanel(await api.check());
  } catch (error) {
    updateVersionPanel({ status: 'error', error: error.message || String(error) });
  }
}

async function downloadApplicationUpdate() {
  const api = getUpdateApi();
  if (!api || typeof api.download !== 'function') return;
  updateVersionPanel({ ...latestUpdateStatus, status: 'downloading', progress: 0, error: '' });
  try {
    updateVersionPanel(await api.download());
  } catch (error) {
    updateVersionPanel({ status: 'error', error: error.message || String(error) });
  }
}

async function refreshAsrModelStatus() {
  try {
    const result = await getAsrTestApi().getModelStatus();
    updateAsrModelStatus(ensureAsrSuccess(result));
    return result;
  } catch (error) {
    updateAsrModelStatus({ state: 'failed', error: { message: error.message || String(error) } });
    return null;
  }
}

async function refreshApplicationStatus() {
  if (appStatusRefreshInFlight) return;
  appStatusRefreshInFlight = true;
  if (refreshStatusButton) {
    refreshStatusButton.disabled = true;
    refreshStatusButton.classList.add('is-refreshing');
  }

  try {
    await Promise.all([
      refreshAsrModelStatus(),
      refreshAudioInputDevices(),
      refreshSystemTime()
    ]);
    setStatus('软件状态已刷新。', '', 2500);
  } finally {
    appStatusRefreshInFlight = false;
    if (refreshStatusButton) {
      refreshStatusButton.disabled = false;
      refreshStatusButton.classList.remove('is-refreshing');
    }
  }
}

async function confirmAndDownloadAsrModel(api) {
  let status = ensureAsrSuccess(await api.getModelStatus());
  updateAsrModelStatus(status);
  if (status.isReady) return status;
  if (status.state === 'downloading' || asrModelDownloadInFlight) {
    const error = new Error('模型正在下载中，请稍后使用。');
    error.code = 'ASR_MODEL_DOWNLOADING';
    throw error;
  }
  if (status.canDownload === false) {
    const error = new Error('开发模型目录不完整。请检查开发模型配置。');
    error.code = 'ASR_MODEL_NOT_READY';
    throw error;
  }

  while (!status.isReady) {
    const size = formatAsrModelSize(status.downloadSizeBytes);
    const response = await window.whbr.showMessageBox({
      type: status.state === 'failed' ? 'error' : 'question',
      title: '下载离线语音模型',
      message: status.state === 'failed'
        ? '离线语音模型下载失败。'
        : `首次使用离线语音输入，需要下载语音识别模型（约 ${size}）。`,
      detail: status.state === 'failed'
        ? `${status.error && status.error.message ? status.error.message : '请检查网络连接后重试。'}\n模型下载完成后即可离线使用。`
        : '模型下载完成后即可离线使用。下载仅来自 sherpa-onnx 官方发布页。',
      buttons: [status.state === 'failed' ? '重试下载' : '下载模型', '取消'],
      defaultId: 0,
      cancelId: 1
    });
    if (!response || response.response !== 0) {
      const error = new Error('已取消下载离线语音模型。');
      error.code = 'ASR_MODEL_DOWNLOAD_CANCELED';
      throw error;
    }

    try {
      asrModelDownloadInFlight = true;
      updateAsrModelStatus({ ...status, state: 'downloading', progress: { phase: 'preparing', percent: 0 } });
      status = ensureAsrSuccess(await api.downloadModel());
      updateAsrModelStatus(status);
    } catch (error) {
      status = ensureAsrSuccess(await api.getModelStatus());
      updateAsrModelStatus(status);
      if (status.state !== 'failed') throw error;
    } finally {
      asrModelDownloadInFlight = false;
    }
  }
  return status;
}

async function initializeAsrForUse(api) {
  await confirmAndDownloadAsrModel(api);
  return ensureAsrSuccess(await api.initialize());
}

async function downloadAsrModelFromSettings() {
  if (asrModelDownloadInFlight) return;
  try {
    await confirmAndDownloadAsrModel(getAsrTestApi());
  } catch (error) {
    if (error && error.code === 'ASR_MODEL_DOWNLOAD_CANCELED') return;
    updateAsrModelStatus({ state: 'failed', error: { message: error.message || String(error) } });
  }
}

async function openModelDirectory() {
  try {
    const result = ensureAsrSuccess(await getAsrTestApi().openModelDirectory());
    if (result.error) setStatus(`打开模型文件夹失败：${result.error}`, 'error', 3000);
  } catch (error) {
    setStatus(`打开模型文件夹失败：${error.message || String(error)}`, 'error', 3000);
  }
}

function subscribeToAsrTestEvents() {
  if (!window.whbr || !window.whbr.asr) return;
  window.whbr.asr.onModelStatus((payload) => updateAsrModelStatus(payload));
  window.whbr.asr.onPartialResult((payload) => {
    if (asrTestRecording && asrPartialResult) {
      asrPartialResult.textContent = payload.text || '正在分析语音…';
      setAsrTestStatus('正在录音；已更新部分识别结果。');
    }
    if (journalVoiceRecording && !journalVoiceCanceled) {
      updateJournalVoiceDecodeEstimate(payload);
      if (insertJournalVoiceSegmentText(payload.segmentText || '') && !journalVoiceProcessing) {
        setJournalVoiceStatus('VAD 已完成一段语音，文本已直接插入。继续说话或点击停止。', 'active');
      }
    }
    if (dailyPlanVoiceRecording && !dailyPlanVoiceCanceled) {
      updateDailyPlanVoiceDecodeEstimate(payload);
      if (!dailyPlanVoiceProcessing && !dailyPlanVoiceWarningActive) {
        setDailyPlanVoiceStatus('已接收一段语音，停止录音后将显示完整原始文字。');
      }
    }
  });
  window.whbr.asr.onFinalResult((payload) => {
    if (asrTestRecording && asrFinalResult) {
      asrFinalResult.textContent = payload.text || '未识别到清晰语音。';
      setAsrTestStatus('识别完成。最终文本已显示。');
    }
    if (journalVoiceRecording && !journalVoiceCanceled) {
      finalizeJournalVoiceInput(payload.text || '');
    }
    if (dailyPlanVoiceRecording && !dailyPlanVoiceCanceled && dailyPlanVoiceText) {
      dailyPlanVoiceText.value = payload.text || '';
      dailyPlanVoiceFinalReceived = true;
      if (dailyPlanVoiceProcessing) finishDailyPlanVoiceConversionTimer();
      setDailyPlanVoiceStatus('识别完成。请检查并编辑原始文字，确认解析后点击“创建任务”保存。');
    }
  });
  window.whbr.asr.onVadState((payload) => {
    if (journalVoiceRecording && !journalVoiceCanceled && !journalVoiceProcessing && payload.detected) {
      setJournalVoiceStatus('VAD 已检测到语音，正在等待停顿后识别…', 'active');
    }
  });
  window.whbr.asr.onRecordingLimit(() => {
    if (asrTestRecording) {
      asrTestRecording = false;
      stopMicrophoneSilenceWatch();
      setAsrTestControls(false);
      setInputDeviceControlsDisabled(false);
      if (asrTestCapture) void asrTestCapture.stop().catch(() => {});
      setAsrTestStatus('已结束录制，正在显示已识别的文本。');
    }
    if (journalVoiceRecording) {
      // The worker has already emitted its final aggregated text. Stop the
      // renderer capture promptly so the microphone indicator turns off.
      void stopJournalVoiceCapture();
      journalVoiceRecording = false;
      journalVoiceProcessing = false;
      stopJournalVoiceSilenceWatch();
      stopJournalVoiceDurationTimers();
      clearJournalVoiceTimer();
      setJournalVoiceTimer('录音已自动结束，文本转换完成。');
      resetJournalVoiceControls();
      setJournalVoiceStatus('已结束录制，语音文本已转换并插入记录。');
    }
    if (dailyPlanVoiceRecording && !dailyPlanVoiceProcessing) {
      void stopDailyPlanVoiceCapture();
      dailyPlanVoiceRecording = false;
      dailyPlanVoiceProcessing = false;
      stopDailyPlanVoiceDurationTimers();
      clearDailyPlanVoiceTimer();
      setDailyPlanVoiceTimer('录音已自动结束，文本转换完成。');
      setDailyPlanVoiceControls('idle');
      setDailyPlanVoiceStatus('已结束录制，识别文字已显示。请检查并编辑。');
    }
  });
  window.whbr.asr.onError((payload) => {
    if (asrTestRecording) {
      setAsrTestStatus(`语音识别失败：${payload.message || '未知错误。'}`, true);
      setAsrTestControls(false);
      setInputDeviceControlsDisabled(false);
      asrTestRecording = false;
      stopMicrophoneSilenceWatch();
      if (asrTestCapture) void asrTestCapture.stop().catch(() => {});
    }
    if (journalVoiceRecording) {
      journalVoiceCanceled = true;
      void stopJournalVoiceCapture();
      journalVoiceRecording = false;
      journalVoiceProcessing = false;
      stopJournalVoiceSilenceWatch();
      stopJournalVoiceDurationTimers();
      clearJournalVoiceTimer({ hide: true });
      setJournalVoiceStatus(`语音输入失败：${payload.message || '未知错误。'}`, true);
      resetJournalVoiceControls();
    }
    if (dailyPlanVoiceRecording) {
      dailyPlanVoiceCanceled = true;
      void stopDailyPlanVoiceCapture();
      dailyPlanVoiceRecording = false;
      setDailyPlanVoiceControls('idle');
      dailyPlanVoiceProcessing = false;
      stopDailyPlanVoiceDurationTimers();
      clearDailyPlanVoiceTimer({ hide: true });
      setDailyPlanVoiceStatus(`语音创建任务失败：${payload.message || '未知错误。'}`, true);
    }
  });
}

async function startRecording() {
  if (asrTestRecording) return;
  if (journalVoiceRecording || dailyPlanVoiceRecording) {
    setAsrTestStatus('请先停止正在进行的语音输入，再开始语音识别。', true);
    return;
  }
  if (microphoneTestRecording) {
    setAsrTestStatus('请先停止麦克风测试，再开始语音识别。', true);
    return;
  }
  setAsrTestControls(true);
  setInputDeviceControlsDisabled(true);
  if (asrPartialResult) asrPartialResult.textContent = '—';
  if (asrFinalResult) asrFinalResult.textContent = '—';

  let serviceStarted = false;
  try {
    const api = getAsrTestApi();
    const modelStatus = ensureAsrSuccess(await api.getModelStatus());
    const needsModelInstallation = !modelStatus.isReady;
    setAsrTestStatus(needsModelInstallation
      ? '正在下载离线语音模型。等模型安装好后再次点击“开始录音”进行测试。'
      : '正在加载本地语音模型；首次加载可能需要一些时间…');
    const initialization = await initializeAsrForUse(api);

    if (needsModelInstallation) {
      setAsrTestControls(false);
      setInputDeviceControlsDisabled(false);
      setAsrTestStatus('模型已安装。请再次点击“开始录音”进行测试。');
      return;
    }

    await ensureAsrTestCapture(initialization.sampleRate, api);
    setAsrTestStatus('正在准备本地识别器…');
    const startResult = await api.start();
    ensureAsrSuccess(startResult);
    serviceStarted = true;

    setAsrTestStatus('请允许麦克风权限，然后开始说话。');
    const captureResult = await asrTestCapture.start();
    asrTestRecording = true;
    clearInputWaveform();
    lastMicrophoneSoundAt = Date.now();
    startMicrophoneSilenceWatch();
    setAsrTestControls(true);
    setAsrTestStatus(`正在录音。VAD 已开启，单次最长 ${startResult.maxRecordingDurationSeconds || 90} 秒；输入设备 ${captureResult.inputSampleRate} Hz，已重采样至 ${captureResult.sampleRate} Hz。`);
    setInputFeedback('正在监听语音识别输入。', 'warning');
  } catch (error) {
    if (serviceStarted) {
      try {
        await getAsrTestApi().stop();
      } catch (stopError) {
        // The original error gives the user the actionable cause.
      }
    }
    asrTestRecording = false;
    setAsrTestControls(false);
    setInputDeviceControlsDisabled(false);
    setAsrTestStatus(describeAsrTestError(error), true);
  }
}

async function stopRecording() {
  if (!asrTestRecording) return;
  setAsrTestControls(true, true);
  setAsrTestStatus('正在停止麦克风并生成最终文本…');
  try {
    await asrTestCapture.stop();
    const result = await getAsrTestApi().stop();
    ensureAsrSuccess(result);
    if (result.finalText && asrFinalResult) asrFinalResult.textContent = result.finalText;
    setAsrTestStatus('识别完成。最终文本已显示。');
    setInputFeedback('语音识别录音已停止。');
  } catch (error) {
    setAsrTestStatus(describeAsrTestError(error), true);
  } finally {
    asrTestRecording = false;
    stopMicrophoneSilenceWatch();
    setAsrTestControls(false);
    setInputDeviceControlsDisabled(false);
  }
}

async function ensureAsrTestCapture(sampleRate, api) {
  if (!window.RizhiAsrAudioCapture || !window.RizhiAsrAudioCapture.AudioCapture) {
    throw new Error('未能加载 AudioWorklet 采集模块。');
  }
  if (asrTestCapture && asrTestCapture.sampleRate !== sampleRate) {
    await asrTestCapture.dispose();
    asrTestCapture = null;
  }
  if (!asrTestCapture) {
    asrTestCapture = new window.RizhiAsrAudioCapture.AudioCapture({
      sampleRate,
      deviceId: getSelectedAudioInputDeviceId()
    });
    asrTestCaptureUnsubscribe = asrTestCapture.onAudioFrame((frame) => {
      if (frame.error) {
        setAsrTestStatus(describeAsrTestError(frame.error), true);
        setInputFeedback(describeMicrophoneError(frame.error), 'warning');
        return;
      }
      drawInputWaveform(frame.samples);
      if (calculateRms(frame.samples) >= 0.012) {
        lastMicrophoneSoundAt = Date.now();
        if (asrTestRecording) setInputFeedback('正在接收语音识别输入。', 'active');
      }
      try {
        api.sendAudioFrame(frame.sampleRate, frame.samples);
      } catch (error) {
        setAsrTestStatus(describeAsrTestError(error), true);
      }
    });
  } else {
    asrTestCapture.setDeviceId(getSelectedAudioInputDeviceId());
  }
  await asrTestCapture.initialize();
}

function ensureAsrSuccess(result) {
  if (result && result.ok) return result;
  const error = new Error(result && result.error && result.error.message ? result.error.message : 'ASR 请求失败。');
  error.code = result && result.error && result.error.code ? result.error.code : 'ASR_REQUEST_FAILED';
  throw error;
}

function describeAsrTestError(error) {
  const message = error && error.message ? error.message : String(error || '未知错误。');
  if (error && error.code === 'ASR_MODEL_DOWNLOADING') return '模型正在下载中，请稍后使用。';
  if (error && error.code === 'MIC_PERMISSION_DENIED') return `无法开始录音：${message}`;
  if (error && error.code === 'MIC_DEVICE_NOT_FOUND') return `无法开始录音：${message}`;
  if (error && error.code === 'ASR_MODEL_DOWNLOAD_CANCELED') return '已取消模型下载。需要时可再次点击“开始录音”。';
  return `语音识别测试失败：${message}`;
}

function setAsrTestControls(recording, stopping = false) {
  if (!asrTestStartButton || !asrTestStopButton) return;
  asrTestStartButton.disabled = recording;
  asrTestStopButton.disabled = !recording || stopping;
}

function setAsrTestStatus(message, isError = false) {
  if (!asrTestStatus) return;
  asrTestStatus.textContent = message;
  asrTestStatus.classList.toggle('is-error', Boolean(isError));
}

async function refreshSystemTime() {
  const previousDate = currentEffectiveNow ? formatLocalDate(currentEffectiveNow) : '';
  const now = await getEffectiveNow();
  currentEffectiveNow = now;
  const today = formatLocalDate(now);
  const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][now.getDay()];
  systemTime.textContent = `${formatClockDate(now)} ${weekday} ${formatClockTime(now)}`;
  updateTaskDateAfterMidnight(previousDate, today);
  updateTaskTemporalView();
  if (pages.profile.classList.contains('active')) renderProfileStats();
  publishFloatingTask(now);
}

function publishFloatingTask(now = currentEffectiveNow || new Date()) {
  if (!window.whbr || typeof window.whbr.updateFloatingTask !== 'function') return;
  const activeTask = findFloatingTask(now);
  const status = activeTask ? floatingTaskStatus(activeTask, now) : null;
  const stateKey = activeTask ? `${activeTask.id}|${status.state}` : 'idle';
  const shouldFlash = floatingTaskStateInitialized && stateKey !== previousFloatingTaskStateKey;
  previousFloatingTaskStateKey = stateKey;
  floatingTaskStateInitialized = true;

  window.whbr.updateFloatingTask(activeTask ? {
    active: true,
    title: clean(activeTask.title) || '未命名任务',
    timeRange: `${normalizeTime(activeTask.startTime)} - ${normalizeTime(activeTask.endTime)}`,
    details: clean(activeTask.planDetails) || clean(activeTask.details) || '暂未填写事前计划或备注',
    ...status
  } : {
    active: false,
    state: 'idle',
    stateLabel: '当前暂无任务',
    title: '暂无进行中的任务',
    timeRange: '等待下一项安排',
    countdownLabel: '等待下一项',
    countdown: '--:--',
    details: '最小化时会自动显示当前进行的任务。'
  });

  if (shouldFlash && typeof window.whbr.flashFloatingTask === 'function') {
    window.whbr.flashFloatingTask();
  }
}

function findFloatingTask(now) {
  const today = formatLocalDate(now);
  const previousDate = shiftDate(today, -1);
  const currentMinute = now.getHours() * 60 + now.getMinutes();
  return sortTasksForDisplay(tasks.filter((task) => {
    if (!isRenderableTask(task)) return false;
    const taskDate = normalizeDate(task.date);
    const start = timeToMinutes(task.startTime);
    const end = timeToMinutes(task.endTime);
    if (start === null || end === null) return false;
    if (isAllDayRange(task.startTime, task.endTime)) return taskDate === today;
    if (start === end) return false;
    if (taskDate === today) return classifyTaskStage(task, now) === 'current';
    return taskDate === previousDate && end < start && currentMinute < end;
  }))[0] || null;
}

function floatingTaskStatus(task, now) {
  const category = taskCategoryForTask(task);
  const categoryName = category ? category.name : '任务';
  const categoryColor = category ? category.color : '#8b96a3';
  const remainingSeconds = floatingTaskRemainingSeconds(task, now);
  if (!category || !category.cycleEnabled) {
    const isLifeCategory = category && (category.id === 'category-life' || category.name === '生活');
    return {
      state: 'focus',
      stateLabel: `${categoryName}进行中`,
      countdownLabel: isLifeCategory ? '' : '任务剩余',
      countdown: isLifeCategory ? '' : formatCountdown(remainingSeconds),
      categoryColor
    };
  }

  const focusSeconds = numericSetting(category.focusMinutes, 50) * 60;
  const breakSeconds = numericSetting(category.breakMinutes, 10) * 60;
  const elapsedSeconds = floatingTaskElapsedSeconds(task, now);
  const cycleSeconds = focusSeconds + breakSeconds;
  const phaseSeconds = cycleSeconds > 0 ? elapsedSeconds % cycleSeconds : 0;
  const inBreak = phaseSeconds >= focusSeconds;
  const secondsUntilSwitch = inBreak ? cycleSeconds - phaseSeconds : focusSeconds - phaseSeconds;
  return {
    state: inBreak ? 'break' : 'focus',
    stateLabel: inBreak ? '休息中' : `${categoryName}中`,
    countdownLabel: inBreak ? '休息剩余' : '专注剩余',
    countdown: formatCountdown(Math.min(remainingSeconds, secondsUntilSwitch)),
    categoryColor
  };
}

function floatingTaskElapsedSeconds(task, now) {
  const date = parseLocalDate(normalizeDate(task.date));
  const start = timeToMinutes(task.startTime);
  if (!date || start === null) return 0;
  const startAt = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(start / 60), start % 60).getTime();
  return Math.max(0, Math.floor((now.getTime() - startAt) / 1000));
}

function floatingTaskRemainingSeconds(task, now) {
  const duration = taskDurationMinutes(task);
  return Math.max(0, duration * 60 - floatingTaskElapsedSeconds(task, now));
}

function formatCountdown(totalSeconds) {
  const safeSeconds = Math.max(0, Math.ceil(Number(totalSeconds) || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateTaskDateAfterMidnight(previousDate, today) {
  if (!previousDate || previousDate === today) return;
  if (!pages.tasks.classList.contains('active')) return;
  if (normalizeDate(taskDateFilter.value) !== previousDate) return;

  setDateInputValue(taskDateFilter, today);
  activePlanningDates.add(today);
  renderTasks({ scrollToCurrent: true, forceScroll: true });
}

function openTutorialConfirmModal() {
  previousTutorialPage = currentPageKey();
  tutorialConfirmModal.classList.remove('hidden');
  tutorialYesButton.focus();
}

function closeTutorialConfirmModal() {
  tutorialConfirmModal.classList.add('hidden');
}

async function startTutorial() {
  closeTutorialConfirmModal();
  tutorialStepIndex = 0;
  tutorialOverlay.classList.remove('hidden');
  await showTutorialStep();
}

async function showTutorialStep() {
  const step = tutorialSteps[tutorialStepIndex];
  if (!step) return;

  showPage(step.page);
  if (step.page === 'settings' && step.settingPanel) showSettingsPanel(step.settingPanel);
  if (step.page === 'tasks') renderTasks();
  if (step.page === 'records') {
    showRecordsView(step.recordsView || 'editor');
    renderJournalList();
    renderSelectedJournal();
  }

  await waitForPaint();
  scrollTutorialTargetIntoView(step);
  await waitForPaint();

  tutorialCounter.textContent = tutorialStepIndex < tutorialSteps.length - 1
    ? `第 ${tutorialStepIndex + 1} / ${tutorialSteps.length - 1} 步`
    : '';
  tutorialTitle.textContent = step.title;
  tutorialText.textContent = step.text;
  tutorialPrevButton.disabled = tutorialStepIndex === 0;
  tutorialPrevButton.classList.toggle('hidden', tutorialStepIndex === tutorialSteps.length - 1);
  tutorialNextButton.classList.toggle('hidden', tutorialStepIndex === tutorialSteps.length - 1);
  const isFinalStep = tutorialStepIndex === tutorialSteps.length - 1;
  tutorialCloseButton.textContent = isFinalStep ? '完成' : '退出教程';
  tutorialCloseButton.classList.toggle('primary-button', isFinalStep);
  tutorialCloseButton.classList.toggle('secondary-button', !isFinalStep);
  tutorialCloseButton.classList.toggle('is-final', isFinalStep);

  positionTutorialOverlay();
}

async function showPreviousTutorialStep() {
  if (tutorialStepIndex <= 0) return;
  tutorialStepIndex -= 1;
  await showTutorialStep();
}

async function showNextTutorialStep() {
  if (tutorialStepIndex >= tutorialSteps.length - 1) return;
  tutorialStepIndex += 1;
  await showTutorialStep();
}

function finishTutorial() {
  tutorialOverlay.classList.add('hidden');
  const returnPage = pages[previousTutorialPage] ? previousTutorialPage : 'tasks';
  showPage(returnPage);
  if (returnPage === 'tasks') renderTasks({ scrollToCurrent: true, forceScroll: true });
}

function scrollTutorialTargetIntoView(step) {
  const target = getTutorialTarget(step);
  if (!target) return;
  target.scrollIntoView({ block: step.scrollBlock || 'center', inline: 'center' });
}

function positionTutorialOverlay() {
  const step = tutorialSteps[tutorialStepIndex];
  const target = getTutorialTarget(step);

  if (!step || !target) {
    tutorialHighlight.classList.add('hidden');
    tutorialArrow.classList.add('hidden');
    return;
  }

  const rect = target.getBoundingClientRect();
  const padding = 8;
  tutorialHighlight.classList.remove('hidden');
  tutorialArrow.classList.remove('hidden');
  tutorialHighlight.style.left = `${Math.max(0, rect.left - padding)}px`;
  tutorialHighlight.style.top = `${Math.max(0, rect.top - padding)}px`;
  tutorialHighlight.style.width = `${Math.min(window.innerWidth, rect.width + padding * 2)}px`;
  tutorialHighlight.style.height = `${Math.min(window.innerHeight, rect.height + padding * 2)}px`;

  const cardRect = tutorialCard.getBoundingClientRect();
  const cardCenter = {
    x: cardRect.left + cardRect.width / 2,
    y: cardRect.top + cardRect.height / 2
  };
  const targetPoint = closestPointOnRect(rect, cardCenter);
  const startPoint = closestPointOnRect(cardRect, targetPoint);

  tutorialArrow.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
  tutorialArrowLine.setAttribute('x1', String(startPoint.x));
  tutorialArrowLine.setAttribute('y1', String(startPoint.y));
  tutorialArrowLine.setAttribute('x2', String(targetPoint.x));
  tutorialArrowLine.setAttribute('y2', String(targetPoint.y));
}

function closestPointOnRect(rect, point) {
  const clampedX = Math.max(rect.left, Math.min(point.x, rect.right));
  const clampedY = Math.max(rect.top, Math.min(point.y, rect.bottom));
  const distances = [
    { x: clampedX, y: rect.top, value: Math.abs(point.y - rect.top) },
    { x: clampedX, y: rect.bottom, value: Math.abs(point.y - rect.bottom) },
    { x: rect.left, y: clampedY, value: Math.abs(point.x - rect.left) },
    { x: rect.right, y: clampedY, value: Math.abs(point.x - rect.right) }
  ];
  return distances.sort((a, b) => a.value - b.value)[0];
}

function getTutorialTarget(step) {
  if (!step || !step.targetSelector) return null;
  return document.querySelector(step.targetSelector);
}

function currentPageKey() {
  return Object.entries(pages).find(([, page]) => page.classList.contains('active'))?.[0] || 'tasks';
}

function updateContextualNowButton() {
  if (!backToCurrentTaskButton || !contextualNowButtonLabel) return;
  const page = currentPageKey();
  const period = profileStatsPeriod?.value || 'week';
  const statsButton = {
    day: { label: '今', title: '回到今天统计' },
    week: { label: '周', title: '回到本周统计' },
    month: { label: '月', title: '回到本月统计' },
    quarter: { label: '季', title: '回到本季度统计' },
    year: { label: '年', title: '回到本年统计' }
  }[period] || { label: '周', title: '回到本周统计' };
  const state = page === 'records'
    ? { label: '今', title: '回到今天记录' }
    : page === 'profile'
      ? statsButton
      : { label: '现', title: '定位当前任务' };

  contextualNowButtonLabel.textContent = state.label;
  const shortcut = configuredShortcuts().contextualNow;
  const description = `${state.title}（${shortcut}）`;
  backToCurrentTaskButton.title = description;
  backToCurrentTaskButton.setAttribute('aria-label', description);
}

function shortcutKeyFromEvent(event) {
  const key = String(event.key || '');
  if (!key || ['Control', 'Alt', 'Shift', 'Meta'].includes(key)) return '';
  if (key === ' ') return 'Space';
  if (key.length === 1) return key.toUpperCase();
  return `${key.slice(0, 1).toUpperCase()}${key.slice(1)}`;
}

function shortcutFromEvent(event) {
  const key = shortcutKeyFromEvent(event);
  if (!key) return '';
  const modifiers = [];
  if (event.ctrlKey) modifiers.push('Ctrl');
  if (event.altKey) modifiers.push('Alt');
  if (event.shiftKey) modifiers.push('Shift');
  if (event.metaKey) modifiers.push('Meta');
  return [...modifiers, key].join('+');
}

function normalizeShortcut(shortcut, fallback) {
  if (typeof shortcut !== 'string') return fallback;
  const tokens = shortcut.split('+').map((token) => token.trim()).filter(Boolean);
  if (tokens.length < 2) return fallback;
  const modifierSet = new Set(tokens.slice(0, -1).map((token) => token.toLowerCase()));
  const key = tokens.at(-1);
  const modifiers = [];
  if (modifierSet.has('ctrl') || modifierSet.has('control')) modifiers.push('Ctrl');
  if (modifierSet.has('alt') || modifierSet.has('option')) modifiers.push('Alt');
  if (modifierSet.has('shift')) modifiers.push('Shift');
  if (modifierSet.has('meta') || modifierSet.has('command') || modifierSet.has('cmd')) modifiers.push('Meta');
  if (modifiers.length === 0 || !key) return fallback;
  return [...modifiers, shortcutKeyFromEvent({ key })].filter(Boolean).join('+') || fallback;
}

function configuredShortcuts() {
  return normalizeShortcutSettings(profile && profile.shortcuts);
}

function normalizeShortcutSettings(shortcuts) {
  const source = shortcuts && typeof shortcuts === 'object' && !Array.isArray(shortcuts)
    ? shortcuts
    : {};
  return {
    contextualNow: normalizeShortcut(source.contextualNow, DEFAULT_SHORTCUTS.contextualNow)
  };
}

function renderShortcutSettings() {
  const shortcut = configuredShortcuts().contextualNow;
  if (contextualNowShortcutValue) contextualNowShortcutValue.textContent = shortcut;
  if (customizeContextualNowShortcutButton) {
    customizeContextualNowShortcutButton.textContent = shortcutCaptureActive ? '请按组合键…' : '自定义';
    customizeContextualNowShortcutButton.classList.toggle('is-capturing', shortcutCaptureActive);
  }
}

function setShortcutSettingsStatus(message = '', isError = false) {
  if (!shortcutSettingsStatus) return;
  shortcutSettingsStatus.textContent = message;
  shortcutSettingsStatus.classList.toggle('hidden', !message);
  shortcutSettingsStatus.classList.toggle('is-error', Boolean(message && isError));
}

function beginContextualNowShortcutCapture() {
  shortcutCaptureActive = true;
  setShortcutSettingsStatus('请按下新的组合键，按 Esc 取消。');
  renderShortcutSettings();
}

function cancelShortcutCapture() {
  shortcutCaptureActive = false;
  setShortcutSettingsStatus('已取消自定义。');
  renderShortcutSettings();
}

function handleShortcutCapture(event) {
  if (!shortcutCaptureActive) return;
  event.preventDefault();
  event.stopImmediatePropagation();

  if (event.key === 'Escape') {
    cancelShortcutCapture();
    return;
  }
  if (event.repeat || !shortcutKeyFromEvent(event)) return;

  const shortcut = shortcutFromEvent(event);
  if (!event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
    setShortcutSettingsStatus('请按下带 Ctrl、Alt 或 Shift 的组合键。', true);
    return;
  }
  if (RESERVED_SHORTCUTS.has(shortcut)) {
    setShortcutSettingsStatus('该组合键已用于保存、撤销或系统常用操作，请换一个组合键。', true);
    return;
  }
  void saveContextualNowShortcut(shortcut);
}

async function saveContextualNowShortcut(shortcut) {
  const previousProfile = profile;
  shortcutCaptureActive = false;
  profile = {
    ...normalizedProfile(),
    shortcuts: {
      ...configuredShortcuts(),
      contextualNow: shortcut
    }
  };
  renderShortcutSettings();
  updateContextualNowButton();
  try {
    await saveState();
    setShortcutSettingsStatus(`已将统一定位快捷键设为 ${shortcut}。`);
    return true;
  } catch (error) {
    profile = previousProfile;
    renderShortcutSettings();
    updateContextualNowButton();
    setShortcutSettingsStatus(`保存快捷键失败：${error.message || String(error)}`, true);
    return false;
  }
}

async function resetContextualNowShortcut() {
  if (configuredShortcuts().contextualNow === DEFAULT_SHORTCUTS.contextualNow) {
    setShortcutSettingsStatus('统一定位快捷键已经是默认值。');
    return;
  }
  if (await saveContextualNowShortcut(DEFAULT_SHORTCUTS.contextualNow)) {
    setShortcutSettingsStatus(`已恢复默认快捷键 ${DEFAULT_SHORTCUTS.contextualNow}。`);
  }
}

function handleConfiguredShortcut(event) {
  if (shortcutCaptureActive || event.repeat) return;
  if (shortcutFromEvent(event) !== configuredShortcuts().contextualNow) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  void goToContextualNow();
}

async function goToContextualNow() {
  const page = currentPageKey();
  if (page === 'records') {
    await goToTodayJournal();
    return;
  }
  if (page === 'profile') {
    await goToCurrentProfilePeriod();
    return;
  }
  if (await confirmLeaveRecordsPageIfNeeded('tasks')) goToCurrentTask();
}

async function goToTodayJournal() {
  const now = await getEffectiveNow();
  currentEffectiveNow = now;
  const today = formatLocalDate(now);
  showPage('records');
  showRecordsView('editor');
  const previousDate = committedDateInputValue(journalDate);
  setDateInputValue(journalDate, today, { trigger: true });
  if (previousDate === today) renderSelectedJournal();
}

async function goToCurrentProfilePeriod() {
  const now = await getEffectiveNow();
  currentEffectiveNow = now;
  setProfileStatsReferenceDate(formatLocalDate(now));
  updateContextualNowButton();
}

function handleDateStepButton(event) {
  const button = event.currentTarget;
  const input = document.querySelector(`#${button.dataset.dateStepFor}`);
  const offsetDays = Number(button.dataset.dateStep);
  if (!input || !Number.isFinite(offsetDays)) return;

  const currentDate = committedDateInputValue(input) || formatLocalDate(currentEffectiveNow || new Date());
  const profilePeriodDays = input === profileStatsStartDate && profileStatsPeriod?.value === 'week' ? 7 : 1;
  const nextDate = shiftDate(currentDate, offsetDays * profilePeriodDays);
  if (!nextDate || !isSelectableDate(nextDate)) return;

  setDateInputValue(input, nextDate, { trigger: true });
  input.blur();
  button.blur();
}

function registerDateInput(input, options = {}) {
  if (!input) return;

  input.min = MIN_DATE_VALUE;
  input.max = '9999-12-31';
  input.dataset.dateInput = 'managed';

  const controller = {
    committed: isSelectableDate(input.value) ? normalizeDate(input.value) : '',
    onCommit: typeof options.onCommit === 'function' ? options.onCommit : null,
    manualEditing: false
  };
  dateInputControllers.set(input, controller);

  input.addEventListener('pointerdown', () => {
    controller.manualEditing = false;
  });
  input.addEventListener('input', () => sanitizeDateInputValue(input));
  input.addEventListener('change', () => {
    if (document.activeElement === input && controller.manualEditing) {
      sanitizeDateInputValue(input);
      return;
    }
    commitDateInput(input);
  });
  input.addEventListener('blur', () => {
    controller.manualEditing = false;
    commitDateInput(input);
  });
  input.addEventListener('keydown', (event) => {
    controller.manualEditing = true;
    if (event.key === 'Enter') {
      event.preventDefault();
      input.blur();
    }
  });
}

function sanitizeDateInputValue(input) {
  const sanitized = sanitizeDateSegmentLengths(input.value);
  if (sanitized !== input.value) {
    input.value = sanitized;
  }
}

function commitDateInput(input) {
  if (!input) return false;

  sanitizeDateInputValue(input);
  const controller = dateInputControllers.get(input);
  const normalizedDate = normalizeDate(input.value);

  if (!isSelectableDate(normalizedDate)) {
    input.value = fallbackDateInputValue(input);
    return false;
  }

  input.value = normalizedDate;
  const previousDate = controller ? controller.committed : '';
  if (controller) controller.committed = normalizedDate;
  if (controller && controller.onCommit && previousDate !== normalizedDate) {
    controller.onCommit(normalizedDate, previousDate);
  }
  return true;
}

function setDateInputValue(input, date, options = {}) {
  if (!input) return false;
  const normalizedDate = normalizeDate(date);
  if (!isSelectableDate(normalizedDate)) return false;

  input.value = normalizedDate;
  const controller = dateInputControllers.get(input);
  const previousDate = controller ? controller.committed : '';
  if (controller) {
    controller.committed = normalizedDate;
    if (options.trigger && controller.onCommit && previousDate !== normalizedDate) {
      controller.onCommit(normalizedDate, previousDate);
    }
  }
  return true;
}

function committedDateInputValue(input) {
  const controller = dateInputControllers.get(input);
  if (controller && isSelectableDate(controller.committed)) return controller.committed;
  const normalizedDate = normalizeDate(input && input.value);
  return isSelectableDate(normalizedDate) ? normalizedDate : '';
}

function fallbackDateInputValue(input) {
  return committedDateInputValue(input) || formatLocalDate(currentEffectiveNow || new Date());
}

async function importScheduleFile() {
  setStatus('请选择要导入的课表文件，仅支持 xlsx、xls、csv 或 tsv。', '');
  closeImportChoiceModal();

  try {
    const selectedFile = await window.whbr.selectAndParseFile({ kind: 'schedule' });
    if (selectedFile.canceled) {
      setStatus('已取消导入。', '', 2500);
      return;
    }

    const result = await parseSelectedImportFile(selectedFile);

    if (result.message) {
      setStatus(result.message, result.status === 'ok' ? 'hidden' : '');
    }

    if (result.error) {
      setStatus(result.error, '');
      return;
    }

    if (!validateImportKind(result)) return;

    await handleParsedImport(result);
  } catch (error) {
    setStatus(`导入失败：${error.message}`, '');
  }
}

async function importDroppedFile(file) {
  setStatus(`已忽略 ${file && file.name ? file.name : '拖入的文件'}。每日安排不再支持文件导入，请在“批量创建任务”中选择“填写安排内容”。`, '', 6000);
}

async function parseSelectedImportFile(file) {
  const fileName = file.fileName || file.filePath.split(/[\\/]/).pop();
  const ext = fileName.split('.').pop().toLowerCase();
  const isScheduleUnsupported = !['xlsx', 'xls', 'csv', 'tsv'].includes(ext);

  if (isScheduleUnsupported) {
    return {
      canceled: false,
      error: '课表入口目前只支持 xlsx、xls、csv 或 tsv 文件。PDF 课表暂不在 v0.2.0 支持范围内。',
      filePath: file.filePath,
      fileName,
      tasks: []
    };
  }

  setStatus(`已选择 ${fileName}，正在读取文件……`, '');
  await waitForPaint();

  setStatus('正在转化中……正在读取课表文件。', '');
  await waitForPaint();

  const result = await window.whbr.parseFilePath(file.filePath);

  setStatus('正在整理课表文件解析结果，准备预填课表。', '');
  await waitForPaint();

  return result;
}

function validateImportKind(result) {
  const importedTasks = Array.isArray(result.tasks) ? result.tasks : [];
  const hasTimetable = hasImportedTimetable(result);
  const isTable = result.sourceType === 'table';

  if (!isTable) {
    setStatus('课表入口目前只支持 xlsx、xls、csv 或 tsv 文件。', '');
    return false;
  }

  if (!hasTimetable) {
    setStatus(importedTasks.length > 0
      ? '这个文件看起来是每日安排，不是学期课表。每日安排请使用“填写安排内容”。'
      : '没有识别到课表网格。请上传包含周一至周日列的课表文件。', '');
    return false;
  }

  return true;
}

function hasImportedTimetable(result) {
  const rows = result && result.timetableTemplate && Array.isArray(result.timetableTemplate.rows)
    ? result.timetableTemplate.rows
    : [];
  return rows.length > 0;
}

function waitForPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

async function handleParsedImport(result) {
  const importedTasks = Array.isArray(result.tasks) ? result.tasks : [];
  openScheduleTableModal(result.timetableTemplate || templateFromScheduleTasks(importedTasks), result);
}

function openImportChoiceModal() {
  const hasSchedule = hasScheduleTemplate();
  manualScheduleButton.textContent = hasSchedule ? '查看/修改课表' : '手动添加课表';
  fileScheduleButton.textContent = hasSchedule ? '更新课表文件' : '导入课表文件';
  importChoiceModal.classList.remove('hidden');
}

function hasScheduleTemplate() {
  const template = normalizedProfile().scheduleTemplate;
  if (template && Array.isArray(template.rows) && template.rows.length > 0) return true;
  return tasks.some((task) => task.source === 'schedule-template');
}

function closeImportChoiceModal() {
  importChoiceModal.classList.add('hidden');
}

function openScheduleTableModal(prefillTemplate = null, importResult = null) {
  closeImportChoiceModal();
  const template = normalizedProfile().scheduleTemplate || null;
  const hasTemplate = template && Array.isArray(template.rows) && template.rows.length > 0;
  const prefillRows = prefillTemplate && Array.isArray(prefillTemplate.rows) ? prefillTemplate.rows : [];
  const rowsToUse = prefillRows.length > 0
    ? prefillRows
    : hasTemplate
      ? template.rows
      : null;
  const today = taskDateFilter.value || formatLocalDate(currentEffectiveNow);
  setDateInputValue(termStartDate, template && template.termStartDate ? template.termStartDate : today);
  setDateInputValue(termEndDate, template && template.termEndDate ? template.termEndDate : today);
  document.querySelector('#scheduleTableTitle').textContent = hasTemplate || prefillTemplate ? '查看/修改学期课表' : '填写学期课表';
  saveScheduleTableButton.textContent = hasTemplate ? '保存并更新课程安排' : '生成课程安排';
  scheduleTableBody.innerHTML = '';
  if (rowsToUse) {
    rowsToUse.forEach((row) => addScheduleTableRow(row.timeRange, row.courses, row.sectionLabel));
  } else {
    addScheduleTableRow('08:00-09:40');
    addScheduleTableRow('10:00-11:40');
    addScheduleTableRow('14:00-15:40');
  }
  if (importResult) {
    const message = prefillRows.length > 0
      ? `已预填 ${prefillRows.length} 行课表。请补充或校对时间段，确认后再生成课程安排。`
      : '没有从文件中识别出稳定的课表网格。请在表格中手动填写课程和时间段。';
    setStatus(importResult.message ? `${importResult.message} ${message}` : message, '', prefillRows.length > 0 ? 5000 : 0);
  }
  scheduleTableModal.classList.remove('hidden');
}

function closeScheduleTableModal() {
  scheduleTableModal.classList.add('hidden');
}

function addScheduleTableRow(timeRange = '', courses = [], sectionLabel = '') {
  const row = document.createElement('tr');
  const timeCell = document.createElement('td');
  const timeInput = document.createElement('input');
  timeInput.type = 'text';
  timeInput.inputMode = 'numeric';
  timeInput.maxLength = 11;
  timeInput.dataset.role = 'schedule-time';
  timeInput.dataset.sectionLabel = sectionLabel || '';
  timeInput.title = sectionLabel ? `${sectionLabel}，请填写具体时间，如 08:00-09:40` : '请填写具体时间，如 08:00-09:40';
  timeInput.value = formatTimeRangeInput(timeRange);
  timeInput.addEventListener('input', () => {
    timeInput.value = formatTimeRangeInput(timeInput.value);
  });
  timeCell.appendChild(timeInput);
  row.appendChild(timeCell);

  for (let index = 0; index < 7; index += 1) {
    const cell = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'text';
    input.dataset.role = 'schedule-course';
    input.value = courses[index] || '';
    cell.appendChild(input);
    row.appendChild(cell);
  }

  const actionCell = document.createElement('td');
  actionCell.className = 'row-action-cell';
  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-table-row';
  deleteButton.textContent = '-';
  deleteButton.setAttribute('aria-label', '删除这一行课表');
  deleteButton.title = '删除这一行';
  deleteButton.addEventListener('click', () => {
    row.remove();
    if (!scheduleTableBody.querySelector('tr')) {
      addScheduleTableRow();
      return;
    }
    refreshScheduleTableGuidance();
  });
  actionCell.appendChild(deleteButton);
  row.appendChild(actionCell);

  scheduleTableBody.appendChild(row);
  refreshScheduleTableGuidance();
}

function refreshScheduleTableGuidance() {
  Array.from(scheduleTableBody.querySelectorAll('tr')).forEach((row, rowIndex) => {
    const timeInput = row.querySelector('input[data-role="schedule-time"]');
    const courseInputs = Array.from(row.querySelectorAll('input[data-role="schedule-course"]'));
    if (timeInput) {
      timeInput.placeholder = timeInput.dataset.sectionLabel
        ? `${timeInput.dataset.sectionLabel}时间`
        : rowIndex === 0 ? '08:00-09:40' : '';
    }
    courseInputs.forEach((input) => {
      input.placeholder = rowIndex === 0 ? '课程名称' : '';
    });
  });
}

function readScheduleTemplateFromTable() {
  const rows = Array.from(scheduleTableBody.querySelectorAll('tr'))
    .map((row) => {
      const inputs = Array.from(row.querySelectorAll('input'));
      const timeRange = formatTimeRangeInput(inputs[0].value);
      const courses = inputs.slice(1, 8).map((input) => clean(input.value));
      return {
        timeRange,
        courses
      };
    })
    .filter((row) => row.timeRange && row.courses.some(Boolean));

  return {
    termStartDate: normalizeDate(termStartDate.value),
    termEndDate: normalizeDate(termEndDate.value),
    rows
  };
}

function buildTasksFromScheduleTemplate(template, dates) {
  const newTasks = [];
  const category = courseTaskCategory();

  template.rows.forEach((row, rowIndex) => {
    const timeRange = extractTimeRangeFromInput(row.timeRange);
    dates.forEach((date) => {
      const weekdayIndex = parseLocalDate(date).getDay();
      const courseIndex = weekdayIndex === 0 ? 6 : weekdayIndex - 1;
      const title = clean(row.courses[courseIndex]);
      if (!title) return;

      newTasks.push({
        id: `course-${Date.now()}-${rowIndex}-${date}`,
        title,
        startTime: timeRange ? timeRange.startTime : '',
        endTime: timeRange ? timeRange.endTime : '',
        date,
        weekday: weekdayFromDate(date),
        location: '',
        typeId: category ? category.id : '',
        type: category ? category.name : '',
        planDetails: '',
        details: '',
        status: '未评价',
        rawText: row.timeRange,
        sheetName: '手动课表',
        source: 'schedule-template',
        order: nextOrderForDate(date) + rowIndex * 10,
        isDraft: !timeRange
      });
    });
  });

  return newTasks;
}

function templateFromScheduleTasks(taskItems) {
  const rows = [];

  taskItems.forEach((task) => {
    const weekday = normalizeWeekday(task.weekday);
    const weekdayIndex = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'].indexOf(weekday);
    const title = clean(task.title);
    if (weekdayIndex < 0 || !title) return;

    const timeRange = task.startTime && task.endTime ? `${task.startTime}-${task.endTime}` : '';
    let row = rows.find((item) => item.timeRange === timeRange);
    if (!row) {
      row = {
        timeRange,
        courses: Array(7).fill('')
      };
      rows.push(row);
    }

    row.courses[weekdayIndex] = [row.courses[weekdayIndex], title].filter(Boolean).join(' / ');
  });

  return { rows };
}

async function saveScheduleTable() {
  commitDateInput(termStartDate);
  commitDateInput(termEndDate);
  const dates = enumerateDates(termStartDate.value, termEndDate.value);
  if (dates.length === 0) {
    setStatus('请填写有效的学期开始和结束日期。', '');
    return;
  }

  const template = readScheduleTemplateFromTable();
  const conflictedRows = markScheduleTimeConflicts(template.rows);
  if (conflictedRows.size > 0) {
    setStatus('课表时间段存在重叠冲突，已标红对应行。请修改后再生成课程安排。', '');
    return;
  }

  const newTasks = buildTasksFromScheduleTemplate(template, dates);

  if (template.rows.length === 0) {
    setStatus('课表里还没有可保存的课程。请至少填写一个时间段和课程名称。', '');
    return;
  }

  profile = {
    ...normalizedProfile(),
    scheduleTemplate: template
  };
  tasks = mergeTasks(removeGeneratedScheduleTasks(tasks), newTasks);
  setDateInputValue(taskDateFilter, dates[0]);
  activePlanningDates.add(dates[0]);
  await saveState();
  closeScheduleTableModal();
  renderAll();
  setStatus(`已生成 ${newTasks.length} 条课程安排。`, 'hidden');
}

function markScheduleTimeConflicts(rows) {
  const conflictedIndexes = findConflictingRangeIndexes(rows);
  Array.from(scheduleTableBody.querySelectorAll('tr')).forEach((row, index) => {
    const input = row.querySelector('input[data-role="schedule-time"]');
    if (!input) return;
    const conflicted = conflictedIndexes.has(index);
    input.classList.toggle('time-conflict', conflicted);
    row.classList.toggle('schedule-row-conflict', conflicted);
    input.title = conflicted
      ? '这个时间段与课表中的其他时间段冲突，请修改后再生成课程安排。'
      : input.dataset.sectionLabel ? `${input.dataset.sectionLabel}，请填写具体时间，如 08:00-09:40` : '请填写具体时间，如 08:00-09:40';
  });
  return conflictedIndexes;
}

function openDailyPlanTableModal() {
  closeImportChoiceModal();
  const defaultDate = taskDateFilter.value || formatLocalDate(currentEffectiveNow);
  dailyPlanMultiDay.checked = false;
  setDateInputValue(dailyPlanDate, defaultDate);
  setDateInputValue(dailyPlanStartDate, defaultDate);
  setDateInputValue(dailyPlanEndDate, defaultDate);
  syncDailyPlanDateMode();
  dailyPlanTableBody.innerHTML = '';
  clearDailyPlanVoiceParsedState({ clearText: true });
  addDailyPlanRow('09:00-11:30');
  addDailyPlanRow('14:00-17:30');
  dailyPlanVoiceCanceled = false;
  dailyPlanVoiceFinalReceived = false;
  setDailyPlanVoiceControls('idle');
  setDailyPlanVoiceStatus('尚未开始语音识别。');
  setDailyPlanVoicePageVisible(false);
  dailyPlanTableModal.classList.remove('hidden');
  requestAnimationFrame(() => focusDailyPlanGridCell(0, 0));
}

function closeDailyPlanTableModal() {
  if (dailyPlanVoiceRecording) void cancelDailyPlanVoiceInput();
  setDailyPlanVoicePageVisible(false);
  dailyPlanTableModal.classList.add('hidden');
}

function openDailyPlanVoicePage() {
  setDailyPlanVoicePageVisible(true);
  if (dailyPlanModalCard) dailyPlanModalCard.scrollTop = 0;
}

function closeDailyPlanVoicePage() {
  if (dailyPlanVoiceRecording) void cancelDailyPlanVoiceInput();
  setDailyPlanVoicePageVisible(false);
  if (dailyPlanModalCard) dailyPlanModalCard.scrollTop = 0;
}

function setDailyPlanVoicePageVisible(visible) {
  if (dailyPlanLaunchPanel) dailyPlanLaunchPanel.classList.toggle('hidden', visible);
  if (dailyPlanVoicePage) dailyPlanVoicePage.classList.toggle('hidden', !visible);
}

async function toggleDailyPlanVoiceInput() {
  if (dailyPlanVoiceRecording) {
    await stopDailyPlanVoiceInput();
    return;
  }
  await startDailyPlanVoiceInput();
}

async function startDailyPlanVoiceInput() {
  if (journalVoiceRecording || asrTestRecording || microphoneTestRecording) {
    setDailyPlanVoiceStatus('请先停止其他正在使用麦克风的操作。', true);
    return;
  }
  try {
    const modelStatus = ensureAsrSuccess(await getAsrTestApi().getModelStatus());
    if (modelStatus.state === 'downloading' || asrModelDownloadInFlight) {
      setDailyPlanVoiceStatus('模型正在下载中，具体进度可到设置页查看。', 'warning');
      return;
    }
  } catch (error) {
    setDailyPlanVoiceStatus(describeDailyPlanVoiceError(error), true);
    return;
  }

  clearDailyPlanVoiceParsedState({ clearText: true });
  dailyPlanVoiceCanceled = false;
  dailyPlanVoiceFinalReceived = false;
  dailyPlanVoiceProcessing = false;
  dailyPlanVoiceWarningActive = false;
  dailyPlanVoiceCapturedSeconds = 0;
  dailyPlanVoiceDecodedSeconds = 0;
  dailyPlanVoiceDecodeRealtimeFactor = 0;
  dailyPlanVoiceConversionStartedAt = 0;
  clearDailyPlanVoiceTimer({ hide: true });
  setDailyPlanVoiceControls('starting');
  setDailyPlanVoiceStatus('正在加载本地语音识别器…');
  let serviceStarted = false;
  try {
    const api = getAsrTestApi();
    const modelStatus = ensureAsrSuccess(await api.getModelStatus());
    const needsModelInstallation = !modelStatus.isReady;
    if (needsModelInstallation) {
      setDailyPlanVoiceStatus('模型正在下载中，具体进度可到设置页查看。', 'warning');
    }
    const initialization = await initializeAsrForUse(api);
    if (needsModelInstallation) {
      setDailyPlanVoiceControls('idle');
      setDailyPlanVoiceStatus('模型已安装。请再次点击“开始录音”进行语音创建任务。');
      return;
    }
    await ensureDailyPlanVoiceCapture(initialization.sampleRate, api);
    const startResult = await api.start();
    ensureAsrSuccess(startResult);
    serviceStarted = true;

    await dailyPlanVoiceCapture.start();
    dailyPlanVoiceRecording = true;
    startDailyPlanVoiceDurationTimers(startResult.maxRecordingDurationSeconds || 90);
    startDailyPlanVoiceRecordingTimer(startResult.maxRecordingDurationSeconds || 90);
    setDailyPlanVoiceControls('recording');
    setDailyPlanVoiceStatus(`正在录音。VAD 已开启，单次最长 ${startResult.maxRecordingDurationSeconds || 90} 秒。建议按“开始时间到结束时间，任务标题，具体任务内容”的格式描述。`);
  } catch (error) {
    dailyPlanVoiceCanceled = true;
    if (serviceStarted) {
      try {
        await getAsrTestApi().cancel();
      } catch (cancelError) {
        // Preserve the useful original error below.
      }
    }
    await stopDailyPlanVoiceCapture();
    dailyPlanVoiceRecording = false;
    setDailyPlanVoiceControls('idle');
    setDailyPlanVoiceStatus(describeDailyPlanVoiceError(error), true);
    stopDailyPlanVoiceDurationTimers();
    clearDailyPlanVoiceTimer({ hide: true });
  }
}

async function stopDailyPlanVoiceInput({ automatic = false } = {}) {
  if (!dailyPlanVoiceRecording || dailyPlanVoiceProcessing) return;
  dailyPlanVoiceProcessing = true;
  stopDailyPlanVoiceDurationTimers();
  startDailyPlanVoiceConversionTimer();
  setDailyPlanVoiceControls('processing');
  setDailyPlanVoiceStatus('已结束本次录制，正在转成文字…');
  try {
    // Stop immediately releases the media tracks; the ASR worker only drains
    // PCM that was already captured before this point.
    await stopDailyPlanVoiceCapture();
    const result = await getAsrTestApi().stop();
    ensureAsrSuccess(result);
    if (!dailyPlanVoiceCanceled && !dailyPlanVoiceFinalReceived && dailyPlanVoiceText) {
      dailyPlanVoiceText.value = result.finalText || '';
      dailyPlanVoiceFinalReceived = true;
    }
    finishDailyPlanVoiceConversionTimer();
    setDailyPlanVoiceStatus(automatic
      ? '已结束录制，识别文字已显示。'
      : '识别完成。请检查并编辑原始文字，确认解析后点击“创建任务”保存。');
  } catch (error) {
    clearDailyPlanVoiceTimer({ hide: true });
    setDailyPlanVoiceStatus(describeDailyPlanVoiceError(error), true);
  } finally {
    dailyPlanVoiceRecording = false;
    dailyPlanVoiceProcessing = false;
    stopDailyPlanVoiceDurationTimers();
    setDailyPlanVoiceControls('idle');
  }
}

async function cancelDailyPlanVoiceInput() {
  if (!dailyPlanVoiceRecording) return;
  dailyPlanVoiceCanceled = true;
  dailyPlanVoiceProcessing = true;
  stopDailyPlanVoiceDurationTimers();
  clearDailyPlanVoiceTimer({ hide: true });
  setDailyPlanVoiceControls('processing');
  setDailyPlanVoiceStatus('正在取消本次录音…');
  try {
    await stopDailyPlanVoiceCapture();
    const result = await getAsrTestApi().cancel();
    ensureAsrSuccess(result);
    setDailyPlanVoiceStatus('已取消本次录音。');
  } catch (error) {
    setDailyPlanVoiceStatus(describeDailyPlanVoiceError(error), true);
  } finally {
    dailyPlanVoiceRecording = false;
    dailyPlanVoiceProcessing = false;
    stopDailyPlanVoiceDurationTimers();
    setDailyPlanVoiceControls('idle');
  }
}

async function ensureDailyPlanVoiceCapture(sampleRate, api) {
  if (!window.RizhiAsrAudioCapture || !window.RizhiAsrAudioCapture.AudioCapture) {
    throw new Error('未能加载本地音频采集模块。');
  }
  if (dailyPlanVoiceCapture && dailyPlanVoiceCapture.sampleRate !== sampleRate) {
    await dailyPlanVoiceCapture.dispose();
    dailyPlanVoiceCapture = null;
  }
  if (!dailyPlanVoiceCapture) {
    dailyPlanVoiceCapture = new window.RizhiAsrAudioCapture.AudioCapture({
      sampleRate,
      deviceId: getSelectedAudioInputDeviceId()
    });
    dailyPlanVoiceCaptureUnsubscribe = dailyPlanVoiceCapture.onAudioFrame((frame) => {
      if (frame.error) {
        setDailyPlanVoiceStatus(describeDailyPlanVoiceError(frame.error), true);
        return;
      }
      try {
      dailyPlanVoiceCapturedSeconds += frame.samples.length / frame.sampleRate;
        api.sendAudioFrame(frame.sampleRate, frame.samples);
      } catch (error) {
        setDailyPlanVoiceStatus(describeDailyPlanVoiceError(error), true);
      }
    });
  } else {
    dailyPlanVoiceCapture.setDeviceId(getSelectedAudioInputDeviceId());
  }
  await dailyPlanVoiceCapture.initialize();
}

async function stopDailyPlanVoiceCapture() {
  if (dailyPlanVoiceCapture) await dailyPlanVoiceCapture.stop();
}


function startDailyPlanVoiceDurationTimers(maxDurationSeconds) {
  stopDailyPlanVoiceDurationTimers();
  const timers = scheduleVoiceDurationTimers(maxDurationSeconds, {
    isRecording: () => dailyPlanVoiceRecording && !dailyPlanVoiceProcessing,
    onWarning: () => {
      dailyPlanVoiceWarningActive = true;
      setDailyPlanVoiceStatus('还有 10 秒录制时间，请准备结束本段录音。', 'warning');
      playJournalVoiceWarningTone(dailyPlanVoiceCapture);
    },
    onMaximum: () => void stopDailyPlanVoiceInput({ automatic: true })
  });
  dailyPlanVoiceWarningTimer = timers.warningTimer;
  dailyPlanVoiceMaximumTimer = timers.maximumTimer;
}

function stopDailyPlanVoiceDurationTimers() {
  if (dailyPlanVoiceWarningTimer) window.clearTimeout(dailyPlanVoiceWarningTimer);
  if (dailyPlanVoiceMaximumTimer) window.clearTimeout(dailyPlanVoiceMaximumTimer);
  dailyPlanVoiceWarningTimer = null;
  dailyPlanVoiceMaximumTimer = null;
  dailyPlanVoiceWarningActive = false;
}

function setDailyPlanVoiceTimer(text, hidden = false) {
  if (!dailyPlanVoiceTimer) return;
  dailyPlanVoiceTimer.textContent = text;
  dailyPlanVoiceTimer.classList.toggle('hidden', hidden);
}

function clearDailyPlanVoiceTimer({ hide = false } = {}) {
  if (dailyPlanVoiceTimerInterval) window.clearInterval(dailyPlanVoiceTimerInterval);
  dailyPlanVoiceTimerInterval = null;
  if (hide) setDailyPlanVoiceTimer('', true);
}

function startDailyPlanVoiceRecordingTimer(maxDurationSeconds) {
  clearDailyPlanVoiceTimer({ hide: true });
  dailyPlanVoiceRecordingStartedAt = Date.now();
  const maxSeconds = Math.max(1, Number(maxDurationSeconds) || 90);
  const render = () => {
    const elapsed = (Date.now() - dailyPlanVoiceRecordingStartedAt) / 1000;
    setDailyPlanVoiceTimer(
      `录音 ${formatVoiceDuration(elapsed)} / ${formatVoiceDuration(maxSeconds)}（剩余 ${formatVoiceDuration(maxSeconds - elapsed)}）`
    );
  };
  render();
  dailyPlanVoiceTimerInterval = window.setInterval(render, 250);
}

function startDailyPlanVoiceConversionTimer() {
  clearDailyPlanVoiceTimer();
  dailyPlanVoiceConversionStartedAt = Date.now();
  const pendingAudioSeconds = Math.max(0.5, dailyPlanVoiceCapturedSeconds - dailyPlanVoiceDecodedSeconds);
  const realtimeFactor = dailyPlanVoiceDecodeRealtimeFactor || 1.2;
  const estimatedSeconds = Math.max(1, Math.ceil(pendingAudioSeconds * realtimeFactor));
  const render = () => {
    const elapsed = (Date.now() - dailyPlanVoiceConversionStartedAt) / 1000;
    const remaining = estimatedSeconds - elapsed;
    const suffix = remaining > 0 ? `预计剩余 ${formatVoiceDuration(remaining)}` : '正在完成最后一段';
    setDailyPlanVoiceTimer(`转换 ${formatVoiceDuration(elapsed)}（${suffix}）`);
  };
  render();
  dailyPlanVoiceTimerInterval = window.setInterval(render, 250);
}

function finishDailyPlanVoiceConversionTimer() {
  if (!dailyPlanVoiceConversionStartedAt) return;
  const elapsed = (Date.now() - dailyPlanVoiceConversionStartedAt) / 1000;
  clearDailyPlanVoiceTimer();
  setDailyPlanVoiceTimer(`转换完成，耗时 ${formatVoiceDuration(elapsed)}`);
  dailyPlanVoiceConversionStartedAt = 0;
}

function updateDailyPlanVoiceDecodeEstimate(payload) {
  const segmentSeconds = Number(payload && payload.segmentDurationSeconds);
  const decodeMilliseconds = Number(payload && payload.decodeElapsedMs);
  if (!(segmentSeconds > 0) || !(decodeMilliseconds >= 0)) return;
  dailyPlanVoiceDecodedSeconds += segmentSeconds;
  const observedFactor = decodeMilliseconds / (segmentSeconds * 1000);
  dailyPlanVoiceDecodeRealtimeFactor = dailyPlanVoiceDecodeRealtimeFactor > 0
    ? dailyPlanVoiceDecodeRealtimeFactor * 0.7 + observedFactor * 0.3
    : observedFactor;
}
function setDailyPlanVoiceControls(state) {
  if (!dailyPlanVoiceStartButton || !dailyPlanVoiceCancelButton) return;
  if (state === 'recording') {
    dailyPlanVoiceStartButton.disabled = false;
    dailyPlanVoiceStartButton.textContent = '● 正在录音，点击停止';
    dailyPlanVoiceCancelButton.classList.remove('hidden');
    dailyPlanVoiceCancelButton.disabled = false;
    return;
  }
  if (state === 'starting' || state === 'processing') {
    dailyPlanVoiceStartButton.disabled = true;
    dailyPlanVoiceStartButton.textContent = state === 'processing' ? '正在识别…' : '正在准备…';
    dailyPlanVoiceCancelButton.classList.toggle('hidden', state === 'starting');
    dailyPlanVoiceCancelButton.disabled = true;
    return;
  }
  dailyPlanVoiceStartButton.disabled = false;
  dailyPlanVoiceStartButton.textContent = '开始录音';
  dailyPlanVoiceCancelButton.disabled = false;
  dailyPlanVoiceCancelButton.classList.add('hidden');
}

function setDailyPlanVoiceStatus(message, state = '') {
  if (!dailyPlanVoiceStatus) return;
  dailyPlanVoiceStatus.textContent = message;
  const normalizedState = state === true ? 'error' : state;
  dailyPlanVoiceStatus.classList.toggle('is-error', normalizedState === 'error');
  dailyPlanVoiceStatus.classList.toggle('is-warning', normalizedState === 'warning');
}

function describeDailyPlanVoiceError(error) {
  if (error && error.code === 'ASR_MODEL_DOWNLOADING') return '模型正在下载中，请稍后使用。';
  if (error && error.code === 'ASR_MODEL_DOWNLOAD_CANCELED') return '已取消模型下载。需要时可再次点击“开始录音”。';
  if (error && error.code === 'MIC_PERMISSION_DENIED') return `无法开始语音创建任务：${error.message}`;
  if (error && error.code === 'MIC_DEVICE_NOT_FOUND') return `无法开始语音创建任务：${error.message}`;
  return `语音创建任务失败：${error && error.message ? error.message : String(error)}`;
}

async function confirmDailyPlanVoiceText() {
  const text = clean(dailyPlanVoiceText && dailyPlanVoiceText.value);
  if (!text) {
    clearDailyPlanVoiceParsedState();
    setDailyPlanVoiceStatus('当前没有可解析的识别文字。', true);
    return;
  }

  dailyPlanVoiceConfirmButton.disabled = true;
  if (dailyPlanVoiceApplyButton) dailyPlanVoiceApplyButton.disabled = true;
  setDailyPlanVoiceStatus('正在本地解析文字…');
  try {
    let candidates = parseStructuredDailyPlanVoiceText(text);
    if (!candidates) {
      if (!window.whbr || typeof window.whbr.parseTaskText !== 'function') {
        throw new Error('本地任务解析器不可用，请重新启动应用。');
      }
      const response = await window.whbr.parseTaskText(
        text,
        getDailyPlanVoiceReferenceDate(),
        taskCategories().map((category) => category.name)
      );
      if (!response || !response.ok || !response.result) {
        throw new Error(response && response.error && response.error.message ? response.error.message : '本地任务解析失败。');
      }
      candidates = Array.isArray(response.result.tasks)
        ? response.result.tasks.map(normalizeDailyPlanVoiceCandidate)
        : [];
    }
    if (candidates.length === 0) {
      clearDailyPlanVoiceParsedState();
      setDailyPlanVoiceStatus('未识别到完整时间段。请补充“几点到几点”的表达后重新解析。', true);
      return;
    }

    const parsedText = candidates.map(formatDailyPlanVoiceCandidate).join('\n');
    dailyPlanVoiceParsedCandidates = candidates;
    dailyPlanVoiceParsedText = parsedText;
    dailyPlanVoiceText.value = parsedText;

    const invalidLines = candidates
      .map((candidate, index) => ({
        line: index + 1,
        missing: requiredDailyPlanVoiceCandidateFields(candidate)
      }))
      .filter((item) => item.missing.length > 0);

    if (invalidLines.length) {
      const summary = invalidLines
        .map((item) => `第 ${item.line} 行缺少${item.missing.map(dailyPlanVoiceFieldLabel).join('、')}`)
        .join('；');
      setDailyPlanVoiceStatus(`${summary}。请修改文字后重新解析。`, true);
      return;
    }

    setDailyPlanVoiceStatus(`已解析出 ${candidates.length} 条任务。确认文本无误后点击“确定”回填创建任务页。`);
  } catch (error) {
    clearDailyPlanVoiceParsedState();
    setDailyPlanVoiceStatus(`任务解析失败：${error && error.message ? error.message : String(error)}`, true);
  } finally {
    dailyPlanVoiceConfirmButton.disabled = false;
    if (dailyPlanVoiceApplyButton) dailyPlanVoiceApplyButton.disabled = false;
  }
}

function getDailyPlanVoiceReferenceDate() {
  if (dailyPlanMultiDay && dailyPlanMultiDay.checked) {
    return (dailyPlanStartDate && dailyPlanStartDate.value) || (dailyPlanDate && dailyPlanDate.value) || '';
  }
  return dailyPlanDate && dailyPlanDate.value;
}

function normalizeDailyPlanVoiceCandidate(task = {}) {
  const category = taskCategoryFromInput(task.typeId || task.type);
  return {
    startTime: clean(task.startTime),
    endTime: clean(task.endTime),
    title: clean(task.title),
    details: clean(task.details),
    typeId: category ? category.id : '',
    type: category ? category.name : ''
  };
}

function parseStructuredDailyPlanVoiceText(text) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;

  const pattern = /^起始时间[：:]\s*(.*?)\s*[，,]\s*结束时间[：:]\s*(.*?)\s*[，,]\s*任务[：:]\s*(.*?)\s*[，,]\s*具体内容[：:]\s*(.*?)\s*[，,]\s*类型[：:]\s*(.*?)\s*$/;
  const candidates = [];
  for (const line of lines) {
    const match = line.match(pattern);
    if (!match) return null;
    candidates.push(normalizeDailyPlanVoiceCandidate({
      startTime: match[1],
      endTime: match[2],
      title: match[3],
      details: match[4],
      type: match[5]
    }));
  }
  return candidates;
}

function formatDailyPlanVoiceCandidate(candidate) {
  const inlineText = (value) => clean(value).replace(/[\r\n]+/g, ' ');
  return [
    `起始时间：${inlineText(candidate.startTime)}`,
    `结束时间：${inlineText(candidate.endTime)}`,
    `任务：${inlineText(candidate.title)}`,
    `具体内容：${inlineText(candidate.details)}`,
    `类型：${inlineText(candidate.type)}`
  ].join('，');
}

function requiredDailyPlanVoiceCandidateFields(candidate) {
  const missing = [];
  if (!candidate.startTime) missing.push('startTime');
  if (!candidate.endTime) missing.push('endTime');
  if (!candidate.title) missing.push('title');
  if (!taskCategoryFromInput(candidate.typeId || candidate.type)) missing.push('type');
  const range = extractTimeRangeFromInput(`${candidate.startTime}-${candidate.endTime}`);
  if (candidate.startTime && candidate.endTime && !range) missing.push('startTime', 'endTime');
  return Array.from(new Set(missing));
}

function dailyPlanVoiceFieldLabel(field) {
  return {
    startTime: '起始时间',
    endTime: '结束时间',
    title: '任务',
    type: '类型'
  }[field] || field;
}

function invalidateDailyPlanVoiceParse() {
  if (dailyPlanVoiceParsedCandidates.length === 0) return;
  if (dailyPlanVoiceText && dailyPlanVoiceText.value === dailyPlanVoiceParsedText) return;
  dailyPlanVoiceParsedCandidates = [];
  dailyPlanVoiceParsedText = '';
  setDailyPlanVoiceStatus('文字已修改，请重新点击“解析”后再确定。', 'warning');
}

function applyDailyPlanVoiceTasks() {
  if (dailyPlanVoiceParsedCandidates.length === 0 || !dailyPlanVoiceParsedText) {
    setDailyPlanVoiceStatus('请先点击“解析”，解析成功后才能确定。', true);
    return;
  }

  if (!dailyPlanVoiceText || dailyPlanVoiceText.value !== dailyPlanVoiceParsedText) {
    invalidateDailyPlanVoiceParse();
    setDailyPlanVoiceStatus('解析后的文字已被修改，请重新解析后再确定。', true);
    return;
  }

  const invalidLines = dailyPlanVoiceParsedCandidates
    .map((candidate, index) => ({
      line: index + 1,
      missing: requiredDailyPlanVoiceCandidateFields(candidate)
    }))
    .filter((item) => item.missing.length > 0);
  if (invalidLines.length) {
    setDailyPlanVoiceStatus('解析结果存在缺少时间、任务或类型的行，请修改后重新解析。', true);
    return;
  }

  Array.from(dailyPlanTableBody.querySelectorAll('tr')).forEach((row) => {
    const title = clean(row.querySelector('td:nth-child(3) input')?.value);
    const details = clean(row.querySelector('td:nth-child(4) input')?.value);
    if (!title && !details) row.remove();
  });

  dailyPlanVoiceParsedCandidates.forEach((candidate) => {
    addDailyPlanRow(`${candidate.startTime}-${candidate.endTime}`, {
      title: candidate.title,
      planDetails: candidate.details,
      typeId: candidate.typeId,
      type: candidate.type
    });
  });

  const count = dailyPlanVoiceParsedCandidates.length;
  clearDailyPlanVoiceParsedState({ clearText: true });
  setDailyPlanVoiceStatus('尚未开始语音识别。');
  closeDailyPlanVoicePage();
  setStatus(`已将 ${count} 条语音解析结果填入创建任务列表，请核对后点击“确定安排”。`, 'hidden');
}

function clearDailyPlanVoiceParsedState(options = {}) {
  dailyPlanVoiceParsedCandidates = [];
  dailyPlanVoiceParsedText = '';
  if (options.clearText && dailyPlanVoiceText) dailyPlanVoiceText.value = '';
}

function addDailyPlanRow(timeRange = '', values = {}) {
  const row = document.createElement('tr');
  const parsedRange = extractTimeRangeFromInput(timeRange);
  const startTime = clean(values.startTime) || (parsedRange && parsedRange.startTime) || '';
  const endTime = clean(values.endTime) || (parsedRange && parsedRange.endTime) || '';

  const startTimeCell = document.createElement('td');
  const startTimeInput = createDailyPlanClockInput(startTime, '开始时间');
  startTimeCell.appendChild(startTimeInput);

  const endTimeCell = document.createElement('td');
  const endTimeInput = createDailyPlanClockInput(endTime, '结束时间');
  endTimeCell.appendChild(endTimeInput);

  const titleCell = document.createElement('td');
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.placeholder = '做什么事';
  titleInput.value = clean(values.title);
  titleInput.setAttribute('aria-label', '任务');
  titleInput.addEventListener('keydown', handleDailyPlanGridKeydown);
  titleCell.appendChild(titleInput);

  const planCell = document.createElement('td');
  const planInput = document.createElement('input');
  planInput.type = 'text';
  planInput.placeholder = '具体要做什么，可不填';
  planInput.value = clean(values.planDetails);
  planInput.setAttribute('aria-label', '具体内容');
  planInput.addEventListener('keydown', handleDailyPlanGridKeydown);
  planCell.appendChild(planInput);

  const typeCell = document.createElement('td');
  const typeSelect = createTypeSelect(values.typeId || values.type);
  typeSelect.addEventListener('keydown', handleDailyPlanGridKeydown);
  typeCell.appendChild(typeSelect);

  const actionCell = document.createElement('td');
  actionCell.className = 'row-action-cell';
  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-table-row';
  deleteButton.textContent = '×';
  deleteButton.setAttribute('aria-label', '删除这一条任务');
  deleteButton.title = '删除这一条任务';
  deleteButton.addEventListener('click', () => row.remove());
  deleteButton.addEventListener('keydown', handleDailyPlanGridKeydown);
  actionCell.appendChild(deleteButton);

  row.append(startTimeCell, endTimeCell, titleCell, planCell, typeCell, actionCell);
  dailyPlanTableBody.appendChild(row);
}

function createDailyPlanClockInput(value, label) {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'daily-plan-clock-input';
  input.placeholder = label === '开始时间' ? '09:00' : '11:30';
  input.value = formatClockDisplay(value);
  input.inputMode = 'numeric';
  input.maxLength = 5;
  input.autocomplete = 'off';
  input.setAttribute('aria-label', `${label}，请输入四位数字`);
  input.addEventListener('focus', () => input.select());
  input.addEventListener('click', () => input.select());
  input.addEventListener('beforeinput', (event) => {
    if (event.inputType === 'insertText' && /\D/.test(event.data || '')) event.preventDefault();
  });
  input.addEventListener('input', () => {
    input.value = formatClockDisplay(input.value);
    const digits = formatClockDigits(input.value);
    input.classList.toggle('time-invalid', digits.length === 4 && !clockDigitsToTime(input.value));
  });
  input.addEventListener('blur', () => validateDailyPlanClockInput(input));
  input.addEventListener('keydown', handleDailyPlanGridKeydown);
  return input;
}

function validateDailyPlanClockInput(input) {
  const valid = Boolean(clockDigitsToTime(input.value));
  input.classList.toggle('time-invalid', !valid && Boolean(input.value));
  input.setAttribute('aria-invalid', String(!valid && Boolean(input.value)));
  input.title = valid || !input.value ? '' : '请输入四位 24 小时制时间，例如 0930。';
  return valid;
}

function handleDailyPlanGridKeydown(event) {
  const control = event.currentTarget;
  const row = control.closest('tr');
  if (!row) return;
  const columnIndex = Array.from(row.cells).findIndex((cell) => cell.contains(control));
  if (columnIndex < 0) return;

  if (control instanceof HTMLSelectElement) {
    if (event.key === 'Enter') {
      window.setTimeout(() => focusDailyPlanGridCell(dailyPlanRowIndex(row), columnIndex + 1), 0);
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      focusDailyPlanGridCell(dailyPlanRowIndex(row), columnIndex + (event.key === 'ArrowLeft' ? -1 : 1));
    }
    return;
  }

  if (control instanceof HTMLButtonElement) {
    if (event.key === 'Enter') {
      event.preventDefault();
      control.click();
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusDailyPlanGridCell(dailyPlanRowIndex(row), columnIndex - 1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      focusDailyPlanGridCell(dailyPlanRowIndex(row) + (event.key === 'ArrowUp' ? -1 : 1), columnIndex);
    }
    return;
  }

  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
    focusDailyPlanGridCell(dailyPlanRowIndex(row) + (event.key === 'ArrowUp' ? -1 : 1), columnIndex);
    return;
  }

  const atLeftEdge = control.selectionStart === 0 && control.selectionEnd === 0;
  const atRightEdge = control.selectionStart === control.value.length && control.selectionEnd === control.value.length;
  if (event.key === 'ArrowLeft' && atLeftEdge) {
    event.preventDefault();
    focusDailyPlanGridCell(dailyPlanRowIndex(row), columnIndex - 1);
  } else if (event.key === 'ArrowRight' && atRightEdge) {
    event.preventDefault();
    focusDailyPlanGridCell(dailyPlanRowIndex(row), columnIndex + 1);
  }
}

function dailyPlanRowIndex(row) {
  return Array.from(dailyPlanTableBody.querySelectorAll('tr')).indexOf(row);
}

function focusDailyPlanGridCell(rowIndex, columnIndex) {
  const rows = Array.from(dailyPlanTableBody.querySelectorAll('tr'));
  const row = rows[rowIndex];
  if (!row || columnIndex < 0 || columnIndex >= row.cells.length) return;
  const control = row.cells[columnIndex].querySelector('input, select, button');
  if (!control) return;

  control.focus();
  if (control instanceof HTMLInputElement) {
    control.select();
  } else if (control instanceof HTMLSelectElement) {
    try {
      if (typeof control.showPicker === 'function') control.showPicker();
      else control.click();
    } catch (error) {
      control.click();
    }
  }
}

function handleDailyPlanDateModeChange() {
  if (!dailyPlanMultiDay) return;
  if (dailyPlanMultiDay.checked) {
    commitDateInput(dailyPlanDate);
    const date = normalizeDate(dailyPlanDate.value) || taskDateFilter.value || formatLocalDate(currentEffectiveNow);
    setDateInputValue(dailyPlanStartDate, date);
    setDateInputValue(dailyPlanEndDate, date);
  } else {
    commitDateInput(dailyPlanStartDate);
    const date = normalizeDate(dailyPlanStartDate.value) || dailyPlanDate.value || taskDateFilter.value || formatLocalDate(currentEffectiveNow);
    setDateInputValue(dailyPlanDate, date);
  }
  syncDailyPlanDateMode();
}

function syncDailyPlanDateMode() {
  const multiDay = Boolean(dailyPlanMultiDay && dailyPlanMultiDay.checked);
  dailyPlanSingleDateRow.classList.toggle('hidden', multiDay);
  dailyPlanSingleDateRow.setAttribute('aria-hidden', multiDay ? 'true' : 'false');
  dailyPlanRangeRow.classList.toggle('hidden', !multiDay);
  dailyPlanRangeRow.setAttribute('aria-hidden', multiDay ? 'false' : 'true');

  if (!multiDay) {
    setDateInputValue(dailyPlanDate, dailyPlanDate.value || dailyPlanStartDate.value || taskDateFilter.value || formatLocalDate(currentEffectiveNow));
    return;
  }

  const fallbackDate = dailyPlanDate.value || taskDateFilter.value || formatLocalDate(currentEffectiveNow);
  setDateInputValue(dailyPlanStartDate, dailyPlanStartDate.value || fallbackDate);
  setDateInputValue(dailyPlanEndDate, dailyPlanEndDate.value || dailyPlanStartDate.value);
  constrainDailyPlanEndDate();
}

function constrainDailyPlanEndDate() {
  if (!dailyPlanStartDate || !dailyPlanEndDate) return;
  const startDate = normalizeDate(dailyPlanStartDate.value);
  dailyPlanEndDate.min = startDate || '';
  if (startDate && normalizeDate(dailyPlanEndDate.value) && normalizeDate(dailyPlanEndDate.value) < startDate) {
    setDateInputValue(dailyPlanEndDate, startDate);
  }
}

async function saveDailyPlanTable() {
  const dates = selectedDailyPlanDates();
  if (dates.length === 0) {
    setStatus('请先选择有效的安排日期。', '');
    return;
  }

  let hasInvalidRow = false;
  const planRows = Array.from(dailyPlanTableBody.querySelectorAll('tr'))
    .map((row, index) => {
      const startTimeInput = row.querySelector('td:nth-child(1) input');
      const endTimeInput = row.querySelector('td:nth-child(2) input');
      const titleInput = row.querySelector('td:nth-child(3) input');
      const planInput = row.querySelector('td:nth-child(4) input');
      const typeSelect = row.querySelector('select');
      const title = clean(titleInput.value);
      const planDetails = clean(planInput.value);
      if (!title && !planDetails) return null;

      const startTime = clockDigitsToTime(startTimeInput.value);
      const endTime = clockDigitsToTime(endTimeInput.value);
      const validStart = validateDailyPlanClockInput(startTimeInput);
      const validEnd = validateDailyPlanClockInput(endTimeInput);
      titleInput.classList.toggle('time-invalid', !title);
      titleInput.setAttribute('aria-invalid', String(!title));
      if (!validStart || !validEnd || !title) {
        hasInvalidRow = true;
        return null;
      }

      return {
        title,
        planDetails,
        startTime,
        endTime,
        typeId: typeSelect.value,
        index
      };
    })
    .filter(Boolean);

  if (hasInvalidRow) {
    setStatus('请补全标红的任务名和四位时间，时间需符合 24 小时制。', 'error', 5000);
    return;
  }

  if (planRows.length === 0) {
    setStatus('请至少填写一条有效的时间段和任务。', '');
    return;
  }

  const orderCounters = new Map();
  const newTasks = [];
  dates.forEach((date) => {
    planRows.forEach((planRow) => {
      newTasks.push({
        id: `daily-${Date.now()}-${date}-${planRow.index}`,
        title: planRow.title,
        startTime: planRow.startTime,
        endTime: planRow.endTime,
        date,
        weekday: weekdayFromDate(date),
        location: '',
        typeId: planRow.typeId,
        type: taskCategoryById(planRow.typeId)?.name || '',
        planDetails: planRow.planDetails,
        details: '',
        status: '未评价',
        rawText: '',
        sheetName: '手动安排',
        order: nextOrderForDate(date, orderCounters) + planRow.index * 10,
        isDraft: false
      });
    });
  });

  tasks = mergeTasks(tasks, newTasks);
  setDateInputValue(taskDateFilter, dates[0]);
  dates.forEach((date) => activePlanningDates.add(date));
  await saveState();
  closeDailyPlanTableModal();
  renderAll();
  setStatus(dates.length === 1
    ? `已生成 ${newTasks.length} 条当日安排。`
    : `已生成 ${dates[0]} 至 ${dates[dates.length - 1]} 的 ${newTasks.length} 条安排。`, 'hidden');
}

function selectedDailyPlanDates() {
  commitDateInput(dailyPlanDate);
  commitDateInput(dailyPlanStartDate);
  commitDateInput(dailyPlanEndDate);
  if (!dailyPlanMultiDay || !dailyPlanMultiDay.checked) {
    const date = normalizeDate(dailyPlanDate.value);
    return date ? [date] : [];
  }

  constrainDailyPlanEndDate();
  return enumerateDates(normalizeDate(dailyPlanStartDate.value), normalizeDate(dailyPlanEndDate.value));
}

function handleDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add('drag-over');
}

function handleDragLeave(event) {
  event.currentTarget.classList.remove('drag-over');
}

function handleDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove('drag-over');

  const file = event.dataTransfer.files && event.dataTransfer.files[0];
  if (!file) return;
  importDroppedFile(file);
}

function renderTasks(options = {}) {
  const selectedDate = clean(taskDateFilter.value);
  const visibleTasks = selectedDate
    ? tasks.filter((task) => isRenderableTask(task) && normalizeDate(task.date) === selectedDate)
    : tasks.filter(isRenderableTask);
  renderTaskDurationSummary(visibleTasks);
  emptyState.classList.add('hidden');
  taskWorkspace.classList.remove('hidden');
  taskList.innerHTML = '';

  const sortedTasks = sortTasksForDisplay(visibleTasks);
  const conflictingTaskIds = findConflictingTaskIds(sortedTasks);

  sortedTasks.forEach((task) => {
    const card = document.createElement('article');
    card.className = 'task-card';
    const hasTimeConflict = conflictingTaskIds.has(task.id);
    if (hasTimeConflict) {
      card.classList.add('task-time-conflict');
      card.title = '这个时间段与同一天的其他任务冲突，请修改开始或结束时间。';
    }
    card.dataset.taskId = task.id;
    card.addEventListener('dragover', handleTaskDragOver);
    card.addEventListener('drop', handleTaskDrop);

    const time = document.createElement('div');
    time.className = 'task-time task-time-editor';
    time.classList.toggle('task-time-conflict-text', hasTimeConflict);
    const startInput = createTaskTimeButton(task, 'startTime', '开始时间');
    startInput.classList.toggle('time-conflict', hasTimeConflict);
    const separator = document.createElement('span');
    separator.textContent = '-';
    const endInput = createTaskTimeButton(task, 'endTime', '结束时间');
    endInput.classList.toggle('time-conflict', hasTimeConflict);
    time.append(startInput, separator, endInput);

    const body = document.createElement('div');
    body.className = 'task-body-editor';
    const title = createInlineInput('text', task.title, '任务条目');
    title.className = 'inline-field task-title-input';
    title.addEventListener('blur', () => updateTaskField(task.id, 'title', title.value));
    title.addEventListener('keydown', blurOnEnter);
    const meta = document.createElement('div');
    meta.className = 'task-meta';
    const typeSelect = createTypeSelect(task.typeId || task.type);
    typeSelect.addEventListener('change', () => updateTaskField(task.id, 'typeId', typeSelect.value));
    meta.appendChild(typeSelect);
    const locationText = formatMeta(task);
    if (locationText) {
      const location = document.createElement('span');
      location.textContent = locationText;
      meta.appendChild(location);
    }
    const planDetails = document.createElement('textarea');
    planDetails.className = 'inline-field task-plan-input';
    planDetails.placeholder = '事前计划：具体要做什么';
    planDetails.value = task.planDetails || '';
    planDetails.addEventListener('blur', () => updateTaskField(task.id, 'planDetails', planDetails.value));
    body.append(title);
    body.appendChild(meta);
    body.appendChild(planDetails);

    const actions = document.createElement('div');
    actions.className = 'task-card-actions';
    const deleteButton = document.createElement('button');
    deleteButton.className = 'task-delete-button';
    deleteButton.type = 'button';
    deleteButton.setAttribute('aria-label', '删除条目');
    deleteButton.textContent = '×';
    deleteButton.addEventListener('click', () => deleteTask(task.id));
    const statusSelect = createTaskStatusSelect(task.status);
    statusSelect.addEventListener('change', () => {
      statusSelect.className = `task-status-select status-${statusClass(statusSelect.value)}`;
      void updateTaskField(task.id, 'status', statusSelect.value, { render: false });
    });
    const noteButton = document.createElement('button');
    noteButton.className = `task-note-button${clean(task.details) ? ' has-note' : ''}`;
    noteButton.type = 'button';
    noteButton.textContent = '✎';
    noteButton.title = clean(task.details) ? '查看任务备注' : '添加任务备注';
    noteButton.setAttribute('aria-label', noteButton.title);
    noteButton.addEventListener('click', () => openTaskEditModal(task.id));
    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle';
    dragHandle.draggable = true;
    dragHandle.title = '长按拖动调整顺序';
    dragHandle.textContent = '≡';
    dragHandle.addEventListener('dragstart', (event) => handleTaskDragStart(event, task.id));
    dragHandle.addEventListener('dragend', handleTaskDragEnd);
    actions.append(deleteButton, statusSelect, noteButton, dragHandle);

    card.append(time, body, actions);
    taskList.appendChild(card);
  });

  taskList.appendChild(createAddTaskRow());
  updateTaskTemporalView({
    scrollToCurrent: Boolean(options.scrollToCurrent),
    forceScroll: Boolean(options.forceScroll)
  });
}

function renderTaskDurationSummary(dayTasks) {
  if (!taskDurationSummary) return;

  const minutesByType = sumTaskMinutesByType(dayTasks);
  const parts = taskSummaryCategories(minutesByType)
    .filter((category) => minutesByType[category.id] > 0)
    .map((category) => `${category.name}：${formatDurationHours(minutesByType[category.id])}`);

  taskDurationSummary.innerHTML = '';
  parts.forEach((part) => {
    const item = document.createElement('span');
    item.textContent = part;
    taskDurationSummary.appendChild(item);
  });
  taskDurationSummary.classList.toggle('hidden', parts.length === 0);
}

function renderProfileStats() {
  if (!profileStatsSummary || !profileStatsPie || !profileStatsDaily || !profileStatsStartDate || !profileStatsPeriod) return;

  if (!committedProfileStatsStartDate) {
    committedProfileStatsStartDate = formatLocalDate(currentEffectiveNow || new Date());
  }
  committedProfileStatsStartDate = normalizeProfileStatsReferenceDate(
    profileStatsPeriod.value || 'week',
    committedProfileStatsStartDate
  );
  syncProfileStatsReferenceControls();

  const range = dateRangeForProfileStats(
    profileStatsPeriod.value || 'week',
    committedProfileStatsStartDate
  );
  const rangeDates = enumerateDates(range.start, range.end);
  const rangeTasks = tasks.filter((task) => {
    const date = normalizeDate(task.date);
    return isRenderableTask(task) && date && date >= range.start && date <= range.end;
  });
  const scheduledDates = new Set(rangeTasks.map((task) => normalizeDate(task.date)).filter(Boolean));
  const statusCounts = {
    done: rangeTasks.filter((task) => normalizeTaskStatus(task.status) === '已完成').length,
    partial: rangeTasks.filter((task) => normalizeTaskStatus(task.status) === '部分完成').length,
    missed: rangeTasks.filter((task) => normalizeTaskStatus(task.status) === '未完成').length,
    pending: rangeTasks.filter((task) => normalizeTaskStatus(task.status) === '未评价').length
  };
  const minutesByType = sumTaskMinutesByType(rangeTasks);
  const totalMinutes = Object.values(minutesByType).reduce((sum, minutes) => sum + minutes, 0);

  if (profileStatsRangeText) {
    profileStatsRangeText.textContent = `${range.start} 至 ${range.end}`;
  }

  profileStatsSummary.innerHTML = '';
  [
    ['有安排日期', `${scheduledDates.size} / ${rangeDates.length}`, `共 ${rangeTasks.length} 个任务`, 'scheduled'],
    ['完成', `${statusCounts.done} 个`, `${formatPercent(statusCounts.done, rangeTasks.length)} 的任务`, 'done'],
    ['部分完成', `${statusCounts.partial} 个`, `${formatPercent(statusCounts.partial, rangeTasks.length)} 的任务`, 'partial'],
    ['未完成', `${statusCounts.missed} 个`, `${formatPercent(statusCounts.missed, rangeTasks.length)} 的任务`, 'missed'],
    ['未确认', `${statusCounts.pending} 个`, `${formatPercent(statusCounts.pending, rangeTasks.length)} 的任务`, 'pending']
  ].forEach(([label, value, helper, tone]) => {
    const card = document.createElement('div');
    card.className = `stat-card stat-card-${tone}`;
    const title = document.createElement('span');
    title.textContent = label;
    const strong = document.createElement('strong');
    strong.textContent = value;
    const note = document.createElement('small');
    note.textContent = helper;
    card.append(title, strong, note);
    profileStatsSummary.appendChild(card);
  });

  renderProfilePlanAllocation(rangeDates, rangeTasks, minutesByType, totalMinutes);
}

function blurOnEnter(event) {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  event.currentTarget.blur();
}

function normalizeProfileStatsReferenceDate(period, date) {
  const fallback = formatLocalDate(currentEffectiveNow || new Date());
  const baseDate = isSelectableDate(normalizeDate(date)) ? normalizeDate(date) : fallback;
  return dateRangeForProfileStats(period, baseDate).start;
}

function setProfileStatsReferenceDate(date, options = {}) {
  committedProfileStatsStartDate = normalizeProfileStatsReferenceDate(
    profileStatsPeriod?.value || 'week',
    date
  );
  syncProfileStatsReferenceControls();
  if (options.render !== false) renderProfileStats();
}

function handleProfileStatsPeriodChange() {
  setProfileStatsReferenceDate(committedProfileStatsStartDate || formatLocalDate(currentEffectiveNow || new Date()));
  updateContextualNowButton();
}

function commitProfileStatsMonthReference() {
  const match = String(profileStatsMonth?.value || '').match(/^(\d{4})-(\d{2})$/);
  if (!match || Number(match[1]) < Number(MIN_DATE_VALUE.slice(0, 4))) {
    syncProfileStatsReferenceControls();
    return;
  }
  setProfileStatsReferenceDate(`${match[1]}-${match[2]}-01`);
}

function validProfileStatsYear(value) {
  const year = Number(value);
  return Number.isInteger(year) && year >= Number(MIN_DATE_VALUE.slice(0, 4)) && year <= 9999 ? year : null;
}

function commitProfileStatsQuarterReference() {
  const year = validProfileStatsYear(profileStatsQuarterYear?.value);
  const quarter = Number(profileStatsQuarter?.value);
  if (!year || quarter < 1 || quarter > 4) {
    syncProfileStatsReferenceControls();
    return;
  }
  setProfileStatsReferenceDate(`${year}-${String((quarter - 1) * 3 + 1).padStart(2, '0')}-01`);
}

function commitProfileStatsYearReference() {
  const year = validProfileStatsYear(profileStatsYear?.value);
  if (!year) {
    syncProfileStatsReferenceControls();
    return;
  }
  setProfileStatsReferenceDate(`${year}-01-01`);
}

function syncProfileStatsReferenceControls() {
  if (!profileStatsPeriod || !profileStatsStartDate) return;
  const period = profileStatsPeriod.value || 'week';
  const referenceDate = normalizeProfileStatsReferenceDate(period, committedProfileStatsStartDate);
  const year = Number(referenceDate.slice(0, 4));
  const month = Number(referenceDate.slice(5, 7));
  const isDatePeriod = period === 'day' || period === 'week';

  profileStatsReferenceLabel.textContent = {
    day: '日期',
    week: '周一',
    month: '月份',
    quarter: '季度',
    year: '年份'
  }[period];
  profileStatsDateControl.classList.toggle('hidden', !isDatePeriod);
  profileStatsMonth.classList.toggle('hidden', period !== 'month');
  profileStatsQuarterControl.classList.toggle('hidden', period !== 'quarter');
  profileStatsYear.classList.toggle('hidden', period !== 'year');

  profileStatsStartDate.min = period === 'week' ? '1949-01-03' : MIN_DATE_VALUE;
  profileStatsStartDate.step = period === 'week' ? '7' : '1';
  setDateInputValue(profileStatsStartDate, referenceDate);
  profileStatsMonth.value = referenceDate.slice(0, 7);
  profileStatsQuarterYear.value = String(year);
  profileStatsQuarter.value = String(Math.floor((month - 1) / 3) + 1);
  profileStatsYear.value = String(year);

  const previousButton = profileStatsDateControl.querySelector('[data-date-step="-1"]');
  const nextButton = profileStatsDateControl.querySelector('[data-date-step="1"]');
  if (previousButton) previousButton.setAttribute('aria-label', period === 'week' ? '前一周' : '前一天');
  if (nextButton) nextButton.setAttribute('aria-label', period === 'week' ? '后一周' : '后一天');

}

function renderProfilePlanAllocation(rangeDates, rangeTasks, minutesByType, totalMinutes) {
  renderProfileTimePie(minutesByType, totalMinutes);
  profileStatsDaily.innerHTML = '';

  const tasksByDate = new Map();
  rangeTasks.forEach((task) => {
    const date = normalizeDate(task.date);
    if (!tasksByDate.has(date)) tasksByDate.set(date, []);
    tasksByDate.get(date).push(task);
  });

  const buckets = profileTimeBuckets(rangeDates, tasksByDate);
  buckets.forEach((bucket) => {
    const minutesByType = sumTaskMinutesByType(bucket.tasks);
    const total = Object.values(minutesByType).reduce((sum, minutes) => sum + minutes, 0);
    const capacity = Math.max(bucket.dateCount * 24 * 60, 1);
    const row = document.createElement('div');
    row.className = 'stats-day-row';

    const label = document.createElement('span');
    label.className = 'stats-day-label';
    label.textContent = bucket.label;

    const track = document.createElement('div');
    track.className = 'stats-day-track';
    if (total === 0) track.classList.add('empty');
    taskSummaryCategories(minutesByType).forEach((category) => {
      const minutes = minutesByType[category.id] || 0;
      if (minutes <= 0) return;
      const segment = document.createElement('span');
      segment.className = 'stats-day-segment';
      segment.style.background = category.color;
      segment.style.width = `${Math.min(100, (minutes / capacity) * 100)}%`;
      segment.title = `${category.name}：${formatDurationHours(minutes)}`;
      track.appendChild(segment);
    });

    const value = document.createElement('span');
    value.className = 'stats-day-value';
    value.textContent = total ? formatDurationHours(total) : '无安排';
    row.append(label, track, value);
    profileStatsDaily.appendChild(row);
  });
}

function renderProfileTimePie(minutesByType, totalMinutes) {
  profileStatsPie.innerHTML = '';
  const entries = taskSummaryCategories(minutesByType)
    .map((category) => ({ category, minutes: minutesByType[category.id] || 0 }))
    .filter((entry) => entry.minutes > 0);
  const chart = document.createElement('div');
  chart.className = 'stats-time-pie';
  chart.setAttribute('role', 'img');

  if (totalMinutes > 0) {
    let offset = 0;
    const stops = entries.map((entry) => {
      const start = offset;
      offset += (entry.minutes / totalMinutes) * 100;
      return `${entry.category.color} ${start}% ${offset}%`;
    });
    chart.style.background = `conic-gradient(${stops.join(', ')})`;
    chart.setAttribute('aria-label', entries
      .map((entry) => `${entry.category.name}${formatPercent(entry.minutes, totalMinutes)}`)
      .join('，'));
  } else {
    chart.classList.add('empty');
    chart.setAttribute('aria-label', '所选周期暂无任务安排');
  }

  const center = document.createElement('div');
  center.className = 'stats-time-pie-center';
  const centerLabel = document.createElement('span');
  centerLabel.textContent = '总计划';
  const centerValue = document.createElement('strong');
  centerValue.textContent = totalMinutes ? formatDurationHours(totalMinutes) : '0小时';
  center.append(centerLabel, centerValue);
  chart.appendChild(center);

  const legend = document.createElement('div');
  legend.className = 'stats-time-legend';
  if (entries.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'stats-empty muted';
    empty.textContent = '暂无安排';
    legend.appendChild(empty);
  } else {
    entries.forEach((entry) => {
      const item = document.createElement('div');
      item.className = 'stats-time-legend-item';
      const swatch = document.createElement('i');
      swatch.style.background = entry.category.color;
      const name = document.createElement('span');
      name.textContent = entry.category.name;
      const value = document.createElement('strong');
      value.textContent = `${formatPercent(entry.minutes, totalMinutes)} · ${formatDurationHours(entry.minutes)}`;
      item.append(swatch, name, value);
      legend.appendChild(item);
    });
  }
  profileStatsPie.append(chart, legend);
}

function profileTimeBuckets(rangeDates, tasksByDate) {
  if (rangeDates.length <= 31) {
    return rangeDates.map((date) => ({
      key: date,
      label: `${date.slice(5).replace('-', '/')} ${weekdayFromDate(date)}`,
      dateCount: 1,
      tasks: tasksByDate.get(date) || []
    }));
  }

  const buckets = new Map();
  rangeDates.forEach((date) => {
    const month = date.slice(0, 7);
    if (!buckets.has(month)) {
      const [year, monthNumber] = month.split('-');
      buckets.set(month, {
        key: month,
        label: `${year}年${Number(monthNumber)}月`,
        dateCount: 0,
        tasks: []
      });
    }
    const bucket = buckets.get(month);
    bucket.dateCount += 1;
    bucket.tasks.push(...(tasksByDate.get(date) || []));
  });
  return Array.from(buckets.values());
}

function renderAll() {
  populateJournalTagSelects();
  renderJournalTagSettings();
  renderTaskCategorySettings();
  renderTasks();
  renderJournalList();
  renderSelectedJournal();
  renderProfileStats();
}

function showPage(page) {
  if (page !== 'settings' && shortcutCaptureActive) cancelShortcutCapture();
  closeTaskTimePicker();
  navItems.forEach((navItem) => {
    navItem.classList.toggle('active', navItem.dataset.page === page);
  });
  Object.values(pages).forEach((section) => section.classList.remove('active'));
  pages[page].classList.add('active');
  pageTitle.textContent = pageTitleFor(page);
  updateContextualNowButton();
  updateSettingsAsrDownloadProgress();
  if (page === 'records') showRecordsView('editor');
  if (page === 'profile') renderProfileStats();
  if (page === 'settings') clearSettingsPanel();
}

function showRecordsView(view) {
  recordsView = view === 'list' ? 'list' : 'editor';
  if (recordsLayout) {
    recordsLayout.classList.toggle('is-list-view', recordsView === 'list');
    recordsLayout.classList.toggle('is-editor-view', recordsView !== 'list');
    recordsLayout.scrollTop = 0;
  }
  if (journalEditorPanel) journalEditorPanel.classList.toggle('hidden', recordsView === 'list');
  if (recordsListPanel) recordsListPanel.classList.toggle('hidden', recordsView !== 'list');
  if (recordsView === 'list') renderJournalList();
}

function showSettingsPanel(panelKey) {
  const normalizedKey = clean(panelKey);
  settingsMenuButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.settingsPanel === normalizedKey);
  });
  settingsPanels.forEach((panel) => {
    panel.classList.toggle('hidden', panel.dataset.settingsPanel !== normalizedKey);
  });
  if (settingsEmptyPanel) settingsEmptyPanel.classList.toggle('hidden', Boolean(normalizedKey));
  if (normalizedKey === 'shortcuts') renderShortcutSettings();
  if (normalizedKey === 'updates') void refreshUpdateStatus();
}

function clearSettingsPanel() {
  settingsMenuButtons.forEach((button) => button.classList.remove('active'));
  settingsPanels.forEach((panel) => panel.classList.add('hidden'));
  if (settingsEmptyPanel) settingsEmptyPanel.classList.remove('hidden');
}

async function goToCurrentTask() {
  const now = await getEffectiveNow();
  currentEffectiveNow = now;
  const date = formatLocalDate(now);
  setDateInputValue(taskDateFilter, date);
  activePlanningDates.add(date);
  showPage('tasks');
  renderTasks({ scrollToCurrent: true, forceScroll: true });
}

function mergeTasks(currentTasks, importedTasks) {
  const taskMap = new Map(currentTasks.map((task) => [taskIdentity(task), task]));
  const orderCounters = new Map();
  const normalized = importedTasks.map((task, index) => {
    const date = normalizeDate(task.date);
    const categoryId = resolveTaskCategoryId(task.typeId, taskCategories(), task.type || inferTaskType(task.title));
    const category = taskCategoryById(categoryId);
    const order = Number.isFinite(Number(task.order))
      ? Number(task.order)
      : nextOrderForDate(date, orderCounters);

    return {
      id: task.id || `task-${Date.now()}-${index}`,
      title: clean(task.title),
      startTime: clean(task.startTime),
      endTime: clean(task.endTime),
      date,
      weekday: clean(task.weekday),
      location: clean(task.location),
      typeId: categoryId,
      type: category ? category.name : clean(task.type),
      planDetails: clean(task.planDetails),
      details: clean(task.details),
      status: clean(task.status) || '未评价',
      rawText: clean(task.rawText),
      sheetName: clean(task.sheetName),
      source: clean(task.source),
      splitParentId: clean(task.splitParentId),
      order,
      isDraft: Boolean(task.isDraft)
    };
  });

  normalized.forEach((task) => {
    taskMap.set(taskIdentity(task), task);
  });

  return Array.from(taskMap.values());
}

async function addTaskForSelectedDate() {
  const date = ensureSelectedDate();
  activePlanningDates.add(date);
  const task = createBlankTask(date);
  tasks = mergeTasks(tasks, [task]);
  await saveState();
  renderTasks();

  requestAnimationFrame(() => {
    const titleInput = taskList.querySelector(`[data-task-id="${task.id}"] .task-title-input`);
    if (titleInput) titleInput.focus();
  });
}

function templateItemsForDate(date) {
  return sortTasksForDisplay(tasks.filter((task) => {
    return isRenderableTask(task)
      && normalizeDate(task.date) === normalizeDate(date)
      && Boolean(clean(task.title))
      && timeToMinutes(task.startTime) !== null
      && timeToMinutes(task.endTime) !== null;
  })).map((task) => ({
    startTime: normalizeTime(task.startTime),
    endTime: normalizeTime(task.endTime),
    title: clean(task.title),
    typeId: taskCategoryForTask(task)?.id || '',
    type: taskCategoryForTask(task)?.name || clean(task.type)
  }));
}

function openSaveTaskTemplateModal() {
  const date = ensureSelectedDate();
  const items = templateItemsForDate(date);
  if (items.length === 0) {
    setStatus('当前日期没有可保存为模板的完整安排。', 'error', 4000);
    return;
  }

  taskTemplateName.value = '';
  taskTemplateSaveSummary.textContent = `将保存 ${items.length} 条安排，仅包含时间段、任务名和任务分类。`;
  clearTaskTemplateSaveError();
  saveTaskTemplateModal.classList.remove('hidden');
  requestAnimationFrame(() => taskTemplateName.focus());
}

function closeSaveTaskTemplateModal() {
  saveTaskTemplateModal.classList.add('hidden');
  clearTaskTemplateSaveError();
}

function clearTaskTemplateSaveError() {
  if (!taskTemplateSaveError) return;
  taskTemplateSaveError.textContent = '';
  taskTemplateSaveError.classList.add('hidden');
}

function showTaskTemplateSaveError(message) {
  taskTemplateSaveError.textContent = message;
  taskTemplateSaveError.classList.remove('hidden');
}

async function saveCurrentDayAsTemplate(event) {
  event.preventDefault();
  const name = clean(taskTemplateName.value);
  const date = ensureSelectedDate();
  const items = templateItemsForDate(date);
  if (!name) {
    showTaskTemplateSaveError('请输入模板名称。');
    taskTemplateName.focus();
    return;
  }
  if (items.length === 0) {
    showTaskTemplateSaveError('当前日期没有可保存为模板的完整安排。');
    return;
  }

  const templates = taskTemplates();
  templates.push({
    id: `task-template-${Date.now()}`,
    name,
    createdAt: new Date().toISOString(),
    items
  });
  profile = { ...normalizedProfile(), taskTemplates: templates };
  await saveState();
  closeSaveTaskTemplateModal();
  setStatus(`已保存安排模板“${name}”。`, '', 5000);
}

function openReuseTemplateModal() {
  selectedTaskTemplateId = '';
  expandedTaskTemplateId = '';
  editingTaskTemplateId = '';
  renderTaskTemplateList();
  closeImportChoiceModal();
  reuseTemplateModal.classList.remove('hidden');
}

function closeReuseTemplateModal() {
  reuseTemplateModal.classList.add('hidden');
  selectedTaskTemplateId = '';
  expandedTaskTemplateId = '';
  editingTaskTemplateId = '';
}

function renderTaskTemplateList() {
  const templates = taskTemplates();
  taskTemplateList.innerHTML = '';
  taskTemplateEmpty.classList.toggle('hidden', templates.length > 0);

  templates.forEach((template) => {
    const item = document.createElement('article');
    item.className = 'task-template-item';
    item.classList.toggle('is-selected', template.id === selectedTaskTemplateId);
    item.classList.toggle('is-expanded', template.id === expandedTaskTemplateId);

    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'task-template-row';
    row.setAttribute('aria-expanded', template.id === expandedTaskTemplateId ? 'true' : 'false');

    const selection = document.createElement('span');
    selection.className = 'task-template-selection';
    selection.setAttribute('aria-hidden', 'true');

    const name = document.createElement('strong');
    name.textContent = template.name;

    const count = document.createElement('span');
    count.className = 'task-template-count';
    count.textContent = `${template.items.length} 条安排`;

    const toggle = document.createElement('span');
    toggle.className = 'task-template-toggle';
    toggle.textContent = template.id === expandedTaskTemplateId ? '收起' : '展开';
    row.append(selection, name, count, toggle);
    row.addEventListener('click', () => selectTaskTemplate(template.id));

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'task-template-edit-button';
    editButton.classList.toggle('is-editing', template.id === editingTaskTemplateId);
    editButton.textContent = template.id === editingTaskTemplateId ? '查看' : '修改';
    editButton.title = template.id === editingTaskTemplateId ? '切换为预览' : `修改模板“${template.name}”`;
    editButton.setAttribute('aria-label', editButton.title);
    editButton.setAttribute('aria-pressed', String(template.id === editingTaskTemplateId));
    editButton.addEventListener('click', (event) => {
      event.stopPropagation();
      selectedTaskTemplateId = template.id;
      expandedTaskTemplateId = template.id;
      editingTaskTemplateId = editingTaskTemplateId === template.id ? '' : template.id;
      renderTaskTemplateList();
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'task-template-delete-button';
    deleteButton.textContent = '×';
    deleteButton.title = `删除模板“${template.name}”`;
    deleteButton.setAttribute('aria-label', deleteButton.title);
    deleteButton.addEventListener('click', async (event) => {
      event.stopPropagation();
      deleteButton.disabled = true;
      await deleteTaskTemplate(template.id);
    });

    const rowLayout = document.createElement('div');
    rowLayout.className = 'task-template-row-layout';
    rowLayout.append(row, editButton, deleteButton);
    item.appendChild(rowLayout);

    if (template.id === expandedTaskTemplateId) {
      const details = document.createElement('div');
      details.className = 'task-template-details';
      if (template.id === editingTaskTemplateId) {
        details.classList.add('is-editing');
        details.appendChild(createTaskTemplateEditorHeading());
        template.items.forEach((task, index) => {
          details.appendChild(createTaskTemplateEditor(template.id, task, index));
        });
      } else {
        template.items.forEach((task) => details.appendChild(createTaskTemplatePreview(task)));
      }
      item.appendChild(details);
    }
    taskTemplateList.appendChild(item);
  });

  confirmReuseTemplateButton.disabled = !templates.some((template) => template.id === selectedTaskTemplateId);
}

async function deleteTaskTemplate(templateId) {
  const templates = taskTemplates();
  const template = templates.find((item) => item.id === templateId);
  if (!template) return;

  profile = {
    ...normalizedProfile(),
    taskTemplates: templates.filter((item) => item.id !== templateId)
  };
  if (selectedTaskTemplateId === templateId) selectedTaskTemplateId = '';
  if (expandedTaskTemplateId === templateId) expandedTaskTemplateId = '';
  if (editingTaskTemplateId === templateId) editingTaskTemplateId = '';
  await saveState();
  renderTaskTemplateList();
  setStatus(`已删除安排模板“${template.name}”。`, '', 4000);
}

function selectTaskTemplate(templateId) {
  if (selectedTaskTemplateId === templateId) {
    expandedTaskTemplateId = expandedTaskTemplateId === templateId ? '' : templateId;
    if (expandedTaskTemplateId !== templateId) editingTaskTemplateId = '';
  } else {
    selectedTaskTemplateId = templateId;
    expandedTaskTemplateId = templateId;
    editingTaskTemplateId = '';
  }
  renderTaskTemplateList();
}

function createTaskTemplateEditorHeading() {
  const heading = document.createElement('div');
  heading.className = 'task-template-editor-heading';
  ['开始时间', '', '结束时间', '任务内容', '任务分类', ''].forEach((text) => {
    const label = document.createElement('span');
    label.textContent = text;
    heading.appendChild(label);
  });
  return heading;
}

function createTaskTemplateEditor(templateId, task, itemIndex) {
  const row = document.createElement('div');
  row.className = 'task-template-editor-row';

  const startTime = createTaskTemplateTimeEditor(
    task.startTime,
    '开始时间',
    (value) => updateTaskTemplateItem(templateId, itemIndex, { startTime: value })
  );
  const separator = document.createElement('span');
  separator.className = 'task-template-editor-separator';
  separator.textContent = '—';
  const endTime = createTaskTemplateTimeEditor(
    task.endTime,
    '结束时间',
    (value) => updateTaskTemplateItem(templateId, itemIndex, { endTime: value })
  );

  const title = document.createElement('input');
  title.type = 'text';
  title.className = 'task-template-title-input';
  title.value = task.title;
  title.autocomplete = 'off';
  title.setAttribute('aria-label', '任务内容');
  let committedTitle = task.title;
  const commitTitle = async () => {
    const nextTitle = clean(title.value);
    if (!nextTitle) {
      title.value = committedTitle;
      setStatus('模板中的任务内容不能为空。', 'error', 4000);
      return;
    }
    title.value = nextTitle;
    if (nextTitle === committedTitle) return;
    title.disabled = true;
    const saved = await updateTaskTemplateItem(templateId, itemIndex, { title: nextTitle });
    title.disabled = false;
    if (saved) committedTitle = nextTitle;
    else title.value = committedTitle;
  };
  title.addEventListener('blur', () => void commitTitle());
  title.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      title.blur();
    } else if (event.key === 'Escape') {
      title.value = committedTitle;
      title.blur();
    }
  });

  const category = createTypeSelect(task.typeId || task.type);
  category.classList.add('task-template-category-select');
  let committedCategoryId = category.value;
  const commitCategory = async () => {
    const nextCategoryId = category.value;
    if (!nextCategoryId || nextCategoryId === committedCategoryId) return;
    category.disabled = true;
    const saved = await updateTaskTemplateItem(templateId, itemIndex, { typeId: nextCategoryId });
    category.disabled = false;
    if (saved) {
      committedCategoryId = nextCategoryId;
    } else {
      category.value = committedCategoryId;
      category.dataset.taskCategoryId = committedCategoryId;
      styleTaskCategoryControl(category, taskCategoryById(committedCategoryId));
    }
  };
  category.addEventListener('blur', () => void commitCategory());
  category.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      category.blur();
    } else if (event.key === 'Escape') {
      category.value = committedCategoryId;
      category.blur();
    }
  });

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'task-template-task-delete-button';
  deleteButton.textContent = '×';
  deleteButton.title = `删除任务“${task.title}”`;
  deleteButton.setAttribute('aria-label', deleteButton.title);
  deleteButton.addEventListener('click', async () => {
    deleteButton.disabled = true;
    await deleteTaskTemplateItem(templateId, itemIndex);
  });

  row.append(startTime, separator, endTime, title, category, deleteButton);
  return row;
}

function createTaskTemplateTimeEditor(value, label, onCommit) {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'task-template-time-input';
  input.value = formatClockDisplay(value);
  input.inputMode = 'numeric';
  input.maxLength = 5;
  input.autocomplete = 'off';
  input.setAttribute('aria-label', `${label}，请输入四位 24 小时制时间`);
  let committedValue = clockDigitsToTime(value);

  input.addEventListener('focus', () => input.select());
  input.addEventListener('click', () => input.select());
  input.addEventListener('beforeinput', (event) => {
    if (event.inputType === 'insertText' && /\D/.test(event.data || '')) event.preventDefault();
  });
  input.addEventListener('input', () => {
    input.value = formatClockDisplay(input.value);
    const digits = formatClockDigits(input.value);
    input.classList.toggle('time-invalid', digits.length === 4 && !clockDigitsToTime(input.value));
  });
  input.addEventListener('blur', async () => {
    const nextValue = clockDigitsToTime(input.value);
    if (!nextValue) {
      input.value = committedValue;
      input.classList.remove('time-invalid');
      setStatus(`${label}格式不正确，请输入四位 24 小时制时间。`, 'error', 4000);
      return;
    }
    input.value = nextValue;
    if (nextValue === committedValue) return;
    input.disabled = true;
    const saved = await onCommit(nextValue);
    input.disabled = false;
    if (saved) committedValue = nextValue;
    else input.value = committedValue;
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      input.blur();
    } else if (event.key === 'Escape') {
      input.value = committedValue;
      input.classList.remove('time-invalid');
      input.blur();
    }
  });
  return input;
}

async function updateTaskTemplateItem(templateId, itemIndex, patch) {
  const templates = taskTemplates();
  const template = templates.find((item) => item.id === templateId);
  if (!template || !template.items[itemIndex]) return false;

  const categories = taskCategories();
  const nextItems = template.items.map((item, index) => {
    if (index !== itemIndex) return item;
    const nextItem = { ...item, ...patch };
    if (patch.typeId) {
      const selectedCategory = taskCategoryById(patch.typeId, categories);
      nextItem.typeId = selectedCategory ? selectedCategory.id : item.typeId;
      nextItem.type = selectedCategory ? selectedCategory.name : item.type;
    }
    return nextItem;
  });
  return persistTaskTemplateItems(templateId, nextItems);
}

async function deleteTaskTemplateItem(templateId, itemIndex) {
  const template = taskTemplates().find((item) => item.id === templateId);
  if (!template || !template.items[itemIndex]) return;
  const deletedTask = template.items[itemIndex];
  const nextItems = template.items.filter((_, index) => index !== itemIndex);

  if (nextItems.length === 0) {
    await deleteTaskTemplate(templateId);
    return;
  }

  const saved = await persistTaskTemplateItems(templateId, nextItems);
  if (!saved) return;
  renderTaskTemplateList();
  setStatus(`已从模板中删除任务“${deletedTask.title}”。`, '', 4000);
}

async function persistTaskTemplateItems(templateId, items) {
  const templates = taskTemplates();
  const templateIndex = templates.findIndex((item) => item.id === templateId);
  if (templateIndex < 0) return false;
  const previousProfile = profile;
  const nextTemplates = templates.map((template, index) => (
    index === templateIndex ? { ...template, items } : template
  ));
  profile = { ...normalizedProfile(), taskTemplates: nextTemplates };
  try {
    await saveState();
    return true;
  } catch (error) {
    profile = previousProfile;
    setStatus(`保存模板修改失败：${error.message || String(error)}`, 'error', 5000);
    return false;
  }
}

function createTaskTemplatePreview(task) {
  const row = document.createElement('div');
  row.className = 'task-template-preview';

  const time = document.createElement('span');
  time.className = 'task-template-time';
  time.textContent = `${task.startTime} - ${task.endTime}`;

  const title = document.createElement('span');
  title.className = 'task-template-title';
  title.textContent = task.title;

  const type = document.createElement('span');
  const category = taskCategoryForTask(task);
  type.className = 'task-template-type';
  type.textContent = category ? category.name : '未分配';
  if (category) type.dataset.taskCategoryId = category.id;
  styleTaskCategoryControl(type, category);
  row.append(time, title, type);
  return row;
}

async function confirmReuseTemplate() {
  const template = taskTemplates().find((item) => item.id === selectedTaskTemplateId);
  if (!template) {
    setStatus('请选择要复用的安排模板。', 'error', 4000);
    return;
  }

  confirmReuseTemplateButton.disabled = true;
  try {
    const targetDate = ensureSelectedDate();
    const baseOrder = nextOrderForDate(targetDate);
    const timestamp = Date.now();
    const clones = template.items.map((task, index) => ({
      id: `template-reuse-${timestamp}-${index}`,
      title: task.title,
      startTime: task.startTime,
      endTime: task.endTime,
      date: targetDate,
      weekday: weekdayFromDate(targetDate),
      location: '',
      typeId: task.typeId,
      type: task.type,
      planDetails: '',
      details: '',
      status: '未评价',
      rawText: '',
      sheetName: '',
      source: 'task-template',
      splitParentId: '',
      order: baseOrder + index * 10,
      isDraft: false
    }));

    tasks = mergeTasks(tasks, clones);
    activePlanningDates.add(targetDate);
    await saveState();
    closeReuseTemplateModal();
    renderTasks();
    setStatus(`已复用模板“${template.name}”，添加 ${clones.length} 条安排。`, '', 5000);
  } catch (error) {
    confirmReuseTemplateButton.disabled = false;
    setStatus(`复用模板失败：${error.message}`, 'error', 5000);
  }
}

function createBlankTask(date) {
  const category = defaultTaskCategory();
  return {
    id: `manual-${Date.now()}`,
    title: '',
    startTime: '',
    endTime: '',
    date,
    weekday: '',
    location: '',
    typeId: category ? category.id : '',
    type: category ? category.name : '',
    planDetails: '',
    details: '',
    status: '未评价',
    rawText: '',
    sheetName: '',
    source: 'manual',
    order: nextOrderForDate(date),
    isDraft: true
  };
}

function removeGeneratedScheduleTasks(taskItems) {
  return taskItems.filter((task) => {
    if (task.source === 'schedule-template') return false;
    return task.sheetName !== '手动课表';
  });
}

function createAddTaskRow() {
  const row = document.createElement('button');
  row.className = 'add-task-row';
  row.type = 'button';
  row.textContent = '+';
  row.setAttribute('aria-label', '新增一条安排');
  row.addEventListener('click', addTaskForSelectedDate);
  return row;
}

function createInlineInput(type, value, label) {
  const input = document.createElement('input');
  input.className = 'inline-field';
  input.type = type;
  input.value = clean(value);
  input.setAttribute('aria-label', label);
  return input;
}

function createTaskTimeButton(task, field, label) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'inline-field time-input task-time-button';
  button.textContent = displayTaskTime(task[field]);
  button.setAttribute('aria-label', `${label}，当前 ${button.textContent}`);
  button.title = `点击选择${label}`;
  button.addEventListener('click', () => openTaskTimePicker(button, task.id, field, task[field], label));
  return button;
}

function displayTaskTime(value) {
  return timeToMinutes(value) === null ? '--:--' : normalizeTime(value);
}

function openTaskTimePicker(anchor, taskId, field, value, label) {
  const normalized = displayTaskTime(value) === '--:--' ? '00:00' : displayTaskTime(value);
  activeTaskTimePicker = { anchor, taskId, field };
  taskTimePickerTitle.textContent = label;
  taskTimePickerHour.value = normalized.slice(0, 2);
  taskTimePickerMinute.value = normalized.slice(3, 5);
  taskTimePicker.classList.remove('hidden');
  positionTaskTimePicker();
  window.requestAnimationFrame(() => {
    taskTimePickerHour.focus();
    taskTimePickerHour.select();
  });
}

function positionTaskTimePicker() {
  if (!activeTaskTimePicker || taskTimePicker.classList.contains('hidden')) return;
  const anchorRect = activeTaskTimePicker.anchor.getBoundingClientRect();
  const pickerRect = taskTimePicker.getBoundingClientRect();
  const margin = 10;
  const maxLeft = Math.max(margin, window.innerWidth - pickerRect.width - margin);
  const left = Math.min(maxLeft, Math.max(margin, anchorRect.left + anchorRect.width / 2 - pickerRect.width / 2));
  const below = anchorRect.bottom + 8;
  const top = below + pickerRect.height <= window.innerHeight - margin
    ? below
    : Math.max(margin, anchorRect.top - pickerRect.height - 8);
  taskTimePicker.style.left = `${Math.round(left)}px`;
  taskTimePicker.style.top = `${Math.round(top)}px`;
}

function taskTimePickerInput(unit) {
  return unit === 'hour' ? taskTimePickerHour : taskTimePickerMinute;
}

function taskTimePickerUnitMax(unit) {
  return unit === 'hour' ? 23 : 59;
}

function sanitizeTaskTimePickerUnit(input, max) {
  const digits = input.value.replace(/\D/g, '').slice(0, 2);
  if (!digits) {
    input.value = '';
    return;
  }
  input.value = String(Math.min(max, Number(digits)));
}

function stepTaskTimePickerUnit(unit, amount) {
  const input = taskTimePickerInput(unit);
  const max = taskTimePickerUnitMax(unit);
  const current = Number(input.value || 0);
  const next = (current + amount + max + 1) % (max + 1);
  input.value = String(next).padStart(2, '0');
  input.focus();
  input.select();
}

function normalizeTaskTimePickerUnit(input, max) {
  sanitizeTaskTimePickerUnit(input, max);
  input.value = String(Math.min(max, Number(input.value || 0))).padStart(2, '0');
}

async function confirmTaskTimePicker() {
  if (!activeTaskTimePicker) return;
  normalizeTaskTimePickerUnit(taskTimePickerHour, 23);
  normalizeTaskTimePickerUnit(taskTimePickerMinute, 59);
  const value = `${taskTimePickerHour.value}:${taskTimePickerMinute.value}`;
  const { taskId, field } = activeTaskTimePicker;
  closeTaskTimePicker();
  await updateTaskField(taskId, field, value, { render: false, splitCrossDay: true });
}

function closeTaskTimePicker() {
  taskTimePicker.classList.add('hidden');
  activeTaskTimePicker = null;
}

function handleTaskTimePickerKeydown(event) {
  const unit = event.currentTarget === taskTimePickerHour ? 'hour' : 'minute';
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
    stepTaskTimePickerUnit(unit, event.key === 'ArrowUp' ? 1 : -1);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    void confirmTaskTimePicker();
  } else if (event.key === 'Escape') {
    event.preventDefault();
    closeTaskTimePicker();
  }
}

function handleTaskTimePickerWheel(event) {
  event.preventDefault();
  const unit = event.currentTarget === taskTimePickerHour ? 'hour' : 'minute';
  stepTaskTimePickerUnit(unit, event.deltaY < 0 ? 1 : -1);
}

function createTypeSelect(value) {
  const categories = taskCategories();
  const selectedId = resolveTaskCategoryId(value, categories, value);
  const selectedCategory = taskCategoryById(selectedId, categories);
  const select = document.createElement('select');
  select.className = 'task-type-select';
  select.setAttribute('aria-label', '任务分类');

  categories.filter((category) => category.active || category.id === selectedId).forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.active ? category.name : `${category.name}（已停用）`;
    select.appendChild(option);
  });

  select.value = selectedCategory ? selectedCategory.id : (select.options[0]?.value || '');
  select.dataset.taskCategoryId = select.value;
  styleTaskCategoryControl(select, taskCategoryById(select.value, categories));
  select.addEventListener('change', () => {
    select.dataset.taskCategoryId = select.value;
    styleTaskCategoryControl(select, taskCategoryById(select.value, categories));
  });
  return select;
}

function styleTaskCategoryControl(control, category) {
  const color = category ? category.color : '#8b96a3';
  const tint = colorWithAlpha(color, 0.2);
  control.style.setProperty('--task-category-color', color);
  control.style.setProperty('--task-category-tint', tint);
  control.style.borderColor = color;
  control.style.backgroundColor = tint;
}

function colorWithAlpha(color, alpha) {
  const match = clean(color).match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!match) return 'rgba(139, 150, 163, 0.1)';
  return `rgba(${parseInt(match[1], 16)}, ${parseInt(match[2], 16)}, ${parseInt(match[3], 16)}, ${alpha})`;
}

function createTaskStatusSelect(value) {
  const status = normalizeTaskStatus(value);
  const select = document.createElement('select');
  select.className = `task-status-select status-${statusClass(status)}`;
  select.setAttribute('aria-label', '完成情况');
  [
    ['未评价', '完成情况'],
    ['已完成', '完成'],
    ['部分完成', '部分完成'],
    ['未完成', '未完成']
  ].forEach(([optionValue, label]) => {
    const option = document.createElement('option');
    option.value = optionValue;
    option.textContent = label;
    select.appendChild(option);
  });
  select.value = status;
  return select;
}

function normalizeTaskStatus(value) {
  const status = clean(value);
  return ['已完成', '部分完成', '未完成'].includes(status) ? status : '未评价';
}

function blurOnEnter(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    event.currentTarget.blur();
  }
}

async function updateTaskField(taskId, field, value, options = {}) {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;

  task[field] = clean(value);
  if (field === 'typeId') {
    const category = taskCategoryById(value);
    task.typeId = category ? category.id : defaultTaskCategory()?.id || '';
    task.type = category ? category.name : defaultTaskCategory()?.name || '';
  }
  if (['title', 'startTime', 'endTime', 'planDetails'].includes(field)) {
    task.isDraft = !clean(task.title) || !clean(task.startTime) || !clean(task.endTime);
  }
  const normalizedTasks = options.splitCrossDay ? normalizeTaskDayBoundaries() : { changed: false };

  if (field === 'startTime' || field === 'endTime') {
    publishFloatingTask(currentEffectiveNow);
  }

  await saveState();
  if (options.render === false) {
    if (normalizedTasks.changed) {
      renderTasksPreservingScroll();
      return;
    }
    refreshTasksAfterInlineEdit(taskId);
    return;
  }
  renderTasks();
}

function refreshTasksAfterInlineEdit(taskId) {
  const selectedDate = clean(taskDateFilter.value);
  const visibleTasks = selectedDate
    ? tasks.filter((task) => isRenderableTask(task) && normalizeDate(task.date) === selectedDate)
    : tasks.filter(isRenderableTask);
  const conflictingTaskIds = findConflictingTaskIds(sortTasksForDisplay(visibleTasks));
  renderTaskDurationSummary(visibleTasks);

  taskList.querySelectorAll('.task-card').forEach((card) => {
    const task = tasks.find((item) => item.id === card.dataset.taskId);
    if (!task) return;

    const hasTimeConflict = conflictingTaskIds.has(task.id);
    syncTaskCardTimeInputs(card, task);
    card.classList.toggle('task-time-conflict', hasTimeConflict);
    card.title = hasTimeConflict ? '这个时间段与同一天的其他任务冲突，请修改开始或结束时间。' : '';
    const timeEditor = card.querySelector('.task-time-editor');
    if (timeEditor) timeEditor.classList.toggle('task-time-conflict-text', hasTimeConflict);
    card.querySelectorAll('.time-input').forEach((input) => {
      input.classList.toggle('time-conflict', hasTimeConflict);
    });
  });

  updateTaskTemporalView({ scrollToCurrent: false });
  if (taskId && selectedDate) activePlanningDates.add(selectedDate);
}

function renderTasksPreservingScroll() {
  const scrollTop = taskList ? taskList.scrollTop : 0;
  renderTasks({ scrollToCurrent: false, forceScroll: false });
  if (taskList) taskList.scrollTop = scrollTop;
}

function syncTaskCardTimeInputs(card, task) {
  const inputs = Array.from(card.querySelectorAll('.time-input'));
  const values = [task.startTime, task.endTime];
  inputs.forEach((input, index) => {
    input.textContent = displayTaskTime(values[index] || '');
    input.setAttribute('aria-label', `${index === 0 ? '开始时间' : '结束时间'}，当前 ${input.textContent}`);
  });
}

function normalizeTaskDayBoundaries() {
  const before = taskNormalizationSignature(tasks);
  const restoredTasks = restoreSplitTaskParents(tasks);
  const orderCounters = new Map();
  tasks = restoredTasks
    .filter((task) => normalizeDate(task.date))
    .sort((a, b) => {
      const dateCompare = normalizeDate(a.date).localeCompare(normalizeDate(b.date));
      return dateCompare || compareTasksByOrderThenTime(a, b);
    })
    .flatMap((task) => normalizeTaskIntoDayPieces(task, normalizeDate(task.date), orderCounters));
  return { changed: before !== taskNormalizationSignature(tasks) };
}

function restoreSplitTaskParents(taskItems) {
  const baseTasks = taskItems
    .filter((task) => !clean(task.splitParentId))
    .map((task) => ({ ...task, splitParentId: '' }));
  const byId = new Map(baseTasks.map((task) => [task.id, task]));

  taskItems.forEach((task) => {
    const parentId = clean(task.splitParentId);
    if (!parentId) return;
    const parent = byId.get(parentId);
    if (parent && parent.endTime === '00:00' && task.startTime === '00:00') {
      parent.endTime = task.endTime;
      return;
    }
    baseTasks.push({ ...task, splitParentId: '' });
  });

  return baseTasks;
}

function compareTasksByOrderThenTime(a, b) {
  const orderA = Number.isFinite(Number(a.order)) ? Number(a.order) : Number.MAX_SAFE_INTEGER;
  const orderB = Number.isFinite(Number(b.order)) ? Number(b.order) : Number.MAX_SAFE_INTEGER;
  if (orderA !== orderB) return orderA - orderB;
  return normalizeTime(a.startTime).localeCompare(normalizeTime(b.startTime));
}

function normalizeTaskIntoDayPieces(task, date, orderCounters) {
  const start = timeToMinutes(task.startTime);
  const end = timeToMinutes(task.endTime);
  const normalizedDate = normalizeDate(date);
  if (start === null || end === null || end === 0 || start <= end) {
    return [normalizeTaskPiece(task, normalizedDate, task.startTime, task.endTime, '', orderCounters)];
  }

  const nextDate = shiftDate(normalizedDate, 1);
  return [
    normalizeTaskPiece(task, normalizedDate, task.startTime, '00:00', '', orderCounters),
    normalizeTaskPiece(task, nextDate, '00:00', task.endTime, task.id, orderCounters)
  ];
}

function normalizeTaskPiece(task, date, startTime, endTime, splitParentId, orderCounters) {
  return {
    ...task,
    id: splitParentId ? `split-${task.id}-${date}` : task.id,
    date,
    weekday: weekdayFromDate(date),
    startTime,
    endTime,
    splitParentId,
    order: nextNormalizedOrder(date, orderCounters),
    isDraft: !clean(task.title) || !clean(startTime) || !clean(endTime)
  };
}

function nextNormalizedOrder(date, counters) {
  const key = normalizeDate(date) || '__all__';
  const next = (counters.get(key) || 0) + 10;
  counters.set(key, next);
  return next;
}

function taskNormalizationSignature(taskItems) {
  return JSON.stringify(taskItems.map((task) => ({
    id: clean(task.id),
    date: normalizeDate(task.date),
    startTime: clean(task.startTime),
    endTime: clean(task.endTime),
    order: Number(task.order) || 0,
    splitParentId: clean(task.splitParentId)
  })).sort((a, b) => a.id.localeCompare(b.id)));
}

async function deleteTask(taskId) {
  const deletedTasks = tasks.filter((task) => task.id === taskId || clean(task.splitParentId) === taskId);
  if (deletedTasks.length === 0) return;

  tasks = tasks.filter((task) => task.id !== taskId && clean(task.splitParentId) !== taskId);
  recordTaskDeletion(deletedTasks);
  await saveState();
  renderTasks();
  setStatus('任务已删除。按 Ctrl+Z 可恢复。', '', 5000);
}

function recordTaskDeletion(deletedTasks) {
  taskUndoStack.push({
    tasks: deletedTasks.map((task) => ({ ...task })),
    taskIds: deletedTasks.map((task) => task.id)
  });
  if (taskUndoStack.length > TASK_HISTORY_LIMIT) taskUndoStack.shift();
  taskRedoStack.length = 0;
}

function handleTaskHistoryShortcut(event) {
  if ((!event.ctrlKey && !event.metaKey) || event.altKey || isTextEditingElement(event.target)) return;

  const key = event.key.toLowerCase();
  if (key === 'z' && !event.shiftKey) {
    event.preventDefault();
    void undoTaskDeletion();
  } else if (key === 'y' || (key === 'z' && event.shiftKey)) {
    event.preventDefault();
    void redoTaskDeletion();
  }
}

function handleTaskHistoryUndo() {
  if (isTextEditingElement(document.activeElement)) {
    document.execCommand('undo');
    return;
  }
  void undoTaskDeletion();
}

function handleTaskHistoryRedo() {
  if (isTextEditingElement(document.activeElement)) {
    document.execCommand('redo');
    return;
  }
  void redoTaskDeletion();
}

function isTextEditingElement(element) {
  return element instanceof HTMLInputElement
    || element instanceof HTMLTextAreaElement
    || Boolean(element && element.isContentEditable);
}

async function undoTaskDeletion() {
  if (taskHistoryOperationInProgress || taskUndoStack.length === 0) return;
  taskHistoryOperationInProgress = true;

  try {
    const deletion = taskUndoStack.pop();
    const existingTaskIds = new Set(tasks.map((task) => task.id));
    const restoredTasks = deletion.tasks.filter((task) => !existingTaskIds.has(task.id));
    tasks = [...tasks, ...restoredTasks];
    taskRedoStack.push(deletion);
    await saveState();
    renderTasks();
    setStatus(`已恢复 ${restoredTasks.length} 条任务。`, '', 5000);
  } finally {
    taskHistoryOperationInProgress = false;
  }
}

async function redoTaskDeletion() {
  if (taskHistoryOperationInProgress || taskRedoStack.length === 0) return;
  taskHistoryOperationInProgress = true;

  try {
    const deletion = taskRedoStack.pop();
    const taskIds = new Set(deletion.taskIds);
    tasks = tasks.filter((task) => !taskIds.has(task.id));
    taskUndoStack.push(deletion);
    await saveState();
    renderTasks();
    setStatus('已重新删除任务。', '', 5000);
  } finally {
    taskHistoryOperationInProgress = false;
  }
}

function handleTaskDragStart(event, taskId) {
  draggedTaskId = taskId;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', taskId);
}

function handleTaskDragEnd() {
  draggedTaskId = '';
  document.querySelectorAll('.task-card.drag-target').forEach((card) => card.classList.remove('drag-target'));
}

function handleTaskDragOver(event) {
  if (!draggedTaskId) return;
  event.preventDefault();
  event.currentTarget.classList.add('drag-target');
}

async function handleTaskDrop(event) {
  event.preventDefault();
  const targetId = event.currentTarget.dataset.taskId;
  event.currentTarget.classList.remove('drag-target');

  if (!draggedTaskId || !targetId || draggedTaskId === targetId) return;

  const selectedDate = clean(taskDateFilter.value);
  const visibleIds = sortTasksForDisplay(tasks.filter((task) => isRenderableTask(task) && normalizeDate(task.date) === selectedDate))
    .map((task) => task.id);
  const fromIndex = visibleIds.indexOf(draggedTaskId);
  const toIndex = visibleIds.indexOf(targetId);

  if (fromIndex < 0 || toIndex < 0) return;

  visibleIds.splice(fromIndex, 1);
  visibleIds.splice(toIndex, 0, draggedTaskId);
  visibleIds.forEach((id, index) => {
    const task = tasks.find((item) => item.id === id);
    if (task) task.order = (index + 1) * 10;
  });

  await saveState();
  draggedTaskId = '';
  renderTasks();
}

function sortTasksForDisplay(taskItems) {
  return [...taskItems].sort((a, b) => {
    const orderA = Number.isFinite(Number(a.order)) ? Number(a.order) : Number.MAX_SAFE_INTEGER;
    const orderB = Number.isFinite(Number(b.order)) ? Number(b.order) : Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return normalizeTime(a.startTime).localeCompare(normalizeTime(b.startTime));
  });
}

function updateTaskTemporalView(options = {}) {
  if (!pages.tasks.classList.contains('active') || taskWorkspace.classList.contains('hidden')) return;

  const selectedDate = normalizeDate(taskDateFilter.value);
  const now = currentEffectiveNow;
  const today = formatLocalDate(now);
  const isToday = selectedDate === today;
  const isPastDate = selectedDate && selectedDate < today;
  const isFutureDate = selectedDate && selectedDate > today;
  let currentTaskId = '';

  taskList.querySelectorAll('.task-card').forEach((card) => {
    const task = tasks.find((item) => item.id === card.dataset.taskId);
    card.classList.remove('task-past', 'task-current', 'task-future');
    if (!task) return;

    if (isPastDate) {
      card.classList.add('task-past');
      return;
    }

    if (isFutureDate) {
      card.classList.add('task-future');
      return;
    }

    if (!isToday) return;

    const stage = classifyTaskStage(task, now);
    if (!stage) return;
    card.classList.add(`task-${stage}`);
    if (stage === 'current' && !currentTaskId) currentTaskId = task.id;
  });

  if (!options.scrollToCurrent || !currentTaskId || draggedTaskId) {
    highlightedTaskId = currentTaskId;
    return;
  }

  if (!options.forceScroll && highlightedTaskId === currentTaskId) return;

  const currentCard = Array.from(taskList.querySelectorAll('.task-card'))
    .find((card) => card.dataset.taskId === currentTaskId);
  if (currentCard) {
    const top = Math.max(0, currentCard.offsetTop - taskList.offsetTop);
    taskList.scrollTo({ top, behavior: options.forceScroll ? 'auto' : 'smooth' });
  }

  highlightedTaskId = currentTaskId;
}

function classifyTaskStage(task, now) {
  const start = timeToMinutes(task.startTime);
  const end = timeToMinutes(task.endTime);
  if (start === null || end === null) return '';

  const current = now.getHours() * 60 + now.getMinutes();
  if (isAllDayRange(task.startTime, task.endTime)) return 'current';
  if (start === end) return '';

  if (end < start) {
    if (current >= start || current < end) return 'current';
    return 'future';
  }

  if (current < start) return 'future';
  if (current >= end) return 'past';
  return 'current';
}

function taskDurationMinutes(task) {
  const start = timeToMinutes(task.startTime);
  const end = timeToMinutes(task.endTime);
  if (start === null || end === null) return 0;
  if (isAllDayRange(task.startTime, task.endTime)) return 24 * 60;
  if (start === end) return 0;
  return end > start ? end - start : (24 * 60 - start) + end;
}

function taskSummaryType(task) {
  const category = taskCategoryForTask(task);
  return category ? category.id : UNASSIGNED_CATEGORY_ID;
}

function sumTaskMinutesByType(taskItems) {
  return taskItems.reduce((summary, task) => {
    const minutes = taskDurationMinutes(task);
    if (minutes <= 0) return summary;
    const type = taskSummaryType(task);
    summary[type] = (summary[type] || 0) + minutes;
    return summary;
  }, Object.fromEntries(taskSummaryCategories().map((category) => [category.id, 0])));
}

function taskSummaryCategories(minutesByType = {}) {
  const categories = taskCategories().filter((category) => category.active || (minutesByType[category.id] || 0) > 0);
  return [
    ...categories,
    { id: UNASSIGNED_CATEGORY_ID, name: '未分配', color: '#8b96a3', cycleEnabled: false, focusMinutes: 50, breakMinutes: 10, active: true }
  ];
}

function formatDurationHours(minutes) {
  if (!Number.isFinite(minutes) || minutes <= 0) return '0小时';
  const hours = minutes / 60;
  const rounded = Math.round(hours * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}小时`;
}

function formatPercent(value, total) {
  if (!total) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}

function dateRangeForProfileStats(rangeType, baseDate) {
  const parsedBase = parseLocalDate(normalizeDate(baseDate));
  const base = parsedBase || new Date();
  const start = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  const end = new Date(start);

  if (rangeType === 'day') {
    return { start: formatLocalDate(start), end: formatLocalDate(end) };
  }

  if (rangeType === 'week') {
    const mondayOffset = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - mondayOffset);
    end.setTime(start.getTime());
    end.setDate(start.getDate() + 6);
    return { start: formatLocalDate(start), end: formatLocalDate(end) };
  }

  if (rangeType === 'month') {
    start.setDate(1);
    end.setFullYear(start.getFullYear(), start.getMonth() + 1, 0);
    return { start: formatLocalDate(start), end: formatLocalDate(end) };
  }

  if (rangeType === 'quarter') {
    const quarterStartMonth = Math.floor(start.getMonth() / 3) * 3;
    start.setMonth(quarterStartMonth, 1);
    end.setFullYear(start.getFullYear(), quarterStartMonth + 3, 0);
    return { start: formatLocalDate(start), end: formatLocalDate(end) };
  }

  start.setMonth(0, 1);
  end.setFullYear(start.getFullYear(), 11, 31);
  return { start: formatLocalDate(start), end: formatLocalDate(end) };
}

function findConflictingTaskIds(taskItems) {
  const conflicted = new Set();
  const byDate = new Map();

  taskItems.forEach((task) => {
    const date = normalizeDate(task.date);
    if (!date) return;
    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date).push(task);
  });

  byDate.forEach((dayTasks) => {
    const indexes = findConflictingRangeIndexes(dayTasks);
    indexes.forEach((index) => {
      if (dayTasks[index] && dayTasks[index].id) conflicted.add(dayTasks[index].id);
    });
  });

  return conflicted;
}

function findConflictingRangeIndexes(items) {
  const conflicted = new Set();
  const ranges = items.map((item, index) => ({
    index,
    intervals: item.startTime || item.endTime
      ? rangeToComparableIntervals(item.startTime, item.endTime)
      : inputRangeToComparableIntervals(item.timeRange)
  })).filter((item) => item.intervals.length > 0);

  for (let firstIndex = 0; firstIndex < ranges.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < ranges.length; secondIndex += 1) {
      if (!rangesOverlap(ranges[firstIndex].intervals, ranges[secondIndex].intervals)) continue;
      conflicted.add(ranges[firstIndex].index);
      conflicted.add(ranges[secondIndex].index);
    }
  }

  return conflicted;
}

function nextOrderForDate(date, counters = null) {
  const normalizedDate = normalizeDate(date);
  const counterKey = normalizedDate || '__all__';

  if (counters && counters.has(counterKey)) {
    const next = counters.get(counterKey) + 10;
    counters.set(counterKey, next);
    return next;
  }

  const maxOrder = tasks
    .filter((task) => normalizeDate(task.date) === normalizedDate)
    .reduce((max, task) => Math.max(max, Number(task.order) || 0), 0);
  const next = maxOrder + 10;

  if (counters) counters.set(counterKey, next);
  return next;
}

function ensureSelectedDate() {
  if (!taskDateFilter.value) {
    setDateInputValue(taskDateFilter, formatLocalDate(new Date()));
  }

  return clean(taskDateFilter.value);
}

function mergeJournals(currentJournals, importedJournals) {
  const journalMap = new Map(currentJournals.map((journal) => [journalIdentity(journal), journal]));

  importedJournals.forEach((journal) => {
    const key = journalIdentity(journal);
    const tagIds = journalTagIds(journal);
    const media = Array.isArray(journal.media)
      ? normalizeJournalMedia(journal.media)
      : normalizeJournalMedia(journalMap.get(key) && journalMap.get(key).media);
    if (!key || (!journal.content && tagIds.length === 0 && media.length === 0)) return;

    journalMap.set(key, {
      id: journal.id || `journal-${Date.now()}`,
      date: journalPrimaryDate(journal),
      dateRangeStart: normalizeDate(journal.dateRangeStart),
      dateRangeEnd: normalizeDate(journal.dateRangeEnd),
      sheetName: clean(journal.sheetName),
      content: clean(journal.content),
      tagIds,
      media,
      source: clean(journal.source) || 'manual',
      updatedAt: new Date().toISOString()
    });
  });

  return Array.from(journalMap.values()).sort(compareJournals);
}

function normalizeJournalCollection(items) {
  return removeEmptyJournalEntries(mergeJournals([], items));
}

function normalizeJournalMedia(media) {
  if (!Array.isArray(media)) return [];
  return media.map((item) => {
    if (!item || typeof item !== 'object') return null;
    const kind = ['image', 'video', 'live'].includes(item.kind) ? item.kind : 'image';
    const sourcePath = clean(item.sourcePath);
    const previewPath = clean(item.previewPath) || sourcePath;
    if (!sourcePath && !previewPath) return null;
    return {
      id: clean(item.id) || `media-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      kind,
      originalName: clean(item.originalName) || '未命名附件',
      contentType: clean(item.contentType),
      size: Number(item.size) || 0,
      uploadedAt: clean(item.uploadedAt),
      annotation: clean(item.annotation),
      mediaRoot: clean(item.mediaRoot),
      sourcePath,
      previewPath,
      thumbnailPath: clean(item.thumbnailPath),
      motionSourcePath: clean(item.motionSourcePath),
      motionPreviewPath: clean(item.motionPreviewPath)
    };
  }).filter(Boolean);
}

function journalHasCustomContent(journal) {
  return Boolean(
    clean(journal && journal.content)
    || journalTagIds(journal).length
    || normalizeJournalMedia(journal && journal.media).length
  );
}

function removeEmptyJournalEntries(items) {
  return (Array.isArray(items) ? items : []).filter(journalHasCustomContent);
}

async function saveSelectedJournal() {
  if (journalDateChangePending) return false;
  const date = committedDateInputValue(journalDate) || normalizeDate(journalDate.value);

  return saveJournalForDate(date);
}

async function saveJournalForDate(date) {
  const content = clean(journalContent.value);
  const tagIds = selectedJournalTagIds(journalTag);
  const existingJournal = findJournalForDate(date, date);
  const media = normalizeJournalMedia(existingJournal && existingJournal.media);

  if (!date) {
    journalSaveState.textContent = '请先选择日期';
    return false;
  }

  journals = mergeJournals(journals, [{
    id: `journal-${date}`,
    date,
    sheetName: '',
    content,
    tagIds,
    media,
    source: 'manual'
  }]);

  journals = removeEmptyJournalEntries(journals);

  await saveState();
  renderJournalList();
  journalSaveState.textContent = content || tagIds.length ? '已保存' : '已清空';
  return true;
}

function hasUnsavedJournalChanges(dateOverride = '') {
  if (!journalContent || !journalDate) return false;
  const date = normalizeDate(dateOverride || committedDateInputValue(journalDate) || journalDate.value);
  const content = clean(journalContent.value);
  const tagIds = selectedJournalTagIds(journalTag);

  if (!date) return Boolean(content || tagIds.length);

  const journal = findJournalForDate(date, date);
  const savedContent = journal ? clean(journal.content) : '';
  const savedTagIds = journal ? journalTagIds(journal) : [];
  return content !== savedContent || tagIds.join('|') !== savedTagIds.join('|');
}

async function handleJournalDateCommit(nextDate, previousDate) {
  if (!previousDate || !hasUnsavedJournalChanges(previousDate)) {
    renderSelectedJournal();
    return;
  }

  journalDateChangePending = true;
  try {
    const choice = await openJournalUnsavedModal();
    if (choice === 'cancel') {
      setDateInputValue(journalDate, previousDate);
      return;
    }

    if (choice === 'save') {
      const saved = await saveJournalForDate(previousDate);
      if (!saved) {
        setDateInputValue(journalDate, previousDate);
        return;
      }
    }

    setDateInputValue(journalDate, nextDate);
    renderSelectedJournal();
  } finally {
    journalDateChangePending = false;
  }
}

function updateJournalDirtyState() {
  if (!journalSaveState) return;
  if (hasUnsavedJournalChanges()) {
    journalSaveState.textContent = '尚未保存';
  }
}

async function confirmLeaveRecordsPageIfNeeded(targetPage) {
  if (targetPage === 'records') return true;
  if (!pages.records.classList.contains('active')) return true;
  if (!hasUnsavedJournalChanges()) return true;

  const choice = await openJournalUnsavedModal();
  if (choice === 'cancel') return false;
  if (choice === 'discard') {
    renderSelectedJournal();
    return true;
  }

  return saveSelectedJournal();
}

function openJournalUnsavedModal() {
  if (!journalUnsavedModal) return Promise.resolve('cancel');
  journalUnsavedModal.classList.remove('hidden');
  if (saveJournalBeforeLeaveButton) saveJournalBeforeLeaveButton.focus();
  return new Promise((resolve) => {
    pendingJournalUnsavedResolver = resolve;
  });
}

function resolveJournalUnsavedChoice(choice) {
  if (!pendingJournalUnsavedResolver) return;
  journalUnsavedModal.classList.add('hidden');
  const resolver = pendingJournalUnsavedResolver;
  pendingJournalUnsavedResolver = null;
  resolver(choice);
}

async function openMediaUploadModal() {
  const date = committedDateInputValue(journalDate) || normalizeDate(journalDate.value);
  if (!date) {
    await window.whbr.showMessageBox({ type: 'warning', title: '请选择日期', message: '请先选择要归档照片的记录日期。' });
    return;
  }

  pendingMediaItems = [];
  if (mediaUploadPreviewList) mediaUploadPreviewList.replaceChildren();
  if (mediaUploadStatus) mediaUploadStatus.textContent = '正在创建安全的手机上传通道…';
  if (mediaNetworkDebug) mediaNetworkDebug.textContent = '正在创建并检测本机上传服务…';
  if (confirmMediaUploadButton) confirmMediaUploadButton.disabled = true;
  mediaUploadModal.classList.remove('hidden');

  const result = await window.whbr.media.startUploadSession(date);
  if (!result.ok) {
    if (mediaUploadStatus) mediaUploadStatus.textContent = result.error && result.error.message ? result.error.message : '无法创建上传通道。';
    return;
  }

  activeMediaUploadSession = {
    id: result.sessionId,
    date,
    diagnostics: result.diagnostics || null,
    networkEvents: Array.isArray(result.networkEvents) ? result.networkEvents : []
  };
  mediaUploadQr.src = result.qrDataUrl;
  mediaUploadQr.hidden = false;
  if (mediaUploadHint) mediaUploadHint.textContent = '请用与电脑连接同一 Wi‑Fi 的手机扫描二维码，选择相册中的内容后上传。二维码 15 分钟内有效。';
  if (mediaUploadStatus) mediaUploadStatus.textContent = '等待手机上传…';
  renderMediaNetworkDebug();
}

async function closeMediaUploadModal() {
  const sessionId = activeMediaUploadSession && activeMediaUploadSession.id;
  activeMediaUploadSession = null;
  pendingMediaItems = [];
  if (mediaUploadModal) mediaUploadModal.classList.add('hidden');
  if (mediaUploadQr) mediaUploadQr.removeAttribute('src');
  if (sessionId) await window.whbr.media.cancelUpload(sessionId);
}

function handleMobileMediaUploaded(payload) {
  if (!activeMediaUploadSession || payload.sessionId !== activeMediaUploadSession.id) return;
  const received = Array.isArray(payload.items) ? payload.items : [];
  received.forEach((item) => {
    if (!pendingMediaItems.some((current) => current.id === item.id)) pendingMediaItems.push({ ...item, annotation: '', removed: false });
  });
  renderPendingMediaItems();
  renderMediaNetworkDebug();
  if (mediaUploadStatus) mediaUploadStatus.textContent = `已接收 ${pendingMediaItems.filter((item) => !item.removed).length} 个内容，可在右侧填写注释。`;
  if (confirmMediaUploadButton) confirmMediaUploadButton.disabled = pendingMediaItems.every((item) => item.removed);
}

function handleMediaNetworkEvent(payload) {
  if (!activeMediaUploadSession || payload.sessionId !== activeMediaUploadSession.id) return;
  if (payload.event) activeMediaUploadSession.networkEvents.push(payload.event);
  if (activeMediaUploadSession.networkEvents.length > 30) activeMediaUploadSession.networkEvents.shift();
  renderMediaNetworkDebug();
}

function renderMediaNetworkDebug() {
  if (!mediaNetworkDebug) return;
  const session = activeMediaUploadSession;
  if (!session) {
    mediaNetworkDebug.textContent = '上传通道尚未创建。请关闭窗口后重新点击“上传照片”。';
    return;
  }
  const diagnostics = session.diagnostics || {};
  const events = Array.isArray(session.networkEvents) ? session.networkEvents : [];
  const isPhoneAddress = (address) => address && address !== '127.0.0.1' && address !== '::1' && !address.startsWith('::ffff:127.');
  const phoneConnected = events.some((event) => event.type === 'page-served' && isPhoneAddress(event.remoteAddress));
  const phoneRequested = events.some((event) => event.type === 'http-request' && isPhoneAddress(event.remoteAddress));
  const receivedContent = pendingMediaItems.filter((item) => !item.removed).length;
  const loopbackReady = diagnostics.loopback && diagnostics.loopback.ok;

  if (!loopbackReady) {
    mediaNetworkDebug.textContent = '电脑端上传服务没有通过自检，二维码暂时无法使用。请关闭此窗口后重新生成二维码；若仍失败，请检查防火墙是否阻止了日织。';
  } else if (receivedContent > 0) {
    mediaNetworkDebug.textContent = `连接正常：已从手机收到 ${receivedContent} 个内容。请在右侧填写注释后点击“确认并保存”。`;
  } else if (phoneConnected) {
    mediaNetworkDebug.textContent = '连接正常：手机已成功打开上传页面。现在可在手机上选择内容并点击“上传到电脑”。';
  } else if (phoneRequested) {
    mediaNetworkDebug.textContent = '手机正在连接电脑，请稍候；若页面长期无法打开，请确认两台设备在同一 Wi‑Fi，且没有开启会隔离局域网设备的 VPN 或访客网络。';
  } else {
    mediaNetworkDebug.textContent = '电脑端上传通道已准备好，正在等待手机扫码连接。若扫码后无法打开页面，请确认手机和电脑连接同一 Wi‑Fi，并关闭会阻断局域网访问的 VPN。';
  }
}

function handleMediaUploadExpired(payload) {
  if (!activeMediaUploadSession || payload.sessionId !== activeMediaUploadSession.id) return;
  activeMediaUploadSession = null;
  if (mediaUploadStatus) mediaUploadStatus.textContent = '二维码已过期。请关闭此窗口后重新点击“上传照片”。';
  if (confirmMediaUploadButton) confirmMediaUploadButton.disabled = true;
}

function renderPendingMediaItems() {
  if (!mediaUploadPreviewList) return;
  mediaUploadPreviewList.replaceChildren();
  pendingMediaItems.filter((item) => !item.removed).forEach((item) => {
    const row = document.createElement('div');
    row.className = 'pending-media-row';
    row.appendChild(createMediaThumbElement(item, { interactive: false }));

    const detail = document.createElement('div');
    detail.className = 'pending-media-detail';
    const name = document.createElement('strong');
    name.textContent = item.originalName;
    const type = document.createElement('span');
    type.className = 'muted';
    type.textContent = mediaKindLabel(item.kind);
    const annotation = document.createElement('textarea');
    annotation.className = 'media-annotation-input';
    annotation.maxLength = 1000;
    annotation.placeholder = '为这项内容添加注释（可选）';
    annotation.value = item.annotation || '';
    annotation.addEventListener('input', () => { item.annotation = annotation.value; });
    detail.append(name, type, annotation);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'icon-button media-remove-button';
    remove.textContent = '×';
    remove.setAttribute('aria-label', `移除 ${item.originalName}`);
    remove.addEventListener('click', () => {
      item.removed = true;
      renderPendingMediaItems();
      if (confirmMediaUploadButton) confirmMediaUploadButton.disabled = pendingMediaItems.every((current) => current.removed);
    });
    row.append(detail, remove);
    mediaUploadPreviewList.appendChild(row);
  });
}

async function confirmMediaUpload() {
  if (!activeMediaUploadSession) return;
  const selected = pendingMediaItems.filter((item) => !item.removed).map((item) => ({ id: item.id, annotation: item.annotation || '' }));
  if (selected.length === 0) return;
  confirmMediaUploadButton.disabled = true;
  if (mediaUploadStatus) mediaUploadStatus.textContent = '正在生成兼容预览并归档到当天文件夹…';
  const session = activeMediaUploadSession;
  const result = await window.whbr.media.confirmUpload(session.id, session.date, selected);
  if (!result.ok) {
    if (mediaUploadStatus) mediaUploadStatus.textContent = result.error && result.error.message ? result.error.message : '保存失败，请重试。';
    confirmMediaUploadButton.disabled = false;
    return;
  }

  const existing = findJournalForDate(session.date, session.date);
  const media = [...normalizeJournalMedia(existing && existing.media), ...normalizeJournalMedia(result.media)];
  journals = mergeJournals(journals, [{
    id: `journal-${session.date}`,
    date: session.date,
    sheetName: '',
    content: existing ? existing.content : clean(journalContent.value),
    tagIds: existing ? journalTagIds(existing) : selectedJournalTagIds(journalTag),
    media,
    source: 'manual'
  }]);
  await saveState();
  renderJournalList();
  journalSaveState.textContent = '附件已保存';
  activeMediaUploadSession = null;
  pendingMediaItems = [];
  mediaUploadModal.classList.add('hidden');
  mediaUploadQr.removeAttribute('src');
}

function mediaKindLabel(kind) {
  if (kind === 'video') return '视频（已生成兼容播放版本）';
  if (kind === 'live') return '实况照片';
  return '图片';
}

function createMediaThumbElement(media, options = {}) {
  const interactive = options.interactive !== false;
  const element = interactive ? document.createElement('button') : document.createElement('div');
  element.className = interactive ? 'media-thumbnail-button' : 'media-thumbnail';
  if (interactive) {
    element.type = 'button';
    element.title = `查看 ${media.originalName || '附件'}`;
    element.addEventListener('click', () => void openMediaViewModal(media));
  }
  const image = document.createElement('img');
  image.alt = media.originalName || mediaKindLabel(media.kind);
  image.className = 'media-thumbnail-image';
  const badge = document.createElement('span');
  badge.className = 'media-kind-badge';
  badge.textContent = media.kind === 'video' ? '▶' : media.kind === 'live' ? 'LIVE' : '图片';
  element.append(image, badge);
  const directUrl = media.thumbnailUrl || '';
  if (directUrl) image.src = directUrl;
  else if (media.thumbnailPath) void setMediaImageSource(image, media.thumbnailPath, media.mediaRoot);
  else element.classList.add('media-thumbnail-fallback');
  return element;
}

async function setMediaImageSource(image, relativePath, mediaRoot = '') {
  const url = await mediaFileUrl(relativePath, mediaRoot);
  if (url) image.src = url;
}

async function mediaFileUrl(relativePath, mediaRoot = '') {
  if (!relativePath) return '';
  const cacheKey = `${mediaRoot}|${relativePath}`;
  if (mediaUrlCache.has(cacheKey)) return mediaUrlCache.get(cacheKey);
  const result = await window.whbr.media.getFileUrl(relativePath, mediaRoot);
  const url = result && result.ok ? result.url : '';
  mediaUrlCache.set(cacheKey, url);
  return url;
}

async function openMediaViewModal(media) {
  mediaViewTitle.textContent = media.originalName || '查看内容';
  mediaViewContent.replaceChildren();
  if (media.kind === 'live' && window.whbr && window.whbr.media && window.whbr.media.repairLive) {
    const repair = await window.whbr.media.repairLive(media);
    if (repair && repair.ok && repair.repaired) mediaUrlCache.clear();
  }
  const previewUrl = media.previewUrl || await mediaFileUrl(media.previewPath || media.sourcePath, media.mediaRoot);
  const motionSourceUrl = await mediaFileUrl(media.motionSourcePath, media.mediaRoot);
  const motionPreviewUrl = media.motionPreviewUrl || await mediaFileUrl(media.motionPreviewPath, media.mediaRoot);
  if (media.kind === 'video') {
    const video = document.createElement('video');
    video.className = 'media-view-video';
    video.controls = true;
    video.preload = 'metadata';
    video.src = previewUrl;
    mediaViewContent.appendChild(video);
  } else if (media.kind === 'live') {
    const instruction = document.createElement('p');
    instruction.className = 'media-live-instruction';
    instruction.textContent = '按住或点击图片可播放完整实况动态；播放结束后会回到静态照片。';
    const liveStage = document.createElement('div');
    liveStage.className = 'live-media-stage';
    const photo = document.createElement('img');
    photo.src = previewUrl;
    photo.alt = media.originalName || '实况照片';
    const motion = document.createElement('video');
    const primaryMotionUrl = motionSourceUrl || motionPreviewUrl;
    const compatibilityMotionUrl = motionSourceUrl && motionPreviewUrl && motionSourceUrl !== motionPreviewUrl
      ? motionPreviewUrl
      : '';
    let usingCompatibilityPreview = false;
    motion.src = primaryMotionUrl;
    motion.muted = true;
    motion.loop = false;
    motion.preload = 'auto';
    motion.playsInline = true;
    const resetMotion = () => {
      motion.classList.remove('is-playing');
      motion.pause();
      motion.currentTime = 0;
    };
    const startMotion = () => {
      motion.currentTime = 0;
      motion.classList.add('is-playing');
      void motion.play().catch(resetMotion);
    };
    const useCompatibilityPreview = () => {
      if (!compatibilityMotionUrl || usingCompatibilityPreview) {
        resetMotion();
        return;
      }
      usingCompatibilityPreview = true;
      const shouldContinuePlaying = motion.classList.contains('is-playing');
      motion.src = compatibilityMotionUrl;
      motion.load();
      if (shouldContinuePlaying) motion.addEventListener('canplay', startMotion, { once: true });
    };
    motion.addEventListener('ended', resetMotion);
    motion.addEventListener('error', useCompatibilityPreview);
    liveStage.addEventListener('pointerdown', startMotion);
    liveStage.addEventListener('click', (event) => {
      if (event.detail === 0) startMotion();
    });
    liveStage.append(photo, motion);
    mediaViewContent.append(instruction, liveStage);
  } else {
    const image = document.createElement('img');
    image.className = 'media-view-image';
    image.src = previewUrl;
    image.alt = media.originalName || '图片附件';
    mediaViewContent.appendChild(image);
  }
  const annotationField = document.createElement('label');
  annotationField.className = 'media-annotation-field';
  const annotationLabel = document.createElement('span');
  annotationLabel.textContent = '文字注释（点击空白处自动保存）';
  const annotation = document.createElement('textarea');
  annotation.className = 'media-view-annotation';
  annotation.maxLength = 1000;
  annotation.placeholder = '为这项内容添加文字注释';
  annotation.value = media.annotation || '';
  const annotationStatus = document.createElement('small');
  annotationStatus.className = 'media-annotation-save-state';
  let savedAnnotation = annotation.value;
  annotation.addEventListener('focus', () => {
    activeMediaAnnotationEditor = annotation;
  });
  annotation.addEventListener('blur', () => {
    if (activeMediaAnnotationEditor === annotation) activeMediaAnnotationEditor = null;
    void saveMediaAnnotation(media, annotation, annotationStatus, () => savedAnnotation, (value) => { savedAnnotation = value; });
  });
  annotationField.append(annotationLabel, annotation, annotationStatus);
  mediaViewContent.appendChild(annotationField);
  mediaViewModal.classList.remove('hidden');
}

async function saveMediaAnnotation(media, input, status, getSavedAnnotation, setSavedAnnotation) {
  const annotation = input.value.trim().slice(0, 1000);
  if (annotation === getSavedAnnotation()) return;

  input.disabled = true;
  status.textContent = '正在保存…';
  try {
    const updated = await updateMediaAnnotation(media.id, annotation);
    if (!updated) throw new Error('没有找到对应附件。');
    media.annotation = annotation;
    setSavedAnnotation(annotation);
    status.textContent = '已保存';
  } catch (error) {
    status.textContent = `保存失败：${error.message || '未知错误'}`;
  } finally {
    input.disabled = false;
  }
}

async function updateMediaAnnotation(mediaId, annotation) {
  let updated = false;
  journals = journals.map((journal) => {
    const currentMedia = normalizeJournalMedia(journal.media);
    let journalUpdated = false;
    const nextMedia = currentMedia.map((item) => {
      if (item.id !== mediaId) return item;
      updated = true;
      journalUpdated = true;
      return { ...item, annotation };
    });
    return journalUpdated ? { ...journal, media: nextMedia } : journal;
  });
  if (!updated) return false;
  await saveState();
  return true;
}

function closeMediaViewModal() {
  if (!mediaViewModal) return;
  if (activeMediaAnnotationEditor) activeMediaAnnotationEditor.blur();
  activeMediaAnnotationEditor = null;
  mediaViewModal.classList.add('hidden');
  mediaViewContent.replaceChildren();
}

function renderSelectedJournal() {
  const date = clean(journalDate.value);
  const journal = findJournalForDate(normalizeDate(date), date);
  journalContent.value = journal ? journal.content : '';
  setSelectedJournalTagIds(journalTag, journal ? journalTagIds(journal) : []);
  renderTagPicker(journalTag, journalTagPaletteButton, journalTagPalette);
  journalSaveState.textContent = journal ? '已加载' : '尚未保存';
}

function preserveRecordsScroll(callback) {
  const scroller = recordsLayout;
  const anchor = journalList || document.querySelector('.records-list-panel');
  const previousScrollTop = scroller ? scroller.scrollTop : 0;
  const previousAnchorTop = anchor ? anchor.getBoundingClientRect().top : 0;
  const activeElement = document.activeElement;

  callback();

  if (!scroller || !anchor) return;

  const restore = () => {
    const nextAnchorTop = anchor.getBoundingClientRect().top;
    scroller.scrollTop = previousScrollTop + (nextAnchorTop - previousAnchorTop);
    if (activeElement && typeof activeElement.focus === 'function') {
      activeElement.focus({ preventScroll: true });
    }
  };

  restore();
  requestAnimationFrame(restore);
}

function renderJournalListPreservingScroll() {
  preserveRecordsScroll(() => renderJournalList());
}

function refreshJournalFilterViewPreservingScroll() {
  preserveRecordsScroll(() => {
    updateJournalFilterControls();
    renderJournalList();
  });
}

function renderJournalList() {
  ensureJournalViewDate();
  journalList.innerHTML = '';

  const visibleJournals = filteredJournalsForList();

  if (visibleJournals.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = journals.length === 0
      ? '还没有每日记录。可以手动保存，也可以从表格文件中的记录内容或批注导入。'
      : '没有符合当前筛选条件的记录。';
    journalList.appendChild(empty);
    return;
  }

  visibleJournals.forEach((journal) => {
    const item = document.createElement('button');
    item.className = 'journal-item';
    item.type = 'button';
    item.addEventListener('click', () => {
      openJournalEntry(journal);
    });

    const title = document.createElement('strong');
    title.className = 'journal-item-title';
    title.innerHTML = '';
    const dateText = document.createElement('span');
    dateText.className = 'journal-item-date';
    dateText.textContent = journalDisplayDate(journal);
    title.appendChild(dateText);
    const tagBadges = createJournalTagBadges(journalTagIds(journal));
    if (tagBadges) title.appendChild(tagBadges);
    const preview = document.createElement('span');
    preview.className = 'journal-item-preview';
    const mediaCount = normalizeJournalMedia(journal.media).length;
    preview.textContent = journal.content || (mediaCount ? `已添加 ${mediaCount} 个照片或视频附件。` : '这一天还没有填写生活记录。');
    item.append(title, preview);
    journalList.appendChild(item);
  });
}

function filteredJournalsForList() {
  let visibleJournals = journals;

  if (appliedJournalSearch) {
    const searchTerm = appliedJournalSearch.toLocaleLowerCase();
    visibleJournals = visibleJournals.filter((journal) => journalSearchText(journal).toLocaleLowerCase().includes(searchTerm));
  }

  if (journalFilterMode === 'date') {
    const selectedDate = normalizeDate(journalViewDate ? journalViewDate.value : '');
    if (!selectedDate) return [];
    visibleJournals = visibleJournals.filter((journal) => journalPrimaryDate(journal) === selectedDate);
  }

  if (journalFilterMode === 'tag') {
    if (appliedJournalTagFilters.length === 0) return visibleJournals;
    visibleJournals = visibleJournals.filter((journal) => {
      const ids = new Set(journalTagIds(journal));
      return appliedJournalTagFilters.every((tagId) => ids.has(tagId));
    });
  }

  return visibleJournals;
}

function commitJournalSearch() {
  const searchTerm = clean(journalSearchInput ? journalSearchInput.value : '');
  if (searchTerm === appliedJournalSearch) return;
  appliedJournalSearch = searchTerm;
  renderJournalListPreservingScroll();
}

function journalSearchText(journal) {
  const tags = journalTagIds(journal).map(journalTagById).filter(Boolean);
  return [
    journalDisplayDate(journal),
    journal.content,
    ...tags.flatMap((tag) => [tag.shortName, tag.fullName])
  ].filter(Boolean).join(' ');
}

function updateJournalFilterControls() {
  journalFilterModeButtons.forEach((button) => {
    const active = button.dataset.journalFilterMode === journalFilterMode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (journalTagFilter) journalTagFilter.disabled = journalFilterMode !== 'tag';
  if (journalTagFilterPaletteButton) journalTagFilterPaletteButton.disabled = journalFilterMode !== 'tag';
  if (journalTagFilterField) journalTagFilterField.classList.toggle('hidden', journalFilterMode !== 'tag');
  if (journalViewDateField) journalViewDateField.classList.toggle('hidden', journalFilterMode !== 'date');
  if (journalFilterMode !== 'tag') closeAllTagPalettes();
}

function setJournalFilterMode(mode) {
  journalFilterMode = ['date', 'tag'].includes(mode) ? mode : 'all';
  if (journalFilterMode === 'tag') appliedJournalTagFilters = selectedJournalTagIds(journalTagFilter);

  refreshJournalFilterViewPreservingScroll();
}

function createJournalTagBadges(tagIds) {
  const tags = normalizeJournalTagIds(tagIds).map(journalTagById).filter(Boolean);
  if (tags.length === 0) return null;
  const group = document.createElement('span');
  group.className = 'journal-tag-badges';
  group.setAttribute('aria-label', tags.map((tag) => tag.shortName).join('、'));
  tags.forEach((tag) => {
    const badge = document.createElement('span');
    badge.className = 'journal-tag-badge';
    badge.style.background = tag.color;
    badge.title = `${tag.shortName}：${tag.fullName}`;
    group.appendChild(badge);
  });
  return group;
}

function ensureJournalViewDate() {
  if (journalViewDate.value) return;
  setDateInputValue(journalViewDate, latestJournalDate() || formatLocalDate(currentEffectiveNow || new Date()));
}

function openJournalEntry(journal) {
  const targetDate = journalPrimaryDate(journal);
  renderJournalView(journal, targetDate, journalDisplayDate(journal));
}

function renderJournalView(journal, targetDate, fallbackTitle) {
  const normalizedDate = normalizeDate(targetDate);
  const dayTasks = sortTasksForDisplay(tasks.filter((task) => normalizeDate(task.date) === normalizedDate));
  const title = fallbackTitle || (journal ? journalDisplayDate(journal) : normalizedDate || '未标记日期');
  journalViewTitle.innerHTML = '';
  journalViewTitle.append(document.createTextNode(title));
  const tagBadges = journal ? createJournalTagBadges(journalTagIds(journal)) : null;
  if (tagBadges) journalViewTitle.appendChild(tagBadges);
  journalViewContent.innerHTML = '';

  const journalSection = document.createElement('section');
  const journalHeading = document.createElement('h3');
  journalHeading.textContent = '生活记录';
  const journalText = document.createElement('p');
  const journalContentText = journal && journal.content ? journal.content : '这一天还没有生活记录。';
  journalText.textContent = journalContentText;
  journalSection.append(journalHeading, journalText);
  if (journalContentText.length > 140) {
    journalText.classList.add('is-collapsed');
    const expandButton = document.createElement('button');
    expandButton.type = 'button';
    expandButton.className = 'journal-text-expand';
    expandButton.textContent = '展开';
    expandButton.addEventListener('click', () => {
      const expanded = journalText.classList.toggle('is-collapsed');
      expandButton.textContent = expanded ? '展开' : '收起';
    });
    journalSection.appendChild(expandButton);
  }
  journalViewContent.appendChild(journalSection);

  const taskSection = document.createElement('section');
  const taskHeading = document.createElement('h3');
  taskHeading.textContent = '任务完成情况';
  taskSection.appendChild(taskHeading);

  const tasksWithFeedback = dayTasks.filter((task) => hasTaskStatusFeedback(task) || clean(task.details));
  if (tasksWithFeedback.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = '这一天还没有确认任务完成情况。';
    taskSection.appendChild(empty);
  } else {
    tasksWithFeedback.forEach((task) => {
      const item = document.createElement('div');
      item.className = 'journal-task-detail';
      const title = document.createElement('strong');
      title.textContent = `${task.startTime || '--:--'} - ${task.endTime || '--:--'} ${task.title || '未命名安排'}`;
      item.append(title, createJournalTaskField('完成情况', taskStatusLabel(task.status)));
      if (clean(task.details)) item.appendChild(createJournalTaskField('任务备注', task.details));
      taskSection.appendChild(item);
    });
  }

  journalViewContent.appendChild(taskSection);

  const media = normalizeJournalMedia(journal && journal.media);
  if (media.length > 0) {
    const mediaSection = document.createElement('section');
    mediaSection.className = 'journal-media-section';
    const mediaHeading = document.createElement('h3');
    mediaHeading.textContent = '照片与视频';
    const mediaActions = document.createElement('div');
    mediaActions.className = 'journal-media-actions';
    const mediaHint = document.createElement('p');
    mediaHint.className = 'journal-media-selection-hint';
    mediaHint.textContent = '勾选附件后可删除一个或多个；点击缩略图可查看内容。';
    const deleteSelectedButton = document.createElement('button');
    deleteSelectedButton.type = 'button';
    deleteSelectedButton.className = 'danger-button journal-media-delete-button';
    deleteSelectedButton.textContent = '删除所选附件';
    deleteSelectedButton.disabled = true;
    const gallery = document.createElement('div');
    gallery.className = 'journal-media-gallery';
    const selectedIds = new Set();
    const updateDeleteButton = () => {
      deleteSelectedButton.disabled = selectedIds.size === 0;
      deleteSelectedButton.textContent = selectedIds.size ? `删除所选附件（${selectedIds.size}）` : '删除所选附件';
    };
    media.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'journal-media-selection';
      const selectionLabel = document.createElement('label');
      selectionLabel.className = 'journal-media-selection-check';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) selectedIds.add(item.id);
        else selectedIds.delete(item.id);
        updateDeleteButton();
      });
      const selectionText = document.createElement('span');
      selectionText.textContent = '选择';
      selectionLabel.append(checkbox, selectionText);
      card.append(selectionLabel, createMediaThumbElement(item));
      gallery.appendChild(card);
    });
    deleteSelectedButton.addEventListener('click', () => void deleteJournalMediaItems(
      journal,
      normalizedDate,
      fallbackTitle,
      media,
      selectedIds,
      deleteSelectedButton
    ));
    mediaActions.append(mediaHint, deleteSelectedButton);
    mediaSection.append(mediaHeading, mediaActions, gallery);
    journalViewContent.appendChild(mediaSection);
  }
  journalViewModal.classList.remove('hidden');
}

function createJournalTaskField(label, value) {
  const field = document.createElement('div');
  field.className = 'journal-task-field';
  const labelElement = document.createElement('span');
  labelElement.textContent = label;
  const valueElement = document.createElement('p');
  valueElement.textContent = value;
  field.append(labelElement, valueElement);
  return field;
}

function findJournalForDate(normalizedDate, rawDate) {
  if (!normalizedDate && !rawDate) return null;
  return journals.find((item) => journalPrimaryDate(item) === normalizedDate)
    || journals.find((item) => journalIncludesDate(item, normalizedDate))
    || journals.find((item) => clean(item.sheetName) === clean(rawDate))
    || null;
}

function closeJournalViewModal() {
  journalViewModal.classList.add('hidden');
}

function formatMeta(task) {
  const parts = [task.location].filter(Boolean);
  return parts.join(' · ');
}

function normalizeTaskType(value, title = '') {
  const categories = taskCategories();
  const direct = taskCategoryFromInput(value, categories);
  if (direct) return direct.name;
  const inferredId = resolveTaskCategoryId('', categories, inferTaskType(title || value));
  return taskCategoryById(inferredId, categories)?.name || defaultTaskCategory(categories)?.name || '';
}

function inferTaskType(title) {
  const text = clean(title);
  if (/课|课程|讲座|lecture|class|seminar/i.test(text)) return '课程';
  if (/学|阅读|复习|预习|论文|实验|背|题|考试|study|read/i.test(text)) return '学习';
  if (/洗漱|早餐|午饭|晚饭|午餐|晚餐|午休|休息|运动|娱乐|睡|通勤|散步|生活/i.test(text)) return '生活';
  return '工作';
}

function journalIdentity(journal) {
  return journalPrimaryDate(journal);
}

function compareJournals(a, b) {
  const aEnd = journalSortEnd(a);
  const bEnd = journalSortEnd(b);
  if (aEnd !== bEnd) return bEnd.localeCompare(aEnd);

  const aStart = journalSortStart(a);
  const bStart = journalSortStart(b);
  return bStart.localeCompare(aStart);
}

function journalSortStart(journal) {
  return journalDateRange(journal).start || '0000-00-00';
}

function journalSortEnd(journal) {
  return journalDateRange(journal).end || '0000-00-00';
}

function journalDisplayDate(journal) {
  const { start, end } = journalDateRange(journal);
  if (start && end && start !== end) return `${start} 至 ${end}`;
  return start || clean(journal.sheetName) || '未标记日期';
}

function journalIncludesDate(journal, date) {
  if (!date) return false;
  const { start, end } = journalDateRange(journal);
  if (!start && !end) return false;
  return date >= (start || end) && date <= (end || start);
}

function journalPrimaryDate(journal) {
  return journalDateRange(journal).start || normalizeDate(journal.date) || '';
}

function journalDateRange(journal) {
  const rangeStart = normalizeDate(journal.dateRangeStart);
  const rangeEnd = normalizeDate(journal.dateRangeEnd);
  const date = normalizeDate(journal.date);

  return {
    start: rangeStart || date,
    end: rangeEnd || rangeStart || date
  };
}

function normalizeWeekday(value) {
  const text = clean(value);
  if (!text) return '';
  if (/周一|星期一|mon/i.test(text)) return '周一';
  if (/周二|星期二|tue/i.test(text)) return '周二';
  if (/周三|星期三|wed/i.test(text)) return '周三';
  if (/周四|星期四|thu/i.test(text)) return '周四';
  if (/周五|星期五|fri/i.test(text)) return '周五';
  if (/周六|星期六|sat/i.test(text)) return '周六';
  if (/周日|周天|星期日|星期天|sun/i.test(text)) return '周日';
  return '';
}

function taskIdentity(task) {
  if (clean(task.id).startsWith('manual-') || task.isDraft) {
    return clean(task.id);
  }

  return [
    normalizeDate(task.date),
    clean(task.sheetName),
    normalizeTime(task.startTime),
    normalizeTime(task.endTime),
    clean(task.title),
    clean(task.location)
  ].join('|');
}

function isRenderableTask(task) {
  const title = clean(task.title);
  if (task.isDraft) return true;
  if (task.source === 'untimed-table') return Boolean(title);
  if (!task.startTime || !task.endTime) return false;
  if (!title) return false;
  if (task.source === 'schedule-template') return true;
  if (/^[\d\s√✓×xX-]+$/.test(title)) return false;
  return /[\u4e00-\u9fa5A-Za-z]/.test(title);
}

function hasTaskStatusFeedback(task) {
  return normalizeTaskStatus(task && task.status) !== '未评价';
}

function taskStatusLabel(status) {
  const normalized = normalizeTaskStatus(status);
  if (normalized === '已完成') return '完成';
  if (normalized === '部分完成') return '部分完成';
  if (normalized === '未完成') return '未完成';
  return '未确认';
}

function openTaskEditModal(taskId) {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;

  editingTaskId = taskId;
  taskEditTitle.textContent = task.title || '未命名安排';
  taskDetails.value = task.details || '';
  taskEditModal.classList.remove('hidden');
  taskDetails.focus();
}

function closeTaskEditModal() {
  editingTaskId = '';
  taskEditModal.classList.add('hidden');
}

async function saveTaskEdit(event) {
  event.preventDefault();
  const task = tasks.find((item) => item.id === editingTaskId);
  if (!task) return;

  task.details = clean(taskDetails.value);
  await saveState();
  closeTaskEditModal();
  renderTasksPreservingScroll();
}

function statusClass(status) {
  if (status === '已完成') return 'done';
  if (status === '部分完成') return 'partial';
  if (status === '未完成') return 'missed';
  return 'pending';
}

function pageTitleFor(page) {
  if (page === 'tasks') return '任务';
  if (page === 'records') return '记录';
  if (page === 'settings') return '设置';
  return '统计';
}

function defaultProfile() {
  return {
    journalTags: defaultJournalTags(),
    taskCategories: cloneDefaultTaskCategories(),
    taskTemplates: [],
    shortcuts: { ...DEFAULT_SHORTCUTS },
    defaultsVersion: '0.2.0'
  };
}

function normalizedProfile() {
  const {
    timeMode,
    customClockBaseTimestamp,
    customClockStartedAt,
    ...systemTimeProfile
  } = profile || {};

  return {
    ...defaultProfile(),
    ...systemTimeProfile,
    journalTags: normalizeJournalTags(systemTimeProfile.journalTags),
    shortcuts: normalizeShortcutSettings(systemTimeProfile.shortcuts),
    taskCategories: normalizeRawTaskCategories(systemTimeProfile.taskCategories),
    taskTemplates: normalizeTaskTemplates(
      systemTimeProfile.taskTemplates,
      normalizeRawTaskCategories(systemTimeProfile.taskCategories)
    )
  };
}

function normalizeTaskTemplates(value, categories = taskCategories()) {
  if (!Array.isArray(value)) return [];
  const seenIds = new Set();
  return value.map((template, templateIndex) => {
    if (!template || typeof template !== 'object') return null;
    const name = clean(template.name).slice(0, 40);
    const items = (Array.isArray(template.items) ? template.items : []).map((task) => {
      const title = clean(task && task.title);
      const startTime = normalizeTime(task && task.startTime);
      const endTime = normalizeTime(task && task.endTime);
      if (!title || timeToMinutes(startTime) === null || timeToMinutes(endTime) === null) return null;
      const typeId = resolveTaskCategoryId(task && task.typeId, categories, task && task.type);
      const category = categories.find((item) => item.id === typeId);
      return {
        startTime,
        endTime,
        title,
        typeId,
        type: category ? category.name : clean(task && task.type)
      };
    }).filter(Boolean);
    if (!name || items.length === 0) return null;

    const requestedId = clean(template.id);
    let id = requestedId || `task-template-${templateIndex + 1}`;
    let suffix = 2;
    while (seenIds.has(id)) {
      id = `${requestedId || `task-template-${templateIndex + 1}`}-${suffix}`;
      suffix += 1;
    }
    seenIds.add(id);
    return {
      id,
      name,
      createdAt: clean(template.createdAt),
      items
    };
  }).filter(Boolean);
}

function taskTemplates() {
  return normalizeTaskTemplates(profile && profile.taskTemplates, taskCategories());
}

function taskCategories() {
  return normalizeRawTaskCategories(profile && profile.taskCategories);
}

function taskCategoryById(categoryId, categories = taskCategories()) {
  return categories.find((category) => category.id === clean(categoryId)) || null;
}

function taskCategoryFromInput(value, categories = taskCategories()) {
  const text = clean(value);
  if (!text) return null;
  return categories.find((category) => category.id === text)
    || categories.find((category) => category.name.toLocaleLowerCase('zh-CN') === text.toLocaleLowerCase('zh-CN'))
    || taskCategoryById(legacyTaskTypeToCategoryId(text), categories);
}

function taskCategoryForTask(task, categories = taskCategories()) {
  const categoryId = resolveTaskCategoryId(task && task.typeId, categories, task && task.type);
  return taskCategoryById(categoryId, categories) || categories[0] || null;
}

function defaultTaskCategory(categories = taskCategories()) {
  return categories.find((category) => category.active) || categories[0] || null;
}

function courseTaskCategory(categories = taskCategories()) {
  return categories.find((category) => category.active && category.id === 'category-course')
    || categories.find((category) => category.id === 'category-course')
    || categories.find((category) => category.active && category.name === '课程')
    || categories.find((category) => category.active && category.cycleEnabled)
    || defaultTaskCategory(categories);
}

function taskCategoryUsage(categoryId) {
  const taskCount = tasks.filter((task) => taskCategoryForTask(task)?.id === categoryId).length;
  const templateCount = taskTemplates().reduce((count, template) => (
    count + template.items.filter((item) => taskCategoryForTask(item)?.id === categoryId).length
  ), 0);
  return { taskCount, templateCount, total: taskCount + templateCount };
}

function defaultJournalTags() {
  return DEFAULT_JOURNAL_TAGS.map((tag) => ({ ...tag }));
}

function normalizeJournalTags(tags) {
  const shouldUseDefault = !Array.isArray(tags);
  const sourceTags = shouldUseDefault ? defaultJournalTags() : tags;
  const seen = new Set();
  const normalized = sourceTags.map((tag, index) => {
    const id = clean(tag && tag.id) || `tag-${Date.now()}-${index}`;
    if (seen.has(id)) return null;
    seen.add(id);
    return {
      id,
      color: normalizeColor(tag && tag.color),
      shortName: clean(tag && tag.shortName).slice(0, 8) || `标签${index + 1}`,
      fullName: clean(tag && tag.fullName) || '未填写含义'
    };
  }).filter(Boolean);

  return normalized.length > 0 || !shouldUseDefault ? normalized : defaultJournalTags();
}

function normalizeColor(value) {
  const color = clean(value);
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color : '#64748b';
}

function journalTags() {
  return normalizeJournalTags(profile && profile.journalTags);
}

function journalTagById(tagId) {
  return journalTags().find((tag) => tag.id === clean(tagId)) || null;
}

function normalizeJournalTagIds(value) {
  const selectedIds = new Set(normalizeRawJournalTagIds(value));
  return journalTags().map((tag) => tag.id).filter((tagId) => selectedIds.has(tagId));
}

function journalTagIds(journal) {
  if (!journal) return [];
  const legacyTagId = clean(journal.tagId) || legacyRatingToTagId(journal.rating);
  return normalizeJournalTagIds([
    ...(Array.isArray(journal.tagIds) ? journal.tagIds : []),
    legacyTagId
  ]);
}

function selectedJournalTagIds(select) {
  if (!select) return [];
  return normalizeJournalTagIds(Array.from(select.selectedOptions || [], (option) => option.value));
}

function setSelectedJournalTagIds(select, tagIds) {
  if (!select) return;
  const selected = new Set(normalizeJournalTagIds(tagIds));
  Array.from(select.options).forEach((option) => {
    option.selected = selected.has(option.value);
  });
}

function buildTagOptionText(tag) {
  return tag ? `${tag.shortName}：${tag.fullName}` : '无标签';
}

function populateJournalTagSelects() {
  const currentEditorValues = selectedJournalTagIds(journalTag);
  const currentFilterValues = selectedJournalTagIds(journalTagFilter).length
    ? selectedJournalTagIds(journalTagFilter)
    : appliedJournalTagFilters;
  [journalTag, journalTagFilter].forEach((select) => {
    if (!select) return;
    select.innerHTML = '';
    journalTags().forEach((tag) => {
      const option = document.createElement('option');
      option.value = tag.id;
      option.textContent = buildTagOptionText(tag);
      select.appendChild(option);
    });
  });
  setSelectedJournalTagIds(journalTag, currentEditorValues);
  setSelectedJournalTagIds(journalTagFilter, currentFilterValues);
  renderTagPicker(journalTag, journalTagPaletteButton, journalTagPalette);
  renderTagPicker(journalTagFilter, journalTagFilterPaletteButton, journalTagFilterPalette);
}

function renderTagPicker(select, button, palette) {
  if (!select || !button || !palette) return;
  const selectedIds = selectedJournalTagIds(select);
  const selectedTags = selectedIds.map(journalTagById).filter(Boolean);
  button.classList.toggle('empty', selectedTags.length === 0);
  button.replaceChildren();
  selectedTags.slice(0, 4).forEach((tag) => {
    const swatch = document.createElement('span');
    swatch.className = 'tag-picker-swatch';
    swatch.style.background = tag.color;
    button.appendChild(swatch);
  });
  if (selectedTags.length === 0 && button === journalTagFilterPaletteButton) {
    const placeholder = document.createElement('span');
    placeholder.className = 'tag-picker-placeholder';
    placeholder.textContent = '选择标签';
    button.appendChild(placeholder);
  }
  if (selectedTags.length > 4) {
    const count = document.createElement('span');
    count.className = 'tag-picker-count';
    count.textContent = `+${selectedTags.length - 4}`;
    button.appendChild(count);
  }
  button.title = selectedTags.length
    ? selectedTags.map((tag) => `${tag.shortName}：${tag.fullName}`).join('\n')
    : '未设置标签';

  palette.innerHTML = '';
  const emptyButton = createTagPaletteItem(null, select, button, palette);
  palette.appendChild(emptyButton);
  journalTags().forEach((item) => {
    palette.appendChild(createTagPaletteItem(item, select, button, palette));
  });
}

function createTagPaletteItem(tag, select, button, palette) {
  const selectedIds = new Set(selectedJournalTagIds(select));
  const item = document.createElement('button');
  item.type = 'button';
  item.className = 'tag-palette-item';
  item.classList.toggle('empty', !tag);
  item.classList.toggle('selected', Boolean(tag && selectedIds.has(tag.id)));
  item.title = tag ? `${tag.shortName}：${tag.fullName}` : '清除全部标签';
  item.setAttribute('aria-label', item.title);
  item.setAttribute('aria-pressed', String(Boolean(tag && selectedIds.has(tag.id))));
  const swatch = document.createElement('span');
  swatch.className = 'tag-palette-swatch';
  if (tag) swatch.style.background = tag.color;
  else swatch.textContent = '×';
  const label = document.createElement('span');
  label.className = 'tag-palette-label';
  label.textContent = tag ? tag.shortName : '清除全部';
  const check = document.createElement('span');
  check.className = 'tag-palette-check';
  check.textContent = tag && selectedIds.has(tag.id) ? '✓' : '';
  item.append(swatch, label, check);
  item.addEventListener('click', (event) => {
    event.stopPropagation();
    if (!tag) {
      setSelectedJournalTagIds(select, []);
    } else {
      const option = Array.from(select.options).find((candidate) => candidate.value === tag.id);
      if (option) option.selected = !option.selected;
    }
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  return item;
}

function toggleTagPalette(palette) {
  if (!palette) return;
  const shouldOpen = palette.classList.contains('hidden');
  closeAllTagPalettes();
  palette.classList.toggle('hidden', !shouldOpen);
  const button = palette === journalTagPalette ? journalTagPaletteButton : journalTagFilterPaletteButton;
  if (button) button.setAttribute('aria-expanded', String(shouldOpen));
}

function closeAllTagPalettes() {
  [journalTagPalette, journalTagFilterPalette].forEach((palette) => {
    if (palette) palette.classList.add('hidden');
  });
  [journalTagPaletteButton, journalTagFilterPaletteButton].forEach((button) => {
    if (button) button.setAttribute('aria-expanded', 'false');
  });
}

function closeTagPalettesOnOutsideClick(event) {
  if (event.target.closest('.tag-select-control')) return;
  closeAllTagPalettes();
}

function renderTaskCategorySettings() {
  if (!taskCategorySettingsList) return;
  const categories = taskCategories();
  taskCategorySettingsList.innerHTML = '';

  categories.forEach((category, index) => {
    const item = document.createElement('div');
    item.className = 'task-category-settings-item';
    item.dataset.categoryId = category.id;

    const header = document.createElement('div');
    header.className = 'task-category-settings-header';

    const color = document.createElement('input');
    color.type = 'color';
    color.value = category.color;
    color.setAttribute('aria-label', `${category.name}的颜色`);
    color.addEventListener('input', () => previewTaskCategoryColor(category.id, color.value));
    color.addEventListener('change', () => void persistTaskCategoryColor(category.id, color.value));

    const name = document.createElement('input');
    name.type = 'text';
    name.maxLength = 20;
    name.value = category.name;
    name.setAttribute('aria-label', '分类名称');
    name.addEventListener('blur', () => void updateTaskCategory(category.id, 'name', name.value));
    name.addEventListener('keydown', blurOnEnter);

    const identity = document.createElement('div');
    identity.className = 'task-category-identity';

    const activeLabel = document.createElement('label');
    activeLabel.className = 'task-category-active-toggle';
    const active = document.createElement('input');
    active.type = 'checkbox';
    active.checked = category.active;
    active.setAttribute('aria-label', `启用${category.name}`);
    active.addEventListener('change', () => void updateTaskCategory(category.id, 'active', active.checked));
    const activeText = document.createElement('span');
    activeText.textContent = category.active ? '启用' : '停用';
    activeLabel.append(active, activeText);

    const usageText = document.createElement('span');
    usageText.className = 'task-category-usage';
    const usage = taskCategoryUsage(category.id);
    usageText.textContent = usage.total ? `${usage.taskCount} 个任务 · ${usage.templateCount} 个模板项` : '尚未使用';
    identity.append(name, usageText);

    const order = document.createElement('div');
    order.className = 'task-category-order-actions';
    const up = createTaskCategoryOrderButton('↑', '上移分类', index === 0, () => moveTaskCategory(category.id, -1));
    const down = createTaskCategoryOrderButton('↓', '下移分类', index === categories.length - 1, () => moveTaskCategory(category.id, 1));
    order.append(up, down);

    const actions = document.createElement('div');
    actions.className = 'task-category-header-actions';
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'task-category-delete-button';
    deleteButton.textContent = '×';
    deleteButton.title = `删除分类“${category.name}”`;
    deleteButton.setAttribute('aria-label', deleteButton.title);
    deleteButton.disabled = categories.length <= 1;
    deleteButton.addEventListener('click', () => requestTaskCategoryDelete(category.id));
    actions.append(activeLabel, order, deleteButton);
    header.append(color, identity, actions);
    item.appendChild(header);

    const cycleRow = document.createElement('div');
    cycleRow.className = 'task-category-cycle-row';
    const cycleToggle = document.createElement('label');
    cycleToggle.className = 'task-category-cycle-toggle';
    const cycleCheckbox = document.createElement('input');
    cycleCheckbox.type = 'checkbox';
    cycleCheckbox.checked = category.cycleEnabled;
    cycleCheckbox.addEventListener('change', () => void updateTaskCategory(category.id, 'cycleEnabled', cycleCheckbox.checked));
    const cycleLabel = document.createElement('span');
    cycleLabel.textContent = '启用周期';
    cycleToggle.append(cycleCheckbox, cycleLabel);
    cycleRow.appendChild(cycleToggle);

    if (category.cycleEnabled) {
      cycleRow.append(
        createTaskCategoryMinutesField('专注', category.focusMinutes, (value) => updateTaskCategory(category.id, 'focusMinutes', value)),
        createTaskCategoryMinutesField('休息', category.breakMinutes, (value) => updateTaskCategory(category.id, 'breakMinutes', value))
      );
    } else {
      const hint = document.createElement('span');
      hint.className = 'task-category-cycle-hint';
      hint.textContent = '任务进行时只显示剩余时间';
      cycleRow.appendChild(hint);
    }
    item.appendChild(cycleRow);

    if (pendingTaskCategoryDeleteId === category.id && usage.total > 0) {
      item.appendChild(createTaskCategoryReassignPanel(category, categories, usage));
    }
    taskCategorySettingsList.appendChild(item);
  });
}

function createTaskCategoryMinutesField(label, value, onCommit) {
  const field = document.createElement('label');
  field.className = 'task-category-minutes-field';
  const text = document.createElement('span');
  text.textContent = `${label}（分钟）`;
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '1';
  input.max = '1440';
  input.step = '1';
  input.value = String(value);
  input.addEventListener('blur', () => void onCommit(input.value));
  input.addEventListener('keydown', blurOnEnter);
  field.append(text, input);
  return field;
}

function previewTaskCategoryColor(categoryId, value) {
  const categories = taskCategories();
  const category = taskCategoryById(categoryId, categories);
  if (!category) return;
  category.color = normalizeColor(value);
  profile = { ...normalizedProfile(), taskCategories: categories };
  document.querySelectorAll('[data-task-category-id]').forEach((control) => {
    if (control.dataset.taskCategoryId === categoryId) styleTaskCategoryControl(control, category);
  });
  renderProfileStats();
  publishFloatingTask();
  window.clearTimeout(taskCategoryColorSaveTimers.get(categoryId));
  taskCategoryColorSaveTimers.set(categoryId, window.setTimeout(async () => {
    taskCategoryColorSaveTimers.delete(categoryId);
    await saveState();
  }, 250));
}

async function persistTaskCategoryColor(categoryId, value) {
  previewTaskCategoryColor(categoryId, value);
  window.clearTimeout(taskCategoryColorSaveTimers.get(categoryId));
  taskCategoryColorSaveTimers.delete(categoryId);
  await saveState();
  renderTasksPreservingScroll();
  renderTaskTemplateList();
  renderProfileStats();
}

function createTaskCategoryOrderButton(text, label, disabled, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'task-category-order-button';
  button.textContent = text;
  button.title = label;
  button.setAttribute('aria-label', label);
  button.disabled = disabled;
  button.addEventListener('click', () => void onClick());
  return button;
}

function createTaskCategoryReassignPanel(category, categories, usage) {
  const panel = document.createElement('div');
  panel.className = 'task-category-reassign-panel';
  const message = document.createElement('p');
  message.textContent = `“${category.name}”仍用于 ${usage.taskCount} 个任务和 ${usage.templateCount} 个模板项。删除前请选择迁移目标。`;
  const select = document.createElement('select');
  select.setAttribute('aria-label', '迁移目标分类');
  categories.filter((item) => item.id !== category.id).forEach((item) => select.add(new Option(item.name, item.id)));
  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.className = 'secondary-button';
  cancel.textContent = '取消';
  cancel.addEventListener('click', () => {
    pendingTaskCategoryDeleteId = '';
    renderTaskCategorySettings();
  });
  const confirm = document.createElement('button');
  confirm.type = 'button';
  confirm.className = 'danger-button';
  confirm.textContent = '迁移并删除';
  confirm.addEventListener('click', () => void deleteTaskCategory(category.id, select.value));
  panel.append(message, select, cancel, confirm);
  return panel;
}

function setTaskCategorySettingsStatus(message = '', error = false) {
  if (!taskCategorySettingsStatus) return;
  taskCategorySettingsStatus.textContent = message;
  taskCategorySettingsStatus.classList.toggle('hidden', !message);
  taskCategorySettingsStatus.classList.toggle('is-error', error);
}

async function updateTaskCategory(categoryId, field, value) {
  const categories = taskCategories();
  const category = taskCategoryById(categoryId, categories);
  if (!category) return;
  setTaskCategorySettingsStatus();

  if (field === 'name') {
    const nextName = clean(value).slice(0, 20);
    const duplicate = categories.some((item) => item.id !== categoryId && item.name.toLocaleLowerCase('zh-CN') === nextName.toLocaleLowerCase('zh-CN'));
    if (!nextName || duplicate) {
      setTaskCategorySettingsStatus(!nextName ? '分类名称不能为空。' : '分类名称不能重复。', true);
      renderTaskCategorySettings();
      return;
    }
    category.name = nextName;
  } else if (field === 'color') {
    category.color = normalizeColor(value);
  } else if (field === 'cycleEnabled') {
    category.cycleEnabled = Boolean(value);
  } else if (field === 'focusMinutes') {
    category.focusMinutes = boundedIntegerSetting(value, 50, 1, 1440);
  } else if (field === 'breakMinutes') {
    category.breakMinutes = boundedIntegerSetting(value, 10, 1, 1440);
  } else if (field === 'active') {
    if (!value && categories.filter((item) => item.active).length <= 1) {
      setTaskCategorySettingsStatus('至少需要保留一个启用的任务分类。', true);
      renderTaskCategorySettings();
      return;
    }
    category.active = Boolean(value);
  }

  syncTaskCategoryNames(categories);
  profile = { ...normalizedProfile(), taskCategories: categories, taskTemplates: profile.taskTemplates };
  await saveState();
  renderTaskCategorySettings();
  renderTasksPreservingScroll();
  renderProfileStats();
}

async function addTaskCategory() {
  const categories = taskCategories();
  categories.push({
    id: `category-custom-${Date.now()}`,
    name: `分类${categories.length + 1}`,
    color: '#64748b',
    cycleEnabled: false,
    focusMinutes: 50,
    breakMinutes: 10,
    active: true
  });
  profile = { ...normalizedProfile(), taskCategories: categories };
  await saveState();
  setTaskCategorySettingsStatus('已新增分类，可直接修改名称、颜色和周期设置。');
  renderTaskCategorySettings();
}

async function moveTaskCategory(categoryId, offset) {
  const categories = taskCategories();
  const index = categories.findIndex((category) => category.id === categoryId);
  const targetIndex = index + offset;
  if (index < 0 || targetIndex < 0 || targetIndex >= categories.length) return;
  [categories[index], categories[targetIndex]] = [categories[targetIndex], categories[index]];
  profile = { ...normalizedProfile(), taskCategories: categories };
  await saveState();
  renderTaskCategorySettings();
  renderTasksPreservingScroll();
  renderProfileStats();
}

async function requestTaskCategoryDelete(categoryId) {
  const categories = taskCategories();
  if (categories.length <= 1) {
    setTaskCategorySettingsStatus('至少需要保留一个任务分类。', true);
    return;
  }
  const usage = taskCategoryUsage(categoryId);
  if (usage.total > 0) {
    pendingTaskCategoryDeleteId = pendingTaskCategoryDeleteId === categoryId ? '' : categoryId;
    renderTaskCategorySettings();
    return;
  }
  await deleteTaskCategory(categoryId, '');
}

async function deleteTaskCategory(categoryId, replacementId) {
  const categories = taskCategories();
  const removed = taskCategoryById(categoryId, categories);
  const replacement = taskCategoryById(replacementId, categories);
  if (!removed || categories.length <= 1) return;
  const usage = taskCategoryUsage(categoryId);
  if (usage.total > 0 && !replacement) {
    setTaskCategorySettingsStatus('请选择迁移目标分类。', true);
    return;
  }

  if (replacement) {
    tasks.forEach((task) => {
      if (resolveTaskCategoryId(task.typeId, categories, task.type) !== categoryId) return;
      task.typeId = replacement.id;
      task.type = replacement.name;
    });
    const templates = taskTemplates().map((template) => ({
      ...template,
      items: template.items.map((item) => resolveTaskCategoryId(item.typeId, categories, item.type) === categoryId
        ? { ...item, typeId: replacement.id, type: replacement.name }
        : item)
    }));
    profile = { ...normalizedProfile(), taskTemplates: templates };
  }

  const nextCategories = categories.filter((category) => category.id !== categoryId);
  profile = { ...normalizedProfile(), taskCategories: nextCategories, taskTemplates: profile.taskTemplates };
  pendingTaskCategoryDeleteId = '';
  await saveState();
  setTaskCategorySettingsStatus(`已删除分类“${removed.name}”。`);
  renderAll();
}

function syncTaskCategoryNames(categories = taskCategories()) {
  tasks.forEach((task) => {
    const category = taskCategoryForTask(task, categories);
    if (!category) return;
    task.typeId = category.id;
    task.type = category.name;
  });
  if (!profile || !Array.isArray(profile.taskTemplates)) return;
  profile.taskTemplates = normalizeTaskTemplates(profile.taskTemplates, categories).map((template) => ({
    ...template,
    items: template.items.map((item) => {
      const category = taskCategoryForTask(item, categories);
      return category ? { ...item, typeId: category.id, type: category.name } : item;
    })
  }));
}

function renderJournalTagSettings() {
  if (!journalTagSettingsList) return;
  journalTagSettingsList.innerHTML = '';

  journalTags().forEach((tag) => {
    const row = document.createElement('div');
    row.className = 'tag-settings-row';
    row.dataset.tagId = tag.id;

    const color = document.createElement('input');
    color.type = 'color';
    color.value = tag.color;
    color.setAttribute('aria-label', '标签颜色');
    color.addEventListener('input', () => updateJournalTag(tag.id, 'color', color.value));

    const shortName = document.createElement('input');
    shortName.type = 'text';
    shortName.maxLength = 8;
    shortName.value = tag.shortName;
    shortName.placeholder = '简称';
    shortName.addEventListener('blur', () => updateJournalTag(tag.id, 'shortName', shortName.value));
    shortName.addEventListener('keydown', blurOnEnter);

    const fullName = document.createElement('input');
    fullName.type = 'text';
    fullName.value = tag.fullName;
    fullName.placeholder = '全称 / 含义';
    fullName.addEventListener('blur', () => updateJournalTag(tag.id, 'fullName', fullName.value));
    fullName.addEventListener('keydown', blurOnEnter);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-table-row';
    deleteButton.type = 'button';
    deleteButton.textContent = '-';
    deleteButton.setAttribute('aria-label', '删除标签');
    deleteButton.addEventListener('click', () => deleteJournalTag(tag.id));

    row.append(color, shortName, fullName, deleteButton);
    journalTagSettingsList.appendChild(row);
  });
}

async function updateJournalTag(tagId, field, value) {
  const tags = journalTags();
  const target = tags.find((tag) => tag.id === tagId);
  if (!target) return;
  if (field === 'color') target.color = normalizeColor(value);
  if (field === 'shortName') target.shortName = clean(value).slice(0, 8) || target.shortName;
  if (field === 'fullName') target.fullName = clean(value) || target.fullName;
  profile = { ...normalizedProfile(), journalTags: tags };
  await saveState();
  populateJournalTagSelects();
  renderJournalList();
}

async function addJournalTag() {
  const tags = journalTags();
  tags.push({
    id: `tag-${Date.now()}`,
    color: '#64748b',
    shortName: `标签${tags.length + 1}`,
    fullName: '新的标签含义'
  });
  profile = { ...normalizedProfile(), journalTags: tags };
  await saveState();
  renderJournalTagSettings();
  populateJournalTagSelects();
}

async function deleteJournalTag(tagId) {
  const tags = journalTags().filter((tag) => tag.id !== tagId);
  profile = { ...normalizedProfile(), journalTags: tags };
  journals = journals.map((journal) => ({
    ...journal,
    tagIds: journalTagIds(journal).filter((currentTagId) => currentTagId !== tagId)
  }));
  appliedJournalTagFilters = appliedJournalTagFilters.filter((currentTagId) => currentTagId !== tagId);
  await saveState();
  renderJournalTagSettings();
  populateJournalTagSelects();
  renderJournalList();
  renderSelectedJournal();
}

async function getEffectiveNow() {
  const result = await window.whbr.getSystemTime();
  return new Date(result.timestamp);
}

function numericSetting(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function boundedIntegerSetting(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.round(number)));
}

async function initializeAppData() {
  try {
    const result = await window.whbr.loadData();
    tasks = result.data.tasks || [];
    profile = {
      ...defaultProfile(),
      ...(result.data.profile || {})
    };
    const migratedProfile = migrateProfileDefaults(profile);
    profile = migratedProfile.profile;
    const migratedTaskCategories = normalizeTaskCategoryAssignments();
    const migratedTasks = normalizeTaskDayBoundaries();
    journals = normalizeJournalCollection(result.data.journals || []);
    storagePaths = result.paths || storagePaths;
    setDateInputValue(journalViewDate, latestJournalDate() || journalDate.value || formatLocalDate(new Date()));
    populateJournalTagSelects();
    renderJournalTagSettings();
    renderTaskCategorySettings();
    renderShortcutSettings();
    await migrateLegacyLocalStorageIfNeeded();
    if (migratedProfile.changed || migratedTaskCategories.changed || migratedTasks.changed) await saveState();
    updateStoragePathView();
    renderAll();
    if (pages.tasks.classList.contains('active')) {
      renderTasks({ scrollToCurrent: true, forceScroll: true });
    }
    updateJournalFilterControls();
  } catch (error) {
    setStatus(`加载数据失败：${error.message}`, '');
  }
}

function migrateProfileDefaults(profileData) {
  const migrated = { ...profileData };
  let changed = false;
  const normalizedShortcuts = normalizeShortcutSettings(migrated.shortcuts);
  if (JSON.stringify(migrated.shortcuts || {}) !== JSON.stringify(normalizedShortcuts)) {
    migrated.shortcuts = normalizedShortcuts;
    changed = true;
  }
  const normalizedTags = normalizeJournalTags(migrated.journalTags);
  if (JSON.stringify(migrated.journalTags || []) !== JSON.stringify(normalizedTags)) {
    migrated.journalTags = normalizedTags;
    changed = true;
  }
  const legacyClassMinutes = Number(migrated.classDuration) === 45 ? 50 : numericSetting(migrated.classDuration, 50);
  const legacyFocusMinutes = Number(migrated.workFocusLength || migrated.focusLength) === 45
    ? 50
    : numericSetting(migrated.workFocusLength || migrated.focusLength, 50);
  const categorySource = Array.isArray(migrated.taskCategories)
    ? migrated.taskCategories.map((category) => {
      if (!category || typeof category !== 'object') return category;
      const wasCourseCycle = category.behavior === 'course';
      const wasFocusCycle = category.behavior === 'focus';
      return {
        ...category,
        cycleEnabled: typeof category.cycleEnabled === 'boolean'
          ? category.cycleEnabled
          : wasCourseCycle || wasFocusCycle,
        focusMinutes: category.focusMinutes || (wasCourseCycle
          ? legacyClassMinutes
          : legacyFocusMinutes),
        breakMinutes: category.breakMinutes || (wasCourseCycle
          ? numericSetting(migrated.classBreakLength, 10)
          : numericSetting(migrated.workBreakLength, 10))
      };
    })
    : migrated.taskCategories;
  const normalizedCategories = normalizeRawTaskCategories(categorySource);
  if (JSON.stringify(migrated.taskCategories || []) !== JSON.stringify(normalizedCategories)) {
    migrated.taskCategories = normalizedCategories;
    changed = true;
  }
  const normalizedTemplates = normalizeTaskTemplates(migrated.taskTemplates, normalizedCategories);
  if (JSON.stringify(migrated.taskTemplates || []) !== JSON.stringify(normalizedTemplates)) {
    migrated.taskTemplates = normalizedTemplates;
    changed = true;
  }
  ['focusLength', 'breakReminder', 'classDuration', 'classBreakLength', 'workFocusLength', 'workBreakLength'].forEach((field) => {
    if (!Object.prototype.hasOwnProperty.call(migrated, field)) return;
    delete migrated[field];
    changed = true;
  });
  if (migrated.defaultsVersion !== '0.2.0') {
    migrated.defaultsVersion = '0.2.0';
    changed = true;
  }
  return { profile: migrated, changed };
}

function normalizeTaskCategoryAssignments() {
  const categories = taskCategories();
  let changed = false;
  tasks.forEach((task) => {
    const categoryId = resolveTaskCategoryId(task.typeId, categories, task.type || inferTaskType(task.title));
    const category = taskCategoryById(categoryId, categories);
    if (!category) return;
    if (task.typeId !== category.id || task.type !== category.name) changed = true;
    task.typeId = category.id;
    task.type = category.name;
  });
  return { changed };
}

function latestJournalDate() {
  return journals
    .map((journal) => journalSortEnd(journal))
    .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date) && date !== '0000-00-00')
    .sort()
    .at(-1) || '';
}

async function migrateLegacyLocalStorageIfNeeded() {
  const legacyTasks = loadLegacyArray('whbr.tasks');
  const legacyJournals = loadLegacyArray('whbr.journals');

  if (tasks.length === 0 && legacyTasks.length > 0) {
    tasks = mergeTasks(tasks, legacyTasks);
  }

  if (journals.length === 0 && legacyJournals.length > 0) {
    journals = mergeJournals(journals, legacyJournals);
  }

  if (legacyTasks.length > 0 || legacyJournals.length > 0) {
    await saveState();
    clearLegacyLocalStorage();
  }
}

function loadLegacyArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch (error) {
    return [];
  }
}

async function saveState() {
  const result = await window.whbr.saveData({ tasks, journals, profile });
  storagePaths = result.paths || storagePaths;
  updateStoragePathView();
}

async function chooseStorageRoot() {
  if (asrModelDownloadInFlight || (latestAsrModelStatus && latestAsrModelStatus.state === 'downloading')) {
    setStatus('模型正在下载，请完成后再更改存放位置。', 'error', 4000);
    return;
  }

  changeStorageRootButton.disabled = true;
  changeStorageRootButton.textContent = '迁移中…';
  setStatus('请选择新的日织内容存放文件夹。迁移期间请勿关闭软件。', '');
  try {
    const result = await window.whbr.chooseStorageRoot({ tasks, journals, profile });
    if (result.canceled) return;
    applyStorageMigrationResult(result);
    if (result.modelStatus) updateAsrModelStatus(result.modelStatus);
    showStorageRootMigrationStatus(result);
  } catch (error) {
    setStatus(`迁移本地内容失败：${error.message || String(error)}`, 'error', 7000);
    await refreshAsrModelStatus();
  } finally {
    changeStorageRootButton.disabled = false;
    changeStorageRootButton.textContent = '更改';
  }
}

async function openDataPath() {
  const result = await window.whbr.openDataPath();
  if (result && result.error) {
    setStatus(`打开文件夹失败：${result.error}`, 'error', 3000);
  }
}

async function deleteJournalMediaItems(journal, targetDate, fallbackTitle, media, selectedIds, deleteButton) {
  const selectedMedia = media.filter((item) => selectedIds.has(item.id));
  if (selectedMedia.length === 0) return;

  const response = await window.whbr.showMessageBox({
    type: 'warning',
    title: '删除所选附件',
    message: `确认删除所选的 ${selectedMedia.length} 个照片或视频附件吗？`,
    detail: '删除后无法恢复，但不会删除这一天的生活记录文字。',
    buttons: ['删除附件', '取消'],
    defaultId: 1,
    cancelId: 1
  });
  if (!response || response.response !== 0) return;

  deleteButton.disabled = true;
  const result = await window.whbr.media.deleteItems(selectedMedia);
  if (!result || !result.ok) {
    deleteButton.disabled = false;
    setStatus(`删除附件失败：${result && result.error && result.error.message ? result.error.message : '未知错误'}`, 'error', 5000);
    return;
  }

  const selectedIdSet = new Set(selectedMedia.map((item) => item.id));
  const identity = journalIdentity(journal);
  let updatedJournal = null;
  journals = journals.map((item) => {
    if (journalIdentity(item) !== identity) return item;
    updatedJournal = { ...item, media: normalizeJournalMedia(item.media).filter((mediaItem) => !selectedIdSet.has(mediaItem.id)) };
    return updatedJournal;
  });
  if (!updatedJournal) return;
  journals = removeEmptyJournalEntries(journals);
  updatedJournal = journals.find((item) => journalIdentity(item) === identity) || null;

  mediaUrlCache.clear();
  await saveState();
  renderJournalList();
  if (updatedJournal) renderJournalView(updatedJournal, targetDate, fallbackTitle);
  else closeJournalViewModal();
  setStatus(`已删除 ${selectedMedia.length} 个附件。`, 'hidden');
}

function applyStorageMigrationResult(result) {
  if (result && result.data) {
    tasks = Array.isArray(result.data.tasks) ? result.data.tasks : tasks;
    journals = normalizeJournalCollection(result.data.journals || journals);
    profile = {
      ...defaultProfile(),
      ...(result.data.profile || profile)
    };
  }
  storagePaths = result && result.paths ? result.paths : storagePaths;
  mediaUrlCache.clear();
  updateStoragePathView();
}

function showStorageRootMigrationStatus(result) {
  if (result && result.migration && result.migration.skipped) {
    setStatus('本地内容存放位置未改变。', '', 3000);
    return;
  }
  const warnings = result && result.migration && Array.isArray(result.migration.cleanupWarnings)
    ? result.migration.cleanupWarnings
    : [];
  if (warnings.length > 0) {
    setStatus('本地内容已迁移，但旧位置有部分内容无法删除，请关闭占用文件后手动清理。', 'error', 7000);
    return;
  }
  setStatus('本地内容已迁移，原有文件结构已保留，旧位置中的内容已删除。', '', 6000);
}

async function openMediaDirectory() {
  const result = await window.whbr.media.openDirectory();
  if (result && result.paths) {
    storagePaths = result.paths;
    updateStoragePathView();
  }
  if (result && result.error) setStatus(`打开媒体文件夹失败：${result.error}`, 'error', 3000);
}

function updateDeletePeriodFields() {
  const multipleDates = Boolean(deleteMultipleDates && deleteMultipleDates.checked);
  deleteEndDateField.classList.toggle('hidden', !multipleDates);
  deleteStartDateLabel.textContent = multipleDates ? '起始日期' : '删除日期';
  openDeletePeriodButton.textContent = multipleDates ? '删除选定时期数据' : '删除选定日期数据';
  if (multipleDates && !deleteEndDate.value) setDateInputValue(deleteEndDate, deleteStartDate.value || formatLocalDate(new Date()));
}

function getSelectedDeletionPeriod() {
  const start = normalizeDate(deleteStartDate.value);
  const end = deleteMultipleDates && deleteMultipleDates.checked
    ? normalizeDate(deleteEndDate.value)
    : start;
  if (!start || !end) return null;
  if (start > end) return { error: '结束日期不能早于起始日期。' };
  return { start, end, multipleDates: Boolean(deleteMultipleDates && deleteMultipleDates.checked) };
}

function formatDeletionPeriod(period) {
  return period.multipleDates ? `${period.start} 至 ${period.end}` : period.start;
}

function openDeletePeriodModal() {
  const period = getSelectedDeletionPeriod();
  if (!period) {
    setStatus('请选择有效的删除日期。', 'error', 4000);
    return;
  }
  if (period.error) {
    setStatus(period.error, 'error', 4000);
    return;
  }

  deleteMode = 'period';
  const periodLabel = formatDeletionPeriod(period);
  resetTitle.textContent = period.multipleDates ? '删除选定时期数据' : '删除选定日期数据';
  resetDescription.textContent = `请选择要删除的 ${periodLabel} 数据；仅会删除您勾选的内容。`;
  resetConfirmText.textContent = `我确认按以上选择删除 ${periodLabel} 的数据`;
  confirmResetButton.textContent = '确认删除';
  openConfirmModal();
}

function openResetModal() {
  deleteMode = 'all';
  resetTitle.textContent = '重置全部数据';
  resetDescription.textContent = '请选择需要清空的全部本地内容；未勾选的内容会保留。';
  resetConfirmText.textContent = '我确认按以上选择重置全部数据';
  confirmResetButton.textContent = '确认重置';
  openConfirmModal();
}

function openConfirmModal() {
  resetConfirmCheck.checked = false;
  renderResetDeleteOptions();
  renderResetPaths();
  updateResetConfirmButton();
  resetModal.classList.remove('hidden');
}

function closeResetModal() {
  resetModal.classList.add('hidden');
}

async function confirmReset() {
  const selectedContents = getSelectedResetContents();
  if (!resetConfirmCheck.checked || selectedContents.length === 0) return;

  confirmResetButton.disabled = true;
  if (deleteMode === 'period') {
    await deleteSelectedPeriod(selectedContents);
    closeResetModal();
    return;
  }

  if (selectedContents.includes('tasks')) tasks = [];
  if (selectedContents.includes('journals')) journals = [];
  if (selectedContents.includes('media') && !selectedContents.includes('journals')) {
    journals = journals.map((journal) => ({ ...journal, media: [] }));
    journals = removeEmptyJournalEntries(journals);
  }
  const result = await window.whbr.resetData({ tasks, journals, profile }, {
    clearMedia: selectedContents.includes('media')
  });
  clearLegacyLocalStorage();
  storagePaths = result.paths || storagePaths;
  loadProfileToForm();
  updateStoragePathView();
  renderAll();
  closeResetModal();
  setStatus(`已清空全部${getResetDeleteOptionDefinitions()
    .filter(([value]) => selectedContents.includes(value))
    .map(([, label]) => label)
    .join('、')}。`, 'hidden');
}

function getResetDeleteOptionDefinitions() {
  return [
    ['tasks', '任务安排', deleteMode === 'period' ? '删除选定日期或时期内的任务安排。' : '删除所有日期的任务安排。'],
    ['journals', '生活记录', deleteMode === 'period' ? '删除选定日期或时期内的生活记录与文字内容。' : '删除全部生活记录与文字内容。'],
    ['media', '照片和视频附件', deleteMode === 'period' ? '删除选定日期或时期内归档的全部照片、动态图片和视频。' : '删除全部归档的照片、动态图片和视频。']
  ];
}

function renderResetDeleteOptions() {
  if (!resetDeleteOptions) return;
  resetDeleteOptions.replaceChildren();

  getResetDeleteOptionDefinitions().forEach(([value, label, description]) => {
    const option = document.createElement('label');
    option.className = 'reset-delete-option';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = 'reset-delete-content';
    input.value = value;
    input.checked = true;
    const text = document.createElement('span');
    const title = document.createElement('strong');
    title.textContent = label;
    const detail = document.createElement('small');
    detail.textContent = description;
    text.append(title, detail);
    option.append(input, text);
    resetDeleteOptions.appendChild(option);
  });
}

function getSelectedResetContents() {
  if (!resetDeleteOptions) return [];
  return Array.from(resetDeleteOptions.querySelectorAll('input:checked')).map((input) => input.value);
}

function updateResetConfirmButton() {
  confirmResetButton.disabled = !resetConfirmCheck.checked || getSelectedResetContents().length === 0;
}

function renderResetPaths() {
  resetPathList.innerHTML = '';
  const selectedLabels = getResetDeleteOptionDefinitions()
    .filter(([value]) => getSelectedResetContents().includes(value))
    .map(([, label]) => label)
    .join('、') || '未选择';

  const period = getSelectedDeletionPeriod();
  const rows = deleteMode === 'period'
    ? [
        ['删除时期', period && !period.error ? formatDeletionPeriod(period) : '未选择'],
        ['删除内容', selectedLabels]
      ]
    : [
    ['删除内容', selectedLabels],
    ['数据文件夹', storagePaths.dataDirectory],
    ['媒体归档文件夹', storagePaths.mediaDirectory],
    ['月度文件命名', storagePaths.dataFilePattern],
    ['设置文件', storagePaths.settingsFilePath],
    ['内部定位文件', storagePaths.settingsLocationPath],
    ['旧版浏览器存储', storagePaths.legacyStorageKeys.join(', ')]
      ];

  rows.forEach(([label, value]) => {
    const row = document.createElement('div');
    row.className = 'path-row';
    const name = document.createElement('span');
    name.textContent = label;
    const code = document.createElement('code');
    code.textContent = value || '尚未生成';
    row.append(name, code);
    resetPathList.appendChild(row);
  });
}

async function deleteSelectedPeriod(selectedContents) {
  const period = getSelectedDeletionPeriod();
  if (!period || period.error) return;
  const { start, end } = period;
  const isInPeriod = (date) => {
    const normalizedDate = normalizeDate(date);
    return normalizedDate >= start && normalizedDate <= end;
  };

  if (selectedContents.includes('tasks')) {
    tasks = tasks.filter((task) => !isInPeriod(task.date));
    Array.from(activePlanningDates).forEach((date) => {
      if (isInPeriod(date)) activePlanningDates.delete(date);
    });
  }
  if (selectedContents.includes('journals')) {
    journals = journals.filter((journal) => {
      const journalStart = normalizeDate(journal.dateRangeStart || journal.date);
      const journalEnd = normalizeDate(journal.dateRangeEnd || journal.date);
      return !((journalStart || journalEnd) <= end && (journalEnd || journalStart) >= start);
    });
  }
  if (selectedContents.includes('media') && !selectedContents.includes('journals')) {
    journals = journals.map((journal) => {
      const journalStart = normalizeDate(journal.dateRangeStart || journal.date);
      const journalEnd = normalizeDate(journal.dateRangeEnd || journal.date);
      const overlapsPeriod = (journalStart || journalEnd) <= end && (journalEnd || journalStart) >= start;
      return overlapsPeriod ? { ...journal, media: [] } : journal;
    });
    journals = removeEmptyJournalEntries(journals);
  }

  if (isInPeriod(taskDateFilter.value)) renderTasks();
  if (selectedContents.includes('journals') && isInPeriod(journalDate.value)) journalContent.value = '';

  if (selectedContents.includes('media')) {
    const dates = enumerateDates(start, end);
    await window.whbr.media.deleteForDates(dates);
  }
  const result = await window.whbr.resetData({ tasks, journals, profile });
  storagePaths = result.paths || storagePaths;
  renderAll();
  setStatus(`已删除 ${formatDeletionPeriod(period)} 的${getResetDeleteOptionDefinitions()
    .filter(([value]) => selectedContents.includes(value))
    .map(([, label]) => label)
    .join('、')}。`, 'hidden');
}

function updateStoragePathView() {
  if (storageRootPath) storageRootPath.textContent = storagePaths.storageRoot || storagePaths.dataDirectory || '尚未生成';
  dataFilePath.textContent = storagePaths.dataFilePath || '尚未生成';
  settingsFilePath.textContent = storagePaths.settingsFilePath || '尚未生成';
  if (mediaDirectoryPath) mediaDirectoryPath.textContent = storagePaths.mediaDirectory || '尚未生成';
  if (modelDownloadPath) modelDownloadPath.textContent = asrModelDownloadDirectory || '加载中...';
}

function clearLegacyLocalStorage() {
  localStorage.removeItem('whbr.tasks');
  localStorage.removeItem('whbr.journals');
}

function setStatus(message, extraClass, timeoutMs = 0) {
  window.clearTimeout(statusTimer);
  statusBox.className = `status-box ${extraClass || ''}`.trim();

  if (!statusBox.classList.contains('hidden')) {
    renderStatusContent(statusBox, message, hideStatus, 'status-box-message', 'status-box-close');
  }

  if (timeoutMs > 0) {
    statusTimer = window.setTimeout(hideStatus, timeoutMs);
  }
}

function hideStatus() {
  window.clearTimeout(statusTimer);
  statusBox.replaceChildren();
  statusBox.className = 'status-box hidden';
}

function hideInlineStatus(element) {
  if (!element) return;
  element.replaceChildren();
  element.classList.add('hidden');
}

function renderStatusContent(element, message, closeHandler = null, messageClass = 'inline-status-message', closeClass = 'inline-status-close') {
  if (!element) return;
  element.replaceChildren();

  const text = document.createElement('span');
  text.className = messageClass;
  text.textContent = message;
  element.appendChild(text);

  if (!closeHandler) return;

  const closeButton = document.createElement('button');
  closeButton.className = closeClass;
  closeButton.type = 'button';
  closeButton.textContent = '×';
  closeButton.title = '关闭提示';
  closeButton.setAttribute('aria-label', '关闭提示');
  closeButton.addEventListener('click', closeHandler);
  element.appendChild(closeButton);
}

function clean(value) {
  return String(value ?? '').trim();
}

async function startApp() {
  await applyAppIcon();
  await applyAppVersion();
  void refreshUpdateStatus();
  void refreshAsrModelStatus();
  void refreshAudioInputDevices();
  if (navigator.mediaDevices && typeof navigator.mediaDevices.addEventListener === 'function') {
    navigator.mediaDevices.addEventListener('devicechange', () => {
      if (!microphoneTestRecording && !asrTestRecording) void refreshAudioInputDevices();
    });
  }
  const today = formatLocalDate(new Date());
  setDateInputValue(journalDate, today);
  setDateInputValue(taskDateFilter, today);
  setDateInputValue(deleteStartDate, today);
  setDateInputValue(deleteEndDate, today);
  updateDeletePeriodFields();
  committedProfileStatsStartDate = today;
  syncProfileStatsReferenceControls();
  updateContextualNowButton();

  await initializeAppData();
  await refreshSystemTime();
  setInterval(refreshSystemTime, 1000);
}

async function applyAppIcon() {
  if (!window.whbr || typeof window.whbr.getAppIconUrl !== 'function') return;

  try {
    const iconUrl = await window.whbr.getAppIconUrl();
    if (!iconUrl) return;
    if (appIconLink) appIconLink.href = iconUrl;
    if (brandMark) brandMark.src = iconUrl;
  } catch (error) {
    // Keep the static relative path as a development fallback.
  }
}

async function applyAppVersion() {
  if (!versionBadge || !window.whbr || typeof window.whbr.getAppVersion !== 'function') return;

  try {
    const version = await window.whbr.getAppVersion();
    versionBadge.textContent = version ? `版本 v${version}` : '版本 --';
  } catch (error) {
    versionBadge.textContent = '版本 --';
  }
}

startApp();
