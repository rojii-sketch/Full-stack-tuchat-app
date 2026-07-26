export const encodeInvite = (str: string) => {
  const hex = Array.from(str).map(c => c.charCodeAt(0).toString(16).toUpperCase()).join('');
  return hex.match(/.{1,4}/g)?.join('-') || hex;
};

export const decodeInvite = (str: string) => {
  try {
    const cleanHex = str.replace(/-/g, '');
    if (/^[0-9A-Fa-f]+$/.test(cleanHex) && cleanHex.length % 2 === 0) {
      const match = cleanHex.match(/.{1,2}/g);
      if (match) {
         return match.map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
      }
    }
    return str;
  } catch (e) {
    return str;
  }
};

export const isEmojiOnly = (str: string) => {
  const trimmed = str.trim();
  if (!trimmed || trimmed.length > 10) return false;
  try {
    const emojiRegex = /^(\p{Extended_Pictographic}|\p{Emoji_Component}|\s)+$/u;
    return emojiRegex.test(trimmed);
  } catch (e) {
    return /[\uD83C-\uDBFF\uDC00-\uDFFF]+/g.test(trimmed);
  }
};

export const formatTime = (dateString?: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};