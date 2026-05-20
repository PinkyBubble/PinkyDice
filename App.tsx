import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { DiceArea } from './src/components/DiceArea';
import { DiceSelector } from './src/components/DiceSelector';
import { ResultSummary } from './src/components/ResultSummary';
import { RollButton } from './src/components/RollButton';
import { colors } from './src/constants/colors';
import { useDiceRoll } from './src/hooks/useDiceRoll';

export default function App() {
  const { height } = useWindowDimensions();
  const compact = height < 700;

  const {
    diceCount,
    values,
    isRolling,
    rollGeneration,
    incrementDice,
    decrementDice,
    roll,
  } = useDiceRoll();

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={[colors.backgroundStart, colors.backgroundEnd]}
        style={styles.gradient}
      >
        <StatusBar style="dark" />
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={styles.screen}>
            <View style={[styles.header, compact && styles.headerCompact]}>
              <Text style={styles.title}>PinkyDice</Text>
              <Text style={styles.subtitle}>Cute 3D Dice Roller</Text>
            </View>

            <View style={styles.main}>
              <DiceArea
                values={values}
                rollGeneration={rollGeneration}
                isRolling={isRolling}
                compact={compact}
              />

              <View style={[styles.section, compact && styles.sectionCompact]}>
                <DiceSelector
                  count={diceCount}
                  onIncrement={incrementDice}
                  onDecrement={decrementDice}
                  disabled={isRolling}
                />
              </View>

              <ResultSummary
                values={values}
                isRolling={isRolling}
                compact={compact}
              />
            </View>

            <View style={styles.footer}>
              <RollButton
                onPress={roll}
                disabled={isRolling}
                loading={isRolling}
              />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerCompact: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 0,
  },
  section: {
    marginTop: 16,
    marginBottom: 4,
  },
  sectionCompact: {
    marginTop: 10,
  },
  footer: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.title,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '500',
    color: colors.subtitle,
  },
});
