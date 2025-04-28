import React, { useState, useEffect } from 'react';
import { KeybindingInput } from './KeybindingInput';
import { KeybindingProfile } from '../../types/keybindings';

interface PreferencesWindowProps {
  onClose: () => void;
}

export const PreferencesWindow: React.FC<PreferencesWindowProps> = ({ onClose }) => {
  const [profiles, setProfiles] = useState<KeybindingProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<KeybindingProfile | null>(null);
  const [newProfileName, setNewProfileName] = useState('');

  useEffect(() => {
    // TODO: Load profiles from main process
  }, []);

  const handleProfileChange = (profile: KeybindingProfile) => {
    setCurrentProfile(profile);
    // TODO: Update profile in main process
  };

  const handleAddProfile = () => {
    if (!newProfileName.trim()) return;
    // TODO: Add new profile in main process
    setNewProfileName('');
  };

  const handleDeleteProfile = (profileId: string) => {
    // TODO: Delete profile in main process
  };

  return (
    <div className="preferences-window">
      <div className="preferences-header">
        <h2>Keybinding Preferences</h2>
        <button onClick={onClose}>Close</button>
      </div>

      <div className="profiles-section">
        <h3>Keybinding Profiles</h3>
        <div className="profiles-list">
          {profiles.map(profile => (
            <div key={profile.id} className="profile-item">
              <input
                type="radio"
                id={profile.id}
                name="profile"
                checked={currentProfile?.id === profile.id}
                onChange={() => handleProfileChange(profile)}
              />
              <label htmlFor={profile.id}>{profile.name}</label>
              {!profile.isDefault && (
                <button onClick={() => handleDeleteProfile(profile.id)}>Delete</button>
              )}
            </div>
          ))}
        </div>

        <div className="add-profile">
          <input
            type="text"
            value={newProfileName}
            onChange={e => setNewProfileName(e.target.value)}
            placeholder="New profile name"
          />
          <button onClick={handleAddProfile}>Add Profile</button>
        </div>
      </div>

      {currentProfile && (
        <div className="keybinding-section">
          <h3>Keybinding</h3>
          <KeybindingInput
            value={currentProfile.keybinding}
            onChange={keybinding =>
              handleProfileChange({
                ...currentProfile,
                keybinding,
              })
            }
          />
        </div>
      )}
    </div>
  );
};
