const { app, BrowserWindow, Menu, Tray, dialog, ipcMain, nativeImage, screen, shell } = require('electron');
const http = require('http');
const os = require('os');
const crypto = require('crypto');
const { spawn } = require('child_process');
const path = require('path');
const { pathToFileURL } = require('url');
const fsSync = require('fs');
const fs = require('fs/promises');
const { parseScheduleFile } = require('./src/parsers/scheduleParser');
const { parseTaskTextList } = require('./src/parsers/taskTextParser');
const { getStoragePaths, loadData, resetData, saveData, setStorageRoot } = require('./src/storage/localDataStore');
const { autoUpdater } = require('electron-updater');
const { createAsrModelManager } = require('./src/asr/modelManager');
const { createAsrService } = require('./src/asr/asrService');
const QRCode = require('qrcode');
const ffmpegStaticPath = require('ffmpeg-static');

const scheduleFileExtensions = ['xlsx', 'xls', 'csv', 'tsv'];
const allowedExtensions = new Set(scheduleFileExtensions.map((extension) => `.${extension}`));
const appIconPath = resolveAppAssetPath('rizhi.ico');
const appUiIconPath = resolveAppAssetPath('rizhi.svg');
let mainWindow = null;
let floatingTaskWindow = null;
let floatingTaskPayload = null;
let floatingTaskAlwaysOnTop = true;
let floatingTaskFlashTimer = null;
let floatingTaskWindowReady = false;
let pendingFloatingTaskFlashes = 0;
let floatingTaskDockEdge = '';
let floatingTaskDockDisplayId = null;
let floatingTaskDockTimer = null;
let floatingTaskPositionIgnoreUntil = 0;
let reminderWindow = null;
let reminderCloseTimer = null;
let reminderQueue = [];
let isReminderShowing = false;
let tray = null;
let isQuitting = false;
let isClosePromptShowing = false;
let isUpdatePromptShowing = false;
let updateCheckInFlight = null;
let updateCheckSource = '';
let updateState = {
  status: 'idle',
  version: '',
  progress: null,
  error: ''
};
let asrService = null;
let asrPathChangeInProgress = false;
const mediaUploadSessions = new Map();
const MEDIA_UPLOAD_MAX_BYTES = 350 * 1024 * 1024;
const MEDIA_IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.avif', '.tif', '.tiff', '.heic', '.heif']);
const MEDIA_VIDEO_EXTENSIONS = new Set(['.mp4', '.m4v', '.mov', '.webm', '.mkv', '.avi', '.3gp']);

if (process.platform === 'win32') {
  app.setAppUserModelId('com.rizhi.pc');
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 920,
    minHeight: 620,
    backgroundColor: '#f4f5f7',
    title: '日织',
    icon: appIconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
  configureMicrophonePermissionPolicy(mainWindow);

  mainWindow.on('minimize', () => {
    showFloatingTaskWindow();
  });

  mainWindow.on('close', async (event) => {
    if (isQuitting) return;
    event.preventDefault();

    if (isClosePromptShowing) return;
    isClosePromptShowing = true;

    const choice = await dialog.showMessageBox(mainWindow, {
      type: 'question',
      title: '关闭日织',
      message: '要退出软件，还是最小化到托盘继续运行？',
      buttons: ['最小化到托盘', '退出软件', '取消'],
      defaultId: 0,
      cancelId: 2,
      noLink: true
    });

    isClosePromptShowing = false;

    if (choice.response === 1) {
      isQuitting = true;
      app.quit();
      return;
    }

    if (choice.response === 0) {
      hideMainWindow();
    }
  });
}

function setupAutoUpdater() {
  if (!app.isPackaged) {
    return;
  }

  autoUpdater.autoDownload = false;

  autoUpdater.on('checking-for-update', () => {
    console.log('RiZhi: checking for updates...');
    setUpdateState({ status: 'checking', version: '', progress: null, error: '' });
  });

  autoUpdater.on('update-available', async (info) => {
    const versionLabel = formatVersionLabel(info.version);
    console.log(`RiZhi: update available: ${versionLabel}`);
    setUpdateState({ status: 'available', version: info.version || '', progress: null, error: '' });

    if (updateCheckSource === 'manual' || isUpdatePromptShowing) return;
    isUpdatePromptShowing = true;

    const result = await dialog.showMessageBox(mainWindow || undefined, {
      type: 'question',
      title: '日织更新',
      message: `有新版本${versionLabel}，是否更新？`,
      detail: '选择“是”后将从 GitHub Release 下载并安装新版本。选择“否”会继续使用当前版本，且不会处理你的本地记录文件。',
      buttons: ['是', '否'],
      defaultId: 0,
      cancelId: 1,
      noLink: true
    });

    isUpdatePromptShowing = false;

    if (result.response === 0) void downloadAppUpdate();
  });

  autoUpdater.on('update-not-available', () => {
    console.log('RiZhi: already up to date.');
    setUpdateState({ status: 'up-to-date', version: '', progress: null, error: '' });
  });

  autoUpdater.on('download-progress', (progress) => {
    console.log(
      `RiZhi: update download ${progress.percent.toFixed(1)}%`
    );
    setUpdateState({
      status: 'downloading',
      progress: Number.isFinite(progress.percent) ? progress.percent : null,
      error: ''
    });
  });

  autoUpdater.on('update-downloaded', async (info) => {
    const versionLabel = formatVersionLabel(info.version);
    setUpdateState({ status: 'downloaded', version: info.version || '', progress: 100, error: '' });
    await dialog.showMessageBox(mainWindow || undefined, {
      type: 'info',
      title: '日织更新',
      message: `新版本 ${versionLabel} 已下载完成`,
      detail: '日织将重启并完成更新。',
      buttons: ['立即更新'],
      defaultId: 0,
      cancelId: 0,
      noLink: true
    });

    isQuitting = true;
    autoUpdater.quitAndInstall(false, true);
  });

  autoUpdater.on('error', (error) => {
    console.error('RiZhi updater error:', error);
    setUpdateState({
      status: 'error',
      progress: null,
      error: error && error.message ? error.message : '检查更新时出现未知错误。'
    });
  });

  void checkForAppUpdates('automatic');
}

function getUpdateState() {
  return {
    ...updateState,
    currentVersion: app.getVersion(),
    packaged: app.isPackaged
  };
}

function setUpdateState(nextState) {
  updateState = { ...updateState, ...nextState };
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('app:update-status', getUpdateState());
  }
}

async function checkForAppUpdates(source = 'manual') {
  if (!app.isPackaged) {
    setUpdateState({
      status: 'unavailable',
      version: '',
      progress: null,
      error: '当前为开发环境；请在安装版中检查版本更新。'
    });
    return getUpdateState();
  }
  if (updateCheckInFlight) return updateCheckInFlight;

  updateCheckSource = source;
  updateCheckInFlight = (async () => {
    setUpdateState({ status: 'checking', version: '', progress: null, error: '' });
    try {
      await autoUpdater.checkForUpdates();
      return getUpdateState();
    } catch (error) {
      console.error('RiZhi updater check error:', error);
      setUpdateState({
        status: 'error',
        progress: null,
        error: error && error.message ? error.message : '检查更新时出现未知错误。'
      });
      return getUpdateState();
    } finally {
      updateCheckInFlight = null;
      updateCheckSource = '';
    }
  })();
  return updateCheckInFlight;
}

async function downloadAppUpdate() {
  if (!app.isPackaged) {
    return checkForAppUpdates('manual');
  }
  if (updateState.status !== 'available') return getUpdateState();

  setUpdateState({ status: 'downloading', progress: 0, error: '' });
  try {
    await autoUpdater.downloadUpdate();
  } catch (error) {
    console.error('RiZhi updater download error:', error);
    setUpdateState({
      status: 'error',
      progress: null,
      error: error && error.message ? error.message : '下载更新时出现未知错误。'
    });
  }
  return getUpdateState();
}

function formatVersionLabel(version) {
  const text = String(version || '').trim();
  return text.startsWith('v') ? text : `v${text}`;
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();
  showFloatingTaskWindow();
  createTray();
  setupAutoUpdater();

  app.on('activate', () => {
    if (!mainWindow || mainWindow.isDestroyed()) createWindow();
    showMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (isQuitting && process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  isQuitting = true;
  for (const sessionId of mediaUploadSessions.keys()) {
    void closeMediaUploadSession(sessionId, { removeStaging: false });
  }
  if (asrService) void asrService.dispose();
});

function createTray() {
  if (tray) return;

  tray = new Tray(createTrayIcon());
  tray.setToolTip('日织');
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: '打开日织',
      click: showMainWindow
    },
    {
      label: '退出',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]));
  tray.on('click', showMainWindow);
  tray.on('double-click', showMainWindow);
  tray.on('balloon-click', showMainWindow);
}

