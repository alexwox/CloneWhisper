import React from 'react';
import { RecordingState } from '../../shared/types';

interface RecordingIndicatorProps {
  recordingState: RecordingState;
}

export const RecordingIndicator: React.FC<RecordingIndicatorProps> = ({ recordingState }) => {
  return (
    <div className="recording-indicator">
      {recordingState.isRecording ? (
        <div className="recording-active">
          <span className="recording-dot"></span>
          Recording...
        </div>
      ) : (
        <div>Press Command + Control + 0 to record</div>
      )}
    </div>
  );
};
