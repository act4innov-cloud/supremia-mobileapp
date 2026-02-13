import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit, onSnapshot, DocumentData, QueryConstraint } from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from '@/config/firebase.config';

// Generic CRUD operations
export async function getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
  const snap = await getDoc(doc(db, collectionName, docId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null;
}

export async function getCollection<T>(collectionName: string, ...constraints: QueryConstraint[]): Promise<T[]> {
  const q = constraints.length > 0 ? query(collection(db, collectionName), ...constraints) : collection(db, collectionName);
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as T));
}

export async function createDocument(collectionName: string, docId: string, data: DocumentData): Promise<void> {
  await setDoc(doc(db, collectionName, docId), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
}

export async function updateDocument(collectionName: string, docId: string, data: Partial<DocumentData>): Promise<void> {
  await updateDoc(doc(db, collectionName, docId), { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteDocument(collectionName: string, docId: string): Promise<void> {
  await deleteDoc(doc(db, collectionName, docId));
}

export function subscribeToCollection<T>(collectionName: string, callback: (data: T[]) => void, ...constraints: QueryConstraint[]): () => void {
  const q = constraints.length > 0 ? query(collection(db, collectionName), ...constraints) : collection(db, collectionName);
  return onSnapshot(q, (snap) => { callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as T))); });
}