import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { db } from '../lib/firebase';

const SettingsScreen = ({ navigation }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialData, setInitialData] = useState(null);

  // Form state
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: ''
  });

  // Check if form has changes
  const hasChanges = () => {
    if (!initialData) return false;
    return (
      phone.trim() !== initialData.phone ||
      address.street.trim() !== initialData.address.street ||
      address.city.trim() !== initialData.address.city ||
      address.state.trim() !== initialData.address.state ||
      address.postalCode.trim() !== initialData.address.postalCode
    );
  };

  // Load user settings
  useEffect(() => {
    const loadUserSettings = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userAddress = userData.address || {};

          setInitialData({
            phone: userData.phone || '',
            address: {
              street: userAddress.street || '',
              city: userAddress.city || '',
              state: userAddress.state || '',
              postalCode: userAddress.postalCode || ''
            }
          });

          setPhone(userData.phone || '');
          setAddress({
            street: userAddress.street || '',
            city: userAddress.city || '',
            state: userAddress.state || '',
            postalCode: userAddress.postalCode || ''
          });
        }
      } catch (error) {
        console.error('Error loading user settings:', error);
        Alert.alert('Error', 'Failed to load settings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadUserSettings();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    if (!phone.trim() || !address.street.trim() || !address.city.trim() ||
      !address.state.trim() || !address.postalCode.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setSaving(true);
      await setDoc(doc(db, 'users', user.uid), {
        phone: phone.trim(),
        address: {
          street: address.street.trim(),
          city: address.city.trim(),
          state: address.state.trim(),
          postalCode: address.postalCode.trim()
        },
        updatedAt: new Date().toISOString()
      }, { merge: true });

      Alert.alert('Success', 'Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
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
      {/* Header with animation */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>
          Settings
        </Text>
        <View style={styles.headerRight} />
      </MotiView>

      {/* Scrollable form */}
      <ScrollView style={styles.scrollView}>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 700 }}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
            Contact Information
          </Text>

          <Text style={[styles.label, { color: isDark ? '#9ca3af' : '#6b7280' }]}>Phone Number</Text>
          <TextInput
            style={[styles.input, {
              backgroundColor: isDark ? '#1f2937' : '#fff',
              color: isDark ? '#fff' : '#000',
              borderColor: isDark ? '#374151' : '#e5e7eb'
            }]}
            placeholder="Enter your phone number"
            placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000', marginTop: 20 }]}>
            Delivery Address
          </Text>

          <Text style={[styles.label, { color: isDark ? '#9ca3af' : '#6b7280' }]}>Street Address</Text>
          <TextInput
            style={[styles.input, {
              backgroundColor: isDark ? '#1f2937' : '#fff',
              color: isDark ? '#fff' : '#000',
              borderColor: isDark ? '#374151' : '#e5e7eb'
            }]}
            placeholder="Street address"
            placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
            value={address.street}
            onChangeText={(text) => setAddress({ ...address, street: text })}
          />

          <View style={styles.row}>
            <View style={styles.cityInput}>
              <Text style={[styles.label, { color: isDark ? '#9ca3af' : '#6b7280' }]}>City</Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: isDark ? '#1f2937' : '#fff',
                  color: isDark ? '#fff' : '#000',
                  borderColor: isDark ? '#374151' : '#e5e7eb'
                }]}
                placeholder="City"
                placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                value={address.city}
                onChangeText={(text) => setAddress({ ...address, city: text })}
              />
            </View>

            <View style={styles.stateInput}>
              <Text style={[styles.label, { color: isDark ? '#9ca3af' : '#6b7280' }]}>State</Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: isDark ? '#1f2937' : '#fff',
                  color: isDark ? '#fff' : '#000',
                  borderColor: isDark ? '#374151' : '#e5e7eb'
                }]}
                placeholder="State"
                placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                value={address.state}
                onChangeText={(text) => setAddress({ ...address, state: text })}
              />
            </View>
          </View>

          <Text style={[styles.label, { color: isDark ? '#9ca3af' : '#6b7280' }]}>Postal Code</Text>
          <TextInput
            style={[styles.input, {
              backgroundColor: isDark ? '#1f2937' : '#fff',
              color: isDark ? '#fff' : '#000',
              borderColor: isDark ? '#374151' : '#e5e7eb'
            }]}
            placeholder="Postal code"
            placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
            value={address.postalCode}
            onChangeText={(text) => setAddress({ ...address, postalCode: text })}
            keyboardType="number-pad"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.saveButton,
                {
                  backgroundColor: hasChanges() ? '#f97316' : '#9ca3af',
                  opacity: saving ? 0.7 : 1
                }
              ]}
              onPress={handleSave}
              disabled={saving || !hasChanges()}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {initialData ? 'Update Settings' : 'Save Settings'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: { fontSize: 20, fontWeight: '600', marginLeft: 16, flex: 1 },
  headerRight: { width: 40 },
  backButton: { padding: 4 },
  scrollView: { flex: 1, padding: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  cityInput: { flex: 0.6, marginRight: 10 },
  stateInput: { flex: 0.4 },
  buttonContainer: { paddingHorizontal: 16, marginTop: 16, marginBottom: 24 },
  saveButton: {
    backgroundColor: '#f97316',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
});

export default SettingsScreen;