function createTrayIcon() {
  const image = nativeImage.createFromPath(appIconPath);
  return image.isEmpty() ? nativeImage.createEmpty() : image.resize({ width: 16, height: 16 });
}

function resolveAppAssetPath(fileName) {
  const candidates = [
    path.join(__dirname, fileName),
    path.join(process.resourcesPath || '', fileName)
  ];

  return candidates.find((candidate) => candidate && fsSync.existsSync(candidate)) || candidates[0];
}

function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow();
  }

  mainWindow.show();
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.focus();
}

function hideMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.hide();
  showFloatingTaskWindow();
}

function createFloatingTaskWindow() {
  if (floatingTaskWindow && !floatingTaskWindow.isDestroyed()) return floatingTaskWindow;

  const display = mainWindow && !mainWindow.isDestroyed()
    ? screen.getDisplayMatching(mainWindow.getBounds())
    : screen.getPrimaryDisplay();
  const workArea = display.workArea;
  const width = 252;
  const height = 124;
  const margin = 24;

  floatingTaskWindow = new BrowserWindow({
    width,
    height,
    x: workArea.x + workArea.width - width - margin,
    y: workArea.y + workArea.height - height - margin,
    minWidth: width,
    minHeight: height,
    maxWidth: width,
    maxHeight: 420,
    frame: false,
    transparent: true,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    alwaysOnTop: floatingTaskAlwaysOnTop,
    title: '日织 · 当前任务',
    icon: appIconPath,
    webPreferences: {
      preload: path.join(__dirname, 'floatingTaskPreload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false
    }
  });
  applyFloatingTaskAlwaysOnTop();
  floatingTaskWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  floatingTaskWindow.loadFile(path.join(__dirname, 'src', 'floating-task.html'));
  floatingTaskWindow.webContents.on('did-finish-load', () => {
    floatingTaskWindowReady = true;
    sendFloatingTaskUpdate();
    sendPendingFloatingTaskFlashes();
  });
  floatingTaskWindow.on('closed', () => {
    floatingTaskWindow = null;
    floatingTaskWindowReady = false;
  });
  floatingTaskWindow.on('moved', scheduleFloatingTaskDockCheck);
  floatingTaskWindow.on('focus', () => {
    // Windows may deliver a click on the narrow dock tab to the native drag region
    // before the renderer button receives it. Focusing the docked window is therefore
    // also treated as an explicit request to reveal it.
    if (floatingTaskDockEdge) expandFloatingTaskWindow();
  });
  floatingTaskWindow.on('blur', () => {
    if (floatingTaskAlwaysOnTop) applyFloatingTaskAlwaysOnTop();
  });
  return floatingTaskWindow;
}

function applyFloatingTaskAlwaysOnTop() {
  if (!floatingTaskWindow || floatingTaskWindow.isDestroyed()) return;
  floatingTaskWindow.setAlwaysOnTop(floatingTaskAlwaysOnTop, floatingTaskAlwaysOnTop ? 'screen-saver' : 'normal');
  if (floatingTaskAlwaysOnTop) floatingTaskWindow.moveTop();
}

function showFloatingTaskWindow() {
  if (isQuitting) return;
  const window = createFloatingTaskWindow();
  window.showInactive();
  applyFloatingTaskAlwaysOnTop();
  sendFloatingTaskUpdate();
}

function hideFloatingTaskWindow() {
  if (!floatingTaskWindow || floatingTaskWindow.isDestroyed()) return;
  floatingTaskWindow.hide();
}

function scheduleFloatingTaskDockCheck() {
  if (Date.now() < floatingTaskPositionIgnoreUntil) return;
  clearTimeout(floatingTaskDockTimer);
  floatingTaskDockTimer = setTimeout(dockFloatingTaskIfNearEdge, 260);
}

function dockFloatingTaskIfNearEdge() {
  if (!floatingTaskWindow || floatingTaskWindow.isDestroyed()) return;
  const bounds = floatingTaskWindow.getBounds();
  const display = screen.getDisplayMatching(bounds);
  const area = display.workArea;
  const areaRight = area.x + area.width;
  const areaBottom = area.y + area.height;
  const overflows = {
    left: Math.max(0, area.x - bounds.x),
    right: Math.max(0, bounds.x + bounds.width - areaRight),
    top: Math.max(0, area.y - bounds.y),
    bottom: Math.max(0, bounds.y + bounds.height - areaBottom)
  };
  const hiddenEdge = Object.entries(overflows)
    .filter(([, amount]) => amount > 0)
    .sort(([, first], [, second]) => second - first)[0];

  if (hiddenEdge) {
    floatingTaskDockEdge = hiddenEdge[0];
    floatingTaskDockDisplayId = display.id;
    setFloatingTaskDockedPosition();
    sendFloatingTaskUpdate();
    return;
  }

  floatingTaskDockEdge = '';
  floatingTaskDockDisplayId = null;
  const snapDistance = 24;
  const leftGap = bounds.x - area.x;
  const rightGap = areaRight - (bounds.x + bounds.width);
  const topGap = bounds.y - area.y;
  const bottomGap = areaBottom - (bounds.y + bounds.height);
  let x = bounds.x;
  let y = bounds.y;
  if (leftGap <= snapDistance) x = area.x;
  else if (rightGap <= snapDistance) x = areaRight - bounds.width;
  if (topGap <= snapDistance) y = area.y;
  else if (bottomGap <= snapDistance) y = areaBottom - bounds.height;
  if (x !== bounds.x || y !== bounds.y) setFloatingTaskPosition(x, y);
  sendFloatingTaskUpdate();
}

function setFloatingTaskDockedPosition() {
  if (!floatingTaskWindow || floatingTaskWindow.isDestroyed() || !floatingTaskDockEdge) return;
  const bounds = floatingTaskWindow.getBounds();
  const display = screen.getAllDisplays().find((item) => item.id === floatingTaskDockDisplayId)
    || screen.getDisplayMatching(bounds);
  const area = display.workArea;
  const tabSize = 18;
  const next = {
    x: Math.min(Math.max(bounds.x, area.x), area.x + area.width - bounds.width),
    y: Math.min(Math.max(bounds.y, area.y), area.y + area.height - bounds.height)
  };
  if (floatingTaskDockEdge === 'left') next.x = area.x - bounds.width + tabSize;
  if (floatingTaskDockEdge === 'right') next.x = area.x + area.width - tabSize;
  if (floatingTaskDockEdge === 'top') next.y = area.y - bounds.height + tabSize;
  if (floatingTaskDockEdge === 'bottom') next.y = area.y + area.height - tabSize;
  setFloatingTaskPosition(next.x, next.y);
}

function expandFloatingTaskWindow({ preserveDock = false } = {}) {
  if (!floatingTaskWindow || floatingTaskWindow.isDestroyed() || !floatingTaskDockEdge) return;
  const bounds = floatingTaskWindow.getBounds();
  const display = screen.getAllDisplays().find((item) => item.id === floatingTaskDockDisplayId)
    || screen.getDisplayMatching(bounds);
  const area = display.workArea;
  let x = bounds.x;
  let y = bounds.y;
  if (floatingTaskDockEdge === 'left') x = area.x;
  if (floatingTaskDockEdge === 'right') x = area.x + area.width - bounds.width;
  if (floatingTaskDockEdge === 'top') y = area.y;
  if (floatingTaskDockEdge === 'bottom') y = area.y + area.height - bounds.height;
  setFloatingTaskPosition(x, y);
  if (!preserveDock) {
    floatingTaskDockEdge = '';
    floatingTaskDockDisplayId = null;
  }
  sendFloatingTaskUpdate();
}

function setFloatingTaskPosition(x, y) {
  if (!floatingTaskWindow || floatingTaskWindow.isDestroyed()) return;
  floatingTaskPositionIgnoreUntil = Date.now() + 600;
  floatingTaskWindow.setPosition(Math.round(x), Math.round(y));
}

function sendFloatingTaskUpdate() {
  if (!floatingTaskWindow || floatingTaskWindow.isDestroyed() || floatingTaskWindow.webContents.isDestroyed()) return;
  floatingTaskWindow.webContents.send('floating-task:update', {
    ...(floatingTaskPayload || {}),
    alwaysOnTop: floatingTaskAlwaysOnTop,
    docked: Boolean(floatingTaskDockEdge),
    dockEdge: floatingTaskDockEdge
  });
}

function flashFloatingTaskWindow() {
  if (isQuitting) return;
  const window = createFloatingTaskWindow();
  pendingFloatingTaskFlashes += 1;
  const shouldRedock = Boolean(floatingTaskDockEdge);
  if (shouldRedock) expandFloatingTaskWindow({ preserveDock: true });
  window.showInactive();
  applyFloatingTaskAlwaysOnTop();
  sendFloatingTaskUpdate();
  sendPendingFloatingTaskFlashes();

  clearTimeout(floatingTaskFlashTimer);
  floatingTaskFlashTimer = null;
  if (shouldRedock) {
    floatingTaskFlashTimer = setTimeout(() => {
      floatingTaskFlashTimer = null;
      setFloatingTaskDockedPosition();
    }, 6700);
  }
}

function sendPendingFloatingTaskFlashes() {
  if (!floatingTaskWindowReady || !floatingTaskWindow || floatingTaskWindow.isDestroyed() || pendingFloatingTaskFlashes === 0) return;
  const flashes = pendingFloatingTaskFlashes;
  pendingFloatingTaskFlashes = 0;
  floatingTaskWindow.webContents.send('floating-task:flash', { times: flashes * 5 });
}

function showDesktopReminder(payload = {}) {
  reminderQueue.push(payload);
  if (!isReminderShowing) {
    showNextDesktopReminder();
  }
}

function showNextDesktopReminder() {
  const payload = reminderQueue.shift();
  if (!payload) {
    isReminderShowing = false;
    return;
  }

  isReminderShowing = true;
  displayDesktopReminder(payload);
}

function displayDesktopReminder(payload = {}) {
  const title = escapeHtml(payload.title || '日织提醒');
  const body = escapeHtml(payload.body || '');
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;
  const { x, y } = display.workArea;
  const windowWidth = 360;
  const windowHeight = 128;
  const margin = 18;

  if (reminderWindow && !reminderWindow.isDestroyed()) {
    reminderWindow.close();
  }

  reminderWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: x + width - windowWidth - margin,
    y: y + height - windowHeight - margin,
    frame: false,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    focusable: true,
    backgroundColor: '#00000000',
    transparent: true,
    webPreferences: {
      backgroundThrottling: false
    }
  });

  reminderWindow.setAlwaysOnTop(true, 'screen-saver');
  reminderWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  reminderWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(createReminderHtml(title, body))}`);
  reminderWindow.webContents.once('did-finish-load', () => {
    if (!reminderWindow || reminderWindow.isDestroyed()) return;
    reminderWindow.setAlwaysOnTop(true, 'screen-saver');
    reminderWindow.showInactive();
    reminderWindow.moveTop();
  });
  reminderWindow.on('closed', () => {
    reminderWindow = null;
    clearTimeout(reminderCloseTimer);
    reminderCloseTimer = null;
    setTimeout(showNextDesktopReminder, 450);
  });

  clearTimeout(reminderCloseTimer);
  reminderCloseTimer = setTimeout(() => {
    if (reminderWindow && !reminderWindow.isDestroyed()) {
      reminderWindow.close();
    }
  }, 10000);
}

function createReminderHtml(title, body) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      margin: 0;
      overflow: hidden;
      background: transparent;
      font-family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif;
      color: #18212b;
    }
    button {
      width: 100%;
      height: 100%;
      padding: 16px 18px;
      border: 1px solid #bed8ca;
      border-left: 6px solid #1f7a57;
      border-radius: 12px;
      background: #f2fbf6;
      box-shadow: 0 18px 45px rgba(19, 35, 49, 0.18);
      text-align: left;
      color: inherit;
      cursor: pointer;
    }
    strong {
      display: block;
      font-size: 17px;
      line-height: 1.35;
      margin-bottom: 8px;
    }
    p {
      margin: 0;
      font-size: 15px;
      line-height: 1.5;
      color: #405062;
    }
  </style>
</head>
<body>
  <button onclick="window.close()" title="点击关闭提醒">
    <strong>${title}</strong>
    <p>${body}</p>
  </button>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function configureMicrophonePermissionPolicy(window) {
  const session = window.webContents.session;
  const isCurrentMainWindow = (webContents) => (
    Boolean(mainWindow) && !mainWindow.isDestroyed() && webContents === mainWindow.webContents
  );

  // Allow only this local top-level window to ask for audio input. This keeps
  // Electron's default broad permission behavior from applying to other media.
  session.setPermissionCheckHandler((webContents, permission, _origin, details) => (
    permission === 'media' && details && details.mediaType === 'audio' && isCurrentMainWindow(webContents)
  ));
  session.setPermissionRequestHandler((webContents, permission, callback, details) => {
    const mediaTypes = details && Array.isArray(details.mediaTypes) ? details.mediaTypes : [];
    callback(permission === 'media' && mediaTypes.length === 1 && mediaTypes[0] === 'audio' && isCurrentMainWindow(webContents));
  });
}

function getAsrService() {
  if (asrService) return asrService;

  // Development builds use the regular user-data model directory by default.
  // A separate development model can still be selected explicitly with
  // RIZHI_ASR_MODEL_DIR; silently preferring a project-local directory made the
  // settings screen report a model as installed after the downloaded copy had
  // been removed.
  const modelManager = createAsrModelManager({ app });
    asrService = createAsrService({ app, modelManager });
    asrService.on('partial-result', (payload) => sendAsrEvent('asr:partial', payload));
    asrService.on('final-result', (payload) => sendAsrEvent('asr:final', payload));
    asrService.on('vad-state', (payload) => sendAsrEvent('asr:vad', payload));
    asrService.on('recording-limit', (payload) => sendAsrEvent('asr:limit', payload));
    asrService.on('asr-error', (error) => sendAsrEvent('asr:error', serializeAsrError(error)));
  return asrService;
}

function sendAsrEvent(channel, payload) {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.webContents.send(channel, payload);
}

function isMainWindowSender(event) {
  return Boolean(mainWindow) && !mainWindow.isDestroyed() && event.sender === mainWindow.webContents;
}

function isFloatingTaskWindowSender(event) {
  return Boolean(floatingTaskWindow) && !floatingTaskWindow.isDestroyed() && event.sender === floatingTaskWindow.webContents;
}

ipcMain.on('floating-task:update', (event, payload = {}) => {
  if (!isMainWindowSender(event)) return;
  const categoryColor = String(payload.categoryColor || '').trim();
  floatingTaskPayload = {
    active: Boolean(payload.active),
    title: String(payload.title || '').slice(0, 120),
    timeRange: String(payload.timeRange || '').slice(0, 48),
    details: String(payload.details || '').slice(0, 300),
    state: String(payload.state || 'idle').slice(0, 24),
    stateLabel: String(payload.stateLabel || '').slice(0, 32),
    countdownLabel: String(payload.countdownLabel || '').slice(0, 32),
    countdown: String(payload.countdown || '').slice(0, 16),
    categoryColor: /^#[0-9a-f]{6}$/i.test(categoryColor) ? categoryColor : '#8b98a0'
  };
  sendFloatingTaskUpdate();
});

ipcMain.on('floating-task:open-main', (event) => {
  if (!isFloatingTaskWindowSender(event)) return;
  showMainWindow();
});

ipcMain.on('floating-task:expand', (event) => {
  if (!isFloatingTaskWindowSender(event)) return;
  expandFloatingTaskWindow();
});

ipcMain.on('floating-task:resize', (event, requestedSize = {}) => {
  if (!isFloatingTaskWindowSender(event) || !floatingTaskWindow || floatingTaskWindow.isDestroyed()) return;
  const width = Math.max(252, Math.min(252, Math.round(Number(requestedSize.width) || 252)));
  const height = Math.max(124, Math.min(420, Math.round(Number(requestedSize.height) || 124)));
  const bounds = floatingTaskWindow.getBounds();
  if (bounds.width === width && bounds.height === height) return;
  floatingTaskWindow.setContentSize(width, height);
  if (floatingTaskDockEdge && !floatingTaskFlashTimer) {
    setFloatingTaskDockedPosition();
    return;
  }
  const display = screen.getDisplayMatching(floatingTaskWindow.getBounds());
  const area = display.workArea;
  const resizedBounds = floatingTaskWindow.getBounds();
  setFloatingTaskPosition(
    Math.min(Math.max(resizedBounds.x, area.x), area.x + area.width - resizedBounds.width),
    Math.min(Math.max(resizedBounds.y, area.y), area.y + area.height - resizedBounds.height)
  );
});

ipcMain.on('floating-task:toggle-topmost', (event) => {
  if (!isFloatingTaskWindowSender(event)) return;
  floatingTaskAlwaysOnTop = !floatingTaskAlwaysOnTop;
  applyFloatingTaskAlwaysOnTop();
  sendFloatingTaskUpdate();
});

ipcMain.on('floating-task:flash', (event) => {
  if (!isMainWindowSender(event)) return;
  flashFloatingTaskWindow();
});

function serializeAsrError(error) {
  return {
    code: error && error.code ? error.code : 'ASR_ERROR',
    message: error && error.message ? error.message : '语音识别出现未知错误。'
  };
}

function createAsrIpcResponse(action, { allowPathChange = false } = {}) {
  return async (event) => {
    if (!isMainWindowSender(event)) {
      return { ok: false, error: { code: 'ASR_IPC_DENIED', message: '不允许的 ASR IPC 请求。' } };
    }
    try {
      if (asrPathChangeInProgress && !allowPathChange) {
        return { ok: false, error: { code: 'ASR_MODEL_BUSY', message: '模型路径正在更改，请稍后使用。' } };
      }
      const result = await action(getAsrService());
      return { ok: true, ...result };
    } catch (error) {
      return { ok: false, error: serializeAsrError(error) };
    }
  };
}

ipcMain.handle('system:getTime', () => {
  const now = new Date();
  return {
    iso: now.toISOString(),
    local: now.toLocaleString('zh-CN', { hour12: false }),
    timestamp: now.getTime()
  };
});

ipcMain.handle('app:getIconUrl', () => {
  return pathToFileURL(appUiIconPath).toString();
});

ipcMain.handle('app:getVersion', () => {
  return app.getVersion();
});

ipcMain.handle('app:getUpdateStatus', (event) => {
  if (!isMainWindowSender(event)) return { status: 'error', error: '不允许的更新状态请求。' };
  return getUpdateState();
});

ipcMain.handle('app:checkForUpdates', async (event) => {
  if (!isMainWindowSender(event)) return { status: 'error', error: '不允许的更新检查请求。' };
  return checkForAppUpdates('manual');
});

ipcMain.handle('app:downloadUpdate', async (event) => {
  if (!isMainWindowSender(event)) return { status: 'error', error: '不允许的更新下载请求。' };
  return downloadAppUpdate();
});

ipcMain.handle('media:startUploadSession', async (event, payload = {}) => {
  if (!isMainWindowSender(event)) return mediaError('MEDIA_IPC_DENIED', '不允许的媒体上传请求。');
  try {
    return await startMediaUploadSession(payload.date);
  } catch (error) {
    console.error('RiZhi media upload session error:', error);
    return mediaError('MEDIA_SESSION_ERROR', error.message || '无法创建手机上传通道。');
  }
});

ipcMain.handle('media:confirmUpload', async (event, payload = {}) => {
  if (!isMainWindowSender(event)) return mediaError('MEDIA_IPC_DENIED', '不允许的媒体上传请求。');
  try {
    return await confirmMediaUpload(payload.sessionId, payload.date, payload.entries);
  } catch (error) {
    console.error('RiZhi media confirmation error:', error);
    return mediaError('MEDIA_CONFIRM_ERROR', error.message || '媒体归档失败。');
  }
});

ipcMain.handle('media:cancelUpload', async (event, sessionId) => {
  if (!isMainWindowSender(event)) return mediaError('MEDIA_IPC_DENIED', '不允许的媒体上传请求。');
  await closeMediaUploadSession(String(sessionId || ''), { removeStaging: true });
  return { ok: true };
});

ipcMain.handle('media:deleteForDates', async (event, dates = []) => {
  if (!isMainWindowSender(event)) return mediaError('MEDIA_IPC_DENIED', '不允许删除媒体文件。');
  const selectedDates = [...new Set(Array.isArray(dates) ? dates.map((date) => String(date || '')) : [])];
  if (selectedDates.length === 0 || selectedDates.some((date) => !isValidMediaDate(date))) {
    return mediaError('MEDIA_INVALID_DATE', '日期无效。');
  }
  const paths = await getStoragePaths(app);
  for (const date of selectedDates) {
    const directory = path.join(paths.mediaDirectory, date.slice(0, 7), date);
    await fs.rm(directory, { recursive: true, force: true });
    const legacyDirectory = path.join(paths.dataDirectory, 'images', date.slice(0, 7), date);
    if (path.resolve(legacyDirectory) !== path.resolve(directory)) {
      await fs.rm(legacyDirectory, { recursive: true, force: true });
    }
  }
  return { ok: true, dates: selectedDates };
});

ipcMain.handle('media:deleteItems', async (event, mediaItems = []) => {
  if (!isMainWindowSender(event)) return mediaError('MEDIA_IPC_DENIED', '不允许删除媒体文件。');
  const items = Array.isArray(mediaItems) ? mediaItems.filter((item) => item && typeof item === 'object') : [];
  if (items.length === 0) return mediaError('MEDIA_INVALID_ITEMS', '没有可删除的附件。');

  let removedCount = 0;
  for (const item of items) {
    const mediaRoot = String(item.mediaRoot || '');
    const paths = [item.sourcePath, item.previewPath, item.thumbnailPath, item.motionSourcePath, item.motionPreviewPath]
      .map((value) => String(value || ''))
      .filter(Boolean);
    for (const relativePath of [...new Set(paths)]) {
      try {
        const filePath = await resolveStoredMediaPath(relativePath, mediaRoot);
        await fs.rm(filePath, { force: true });
        removedCount += 1;
      } catch {
        // The record still needs to be removed when one derivative file is already absent.
      }
    }
  }
  return { ok: true, removedCount };
});

ipcMain.handle('media:repairLive', async (event, media = {}) => {
  if (!isMainWindowSender(event)) return mediaError('MEDIA_IPC_DENIED', '不允许修复媒体文件。');
  try {
    return await repairStoredLiveMedia(media);
  } catch (error) {
    return mediaError('MEDIA_REPAIR_ERROR', error.message || '无法修复实况照片。');
  }
});

ipcMain.handle('media:openDirectory', async (event) => {
  if (!isMainWindowSender(event)) return mediaError('MEDIA_IPC_DENIED', '不允许打开媒体文件夹。');
  const paths = await getStoragePaths(app);
  await fs.mkdir(paths.mediaDirectory, { recursive: true });
  const error = await shell.openPath(paths.mediaDirectory);
  return { ok: !error, error, paths };
});

ipcMain.handle('media:getFileUrl', async (event, relativePath, mediaRoot) => {
  if (!isMainWindowSender(event)) return mediaError('MEDIA_IPC_DENIED', '不允许读取媒体文件。');
  try {
    const mediaPath = await resolveStoredMediaPath(relativePath, mediaRoot);
    return { ok: true, url: pathToFileURL(mediaPath).toString() };
  } catch (error) {
    return mediaError('MEDIA_FILE_NOT_FOUND', '媒体文件不存在或无法读取。');
  }
});

function mediaError(code, message) {
  return { ok: false, error: { code, message } };
}

function isValidMediaDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));
}

async function startMediaUploadSession(date) {
  if (!isValidMediaDate(date)) throw new Error('请先选择有效的记录日期。');

  for (const existingSession of mediaUploadSessions.values()) {
    await closeMediaUploadSession(existingSession.id, { removeStaging: true });
  }

  const paths = await getStoragePaths(app);
  const sessionId = crypto.randomUUID();
  const token = crypto.randomBytes(24).toString('base64url');
  const stagingDirectory = path.join(paths.dataDirectory, '.upload-staging', sessionId);
  await fs.mkdir(stagingDirectory, { recursive: true });

  const session = {
    id: sessionId,
    token,
    date,
    stagingDirectory,
    items: [],
    server: null,
    diagnostics: null,
    networkEvents: [],
    expiresAt: Date.now() + 15 * 60 * 1000,
    expiryTimer: null
  };
  const server = http.createServer((request, response) => {
    void handleMediaUploadRequest(session, request, response);
  });
  server.on('connection', (socket) => {
    recordMediaNetworkEvent(session, 'tcp-connection', {
      remoteAddress: socket.remoteAddress || '',
      remotePort: socket.remotePort || 0
    });
  });
  server.on('clientError', (error, socket) => {
    recordMediaNetworkEvent(session, 'client-error', {
      remoteAddress: socket && socket.remoteAddress ? socket.remoteAddress : '',
      error: error.message
    });
  });
  session.server = server;
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '0.0.0.0', () => {
      server.off('error', reject);
      resolve();
    });
  });

  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 0;
  const candidates = getLanAddressCandidates();
  const selectedCandidate = findLanAddress(candidates);
  const host = selectedCandidate.address;
  if (!host || !port) {
    await closeServer(server);
    throw new Error('没有发现可供手机访问的局域网地址，请确认电脑已连接 Wi-Fi 或有线网络。');
  }

  session.uploadUrl = `http://${host}:${port}/upload/${token}`;
  mediaUploadSessions.set(sessionId, session);
  const loopback = await probeMediaUploadServer(port, `/upload/${token}`);
  session.diagnostics = {
    listenAddress: '0.0.0.0',
    port,
    selectedAddress: host,
    selectedInterface: selectedCandidate.name,
    selectedReason: selectedCandidate.reason,
    candidates,
    loopback
  };
  session.qrDataUrl = await QRCode.toDataURL(session.uploadUrl, {
    width: 360,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: { dark: '#18212b', light: '#ffffff' }
  });
  session.expiryTimer = setTimeout(() => {
    void closeMediaUploadSession(sessionId, { removeStaging: true });
    sendMediaUploadEvent('media:sessionExpired', { sessionId });
  }, 15 * 60 * 1000);
  return {
    ok: true,
    sessionId,
    uploadUrl: session.uploadUrl,
    qrDataUrl: session.qrDataUrl,
    expiresAt: session.expiresAt,
    diagnostics: session.diagnostics,
    networkEvents: session.networkEvents
  };
}

