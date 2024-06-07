const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  showOpenDialog: () => ipcRenderer.invoke('show-open-dialog'),
  saveAsPDF: (options) => ipcRenderer.invoke('save-as-pdf', options),
  printPage: () => ipcRenderer.invoke('print-page')
});