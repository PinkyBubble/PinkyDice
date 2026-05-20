import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { useDiceRoll } from '../hooks/useDiceRoll';
import { useDiceSound } from '../hooks/useDiceSound';
import { useShakeToRoll } from '../hooks/useShakeToRoll';
import type { RollHistoryEntry } from '../types/dice';
import { createHistoryEntry, prependHistory } from '../utils/history';
import {
  loadRollHistory,
  loadShakeEnabled,
  loadSoundEnabled,
  saveRollHistory,
  saveShakeEnabled,
  saveSoundEnabled,
} from '../utils/settingsStorage';
import type { DieValue } from '../utils/dice';

type PinkyDiceContextValue = {
  diceCount: number;
  values: DieValue[];
  isRolling: boolean;
  rollGeneration: number;
  incrementDice: () => void;
  decrementDice: () => void;
  setDiceCount: (count: number) => void;
  roll: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  shakeEnabled: boolean;
  setShakeEnabled: (v: boolean) => void;
  rollHistory: RollHistoryEntry[];
  settingsVisible: boolean;
  openSettings: () => void;
  closeSettings: () => void;
};

const PinkyDiceContext = createContext<PinkyDiceContextValue | null>(null);

export function PinkyDiceProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [shakeEnabled, setShakeEnabledState] = useState(true);
  const [rollHistory, setRollHistory] = useState<RollHistoryEntry[]>([]);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  const { playRollSound } = useDiceSound(soundEnabled);

  const handleRollComplete = useCallback(
    (values: DieValue[], diceCount: number) => {
      const entry = createHistoryEntry(values, diceCount);
      setRollHistory((prev) => {
        const next = prependHistory(prev, entry);
        void saveRollHistory(next);
        return next;
      });
    },
    [],
  );

  const dice = useDiceRoll({
    onRollStart: () => {
      void playRollSound();
    },
    onRollComplete: handleRollComplete,
  });

  useShakeToRoll({
    enabled: prefsLoaded && shakeEnabled,
    isRolling: dice.isRolling,
    onShake: dice.roll,
  });

  useEffect(() => {
    (async () => {
      const [sound, shake, history] = await Promise.all([
        loadSoundEnabled(),
        loadShakeEnabled(),
        loadRollHistory(),
      ]);
      if (sound !== null) {
        setSoundEnabledState(sound);
      }
      if (shake !== null) {
        setShakeEnabledState(shake);
      }
      setRollHistory(history.slice(0, 10));
      setPrefsLoaded(true);
    })();
  }, []);

  const setSoundEnabled = useCallback((v: boolean) => {
    setSoundEnabledState(v);
    void saveSoundEnabled(v);
  }, []);

  const setShakeEnabled = useCallback((v: boolean) => {
    setShakeEnabledState(v);
    void saveShakeEnabled(v);
  }, []);

  const value: PinkyDiceContextValue = {
    diceCount: dice.diceCount,
    values: dice.values,
    isRolling: dice.isRolling,
    rollGeneration: dice.rollGeneration,
    incrementDice: dice.incrementDice,
    decrementDice: dice.decrementDice,
    setDiceCount: dice.setDiceCount,
    roll: dice.roll,
    soundEnabled,
    setSoundEnabled,
    shakeEnabled,
    setShakeEnabled,
    rollHistory,
    settingsVisible,
    openSettings: () => setSettingsVisible(true),
    closeSettings: () => setSettingsVisible(false),
  };

  return (
    <PinkyDiceContext.Provider value={value}>
      {children}
    </PinkyDiceContext.Provider>
  );
}

export function usePinkyDice(): PinkyDiceContextValue {
  const ctx = useContext(PinkyDiceContext);
  if (!ctx) {
    throw new Error('usePinkyDice must be used within PinkyDiceProvider');
  }
  return ctx;
}
