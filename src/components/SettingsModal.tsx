import { LinearGradient } from 'expo-linear-gradient';
import {
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { usePinkyDice } from '../context/PinkyDiceContext';
import { colors } from '../constants/colors';
import { DiceSelector } from './DiceSelector';
import { RollHistory } from './RollHistory';
import { ShakeIndicator } from './ShakeIndicator';

function SettingRow({
  label,
  description,
  value,
  onValueChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingText}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description ? (
          <Text style={styles.settingDesc}>{description}</Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E8B8D0', true: colors.primary }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E8B8D0"
      />
    </View>
  );
}

export function SettingsModal() {
  const {
    settingsVisible,
    closeSettings,
    soundEnabled,
    setSoundEnabled,
    shakeEnabled,
    setShakeEnabled,
    rollHistory,
    diceCount,
    incrementDice,
    decrementDice,
    isRolling,
  } = usePinkyDice();

  return (
    <Modal
      visible={settingsVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={closeSettings}
    >
      <LinearGradient
        colors={[colors.backgroundStart, colors.backgroundEnd]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Pressable
            onPress={closeSettings}
            hitSlop={12}
            style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}
            accessibilityLabel="Close settings"
          >
            <Text style={styles.closeText}>Done</Text>
          </Pressable>
        </View>

        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <SettingRow
              label="Dice roll sound"
              description="Plays when a roll starts"
              value={soundEnabled}
              onValueChange={setSoundEnabled}
            />
            <View style={styles.divider} />
            <SettingRow
              label="Shake to roll"
              description="Shake your phone to roll"
              value={shakeEnabled}
              onValueChange={setShakeEnabled}
            />
            <View style={styles.shakeBlock}>
              <ShakeIndicator enabled={shakeEnabled} />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Dice</Text>
          <View style={styles.card}>
            <DiceSelector
              count={diceCount}
              onIncrement={incrementDice}
              onDecrement={decrementDice}
              disabled={isRolling}
            />
          </View>

          <Text style={styles.sectionTitle}>Last 10 rolls</Text>
          <RollHistory history={rollHistory} />
        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.title,
  },
  closeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.selectorBg,
    borderWidth: 1,
    borderColor: colors.selectorBorder,
  },
  closeText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  body: {
    flex: 1,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  settingDesc: {
    marginTop: 2,
    fontSize: 13,
    color: colors.subtitle,
  },
  divider: {
    height: 1,
    backgroundColor: colors.selectorBorder,
    marginVertical: 4,
  },
  shakeBlock: {
    marginTop: 8,
    paddingTop: 4,
  },
});
