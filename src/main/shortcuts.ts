import { globalShortcut, BrowserWindow } from 'electron';

export function registerGlobalShortcut(mainWindow: BrowserWindow) {
  const accelerator = 'Command+Control+0';

  const success = globalShortcut.register(accelerator, () => {
    console.log('Shortcut pressed - toggling recording');
    if (mainWindow) {
      mainWindow.webContents.send('toggle-record');
    }
  });

  if (!success) {
    console.error('Failed to register global shortcut');
  }

  console.log('Shortcut registered:', {
    success,
    accelerator,
  });
}
