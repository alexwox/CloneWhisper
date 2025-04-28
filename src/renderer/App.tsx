import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import './App.css';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { useTranscription } from './hooks/useTranscription';
import RecordingIndicator from './components/RecordingIndicator';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import ContextInput from './components/ContextInput';
import RecordButton from './components/RecordButton';

const App: React.FC = () => {
  const { isRecording, startRecording, stopRecording, audioBlob } = useAudioRecorder();
  const { transcription, loading, error, transcribe } = useTranscription();
  const [context, setContext] = useState('');

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

  // Send recording state to overlay
  useEffect(() => {
    ipcRenderer.send('recording-state', isRecording);
  }, [isRecording]);

  // When audioBlob changes (recording stopped), trigger transcription
  useEffect(() => {
    if (audioBlob) {
      transcribe(audioBlob, undefined, context);
    }
  }, [audioBlob]);

  return (
    <div className="app-bg">
      <div className="app-card">
        <h1 className="app-title">
          CloneWhisper <span className="app-version">2.0</span>
        </h1>
        <div className="app-status-row">
          <span className="rec-label">Rec</span>
          <RecordingIndicator isRecording={isRecording} />
          <span className={isRecording ? 'recording-text active' : 'recording-text'}>
            {isRecording ? 'Recording...' : 'Press ⌘ + ⌃ + 0 to record'}
          </span>
        </div>
        <ContextInput value={context} onChange={setContext} disabled={isRecording} />
        <RecordButton
          isRecording={isRecording}
          onClick={isRecording ? stopRecording : startRecording}
        />
        <TranscriptionDisplay transcription={transcription} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default App;
