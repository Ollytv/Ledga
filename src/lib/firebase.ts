import { getApp, getApps, initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Public, client-safe Firebase config. These values identify the project —
 * they are not secrets. Access control lives in Firestore Security Rules
 * (see /firestore.rules), never in hiding this config or in frontend code.
 * Populate them via .env.local (see .env.example); never commit real values.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (import.meta.env.DEV) {
  const missing = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.warn(
      `[firebase] Missing config: ${missing.join(", ")}. Copy .env.example to .env.local and fill in your Firebase project's web app values.`,
    );
  }
}

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Keep traders signed in across browser restarts until they explicitly log
// out. This is the default for the web SDK, but we set it explicitly so
// auth persistence is a deliberate, documented choice rather than an
// implicit default.
void setPersistence(auth, browserLocalPersistence);
