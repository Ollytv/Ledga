import { FirebaseError } from "firebase/app";

const MESSAGES: Record<string, string> = {
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/user-disabled": "This account has been disabled. Contact support.",
  "auth/user-not-found": "We couldn't find an account with that email.",
  "auth/wrong-password": "Incorrect password. Try again.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/email-already-in-use": "An account with this email already exists. Try logging in instead.",
  "auth/weak-password": "Choose a password with at least 6 characters.",
  "auth/missing-password": "Enter a password.",
  "auth/too-many-requests": "Too many attempts. Wait a moment and try again.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
};

/** Converts a Firebase Auth error into a short, actionable message a trader can read. */
export function authErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return MESSAGES[error.code] ?? "Something went wrong. Try again.";
  }
  return "Something went wrong. Try again.";
}
