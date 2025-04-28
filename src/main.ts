import { app, BrowserWindow, globalShortcut } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // In development, load from webpack dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

function registerGlobalShortcut() {
  // Use the correct accelerator format for Command + Control + 0
  const accelerator = 'Command+Control+0';

  // Register the shortcut
  const success = globalShortcut.register(accelerator, () => {
    console.log('Shortcut pressed - toggling recording');
    if (mainWindow) {
      mainWindow.webContents.send('toggle-record');
    }
  });

  if (!success) {
    console.error('Failed to register global shortcut');
  }

  // Log registration status
  console.log('Shortcut registered:', {
    success,
    accelerator,
  });
}

app.whenReady().then(() => {
  createWindow();
  registerGlobalShortcut();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Clean up shortcuts on app quit
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
