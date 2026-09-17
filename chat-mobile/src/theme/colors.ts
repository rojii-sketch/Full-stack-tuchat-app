/**
 * Semantic color tokens for TuChat.
 *
 * Screens and UI primitives should reference these semantic roles rather
 * than raw hex values, so light/dark mode and future brand changes stay
 * localized to this single file.
 *
 * Accessibility intent (WCAG AA ~4.5:1 for normal text on its background):
 * - text / textInverse / onPrimary satisfy AA on their intended surfaces.
 * - textSecondary is for supporting text (kept above ~4.5:1 on surfaces).
 * - textMuted is for captions/meta on surfaces (~4.6:1) — readable, not decorative.
 * - status colors are used for filled badges + large/bold text; keep paired
 *   with their `*Text` semantic tokens for small text usage.
 */

const light = {
  // Surfaces
  background: '#F5F7FA' as const,
  surface: '#FFFFFF' as const,
  surfaceElevated: '#FFFFFF' as const,
  backgroundElement: '#F0F0F3' as const,
  backgroundSelected: '#E0E1E6' as const,

  // Text
  text: '#1C1C1E' as const,
  textInverse: '#FFFFFF' as const,
  textSecondary: '#48484D' as const,
  textMuted: '#6E6E75' as const,

  // Borders / dividers
  border: '#E5E5EA' as const,
  borderSubtle: '#EFEFF2' as const,

  // Brand / actions
  primary: '#0066CC' as const,
  primaryPressed: '#0059B3' as const,
  onPrimary: '#FFFFFF' as const,
  primaryText: '#0A6FD6' as const,
  primarySoft: '#E5F1FF' as const,

  // Status
  success: '#34C759' as const,
  successText: '#1F9D50' as const,
  warning: '#FF9500' as const,
  warningText: '#9A5B00' as const,
  danger: '#FF3B30' as const,
  dangerText: '#E03127' as const,

  // Chat bubbles
  bubbleIncoming: '#E9E9EC' as const,
  bubbleIncomingText: '#1C1C1E' as const,
  bubbleOutgoing: '#0A84FF' as const,
  bubbleOutgoingText: '#FFFFFF' as const,

  // Overlay (modal scrim / tooltips)
  overlay: 'rgba(0, 0, 0, 0.5)' as const,
};

const dark = {
  // Surfaces
  background: '#0B0B0E' as const,
  surface: '#1C1C1F' as const,
  surfaceElevated: '#242428' as const,
  backgroundElement: '#212225' as const,
  backgroundSelected: '#2E3135' as const,

  // Text
  text: '#ECECEE' as const,
  textInverse: '#FFFFFF' as const,
  textSecondary: '#B0B2B8' as const,
  textMuted: '#9DA0A7' as const,

  // Borders / dividers
  border: '#3A3A3F' as const,
  borderSubtle: '#2E2E32' as const,

  // Brand / actions
  primary: '#0A84FF' as const,
  primaryPressed: '#2F92FF' as const,
  onPrimary: '#FFFFFF' as const,
  primaryText: '#5CA6FF' as const,
  primarySoft: '#12314D' as const,

  // Status
  success: '#30D158' as const,
  successText: '#4CDE79' as const,
  warning: '#FF9F0A' as const,
  warningText: '#FFC061' as const,
  danger: '#FF453A' as const,
  dangerText: '#FF6B6A' as const,

  // Chat bubbles
  bubbleIncoming: '#2C2C30' as const,
  bubbleIncomingText: '#ECECEE' as const,
  bubbleOutgoing: '#0A84FF' as const,
  bubbleOutgoingText: '#FFFFFF' as const,

  // Overlay (modal scrim / tooltips)
  overlay: 'rgba(0, 0, 0, 0.6)' as const,
};

export type ThemeColors = typeof light;

export const colors = { light, dark } as const;