import { app } from 'electron';
import { WindowManager } from './window/window';
import { ShortcutManager } from './shortcuts/shortcuts';

const windowManager = new WindowManager();

app.whenReady().then(() => {
  const mainWindow = windowManager.createWindow();
  const shortcutManager = new ShortcutManager(mainWindow);

  shortcutManager.registerShortcut();

  app.on('activate', () => {
    if (windowManager.getMainWindow() === null) {
      windowManager.createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  const shortcutManager = new ShortcutManager(windowManager.getMainWindow());
  shortcutManager.unregisterAllShortcuts();
});
