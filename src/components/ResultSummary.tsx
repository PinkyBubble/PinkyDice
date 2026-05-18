import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';
import type { DieValue } from '../utils/dice';
import { sumDice } from '../utils/dice';

type ResultSummaryProps = {
  values: DieValue[];
  isRolling: boolean;
};

export function ResultSummary({ values, isRolling }: ResultSummaryProps) {
  const total = sumDice(values);
  return (
    <View style={styles.wrap}>
      <Text style={styles.caption}>Sonuç</Text>
      <Text style={styles.total}>
        {isRolling ? '…' : total}
      </Text>
      {!isRolling && values.length > 1 && (
        <Text style={styles.detail} numberOfLines={2}>
          {values.join(' + ')} = {total}
        </Text>
      )}
      {isRolling && (
        <Text style={styles.detail}>Zarlar dönüyor</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    minHeight: 72,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  caption: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  total: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.title,
  },
  detail: {
    marginTop: 4,
    fontSize: 15,
    color: colors.subtitle,
    textAlign: 'center',
  },
});
