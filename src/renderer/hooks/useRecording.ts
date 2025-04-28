import { useState, useCallback } from 'react';
import { RecordingState } from '../../shared/types';

export const useRecording = (): {
  recordingState: RecordingState;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
} => {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    mediaRecorder: null,
  });

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = event => {
        if (event.data.size > 0) {
          console.log('Recording data available:', event.data);
        }
      };

      recorder.start();
      setRecordingState({
        isRecording: true,
        mediaRecorder: recorder,
      });
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recordingState.mediaRecorder && recordingState.mediaRecorder.state !== 'inactive') {
      recordingState.mediaRecorder.stop();
      recordingState.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setRecordingState({
        isRecording: false,
        mediaRecorder: null,
      });
    }
  }, [recordingState.mediaRecorder]);

  return {
    recordingState,
    startRecording,
    stopRecording,
  };
};
