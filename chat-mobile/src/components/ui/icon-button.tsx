import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { radius, spacing } from '@/theme';

export interface IconButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  children: React.ReactNode;
  accessibilityLabel: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  children,
  accessibilityLabel,
  size = 44,
  disabled,
  style,
  onPress,
  ...rest
}: IconButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: radius.full,
          backgroundColor: pressed ? theme.surfaceElevated : 'transparent',
          opacity: disabled ? 0.4 : 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.xs,
        },
        style,
      ]}
      {...rest}>
      {children}
    </Pressable>
  );
}