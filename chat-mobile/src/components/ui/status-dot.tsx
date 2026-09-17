import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { radius } from '@/theme';

export interface StatusDotProps {
  /** Success (online) by default; pass a theme color string to customize. */
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function StatusDot({ color, size = 12, style }: StatusDotProps) {
  const theme = useTheme();

  return (
    <View
      accessible={false}
      style={[
        {
          width: size,
          height: size,
          borderRadius: radius.full,
          backgroundColor: color ?? theme.success,
        },
        style,
      ]}
    />
  );
}