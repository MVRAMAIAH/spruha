/**
 * Authentication Service
 * 
 * Uses Firebase for Authentication and Google Sign-In.
 * (MVP Note: Still uses localStorage to mock the Database for extended profile fields like constituencyId).
 */

import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

const USERS_KEY = 'ap_civic_users';

// Mock Database Helper
const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

/**
 * Sync Firebase User with our Mock Database
 */
const syncUserWithDB = (firebaseUser) => {
  const users = getUsers();
  let userIndex = users.findIndex(u => u.id === firebaseUser.uid);

  if (userIndex === -1) {
    // New user, create record
    const newUser = {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      username: firebaseUser.displayName || firebaseUser.email.split('@')[0],
      emailVerified: true, // Google accounts are verified
      role: 'citizen',
      mobile: null,
      stateId: null,
      districtId: null,
      constituencyId: null,
      profileCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      photoURL: firebaseUser.photoURL,
    };
    users.push(newUser);
    saveUsers(users);
    return newUser;
  }
  
  // Existing user, return DB record
  return users[userIndex];
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const dbUser = syncUserWithDB(result.user);
    return dbUser;
  } catch (error) {
    console.error("Error during Google Sign-In:", error);
    throw new Error(error.message);
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (userId, updates) => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) throw new Error('User not found in database.');

  const allowed = ['mobile', 'stateId', 'districtId', 'constituencyId', 'profileCompleted', 'username'];
  allowed.forEach(field => {
    if (updates[field] !== undefined) {
      users[userIndex][field] = updates[field];
    }
  });

  users[userIndex].updatedAt = new Date().toISOString();
  saveUsers(users);

  return users[userIndex];
};

/**
 * Logout
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

/**
 * Get current user from DB (used internally to enrich Firebase auth state)
 */
export const getDBUser = (uid) => {
  const users = getUsers();
  return users.find(u => u.id === uid) || null;
};

export default {
  signInWithGoogle,
  updateProfile,
  logout,
  getDBUser
};
