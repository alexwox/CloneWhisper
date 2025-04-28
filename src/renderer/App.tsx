import React, { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import './App.css';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { useTranscription } from './hooks/useTranscription';
import RecordingIndicator from './components/RecordingIndicator';
import TranscriptionDisplay from './components/TranscriptionDisplay';

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/speech-to-text';

console.log('ELEVENLABS_API_KEY:', process.env.ELEVENLABS_API_KEY); // Debug: log API key

const App: React.FC = () => {
  const { isRecording, startRecording, stopRecording, audioBlob } = useAudioRecorder();
  const { transcription, loading, error, transcribe } = useTranscription();

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
      transcribe(audioBlob);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioBlob]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>CloneWhisper 2.0</h1>
        <RecordingIndicator isRecording={isRecording} />
        <TranscriptionDisplay transcription={transcription} loading={loading} error={error} />
      </header>
    </div>
  );
};

export default App;
