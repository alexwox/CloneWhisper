import React, { useEffect } from 'react';
import { ipcRenderer, clipboard } from 'electron';
import './App.css';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { useTranscription } from './hooks/useTranscription';
import RecordingIndicator from './components/RecordingIndicator';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import {
  SHOW_OVERLAY,
  HIDE_OVERLAY,
  SET_OVERLAY_CONTENT,
  SET_OVERLAY_POSITION,
} from '../shared/ipc';

function getCursorPosition() {
  // Fallback: center of the screen (could use electron's screen API for real position)
  return { x: 400, y: 300 };
}

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/speech-to-text';

console.log('ELEVENLABS_API_KEY:', process.env.ELEVENLABS_API_KEY); // Debug: log API key

const App: React.FC = () => {
  const { isRecording, startRecording, stopRecording, audioBlob } = useAudioRecorder();
  const { transcription, loading, error, transcribe } = useTranscription();

  // Overlay control logic
  useEffect(() => {
    if (isRecording) {
      // Try to find an active text field in this window
      const active = document.activeElement;
      let overlayMessage: string | null = null;
      let pos = null;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
        // Get bounding rect and position overlay above the field
        const rect = (active as HTMLElement).getBoundingClientRect();
        // Offset overlay above the field (adjust as needed)
        pos = {
          x: window.screenX + rect.left + rect.width / 2 - 40,
          y: window.screenY + rect.top - 90,
        };
        overlayMessage = null;
        console.log('[Overlay] Active text field detected:', active, 'Overlay position:', pos);
      } else {
        // Fallback: show near cursor with message
        pos = getCursorPosition();
        overlayMessage = 'No selected field, transcribing to clipboard';
        console.log(
          '[Overlay] No active text field. Using cursor fallback. Overlay position:',
          pos,
          'Message:',
          overlayMessage
        );
      }
      console.log('[Overlay] Sending SHOW_OVERLAY, SET_OVERLAY_CONTENT, SET_OVERLAY_POSITION');
      ipcRenderer.send(SHOW_OVERLAY);
      ipcRenderer.send(SET_OVERLAY_CONTENT, overlayMessage);
      if (pos) ipcRenderer.send(SET_OVERLAY_POSITION, pos);
    } else {
      console.log('[Overlay] Sending HIDE_OVERLAY, clearing overlay content');
      ipcRenderer.send(HIDE_OVERLAY);
      ipcRenderer.send(SET_OVERLAY_CONTENT, null);
    }
  }, [isRecording]);

  // IPC: Toggle recording on event from main process
  useEffect(() => {
    const handler = () => {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    };
    ipcRenderer.on('toggle-record', handler);
    return () => {
      ipcRenderer.removeListener('toggle-record', handler);
    };
  }, [isRecording, startRecording, stopRecording]);

  // When audioBlob changes (recording stopped), trigger transcription
  useEffect(() => {
    if (audioBlob) {
      transcribe(audioBlob);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioBlob]);

  // When transcription is received, push to clipboard
  useEffect(() => {
    if (transcription && !loading && !error) {
      clipboard.writeText(transcription);
      console.log('[Clipboard] Transcription copied to clipboard:', transcription);
    }
  }, [transcription, loading, error]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>CloneWhisper</h1>
        <RecordingIndicator isRecording={isRecording} />
        <TranscriptionDisplay transcription={transcription} loading={loading} error={error} />
      </header>
    </div>
  );
};

export default App;
