import { Platform } from 'react-native';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
  // Handle the haptic feedback within the event handler for Android only
  const handlePressIn = (ev: any) => {
    if (Platform.OS === 'android') {  // Ensure Android-only check
      // Add a soft haptic feedback when pressing down on the tabs.
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    props.onPressIn?.(ev);  
  };

  return (
    <PlatformPressable
      {...props}
      onPressIn={handlePressIn} // Always call the handler unconditionally
    />
  );
}
