import React from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { styles } from '../styles';
import { API_URL } from '../../services/socket';

interface ProfileScreenProps {
  name: string;
  email: string;
  avatar: string;
  setAvatar: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  about: string;
  setAbout: (val: string) => void;
  setAuthMode: (mode: 'inbox') => void;
}

export function ProfileScreen({
  name, email, avatar, setAvatar, status, setStatus, about, setAbout, setAuthMode
}: ProfileScreenProps) {
  const handleSaveProfile = async () => {
    try {
      const res = await fetch(`${API_URL.replace('/auth', '')}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, avatar, status, about })
      });
      if (res.ok) {
        Alert.alert('Success', 'Profile updated successfully!');
        setAuthMode('inbox');
      } else {
        Alert.alert('Error', 'Failed to update profile.');
      }
    } catch (e) {
      Alert.alert('Network Error', 'Could not save profile.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setAuthMode('inbox')}>
            <Text style={styles.backText}>{'< Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Edit Profile</Text>
        </View>

        <View style={styles.authContainer}>
          <View style={[styles.avatarPlaceholder, { width: 80, height: 80, borderRadius: 40, alignSelf: 'center', marginBottom: 20 }]}>
            <Text style={[styles.avatarText, { fontSize: 32 }]}>{name.charAt(0).toUpperCase()}</Text>
          </View>

          <Text style={{ fontWeight: '600', marginBottom: 5, color: '#333' }}>Profile Photo URL</Text>
          <TextInput style={styles.input} placeholder="https://image-url.com/pic.jpg" value={avatar} onChangeText={setAvatar} />

          <Text style={{ fontWeight: '600', marginBottom: 5, color: '#333' }}>Status (Online, Busy, Away)</Text>
          <TextInput style={styles.input} placeholder="Online" value={status} onChangeText={setStatus} />

          <Text style={{ fontWeight: '600', marginBottom: 5, color: '#333' }}>About / Bio</Text>
          <TextInput style={[styles.input, { height: 80, paddingTop: 15 }]} placeholder="Hey there! I am using tuchat." value={about} onChangeText={setAbout} multiline />

          <TouchableOpacity style={styles.primaryButton} onPress={handleSaveProfile}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}