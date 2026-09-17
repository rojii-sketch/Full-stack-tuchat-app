import type { TextStyle } from 'react-native';

/**
 * Reusable typography tokens for TuChat.
 *
 * Follows an 8pt ratio, deliberately avoids very small sizes (no 9–11px
 * text): the smallest token is `meta` at 12px, used only for timestamps and
 * captions. Everything else encourages comfortable reading sizes.
 *
 * `fontWeight` is deliberately a literal union that satisfies RN's
 * TextStyle type while remaining compatible with mixing in other styles at
 * the point of use.
 */

type Weight = '400' | '500' | '600' | '700';

const weight = (v: Weight) => v;

export const typography = {
  /** Large brand moment (auth title, empty states). */
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: weight('700'),
  } as TextStyle,

  /** Top-level screen headers (chat, profile). */
  screenTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: weight('600'),
  } as TextStyle,

  /** Section headers inside a screen. */
  sectionHeading: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: weight('600'),
  } as TextStyle,

  /** Default body text. */
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: weight('400'),
  } as TextStyle,

  /** Emphasized body text (message text, prominent list rows). */
  bodyStrong: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: weight('600'),
  } as TextStyle,

  /** Input values, button labels, list item titles. */
  label: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: weight('500'),
  } as TextStyle,

  /** Compact text: hints, sub-labels, empty-state helpers. */
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: weight('400'),
  } as TextStyle,

  /** Smallest sanctioned text: timestamps, counts, badges. */
  meta: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: weight('400'),
  } as TextStyle,

  /** Emoji-only chat messages (largest rendering used). */
  emojiMessage: {
    fontSize: 40,
    lineHeight: 48,
  } as TextStyle,

  /** Emoji picker / emoji bar items. */
  emoji: {
    fontSize: 24,
    lineHeight: 28,
  } as TextStyle,
};