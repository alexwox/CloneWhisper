import { globalShortcut, BrowserWindow } from 'electron';
import { ShortcutConfig } from '../../shared/types';
import { IpcChannel } from '../../shared/types';

const DEFAULT_SHORTCUT: ShortcutConfig = {
  accelerator: 'Command+Control+0',
  description: 'Toggle recording',
};

export class ShortcutManager {
  private mainWindow: BrowserWindow | null;

  constructor(mainWindow: BrowserWindow | null) {
    this.mainWindow = mainWindow;
  }

  registerShortcut(config: ShortcutConfig = DEFAULT_SHORTCUT): boolean {
    const success = globalShortcut.register(config.accelerator, () => {
      console.log(`Shortcut pressed - ${config.description}`);
      if (this.mainWindow) {
        this.mainWindow.webContents.send('toggle-record' as IpcChannel);
      }
    });

    if (!success) {
      console.error(`Failed to register shortcut: ${config.accelerator}`);
    }

    return success;
  }

  unregisterAllShortcuts(): void {
    globalShortcut.unregisterAll();
  }
}
