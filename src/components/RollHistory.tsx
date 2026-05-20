import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';
import type { RollHistoryEntry } from '../types/dice';
import { formatHistoryTime, formatRollLine } from '../utils/history';

type RollHistoryProps = {
  history: RollHistoryEntry[];
};

export function RollHistory({ history }: RollHistoryProps) {
  if (history.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No rolls yet</Text>
        <Text style={styles.emptyHint}>Your last 10 rolls will appear here</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.list}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      {history.map((entry, index) => (
        <View key={entry.id} style={styles.row}>
          <View style={styles.rowMain}>
            <Text style={styles.rollLabel}>Roll #{index + 1}</Text>
            <Text style={styles.rollValues} numberOfLines={1}>
              {formatRollLine(entry.values)}
            </Text>
          </View>
          <Text style={styles.time}>{formatHistoryTime(entry.timestamp)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    maxHeight: 220,
  },
  listContent: {
    gap: 8,
    paddingBottom: 4,
  },
  empty: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: colors.selectorBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.selectorBorder,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMuted,
  },
  emptyHint: {
    marginTop: 6,
    fontSize: 13,
    color: colors.subtitle,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.selectorBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.selectorBorder,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  rowMain: {
    flex: 1,
    minWidth: 0,
  },
  rollLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  rollValues: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  time: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.subtitle,
  },
});