function getLanAddressCandidates() {
  return Object.entries(os.networkInterfaces()).flatMap(([name, items]) => (items || [])
    .filter((item) => item && item.family === 'IPv4' && !item.internal)
    .map((item) => {
      const normalizedName = name.toLowerCase();
      const isVirtualOrVpn = /(vpn|tap|tun|wintun|tailscale|zerotier|vmware|virtual|v-ethernet|hyper-v)/.test(normalizedName);
      const isPhysical = /(wi-?fi|wlan|wireless|ethernet|以太网|本地连接)/.test(normalizedName);
      return {
      name,
      address: item.address,
      netmask: item.netmask,
      mac: item.mac,
      private: /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(item.address),
      isVirtualOrVpn,
      isPhysical
      };
    }));
}

function findLanAddress(candidates = getLanAddressCandidates()) {
  const ranked = [...candidates].sort((left, right) => candidateRank(left) - candidateRank(right));
  const selected = ranked[0] || { address: '', name: '', reason: '未发现可用 IPv4 地址。' };
  return {
    ...selected,
    reason: selected.isPhysical ? '优先选择物理 Wi‑Fi/以太网网卡。' : selected.isVirtualOrVpn ? '未发现物理局域网网卡，使用 VPN/虚拟网卡。' : '使用首个可用 IPv4 网卡。'
  };
}

