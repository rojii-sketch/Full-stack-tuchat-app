import Ban from 'lucide-react-native/icons/ban';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import Globe2 from 'lucide-react-native/icons/globe-2';
import Link2 from 'lucide-react-native/icons/link-2';
import Megaphone from 'lucide-react-native/icons/megaphone';
import MessageCircle from 'lucide-react-native/icons/message-circle';
import MessageSquarePlus from 'lucide-react-native/icons/message-square-plus';
import Search from 'lucide-react-native/icons/search';
import Settings from 'lucide-react-native/icons/settings';
import Trash2 from 'lucide-react-native/icons/trash-2';
import UsersRound from 'lucide-react-native/icons/users-round';
import X from 'lucide-react-native/icons/x';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, IconButton, WorkspaceNav } from '../../components/messaging/controls';
import { colors, styles } from '../styles';

interface InboxScreenProps {
  onSettings: () => void;
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
  availableRooms: { _id: string; name: string; type: 'group' | 'channel'; description?: string }[];
  activeChatNames: string[];
  onlineUsers: string[];
  unreadCounts: Record<string, number>;
  toggleBlockUser: (user: string) => void;
  deleteChatFromView: (user: string) => void;
}

export function InboxScreen({
  onSettings, generateInviteLink, isGroupModalVisible, setIsGroupModalVisible,
  groupName, setGroupName, groupType, setGroupType, groupDescription, setGroupDescription,
  groupTags, setGroupTags, handleCreateGroup, inviteLink, newChatUsername, setNewChatUsername,
  openChat, openRoom, decodeInvite, availableRooms, activeChatNames, onlineUsers, unreadCounts,
  toggleBlockUser, deleteChatFromView,
}: InboxScreenProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | 'Unread' | 'Rooms'>('All');
  const [showInvite, setShowInvite] = useState(false);
  const search = query.trim().toLowerCase();
  const matches = (label: string) => label.toLowerCase().includes(search);
  const showGlobal = filter === 'All' && matches('Global Community');
  const chats = filter === 'Rooms' ? [] : activeChatNames.filter(
    item => matches(item) && (filter !== 'Unread' || unreadCounts[item] > 0),
  );
  const rooms = filter === 'Unread' ? [] : availableRooms.filter(item => matches(item.name));

  function connect() {
    const target = newChatUsername.trim();
    if (!target) return;
    const code = target.includes('tuchat.app/join/') ? target.split('tuchat.app/join/')[1] : target;
    if (!code) return;
    openChat(decodeInvite(code));
    setNewChatUsername('');
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.frame}>
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder}><MessageCircle size={22} color={colors.accentDark} /></View>
          <Text style={styles.headerText}>tuchat</Text>
          <IconButton icon={Settings} label="Open settings" onPress={onSettings} />
        </View>

        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={inbox.content}>
          <Text accessibilityRole="header" style={styles.title}>Chats</Text>
          <View style={inbox.search}>
            <Search size={19} color={colors.muted} />
            <TextInput
              accessibilityLabel="Search conversations"
              style={inbox.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Search conversations"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
            />
            {!!query && <IconButton icon={X} label="Clear search" onPress={() => setQuery('')} />}
          </View>

          <View style={inbox.actions}>
            <Pressable accessibilityRole="button" style={styles.primaryButton} onPress={() => setShowInvite(!showInvite)}>
              <MessageSquarePlus size={17} color={colors.paper} />
              <Text style={styles.buttonText}>New chat</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={inbox.secondary} onPress={() => setIsGroupModalVisible(!isGroupModalVisible)}>
              <UsersRound size={18} color={colors.accent} />
              <Text style={styles.link}>Create room</Text>
            </Pressable>
          </View>

          {showInvite && (
            <View style={styles.card}>
              <Text style={styles.label}>Start a conversation</Text>
              <TextInput accessibilityLabel="Invite code or link" style={styles.input} placeholder="Invite code or link" value={newChatUsername} onChangeText={setNewChatUsername} autoCapitalize="none" onSubmitEditing={connect} />
              <View style={inbox.actions}>
                <Pressable accessibilityRole="button" style={styles.primaryButton} onPress={connect}>
                  <Text style={styles.buttonText}>Open chat</Text>
                </Pressable>
                <Pressable accessibilityRole="button" style={inbox.secondary} onPress={generateInviteLink}>
                  <Link2 size={18} color={colors.accent} />
                  <Text style={styles.link}>Share invite</Text>
                </Pressable>
              </View>
              {!!inviteLink && <Text selectable style={styles.link}>{inviteLink}</Text>}
            </View>
          )}

          {isGroupModalVisible && (
            <View style={styles.card}>
              <Text style={styles.label}>New group or channel</Text>
              <TextInput accessibilityLabel="Room name" style={styles.input} placeholder="Room name" value={groupName} onChangeText={setGroupName} />
              <View style={inbox.actions}>
                {(['group', 'channel'] as const).map(type => (
                  <Pressable key={type} accessibilityRole="button" accessibilityState={{ selected: groupType === type }} style={[inbox.chip, groupType === type && inbox.selected]} onPress={() => setGroupType(type)}>
                    <Text style={styles.label}>{type === 'group' ? 'Group' : 'Channel'}</Text>
                  </Pressable>
                ))}
              </View>
              <TextInput accessibilityLabel="Description" style={styles.input} placeholder="Description" value={groupDescription} onChangeText={setGroupDescription} />
              <TextInput accessibilityLabel="Tags" style={styles.input} placeholder="Tags, separated by commas" value={groupTags} onChangeText={setGroupTags} />
              <View style={inbox.actions}>
                <Pressable accessibilityRole="button" style={styles.primaryButton} onPress={handleCreateGroup}>
                  <Text style={styles.buttonText}>Create room</Text>
                </Pressable>
                <Pressable accessibilityRole="button" style={inbox.secondary} onPress={() => setIsGroupModalVisible(false)}>
                  <Text style={styles.link}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          )}

          <View style={inbox.actions} accessibilityRole="tablist">
            {(['All', 'Unread', 'Rooms'] as const).map(item => (
              <Pressable
                key={item}
                accessibilityRole="tab"
                accessibilityState={{ selected: filter === item }}
                onPress={() => setFilter(item)}
                style={[inbox.chip, filter === item && inbox.selected]}
              >
                <Text style={styles.label}>{item}</Text>
              </Pressable>
            ))}
          </View>

          {(showGlobal || chats.length > 0) && (
            <View>
              <Text style={inbox.section}>Conversations</Text>
              {showGlobal && (
                <View style={inbox.row}>
                  <Pressable accessibilityRole="button" style={inbox.rowMain} onPress={() => openChat(null)}>
                    <Avatar label="Global Community" icon={Globe2} />
                    <View style={inbox.rowText}>
                      <Text style={inbox.name}>Global Community</Text>
                      <Text style={inbox.detail}>Public chat</Text>
                    </View>
                    <ChevronRight size={18} color={colors.muted} />
                  </Pressable>
                </View>
              )}
              {chats.map(item => {
                const unread = unreadCounts[item] || 0;
                return (
                  <View key={item} style={inbox.row}>
                    <Pressable accessibilityRole="button" style={inbox.rowMain} onPress={() => openChat(item)}>
                      <Avatar label={item} />
                      <View style={inbox.rowText}>
                        <Text style={inbox.name} numberOfLines={1}>{item}</Text>
                        <Text style={inbox.detail}>{onlineUsers.includes(item) ? 'Online' : 'Direct message'}</Text>
                      </View>
                      {unread > 0 && <Text accessibilityLabel={`${unread} unread messages`} style={inbox.badge}>{unread}</Text>}
                    </Pressable>
                    <IconButton icon={Ban} label={`Block ${item}`} onPress={() => toggleBlockUser(item)} />
                    <IconButton icon={Trash2} label={`Remove chat with ${item}`} color={colors.danger} onPress={() => deleteChatFromView(item)} />
                  </View>
                );
              })}
            </View>
          )}

          {rooms.length > 0 && (
            <View>
              <Text style={inbox.section}>Groups and channels</Text>
              {rooms.map(item => (
                <View key={item._id} style={inbox.row}>
                  <Pressable accessibilityRole="button" style={inbox.rowMain} onPress={() => openRoom(item.name)}>
                    <Avatar label={item.name} icon={item.type === 'group' ? UsersRound : Megaphone} />
                    <View style={inbox.rowText}>
                      <Text style={inbox.name} numberOfLines={1}>{item.name}</Text>
                      <Text style={inbox.detail} numberOfLines={1}>{item.description || (item.type === 'group' ? 'Group' : 'Channel')}</Text>
                    </View>
                    <ChevronRight size={18} color={colors.muted} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {!showGlobal && chats.length === 0 && rooms.length === 0 && (
            <View style={styles.card}>
              <Text style={styles.label}>{search ? 'No matching conversations' : filter === 'Unread' ? 'No unread conversations' : 'No groups or channels yet'}</Text>
            </View>
          )}
        </ScrollView>
        <WorkspaceNav current="chats" onChats={() => setFilter('All')} onSettings={onSettings} />
      </View>
    </SafeAreaView>
  );
}

const inbox = StyleSheet.create({
  content: { padding: 18, gap: 16, width: '100%', maxWidth: 800, alignSelf: 'center' },
  search: { minHeight: 48, paddingHorizontal: 13, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: colors.canvas },
  searchInput: { flex: 1, minWidth: 0, color: colors.ink, minHeight: 48, fontSize: 16 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  secondary: { minHeight: 44, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 13, backgroundColor: colors.canvas },
  chip: { minHeight: 40, justifyContent: 'center', paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, borderColor: colors.line },
  selected: { backgroundColor: colors.mint, borderColor: colors.mint },
  section: { color: colors.muted, fontSize: 13, fontWeight: '700', marginBottom: 5 },
  row: { minHeight: 67, flexDirection: 'row', alignItems: 'center', gap: 5, borderBottomWidth: 1, borderColor: colors.line },
  rowMain: { flex: 1, minHeight: 67, flexDirection: 'row', alignItems: 'center', gap: 11 },
  rowText: { flex: 1, minWidth: 0, gap: 2 },
  name: { color: colors.ink, fontSize: 16, fontWeight: '700' },
  detail: { color: colors.muted, fontSize: 13 },
  badge: { minWidth: 23, textAlign: 'center', color: colors.paper, backgroundColor: colors.accent, borderRadius: 14, paddingHorizontal: 5, paddingVertical: 2, overflow: 'hidden', fontWeight: '700' },
});
