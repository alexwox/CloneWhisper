import { useState } from 'react';
import { transcribeWithElevenLabs } from '../api/elevenlabs';
import { transcribeWithWhisper } from '../api/whisper';
import { clipboard } from 'electron';

export type TranscriptionProvider = 'whisper' | 'elevenlabs';

export function useTranscription() {
  const [transcription, setTranscription] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transcribe = async (
    audioBlob: Blob | null,
    provider: TranscriptionProvider = 'whisper',
    context?: string
  ) => {
    if (!audioBlob) return;
    setLoading(true);
    setError(null);
    setTranscription('');
    try {
      let text = '';
      if (provider === 'elevenlabs') {
        const apiKey = process.env.ELEVENLABS_API_KEY || '';
        text = await transcribeWithElevenLabs(audioBlob, apiKey);
      } else {
        const apiKey = process.env.OPENAI_API_KEY || '';
        text = await transcribeWithWhisper(audioBlob, apiKey, context);
      }
      console.log('Transcription result:', text);
      setTranscription(text);
      clipboard.writeText(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setTranscription('');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (transcription) {
      clipboard.writeText(transcription);
    }
  };

  return {
    transcription,
    loading,
    error,
    transcribe,
    copyToClipboard,
  };
}
