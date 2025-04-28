import { app, globalShortcut, BrowserWindow } from 'electron';
import { createOverlayWindow, setupOverlayIPC } from './overlay';
import { createMainWindow } from './window';
import { registerGlobalShortcut } from './shortcuts';

let mainWindow: BrowserWindow | null = null;

app.whenReady().then(() => {
  mainWindow = createMainWindow();
  createOverlayWindow();
  setupOverlayIPC();
  if (mainWindow) {
    registerGlobalShortcut(mainWindow);
  }

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
