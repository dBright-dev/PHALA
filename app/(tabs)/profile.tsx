import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  useColorScheme,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Colors } from '../../constants/theme';
import { supabase } from '../../config/supabase'; // Pull our configured client directly
import { User, MapPin, Receipt, Shield, LogOut, ChevronRight, Award } from 'lucide-react-native';

interface UserProfile {
  name: string;
  email: string;
}

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme || 'dark'];
  
  // Local profile state managers
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfileData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setProfile({
            name: user.user_metadata?.display_name || 'Thabang Food Guest',
            email: user.email || ''
          });
        }
      } catch (error) {
        console.error('Error extracting account data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfileData();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      // Your root layout (_layout.tsx) listener will catch this change and auto-route back to /auth
    } catch (error) {
      console.error('Error during sign out operational execution:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: activeColors.background }]}>
        <ActivityIndicator color="#FF7600" size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: activeColors.background }]} showsVerticalScrollIndicator={false}>
      
      {/* Visual Dynamic SafeArea Top Spacing Accent */}
      <View style={{ height: 60 }} />

      {/* USER HERO IDENTITY CARD DISPLAY CARD */}
      <View style={[styles.profileCard, { backgroundColor: '#161618', borderColor: '#262629' }]}>
        <View style={[styles.avatarPlaceholder, { backgroundColor: activeColors.primary }]}>
          <Text style={styles.avatarText}>
            {profile?.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={[styles.userName, { color: activeColors.text }]}>{profile?.name}</Text>
        <Text style={styles.userEmail}>{profile?.email}</Text>

        {/* LOYALTY POINTS WIDGET ELEMENT */}
        <View style={[styles.loyaltyBadge, { backgroundColor: '#FF760015' }]}>
          <Award size={16} color="#FF7600" />
          <Text style={[styles.loyaltyText, { color: '#FF7600' }]}>240 Grill Loyalty Points</Text>
        </View>
      </View>

      {/* WORKSPACE PREFERENCE ACTION PANEL LISTS */}
      <Text style={[styles.sectionHeading, { color: activeColors.text }]}>Account Preferences</Text>
      <View style={[styles.menuList, { backgroundColor: '#161618', borderColor: '#262629' }]}>
        
        <TouchableOpacity style={styles.menuItem}>
          <Receipt size={20} color="#9BA1A6" />
          <Text style={[styles.menuItemText, { color: activeColors.text }]}>Order History</Text>
          <ChevronRight size={16} color="#48484A" style={styles.chevron} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <MapPin size={20} color="#9BA1A6" />
          <Text style={[styles.menuItemText, { color: activeColors.text }]}>Delivery Addresses</Text>
          <ChevronRight size={16} color="#48484A" style={styles.chevron} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Shield size={20} color="#9BA1A6" />
          <Text style={[styles.menuItemText, { color: activeColors.text }]}>Security & Privacy</Text>
          <ChevronRight size={16} color="#48484A" style={styles.chevron} />
        </TouchableOpacity>
      </View>

      {/* LOGOUT SESSION TERMINATION MODULE */}
      <TouchableOpacity 
        style={[styles.logoutBtn, { borderColor: '#262629', backgroundColor: '#161618' }]}
        onPress={handleSignOut}
      >
        <LogOut size={20} color="#FF3B30" />
        <Text style={styles.logoutBtnText}>Sign Out Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  profileCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 24, borderWidth: 1, padding: 24, alignItems: 'center' },
  avatarPlaceholder: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { color: '#FFF', fontSize: 24, fontWeight: '800' },
  userName: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#8E8E93', marginBottom: 2 },
  loyaltyBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginTop: 16 },
  loyaltyText: { fontSize: 12, fontWeight: '800' },
  sectionHeading: { fontSize: 15, fontWeight: '800', marginHorizontal: 16, marginTop: 28, marginBottom: 10 },
  menuList: { marginHorizontal: 16, borderRadius: 24, borderWidth: 1, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, height: 56, borderBottomWidth: 1, borderBottomColor: '#262629' },
  menuItemText: { flex: 1, marginLeft: 14, fontSize: 15, fontWeight: '600' },
  chevron: { marginLeft: 'auto' },
  logoutBtn: { marginHorizontal: 16, marginTop: 20, borderRadius: 24, borderWidth: 1, height: 56, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 40 },
  logoutBtnText: { color: '#FF3B30', fontSize: 15, fontWeight: '800' }
});