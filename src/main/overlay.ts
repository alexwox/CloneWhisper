import { BrowserWindow, ipcMain, app } from 'electron';
import * as path from 'path';
import {
  SHOW_OVERLAY,
  HIDE_OVERLAY,
  SET_OVERLAY_CONTENT,
  SET_OVERLAY_POSITION,
} from '../shared/ipc';

let overlayWindow: BrowserWindow | null = null;

export function createOverlayWindow() {
  if (overlayWindow) return overlayWindow;
  overlayWindow = new BrowserWindow({
    width: 80,
    height: 80,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    hasShadow: false,
    resizable: false,
    skipTaskbar: true,
    focusable: false, // click-through
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    overlayWindow.loadURL('http://localhost:3001');
  } else {
    overlayWindow.loadFile(path.join(app.getAppPath(), 'dist/overlay.html'));
  }
  overlayWindow.setIgnoreMouseEvents(true); // click-through
  overlayWindow.hide();
  return overlayWindow;
}

export function showOverlay() {
  if (!overlayWindow) createOverlayWindow();
  overlayWindow?.show();
}

export function hideOverlay() {
  overlayWindow?.hide();
}

export function setupOverlayIPC() {
  ipcMain.on(SHOW_OVERLAY, showOverlay);
  ipcMain.on(HIDE_OVERLAY, hideOverlay);

  ipcMain.on(SET_OVERLAY_CONTENT, (_event, message: string | null) => {
    if (overlayWindow) {
      overlayWindow.webContents.send(SET_OVERLAY_CONTENT, message);
    }
  });

  ipcMain.on(SET_OVERLAY_POSITION, (_event, pos: { x: number; y: number }) => {
    if (overlayWindow && pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
      overlayWindow.setPosition(Math.round(pos.x), Math.round(pos.y));
    }
  });
}
