const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

let appWindow;

function createWindow() {
  appWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Add this line
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  appWindow.loadFile('dist/gradezhna-kniga/index.html');

  appWindow.on('closed', function () {
    appWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (appWindow === null) {
    createWindow();
  }
});

ipcMain.handle('show-open-dialog', async (event) => {
  const result = await dialog.showOpenDialog(appWindow, {
    properties: ['openFile'],
    filters: [{ name: 'JSON Files', extensions: ['json'] }],
  });

  if (result.canceled) {
    return { canceled: true };
  } else {
    const filePath = result.filePaths[0];
    return { canceled: false, filePath };
  }
});
