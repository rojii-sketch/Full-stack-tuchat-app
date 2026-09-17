import { ActivityIndicator, Pressable, Text, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { radius, spacing, typography } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

const HEIGHTS: Record<ButtonSize, number> = {
  sm: 44,
  md: 50,
  lg: 56,
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  style,
  onPress,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const background =
    variant === 'primary'
      ? theme.primary
      : variant === 'secondary'
        ? theme.surface
        : variant === 'destructive'
          ? theme.danger
          : 'transparent';

  const foreground =
    variant === 'primary'
      ? theme.onPrimary
      : variant === 'destructive'
        ? theme.textInverse
        : theme.primaryText;

  const borderColor =
    variant === 'secondary' ? theme.border : variant === 'ghost' ? 'transparent' : 'transparent';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityHint={rest.accessibilityHint}
      onPress={onPress}
      disabled={isDisabled}
      hitSlop={size === 'sm' ? 6 : undefined}
      style={({ pressed }) => [
        {
          minHeight: HEIGHTS[size],
          borderRadius: radius.md,
          paddingHorizontal: size === 'lg' ? spacing.xl : spacing.lg,
          backgroundColor: background,
          borderWidth: 1,
          borderColor,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          opacity: isDisabled ? 0.5 : pressed ? 0.82 : 1,
        },
        style,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator size="small" color={foreground} />
      ) : (
        <Text
          style={[
            typography.label,
            {
              color: foreground,
              fontWeight: '700',
              textAlign: 'center',
            },
          ]}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}