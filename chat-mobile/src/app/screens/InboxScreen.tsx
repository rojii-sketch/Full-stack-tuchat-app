import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, ScrollView } from 'react-native';
import { styles } from '../styles';

interface InboxScreenProps {
  handleLogout: () => void;
  setAuthMode: (mode: 'profile') => void;
  generateInviteLink: () => void;
  isGroupModalVisible: boolean;
  setIsGroupModalVisible: (val: boolean) => void;
  groupName: string;
  setGroupName: (val: string) => void;
  groupType: 'group' | 'channel';
  setGroupType: (type: 'group' | 'channel') => void;
  groupDescription: string;
  setGroupDescription: (val: string) => void;
  groupTags: string;
  setGroupTags: (val: string) => void;
  handleCreateGroup: () => void;
  inviteLink: string;
  newChatUsername: string;
  setNewChatUsername: (val: string) => void;
  openChat: (target: string | null) => void;
  openRoom: (roomName: string) => void;
  decodeInvite: (str: string) => string;
  availableRooms: any[];
  activeChatNames: string[];
  onlineUsers: string[];
  unreadCounts: Record<string, number>;
  toggleBlockUser: (user: string) => void;
  deleteChatFromView: (user: string) => void;
}

export function InboxScreen({
  handleLogout, setAuthMode, generateInviteLink, isGroupModalVisible, setIsGroupModalVisible,
  groupName, setGroupName, groupType, setGroupType, groupDescription, setGroupDescription,
  groupTags, setGroupTags, handleCreateGroup, inviteLink, newChatUsername, setNewChatUsername,
  openChat, openRoom, decodeInvite, availableRooms, activeChatNames, onlineUsers, unreadCounts,
  toggleBlockUser, deleteChatFromView
}: InboxScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setAuthMode('profile')}>
            <Text style={styles.backText}>Profile</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>tuchat</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.inboxContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.inviteButton} onPress={generateInviteLink}>
            <Text style={styles.inviteButtonText}>+ Generate Invite Link</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.inviteButton, { backgroundColor: '#0A84FF', marginTop: -10 }]} onPress={() => setIsGroupModalVisible(true)}>
            <Text style={styles.inviteButtonText}>+ Create Group / Channel</Text>
          </TouchableOpacity>

          {isGroupModalVisible && (
            <View style={styles.generatedLinkContainer}>
              <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>New Community Space</Text>
              
              <TextInput style={styles.input} placeholder="Room Name (e.g. #TechTalk)" value={groupName} onChangeText={setGroupName} />
              
              <View style={{ flexDirection: 'row', marginBottom: 15, justifyContent: 'space-between', width: '100%' }}>
                <TouchableOpacity 
                  style={[styles.connectButton, { flex: 1, marginRight: 5, borderRadius: 10, backgroundColor: groupType === 'group' ? '#0A84FF' : '#E5E5EA' }]} 
                  onPress={() => setGroupType('group')}
                >
                  <Text style={{ color: groupType === 'group' ? 'white' : '#333', textAlign: 'center', fontWeight: 'bold' }}>Group</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.connectButton, { flex: 1, marginLeft: 5, borderRadius: 10, backgroundColor: groupType === 'channel' ? '#0A84FF' : '#E5E5EA' }]} 
                  onPress={() => setGroupType('channel')}
                >
                  <Text style={{ color: groupType === 'channel' ? 'white' : '#333', textAlign: 'center', fontWeight: 'bold' }}>Channel</Text>
                </TouchableOpacity>
              </View>

              <TextInput style={styles.input} placeholder="Description / About" value={groupDescription} onChangeText={setGroupDescription} />
              <TextInput style={styles.input} placeholder="Tags (comma separated: dev, web)" value={groupTags} onChangeText={setGroupTags} />

              <View style={{ flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity style={[styles.primaryButton, { flex: 1, marginRight: 5, backgroundColor: '#34C759' }]} onPress={handleCreateGroup}>
                  <Text style={styles.buttonText}>Save Room</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.primaryButton, { flex: 1, marginLeft: 5, backgroundColor: '#FF3B30' }]} onPress={() => setIsGroupModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {inviteLink !== '' && (
            <View style={styles.generatedLinkContainer}>
              <Text style={styles.generatedLinkText}>{inviteLink}</Text>
              <Text style={styles.generatedLinkHint}>(Copy this link and send it to your friend!)</Text>
            </View>
          )}

          <View style={styles.connectContainer}>
            <TextInput 
              style={styles.connectInput} 
              placeholder="Paste Invite Code or Link..." 
              value={newChatUsername}
              onChangeText={setNewChatUsername}
            />
            <TouchableOpacity 
              style={styles.connectButton} 
              onPress={() => { 
                let target = newChatUsername.trim();
                if (target) {
                  if (target.includes('tuchat.app/join/')) {
                    target = target.split('tuchat.app/join/')[1];
                  }
                  const decodedName = decodeInvite(target);
                  openChat(decodedName); 
                  setNewChatUsername(''); 
                } 
              }}
            >
              <Text style={styles.buttonText}>Chat</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Groups & Channels</Text>
          <FlatList
            data={availableRooms}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.inboxRow} onPress={() => openRoom(item.name)}>
                <View style={styles.inboxRowLeft}>
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View>
                    <Text style={styles.inboxName}>{item.name} ({item.type})</Text>
                    <Text style={{ fontSize: 12, color: '#8E8E93' }}>{item.description || 'No description'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />

          <Text style={styles.sectionTitle}>Active DMs</Text>
          <FlatList
            data={['Global Community', ...activeChatNames]}
            keyExtractor={(item) => item}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const isGlobal = item === 'Global Community';
              const target = isGlobal ? null : item;
              const unreadCount = isGlobal ? 0 : (unreadCounts[item] || 0);
              const isOnline = onlineUsers.includes(item);

              return (
                <View style={[styles.inboxRow, { paddingRight: 10 }]}>
                  <TouchableOpacity style={[styles.inboxRowLeft, { flex: 1 }]} onPress={() => openChat(target)}>
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarText}>{item.charAt(0).toUpperCase()}</Text>
                      {isOnline && !isGlobal && <View style={styles.absoluteOnlineDot} />}
                    </View>
                    <Text style={styles.inboxName}>{item}</Text>
                  </TouchableOpacity>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {unreadCount > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                      </View>
                    )}
                    
                    {!isGlobal && (
                      <>
                        <TouchableOpacity onPress={() => toggleBlockUser(item)} style={{ marginLeft: 10, padding: 6 }}>
                          <Text style={{ color: '#FF9500', fontWeight: 'bold', fontSize: 13 }}>Block</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteChatFromView(item)} style={{ marginLeft: 8, padding: 6 }}>
                          <Text style={{ color: '#FF3B30', fontWeight: 'bold', fontSize: 16 }}>×</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              );
            }}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}