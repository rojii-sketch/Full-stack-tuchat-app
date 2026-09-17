/**
 * Backwards-compatible theme entry point.
 *
 * The TuChat design tokens live in `@/theme`. This module keeps the legacy
 * exports (`Colors`, `Fonts`, `Spacing`, `ThemeColor`, `BottomTabInset`,
 * `MaxContentWidth`) used by existing template components, and re-exports
 * the new token namespaces so both can share one source of truth.
 */

import '@/global.css';

import { Platform } from 'react-native';

import { radius, shadows, spacing, typography } from '@/theme';
import { colors, type ThemeColors } from '@/theme/colors';

export { radius, shadows, spacing, typography };
export type { ThemeColors };

export const Colors = colors;
export type ThemeColor = keyof typeof colors.light & keyof typeof colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

/** Legacy 2/4/16/24/32/64 scale used by template components. */
export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;