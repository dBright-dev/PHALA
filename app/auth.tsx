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
import { Flame, Mail, Lock, User, AlertCircle } from 'lucide-react-native';

export default function AuthScreen() {
  const router = useRouter();
  
  // Input fields state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [customerName, setCustomerName] = useState('');
  
  // UI interface status flags
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Inline form validation & error tracking feedback state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Helper function to parse messy backend database strings into friendly alerts
  const getFriendlyErrorMessage = (error: any): string => {
    const msg = error?.message?.toLowerCase() || '';
    
    // NEW: Catch the email confirmation verification blocker
    if (msg.includes('email not confirmed')) {
      return 'Please verify your account first. We sent a confirmation link to your email address.';
    }
    if (msg.includes('invalid login credentials')) {
      return 'Incorrect email address or password. Please try again.';
    }
    if (msg.includes('email rate limit')) {
      return 'Too many attempts. Please wait a moment before trying again.';
    }
    if (msg.includes('user already exists')) {
      return 'An account with this email address already exists.';
    }
    if (msg.includes('password should be at least')) {
      return 'Security rules error: Your password must be at least 6 characters long.';
    }
    if (msg.includes('unable to validate email')) {
      return 'Please input a valid email address format.';
    }
    
    return error.message || 'Network connection breakdown. Please check your signal.';
  };

  const handleAuthAction = async () => {
    setErrorMessage(null);

    // Form inputs pre-flight safety validations
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill in both your email address and password.');
      return;
    }
    if (isRegistering && !customerName.trim()) {
      setErrorMessage('Please enter your full name to set up your food profile.');
      return;
    }

    try {
      setLoading(true);

      if (isRegistering) {
        // 1. EXECUTE NEW SECURITY REGISTER SIGN UP
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: { display_name: customerName.trim() }
          }
        });
        
        if (error) throw error;
        
        // MODIFIED: Advise checking inbox instead of shifting screens into the protected routes immediately
        Alert.alert(
          'Verify Your Email', 
          `We've sent a verification link to ${email.trim()}. Please click the link in the email to confirm your account, then log in here!`,
          [{ text: 'Got It', onPress: () => toggleFormMode() }]
        );
      } else {
        // 2. EXECUTE ACCOUNT LOGIN SIGN IN
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) throw error;
        
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      setErrorMessage(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Safe cleaner helper to switch between forms instantly
  const toggleFormMode = () => {
    setErrorMessage(null);
    setIsRegistering(!isRegistering);
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

          {/* DYNAMIC INLINE ERROR FEEDBACK BOX BANNER */}
          {errorMessage && (
            <View style={styles.errorBannerContainer}>
              <AlertCircle size={16} color="#FF3B30" style={{ marginRight: 8, marginTop: 1 }} />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          )}

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
            onPress={toggleFormMode}
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
  headerBlock: { alignItems: 'center', marginBottom: 40 },
  logoBadge: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#FF7600', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  brandTitle: { fontSize: 28, fontWeight: '900', color: '#FFF', letterSpacing: -0.5 },
  brandTagline: { fontSize: 13, color: '#8E8E93', textAlign: 'center', marginTop: 6, paddingHorizontal: 20 },
  formContainer: { backgroundColor: '#161618', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#262629' },
  formContextTitle: { fontSize: 18, fontWeight: '800', color: '#FFF', marginBottom: 20 },
  errorBannerContainer: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'rgba(255, 59, 48, 0.1)', borderWidth: 1, borderColor: 'rgba(255, 59, 48, 0.2)', borderRadius: 12, padding: 12, marginBottom: 16 },
  errorBannerText: { flex: 1, color: '#FF453A', fontSize: 13, fontWeight: '500', lineHeight: 17 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#09090B', borderWidth: 1, borderColor: '#262629', borderRadius: 12, height: 48, paddingHorizontal: 12, marginBottom: 14 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#FFF', fontSize: 14 },
  primarySubmitBtn: { backgroundColor: '#FF7600', height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  primarySubmitBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  toggleInterfaceBtn: { marginTop: 18, alignItems: 'center' },
  toggleInterfaceText: { color: '#8E8E93', fontSize: 12, fontWeight: '600' }
});