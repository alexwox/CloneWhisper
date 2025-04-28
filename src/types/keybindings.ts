export interface Keybinding {
  key: string;
  modifiers: string[];
}

export interface KeybindingProfile {
  id: string;
  name: string;
  keybinding: Keybinding;
  isDefault?: boolean;
}

export interface KeybindingConfig {
  currentProfileId: string;
  profiles: KeybindingProfile[];
}

export const DEFAULT_KEYBINDING: Keybinding = {
  key: 'Space',
  modifiers: ['Command'],
};

export const DEFAULT_PROFILE: KeybindingProfile = {
  id: 'default',
  name: 'Default',
  keybinding: DEFAULT_KEYBINDING,
  isDefault: true,
};