function candidateRank(item) {
  if (item.private && item.isPhysical) return 0;
  if (item.private && !item.isVirtualOrVpn) return 1;
  if (item.private) return 2;
  if (item.isPhysical) return 3;
  return 4;
}

function probeMediaUploadServer(port, requestPath) {
  const startedAt = Date.now();
  return new Promise((resolve) => {
    const request = http.get({ host: '127.0.0.1', port, path: requestPath, timeout: 3000 }, (response) => {
      response.resume();
      resolve({ ok: response.statusCode === 200, statusCode: response.statusCode || 0, durationMs: Date.now() - startedAt });
    });
    request.once('timeout', () => request.destroy(new Error('本机回环测试超时。')));
    request.once('error', (error) => resolve({ ok: false, statusCode: 0, durationMs: Date.now() - startedAt, error: error.message }));
  });
}

function recordMediaNetworkEvent(session, type, details = {}) {
  const event = { type, at: new Date().toISOString(), ...details };
  session.networkEvents.push(event);
  if (session.networkEvents.length > 30) session.networkEvents.shift();
  console.log('RiZhi media network:', event);
  sendMediaUploadEvent('media:networkEvent', { sessionId: session.id, event });
}

async function handleMediaUploadRequest(session, request, response) {
  const expectedPath = `/upload/${session.token}`;
  recordMediaNetworkEvent(session, 'http-request', {
    method: request.method || '',
    path: request.url || '',
    remoteAddress: request.socket.remoteAddress || '',
    userAgent: String(request.headers['user-agent'] || '').slice(0, 160)
  });
  if (Date.now() > session.expiresAt) {
    recordMediaNetworkEvent(session, 'response', { statusCode: 410, reason: 'expired' });
    return sendUploadResponse(response, 410, '上传二维码已过期，请回到电脑端重新生成。');
  }
  if (request.url !== expectedPath) {
    recordMediaNetworkEvent(session, 'response', { statusCode: 404, reason: 'path-mismatch' });
    return sendUploadResponse(response, 404, '未找到上传页面。');
  }

  if (request.method === 'GET') {
    recordMediaNetworkEvent(session, 'page-served', { statusCode: 200, remoteAddress: request.socket.remoteAddress || '' });
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(createMobileUploadPage());
    return;
  }
  if (request.method !== 'POST') return sendUploadResponse(response, 405, '仅支持上传请求。');

  try {
    const files = await readMultipartUpload(request);
    if (files.length === 0) throw new Error('没有检测到可上传的照片或视频。');
    const uploadedItems = await stageMobileMediaFiles(session, files);
    sendMediaUploadEvent('media:uploaded', { sessionId: session.id, items: uploadedItems });
    sendUploadResponse(response, 200, `已传送 ${uploadedItems.length} 个内容。请回到电脑端填写注释并确认保存。`, true);
  } catch (error) {
    console.error('RiZhi mobile media upload error:', error);
    sendUploadResponse(response, 400, error.message || '上传失败，请重试。');
  }
}

