// ============================================================
// SUPREMIA Platform - Register Screen
// ============================================================

import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { Link, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const { registerWithEmail, error, isLoading, clearError } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleRegister = async () => {
    setLocalError('');
    if (password !== confirmPassword) {
      setLocalError('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.length < 8) {
      setLocalError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      await registerWithEmail(email, password, displayName);
      router.replace('/(tabs)/dashboard');
    } catch {
      // Error handled by context
    }
  };

  const displayError = localError || error;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>Créer un compte</Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Rejoignez la plateforme SUPREMIA
            </Text>
          </View>

          <View style={styles.form}>
            {displayError && (
              <HelperText type="error" visible={!!displayError}>{displayError}</HelperText>
            )}

            <TextInput
              label="Nom complet"
              value={displayName}
              onChangeText={setDisplayName}
              mode="outlined"
              left={<TextInput.Icon icon="account" />}
              style={styles.input}
              outlineColor="#333"
              activeOutlineColor="#e94560"
            />

            <TextInput
              label="Email professionnel"
              value={email}
              onChangeText={(t) => { setEmail(t); clearError(); }}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email" />}
              style={styles.input}
              outlineColor="#333"
              activeOutlineColor="#e94560"
            />

            <TextInput
              label="Mot de passe"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              left={<TextInput.Icon icon="lock" />}
              style={styles.input}
              outlineColor="#333"
              activeOutlineColor="#e94560"
            />

            <TextInput
              label="Confirmer le mot de passe"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry
              left={<TextInput.Icon icon="lock-check" />}
              style={styles.input}
              outlineColor="#333"
              activeOutlineColor="#e94560"
            />

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading || !email || !password || !displayName}
              style={styles.registerButton}
              buttonColor="#e94560"
              contentStyle={{ height: 48 }}
            >
              S'inscrire
            </Button>

            <View style={styles.loginRow}>
              <Text variant="bodySmall" style={{ color: '#aaa' }}>Déjà un compte ? </Text>
              <Link href="/(auth)/login" asChild>
                <Text variant="bodySmall" style={{ color: '#e94560', fontWeight: 'bold' }}>
                  Se connecter
                </Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  title: { color: '#fff', fontWeight: 'bold' },
  subtitle: { color: '#aaa', marginTop: 4 },
  form: { maxWidth: 400, width: '100%', alignSelf: 'center' },
  input: { marginBottom: 12, backgroundColor: '#16213e' },
  registerButton: { borderRadius: 8, marginTop: 8, marginBottom: 24 },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
});