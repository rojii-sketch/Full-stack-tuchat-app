import { Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { radius, spacing } from '@/theme';

export interface BadgeProps {
  children: React.ReactNode;
  color?: 'danger' | 'success' | 'warning' | 'neutral';
  style?: StyleProp<ViewStyle>;
}

export function Badge({ children, color = 'neutral', style }: BadgeProps) {
  const theme = useTheme();

  const backgroundColor =
    color === 'danger'
      ? theme.danger
      : color === 'success'
        ? theme.success
        : color === 'warning'
          ? theme.warning
          : theme.backgroundElement;

  const foreground =
    color === 'neutral'
      ? theme.textSecondary
      : color === 'warning'
        ? theme.textInverse
        : theme.textInverse;

  return (
    <View
      accessible
      accessibilityRole="text"
      style={[
        {
          backgroundColor,
          borderRadius: radius.full,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.hairline + 1,
          minWidth: 22,
          minHeight: 20,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}>
      <Text
        style={{
          color: foreground,
          fontSize: 12,
          lineHeight: 16,
          fontWeight: '700',
        }}>
        {children}
      </Text>
    </View>
  );
}