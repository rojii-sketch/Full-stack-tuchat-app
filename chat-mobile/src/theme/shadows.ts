import type { ViewStyle } from 'react-native';

/**
 * Elevation tokens for TuChat.
 *
 * Uses the modern `boxShadow` style introduced in React Native 0.76+ and
 * supported on the app's RN 0.86 / new architecture, so legacy
 * shadowColor/shadowOffset/shadowOpacity/shadowRadius/elevation props become
 * unnecessary. Tokens are kept subtle to avoid heavy decoration.
 *
 * Only specify elevation where it earns contrast (raised buttons, cards,
 * overlays); plain content should omit shadows entirely.
 */

export const shadows = {
  /** Default — no elevation. */
  none: {} as ViewStyle,

  /** Resting cards and list rows. */
  card: {
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
  } as ViewStyle,

  /** Slightly raised interactive elements. */
  menu: {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
  } as ViewStyle,

  /** Overlays, modals, tooltips. */
  overlay: {
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
  } as ViewStyle,
} as const;