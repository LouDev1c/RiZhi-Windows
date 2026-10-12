const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('floatingTask', {
  onUpdate: (listener) => {
    const wrappedListener = (_event, payload) => listener(payload || {});
    ipcRenderer.on('floating-task:update', wrappedListener);
    return () => ipcRenderer.removeListener('floating-task:update', wrappedListener);
  },
  onFlash: (listener) => {
    const wrappedListener = (_event, payload) => listener(payload || {});
    ipcRenderer.on('floating-task:flash', wrappedListener);
    return () => ipcRenderer.removeListener('floating-task:flash', wrappedListener);
  },
  openMainWindow: () => ipcRenderer.send('floating-task:open-main'),
  expand: () => ipcRenderer.send('floating-task:expand'),
  resize: (size) => ipcRenderer.send('floating-task:resize', size),
  toggleTopmost: () => ipcRenderer.send('floating-task:toggle-topmost')
});
