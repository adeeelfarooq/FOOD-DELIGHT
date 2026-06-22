import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const SignUpScreen = ({ navigation }: any) => {
  const { isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#fff7ed' }]}>
      <Text style={[styles.title, { color: isDark ? '#f97316' : '#f97316' }]}>Create Account</Text>
      <TextInput
        style={[styles.input, { backgroundColor: isDark ? '#1f2937' : '#fff', color: isDark ? '#fff' : '#000' }]}
        placeholder="Full Name"
        placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
      />
      <TextInput
        style={[styles.input, { backgroundColor: isDark ? '#1f2937' : '#fff', color: isDark ? '#fff' : '#000' }]}
        placeholder="Email"
        placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
      />
      <TextInput
        style={[styles.input, { backgroundColor: isDark ? '#1f2937' : '#fff', color: isDark ? '#fff' : '#000' }]}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
      />
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('SignIn')}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={[styles.linkText, { color: isDark ? '#f97316' : '#f97316' }]}>
          Already have an account? Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    marginVertical: 10,
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#f97316',
  },
  button: {
    backgroundColor: '#f97316',
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SignUpScreen;