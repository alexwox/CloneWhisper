import React from 'react';

interface RecordingIndicatorProps {
  isRecording: boolean;
}

const RecordingIndicator: React.FC<RecordingIndicatorProps> = ({ isRecording }) => (
  <div className="recording-indicator-modern">
    {isRecording ? (
      <span className="recording-dot-modern" title="Recording" />
    ) : (
      <span className="recording-dot-idle" title="Idle" />
    )}
  </div>
);

export default RecordingIndicator;
