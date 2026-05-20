import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '../constants/colors';

type ShakeIndicatorProps = {
  enabled: boolean;
  compact?: boolean;
};

export function ShakeIndicator({ enabled, compact }: ShakeIndicatorProps) {
  const rotate = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (!enabled) {
      rotate.value = 0;
      translateX.value = 0;
      return;
    }

    rotate.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 90, easing: Easing.inOut(Easing.quad) }),
        withTiming(10, { duration: 90, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 80 }),
      ),
      -1,
      false,
    );
    translateX.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 90 }),
        withTiming(3, { duration: 90 }),
        withTiming(0, { duration: 80 }),
      ),
      -1,
      false,
    );
  }, [enabled, rotate, translateX]);

  const phoneStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <View
      style={[styles.wrap, compact && styles.wrapCompact, !enabled && styles.disabled]}
    >
      <Animated.View style={[styles.phone, phoneStyle]}>
        <View style={styles.phoneScreen} />
      </Animated.View>
      <Text style={[styles.label, !enabled && styles.labelDisabled]}>
        {enabled ? 'Shake to roll' : 'Shake to roll off'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
    opacity: 1,
  },
  wrapCompact: {
    marginBottom: 4,
  },
  disabled: {
    opacity: 0.45,
  },
  phone: {
    width: 22,
    height: 34,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 3,
    justifyContent: 'center',
  },
  phoneScreen: {
    flex: 1,
    borderRadius: 3,
    backgroundColor: colors.primary,
    opacity: 0.35,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.subtitle,
  },
  labelDisabled: {
    color: colors.textMuted,
  },
});
