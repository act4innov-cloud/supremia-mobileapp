// ============================================================
// SUPREMIA Platform - Authentication Service
// ============================================================

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signInWithCredential,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged,
    User,
  } from 'firebase/auth';
  import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
  import { Platform } from 'react-native';
  import { auth, db } from './firebase';
  import { UserProfile, UserRole } from '@/types/user.types';
  
  // --- Email/Password Auth ---
  
  export async function signInWithEmail(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await updateLastLogin(credential.user.uid);
    return credential.user;
  }
  
  export async function signUpWithEmail(
    email: string,
    password: string,
    displayName: string,
  ): Promise<User> {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
  
    await updateProfile(credential.user, { displayName });
  
    // Create user profile in Firestore
    await createUserProfile(credential.user, 'email');
  
    return credential.user;
  }
  
  // --- Google Auth ---
  
  export async function signInWithGoogle(): Promise<User> {
    if (Platform.OS === 'web') {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      const credential = await signInWithPopup(auth, provider);
      await createOrUpdateUserProfile(credential.user, 'google');
      return credential.user;
    }
  
    // For native platforms, use @react-native-google-signin
    // This requires additional native configuration
    throw new Error(
      'Google Sign-In on native requires @react-native-google-signin configuration. See docs/AUTH_SETUP.md',
    );
  }
  
  // --- Common Auth Operations ---
  
  export async function signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }
  
  export async function resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }
  
  export function onAuthChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }
  
  export function getCurrentUser(): User | null {
    return auth.currentUser;
  }
  
  // --- User Profile Management ---
  
  async function createUserProfile(user: User, provider: 'google' | 'email'): Promise<void> {
    const userRef = doc(db, 'users', user.uid);
    const profile: Omit<UserProfile, 'uid'> = {
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || undefined,
      role: 'viewer' as UserRole, // Default role, admin must upgrade
      plantId: '',
      unitIds: [],
      department: '',
      title: '',
      authProvider: provider,
      isActive: true,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  
    await setDoc(userRef, profile);
  }
  
  async function createOrUpdateUserProfile(user: User, provider: 'google' | 'email'): Promise<void> {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
  
    if (!userSnap.exists()) {
      await createUserProfile(user, provider);
    } else {
      await updateLastLogin(user.uid);
    }
  }
  
  async function updateLastLogin(uid: string): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { lastLoginAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, { merge: true });
  }
  
  export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
  
    if (!snap.exists()) return null;
  
    return { uid, ...snap.data() } as UserProfile;
  }