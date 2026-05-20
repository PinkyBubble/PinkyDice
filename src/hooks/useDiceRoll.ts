import { useCallback, useEffect, useRef, useState } from 'react';

import type { DieValue } from '../types/dice';
import {
  INITIAL_DICE_COUNT,
  RESULT_REVEAL_MS,
  clampDiceCount,
  rollDice,
} from '../utils/dice';
import { hapticRollEnd, hapticRollStart } from '../utils/haptics';

type UseDiceRollOptions = {
  onRollStart?: () => void;
  onRollComplete?: (values: DieValue[], diceCount: number) => void;
};

export function useDiceRoll(options: UseDiceRollOptions = {}) {
  const { onRollStart, onRollComplete } = options;
  const onRollStartRef = useRef(onRollStart);
  const onRollCompleteRef = useRef(onRollComplete);
  onRollStartRef.current = onRollStart;
  onRollCompleteRef.current = onRollComplete;

  const [diceCount, setDiceCountState] = useState(INITIAL_DICE_COUNT);
  const [values, setValues] = useState<DieValue[]>(() =>
    rollDice(INITIAL_DICE_COUNT),
  );
  const [isRolling, setIsRolling] = useState(false);
  const [rollGeneration, setRollGeneration] = useState(0);

  const valuesRef = useRef(values);
  valuesRef.current = values;

  const rollingRef = useRef(false);
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRevealTimeout = useCallback(() => {
    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current);
      revealTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => () => clearRevealTimeout(), [clearRevealTimeout]);

  const applyDiceCount = useCallback((next: number) => {
    const clamped = clampDiceCount(next);
    setDiceCountState(clamped);
    setValues((prev) => {
      if (prev.length === clamped) {
        return prev;
      }
      if (prev.length < clamped) {
        return [...prev, ...rollDice(clamped - prev.length)];
      }
      return prev.slice(0, clamped);
    });
  }, []);

  const incrementDice = useCallback(() => {
    setDiceCountState((current) => {
      const next = clampDiceCount(current + 1);
      if (next === current) {
        return current;
      }
      setValues((prev) =>
        prev.length < next ? [...prev, ...rollDice(next - prev.length)] : prev,
      );
      return next;
    });
  }, []);

  const decrementDice = useCallback(() => {
    setDiceCountState((current) => {
      const next = clampDiceCount(current - 1);
      if (next === current) {
        return current;
      }
      setValues((prev) => (prev.length > next ? prev.slice(0, next) : prev));
      return next;
    });
  }, []);

  const roll = useCallback(() => {
    if (rollingRef.current) {
      return;
    }

    rollingRef.current = true;
    setIsRolling(true);
    setRollGeneration((g) => g + 1);

    void hapticRollStart();
    onRollStartRef.current?.();

    const count = valuesRef.current.length;
    const nextValues = rollDice(count);
    clearRevealTimeout();

    revealTimeoutRef.current = setTimeout(() => {
      setValues(nextValues);
      setIsRolling(false);
      rollingRef.current = false;
      revealTimeoutRef.current = null;
      void hapticRollEnd();
      onRollCompleteRef.current?.(nextValues, count);
    }, RESULT_REVEAL_MS);
  }, [clearRevealTimeout]);

  return {
    diceCount,
    values,
    isRolling,
    rollGeneration,
    incrementDice,
    decrementDice,
    setDiceCount: applyDiceCount,
    roll,
  };
}
