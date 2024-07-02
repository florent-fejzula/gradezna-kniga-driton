const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let appWindow;

function createWindow() {
  appWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, 'src/assets/electron-icon-red.ico') // Set the icon path
  });

  // Load the index.html file from the Angular build output
  appWindow.loadFile(path.join(__dirname, 'dist/gradezhna-kniga/index.html'));

  appWindow.webContents.on('context-menu', (event, params) => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Copy',
        role: 'copy',
        enabled: params.editFlags.canCopy
      },
      {
        label: 'Paste',
        role: 'paste',
        enabled: params.editFlags.canPaste
      }
    ]);
    contextMenu.popup(appWindow);
  });

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

ipcMain.handle('save-as-pdf', async (event, options) => {
  const result = await dialog.showSaveDialog(appWindow, {
    filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
    defaultPath: 'output.pdf'
  });

  if (result.canceled) {
    return { success: false };
  }

  const pdfPath = result.filePath;
  const win = BrowserWindow.fromWebContents(event.sender);

  try {
    const data = await win.webContents.printToPDF({
      printBackground: true,
      landscape: false,
      ...options,
    });

    fs.writeFileSync(pdfPath, data);
    return { success: true, path: pdfPath };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
});

ipcMain.handle('print-page', async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);

  try {
    await win.webContents.print({ printBackground: true });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
});




// const { app, BrowserWindow, ipcMain, dialog } = require('electron');
// const path = require('path');

// let appWindow;

// function createWindow() {
//   appWindow = new BrowserWindow({
//     width: 1000,
//     height: 800,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'), // Add this line
//       contextIsolation: true,
//       enableRemoteModule: false,
//     },
//   });

//   appWindow.loadFile('dist/gradezhna-kniga/index.html');

//   appWindow.on('closed', function () {
//     appWindow = null;
//   });
// }

// app.whenReady().then(() => {
//   createWindow();
// });

// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// app.on('activate', function () {
//   if (appWindow === null) {
//     createWindow();
//   }
// });

// ipcMain.handle('show-open-dialog', async (event) => {
//   const result = await dialog.showOpenDialog(appWindow, {
//     properties: ['openFile'],
//     filters: [{ name: 'JSON Files', extensions: ['json'] }],
//   });

//   if (result.canceled) {
//     return { canceled: true };
//   } else {
//     const filePath = result.filePaths[0];
//     return { canceled: false, filePath };
//   }
// });
