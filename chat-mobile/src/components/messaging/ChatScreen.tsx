import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import Check from 'lucide-react-native/icons/check';
import CheckCheck from 'lucide-react-native/icons/check-check';
import Globe2 from 'lucide-react-native/icons/globe-2';
import ImagePlus from 'lucide-react-native/icons/image-plus';
import MessageCircle from 'lucide-react-native/icons/message-circle';
import MoreVertical from 'lucide-react-native/icons/ellipsis-vertical';
import Send from 'lucide-react-native/icons/send';
import Smile from 'lucide-react-native/icons/smile';
import Trash2 from 'lucide-react-native/icons/trash-2';
import UsersRound from 'lucide-react-native/icons/users-round';
import X from 'lucide-react-native/icons/x';
import { useRef, useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, IconButton } from './controls';
import { formatTime, isEmojiOnly } from '../../utils/helpers';
import { colors, styles } from './styles';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  receiverName?: string;
  roomName?: string;
  imageUrl?: string;
  seen?: boolean;
  tags?: string[];
  createdAt?: string;
}


interface ChatScreenProps {
  currentRoom: string | null;
  privateChatUser: string | null;
  setPrivateChatUser: (val: string | null) => void;
  setCurrentRoom: (val: string | null) => void;
  setAuthMode: (mode: 'inbox') => void;
  handleClearChat: () => void;
  displayedMessages: Message[];
  name: string;
  selectedMessageId: string | null;
  setSelectedMessageId: (id: string | null) => void;
  handleDeleteSelectedMessage: () => void;
  activeTypers: string[];
  showImageInput: boolean;
  setShowImageInput: (val: boolean) => void;
  imageUrlInput: string;
  setImageUrlInput: (val: string) => void;
  currentMessage: string;
  handleTextChange: (text: string) => void;
  sendMessage: () => void;
}

const emojis = ['😀', '😂', '😍', '🔥', '👍', '❤️', '🚀', '🎉', '😎', '🙏', '💯', '✨', '💡', '💻', '☕'];

