import Ban from 'lucide-react-native/icons/ban';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import LogOut from 'lucide-react-native/icons/log-out';
import Settings from 'lucide-react-native/icons/settings';
import UserRound from 'lucide-react-native/icons/user-round';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, styles } from '../../app/styles';
import { Avatar, WorkspaceNav } from './controls';

export function SettingsScreen({ name, email, avatar, status, blockedUsers, onUnblock, onEditProfile, onLogout, onChats }: {
  name: string;
  email: string;
  avatar: string;
  status: string;
  blockedUsers: string[];
  onUnblock: (user: string) => void;
  onEditProfile: () => void;
  onLogout: () => void;
  onChats: () => void;
}) {
  const [showBlocked, setShowBlocked] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={[styles.frame, styles.container]}>
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder}><Settings size={22} color={colors.accentDark} /></View>
          <Text style={styles.headerText}>tuchat</Text>
        </View>
        <ScrollView contentContainerStyle={settings.content}>
          <Text accessibilityRole="header" style={styles.title}>Settings</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Edit profile" style={[styles.card, settings.row]} onPress={onEditProfile}>
            <Avatar label={name} uri={avatar} size={56} />
            <View style={settings.text}>
              <Text style={settings.name} numberOfLines={1}>{name || 'Your profile'}</Text>
              <Text style={styles.subtitle} numberOfLines={1}>{email || status}</Text>
            </View>
            <ChevronRight color={colors.muted} size={19} />
          </Pressable>

          <View style={settings.group}>
            <Text style={settings.section}>Account</Text>
            <Pressable accessibilityRole="button" style={settings.item} onPress={onEditProfile}>
              <UserRound color={colors.accent} size={20} />
              <Text style={[styles.label, settings.text]}>Edit profile</Text>
              <ChevronRight color={colors.muted} size={18} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityState={{ expanded: showBlocked }} style={settings.item} onPress={() => setShowBlocked(!showBlocked)}>
              <Ban color={colors.accent} size={20} />
              <Text style={[styles.label, settings.text]}>Blocked users</Text>
              <Text style={styles.subtitle}>{blockedUsers.length}</Text>
              <ChevronRight color={colors.muted} size={18} style={showBlocked && { transform: [{ rotate: '90deg' }] }} />
            </Pressable>
            {showBlocked && (
              <View style={settings.blocked}>
                {blockedUsers.length === 0
                  ? <Text style={styles.subtitle}>You haven’t blocked anyone.</Text>
                  : blockedUsers.map(user => (
                    <View key={user} style={settings.row}>
                      <Text style={[styles.label, settings.text]} numberOfLines={1}>{user}</Text>
                      <Pressable accessibilityRole="button" accessibilityLabel={`Unblock ${user}`} onPress={() => onUnblock(user)}>
                        <Text style={styles.link}>Unblock</Text>
                      </Pressable>
                    </View>
                  ))}
              </View>
            )}
          </View>

          <Pressable accessibilityRole="button" style={[settings.item, settings.signOut]} onPress={onLogout}>
            <LogOut color={colors.danger} size={20} />
            <Text style={[styles.label, { color: colors.danger }]}>Log out</Text>
          </Pressable>
        </ScrollView>
        <WorkspaceNav current="settings" onChats={onChats} onSettings={() => setShowBlocked(false)} />
      </View>
    </SafeAreaView>
  );
}

const settings = StyleSheet.create({
  content: { padding: 18, gap: 16, width: '100%', maxWidth: 690, alignSelf: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  text: { flex: 1, minWidth: 0 },
  name: { color: colors.ink, fontSize: 18, fontWeight: '800' },
  group: { backgroundColor: colors.paper, borderRadius: 18, borderWidth: 1, borderColor: colors.line },
  section: { color: colors.muted, fontSize: 13, fontWeight: '700', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6 },
  item: { minHeight: 55, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  blocked: { padding: 16, gap: 14, borderTopWidth: 1, borderColor: colors.line },
  signOut: { backgroundColor: colors.paper, borderRadius: 18, borderWidth: 1, borderColor: colors.line },
});
