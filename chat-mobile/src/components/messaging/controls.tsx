import MessageCircle from 'lucide-react-native/icons/message-circle';
import Settings from 'lucide-react-native/icons/settings';
import type { LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, styles } from '../../app/styles';

export function IconButton({ icon: Icon, label, onPress, active = false, color = colors.ink }: {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  active?: boolean;
  color?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, active && { backgroundColor: colors.mint }, pressed && { opacity: 0.7 }]}
    >
      <Icon size={19} color={color} />
    </Pressable>
  );
}

function AvatarImage({ uri, label }: { uri: string; label: string }) {
  const [failed, setFailed] = useState(false);
  return failed
    ? <Text style={styles.avatarText}>{label.charAt(0).toUpperCase()}</Text>
    : <Image source={{ uri }} style={StyleSheet.absoluteFill} onError={() => setFailed(true)} />;
}

export function Avatar({ label, icon: Icon, uri, size = 46 }: {
  label: string;
  icon?: LucideIcon;
  uri?: string;
  size?: number;
}) {
  return (
    <View style={[styles.avatarPlaceholder, { width: size, height: size, overflow: 'hidden' }]}>
      {uri ? <AvatarImage key={uri} uri={uri} label={label} /> : Icon
        ? <Icon size={20} color={colors.accentDark} />
        : <Text style={styles.avatarText}>{(label.trim().charAt(0) || '?').toUpperCase()}</Text>}
    </View>
  );
}

export function WorkspaceNav({ current, onChats, onSettings }: {
  current: 'chats' | 'settings';
  onChats: () => void;
  onSettings: () => void;
}) {
  const { bottom } = useSafeAreaInsets();
  return (
    <View style={[nav.bar, { paddingBottom: Math.max(8, bottom) }]}>
      {([
        { key: 'chats', label: 'Chats', icon: MessageCircle, action: onChats },
        { key: 'settings', label: 'Settings', icon: Settings, action: onSettings },
      ] as const).map(({ key, label, icon: Icon, action }) => (
        <Pressable
          key={key}
          accessibilityRole="tab"
          accessibilityState={{ selected: current === key }}
          onPress={action}
          style={nav.item}
        >
          <View style={[nav.icon, current === key && nav.selected]}>
            <Icon color={current === key ? colors.accentDark : colors.muted} size={21} />
          </View>
          <Text style={[nav.label, current === key && { color: colors.accentDark }]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const nav = StyleSheet.create({
  bar: {
    flexDirection: 'row', justifyContent: 'center', gap: 28, paddingTop: 7,
    backgroundColor: colors.paper, borderTopWidth: 1, borderColor: colors.line,
  },
  item: { alignItems: 'center', minWidth: 76, minHeight: 48, justifyContent: 'center', gap: 3 },
  icon: { paddingVertical: 4, paddingHorizontal: 15, borderRadius: 16 },
  selected: { backgroundColor: colors.mint },
  label: { color: colors.muted, fontSize: 12, fontWeight: '700' },
});
