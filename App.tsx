import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
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
          <ScrollView
            contentContainerStyle={[
              styles.scroll,
              compact && styles.scrollCompact,
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>PinkyDice</Text>
              <Text style={styles.subtitle}>Cute 3D Dice Roller</Text>
            </View>

            <DiceArea
              values={values}
              rollGeneration={rollGeneration}
              isRolling={isRolling}
            />

            <View style={styles.section}>
              <DiceSelector
                count={diceCount}
                onIncrement={incrementDice}
                onDecrement={decrementDice}
                disabled={isRolling}
              />
            </View>

            <ResultSummary values={values} isRolling={isRolling} />

            <View style={styles.footer}>
              <RollButton
                onPress={roll}
                disabled={isRolling}
                loading={isRolling}
              />
            </View>
          </ScrollView>
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
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 16,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  scrollCompact: {
    paddingBottom: 8,
  },
  header: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 20,
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
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 16,
    paddingBottom: 8,
  },
});
