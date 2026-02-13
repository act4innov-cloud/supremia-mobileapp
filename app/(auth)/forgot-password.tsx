import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { Link } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    setError('');
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Réinitialiser le mot de passe
        </Text>

        {sent ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>
              Un email de réinitialisation a été envoyé à {email}
            </Text>
            <Link href="/(auth)/login" asChild>
              <Button mode="contained" buttonColor="#e94560" style={{ marginTop: 16 }}>
                Retour à la connexion
              </Button>
            </Link>
          </View>
        ) : (
          <>
            {error && <HelperText type="error" visible>{error}</HelperText>}
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email" />}
              style={styles.input}
              outlineColor="#333"
              activeOutlineColor="#e94560"
            />
            <Button
              mode="contained"
              onPress={handleReset}
              loading={loading}
              disabled={loading || !email}
              buttonColor="#e94560"
              contentStyle={{ height: 48 }}
              style={{ borderRadius: 8 }}
            >
              Envoyer le lien
            </Button>
            <Link href="/(auth)/login" asChild>
              <Text variant="bodySmall" style={styles.back}>← Retour à la connexion</Text>
            </Link>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', padding: 24 },
  content: { maxWidth: 400, width: '100%', alignSelf: 'center' },
  title: { color: '#fff', fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { marginBottom: 16, backgroundColor: '#16213e' },
  back: { color: '#e94560', textAlign: 'center', marginTop: 24 },
  successBox: { alignItems: 'center', padding: 24, backgroundColor: '#16213e', borderRadius: 12 },
  successText: { color: '#4CAF50', textAlign: 'center', fontSize: 16 },
});