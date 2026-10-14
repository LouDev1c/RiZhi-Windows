const { contextBridge, ipcRenderer, webUtils } = require('electron');

function subscribeToAsrEvent(channel, listener) {
  if (typeof listener !== 'function') throw new TypeError('ASR 事件监听器必须是函数。');
  const wrappedListener = (_event, payload) => listener(payload || {});
  ipcRenderer.on(channel, wrappedListener);
  return () => ipcRenderer.removeListener(channel, wrappedListener);
}

contextBridge.exposeInMainWorld('whbr', {
  getAppIconUrl: () => ipcRenderer.invoke('app:getIconUrl'),
  getAppVersion: () => ipcRenderer.invoke('app:getVersion'),
  updates: {
    getStatus: () => ipcRenderer.invoke('app:getUpdateStatus'),
    check: () => ipcRenderer.invoke('app:checkForUpdates'),
    download: () => ipcRenderer.invoke('app:downloadUpdate'),
    onStatus: (listener) => subscribeToAsrEvent('app:update-status', listener)
  },
  getSystemTime: () => ipcRenderer.invoke('system:getTime'),
  updateFloatingTask: (payload) => ipcRenderer.send('floating-task:update', payload),
  parseTaskText: (text, referenceDate, taskCategories = []) => ipcRenderer.invoke('task:parseText', { text, referenceDate, taskCategories }),
  showMessageBox: (options) => ipcRenderer.invoke('dialog:messageBox', options),
  selectAndParseFile: (options) => ipcRenderer.invoke('file:selectAndParse', options),
  parseFilePath: (filePath) => ipcRenderer.invoke('file:parsePath', filePath),
  loadData: () => ipcRenderer.invoke('data:load'),
  saveData: (data) => ipcRenderer.invoke('data:save', data),
  getStoragePaths: () => ipcRenderer.invoke('data:getPaths'),
  chooseStorageRoot: (data) => ipcRenderer.invoke('storage:chooseRoot', data),
  openDataPath: () => ipcRenderer.invoke('data:openDirectory'),
  resetData: (data, options) => ipcRenderer.invoke('data:reset', { data, options }),
  media: {
    startUploadSession: (date) => ipcRenderer.invoke('media:startUploadSession', { date }),
    confirmUpload: (sessionId, date, entries) => ipcRenderer.invoke('media:confirmUpload', { sessionId, date, entries }),
    cancelUpload: (sessionId) => ipcRenderer.invoke('media:cancelUpload', sessionId),
    deleteForDates: (dates) => ipcRenderer.invoke('media:deleteForDates', dates),
    deleteItems: (mediaItems) => ipcRenderer.invoke('media:deleteItems', mediaItems),
    repairLive: (media) => ipcRenderer.invoke('media:repairLive', media),
    openDirectory: () => ipcRenderer.invoke('media:openDirectory'),
    getFileUrl: (relativePath, mediaRoot) => ipcRenderer.invoke('media:getFileUrl', relativePath, mediaRoot),
    onUploaded: (listener) => subscribeToAsrEvent('media:uploaded', listener),
    onNetworkEvent: (listener) => subscribeToAsrEvent('media:networkEvent', listener),
    onSessionExpired: (listener) => subscribeToAsrEvent('media:sessionExpired', listener)
  },
  onHistoryUndo: (listener) => subscribeToAsrEvent('history:undo', listener),
  onHistoryRedo: (listener) => subscribeToAsrEvent('history:redo', listener),
  flashFloatingTask: () => ipcRenderer.send('floating-task:flash'),
  asr: {
    getModelStatus: () => ipcRenderer.invoke('asr:modelStatus'),
    downloadModel: () => ipcRenderer.invoke('asr:downloadModel'),
    openModelDirectory: () => ipcRenderer.invoke('asr:openModelDirectory'),
    initialize: () => ipcRenderer.invoke('asr:initialize'),
    start: () => ipcRenderer.invoke('asr:start'),
    stop: () => ipcRenderer.invoke('asr:stop'),
    cancel: () => ipcRenderer.invoke('asr:cancel'),
    sendAudioFrame: (sampleRate, samples) => {
      if (!Number.isInteger(sampleRate) || !(samples instanceof Float32Array)) {
        throw new TypeError('ASR 音频帧必须是带采样率的 Float32Array。');
      }
      const copy = samples.buffer.slice(samples.byteOffset, samples.byteOffset + samples.byteLength);
      ipcRenderer.send('asr:audio', { sampleRate, samples: copy });
    },
    onPartialResult: (listener) => subscribeToAsrEvent('asr:partial', listener),
    onFinalResult: (listener) => subscribeToAsrEvent('asr:final', listener),
    onVadState: (listener) => subscribeToAsrEvent('asr:vad', listener),
    onRecordingLimit: (listener) => subscribeToAsrEvent('asr:limit', listener),
    onModelStatus: (listener) => subscribeToAsrEvent('asr:model-status', listener),
    onError: (listener) => subscribeToAsrEvent('asr:error', listener)
  },
  getPathForFile: (file) => {
    if (webUtils && typeof webUtils.getPathForFile === 'function') {
      return webUtils.getPathForFile(file);
    }

    return file.path || '';
  }
});
