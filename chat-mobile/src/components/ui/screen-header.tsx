import { Platform, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { spacing, typography } from '@/theme';

export interface ScreenHeaderProps {
  title: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ScreenHeader({ title, left, right, style }: ScreenHeaderProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.primary,
          paddingTop: Platform.OS === 'web' ? spacing.lg : 12,
          paddingBottom: spacing.lg,
          paddingHorizontal: spacing.lg,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        },
        style,
      ]}>
      {left ? (
        <View
          style={{
            position: 'absolute',
            left: spacing.md,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
          }}>
          {left}
        </View>
      ) : null}

      <Text
        accessibilityRole="header"
        style={[
          typography.screenTitle,
          { color: theme.onPrimary, textAlign: 'center' },
        ]}>
        {title}
      </Text>

      {right ? (
        <View
          style={{
            position: 'absolute',
            right: spacing.md,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
          }}>
          {right}
        </View>
      ) : null}
    </View>
  );
}