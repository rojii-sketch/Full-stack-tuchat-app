import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0A84FF' },
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { paddingTop: Platform.OS === 'web' ? 20 : 15, paddingBottom: 20, backgroundColor: '#0A84FF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 },
  headerText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  logoutButton: { position: 'absolute', right: 20, bottom: 22 },
  logoutText: { color: 'white', fontSize: 14, fontWeight: '600' },
  backButton: { position: 'absolute', left: 15, bottom: 22 },
  backText: { color: 'white', fontSize: 16, fontWeight: '600' },
  
  // --- INBOX STYLES ---
  inboxContent: { flex: 1, padding: 20 },
  inviteButton: { backgroundColor: '#34C759', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  inviteButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  
  // --- NEW: GENERATED LINK STYLES ---
  generatedLinkContainer: { backgroundColor: '#E5F1FF', padding: 15, borderRadius: 10, marginBottom: 20, alignItems: 'center', borderWidth: 1, borderColor: '#0A84FF' },
  generatedLinkText: { color: '#0A84FF', fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  generatedLinkHint: { color: '#666', fontSize: 12 },

  connectContainer: { flexDirection: 'row', marginBottom: 30 },
  connectInput: { flex: 1, backgroundColor: 'white', height: 50, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, paddingHorizontal: 15, borderWidth: 1, borderColor: '#E5E5EA', borderRightWidth: 0, ...(Platform.OS === 'web' && { outlineStyle: 'none' } as any) },
  connectButton: { backgroundColor: '#0A84FF', justifyContent: 'center', paddingHorizontal: 20, borderTopRightRadius: 10, borderBottomRightRadius: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  inboxRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  inboxRowLeft: { flexDirection: 'row', alignItems: 'center' },
  avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E5E5EA', justifyContent: 'center', alignItems: 'center', marginRight: 15, position: 'relative' },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: '#8E8E93' },
  absoluteOnlineDot: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#34C759', borderWidth: 2, borderColor: 'white' },
  inboxName: { fontSize: 16, fontWeight: '600', color: '#333' },
  
  unreadBadge: { backgroundColor: '#FF3B30', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, minWidth: 24, alignItems: 'center', justifyContent: 'center' },
  unreadBadgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },

  // --- CHAT STYLES ---
  chatList: { padding: 15, paddingBottom: 30 },
  messageBubble: { maxWidth: '75%', minWidth: '20%', padding: 12, borderRadius: 15, marginBottom: 10 },
  myMessage: { backgroundColor: '#0A84FF', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  otherMessage: { backgroundColor: '#E5E5EA', alignSelf: 'flex-start', borderBottomLeftRadius: 2 },
  senderNameText: { color: '#8E8E93', fontSize: 12, fontWeight: '500', marginBottom: 4 },
  myMessageText: { color: 'white', fontSize: 16 },
  otherMessageText: { color: 'black', fontSize: 16 },
  timeText: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  myTimeText: { color: 'rgba(255, 255, 255, 0.7)' },
  otherTimeText: { color: '#8E8E93' },
  typingContainer: { paddingHorizontal: 15, paddingVertical: 5, backgroundColor: '#F5F7FA' },
  typingText: { color: '#8E8E93', fontSize: 13, fontStyle: 'italic' },
  inputContainer: { flexDirection: 'row', padding: 12, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#E5E5EA' },
  textInput: { flex: 1, height: 45, backgroundColor: '#F5F7FA', borderRadius: 25, paddingHorizontal: 20, fontSize: 16, marginRight: 10, ...(Platform.OS === 'web' && { outlineStyle: 'none' } as any) },
  sendButton: { backgroundColor: '#0A84FF', borderRadius: 25, paddingHorizontal: 20, justifyContent: 'center' },
  
  // --- AUTH STYLES ---
  authContainer: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#F5F7FA' },
  authTitle: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: 'white', height: 55, borderRadius: 10, paddingHorizontal: 15, fontSize: 16, marginBottom: 15, borderWidth: 1, borderColor: '#E5E5EA', ...(Platform.OS === 'web' && { outlineStyle: 'none' } as any) },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', height: 55, borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: '#E5E5EA' },
  passwordInput: { flex: 1, fontSize: 16, ...(Platform.OS === 'web' && { outlineStyle: 'none' } as any) },
  toggleText: { color: '#0A84FF', fontWeight: '600', fontSize: 14 },
  primaryButton: { backgroundColor: '#0A84FF', height: 55, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  switchText: { color: '#0A84FF', fontSize: 16, textAlign: 'center', marginTop: 20, fontWeight: '600' },
  forgotButton: { alignSelf: 'flex-end', marginBottom: 15 },
  forgotText: { color: '#0A84FF', fontSize: 14, fontWeight: '500' },
  // --- NEW: EMOJI BAR STYLES ---
  emojiBar: { flexDirection: 'row', backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 8, borderTopWidth: 1, borderColor: '#E5E5EA' },
  emojiButton: { paddingHorizontal: 8, paddingVertical: 4, marginRight: 5 },
  emojiText: { fontSize: 22 },
});