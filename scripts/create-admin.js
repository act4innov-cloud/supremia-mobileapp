// scripts/create-admin.js
// Usage: node scripts/create-admin.js <user-uid>
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp({ credential: cert(require('./serviceAccountKey.json')) });
const db = getFirestore();

const uid = process.argv[2];
if (!uid) { console.error('Usage: node create-admin.js <uid>'); process.exit(1); }

async function main() {
  await db.collection('users').doc(uid).set({
    uid, role: 'admin', displayName: 'Admin SUPREMIA', department: 'HSE',
    title: 'Administrateur', plantId: 'jorf_lasfar', isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  }, { merge: true });
  console.log(`✅ Admin profile created for UID: ${uid}`);
}
main().catch(console.error);