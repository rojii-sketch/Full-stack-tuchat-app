import { Image } from 'expo-image';
import { useState } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { StatusDot } from '@/components/ui/status-dot';
import { useTheme } from '@/hooks/use-theme';
import { radius, spacing } from '@/theme';

export type AvatarSize = 'sm' | 'md' | 'lg';

const DIMENSIONS: Record<AvatarSize, number> = {
  sm: 40,
  md: 48,
  lg: 64,
};

const FONT_SIZES: Record<AvatarSize, number> = {
  sm: 16,
  md: 20,
  lg: 28,
};

export interface AvatarProps {
  name?: string;
  source?: { uri?: string | null } | null;
  size?: AvatarSize;
  online?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Avatar({ name = '', source, size = 'md', online = false, style }: AvatarProps) {
  const theme = useTheme();
  const [imageFailed, setImageFailed] = useState(false);
  const dimension = DIMENSIONS[size];

  const initial = (name || '?').trim().charAt(0).toUpperCase() || '?';

  return (
    <View
      accessibilityLabel={online ? `${name}, online` : name}
      style={[style]}>
      <View
        style={{
          width: dimension,
          height: dimension,
          borderRadius: radius.full,
          backgroundColor: theme.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
        {source?.uri && !imageFailed ? (
          <Image
            source={{ uri: source.uri }}
            style={{ width: dimension, height: dimension }}
            contentFit="cover"
            onError={() => setImageFailed(true)}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <Text
            style={{
              color: theme.primaryText,
              fontSize: FONT_SIZES[size],
              fontWeight: '700',
            }}>
            {initial}
          </Text>
        )}
      </View>

      {online ? (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            borderWidth: 2,
            borderColor: theme.surface,
            borderRadius: radius.full,
          }}>
          <StatusDot />
        </View>
      ) : null}
    </View>
  );
}