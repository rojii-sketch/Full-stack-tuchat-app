import { Platform, StyleSheet } from 'react-native';

export const colors = {
  ink: '#142a24',
  muted: '#536c62',
  accent: '#11684f',
  accentDark: '#103b32',
  mint: '#d9f1e6',
  canvas: '#edf4f0',
  paper: '#ffffff',
  line: '#dde8e1',
  danger: '#a6313c',
};

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  frame: { flex: 1, width: '100%', maxWidth: 1080, alignSelf: 'center', backgroundColor: colors.paper },
  container: { flex: 1, backgroundColor: colors.canvas },
  header: {
    minHeight: 70, paddingHorizontal: 16, flexDirection: 'row',
    alignItems: 'center', gap: 12, backgroundColor: colors.paper,
    borderBottomWidth: 1, borderColor: colors.line,
  },
  headerText: { flex: 1, color: colors.ink, fontSize: 19, fontWeight: '700' },
  iconButton: {
    width: 44, height: 44, borderRadius: 14, alignItems: 'center',
    justifyContent: 'center', backgroundColor: colors.canvas,
  },
  avatarPlaceholder: {
    width: 46, height: 46, borderRadius: 16, backgroundColor: colors.mint,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: colors.accentDark },
  input: {
    backgroundColor: colors.paper, color: colors.ink, minHeight: 50, borderRadius: 13,
    paddingHorizontal: 14, fontSize: 16, borderWidth: 1, borderColor: colors.line,
  },
  primaryButton: {
    backgroundColor: colors.accent, minHeight: 48, borderRadius: 13, paddingHorizontal: 16,
    justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8,
  },
  buttonText: { color: colors.paper, fontSize: 15, fontWeight: '700' },
  link: { color: colors.accent, fontSize: 14, fontWeight: '700' },
  label: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  messageBubble: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 16 },
  myMessage: { backgroundColor: colors.mint, borderBottomRightRadius: 4 },
  otherMessage: { backgroundColor: colors.paper, borderBottomLeftRadius: 4 },
  senderNameText: { color: colors.accent, fontSize: 12, fontWeight: '700', marginBottom: 4 },
  messageText: { color: colors.ink, fontSize: 16, lineHeight: 23 },
  timeText: { color: colors.muted, fontSize: 11 },
  chatList: { flexGrow: 1, padding: 18 },
  typingContainer: { paddingHorizontal: 18, paddingVertical: 5 },
  typingText: { color: colors.accent, fontSize: 13, fontStyle: 'italic' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 6, padding: 10,
    backgroundColor: colors.paper, borderTopWidth: 1, borderColor: colors.line,
  },
  textInput: {
    flex: 1, minWidth: 0, minHeight: 44, backgroundColor: colors.canvas, color: colors.ink,
    borderRadius: 15, paddingHorizontal: 14, fontSize: 16,
  },
  emojiBar: { backgroundColor: colors.paper, paddingHorizontal: 10, paddingVertical: 6 },
  emojiButton: { paddingHorizontal: 8, paddingVertical: 4 },
  emojiText: { fontSize: 24 },
  sendButton: {
    width: 44, height: 44, borderRadius: 14, alignItems: 'center',
    justifyContent: 'center', backgroundColor: colors.accent,
  },
  title: { color: colors.ink, fontSize: 30, fontWeight: '800', letterSpacing: -0.8 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  card: {
    padding: 16, gap: 12, backgroundColor: colors.paper,
    borderWidth: 1, borderColor: colors.line, borderRadius: 18,
  },
  shadow: Platform.select({
    web: { boxShadow: '0 16px 50px rgba(16, 59, 50, 0.10)' },
    default: { elevation: 3, shadowColor: colors.accentDark, shadowOpacity: 0.12, shadowRadius: 14 },
  }),
});
