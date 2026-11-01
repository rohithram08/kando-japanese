# Deploying Kando Japanese on Vercel

The app is **two Vercel projects** from this one repository:

| Project | Root directory | What it is |
|---|---|---|
| `kando-japanese` (frontend) | `/` (repo root) | Vite + React SPA |
| `kando-japanese-api` (backend) | `backend` | Express API as a Vercel serverless function |

The frontend proxies `/api/*` to the API project (see root `vercel.json`), so the browser only ever talks to
one origin and the httpOnly login cookie is first-party.

## 1. Database (TiDB Cloud / MySQL)
Create a database, then run migrations once from your machine (or CI):
```bash
cd backend
cp ../.env.example ../.env      # fill in DATABASE_* values
npm install
npm run db:migrate              # applies 0000 … 0012 (adds user_follows, learning_attempts, user_alerts)
```

## 2. Backend project
- Import the repo in Vercel, **Root Directory = `backend`**. `backend/vercel.json` sets the build.
- Environment variables (Production): `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`,
  `DATABASE_NAME`, `DATABASE_SSL=true`, `JWT_SECRET` (32+ random chars), `JWT_EXPIRES_IN`, `NODE_ENV=production`,
  `CORS_ORIGINS=https://<your-frontend-domain>`, `FRONTEND_URL=https://<your-frontend-domain>`,
  `GROQ_API_KEY`, **`RESEND_API_KEY`** and `EMAIL_FROM` (password reset emails; without them resets cannot be delivered).
- Enable **"Include source files outside of the Root Directory"** (Project Settings → General) so `../content` is available to the build.
- Check `https://<api-project>.vercel.app/api/health`.

## 3. Frontend project
- Import the same repo, Root Directory = `/`, framework Vite.
- **Edit `vercel.json`**: replace both `YOUR-BACKEND-PROJECT.vercel.app` with your API project's domain.
- Leave `VITE_API_URL` unset (defaults to `/api`).

## 4. Smoke test after deploy
Register → log in → finish a review → open `/people`, follow someone → reload (still following) → dashboard shows the
"How you learn best" card after some reviews → request a password reset (email arrives).

## Known limits on serverless (read before launch)
- **Photo avatar uploads are disabled** (return a clear 501): serverless disks are ephemeral. Preset and cartoon avatars work.
  To enable, store uploads in Vercel Blob / S3 and save the returned URL.
- **General/auth rate limiters are in-memory**, so they are per-function-instance (alert cooldowns are now stored in the database). Good enough for launch; move to
  Redis/Upstash for strict limits. After deploying, confirm limits key on the real client IP (rewrite hop → check
  `RateLimit-*` headers from two different networks).
- `DATABASE_SSL` must be `true` for TiDB Cloud.
