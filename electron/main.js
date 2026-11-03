// Electron shell: opens index.html in a desktop window.
const { app, BrowserWindow, Menu, powerSaveBlocker, shell } = require('electron');
const path = require('path');

// Keep the screen on while the app is open (same idea as Wake Lock in the browser).
let blockerId = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 1000,
    minWidth: 360,
    minHeight: 560,
    backgroundColor: '#16181d',
    title: 'Tempus Bellum',
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, sandbox: true }
  });
  win.loadFile(path.join(__dirname, '..', 'index.html'));
  // Links that would leave the app open in the system browser instead.
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
}

// Single instance: a second launch focuses the existing window,
// so two windows never write to the same saved game.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const [win] = BrowserWindow.getAllWindows();
    if (win) { if (win.isMinimized()) win.restore(); win.focus(); }
  });
  app.whenReady().then(() => {
    Menu.setApplicationMenu(null);
    blockerId = powerSaveBlocker.start('prevent-display-sleep');
    createWindow();
  });
  app.on('window-all-closed', () => {
    if (blockerId !== null) powerSaveBlocker.stop(blockerId);
    app.quit();
  });
}
