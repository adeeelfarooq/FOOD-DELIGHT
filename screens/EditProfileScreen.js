import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { updateProfile } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase.native';
import { MotiView } from 'moti';

export default function EditProfileScreen({ navigation }) {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(user.displayName || userData.fullName || '');
          setEmail(user.email || '');
          setPhone(userData.phone || '');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        Alert.alert('Error', 'Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    try {
      setSaving(true);

      // Update Firebase Auth displayName
      await updateProfile(user, { displayName: name.trim() });

      // Update Firestore user data
      await updateDoc(doc(db, 'users', user.uid), {
        fullName: name.trim(),
        phone: phone.trim(),
        updatedAt: new Date().toISOString()
      });

      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#111827' : '#fff7ed' }]}>
        <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#fff7ed' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>Edit Profile</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Fade-in animation using Moti */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 500 }}
        >
          <View style={styles.imageContainer}>
            {/* Optional profile image */}
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: '#f3f4f6', color: '#6b7280' }]}
              value={email}
              editable={false}
            />

            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="Enter your phone number"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
            </TouchableOpacity>
          </View>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  headerTitle: { fontSize: 20, fontWeight: '600', marginLeft: 16, flex: 1 },
  backButton: { padding: 4 },
  scrollView: { flex: 1 },
  imageContainer: { alignItems: 'center', padding: 20 },
  profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 10, borderWidth: 2, borderColor: '#f97316' },
  form: { padding: 20 },
  label: { fontSize: 14, marginBottom: 6, fontWeight: '500' },
  input: { color: "white", height: 50, marginBottom: 16, borderRadius: 8, paddingHorizontal: 16, borderWidth: 1, fontSize: 16, borderColor: '#e5e7eb' },
  saveButton: { backgroundColor: '#f97316', padding: 16, borderRadius: 8, marginTop: 20, marginBottom: 24, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
