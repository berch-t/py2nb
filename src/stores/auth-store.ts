"use client";

import { create } from "zustand";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
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
  loginWithGoogle: () => Promise<void>;
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

  loginWithGoogle: async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    if (isMobile()) {
      await signInWithRedirect(auth, provider);
    } else {
      const cred = await signInWithPopup(auth, provider);
      const token = await cred.user.getIdToken();
      Cookies.set("firebase-auth-token", token, { expires: 7 });
      // Full reload after popup (COOP workaround)
      window.location.href = "/";
    }
  },

  logout: async () => {
    const auth = getAuth();
    await signOut(auth);
    Cookies.remove("firebase-auth-token");
    set({ user: null });
    window.location.href = "/";
  },
}));
