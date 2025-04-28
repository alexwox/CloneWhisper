import React, { useEffect, useState } from 'react';
import './overlay.css';

const { ipcRenderer } = window.require ? window.require('electron') : { ipcRenderer: undefined };

const SET_OVERLAY_CONTENT = 'set-overlay-content';

const OverlayApp: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!ipcRenderer) return;
    const handler = (_event: any, msg: string | null) => setMessage(msg);
    ipcRenderer.on(SET_OVERLAY_CONTENT, handler);
    return () => {
      ipcRenderer.removeListener(SET_OVERLAY_CONTENT, handler);
    };
  }, []);

  return (
    <div className="overlay-root">
      <span className="overlay-dot"></span>
      {message && <div className="overlay-message">{message}</div>}
    </div>
  );
};

export default OverlayApp;
