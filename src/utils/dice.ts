export type DieValue = 1 | 2 | 3 | 4 | 5 | 6;

export const MIN_DICE = 1;
export const MAX_DICE = 6;
export const INITIAL_DICE_COUNT = 2;

/** Visual roll length; keep in sync with Dice animation. */
export const ROLL_DURATION_MS = 1000;
/** Reveal final faces after tumbling, near animation end (800–1200 ms). */
export const RESULT_REVEAL_MS = 960;

export function randomDieValue(): DieValue {
  return (Math.floor(Math.random() * 6) + 1) as DieValue;
}

export function rollDice(count: number): DieValue[] {
  return Array.from({ length: count }, () => randomDieValue());
}

export function sumDice(values: DieValue[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}

export function clampDiceCount(count: number): number {
  return Math.min(MAX_DICE, Math.max(MIN_DICE, Math.round(count)));
}
