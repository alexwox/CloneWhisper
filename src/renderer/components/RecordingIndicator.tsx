import React from 'react';

interface RecordingIndicatorProps {
  isRecording: boolean;
}

const RecordingIndicator: React.FC<RecordingIndicatorProps> = ({ isRecording }) => (
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
);

export default RecordingIndicator;