export function ChatScreen({
  currentRoom, privateChatUser, setPrivateChatUser, setCurrentRoom, setAuthMode,
  handleClearChat, displayedMessages, name, selectedMessageId, setSelectedMessageId,
  handleDeleteSelectedMessage, activeTypers, showImageInput, setShowImageInput,
  imageUrlInput, setImageUrlInput, currentMessage, handleTextChange, sendMessage,
}: ChatScreenProps) {
  const flatListRef = useRef<FlatList<Message>>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const title = currentRoom || privateChatUser || 'Global Community';
  const canSend = !!(currentMessage.trim() || imageUrlInput.trim());

  function backToChats() {
    setSelectedMessageId(null);
    setPrivateChatUser(null);
    setCurrentRoom(null);
    setAuthMode('inbox');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={[styles.frame, styles.container]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <IconButton icon={ArrowLeft} label="Back to chats" onPress={backToChats} />
          <Avatar label={title} icon={currentRoom ? UsersRound : privateChatUser ? undefined : Globe2} />
          <View style={chat.heading}>
            <Text accessibilityRole="header" style={chat.title} numberOfLines={1}>{title}</Text>
            <Text style={chat.detail}>{currentRoom ? 'Room' : privateChatUser ? 'Direct message' : 'Public chat'}</Text>
          </View>
          <IconButton icon={MoreVertical} label="Conversation options" active={isMenuVisible} onPress={() => setIsMenuVisible(!isMenuVisible)} />
        </View>

        {isMenuVisible && (
          <Pressable accessibilityRole="button" style={[styles.card, styles.shadow, chat.menu]} onPress={() => {
            setIsMenuVisible(false);
            handleClearChat();
          }}>
            <Trash2 size={17} color={colors.danger} />
            <Text style={[styles.label, { color: colors.danger }]}>Clear chat</Text>
          </Pressable>
        )}

        <FlatList
          ref={flatListRef}
          data={displayedMessages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatList}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={(
            <View style={chat.empty}>
              <View style={styles.avatarPlaceholder}><MessageCircle size={23} color={colors.accent} /></View>
              <Text style={styles.label}>No messages yet</Text>
            </View>
          )}
          renderItem={({ item }) => {
            const isMe = item.senderName === name;
            const isSelected = selectedMessageId === item.id;
            const emojiOnly = !item.imageUrl && isEmojiOnly(item.text);
            const Receipt = item.seen ? CheckCheck : Check;

            return (
              <View style={[chat.message, { alignSelf: isMe ? 'flex-end' : 'flex-start' }]}>
                {isSelected && (
                  <View style={chat.selection}>
                    <IconButton icon={X} label="Deselect message" onPress={() => setSelectedMessageId(null)} />
                    <IconButton icon={Trash2} label="Delete selected message" color={colors.danger} onPress={handleDeleteSelectedMessage} />
                    <Pressable accessibilityRole="button" onPress={() => { setSelectedMessageId(null); handleClearChat(); }}>
                      <Text style={styles.link}>Clear chat</Text>
                    </Pressable>
                  </View>
                )}
                <Pressable
                  onLongPress={() => setSelectedMessageId(item.id)}
                  style={[
                    styles.messageBubble,
                    !emojiOnly && (isMe ? styles.myMessage : styles.otherMessage),
                    isSelected && chat.selected,
                  ]}
                >
                  {!isMe && !emojiOnly && <Text style={styles.senderNameText}>{item.senderName}</Text>}
                  {!!item.imageUrl && <Image source={{ uri: item.imageUrl }} style={chat.image} resizeMode="cover" />}
                  <Text style={emojiOnly ? chat.emoji : styles.messageText}>{item.text}</Text>
                  {!emojiOnly && (
                    <View style={chat.receipt}>
                      <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
                      {isMe && <Receipt size={14} color={item.seen ? colors.accent : colors.muted} />}
                    </View>
                  )}
                </Pressable>
              </View>
            );
          }}
        />

        {activeTypers.length > 0 && (
          <View style={styles.typingContainer}>
            <Text style={styles.typingText}>{activeTypers.join(', ')} {activeTypers.length === 1 ? 'is' : 'are'} typing…</Text>
          </View>
        )}

        {showImageInput && (
          <View style={styles.inputContainer}>
            <TextInput accessibilityLabel="Image URL" style={styles.textInput} placeholder="Paste image URL" value={imageUrlInput} onChangeText={setImageUrlInput} keyboardType="url" autoCapitalize="none" />
            <IconButton icon={X} label="Remove image URL" onPress={() => { setShowImageInput(false); setImageUrlInput(''); }} />
          </View>
        )}

        {showEmojis && (
          <View style={styles.emojiBar}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              data={emojis}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <Pressable accessibilityRole="button" style={styles.emojiButton} onPress={() => handleTextChange(currentMessage + item)}>
                  <Text style={styles.emojiText}>{item}</Text>
                </Pressable>
              )}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <IconButton icon={Smile} label="Toggle emoji picker" active={showEmojis} onPress={() => setShowEmojis(!showEmojis)} />
          <IconButton icon={ImagePlus} label="Attach image by URL" active={showImageInput} onPress={() => setShowImageInput(!showImageInput)} />
          <TextInput
            accessibilityLabel="Message"
            style={styles.textInput}
            placeholder="Message"
            value={currentMessage}
            onChangeText={handleTextChange}
            onSubmitEditing={sendMessage}
          />
          <Pressable accessibilityRole="button" accessibilityLabel="Send message" disabled={!canSend} style={[styles.sendButton, !canSend && { opacity: 0.5 }]} onPress={sendMessage}>
            <Send size={18} color={colors.paper} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const chat = StyleSheet.create({
  heading: { flex: 1, minWidth: 0, gap: 2 },
  title: { color: colors.ink, fontSize: 17, fontWeight: '800' },
  detail: { color: colors.muted, fontSize: 12 },
  menu: { position: 'absolute', right: 10, top: 61, zIndex: 2, flexDirection: 'row', alignItems: 'center' },
  empty: { alignSelf: 'center', alignItems: 'center', gap: 8, padding: 14 },
  message: { maxWidth: '82%', marginVertical: 3 },
  selection: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  selected: { borderColor: colors.accent, borderWidth: 1 },
  image: { width: 192, maxWidth: '100%', height: 144, borderRadius: 10, marginBottom: 5 },
  emoji: { fontSize: 34 },
  receipt: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 3 },
});
