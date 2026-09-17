import { useState } from 'react';
import {
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { radius, spacing, typography } from '@/theme';

export interface TextFieldProps extends TextInputProps {
  label?: string;
  helper?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function TextField({
  label,
  helper,
  error,
  containerStyle,
  style,
  onFocus,
  onBlur,
  editable,
  ...rest
}: TextFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? theme.danger
    : focused
      ? theme.primary
      : theme.border;

  return (
    <View style={containerStyle}>
      {label ? (
        <Text
          style={[
            typography.caption,
            { color: theme.textSecondary, marginBottom: spacing.xs },
          ]}>
          {label}
        </Text>
      ) : null}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 50,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor,
          backgroundColor: theme.surface,
          paddingHorizontal: spacing.md,
        }}>
        <TextInput
          editable={editable}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          accessibilityLabel={label ?? rest.placeholder}
          placeholderTextColor={theme.textMuted}
          style={[
            {
              flex: 1,
              color: theme.text,
              paddingVertical: spacing.sm,
              fontSize: typography.body.fontSize,
            },
            style,
          ]}
          {...rest}
        />
      </View>

      {error ? (
        <Text
          style={[
            typography.caption,
            { color: theme.dangerText, marginTop: spacing.xs },
          ]}>
          {error}
        </Text>
      ) : helper ? (
        <Text
          style={[
            typography.caption,
            { color: theme.textMuted, marginTop: spacing.xs },
          ]}>
          {helper}
        </Text>
      ) : null}
    </View>
  );
}