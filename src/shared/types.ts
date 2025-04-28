export type IpcChannel = 'start-record' | 'stop-record';

export interface RecordingState {
  isRecording: boolean;
  mediaRecorder: MediaRecorder | null;
}

export interface WindowConfig {
  width: number;
  height: number;
  webPreferences: {
    nodeIntegration: boolean;
    contextIsolation: boolean;
  };
}

export interface ShortcutConfig {
  accelerator: string;
  description: string;
}
