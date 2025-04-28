const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/speech-to-text';

export async function transcribeWithElevenLabs(audioBlob: Blob, apiKey: string): Promise<string> {
  const formData = new FormData();
  formData.append('model_id', 'scribe_v1');
  formData.append('file', audioBlob, 'recording.wav');

  const response = await fetch(ELEVENLABS_API_URL, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
  }

  const result = await response.json();
  return result.text || 'No transcription available';
}
