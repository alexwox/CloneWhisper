const OPENAI_API_URL = 'https://api.openai.com/v1/audio/transcriptions';

export async function transcribeWithWhisper(
  audioBlob: Blob,
  apiKey: string,
  prompt?: string
): Promise<string> {
  const formData = new FormData();
  formData.append('model', 'whisper-1');
  formData.append('file', audioBlob, 'recording.wav');
  if (prompt) {
    formData.append('prompt', prompt);
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
  }

  const result = await response.json();
  console.log(result.text);
  return result.text || 'No transcription available';
}
