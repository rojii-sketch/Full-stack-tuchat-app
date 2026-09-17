import { Pressable, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { radius, shadows, spacing } from '@/theme';

export interface CardProps extends Omit<PressableProps, 'style' | 'children'> {
  children: React.ReactNode;
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, elevated = false, style, onPress, ...rest }: CardProps) {
  const theme = useTheme();

  const content = (
    <View
      style={[
        {
          backgroundColor: theme.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: theme.borderSubtle,
          padding: spacing.lg,
          ...(elevated ? shadows.card : shadows.none),
        },
        style,
      ]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
        {...rest}>
        {content}
      </Pressable>
    );
  }

  return content;
}