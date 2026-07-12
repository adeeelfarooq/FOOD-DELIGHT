import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { MotiText, MotiView } from 'moti';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { auth, db } from '../lib/firebase.native';

export default function SignUpScreen({ navigation }) {
  const { isDark } = useTheme();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullName.trim() });

      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("SignIn");
    } catch (error) {
      Alert.alert("Sign Up Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#fff7ed' }]}>
      
      {/* App Logo + Name (same as SplashScreen) */}
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", delay: 200 }}
        style={styles.logoContainer}
      >
        <Image 
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png" }} // 🍔 Food logo
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.appName, { color: isDark ? "#fff" : "#111" }]}>
          FOODDELIGHT
        </Text>
      </MotiView>

      {/* Animated Title */}
      <MotiText
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 600 }}
        style={[styles.title, { color: '#f97316' }]}
      >
        Create Account
      </MotiText>

      {/* Full Name Input */}
      <MotiView
        from={{ opacity: 0, translateX: -30 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: "timing", duration: 500, delay: 200 }}
      >
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#1f2937' : '#fff', color: isDark ? '#fff' : '#000' }]}
          placeholder="Full Name"
          placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
          value={fullName}
          onChangeText={setFullName}
        />
      </MotiView>

      {/* Email Input */}
      <MotiView
        from={{ opacity: 0, translateX: 30 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: "timing", duration: 500, delay: 400 }}
      >
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#1f2937' : '#fff', color: isDark ? '#fff' : '#000' }]}
          placeholder="Email"
          placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </MotiView>

      {/* Password Input */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500, delay: 600 }}
      >
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#1f2937' : '#fff', color: isDark ? '#fff' : '#000' }]}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
          value={password}
          onChangeText={setPassword}
        />
      </MotiView>

      {/* Button */}
      <MotiView
        from={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 800 }}
      >
        <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
        </TouchableOpacity>
      </MotiView>

      {/* Footer Link */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", delay: 1000 }}
      >
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={[styles.linkText, { color: '#f97316' }]}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  logoContainer: { alignItems: "center", marginBottom: 10 },
  logo: { width: 80, height: 80, marginBottom: 6 },
  appName: { fontSize: 20, fontWeight: "bold", letterSpacing: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { height: 50, marginVertical: 10, borderRadius: 8, padding: 15, borderWidth: 1, borderColor: '#f97316' },
  button: { backgroundColor: '#f97316', padding: 15, borderRadius: 8, marginVertical: 20, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  linkText: { textAlign: 'center', marginTop: 10 },
});
