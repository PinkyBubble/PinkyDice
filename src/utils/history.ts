import type { RollHistoryEntry } from '../types/dice';
import { MAX_ROLL_HISTORY } from '../types/dice';
import type { DieValue } from '../utils/dice';
import { sumDice } from '../utils/dice';

export function createHistoryEntry(
  values: DieValue[],
  diceCount: number,
): RollHistoryEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    values,
    total: sumDice(values),
    diceCount,
    timestamp: Date.now(),
  };
}

export function prependHistory(
  history: RollHistoryEntry[],
  entry: RollHistoryEntry,
): RollHistoryEntry[] {
  return [entry, ...history].slice(0, MAX_ROLL_HISTORY);
}

export function formatRollLine(values: number[]): string {
  if (values.length === 1) {
    return String(values[0]);
  }
  const total = values.reduce((a, b) => a + b, 0);
  return `${values.join(' + ')} = ${total}`;
}

export function formatHistoryTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 60_000) {
    return 'Just now';
  }
  if (diff < 3600_000) {
    const m = Math.floor(diff / 60_000);
    return `${m}m ago`;
  }
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
