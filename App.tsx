import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { DiceArea } from './src/components/DiceArea';
import { RollButton } from './src/components/RollButton';
import { SettingsModal } from './src/components/SettingsModal';
import { ShakeIndicator } from './src/components/ShakeIndicator';
import { colors } from './src/constants/colors';
import { PinkyDiceProvider, usePinkyDice } from './src/context/PinkyDiceContext';

function MainScreen() {
  const { height } = useWindowDimensions();
  const compact = height < 700;

  const {
    values,
    isRolling,
    rollGeneration,
    roll,
    shakeEnabled,
    openSettings,
  } = usePinkyDice();

  return (
    <>
      <LinearGradient
        colors={[colors.backgroundStart, colors.backgroundEnd]}
        style={styles.gradient}
      >
        <StatusBar style="dark" />
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={styles.screen}>
            <View style={[styles.header, compact && styles.headerCompact]}>
              <View style={styles.headerSpacer} />
              <View style={styles.headerCenter}>
                <Text style={styles.title}>PinkyDice</Text>
                <Text style={styles.subtitle}>Cute 3D Dice Roller</Text>
              </View>
              <Pressable
                onPress={openSettings}
                style={({ pressed }) => [
                  styles.settingsBtn,
                  pressed && styles.settingsBtnPressed,
                ]}
                accessibilityLabel="Open settings"
                hitSlop={8}
              >
                <Text style={styles.settingsIcon}>⚙</Text>
              </Pressable>
            </View>

            <View style={styles.main}>
              <DiceArea
                values={values}
                rollGeneration={rollGeneration}
                isRolling={isRolling}
                compact={compact}
              />
            </View>

            <View style={styles.footer}>
              <ShakeIndicator enabled={shakeEnabled} compact={compact} />
              <RollButton
                onPress={roll}
                disabled={isRolling}
                loading={isRolling}
              />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
      <SettingsModal />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PinkyDiceProvider>
        <MainScreen />
      </PinkyDiceProvider>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerCompact: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  headerSpacer: {
    width: 44,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.selectorBg,
    borderWidth: 1,
    borderColor: colors.selectorBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
  settingsIcon: {
    fontSize: 22,
    color: colors.primary,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 0,
  },
  footer: {
    paddingTop: 8,
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
