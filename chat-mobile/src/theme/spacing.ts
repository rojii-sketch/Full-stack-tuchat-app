/**
 * 4pt-based spacing scale for TuChat.
 *
 * Prefer these tokens over arbitrary per-screen margin/padding values so
 * rhythm stays consistent across screens. Aliased names map to common
 * 4/8/12/16/20/24/32 steps.
 */

export const spacing = {
  /** 2 — micro gaps inside badges / dividers. */
  hairline: 2,
  /** 4 — minimum gutter between related inline elements. */
  xs: 4,
  /** 8 — small gaps between stacked elements. */
  sm: 8,
  /** 12 — default padding for controls and list rows. */
  md: 12,
  /** 16 — standard content padding inside cards/screens. */
  lg: 16,
  /** 20 — comfortable padding for large controls. */
  xl: 20,
  /** 24 — grouping between sections. */
  xxl: 24,
  /** 32 — extra-large grouping. */
  xxxl: 32,
} as const;

export type SpacingToken = keyof typeof spacing;