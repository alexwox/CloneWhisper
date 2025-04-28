import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import './App.css';

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/speech-to-text';

console.log('ELEVENLABS_API_KEY:', process.env.ELEVENLABS_API_KEY); // Debug: log API key

const App: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [transcription, setTranscription] = useState<string>('');

  useEffect(() => {
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
      const chunks: Blob[] = [];

      recorder.ondataavailable = event => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setIsRecording(true);
      setTranscription(''); // Clear previous transcription
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

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('model_id', 'scribe_v1');
      formData.append('file', audioBlob, 'recording.wav');

      const response = await fetch(ELEVENLABS_API_URL, {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const result = await response.json();
      console.log('Transcription result:', result);
      setTranscription(result.text || 'No transcription available');
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setTranscription(
        'Error transcribing audio: ' + (error instanceof Error ? error.message : String(error))
      );
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
        {transcription && (
          <div className="transcription">
            <h3>Transcription:</h3>
            <p>{transcription}</p>
          </div>
        )}
      </header>
    </div>
  );
};

export default App;