function createMobileUploadPage() {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>日织 · 上传照片</title>
  <style>
    body{margin:0;padding:28px 20px;background:#f4f6f8;color:#18212b;font-family:-apple-system,BlinkMacSystemFont,"Microsoft YaHei",sans-serif}
    main{max-width:440px;margin:auto;padding:24px;border-radius:16px;background:#fff;box-shadow:0 12px 36px rgba(24,33,43,.12)}
    h1{margin:0 0 8px;font-size:22px}p{margin:0;color:#53606d;line-height:1.7}input{display:none}.guides{display:grid;gap:10px;margin-top:16px}.guide{padding:12px;border:1px solid #dce4ea;border-radius:10px;background:#fbfcfd}.guide strong{display:block;margin-bottom:4px;color:#334554;font-size:14px}.guide p{font-size:13px}.guide em{font-style:normal;color:#176a47;font-weight:700}button{width:100%;min-height:50px;margin-top:14px;border:0;border-radius:10px;background:#1f7a57;color:#fff;font:inherit;font-weight:700}button:disabled{opacity:.55}.secondary{border:1px solid #91b3a5;background:#f4fbf7;color:#176a47}.status{min-height:24px;margin-top:14px;color:#53606d;text-align:center;font-size:14px}
  </style>
</head>
<body>
  <main>
    <h1>上传到日织</h1>
    <p>一次可选择多张图片、动态照片、实况照片或视频。上传后可在电脑端逐项添加注释。</p>
    <div class="guides">
      <section class="guide"><strong>Android 上传指引</strong><p>点击“选择内容”会直接打开系统相册，可一次多选照片和视频。动态照片请优先选择相册里的原始内容，不要选择微信、QQ 等应用生成的副本；若相册只提供静态图，可从系统菜单切换到<em>文件管理</em>，选择 DCIM/Camera 中的原文件。</p></section>
      <section class="guide"><strong>iPhone 上传指引</strong><p>普通图片和视频可从照片选择。实况照片请先导出“未修改的原件/所有照片数据”到<em>文件</em>，再一次选中同名图片和 MOV；若系统只提供 JPEG，将只能作为静态图片上传。</p></section>
    </div>
    <input id="files" type="file" multiple accept="image/*,video/*,.heic,.heif,.avif,.mov,.m4v,.mkv,.avi,.3gp">
    <button id="choose" class="secondary" type="button">选择内容</button>
    <button id="submit" type="button" disabled>上传到电脑</button>
    <div id="status" class="status" role="status">尚未选择内容</div>
  </main>
  <script>
    const files=document.querySelector('#files'),choose=document.querySelector('#choose'),submit=document.querySelector('#submit'),status=document.querySelector('#status');
    choose.addEventListener('click',()=>{files.value='';files.click()});
    files.addEventListener('change',()=>{const count=files.files.length;submit.disabled=!count;status.textContent=count?'已选择 '+count+' 个文件，可点击“上传到电脑”。':'尚未选择内容'});
    submit.addEventListener('click',async()=>{const chosen=Array.from(files.files||[]);if(!chosen.length){status.textContent='请先选择至少一个内容。';return}submit.disabled=true;choose.disabled=true;status.textContent='正在上传，请不要关闭此页面…';try{const data=new FormData();chosen.forEach(file=>data.append('files',file,file.name));const response=await fetch(location.href,{method:'POST',body:data});status.textContent=await response.text();if(response.ok){files.value='';}}catch(error){status.textContent='上传失败，请确认手机与电脑连接同一网络后重试。'}finally{choose.disabled=false;submit.disabled=!files.files.length}});
  </script>
</body>
</html>`;
}

function sendUploadResponse(response, statusCode, message, success = false) {
  response.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(message || (success ? '上传成功。' : '上传失败。'));
}

function readMultipartUpload(request) {
  return new Promise((resolve, reject) => {
    const contentType = String(request.headers['content-type'] || '');
    const boundaryMatch = contentType.match(/boundary=([^;]+)/i);
    if (!boundaryMatch) return reject(new Error('上传格式不正确，请重新选择内容。'));
    const chunks = [];
    let total = 0;
    request.on('data', (chunk) => {
      total += chunk.length;
      if (total > MEDIA_UPLOAD_MAX_BYTES) {
        request.destroy(new Error('单次上传不能超过 350 MB。'));
        return;
      }
      chunks.push(chunk);
    });
    request.on('error', reject);
    request.on('end', () => {
      try {
        resolve(parseMultipartFiles(Buffer.concat(chunks), boundaryMatch[1].replace(/^"|"$/g, '')));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function parseMultipartFiles(buffer, boundary) {
  const delimiter = Buffer.from(`--${boundary}`);
  const separator = Buffer.from(`\r\n--${boundary}`);
  const files = [];
  let cursor = buffer.indexOf(delimiter);
  while (cursor !== -1) {
    cursor += delimiter.length;
    if (buffer.subarray(cursor, cursor + 2).toString() === '--') break;
    if (buffer.subarray(cursor, cursor + 2).toString() === '\r\n') cursor += 2;
    const headerEnd = buffer.indexOf(Buffer.from('\r\n\r\n'), cursor);
    if (headerEnd === -1) break;
    const headers = buffer.subarray(cursor, headerEnd).toString('utf8');
    const next = buffer.indexOf(separator, headerEnd + 4);
    if (next === -1) break;
    const disposition = headers.match(/content-disposition:[^\r\n]*filename="([^"]*)"/i);
    if (disposition && disposition[1]) {
      const fieldName = (headers.match(/(?:^|;)\s*name="([^"]*)"/im) || [])[1] || 'files';
      const type = (headers.match(/content-type:\s*([^\r\n]+)/i) || [])[1] || '';
      files.push({ name: decodeUploadFilename(disposition[1]), fieldName, contentType: type.trim(), data: buffer.subarray(headerEnd + 4, next) });
    }
    cursor = next + 2;
  }
  return files;
}

function decodeUploadFilename(value) {
  try { return decodeURIComponent(value); } catch { return value; }
}

async function stageMobileMediaFiles(session, files) {
  const candidates = [];
  for (const file of files) {
    const extension = path.extname(file.name || '').toLowerCase();
    const kind = mediaKindForExtension(extension);
    if (!kind) continue;
    const id = crypto.randomUUID();
    const originalName = safeMediaFileName(file.name, extension);
    const storedName = `${id}${extension}`;
    const sourcePath = path.join(session.stagingDirectory, storedName);
    await fs.writeFile(sourcePath, file.data);
    candidates.push({ id, kind, originalName, extension, contentType: file.contentType, sourcePath, sourceName: storedName, size: file.data.length, uploadedAt: new Date().toISOString() });
  }
  if (candidates.length === 0) throw new Error('暂不支持所选文件格式。支持常见图片、动态图和视频格式。');

  const pairedIds = new Set();
  const result = [];
  for (const image of candidates.filter((item) => item.kind === 'image')) {
    const baseName = mediaBaseName(image.originalName);
    const motion = candidates.find((item) => item.kind === 'video'
      && !pairedIds.has(item.id)
      && mediaBaseName(item.originalName) === baseName);
    if (motion && isLivePhotoImage(image.extension)) {
      pairedIds.add(image.id);
      pairedIds.add(motion.id);
      result.push(await prepareLivePhotoMedia(session, image, motion));
    }
  }
  for (const item of candidates) {
    if (pairedIds.has(item.id)) continue;
    result.push(await prepareSingleMedia(session, item));
  }
  session.items.push(...result);
  return result.map(serializeStagedMedia);
}

function mediaKindForExtension(extension) {
  if (MEDIA_IMAGE_EXTENSIONS.has(extension)) return 'image';
  if (MEDIA_VIDEO_EXTENSIONS.has(extension)) return 'video';
  return '';
}

function isLivePhotoImage(extension) {
  return ['.heic', '.heif', '.jpg', '.jpeg'].includes(extension);
}

function mediaBaseName(name) {
  return path.basename(name, path.extname(name)).replace(/[\s_\-]+/g, '').toLowerCase();
}

function safeMediaFileName(name, extension) {
  const base = path.basename(String(name || 'media')).replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').replace(/\.+$/g, '') || 'media';
  return base.toLowerCase().endsWith(extension) ? base : `${base}${extension}`;
}

async function prepareSingleMedia(session, item) {
  const result = { ...item, files: [item] };
  if (item.kind === 'image') {
    const embeddedMotionPath = await extractAndroidMotionPhotoVideo(session, item);
    if (embeddedMotionPath) return prepareEmbeddedMotionPhotoMedia(session, item, embeddedMotionPath);
    result.previewPath = isBrowserImageExtension(item.extension) ? item.sourcePath : await createImagePreview(session, item.sourcePath, item.id);
    result.thumbnailPath = await createImageThumbnail(session, result.previewPath || item.sourcePath, item.id);
  } else {
    result.previewPath = await createVideoPreview(session, item.sourcePath, item.id);
    result.thumbnailPath = await createVideoThumbnail(session, item.sourcePath, item.id);
  }
  return result;
}

async function prepareEmbeddedMotionPhotoMedia(session, image, motionSourcePath) {
  const previewPath = isBrowserImageExtension(image.extension) ? image.sourcePath : await createImagePreview(session, image.sourcePath, image.id);
  return {
    ...image,
    kind: 'live',
    previewPath,
    thumbnailPath: await createImageThumbnail(session, previewPath || image.sourcePath, image.id),
    motionSourcePath,
    motionSourceName: path.basename(motionSourcePath),
    motionPreviewPath: await createVideoPreview(session, motionSourcePath, image.id),
    files: [image]
  };
}

async function extractAndroidMotionPhotoVideo(session, image) {
  if (!['.jpg', '.jpeg', '.heic', '.heif', '.avif'].includes(image.extension)) return '';
  let data;
  try {
    data = await fs.readFile(image.sourcePath);
  } catch {
    return '';
  }

  const video = extractEmbeddedMotionPhotoVideo(data);
  if (!video) return '';
  const target = stagedDerivativePath(session, image.id, 'embedded-motion.mp4');
  await fs.writeFile(target, video);
  return target;
}

function extractEmbeddedMotionPhotoVideo(data) {
  // Android Motion Photo stores an MP4 after the still image and describes it
  // in XMP. The fallback scan remains gated by the MotionPhoto/MicroVideo flag
  // so ordinary JPEG files are never mistaken for a video container.
  const metadata = data.subarray(0, Math.min(data.length, 2 * 1024 * 1024)).toString('latin1');
  if (!/(?:MotionPhoto|MicroVideo)\s*=\s*["']?1\b/i.test(metadata)) return null;
  const lengths = Array.from(metadata.matchAll(/(?:Item:|GContainer:)?(?:Item)?Length\s*=\s*["'](\d+)["']/gi))
    .map((match) => Number(match[1]))
    .filter((length) => Number.isFinite(length) && length > 1024 && length < data.length);
  const expectedLength = lengths.at(-1) || 0;
  const expectedStart = expectedLength ? data.length - expectedLength : -1;
  const hasExpectedMp4Header = expectedStart >= 0
    && data.subarray(expectedStart + 4, expectedStart + 8).toString('ascii') === 'ftyp';
  const scanFrom = expectedLength ? Math.max(0, expectedStart - 8192) : Math.max(0, data.length - 64 * 1024 * 1024);
  // Item:Length is the authoritative boundary for Android Motion Photo. Searching for the
  // last "ftyp" is unsafe: compressed MP4 payload bytes may coincidentally contain that text.
  const ftypOffset = hasExpectedMp4Header
    ? expectedStart + 4
    : data.indexOf(Buffer.from('ftyp'), scanFrom);
  if (ftypOffset < scanFrom || ftypOffset < 4) return null;
  const videoStart = hasExpectedMp4Header ? expectedStart : ftypOffset - 4;
  const video = data.subarray(videoStart);
  if (video.subarray(4, 8).toString('ascii') !== 'ftyp' || video.length < 1024) return null;
  return video;
}

async function prepareLivePhotoMedia(session, image, motion) {
  const id = crypto.randomUUID();
  const previewPath = isBrowserImageExtension(image.extension) ? image.sourcePath : await createImagePreview(session, image.sourcePath, id);
  return {
    id,
    kind: 'live',
    originalName: image.originalName,
    extension: image.extension,
    contentType: image.contentType,
    sourcePath: image.sourcePath,
    sourceName: image.sourceName,
    motionSourcePath: motion.sourcePath,
    motionSourceName: motion.sourceName,
    previewPath,
    motionPreviewPath: await createVideoPreview(session, motion.sourcePath, id),
    thumbnailPath: await createImageThumbnail(session, previewPath || image.sourcePath, id),
    size: image.size + motion.size,
    uploadedAt: new Date().toISOString(),
    files: [image, motion]
  };
}

function isBrowserImageExtension(extension) {
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.avif'].includes(extension);
}

function stagedDerivativePath(session, id, suffix) {
  return path.join(session.stagingDirectory, `${id}-${suffix}`);
}

async function createImagePreview(session, sourcePath, id) {
  const target = stagedDerivativePath(session, id, 'preview.jpg');
  return runFfmpeg(['-y', '-i', sourcePath, '-frames:v', '1', '-q:v', '2', target]).then(() => target).catch(() => '');
}

async function createImageThumbnail(session, sourcePath, id) {
  const target = stagedDerivativePath(session, id, 'thumb.jpg');
  return runFfmpeg(['-y', '-i', sourcePath, '-frames:v', '1', '-vf', 'scale=360:-2:force_original_aspect_ratio=decrease', '-q:v', '4', target]).then(() => target).catch(() => '');
}

async function createVideoPreview(session, sourcePath, id) {
  const target = stagedDerivativePath(session, id, 'preview.mp4');
  return transcodeVideoPreview(sourcePath, target).then(() => target).catch(() => '');
}

function transcodeVideoPreview(sourcePath, targetPath) {
  return runFfmpeg(['-y', '-i', sourcePath, '-map', '0:v:0', '-map', '0:a?', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-movflags', '+faststart', targetPath]);
}

async function repairStoredLiveMedia(media) {
  if (!media || media.kind !== 'live' || !media.sourcePath || !media.motionSourcePath) {
    return { ok: true, repaired: false };
  }
  const mediaRoot = String(media.mediaRoot || '');
  const sourcePath = await resolveStoredMediaPath(media.sourcePath, mediaRoot);
  const motionPath = await resolveStoredMediaPath(media.motionSourcePath, mediaRoot);
  const video = extractEmbeddedMotionPhotoVideo(await fs.readFile(sourcePath));
  if (!video) return { ok: true, repaired: false };

  const currentMotion = await fs.stat(motionPath);
  if (currentMotion.size >= video.length) return { ok: true, repaired: false };

  await fs.writeFile(motionPath, video);
  let previewRebuilt = false;
  if (media.motionPreviewPath) {
    try {
      const previewPath = await resolveStoredMediaPath(media.motionPreviewPath, mediaRoot);
      await transcodeVideoPreview(motionPath, previewPath);
      previewRebuilt = true;
    } catch {
      // Playback can still use the repaired original MP4 when a preview cannot be rebuilt.
    }
  }
  return { ok: true, repaired: true, previewRebuilt };
}

async function createVideoThumbnail(session, sourcePath, id) {
  const target = stagedDerivativePath(session, id, 'thumb.jpg');
  return runFfmpeg(['-y', '-ss', '0.1', '-i', sourcePath, '-frames:v', '1', '-vf', 'scale=360:-2:force_original_aspect_ratio=decrease', '-q:v', '4', target]).then(() => target).catch(() => '');
}

function getFfmpegPath() {
  if (!app.isPackaged) return ffmpegStaticPath;
  return path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules', 'ffmpeg-static', 'ffmpeg.exe');
}

function runFfmpeg(args) {
  const executable = getFfmpegPath();
  return new Promise((resolve, reject) => {
    const processHandle = spawn(executable, ['-hide_banner', '-loglevel', 'error', ...args], { windowsHide: true });
    let errors = '';
    processHandle.stderr.on('data', (chunk) => { errors += chunk.toString(); });
    processHandle.on('error', reject);
    processHandle.on('close', (code) => code === 0 ? resolve() : reject(new Error(errors || '媒体转换失败。')));
  });
}

function serializeStagedMedia(item) {
  return {
    id: item.id,
    kind: item.kind,
    originalName: item.originalName,
    contentType: item.contentType,
    size: item.size,
    uploadedAt: item.uploadedAt,
    previewUrl: item.previewPath ? pathToFileURL(item.previewPath).toString() : '',
    thumbnailUrl: item.thumbnailPath ? pathToFileURL(item.thumbnailPath).toString() : '',
    motionPreviewUrl: item.motionPreviewPath ? pathToFileURL(item.motionPreviewPath).toString() : ''
  };
}

async function confirmMediaUpload(sessionId, date, entries) {
  const session = mediaUploadSessions.get(String(sessionId || ''));
  if (!session) throw new Error('上传会话已结束，请重新扫描二维码。');
  if (!isValidMediaDate(date) || date !== session.date) throw new Error('上传日期与当前记录不一致，请重新开始上传。');
  const selection = new Map((Array.isArray(entries) ? entries : []).map((entry) => [String(entry.id || ''), String(entry.annotation || '').trim().slice(0, 1000)]));
  const selectedItems = session.items.filter((item) => selection.has(item.id));
  if (selectedItems.length === 0) throw new Error('请至少保留一项已上传内容。');

  const paths = await getStoragePaths(app);
  const month = date.slice(0, 7);
  const targetDirectory = path.join(paths.mediaDirectory, month, date);
  await fs.mkdir(targetDirectory, { recursive: true });
  const records = [];
  for (const item of selectedItems) {
    const base = `${Date.now()}-${item.id.slice(0, 8)}`;
    const sourceRelativePath = await moveMediaFile(item.sourcePath, targetDirectory, `${base}${item.extension}`);
    const previewRelativePath = item.previewPath && item.previewPath !== item.sourcePath
      ? await moveMediaFile(item.previewPath, targetDirectory, `${base}-preview${path.extname(item.previewPath)}`)
      : sourceRelativePath;
    const thumbnailRelativePath = item.thumbnailPath
      ? await moveMediaFile(item.thumbnailPath, targetDirectory, `${base}-thumb.jpg`)
      : '';
    const motionSourceRelativePath = item.motionSourcePath
      ? await moveMediaFile(item.motionSourcePath, targetDirectory, `${base}-motion${path.extname(item.motionSourcePath)}`)
      : '';
    const motionPreviewRelativePath = item.motionPreviewPath
      ? await moveMediaFile(item.motionPreviewPath, targetDirectory, `${base}-motion-preview.mp4`)
      : '';
    records.push({
      id: item.id,
      kind: item.kind,
      originalName: item.originalName,
      contentType: item.contentType,
      size: item.size,
      uploadedAt: item.uploadedAt,
      annotation: selection.get(item.id) || '',
      sourcePath: sourceRelativePath,
      mediaRoot: paths.mediaDirectory,
      previewPath: previewRelativePath,
      thumbnailPath: thumbnailRelativePath,
      motionSourcePath: motionSourceRelativePath,
      motionPreviewPath: motionPreviewRelativePath
    });
  }
  await closeMediaUploadSession(session.id, { removeStaging: true });
  return { ok: true, media: records };
}

async function moveMediaFile(sourcePath, targetDirectory, targetName) {
  if (!sourcePath) return '';
  try {
    await fs.access(sourcePath);
  } catch {
    return '';
  }
  const destination = path.join(targetDirectory, targetName);
  await fs.rename(sourcePath, destination);
  const paths = await getStoragePaths(app);
  return path.relative(paths.mediaDirectory, destination).split(path.sep).join('/');
}

async function resolveStoredMediaPath(relativePath, mediaRoot = '') {
  const normalized = String(relativePath || '').replace(/\\/g, '/');
  if (!normalized || normalized.startsWith('../') || normalized.includes('/../')) throw new Error('无效的媒体路径。');
  const paths = await getStoragePaths(app);
  const isLegacyPath = normalized.startsWith('images/');
  const storedRoot = mediaRoot && path.isAbsolute(mediaRoot) ? mediaRoot : '';
  const root = path.resolve(storedRoot || (isLegacyPath ? path.join(paths.dataDirectory, 'images') : paths.mediaDirectory));
  const relativeToRoot = isLegacyPath && storedRoot ? normalized.slice('images/'.length) : normalized;
  const fullPath = path.resolve(root, relativeToRoot);
  if (!fullPath.startsWith(`${root}${path.sep}`)) throw new Error('无效的媒体路径。');
  await fs.access(fullPath);
  return fullPath;
}

async function closeMediaUploadSession(sessionId, options = {}) {
  const session = mediaUploadSessions.get(sessionId);
  if (!session) return;
  mediaUploadSessions.delete(sessionId);
  clearTimeout(session.expiryTimer);
  await closeServer(session.server);
  if (options.removeStaging) {
    await fs.rm(session.stagingDirectory, { recursive: true, force: true }).catch(() => {});
  }
}

function closeServer(server) {
  if (!server || !server.listening) return Promise.resolve();
  return new Promise((resolve) => server.close(() => resolve()));
}

function sendMediaUploadEvent(channel, payload) {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.webContents.send(channel, payload);
}
ipcMain.handle('task:parseText', (event, payload = {}) => {
  if (!isMainWindowSender(event)) {
    return { ok: false, error: { code: 'TASK_PARSE_IPC_DENIED', message: '不允许的任务解析请求。' } };
  }

  return {
    ok: true,
    result: parseTaskTextList(payload.text, {
      referenceDate: payload.referenceDate,
      taskCategories: Array.isArray(payload.taskCategories) ? payload.taskCategories : []
    })
  };
});


ipcMain.handle('asr:initialize', createAsrIpcResponse(async (service) => {
  const result = await service.initialize();
  return {
    sampleRate: result.model.runtimeConfig.sampleRate,
    modelReady: result.model.isReady,
    state: result.state,
    cached: Boolean(result.cached)
  };
}));

ipcMain.handle('asr:modelStatus', createAsrIpcResponse(async (service) => (
  service.modelManager.getStatus()
), { allowPathChange: true }));

ipcMain.handle('asr:downloadModel', createAsrIpcResponse(async (service) => {
  const status = await service.modelManager.download((progress) => {
    sendAsrEvent('asr:model-status', progress);
  });
  sendAsrEvent('asr:model-status', status);
  return status;
}));

ipcMain.handle('asr:openModelDirectory', createAsrIpcResponse(async (service) => {
  const directory = service.modelManager.getDownloadDirectory();
  await fs.mkdir(directory, { recursive: true });
  const error = await shell.openPath(directory);
  return { opened: !error, directory, error };
}));

ipcMain.handle('asr:start', createAsrIpcResponse(async (service) => {
  const result = await service.start();
  return { ...result };
}));

ipcMain.handle('asr:stop', createAsrIpcResponse(async (service) => {
  const result = await service.stop();
  return { ...result };
}));

ipcMain.handle('asr:cancel', createAsrIpcResponse(async (service) => {
  const result = await service.cancel();
  return { ...result };
}));

ipcMain.on('asr:audio', (event, payload = {}) => {
  if (!isMainWindowSender(event)) return;
  const sampleRate = Number(payload.sampleRate);
  const rawSamples = payload.samples;
  let samples = null;

  if (rawSamples instanceof ArrayBuffer) {
    samples = new Float32Array(rawSamples);
  } else if (ArrayBuffer.isView(rawSamples)) {
    samples = new Float32Array(rawSamples.buffer, rawSamples.byteOffset, rawSamples.byteLength / Float32Array.BYTES_PER_ELEMENT);
  }
  if (!samples || !samples.length) return;

  try {
    getAsrService().acceptAudioFrame(new Float32Array(samples), sampleRate);
  } catch (error) {
    sendAsrEvent('asr:error', serializeAsrError(error));
  }
});

ipcMain.handle('dialog:messageBox', async (_event, options = {}) => {
  return dialog.showMessageBox(mainWindow || undefined, {
    type: options.type || 'question',
    title: options.title || '日织',
    message: options.message || '',
    detail: options.detail || '',
    buttons: Array.isArray(options.buttons) && options.buttons.length ? options.buttons : ['确定'],
    defaultId: Number.isInteger(options.defaultId) ? options.defaultId : 0,
    cancelId: Number.isInteger(options.cancelId) ? options.cancelId : 0,
    noLink: options.noLink !== false
  });
});

ipcMain.handle('file:selectAndParse', async (_event, options = {}) => {
  const extensions = scheduleFileExtensions;
  const result = await dialog.showOpenDialog({
    title: '选择课表文件',
    properties: ['openFile'],
    filters: [
      { name: '课表文件', extensions },
      { name: '表格文件', extensions }
    ]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true };
  }

  const filePath = result.filePaths[0];
  const stat = await fs.stat(filePath);
  return {
    canceled: false,
    filePath,
    fileName: path.basename(filePath),
    fileSize: stat.size
  };
});

ipcMain.handle('file:parsePath', async (_event, filePath) => {
  return parseSelectedFile(filePath);
});

ipcMain.handle('data:load', async () => {
  return loadData(app);
});

ipcMain.handle('data:save', async (_event, data) => {
  return saveData(app, data);
});

ipcMain.handle('data:getPaths', async () => {
  return getStoragePaths(app);
});

ipcMain.handle('storage:chooseRoot', async (event, data) => {
  if (!isMainWindowSender(event)) throw new Error('不允许更改本地内容存放位置。');
  if (mediaUploadSessions.size > 0) throw new Error('请先结束正在进行的媒体上传，再更改存放位置。');

  const service = getAsrService();
  const manager = service.modelManager;
  if (manager.downloadPromise || service.initializePromise || service.pendingRequests.size
      || !['idle', 'ready', 'model-missing', 'error'].includes(service.state)) {
    throw new Error('请等待模型下载、录音或识别结束后，再更改存放位置。');
  }
  if (manager.getDirectoryInfo().source === 'development') {
    throw new Error('当前使用开发模型路径，请先取消 RIZHI_ASR_MODEL_DIR 配置并重启软件。');
  }

  const oldPaths = await getStoragePaths(app);
  const oldRoot = path.resolve(oldPaths.storageRoot || oldPaths.dataDirectory);
  const selection = await dialog.showOpenDialog(mainWindow, {
    title: '选择新的日织内容存放文件夹',
    defaultPath: oldRoot,
    properties: ['openDirectory', 'createDirectory']
  });
  if (selection.canceled || !selection.filePaths.length) return { canceled: true };

  const targetRoot = path.resolve(selection.filePaths[0]);
  if (sameResolvedPath(oldRoot, targetRoot)) return { canceled: true };
  if (targetRoot === path.parse(targetRoot).root) throw new Error('不能将磁盘根目录直接设为日织内容存放位置。');
  if (pathsOverlap(oldRoot, targetRoot) || pathsOverlap(manager.getDownloadDirectory(), targetRoot)) {
    throw new Error('新旧存放位置不能互相包含，请选择独立的空文件夹。');
  }
  await fs.mkdir(targetRoot, { recursive: true });
  if ((await fs.readdir(targetRoot)).length > 0) throw new Error('新存放位置必须是空文件夹。');

  const targetModelParent = path.join(targetRoot, 'models', 'asr');
  const targetModelDirectory = path.join(targetModelParent, manager.modelConfig.modelId);
  const confirmation = await dialog.showMessageBox(mainWindow, {
    type: 'warning',
    title: '迁移日织本地内容',
    message: '是否将全部日织本地内容迁移到新文件夹？',
    detail: `旧根目录：${oldRoot}\n新根目录：${targetRoot}\n\n数据、设置、照片视频和语音模型会保持原有结构迁移；成功后会清理旧位置。迁移期间请勿关闭软件。`,
    buttons: ['迁移并清理旧位置', '取消'],
    defaultId: 0,
    cancelId: 1,
    noLink: true
  });
  if (confirmation.response !== 0) return { canceled: true };

  const oldModelDirectory = manager.getDownloadDirectory();
  asrPathChangeInProgress = true;
  let modelResult = null;
  try {
    await service.dispose();
    modelResult = await manager.changeDirectory(targetModelParent);
    const storageResult = await setStorageRoot(app, targetRoot, data);
    const cleanupWarnings = [...(storageResult.migration.cleanupWarnings || [])];
    if (modelResult.cleanupWarning) cleanupWarnings.push(modelResult.cleanupWarning);
    sendAsrEvent('asr:model-status', modelResult.modelStatus);
    return {
      canceled: false,
      ...storageResult,
      paths: { ...storageResult.paths, storageRoot: targetRoot },
      modelStatus: modelResult.modelStatus,
      modelDirectory: targetModelDirectory,
      migration: { ...storageResult.migration, cleanupWarnings }
    };
  } catch (error) {
    if (modelResult) {
      try {
        await manager.changeDirectory(path.dirname(oldModelDirectory));
      } catch (rollbackError) {
        error.message = `${error.message}；模型回退失败：${rollbackError.message}`;
      }
    }
    throw error;
  } finally {
    if (service.isDisposed) asrService = null;
    asrPathChangeInProgress = false;
  }
});

function sameResolvedPath(first, second) {
  const normalizeForComparison = (value) => {
    const resolved = path.normalize(path.resolve(value || ''));
    return process.platform === 'win32' ? resolved.toLocaleLowerCase() : resolved;
  };
  return normalizeForComparison(first) === normalizeForComparison(second);
}

function pathsOverlap(first, second) {
  const contains = (parent, child) => {
    const relative = path.relative(path.resolve(parent), path.resolve(child));
    return !relative || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
  };
  return contains(first, second) || contains(second, first);
}

ipcMain.handle('data:openDirectory', async () => {
  const paths = await getStoragePaths(app);
  const directoryPath = paths.dataDirectory || path.dirname(paths.dataFilePath || '');
  if (!directoryPath) return { ok: false, error: '没有可打开的数据文件夹。' };

  await fs.mkdir(directoryPath, { recursive: true });
  const error = await shell.openPath(directoryPath);
  return { ok: !error, error };
});

ipcMain.handle('data:reset', async (_event, payload = {}) => {
  return resetData(app, payload.data, payload.options);
});

async function parseSelectedFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (!allowedExtensions.has(ext)) {
    return {
      canceled: false,
      error: '暂不支持该文件类型，请选择 xlsx、xls、csv 或 tsv 表格文件。',
      filePath,
      tasks: []
    };
  }

  const stat = await fs.stat(filePath);
  const basePayload = {
    canceled: false,
    filePath,
    fileName: path.basename(filePath),
    fileSize: stat.size,
    importedAt: new Date().toISOString()
  };

  const parseResult = await parseScheduleFile(filePath);
  return {
    ...basePayload,
    sourceType: 'table',
    ...parseResult
  };
}
