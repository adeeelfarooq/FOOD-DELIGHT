import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const EditProfileScreen = ({ navigation }: any) => {
  const { isDark } = useTheme();
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+1234567890');

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#fff7ed' }]}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../public/placeholder-user.jpg')}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.changePhotoButton}>
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={[styles.label, { color: isDark ? '#9ca3af' : '#6b7280' }]}>Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#1f2937' : '#fff', color: isDark ? '#fff' : '#000' }]}
          value={name}
          onChangeText={setName}
          placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
        />

        <Text style={[styles.label, { color: isDark ? '#9ca3af' : '#6b7280' }]}>Email</Text>
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#1f2937' : '#fff', color: isDark ? '#fff' : '#000' }]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
        />

        <Text style={[styles.label, { color: isDark ? '#9ca3af' : '#6b7280' }]}>Phone</Text>
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#1f2937' : '#fff', color: isDark ? '#fff' : '#000' }]}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
        />

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  changePhotoButton: {
    padding: 8,
  },
  changePhotoText: {
    color: '#f97316',
    fontSize: 16,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 50,
    marginBottom: 20,
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#f97316',
  },
  saveButton: {
    backgroundColor: '#f97316',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;