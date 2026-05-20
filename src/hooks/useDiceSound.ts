import { Audio } from 'expo-av';
import { useCallback, useEffect, useRef } from 'react';

const DICE_ROLL_SOURCE = require('../../assets/sounds/dice-roll.mp3');

export function useDiceSound(soundEnabled: boolean) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const readyRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
        });
        const { sound } = await Audio.Sound.createAsync(DICE_ROLL_SOURCE, {
          volume: 1,
        });
        if (mounted) {
          soundRef.current = sound;
          readyRef.current = true;
        } else {
          await sound.unloadAsync();
        }
      } catch {
        readyRef.current = false;
      }
    })();

    return () => {
      mounted = false;
      readyRef.current = false;
      const s = soundRef.current;
      soundRef.current = null;
      void s?.unloadAsync();
    };
  }, []);

  const playRollSound = useCallback(async () => {
    if (!soundEnabled || !readyRef.current || !soundRef.current) {
      return;
    }
    try {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        await soundRef.current.setPositionAsync(0);
        await soundRef.current.playAsync();
      }
    } catch {
      // missing or failed playback — safe no-op
    }
  }, [soundEnabled]);

  return { playRollSound };
}
