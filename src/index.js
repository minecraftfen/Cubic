// $$ Initialize: Variables and Constants
const { app, BrowserWindow, systemPreferences, ipcMain, globalShortcut } = require('electron');
dark = require('electron').nativeTheme.shouldUseDarkColors
const drag = require('electron-drag');
const path = require('path');

if (require('electron-squirrel-startup')) {
  app.quit();
}

// $$ Main: App ready
app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 56,
    type: 'toolbar',
    frame: false,
    resizable: false,
    transparent: true,
    alwaysOnTop: true,
    vibrancy: dark ? 'dark' : 'light',
    visualEffectState: "active",
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.hide()
  mainWindow.showed = false
  globalShortcut.register('CommandOrControl+Space', () => {
    if (mainWindow.showed)
      mainWindow.hide()
    else
      mainWindow.show()
    mainWindow.showed = !mainWindow.showed
  })
  try {
    const drag = require('electron-drag');
    if (drag.supported) drag("$$kw");
    else mainWindow.webContents.send('drag');
  } catch (ex) {
    mainWindow.webContents.send('drag');
  }
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// $$ Main: App quit
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    globalShortcut.unregister('CommandOrControl+Space')
    app.quit();
  }
});

// $$ Render API: platform attr
ipcMain.on('platform', (e) => {
  e.returnValue = (process.platform in ['win32', 'darwin', 'linux']) ? process.platform : 'linux'
})
