import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import Check from 'lucide-react-native/icons/check';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, IconButton } from '../../components/messaging/controls';
import { API_URL } from '../../services/socket';
import { colors, styles } from '../styles';

interface ProfileScreenProps {
  name: string;
  email: string;
  avatar: string;
  setAvatar: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  about: string;
  setAbout: (val: string) => void;
  setAuthMode: (mode: 'settings') => void;
}

export function ProfileScreen({
  name, email, avatar, setAvatar, status, setStatus, about, setAbout, setAuthMode,
}: ProfileScreenProps) {
  const [draftAvatar, setDraftAvatar] = useState(avatar);
  const [draftStatus, setDraftStatus] = useState(status);
  const [draftAbout, setDraftAbout] = useState(about);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, avatar: draftAvatar, status: draftStatus, about: draftAbout }),
      });
      if (!res.ok) {
        setError('Could not save your profile.');
        return;
      }
      setAvatar(draftAvatar);
      setStatus(draftStatus);
      setAbout(draftAbout);
      setAuthMode('settings');
    } catch {
      setError('Could not connect. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.frame, styles.container]}>
        <View style={styles.header}>
          <IconButton icon={ArrowLeft} label="Back to settings" onPress={() => setAuthMode('settings')} />
          <Text accessibilityRole="header" style={styles.headerText}>Edit profile</Text>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={profile.content}>
          <View style={styles.card}>
            <View style={profile.identity}>
              <Avatar label={name} uri={draftAvatar} size={62} />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{name}</Text>
                {!!email && <Text style={styles.subtitle}>{email}</Text>}
              </View>
            </View>
            <Text style={styles.label}>Profile photo URL</Text>
            <TextInput accessibilityLabel="Profile photo URL" style={styles.input} placeholder="https://example.com/photo.jpg" value={draftAvatar} onChangeText={setDraftAvatar} autoCapitalize="none" keyboardType="url" />
            <Text style={styles.label}>Status</Text>
            <TextInput accessibilityLabel="Status" style={styles.input} placeholder="Online, busy, or away" value={draftStatus} onChangeText={setDraftStatus} />
            <Text style={styles.label}>About</Text>
            <TextInput accessibilityLabel="About" style={[styles.input, profile.about]} value={draftAbout} onChangeText={setDraftAbout} multiline />
            {!!error && <Text accessibilityRole="alert" style={{ color: colors.danger }}>{error}</Text>}
            <Pressable accessibilityRole="button" disabled={saving} style={[styles.primaryButton, saving && { opacity: 0.6 }]} onPress={handleSaveProfile}>
              <Check size={18} color={colors.paper} />
              <Text style={styles.buttonText}>{saving ? 'Saving…' : 'Save changes'}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const profile = StyleSheet.create({
  content: { width: '100%', maxWidth: 620, alignSelf: 'center', padding: 18 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  about: { minHeight: 86, paddingTop: 12, textAlignVertical: 'top' },
});
