import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// CRITICAL: Make sure "export default" is included right here!
export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login / Register</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  title: { color: '#FFF', fontSize: 20, fontWeight: 'bold' }
});