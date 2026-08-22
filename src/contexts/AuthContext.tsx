import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextValue {
  /** The signed-in Firebase user, or null when signed out. */
  user: User | null;
  /** True until the initial auth state has been resolved (avoids a login flash on refresh). */
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }

  async function signup(name: string, email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const trimmedName = name.trim();
    if (trimmedName) {
      await updateProfile(credential.user, { displayName: trimmedName });
      // updateProfile doesn't refresh the local `auth.currentUser` snapshot
      // synchronously in every SDK version — force it so the name is
      // available immediately (e.g. on the welcome screen right after signup).
      setUser({ ...credential.user, displayName: trimmedName } as User);
    }
  }

  async function logout() {
    await signOut(auth);
  }

  return <AuthContext.Provider value={{ user, initializing, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
