const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  showOpenDialog: () => ipcRenderer.invoke('show-open-dialog'),
});
