import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { auth } from '../lib/firebase';

const ProfileScreen = ({ navigation }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0)); // fade animation

  useEffect(() => {
    if (!user) {
      navigation.replace('SignIn');
    } else {
      setLoading(false);
      // run animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
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
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <Image
            source={{uri: "data:image/jpeg;base64,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"}}
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
            onPress={() => navigation.navigate('OrdersTab')}
          >
            <Text style={[styles.menuText, { color: isDark ? '#fff' : '#000' }]}>My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: isDark ? '#1f2937' : '#fff' }]}
            onPress={() => navigation.navigate('Settings')}
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
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // center everything vertically
    alignItems: 'center', // center horizontally
  },
  content: {
    width: '85%',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
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
    width: '100%',
  },
  menuItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    textAlign: 'center',
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
