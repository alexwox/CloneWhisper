import React from 'react';
import { ipcRenderer } from 'electron';
import './overlay.css';

const OverlayApp: React.FC = () => {
  const [isRecording, setIsRecording] = React.useState(false);

  React.useEffect(() => {
    console.log('Overlay component mounted');

    const handleRecordingState = (_event: any, recording: boolean) => {
      console.log('Overlay received recording state:', recording);
      setIsRecording(recording);
    };

    ipcRenderer.on('recording-state', handleRecordingState);
    return () => {
      console.log('Overlay component unmounting');
      ipcRenderer.removeListener('recording-state', handleRecordingState);
    };
  }, []);

  console.log('Overlay render, isRecording:', isRecording);

  // Always show the button for testing
  return (
    <div className="overlay-root">
      <div className="recording-button"></div>
    </div>
  );
};

export default OverlayApp;
