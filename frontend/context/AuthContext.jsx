"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  onIdTokenChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import * as api from "@/lib/api";

const AuthContext = createContext(null);

// Friendlier text for the Firebase error codes people actually hit.
const friendlyAuthError = (err) => {
  const code = err?.code || "";
  const map = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "That email address doesn't look right.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect email or password.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/popup-closed-by-user": "Sign-in popup was closed before completing.",
    "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  };
  return map[code] || err?.message || "Something went wrong. Please try again.";
};

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [user, setUser] = useState(null); // synced backend profile (incl. role)
  const [ready, setReady] = useState(false);

  const syncProfile = useCallback(async () => {
    try {
      const data = await api.getAccount();
      setUser(data.profileDetails);
      return data.profileDetails;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    // Fires on sign-in/out AND on the silent background token refresh, so
    // api.js always has a current Firebase user to pull a fresh token from.
    const unsubscribe = onIdTokenChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        await syncProfile();
      } else {
        setUser(null);
      }
      setReady(true);
    });
    return unsubscribe;
  }, [syncProfile]);

  const login = useCallback(
    async (email, password) => {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        return await syncProfile();
      } catch (err) {
        throw new Error(friendlyAuthError(err));
      }
    },
    [syncProfile]
  );

  const register = useCallback(
    async (email, password, name) => {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) await updateProfile(cred.user, { displayName: name });
        return await syncProfile();
      } catch (err) {
        throw new Error(friendlyAuthError(err));
      }
    },
    [syncProfile]
  );

  const loginWithGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      return await syncProfile();
    } catch (err) {
      throw new Error(friendlyAuthError(err));
    }
  }, [syncProfile]);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
  }, []);

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        ready,
        isAuthenticated: !!firebaseUser,
        isAdmin,
        login,
        register,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
