import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, Image } from 'react-native';
import { styles } from '../styles';
import { formatTime, isEmojiOnly } from '../utils/helpers';

interface ChatScreenProps {
  currentRoom: string | null;
  privateChatUser: string | null;
  setPrivateChatUser: (val: string | null) => void;
  setCurrentRoom: (val: string | null) => void;
  setAuthMode: (mode: 'inbox') => void;
  handleClearChat: () => void;
  displayedMessages: any[];
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
  setCurrentMessage: React.Dispatch<React.SetStateAction<string>>;
  handleTextChange: (text: string) => void;
  sendMessage: () => void;
}

export function ChatScreen({
  currentRoom, privateChatUser, setPrivateChatUser, setCurrentRoom, setAuthMode,
  handleClearChat, displayedMessages, name, selectedMessageId, setSelectedMessageId,
  handleDeleteSelectedMessage, activeTypers, showImageInput, setShowImageInput,
  imageUrlInput, setImageUrlInput, currentMessage, setCurrentMessage, handleTextChange, sendMessage
}: ChatScreenProps) {
  const flatListRef = useRef<FlatList>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        {/* --- CHAT HEADER WITH THREE-DOT MENU --- */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => { setPrivateChatUser(null); setCurrentRoom(null); setAuthMode('inbox'); }}>
            <Text style={styles.backText}>{'< Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>{currentRoom ? currentRoom : (privateChatUser ? privateChatUser : 'Global Community')}</Text>
          
          <TouchableOpacity style={styles.logoutButton} onPress={() => setIsMenuVisible(!isMenuVisible)}>
            <Text style={[styles.logoutText, { fontSize: 20, fontWeight: 'bold' }]}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* --- DROPDOWN MENU OVERLAY --- */}
        {isMenuVisible && (
          <View style={{
            position: 'absolute',
            top: 60,
            right: 15,
            backgroundColor: '#fff',
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
            zIndex: 100,
            width: 140,
            paddingVertical: 5
          }}>
            <TouchableOpacity 
              onPress={() => { 
                setIsMenuVisible(false); 
                handleClearChat(); 
              }}
              style={{ paddingVertical: 10, paddingHorizontal: 15 }}
            >
              <Text style={{ color: '#FF3B30', fontWeight: '600', fontSize: 14 }}>Clear Chat</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <FlatList
          ref={flatListRef}
          data={displayedMessages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            const isMe = item.senderName === name; 
            const isSelected = selectedMessageId === item.id;
            const emojiOnly = isEmojiOnly(item.text);

            return (
              <View style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', marginVertical: 4 }}>
                {isSelected && (
                  <View style={{
                    flexDirection: 'row', backgroundColor: '#333', borderRadius: 8,
                    paddingHorizontal: 8, paddingVertical: 4, marginBottom: 4,
                    alignSelf: 'center', alignItems: 'center', elevation: 3
                  }}>
                    <TouchableOpacity onPress={() => setSelectedMessageId(null)} style={{ paddingHorizontal: 8, paddingVertical: 2 }}>
                      <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Cancel</Text>
                    </TouchableOpacity>
                    <View style={{ width: 1, height: 12, backgroundColor: '#555', marginHorizontal: 4 }} />
                    <TouchableOpacity onPress={handleDeleteSelectedMessage} style={{ paddingHorizontal: 8, paddingVertical: 2 }}>
                      <Text style={{ color: '#FF3B30', fontSize: 12, fontWeight: 'bold' }}>Delete</Text>
                    </TouchableOpacity>
                    <View style={{ width: 1, height: 12, backgroundColor: '#555', marginHorizontal: 4 }} />
                    <TouchableOpacity onPress={() => { setSelectedMessageId(null); handleClearChat(); }} style={{ paddingHorizontal: 8, paddingVertical: 2 }}>
                      <Text style={{ color: '#FF9500', fontSize: 12, fontWeight: 'bold' }}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity 
                  activeOpacity={0.9}
                  onLongPress={() => setSelectedMessageId(item.id)}
                  style={[
                    emojiOnly ? { padding: 4 } : [styles.messageBubble, isMe ? styles.myMessage : styles.otherMessage],
                    isSelected && { borderWidth: 2, borderColor: '#0A84FF' }
                  ]}
                >
                  {!isMe && !emojiOnly && <Text style={styles.senderNameText}>{item.senderName}</Text>}
                  
                  {item.imageUrl ? (
                    <Image source={{ uri: item.imageUrl }} style={{ width: 200, height: 150, borderRadius: 8, marginBottom: 5 }} resizeMode="cover" />
                  ) : null}

                  <Text style={emojiOnly ? { fontSize: 36 } : (isMe ? styles.myMessageText : styles.otherMessageText)}>
                    {item.text}
                  </Text>

                  {!emojiOnly && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 2 }}>
                      <Text style={[styles.timeText, isMe ? styles.myTimeText : styles.otherTimeText, { marginRight: 4 }]}>
                        {formatTime(item.createdAt)}
                      </Text>
                      {isMe && (
                        <Text style={{ fontSize: 10, color: item.seen ? '#34C759' : '#8E8E93', fontWeight: 'bold' }}>
                          {item.seen ? '✓✓' : '✓'}
                        </Text>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            );
          }}
        />

        {activeTypers.length > 0 && (
          <View style={styles.typingContainer}>
            <Text style={styles.typingText}>
              {activeTypers.join(', ')} {activeTypers.length === 1 ? 'is' : 'are'} typing...
            </Text>
          </View>
        )}

        {showImageInput && (
          <View style={{ padding: 8, backgroundColor: '#f9f9f9', borderTopWidth: 1, borderColor: '#eee', flexDirection: 'row', alignItems: 'center' }}>
            <TextInput 
              style={[styles.textInput, { flex: 1, backgroundColor: '#fff' }]}
              placeholder="Paste Image URL..."
              value={imageUrlInput}
              onChangeText={setImageUrlInput}
            />
            <TouchableOpacity onPress={() => setShowImageInput(false)} style={{ marginLeft: 8, padding: 8 }}>
              <Text style={{ color: '#FF3B30', fontWeight: 'bold' }}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.emojiBar}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={['😀', '😂', '😍', '🔥', '👍', '❤️', '🚀', '🎉', '😎', '🙏', '💯', '✨', '💡', '💻', '☕']}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.emojiButton} 
                onPress={() => setCurrentMessage(prev => prev + item)}
              >
                <Text style={styles.emojiText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => setShowImageInput(!showImageInput)} style={{ paddingHorizontal: 10, justifyContent: 'center' }}>
            <Text style={{ fontSize: 20 }}>📷</Text>
          </TouchableOpacity>
          <TextInput 
            style={styles.textInput} 
            placeholder="Type a message..." 
            value={currentMessage} 
            onChangeText={handleTextChange} 
            onSubmitEditing={sendMessage} 
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}