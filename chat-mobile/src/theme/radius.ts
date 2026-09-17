/**
 * Corner-radius tokens for TuChat.
 *
 * Map to the audit's existing radii while normalizing the scattered
 * 6/8/10/12/15/20/25/40 literals into a small, predictable set.
 */

export const radius = {
  /** Small controls, discreet elements. */
  sm: 6,
  /** Inputs, buttons, badges. */
  md: 10,
  /** Cards, list rows, menus. */
  lg: 12,
  /** Message bubbles and larger surfaces. */
  xl: 15,
  /** Featured/large surfaces (image messages, big cards). */
  xxl: 20,
  /** Fully rounded: avatars, pills, circular control surfaces. */
  full: 999,
} as const;

export type RadiusToken = keyof typeof radius;