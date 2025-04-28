import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import './App.css';

const App: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    // Set up IPC listener for recording toggle
    ipcRenderer.on('toggle-record', () => {
      console.log('Toggle recording...');
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    });

    return () => {
      ipcRenderer.removeAllListeners('toggle-record');
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = event => {
        if (event.data.size > 0) {
          // Handle the recorded data
          console.log('Recording data available:', event.data);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setMediaRecorder(null);
      setIsRecording(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>CloneWhisper</h1>
        <div className="recording-indicator">
          {isRecording ? (
            <div className="recording-active">
              <span className="recording-dot"></span>
              Recording...
            </div>
          ) : (
            <div>Press Command + Control + 0 to record</div>
          )}
        </div>
      </header>
    </div>
  );
};

export default App;
