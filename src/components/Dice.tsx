import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '../constants/colors';
import { ROLL_DURATION_MS, type DieValue } from '../utils/dice';

type DiceProps = {
  value: DieValue;
  size: number;
  index: number;
  rollGeneration: number;
  isRolling: boolean;
};

const PIP_LAYOUT: Record<DieValue, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const STAGGER_MS = 45;

function DiePips({ value, size }: { value: DieValue; size: number }) {
  const pipSize = size * 0.15;
  const inset = size * 0.2;
  const inner = size - inset * 2;
  const cell = inner / 3;

  return (
    <View style={[styles.pipGrid, { width: size, height: size }]}>
      {Array.from({ length: 9 }).map((_, pipIndex) => {
        const show = PIP_LAYOUT[value].includes(pipIndex);
        const row = Math.floor(pipIndex / 3);
        const col = pipIndex % 3;
        return (
          <View
            key={pipIndex}
            style={[
              styles.pipCell,
              {
                left: inset + col * cell + cell / 2 - pipSize / 2,
                top: inset + row * cell + cell / 2 - pipSize / 2,
                width: pipSize,
                height: pipSize,
                borderRadius: pipSize / 2,
                opacity: show ? 1 : 0,
                backgroundColor: colors.pip,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

export function Dice({
  value,
  size,
  index,
  rollGeneration,
  isRolling,
}: DiceProps) {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const rotateZ = useSharedValue(0);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  const [displayValue, setDisplayValue] = useState<DieValue>(value);

  useEffect(() => {
    if (!isRolling) {
      setDisplayValue(value);
    }
  }, [isRolling, value]);

  useEffect(() => {
    if (rollGeneration === 0) {
      return;
    }

    const delay = index * STAGGER_MS;

    cancelAnimation(rotateX);
    cancelAnimation(rotateY);
    cancelAnimation(rotateZ);
    cancelAnimation(scale);
    cancelAnimation(translateX);
    cancelAnimation(translateY);

    rotateX.value = 0;
    rotateY.value = 0;
    rotateZ.value = 0;
    scale.value = 1;
    translateX.value = 0;
    translateY.value = 0;

    rotateX.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, { duration: 200, easing: Easing.linear }),
        5,
        false,
      ),
    );
    rotateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-360, { duration: 260, easing: Easing.linear }),
        4,
        false,
      ),
    );
    rotateZ.value = withDelay(
      delay,
      withSequence(
        withTiming(16, { duration: 110 }),
        withTiming(-10, { duration: 130 }),
        withTiming(0, { duration: 160, easing: Easing.out(Easing.cubic) }),
      ),
    );
    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1.1, { duration: 160, easing: Easing.out(Easing.quad) }),
        withTiming(0.96, { duration: 200 }),
        withTiming(1, {
          duration: ROLL_DURATION_MS - 360,
          easing: Easing.out(Easing.back(1.35)),
        }),
      ),
    );
    translateY.value = withDelay(
      delay,
      withSequence(
        withTiming(-size * 0.14, { duration: 150 }),
        withTiming(size * 0.05, { duration: 170 }),
        withTiming(0, {
          duration: ROLL_DURATION_MS - 320,
          easing: Easing.out(Easing.bounce),
        }),
      ),
    );
    translateX.value = withDelay(
      delay,
      withSequence(
        withTiming(-5, { duration: 130 }),
        withTiming(7, { duration: 150 }),
        withTiming(0, { duration: ROLL_DURATION_MS - 280 }),
      ),
    );
  }, [
    index,
    rollGeneration,
    rotateX,
    rotateY,
    rotateZ,
    scale,
    size,
    translateX,
    translateY,
  ]);

  useEffect(() => {
    if (!isRolling) {
      return;
    }

    const interval = setInterval(() => {
      setDisplayValue((Math.floor(Math.random() * 6) + 1) as DieValue);
    }, 65);

    return () => clearInterval(interval);
  }, [isRolling, rollGeneration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotateX: `${rotateX.value}deg` },
      { rotateY: `${rotateY.value}deg` },
      { rotateZ: `${rotateZ.value}deg` },
      { scale: scale.value },
    ],
  }));

  const radius = useMemo(() => size * 0.22, [size]);

  return (
    <Animated.View style={[animatedStyle, { width: size, height: size }]}>
      <View
        style={[
          styles.dieShadow,
          {
            width: size,
            height: size,
            borderRadius: radius,
            shadowRadius: size * 0.1,
          },
        ]}
      >
        <LinearGradient
          colors={[colors.dieFaceStart, colors.dieFaceEnd]}
          start={{ x: 0.15, y: 0.1 }}
          end={{ x: 0.9, y: 1 }}
          style={[
            styles.dieBody,
            { width: size, height: size, borderRadius: radius },
          ]}
        >
          <LinearGradient
            colors={[colors.dieHighlight, 'transparent']}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.5, y: 0.55 }}
            style={[styles.highlight, { borderRadius: radius }]}
          />
          <View
            style={[
              styles.innerFace,
              {
                width: size * 0.84,
                height: size * 0.84,
                borderRadius: radius * 0.85,
              },
            ]}
          >
            <DiePips value={displayValue} size={size * 0.84} />
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  dieShadow: {
    backgroundColor: colors.dieFaceEnd,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.38,
    elevation: 12,
  },
  dieBody: {
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.dieEdge,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlight: {
    ...StyleSheet.absoluteFillObject,
  },
  innerFace: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pipGrid: {
    position: 'relative',
  },
  pipCell: {
    position: 'absolute',
    shadowColor: '#5A1040',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
});
