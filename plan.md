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
- [x] Define environment-variable handling for your ElevenLabs (or Whisper) API key (via .env and webpack DefinePlugin)

## 2. Confirm Transcription API

- [x] 🔹 User task: Decide whether to use ElevenLabs' STT endpoint or OpenAI's Whisper API for transcription: Ans: ElevenLabs

## 3. Keybinding Configuration

- [x] ~~Create preferences window for keybinding settings~~ (Simplified: using hard-coded keybinding)
- [x] ~~Implement keybinding storage using electron-store~~ (Simplified: using constant)
- [x] ~~Add validation for key combinations~~ (Using pre-validated hard-coded combo)
- [x] ~~Add visual keybinding input component~~ (Not needed with hard-coded binding)
- [x] ~~Support multiple keybinding profiles~~ (Simplified: using single binding)

## 4. Global Hotkey & Main-Renderer IPC

- [x] In Main, register user-defined keybinding via Electron's globalShortcut
- [x] On press/hold, send an IPC "toggle-record" to Renderer
- [x] Handle keybinding conflicts with other applications (basic error logging)
- [x] Add fallback to default keybinding if custom binding fails (not needed with hard-coded binding)

## 5. Microphone Capture in Renderer

- [x] Request navigator.mediaDevices.getUserMedia({ audio: true }) on first use
- [x] Use Web Audio API / MediaRecorder to capture raw audio chunks while key is held

## 6. Overlay Indicator UI

- [x] Show overlay indicator in the main window when recording (pulsing dot)
- [x] Modularize overlay logic: overlay window, overlay.ts, shared/ipc.ts
- [x] Modularize main process: main.ts, window.ts, shortcuts.ts
- [x] Remove old main.ts and run app from new main/main.ts
- [ ] Create a frameless, always-on-top BrowserWindow (small circle or waveform)
- [ ] Show overlay only when recording (in a separate window)
- [ ] Position it near current cursor or focused window
- [ ] Implement overlay React app (OverlayApp.tsx, index.tsx, overlay.css)

## 7. Transcription Request

- [x] On key-release, assemble audio buffer into a single Blob/Buffer
- [x] POST to chosen STT endpoint with context (future: context not yet implemented)
- [x] Modularize API logic into api/elevenlabs.ts

## 8. Injecting / Copying the Transcript

- [ ] If document.activeElement is an <input>/<textarea>, insert via execCommand('insertText') or keystrokes
- [ ] Else, fall back to electron.clipboard.writeText(text)
- [ ] Show "Copied to clipboard" toast

## 9. Error Handling & Polish

- [x] Handle microphone-denied errors (basic error display)
- [x] Handle network errors (error display in UI)
- [x] Handle empty transcripts
- [x] Provide user feedback (toast/snackbar) for each state (basic feedback in UI)

## 10. Packaging & Distribution

- [ ] Configure electron-builder for macOS .dmg
- [ ] Optional: Configure notarization
- [ ] Generate icons and bundle assets

## 11. Future: Context UI

- [ ] Add preferences window with text field for "Prompt context"
- [ ] Pass context string in transcription POST (e.g. as context or initial_prompt)

## 12. Code Structure & Refactoring

- [x] Refactor recording logic into hooks/useAudioRecorder.ts
- [x] Refactor transcription logic into hooks/useTranscription.ts
- [x] Move API logic to api/elevenlabs.ts
- [x] Move UI to components/RecordingIndicator.tsx and components/TranscriptionDisplay.tsx
- [x] App.tsx now only wires together hooks, IPC, and UI components

⸻

**Next recommended step:**

- [ ] Implement the overlay React app (OverlayApp.tsx, index.tsx, overlay.css) for the separate overlay window.
- [ ] Wire up IPC from renderer to show/hide overlay when recording starts/stops.
