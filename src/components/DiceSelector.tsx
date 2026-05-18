import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';
import { MAX_DICE, MIN_DICE } from '../utils/dice';

type DiceSelectorProps = {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
};

export function DiceSelector({
  count,
  onIncrement,
  onDecrement,
  disabled,
}: DiceSelectorProps) {
  const atMin = count <= MIN_DICE;
  const atMax = count >= MAX_DICE;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Zar sayısı</Text>
      <View style={styles.row}>
        <Pressable
          accessibilityLabel="Zar sayısını azalt"
          onPress={onDecrement}
          disabled={disabled || atMin}
          hitSlop={8}
          style={({ pressed }) => [
            styles.button,
            (disabled || atMin) && styles.buttonDisabled,
            pressed && !atMin && !disabled && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>−</Text>
        </Pressable>
        <View style={styles.countBox}>
          <Text style={styles.count}>{count}</Text>
        </View>
        <Pressable
          accessibilityLabel="Zar sayısını artır"
          onPress={onIncrement}
          disabled={disabled || atMax}
          hitSlop={8}
          style={({ pressed }) => [
            styles.button,
            (disabled || atMax) && styles.buttonDisabled,
            pressed && !atMax && !disabled && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.selectorBg,
    borderWidth: 1,
    borderColor: colors.selectorBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    transform: [{ scale: 0.96 }],
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 26,
    fontWeight: '600',
    color: colors.primary,
    lineHeight: 28,
  },
  countBox: {
    minWidth: 56,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.selectorBg,
    borderWidth: 1,
    borderColor: colors.selectorBorder,
    alignItems: 'center',
  },
  count: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.title,
  },
});
