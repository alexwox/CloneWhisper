import React from 'react';

interface RecordButtonProps {
  isRecording: boolean;
  onClick: () => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({ isRecording, onClick }) => (
  <div className="app-controls">
    <button className={isRecording ? 'record-btn active' : 'record-btn'} onClick={onClick}>
      {isRecording ? 'Stop' : 'Record'}
    </button>
  </div>
);

export default RecordButton;
