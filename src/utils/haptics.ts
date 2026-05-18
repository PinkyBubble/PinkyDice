import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export async function hapticRollStart(): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    // Simulator or unsupported device
  }
}

export async function hapticRollEnd(): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Simulator or unsupported device
  }
}
