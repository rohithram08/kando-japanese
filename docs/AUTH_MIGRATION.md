# Authentication Migration Document — Nihongo Master

> **Date**: 2026-08-23  
> **Phase**: Checkpoint F2 — Authentication Migration  
> **Status**: In Progress / Audit & Architecture Alignment

---

## 1. Current Authentication Architecture (Supabase Legacy)

### Architecture
- Frontend communicates directly with Supabase Auth API (`@supabase/supabase-js`).
- Session tokens are stored in `localStorage` under `sb-<project-ref>-auth-token`.
- State synchronization uses `supabase.auth.onAuthStateChange` push listener.
- Password reset uses Supabase magic link recovery URLs with client session updates via `supabase.auth.updateUser`.
- User profiles are created/upserted in the `user_profiles` table directly from frontend code (`authStore.js`).

### Audit by File

| File | Current Behavior & Supabase Calls | Issues / Flaws |
|---|---|---|
| [`src/store/authStore.js`](file:///e:/Nihongo-testing/nihongo-master/src/store/authStore.js) | `getSession`, `onAuthStateChange`, `signInWithPassword`, `signUp`, `signInWithOAuth`, `signOut`, `updateUser`, direct queries to `user_profiles` | Client creates own profile; direct DB coupling; token in localStorage |
| [`src/hooks/useAuth.js`](file:///e:/Nihongo-testing/nihongo-master/src/hooks/useAuth.js) | Listens to `onAuthStateChange` for debug logging; exports store methods | Redundant Supabase listener |
| [`src/components/auth/AuthGuard.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/auth/AuthGuard.jsx) | Checks `user` and `loading` from `useAuth` hook. Redirects to `/login` or `/dashboard` | Good structure; needs cookie session compatibility |
| [`src/components/auth/LoginPage.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/auth/LoginPage.jsx) | Calls `signIn`, `signInWithGoogle`, and `supabase.auth.resetPasswordForEmail` | Direct Supabase reset call in UI component |
| [`src/components/auth/RegisterPage.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/auth/RegisterPage.jsx) | Multi-step form (Account → Language → Level). Calls `signUp` | Clean UI; needs backend registration contract |
| [`src/pages/ResetPasswordPage.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/pages/ResetPasswordPage.jsx) | Waits for recovery session from URL hash and calls `supabase.auth.updateUser` | Supabase URL hash recovery flow |
| [`src/App.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/App.jsx) | Calls `useAuthStore.getState().initialize()` in top-level `useEffect` | Needs clean initial session fetch |

---

## 2. Target Authentication Architecture (Node.js + JWT + TiDB)

### Architecture
- React Frontend calls typed API module (`src/api/auth.ts`).
- Centralized Axios client (`src/api/client.ts`) handles requests with `withCredentials: true`.
- Backend (`backend/src/routes/auth.ts`) issues and verifies JWT stored in a **secure `httpOnly` cookie** (`token`).
- Cookie flags: `httpOnly: true`, `sameSite: 'lax'`, `secure: process.env.NODE_ENV === 'production'`.
- Sessions are verified on startup and refresh by calling `GET /api/auth/me`.
- User ownership and IDs are strictly determined by `req.user.userId` from the verified JWT payload.

---

## 3. Step-by-Step Flow Specifications

### A. App Initialization & Session Restoration
```
App Mount (App.jsx)
  ↓
useAuthStore.initialize()
  ↓
authApi.getMe() → GET /api/auth/me (Cookie automatically sent)
  ↓
If 200 OK:
  - set user & profile in authStore
  - initialize progressStore
  - set loading: false, initialized: true
If 401 Unauthorized:
  - set user: null, profile: null
  - set loading: false, initialized: true
If Network/Server Error:
  - set user: null, profile: null
  - set loading: false, initialized: true
  - show toast only if unexpected server error
```

### B. Registration Flow
```
User completes 3-step form (RegisterPage.jsx)
  ↓
authStore.register({ email, password, username, nativeLanguage, currentLevel })
  ↓
authApi.register(...) → POST /api/auth/register
  ↓
Backend:
  1. Zod schema validation (email format, password length >= 8, username 2-100)
  2. Checks for existing user with same email (returns 400 'User already exists')
  3. Hashes password with bcrypt (salt 10)
  4. Inserts user into TiDB (with native_language, current_level, initial 0 XP & streak)
  5. Signs JWT token
  6. Sets httpOnly cookie ('token')
  7. Returns 201 with user profile
  ↓
Frontend:
  - sets user & profile in authStore
  - initializes progressStore
  - redirects to /dashboard
```

### C. Login Flow
```
User submits credentials (LoginPage.jsx)
  ↓
authStore.login({ email, password })
  ↓
authApi.login(...) → POST /api/auth/login
  ↓
Backend:
  1. Zod schema validation
  2. Finds user by email (returns 401 if not found)
  3. Compares password with bcrypt.compare (returns 401 if invalid)
  4. Signs JWT token
  5. Sets httpOnly cookie ('token')
  6. Returns 200 with user profile
  ↓
Frontend:
  - sets user & profile in authStore
  - initializes progressStore
  - redirects to /dashboard
```

### D. Logout Flow
```
User clicks Logout (Navbar / SettingsPage)
  ↓
authStore.logout()
  ↓
authApi.logout() → POST /api/auth/logout
  ↓
Backend:
  - Clears 'token' cookie (res.clearCookie('token'))
  ↓
Frontend:
  - sets user: null, profile: null, session: null in authStore
  - resets progressStore and notificationStore
  - redirects to /login
```

### E. Google OAuth Flow
```
User clicks "Continue with Google"
  ↓
Redirects to GET /api/auth/google
  ↓
Backend redirects to Google OAuth consent screen
  ↓
User authenticates with Google → redirects to GET /api/auth/google/callback
  ↓
Backend exchanges code, verifies identity, finds or creates user record,
sets httpOnly cookie, and redirects to `${FRONTEND_URL}/dashboard`
```

---

## 4. Behavioral Parity & Invariants

1. **No Client-Side User Ownership**: The frontend never determines `userId` or passes `userId` in write payloads.
2. **Atomic Profile Initialization**: Registration automatically stores `native_language` and `current_level` in the database.
3. **Graceful Loading Guard**: `AuthGuard` displays the `LoadingSpinner` until `loading` is `false`, preventing flash of protected or unauthenticated content.
4. **Coexistence with Legacy Supabase**: During F2, `@supabase/supabase-js` is retained, but the active auth flow is shifted to backend JWT.

---

## 5. File Migration Plan

| File | Status | Planned Change |
|---|---|---|
| `src/store/authStore.ts` | **NEW TS** | Replace Supabase with `authApi`, `usersApi`, clean TypeScript types |
| `src/hooks/useAuth.ts` | **NEW TS** | Simplify to typed Zustand selector (no Supabase listener) |
| `src/components/auth/AuthGuard.jsx` | **UPDATE** | Adapt to use typed `useAuth` hook |
| `src/components/auth/LoginPage.jsx` | **UPDATE** | Use `authApi` / `authStore.login`, remove direct Supabase reset call |
| `src/components/auth/RegisterPage.jsx` | **UPDATE** | Use `authStore.signUp` with full language/level payload |
| `src/pages/ResetPasswordPage.jsx` | **UPDATE** | Connect to `authApi.resetPassword` |
