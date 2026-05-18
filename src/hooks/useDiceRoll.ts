import { useCallback, useEffect, useRef, useState } from 'react';

import {
  INITIAL_DICE_COUNT,
  RESULT_REVEAL_MS,
  type DieValue,
  clampDiceCount,
  rollDice,
} from '../utils/dice';
import { hapticRollEnd, hapticRollStart } from '../utils/haptics';

export function useDiceRoll() {
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

    const nextValues = rollDice(valuesRef.current.length);
    clearRevealTimeout();

    revealTimeoutRef.current = setTimeout(() => {
      setValues(nextValues);
      setIsRolling(false);
      rollingRef.current = false;
      revealTimeoutRef.current = null;
      void hapticRollEnd();
    }, RESULT_REVEAL_MS);
  }, [clearRevealTimeout]);

  return {
    diceCount,
    values,
    isRolling,
    rollGeneration,
    incrementDice,
    decrementDice,
    roll,
  };
}
