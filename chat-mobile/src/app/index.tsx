import React, { useState, useEffect, useRef } from 'react'; 
import { Alert, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { socket, API_BASE_URL } from './../services/socket';
import { decodeInvite, encodeInvite } from './../utils/helpers';
import { AuthScreen } from './screens/AuthScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { InboxScreen } from './screens/InboxScreen';
import { ChatScreen } from './screens/ChatScreen';

interface Message {
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

interface Typer {
  name: string;
  receiverName?: string | null;
  roomName?: string | null;
}

export default function App() {
  const [authMode, setAuthMode] = useState<'register' | 'login' | 'otp' | 'inbox' | 'chat' | 'profile'>('register');

  const [avatar, setAvatar] = useState('');
  const [status, setStatus] = useState('Online');
  const [about, setAbout] = useState('Hey there! I am using tuchat.');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [currentMessage, setCurrentMessage] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [typingUsers, setTypingUsers] = useState<Typer[]>([]); 
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [privateChatUser, setPrivateChatUser] = useState<string | null>(null);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  
  const [newChatUsername, setNewChatUsername] = useState('');
  const [inviteLink, setInviteLink] = useState('');

  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupType, setGroupType] = useState<'group' | 'channel'>('group');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupTags, setGroupTags] = useState('');
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [hiddenChats, setHiddenChats] = useState<string[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  const nameRef = useRef('');
  const privateChatUserRef = useRef<string | null>(null);
  const currentRoomRef = useRef<string | null>(null);

  useEffect(() => { nameRef.current = name; }, [name]);
  useEffect(() => { privateChatUserRef.current = privateChatUser; }, [privateChatUser]);
  useEffect(() => { currentRoomRef.current = currentRoom; }, [currentRoom]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedName = await AsyncStorage.getItem('userName');
        if (storedToken && storedName) {
          setName(storedName);
          socket.auth = { token: storedToken };
          socket.connect();
          setAuthMode('inbox');
        }
      } catch (error) { console.error('Failed to load token', error); }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (authMode === 'inbox') {
      fetchRooms();
    }
  }, [authMode]);

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/rooms`);
      const data = await res.json();
      if (res.ok) setAvailableRooms(data);
    } catch (e) {
      console.log("Failed to fetch rooms");
    }
  };

  useEffect(() => {
    socket.on('connect_error', (err) => { console.error('Socket Error:', err.message); handleLogout(); });

    socket.on('chat_history', (history: any[]) => {
      const formattedHistory = history.map((msg) => ({
        id: msg._id || msg.id,
        text: msg.text,
        senderId: msg.senderId,
        senderName: msg.senderName,
        receiverName: msg.receiverName,
        roomName: msg.roomName,
        imageUrl: msg.imageUrl,
        seen: msg.seen || false,
        tags: msg.tags,
        createdAt: msg.createdAt 
      }));
      setMessages(formattedHistory);
    });

    socket.on('room_history', ({ roomName, messages: roomMsgs }: { roomName: string; messages: any[] }) => {
      const formatted = roomMsgs.map((msg) => ({
        id: msg._id || msg.id,
        text: msg.text,
        senderId: msg.senderId,
        senderName: msg.senderName,
        receiverName: msg.receiverName,
        roomName: msg.roomName,
        imageUrl: msg.imageUrl,
        seen: msg.seen || false,
        tags: msg.tags,
        createdAt: msg.createdAt
      }));
      setMessages((prev) => [...prev.filter(m => m.roomName !== roomName), ...formatted]);
    });

    socket.on('receive_message', (incomingMessage: Message) => {
      if (blockedUsers.includes(incomingMessage.senderName)) return;
      setMessages((prev) => Array.isArray(prev) ? [...prev, incomingMessage] : [incomingMessage]);

      if (incomingMessage.senderName !== nameRef.current) {
        if (incomingMessage.roomName) {
          if (currentRoomRef.current !== incomingMessage.roomName) {
            setUnreadCounts(prev => ({
              ...prev,
              [incomingMessage.roomName!]: (prev[incomingMessage.roomName!] || 0) + 1
            }));
          }
        } else if (incomingMessage.receiverName === nameRef.current) {
          if (privateChatUserRef.current !== incomingMessage.senderName) {
            setUnreadCounts(prev => ({
              ...prev,
              [incomingMessage.senderName]: (prev[incomingMessage.senderName] || 0) + 1
            }));
          } else {
            socket.emit('mark_seen', { senderName: incomingMessage.senderName });
          }
        }
      }
    });

    socket.on('message_deleted', ({ messageId }) => {
      setMessages(prev => prev.filter(m => m.id !== messageId));
      setSelectedMessageId(null);
    });

    socket.on('chat_cleared', ({ roomName, partner, global }) => {
      setMessages(prev => prev.filter(msg => {
        if (roomName) return msg.roomName !== roomName;
        if (partner) return !((msg.senderName === name && msg.receiverName === partner) || (msg.senderName === partner && msg.receiverName === name));
        if (global) return msg.receiverName || msg.roomName;
        return false;
      }));
      setSelectedMessageId(null);
    });

    socket.on('messages_seen', ({ readerName }) => {
      setMessages(prev => prev.map(m => m.receiverName === readerName || m.senderName === name ? { ...m, seen: true } : m));
    });

    socket.on('user_typing', ({ senderName, receiverName, roomName }) => { 
      if (blockedUsers.includes(senderName)) return;
      setTypingUsers((prev) => {
        if (!prev.find(u => u.name === senderName)) return [...prev, { name: senderName, receiverName, roomName }];
        return prev;
      });
    });

    socket.on('user_stopped_typing', ({ senderName }) => { 
      setTypingUsers((prev) => prev.filter((u) => u.name !== senderName)); 
    });
    
    socket.on('online_users', (list: string[]) => { setOnlineUsers(list); });

    return () => {
      socket.off('connect_error'); socket.off('chat_history'); socket.off('room_history'); 
      socket.off('receive_message'); socket.off('message_deleted'); socket.off('chat_cleared'); 
      socket.off('messages_seen'); socket.off('user_typing'); socket.off('user_stopped_typing'); socket.off('online_users');
    };
  }, [blockedUsers]);

  const handleRegister = async () => { 
    if (!name || !email || !password) return Alert.alert('Error', 'Fill in all fields');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) });
      const data = await res.json();
      if (res.ok) setAuthMode('otp'); else Alert.alert('Registration Failed', data.error);
    } catch (e) { Alert.alert('Network Error', 'Could not connect.'); }
  };

  const handleVerifyOtp = async () => { 
    if (!otpCode || otpCode.length !== 6) return Alert.alert('Error', 'Enter 6-digit code');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, otp: otpCode }) });
      const data = await res.json();
      if (res.ok) {
        await AsyncStorage.setItem('userToken', data.token); await AsyncStorage.setItem('userName', data.name);
        setName(data.name); socket.auth = { token: data.token }; socket.connect(); setAuthMode('inbox'); 
      } else Alert.alert('Verification Failed', data.error);
    } catch (e) { Alert.alert('Network Error', 'Could not connect.'); }
  };

  const handleResendOtp = async () => { 
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      if (res.ok) Alert.alert('Sent!', 'New code sent.'); else Alert.alert('Error', (await res.json()).error);
    } catch (e) { Alert.alert('Network Error', 'Could not connect.'); }
  };

  const handleLogin = async () => { 
    if (!email || !password) return Alert.alert('Error', 'Fill in all fields');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (res.ok) {
        await AsyncStorage.setItem('userToken', data.token); await AsyncStorage.setItem('userName', data.name);
        setName(data.name); socket.auth = { token: data.token }; socket.connect(); setAuthMode('inbox');
      } else {
        if (res.status === 403) { await handleResendOtp(); setAuthMode('otp'); } 
        else { Alert.alert('Login Failed', data.error); }
      }
    } catch (e) { Alert.alert('Network Error', 'Could not connect.'); }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken'); await AsyncStorage.removeItem('userName');
    setEmail(''); setPassword(''); setOtpCode(''); setShowPassword(false); setTypingUsers([]); setOnlineUsers([]); setPrivateChatUser(null); setCurrentRoom(null); setUnreadCounts({});
    socket.disconnect(); setAuthMode('login');
  };

  const generateInviteLink = async () => {
    const secureCode = encodeInvite(name);
    const link = `https://tuchat.app/join/${secureCode}`;
    try { await Share.share({ message: link }); } 
    catch (error) { console.log("Native share blocked by browser."); }
    setInviteLink(link);
  };

  const openChat = (targetUser: string | null) => {
    if (targetUser && blockedUsers.includes(targetUser)) {
      return Alert.alert('Blocked', `You have blocked ${targetUser}. Unblock to chat.`);
    }
    setCurrentRoom(null);
    setPrivateChatUser(targetUser);
    if (targetUser) {
      setUnreadCounts(prev => ({ ...prev, [targetUser]: 0 }));
      socket.emit('mark_seen', { senderName: targetUser });
    }
    setAuthMode('chat');
  };

  const openRoom = (roomName: string) => {
    if (currentRoom !== roomName) {
      setPrivateChatUser(null);
      setCurrentRoom(roomName);
      socket.emit('join_room', roomName);
    }
    setAuthMode('chat');
  };

  const deleteChatFromView = async (targetUser: string) => {
    Alert.alert(
      "Delete Chat",
      `Remove ${targetUser} from your active chats?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              const res = await fetch(`${API_BASE_URL}/api/auth/hide-chat`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, chatName: targetUser })
              });
              
              if (res.ok) {
                setHiddenChats(prev => [...prev, targetUser]);
                setUnreadCounts(prev => ({ ...prev, [targetUser]: 0 }));
                if (privateChatUser === targetUser) {
                  setPrivateChatUser(null);
                  setAuthMode('inbox');
                }
              } else {
                Alert.alert('Error', 'Could not delete chat from database.');
              }
            } catch (e) {
              Alert.alert('Network Error', 'Failed to connect to server.');
            }
          } 
        }
      ]
    );
  };

  const toggleBlockUser = (username: string) => {
    if (blockedUsers.includes(username)) {
      setBlockedUsers(prev => prev.filter(u => u !== username));
      Alert.alert('Unblocked', `${username} has been unblocked.`);
    } else {
      Alert.alert('Block User', `Are you sure you want to block ${username}?`, [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Block', 
          style: 'destructive', 
          onPress: () => {
            setBlockedUsers(prev => [...prev, username]);
            if (privateChatUser === username) {
              setPrivateChatUser(null);
              setAuthMode('inbox');
            }
          } 
        }
      ]);
    }
  };

  const handleDeleteSelectedMessage = () => {
    if (!selectedMessageId) return;
    socket.emit('delete_message', { 
      messageId: selectedMessageId, 
      receiverName: privateChatUser, 
      roomName: currentRoom 
    });
    setSelectedMessageId(null);
  };

  const handleClearChat = () => {
    const targetName = currentRoom || privateChatUser || 'Global Community';
    Alert.alert(
      "Clear Chat",
      `Are you sure you want to delete all messages in ${targetName}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear All", 
          style: "destructive", 
          onPress: () => {
            socket.emit('clear_chat', { 
              receiverName: privateChatUser, 
              roomName: currentRoom 
            });
          } 
        }
      ]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return Alert.alert('Error', 'Enter a group or channel name');
    try {
      const res = await fetch(`${API_BASE_URL}/api/rooms/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: groupName.trim(),
          type: groupType,
          description: groupDescription.trim(),
          tags: groupTags.trim(),
          admin: name
        })
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', `${groupType === 'group' ? 'Group' : 'Channel'} created!`);
        setIsGroupModalVisible(false);
        setGroupName('');
        setGroupDescription('');
        setGroupTags('');
        fetchRooms();
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (e) {
      Alert.alert('Network Error', 'Could not create room.');
    }
  };

  const handleTextChange = (text: string) => {
    setCurrentMessage(text);
    socket.emit('typing_start', { receiverName: privateChatUserRef.current, roomName: currentRoomRef.current });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => { 
      socket.emit('typing_stop', { receiverName: privateChatUserRef.current, roomName: currentRoomRef.current }); 
    }, 1500);
  };

  const sendMessage = () => {
    if (!currentMessage.trim() && !imageUrlInput.trim()) return;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit('typing_stop', { receiverName: privateChatUser, roomName: currentRoom });
    socket.emit('send_message', { 
      text: currentMessage.trim() || '📷 [Image]', 
      imageUrl: imageUrlInput.trim() || undefined,
      receiverName: privateChatUser,
      roomName: currentRoom 
    });
    setCurrentMessage('');
    setImageUrlInput('');
    setShowImageInput(false);
  };

  const activeChatNames = Array.from(new Set([
    ...messages.map(m => m.senderName === name ? m.receiverName : m.senderName).filter(Boolean),
    ...Object.keys(unreadCounts).filter(k => unreadCounts[k] > 0)
  ])).filter(n => n !== name && n !== undefined && !hiddenChats.includes(n) && !blockedUsers.includes(n)) as string[];

  const displayedMessages = messages.filter(msg => {
    if (blockedUsers.includes(msg.senderName)) return false;
    if (currentRoom) {
      return msg.roomName === currentRoom;
    } else if (privateChatUser) {
      return (msg.senderName === name && msg.receiverName === privateChatUser) || (msg.senderName === privateChatUser && msg.receiverName === name);
    } else {
      return !msg.receiverName && !msg.roomName;
    }
  });

  const activeTypers = typingUsers.filter(t => {
    if (blockedUsers.includes(t.name)) return false;
    if (currentRoom) {
      return t.roomName === currentRoom;
    } else if (privateChatUser) {
      return t.name === privateChatUser && t.receiverName === name;
    } else {
      return !t.receiverName && !t.roomName;
    }
  }).map(t => t.name);

  // --- RENDER ROUTER ---
  if (authMode === 'register' || authMode === 'login' || authMode === 'otp') {
    return (
      <AuthScreen 
        authMode={authMode} name={name} setName={setName} email={email} setEmail={setEmail}
        password={password} setPassword={setPassword} otpCode={otpCode} setOtpCode={setOtpCode}
        showPassword={showPassword} setShowPassword={setShowPassword} handleRegister={handleRegister}
        handleLogin={handleLogin} handleVerifyOtp={handleVerifyOtp} handleResendOtp={handleResendOtp}
        setAuthMode={setAuthMode}
      />
    );
  }

  if (authMode === 'profile') {
    return (
      <ProfileScreen 
        name={name} email={email} avatar={avatar} setAvatar={setAvatar}
        status={status} setStatus={setStatus} about={about} setAbout={setAbout} setAuthMode={setAuthMode}
      />
    );
  }

  if (authMode === 'inbox') {
    return (
      <InboxScreen 
        handleLogout={handleLogout} setAuthMode={setAuthMode} generateInviteLink={generateInviteLink}
        isGroupModalVisible={isGroupModalVisible} setIsGroupModalVisible={setIsGroupModalVisible}
        groupName={groupName} setGroupName={setGroupName} groupType={groupType} setGroupType={setGroupType}
        groupDescription={groupDescription} setGroupDescription={setGroupDescription} groupTags={groupTags}
        setGroupTags={setGroupTags} handleCreateGroup={handleCreateGroup} inviteLink={inviteLink}
        newChatUsername={newChatUsername} setNewChatUsername={setNewChatUsername} openChat={openChat}
        openRoom={openRoom} decodeInvite={decodeInvite} availableRooms={availableRooms}
        activeChatNames={activeChatNames} onlineUsers={onlineUsers} unreadCounts={unreadCounts}
        toggleBlockUser={toggleBlockUser} deleteChatFromView={deleteChatFromView}
      />
    );
  }

  return (
    <ChatScreen 
      currentRoom={currentRoom} privateChatUser={privateChatUser} setPrivateChatUser={setPrivateChatUser}
      setCurrentRoom={setCurrentRoom} setAuthMode={setAuthMode} handleClearChat={handleClearChat}
      displayedMessages={displayedMessages} name={name} selectedMessageId={selectedMessageId}
      setSelectedMessageId={setSelectedMessageId} handleDeleteSelectedMessage={handleDeleteSelectedMessage}
      activeTypers={activeTypers} showImageInput={showImageInput} setShowImageInput={setShowImageInput}
      imageUrlInput={imageUrlInput} setImageUrlInput={setImageUrlInput} currentMessage={currentMessage}
      setCurrentMessage={setCurrentMessage} handleTextChange={handleTextChange} sendMessage={sendMessage}
    />
  );
}