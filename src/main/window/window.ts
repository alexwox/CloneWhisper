import { BrowserWindow } from 'electron';
import * as path from 'path';
import { WindowConfig } from '../../shared/types';

const DEFAULT_WINDOW_CONFIG: WindowConfig = {
  width: 800,
  height: 600,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
  },
};

export class WindowManager {
  private mainWindow: BrowserWindow | null = null;

  createWindow(config: WindowConfig = DEFAULT_WINDOW_CONFIG): BrowserWindow {
    this.mainWindow = new BrowserWindow(config);

    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.loadURL('http://localhost:3000');
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../../../dist/index.html'));
    }

    return this.mainWindow;
  }

  getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }

  closeAllWindows(): void {
    if (this.mainWindow) {
      this.mainWindow.close();
    }
  }
}
