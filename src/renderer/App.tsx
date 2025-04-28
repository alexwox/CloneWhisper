import React, { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { useRecording } from './hooks/useRecording';
import { RecordingIndicator } from './components/RecordingIndicator';
import './App.css';

const App: React.FC = () => {
  const { recordingState, startRecording, stopRecording } = useRecording();

  useEffect(() => {
    const handleToggleRecord = () => {
      if (recordingState.isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    };

    ipcRenderer.on('toggle-record', handleToggleRecord);

    return () => {
      ipcRenderer.removeAllListeners('toggle-record');
    };
  }, [recordingState.isRecording, startRecording, stopRecording]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>CloneWhisper</h1>
        <RecordingIndicator recordingState={recordingState} />
      </header>
    </div>
  );
};

export default App;
