# Ledga — Your business remembers everything

Premium credit/sales tracker for growing businesses.

Phase 1: rebrand (Aroko → Ledga) — premium design system, immersive
authentication, and a polished dashboard/customers/profile experience,
built on top of the existing Firebase Authentication + Cloud Firestore
backend. Every user signs in and only ever sees their own customers and
transactions.

## Set up Firebase (one-time)

1. Create a project at https://console.firebase.google.com.
2. **Authentication** → Sign-in method → enable **Email/Password**.
3. **Firestore Database** → Create database (start in production mode —
   the rules in `firestore.rules` lock it down properly).
4. Project settings → General → Your apps → add a **Web app** → copy the
   `firebaseConfig` values.
5. Copy `.env.example` to `.env.local` and fill in those values:

   ```bash
   cp .env.example .env.local
   ```

6. Deploy the security rules (requires the Firebase CLI: `npm i -g firebase-tools`):

   ```bash
   firebase login
   firebase use --add        # pick your project
   firebase deploy --only firestore:rules
   ```

   You can also paste the contents of `firestore.rules` into
   Console → Firestore Database → Rules and click Publish.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173). You'll land on
`/login` — use "Create an account" to sign up with any email/password
(6+ characters), then you're in.

## Other scripts

```bash
npm run build     # type-checks (tsc -b) then builds to dist/
npm run preview   # serves the production build locally
npm run lint       # oxlint
```

## Project structure

```
src/
  types/            Domain types (Customer, Transaction, DailySummary)
  utils/            currency + date formatting, button style helpers, auth
                    error messages, password strength
  lib/firebase.ts   Firebase app/auth/Firestore initialization (env-configured)
  contexts/         AuthContext — current user, login/signup/logout, persistence
  services/         data access layer — dataStore.ts talks to Firestore,
                    scoped to the signed-in user's own subtree
  hooks/            useCustomers, useCustomersWithActivity, useCustomerProfile,
                    useDailySummary, useRecentActivity
  components/       shared UI (Button, Modal, CustomerCard, LedgaMark, ...)
  components/auth   ProtectedRoute / PublicOnlyRoute route guards, AuthShell,
                    AuthField, PasswordStrengthMeter
  components/layout AppLayout, Header, BottomNavigation, SidebarNav
  pages/            Login, Signup, Home (Dashboard), Customers, NewEntry,
                    CustomerProfile, DailySummary, Profile
firestore.rules      Per-user data isolation, enforced server-side
```

## How data is organized

```
users/{userId}/customers/{customerId}     — name, phone, photoUrl, createdAt, updatedAt
users/{userId}/transactions/{transactionId} — customerId, type ("credit"|"payment"), amount, note, createdAt
```

- A trader's `{userId}` is always their Firebase Auth UID — taken from
  `auth.currentUser`, never from anything the client sends. Combined with
  the Firestore rules, a trader cannot read or write another trader's data
  by editing a document ID.
- **Balances are never stored as the only source of truth.** Every customer's
  balance (credits − payments) and every daily summary are recomputed from
  the transaction ledger on read, both in `dataStore.ts` and independently
  enforceable server-side, so a partial write or retried request can never
  leave a stale balance behind.
- Reads are real-time (Firestore `onSnapshot`): add a transaction on one
  device and the balance updates everywhere that trader is signed in,
  without a manual refresh.
- `createdAt` / `updatedAt` use Firestore server timestamps, not the
  client clock.

## Manual test checklist

1. Sign up with a new email/password → you land on Home.
2. Add a customer.
3. Record a credit, then a payment, and watch the balance update live.
4. Refresh the browser → data is still there (Firestore + auth persistence).
5. Log out → redirected to `/login`; try visiting `/` directly → still
   redirected (protected routes).
6. Log back in → same customers/transactions reappear.
7. Sign up a second account in a private/incognito window → it sees an
   empty customer list, confirming traders can't see each other's data.

## Not yet implemented

- Voice input for amount entry
- Voice playback for the daily summary
- Real WhatsApp reminder integration
- Customer photo upload (Firebase Storage) — the `photoUrl` field exists in
  the data model for this, but no upload UI exists yet, so Storage isn't
  wired up (kept out per "don't add unnecessary Firebase services").
