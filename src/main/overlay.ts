import { BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';

let overlayWindow: BrowserWindow | null = null;

const OVERLAY_SIZE = 36; // px (window size)
const OVERLAY_OFFSET = 40; // px above cursor

export function createOverlayWindow() {
  if (overlayWindow) {
    return overlayWindow;
  }

  overlayWindow = new BrowserWindow({
    width: OVERLAY_SIZE,
    height: OVERLAY_SIZE,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    hasShadow: false,
    resizable: false,
    skipTaskbar: true,
    focusable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: false, // Start hidden
  });

  overlayWindow.setVisibleOnAllWorkspaces(true);

  if (process.env.NODE_ENV === 'development') {
    overlayWindow.loadURL('http://localhost:3001');
  } else {
    overlayWindow.loadFile(path.join(__dirname, '../../dist/overlay.html'));
  }

  overlayWindow.setIgnoreMouseEvents(true);

  return overlayWindow;
}

export function setupOverlayIPC() {
  ipcMain.on('recording-state', (_event, isRecording) => {
    if (overlayWindow) {
      overlayWindow.webContents.send('recording-state', isRecording);
      if (isRecording) {
        const { x, y } = screen.getCursorScreenPoint();
        overlayWindow.setPosition(
          Math.round(x - OVERLAY_SIZE / 2),
          Math.round(y - OVERLAY_SIZE - OVERLAY_OFFSET),
          false
        );
        // show *without* activating
        if (typeof overlayWindow.showInactive === 'function') {
          overlayWindow.showInactive();
        } else {
          overlayWindow.show();
        }
      } else {
        overlayWindow.hide();
      }
    }
  });
}
