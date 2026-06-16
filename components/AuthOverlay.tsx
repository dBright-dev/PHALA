import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  useColorScheme
} from 'react-native';
import { Colors } from '../constants/theme';
import { useUser } from '../context/UserContext';
import { Lock, Mail, Phone, User } from 'lucide-react-native';

export default function AuthOverlay() {
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme || 'dark'];
  const { login, register } = useUser();

  const [isLoginView, setIsLoginView] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form State Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (!email || !password || (!isLoginView && (!name || !phone))) return;
    setLoading(true);
    
    if (isLoginView) {
      await login(email, password);
    } else {
      await register(name, email, phone, password);
    }
    setLoading(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <View style={styles.authCard}>
        <Text style={[styles.title, { color: activeColors.text }]}>
          {isLoginView ? 'Welcome Back' : 'Create Account'}
        </Text>
        <Text style={styles.subtitle}>
          {isLoginView ? 'Sign in to track orders' : 'Join today'}
        </Text>

        {/* Dynamic Form Setup Fields */}
        {!isLoginView && (
          <View style={styles.inputWrapper}>
            <User size={18} color="#8E8E93" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Full Name" 
              placeholderTextColor="#727274"
              value={name}
              onChangeText={setName}
            />
          </View>
        )}

        <View style={styles.inputWrapper}>
          <Mail size={18} color="#8E8E93" style={styles.inputIcon} />
          <TextInput 
            style={styles.input} 
            placeholder="Email Address" 
            placeholderTextColor="#727274"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {!isLoginView && (
          <View style={styles.inputWrapper}>
            <Phone size={18} color="#8E8E93" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Phone Number" 
              placeholderTextColor="#727274"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        )}

        <View style={styles.inputWrapper}>
          <Lock size={18} color="#8E8E93" style={styles.inputIcon} />
          <TextInput 
            style={styles.input} 
            placeholder="Password" 
            placeholderTextColor="#727274"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, { backgroundColor: activeColors.primary }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFF" /> : (
            <Text style={styles.submitBtnText}>{isLoginView ? 'Sign In' : 'Sign Up'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLoginView(!isLoginView)} style={styles.toggleViewBtn}>
          <Text style={styles.toggleText}>
            {isLoginView ? "Don't have an account? " : "Already have an account? "}
            <Text style={{ color: activeColors.primary, fontWeight: '800' }}>
              {isLoginView ? 'Register' : 'Login'}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  authCard: { padding: 8 },
  title: { fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: '#8E8E93', fontSize: 14, marginTop: 4, marginBottom: 32 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161618', borderWidth: 1, borderColor: '#262629', borderRadius: 16, height: 56, paddingHorizontal: 16, marginBottom: 16 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#FFF', fontSize: 15 },
  submitBtn: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  toggleViewBtn: { alignItems: 'center', marginTop: 24 },
  toggleText: { color: '#8E8E93', fontSize: 14 }
});