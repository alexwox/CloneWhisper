# CloneWhisper Implementation Plan

This prompt generated the plan:
<prompt>
"I want to build a mac whisper clone called clonewhisper using:

- Electron
- Elevenlabs api

Workflow (Mac):

- User presses and holds keybinding / shortcut
- While holding, the app takes in microphone output (asks for permission if first time)
- Shows a small indicator over the active field that there is a recording (like mac whisperer)
- If no active field: Show "No active field, copying to clipboard"

In the future I want to add:

- In the electron app a textfield that takes a context string
- This context is sent along with the microphone input to ElevenLabs API to improve the transcription

Give me a step by step implementation plan to get this started, with checklist and labels what I need to do vs what Cursor can do for me. "
</prompt>

## 1. Project Setup & Best-Practices Tooling

- [x] Initialize an Electron + TypeScript repo (use electron-forge or electron-builder)
- [x] Add ESLint, Prettier, Husky (pre-commit linting), and CI (GitHub Actions)
- [ ] Define environment-variable handling for your ElevenLabs (or Whisper) API key

## 2. Confirm Transcription API

- [x] 🔹 User task: Decide whether to use ElevenLabs' STT endpoint or OpenAI's Whisper API for transcription: Ans: ElevenLabs

## 3. Keybinding Configuration

- [x] ~~Create preferences window for keybinding settings~~ (Simplified: using hard-coded keybinding)
- [x] ~~Implement keybinding storage using electron-store~~ (Simplified: using constant)
- [x] ~~Add validation for key combinations~~ (Using pre-validated hard-coded combo)
- [x] ~~Add visual keybinding input component~~ (Not needed with hard-coded binding)
- [x] ~~Support multiple keybinding profiles~~ (Simplified: using single binding)

## 4. Global Hotkey & Main-Renderer IPC

- [ ] In Main, register user-defined keybinding via Electron's globalShortcut
- [ ] On press/hold, send an IPC "start-record" to Renderer
- [ ] On release, send "stop-record" IPC
- [ ] Handle keybinding conflicts with other applications
- [ ] Add fallback to default keybinding if custom binding fails

## 5. Microphone Capture in Renderer

- [ ] Request navigator.mediaDevices.getUserMedia({ audio: true }) on first use
- [ ] Use Web Audio API / MediaRecorder to capture raw audio chunks while key is held

## 6. Overlay Indicator UI

- [ ] Create a frameless, always-on-top BrowserWindow (small circle or waveform)
- [ ] Show overlay only when recording
- [ ] Position it near current cursor or focused window

## 7. Transcription Request

- [ ] On key-release, assemble audio buffer into a single Blob/Buffer
- [ ] POST to chosen STT endpoint with context (future)

## 8. Injecting / Copying the Transcript

- [ ] If document.activeElement is an <input>/<textarea>, insert via execCommand('insertText') or keystrokes
- [ ] Else, fall back to electron.clipboard.writeText(text)
- [ ] Show "Copied to clipboard" toast

## 9. Error Handling & Polish

- [ ] Handle microphone-denied errors
- [ ] Handle network errors
- [ ] Handle empty transcripts
- [ ] Provide user feedback (toast/snackbar) for each state

## 10. Packaging & Distribution

- [ ] Configure electron-builder for macOS .dmg
- [ ] Optional: Configure notarization
- [ ] Generate icons and bundle assets

## 11. Future: Context UI

- [ ] Add preferences window with text field for "Prompt context"
- [ ] Pass context string in transcription POST (e.g. as context or initial_prompt)

⸻
