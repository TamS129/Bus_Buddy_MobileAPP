import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',

  // Add mappings for MaterialIcons like plus and heart
  'add.fill': 'add', // Plus icon
  'heart.fill': 'favorite', // Heart icon
} as Partial<Record<string, React.ComponentProps<typeof MaterialIcons>['name']>>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses MaterialIcons on Android and web.
 * It now supports a custom mapping for icons like the plus and heart.
 */
export function IconSymbol({
  name,
  size = 100,
  color,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} />;
}
