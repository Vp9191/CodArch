import { createContext, useContext, useState, useEffect } from 'react';
import {
    auth,
    googleProvider,
    isFirebaseConfigured,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
} from '../services/firebase';

const AuthContext = createContext(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isFirebaseConfigured || !auth) {
            console.warn('[CodArch] Firebase not configured, skipping auth listener');
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log('[CodArch] Auth state changed:', currentUser?.email || 'signed out');
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Email + Password sign up
    async function signUp(email, password, displayName) {
        if (!isFirebaseConfigured) throw new Error('Firebase is not configured. Add credentials to your .env file.');
        const result = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
            await updateProfile(result.user, { displayName });
        }
        return result;
    }

    // Email + Password log in
    async function logIn(email, password) {
        if (!isFirebaseConfigured) throw new Error('Firebase is not configured. Add credentials to your .env file.');
        return signInWithEmailAndPassword(auth, email, password);
    }

    // Google sign in
    async function logInWithGoogle() {
        if (!isFirebaseConfigured) throw new Error('Firebase is not configured. Add credentials to your .env file.');
        return signInWithPopup(auth, googleProvider);
    }

    // Sign out
    async function logOut() {
        if (!isFirebaseConfigured) return;
        return signOut(auth);
    }

    const value = {
        user,
        loading,
        isFirebaseConfigured,
        signUp,
        logIn,
        logInWithGoogle,
        logOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
