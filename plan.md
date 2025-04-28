# CloneWhisper Implementation Plan

## 1. Project Setup & Best-Practices Tooling

- [x] Initialize an Electron + TypeScript repo (use electron-forge or electron-builder)
- [x] Add ESLint, Prettier, Husky (pre-commit linting), and CI (GitHub Actions)
- [ ] Define environment-variable handling for your ElevenLabs (or Whisper) API key

## 2. Confirm Transcription API

- [x] 🔹 User task: Decide whether to use ElevenLabs' STT endpoint or OpenAI's Whisper API for transcription: Ans: ElevenLabs

## 3. Global Hotkey & Main-Renderer IPC

- [ ] In Main, register macOS keybinding via Electron's globalShortcut (e.g. ⌘+Space hold)
- [ ] On press/hold, send an IPC "start-record" to Renderer
- [ ] On release, send "stop-record" IPC

## 4. Microphone Capture in Renderer

- [ ] Request navigator.mediaDevices.getUserMedia({ audio: true }) on first use
- [ ] Use Web Audio API / MediaRecorder to capture raw audio chunks while key is held

## 5. Overlay Indicator UI

- [ ] Create a frameless, always-on-top BrowserWindow (small circle or waveform)
- [ ] Show overlay only when recording
- [ ] Position it near current cursor or focused window

## 6. Transcription Request

- [ ] On key-release, assemble audio buffer into a single Blob/Buffer
- [ ] POST to chosen STT endpoint with context (future)

## 7. Injecting / Copying the Transcript

- [ ] If document.activeElement is an <input>/<textarea>, insert via execCommand('insertText') or keystrokes
- [ ] Else, fall back to electron.clipboard.writeText(text)
- [ ] Show "Copied to clipboard" toast

## 8. Error Handling & Polish

- [ ] Handle microphone-denied errors
- [ ] Handle network errors
- [ ] Handle empty transcripts
- [ ] Provide user feedback (toast/snackbar) for each state

## 9. Packaging & Distribution

- [ ] Configure electron-builder for macOS .dmg
- [ ] Optional: Configure notarization
- [ ] Generate icons and bundle assets

## 10. Future: Context UI

- [ ] Add preferences window with text field for "Prompt context"
- [ ] Pass context string in transcription POST (e.g. as context or initial_prompt)

⸻
