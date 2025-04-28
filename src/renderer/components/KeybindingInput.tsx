import React, { useState, useEffect, useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Keybinding } from '../../types/keybindings';

interface KeybindingInputProps {
  value: Keybinding;
  onChange: (keybinding: Keybinding) => void;
  disabled?: boolean;
}

export const KeybindingInput: React.FC<KeybindingInputProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentKeys, setCurrentKeys] = useState<string[]>([]);
  const [currentModifiers, setCurrentModifiers] = useState<string[]>([]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isCapturing) return;

      event.preventDefault();
      event.stopPropagation();

      const key = event.key;
      const modifiers = [];

      if (event.metaKey) modifiers.push('Command');
      if (event.ctrlKey) modifiers.push('Control');
      if (event.altKey) modifiers.push('Alt');
      if (event.shiftKey) modifiers.push('Shift');

      // Only update if we have at least one modifier
      if (modifiers.length > 0) {
        setCurrentKeys([key]);
        setCurrentModifiers(modifiers);
      }
    },
    [isCapturing]
  );

  const handleKeyUp = useCallback(() => {
    if (!isCapturing) return;

    setIsCapturing(false);
    if (currentKeys.length > 0 && currentModifiers.length > 0) {
      onChange({
        key: currentKeys[0],
        modifiers: currentModifiers,
      });
    }
  }, [isCapturing, currentKeys, currentModifiers, onChange]);

  useEffect(() => {
    if (isCapturing) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isCapturing, handleKeyDown, handleKeyUp]);

  const formatKeybinding = (keybinding: Keybinding) => {
    return [...keybinding.modifiers.map(mod => `${mod}+`), keybinding.key].join('');
  };

  return (
    <div className="keybinding-input">
      <button
        onClick={() => setIsCapturing(true)}
        disabled={disabled || isCapturing}
        className={`keybinding-button ${isCapturing ? 'capturing' : ''}`}
      >
        {isCapturing ? 'Press a key combination...' : formatKeybinding(value)}
      </button>
      {isCapturing && (
        <div className="keybinding-hint">
          Press a key combination with at least one modifier key
        </div>
      )}
    </div>
  );
};
