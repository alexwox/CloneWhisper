import { app, globalShortcut, BrowserWindow } from 'electron';
import { createMainWindow } from './window';
import { registerGlobalShortcut } from './shortcuts';
import { createOverlayWindow, setupOverlayIPC } from './overlay';

let mainWindow: BrowserWindow | null = null;

app.whenReady().then(() => {
  mainWindow = createMainWindow();

  const overlay = createOverlayWindow();

  // Make sure overlay is visible
  if (overlay.showInactive) {
    overlay.showInactive();
  } else {
    overlay.show();
  }

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
  console.log('All windows closed');
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  console.log('App will quit');
  globalShortcut.unregisterAll();
});
