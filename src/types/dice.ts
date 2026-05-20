import type { DieValue } from '../utils/dice';

export type { DieValue };

export type RollHistoryEntry = {
  id: string;
  values: DieValue[];
  total: number;
  diceCount: number;
  timestamp: number;
};

export const MAX_ROLL_HISTORY = 10;
