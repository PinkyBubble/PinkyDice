import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../constants/colors';

type RollButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function RollButton({ onPress, disabled, loading }: RollButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Roll dice"
      onPress={onPress}
      disabled={isDisabled}
      hitSlop={4}
      accessibilityState={{ disabled: isDisabled, busy: !!loading }}
      style={({ pressed }) => [
        styles.pressable,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      <LinearGradient
        colors={
          isDisabled
            ? ['#E8A8C8', '#D88AB5']
            : [colors.primary, colors.primaryPressed]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {loading ? (
          <>
            <ActivityIndicator color={colors.primaryText} size="small" />
            <Text style={[styles.label, styles.loadingLabel]}>Rolling…</Text>
          </>
        ) : (
          <Text style={styles.label}>Roll dice</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.85,
    shadowOpacity: 0.15,
  },
  gradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    flexDirection: 'row',
    gap: 10,
  },
  loadingLabel: {
    fontSize: 18,
    opacity: 0.95,
  },
  label: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryText,
    letterSpacing: 0.5,
  },
});
