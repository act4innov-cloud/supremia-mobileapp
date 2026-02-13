// ============================================================
// SUPREMIA Platform - Login Screen
// ============================================================

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Text, TextInput, Button, Divider, HelperText } from 'react-native-paper';
import { Link, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { loginWithEmail, loginWithGoogle, error, isLoading, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async () => {
    if (!email || !password) return;
    try {
      await loginWithEmail(email, password);
      router.replace('/(tabs)/dashboard');
    } catch {
      // Error handled by context
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.replace('/(tabs)/dashboard');
    } catch {
      // Error handled by context
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Logo & Title */}
          <View style={styles.header}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>S</Text>
            </View>
            <Text variant="headlineLarge" style={styles.title}>
              SUPREMIA
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Plateforme de Supervision Industrielle
            </Text>
            <Text variant="bodySmall" style={styles.subtitleOcp}>
              OCP Morocco
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            {error && (
              <HelperText type="error" visible={!!error} style={styles.error}>
                {error}
              </HelperText>
            )}

            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                clearError();
              }}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              left={<TextInput.Icon icon="email" />}
              style={styles.input}
              outlineColor="#333"
              activeOutlineColor="#e94560"
            />

            <TextInput
              label="Mot de passe"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                clearError();
              }}
              mode="outlined"
              secureTextEntry={!showPassword}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              style={styles.input}
              outlineColor="#333"
              activeOutlineColor="#e94560"
            />

            <Link href="/(auth)/forgot-password" asChild>
              <Text variant="bodySmall" style={styles.forgotPassword}>
                Mot de passe oublié ?
              </Text>
            </Link>

            <Button
              mode="contained"
              onPress={handleEmailLogin}
              loading={isLoading}
              disabled={isLoading || !email || !password}
              style={styles.loginButton}
              buttonColor="#e94560"
              contentStyle={styles.buttonContent}
            >
              Se connecter
            </Button>

            <Divider style={styles.divider} />
            <Text variant="bodySmall" style={styles.orText}>
              ou
            </Text>

            <Button
              mode="outlined"
              onPress={handleGoogleLogin}
              disabled={isLoading}
              icon="google"
              style={styles.googleButton}
              textColor="#fff"
              contentStyle={styles.buttonContent}
            >
              Continuer avec Google
            </Button>

            <View style={styles.registerRow}>
              <Text variant="bodySmall" style={styles.registerText}>
                Pas encore de compte ?{' '}
              </Text>
              <Link href="/(auth)/register" asChild>
                <Text variant="bodySmall" style={styles.registerLink}>
                  S'inscrire
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
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  subtitle: {
    color: '#aaa',
    marginTop: 4,
  },
  subtitleOcp: {
    color: '#e94560',
    marginTop: 2,
  },
  form: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  error: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#16213e',
  },
  forgotPassword: {
    color: '#e94560',
    textAlign: 'right',
    marginBottom: 20,
  },
  loginButton: {
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonContent: {
    height: 48,
  },
  divider: {
    backgroundColor: '#333',
    marginVertical: 8,
  },
  orText: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  googleButton: {
    borderColor: '#333',
    borderRadius: 8,
    marginBottom: 24,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: '#aaa',
  },
  registerLink: {
    color: '#e94560',
    fontWeight: 'bold',
  },
});