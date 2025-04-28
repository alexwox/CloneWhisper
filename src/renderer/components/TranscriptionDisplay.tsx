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
    {loading && <p>Transcribing...</p>}
    {error && (
      <>
        <h3>Transcription:</h3>
        <p style={{ color: 'red' }}>{error}</p>
      </>
    )}
    {transcription && !error && (
      <>
        <h3>Transcription:</h3>
        <p>{transcription}</p>
      </>
    )}
  </div>
);

export default TranscriptionDisplay;
