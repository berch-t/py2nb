"use client";

import { create } from "zustand";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signOut,
  type User,
} from "firebase/auth";
import Cookies from "js-cookie";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, getDb } from "@/lib/firebase-client";
import { isMobile } from "@/lib/utils";

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  hydrate: () => void;
  loginWithGoogle: (redirectTo?: string) => Promise<void>;
  loginWithEmail: (email: string, password: string, redirectTo?: string) => Promise<void>;
  signupWithEmail: (email: string, password: string, displayName: string, redirectTo?: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,

  hydrate: () => {
    if (get().initialized) return;
    set({ initialized: true });

    try {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        try {
          if (user) {
            const token = await user.getIdToken();
            Cookies.set("firebase-auth-token", token, { expires: 7 });

            // Ensure Firestore user profile exists
            const db = getDb();
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
              await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || "",
                photoURL: user.photoURL || null,
                plan: "free",
                stripeCustomerId: null,
                stripeSubscriptionId: null,
                conversionsUsed: 0,
                conversionsThisMonth: 0,
                totalTokensUsed: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              });
            }
          } else {
            Cookies.remove("firebase-auth-token");
          }
          set({ user, loading: false });
        } catch (error) {
          console.error("Auth state error:", error);
          set({ user: null, loading: false });
        }
      });
    } catch (error) {
      console.error("Hydration error:", error);
      set({ loading: false });
    }
  },

  loginWithGoogle: async (redirectTo = "/") => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    if (isMobile()) {
      sessionStorage.setItem("auth-redirect", redirectTo);
      await signInWithRedirect(auth, provider);
    } else {
      const cred = await signInWithPopup(auth, provider);
      const token = await cred.user.getIdToken();
      Cookies.set("firebase-auth-token", token, { expires: 7 });
      window.location.href = redirectTo;
    }
  },

  loginWithEmail: async (email: string, password: string, redirectTo = "/") => {
    const auth = getAuth();
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const token = await cred.user.getIdToken();
    Cookies.set("firebase-auth-token", token, { expires: 7 });
    window.location.href = redirectTo;
  },

  signupWithEmail: async (email: string, password: string, displayName: string, redirectTo = "/") => {
    const auth = getAuth();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    const token = await cred.user.getIdToken();
    Cookies.set("firebase-auth-token", token, { expires: 7 });
    window.location.href = redirectTo;
  },

  logout: async () => {
    const auth = getAuth();
    await signOut(auth);
    Cookies.remove("firebase-auth-token");
    set({ user: null });
    window.location.href = "/";
  },
}));
