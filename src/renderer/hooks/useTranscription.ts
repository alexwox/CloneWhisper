import { useState } from 'react';
import { transcribeWithElevenLabs } from '../api/elevenlabs';

export function useTranscription() {
  const [transcription, setTranscription] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transcribe = async (audioBlob: Blob | null) => {
    if (!audioBlob) return;
    setLoading(true);
    setError(null);
    setTranscription('');
    try {
      const apiKey = process.env.ELEVENLABS_API_KEY || '';
      const text = await transcribeWithElevenLabs(audioBlob, apiKey);
      setTranscription(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setTranscription('');
    } finally {
      setLoading(false);
    }
  };

  return {
    transcription,
    loading,
    error,
    transcribe,
  };
}
