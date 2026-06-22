import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

const ProfileScreen = ({ navigation }: any) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigation.replace('SignIn');
    } else {
      setLoading(false);
    }
  }, [user, navigation]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.replace('SignIn');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#fff7ed' }]}>
        <Text style={[styles.name, { color: isDark ? '#fff' : '#000' }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#fff7ed' }]}>
      <View style={styles.header}>
        <Image
          source={require('../public/expo.jpg')}
          style={styles.profileImage}
        />
        <Text style={[styles.name, { color: isDark ? '#fff' : '#000' }]}>
          {user?.displayName || 'User'}
        </Text>
        <Text style={[styles.email, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
          {user?.email || ''}
        </Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity 
          style={[styles.menuItem, { backgroundColor: isDark ? '#1f2937' : '#fff' }]}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={[styles.menuText, { color: isDark ? '#fff' : '#000' }]}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, { backgroundColor: isDark ? '#1f2937' : '#fff' }]}
          onPress={() => navigation.navigate('Orders')}
        >
          <Text style={[styles.menuText, { color: isDark ? '#fff' : '#000' }]}>My Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, { backgroundColor: isDark ? '#1f2937' : '#fff' }]}
        >
          <Text style={[styles.menuText, { color: isDark ? '#fff' : '#000' }]}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.signOutButton]}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
  },
  section: {
    padding: 20,
  },
  menuItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  signOutText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;