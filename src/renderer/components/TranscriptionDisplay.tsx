import React from 'react';

interface TranscriptionDisplayProps {
  transcription: string;
  loading: boolean;
  error: string | null;
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcription,
  loading,
  error,
}) => (
  <div className="transcription">
    {loading && <div className="transcription-loading">Transcribing…</div>}
    {error && <div className="transcription-error">{error}</div>}
    {transcription && !error && !loading && (
      <div className="transcription-text">{transcription}</div>
    )}
  </div>
);

export default TranscriptionDisplay;
