import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { colors } from '../constants/colors';
import type { DieValue } from '../utils/dice';
import { Dice } from './Dice';

type DiceAreaProps = {
  values: DieValue[];
  rollGeneration: number;
  isRolling: boolean;
  compact?: boolean;
};

/** Dice per row for layout width math (not always === count). */
function colsForCount(count: number): number {
  if (count <= 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  if (count === 4) return 2;
  return 3;
}

function getDieSize(count: number, areaWidth: number, compact?: boolean): number {
  const padding = 12;
  const available = areaWidth - padding * 2;
  const cols = colsForCount(count);
  const gap = (cols - 1) * 6;
  const fromWidth = (available - gap) / cols;
  const cap = (n: number) => Math.round(compact ? n * 0.94 : n);

  const maxByCount: Record<number, number> = {
    1: 220,
    2: 172,
    3: 138,
    4: 132,
    5: 118,
    6: 112,
  };

  const maxCap = maxByCount[count] ?? 112;
  return cap(Math.min(fromWidth, maxCap));
}

function DiceSlot({
  value,
  size,
  index,
  rollGeneration,
  isRolling,
}: {
  value: DieValue;
  size: number;
  index: number;
  rollGeneration: number;
  isRolling: boolean;
}) {
  return (
    <View style={[styles.slot, { width: size + 12, height: size + 16 }]}>
      <Dice
        value={value}
        size={size}
        index={index}
        rollGeneration={rollGeneration}
        isRolling={isRolling}
      />
    </View>
  );
}

export function DiceArea({
  values,
  rollGeneration,
  isRolling,
  compact,
}: DiceAreaProps) {
  const { width } = useWindowDimensions();
  const areaWidth = Math.min(width - 40, 520);
  const count = values.length;
  const dieSize = getDieSize(count, areaWidth, compact);
  const cardBase = [styles.card, compact && styles.cardCompact];

  const common = { size: dieSize, rollGeneration, isRolling };

  if (count === 1) {
    return (
      <View style={[...cardBase, styles.center]}>
        <DiceSlot value={values[0]} index={0} {...common} />
      </View>
    );
  }

  if (count === 2) {
    return (
      <View style={[...cardBase, styles.row, styles.center]}>
        {values.map((v, i) => (
          <DiceSlot key={i} value={v} index={i} {...common} />
        ))}
      </View>
    );
  }

  if (count === 3) {
    return (
      <View style={[...cardBase, styles.row, styles.center]}>
        {values.map((v, i) => (
          <DiceSlot key={i} value={v} index={i} {...common} />
        ))}
      </View>
    );
  }

  if (count === 4) {
    return (
      <View style={[...cardBase, styles.grid2]}>
        {values.map((v, i) => (
          <DiceSlot key={i} value={v} index={i} {...common} />
        ))}
      </View>
    );
  }

  if (count === 5) {
    return (
      <View style={[...cardBase, styles.stack]}>
        <View style={styles.row}>
          {values.slice(0, 3).map((v, i) => (
            <DiceSlot key={i} value={v} index={i} {...common} />
          ))}
        </View>
        <View style={[styles.row, styles.rowCentered]}>
          {values.slice(3).map((v, i) => (
            <DiceSlot key={`b-${i}`} value={v} index={i + 3} {...common} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={[...cardBase, styles.grid3x2]}>
      {values.map((v, i) => (
        <DiceSlot key={i} value={v} index={i} {...common} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: 14,
    paddingHorizontal: 12,
    minHeight: 140,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  cardCompact: {
    minHeight: 0,
    paddingVertical: 12,
    borderRadius: 22,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  rowCentered: {
    justifyContent: 'center',
  },
  stack: {
    alignItems: 'center',
    gap: 8,
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  grid3x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  slot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
