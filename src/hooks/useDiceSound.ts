import { Audio } from 'expo-av';
import { useCallback, useEffect, useRef } from 'react';

const DICE_ROLL_SOURCE = require('../../assets/sounds/dice-roll.mp3');
const DICE_TAP_SOURCE = require('../../assets/sounds/dice-tap.mp3');

const ROLL_VOLUME = 1;
const TAP_VOLUME = 0.85;

export function useDiceSound(soundEnabled: boolean) {
  const rollRef = useRef<Audio.Sound | null>(null);
  const tapRef = useRef<Audio.Sound | null>(null);
  const readyRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
        });

        const [roll, tap] = await Promise.all([
          Audio.Sound.createAsync(DICE_ROLL_SOURCE, { volume: ROLL_VOLUME }),
          Audio.Sound.createAsync(DICE_TAP_SOURCE, { volume: TAP_VOLUME }),
        ]);

        if (!mounted) {
          await Promise.all([
            roll.sound.unloadAsync(),
            tap.sound.unloadAsync(),
          ]);
          return;
        }

        rollRef.current = roll.sound;
        tapRef.current = tap.sound;
        readyRef.current = true;
      } catch {
        try {
          const { sound } = await Audio.Sound.createAsync(DICE_ROLL_SOURCE, {
            volume: ROLL_VOLUME,
          });
          if (mounted) {
            rollRef.current = sound;
            readyRef.current = true;
          } else {
            await sound.unloadAsync();
          }
        } catch {
          readyRef.current = false;
        }
      }
    })();

    return () => {
      mounted = false;
      readyRef.current = false;
      const roll = rollRef.current;
      const tap = tapRef.current;
      rollRef.current = null;
      tapRef.current = null;
      void roll?.unloadAsync();
      void tap?.unloadAsync();
    };
  }, []);

  const playFromStart = async (sound: Audio.Sound) => {
    const status = await sound.getStatusAsync();
    if (!status.isLoaded) {
      return;
    }
    await sound.setPositionAsync(0);
    await sound.playAsync();
  };

  const playRollSound = useCallback(async () => {
    if (!soundEnabled || !readyRef.current || !rollRef.current) {
      return;
    }

    try {
      if (tapRef.current) {
        void playFromStart(tapRef.current);
        await new Promise((r) => setTimeout(r, 45));
      }
      await playFromStart(rollRef.current);
    } catch {
      // safe no-op if asset missing or playback fails
    }
  }, [soundEnabled]);

  return { playRollSound };
}
