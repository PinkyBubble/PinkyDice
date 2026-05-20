import { Accelerometer } from 'expo-sensors';
import { useEffect, useRef } from 'react';

const SHAKE_DELTA = 1.35;
const COOLDOWN_MS = 1400;
const UPDATE_MS = 80;

type UseShakeToRollOptions = {
  enabled: boolean;
  isRolling: boolean;
  onShake: () => void;
};

export function useShakeToRoll({
  enabled,
  isRolling,
  onShake,
}: UseShakeToRollOptions) {
  const onShakeRef = useRef(onShake);
  onShakeRef.current = onShake;

  const lastShakeAtRef = useRef(0);
  const lastMagnitudeRef = useRef(1);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let subscription: { remove: () => void } | null = null;

    const start = async () => {
      const available = await Accelerometer.isAvailableAsync();
      if (!available) {
        return;
      }

      Accelerometer.setUpdateInterval(UPDATE_MS);
      subscription = Accelerometer.addListener(({ x, y, z }) => {
        if (isRolling) {
          return;
        }

        const magnitude = Math.sqrt(x * x + y * y + z * z);
        const delta = Math.abs(magnitude - lastMagnitudeRef.current);
        lastMagnitudeRef.current = magnitude;

        const now = Date.now();
        if (
          delta > SHAKE_DELTA &&
          now - lastShakeAtRef.current > COOLDOWN_MS
        ) {
          lastShakeAtRef.current = now;
          onShakeRef.current();
        }
      });
    };

    void start();

    return () => {
      subscription?.remove();
    };
  }, [enabled, isRolling]);
}
