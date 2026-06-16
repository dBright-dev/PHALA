import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { supabase } from '../config/supabase';
import { useRouter } from 'expo-router';
import { Flame, Mail, Lock, User } from 'lucide-react-native';

export default function AuthScreen() {
  const router = useRouter();
  
  // Input fields state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [customerName, setCustomerName] = useState('');
  
  // UI interface status flags
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuthAction = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all security input fields.');
      return;
    }
    if (isRegistering && !customerName.trim()) {
      Alert.alert('Name Required', 'Please enter your name for profile collection setup.');
      return;
    }

    setLoading(false);
    try {
      setLoading(true);

      if (isRegistering) {
        // 1. EXECUTE NEW SECURITY REGISTER SIGN UP
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            // Attach user metadata to extract the display name on login later
            data: { display_name: customerName.trim() }
          }
        });
        
        if (error) throw error;
        
        Alert.alert(
          'Registration Successful', 
          'Your profile has been generated! You can now access the menu board.',
          [{ text: 'Let’s Eat', onPress: () => router.replace('/(tabs)') }]
        );
      } else {
        // 2. EXECUTE ACCOUNT LOGIN SIGN IN
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) throw error;
        
        // Push user inside the tab router system layout completely
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      Alert.alert('Authentication Failed', err.message || 'An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        {/* Brand Identity Branding Header Block */}
        <View style={styles.headerBlock}>
          <View style={styles.logoBadge}>
            <Flame size={32} color="#FFF" />
          </View>
          <Text style={styles.brandTitle}>Thabang Food</Text>
          <Text style={styles.brandTagline}>Premium local street flavors, straight to your pocket.</Text>
        </View>

        {/* Input Interactive Fields Area Grid */}
        <View style={styles.formContainer}>
          <Text style={styles.formContextTitle}>
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </Text>

          {isRegistering && (
            <View style={styles.inputWrapper}>
              <User size={18} color="#727274" style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="Your Full Name"
                placeholderTextColor="#48484A"
                value={customerName}
                onChangeText={setCustomerName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputWrapper}>
            <Mail size={18} color="#727274" style={styles.inputIcon} />
            <TextInput 
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#48484A"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Lock size={18} color="#727274" style={styles.inputIcon} />
            <TextInput 
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#48484A"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity 
            style={[styles.primarySubmitBtn, loading && { opacity: 0.7 }]}
            onPress={handleAuthAction}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.primarySubmitBtnText}>
                {isRegistering ? 'Sign Up & Begin' : 'Sign Into Account'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Toggle interface switch line */}
          <TouchableOpacity 
            style={styles.toggleInterfaceBtn} 
            onPress={() => setIsRegistering(!isRegistering)}
          >
            <Text style={styles.toggleInterfaceText}>
              {isRegistering 
                ? 'Already have an account? Login here' 
                : 'New to Thabang Food? Create an account here'}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090B' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  
  // Brand Header Layout
  headerBlock: { alignItems: 'center', marginBottom: 40 },
  logoBadge: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#FF7600', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  brandTitle: { fontSize: 28, fontWeight: '900', color: '#FFF', letterSpacing: -0.5 },
  brandTagline: { fontSize: 13, color: '#8E8E93', textAlign: 'center', marginTop: 6, paddingHorizontal: 20 },

  // Interactive Form Elements
  formContainer: { backgroundColor: '#161618', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#262629' },
  formContextTitle: { fontSize: 18, fontWeight: '800', color: '#FFF', marginBottom: 20 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#09090B', borderWidth: 1, borderColor: '#262629', borderRadius: 12, height: 48, paddingHorizontal: 12, marginBottom: 14 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#FFF', fontSize: 14 },
  
  // Actions Buttons Matrix
  primarySubmitBtn: { backgroundColor: '#FF7600', height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  primarySubmitBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  toggleInterfaceBtn: { marginTop: 18, alignItems: 'center' },
  toggleInterfaceText: { color: '#8E8E93', fontSize: 12, fontWeight: '600' }
});