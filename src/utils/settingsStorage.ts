import AsyncStorage from '@react-native-async-storage/async-storage';

import type { RollHistoryEntry } from '../types/dice';

const KEYS = {
  soundEnabled: '@pinkydice/soundEnabled',
  shakeEnabled: '@pinkydice/shakeEnabled',
  history: '@pinkydice/rollHistory',
} as const;

export async function loadSoundEnabled(): Promise<boolean | null> {
  const v = await AsyncStorage.getItem(KEYS.soundEnabled);
  if (v === null) {
    return null;
  }
  return v === 'true';
}

export async function loadShakeEnabled(): Promise<boolean | null> {
  const v = await AsyncStorage.getItem(KEYS.shakeEnabled);
  if (v === null) {
    return null;
  }
  return v === 'true';
}

export async function saveSoundEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.soundEnabled, String(enabled));
}

export async function saveShakeEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.shakeEnabled, String(enabled));
}

export async function loadRollHistory(): Promise<RollHistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.history);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as RollHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveRollHistory(
  history: RollHistoryEntry[],
): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.history, JSON.stringify(history));
  } catch {
    // ignore persistence errors
  }
}
