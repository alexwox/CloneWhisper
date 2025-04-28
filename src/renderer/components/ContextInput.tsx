import React from 'react';

interface ContextInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ContextInput: React.FC<ContextInputProps> = ({ value, onChange, disabled }) => (
  <div className="app-context-row">
    <input
      className="context-input"
      type="text"
      placeholder="Add context for transcription (optional)"
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
    />
  </div>
);

export default ContextInput;
