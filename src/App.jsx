// src/App.jsx
import React, { useEffect, Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { useAuthStore } from './store/authStore'
import AuthGuard from './components/auth/AuthGuard'
import Layout from './components/layout/Layout'
import { RouteErrorFallback, RouteLoadingFallback } from './components/common/RouteErrorBoundary'

// ── Direct / Eager learning pages (instant, zero-waterfall text-first reading) ──
import ReadingPage from './pages/ReadingPage'

// Helper to retry dynamic imports once if a network hiccup or stale bundle occurs
function lazyWithRetry(importer) {
  return lazy(async () => {
    try {
      return await importer()
    } catch (err) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 300))
        return await importer()
      } catch (retryErr) {
        if (typeof window !== 'undefined') {
          const key = `chunk_retry_${window.location.pathname}`
          if (!sessionStorage.getItem(key)) {
            sessionStorage.setItem(key, '1')
            window.location.reload()
            return new Promise(() => {})
          }
        }
        throw retryErr
      }
    }
  })
}

// ── Route-level code-split pages (loaded on demand with auto-retry) ─────────────
const LoginPage         = lazyWithRetry(() => import('./components/auth/LoginPage'))
const RegisterPage      = lazyWithRetry(() => import('./components/auth/RegisterPage'))
const ResetPasswordPage = lazyWithRetry(() => import('./pages/ResetPasswordPage'))
const Dashboard         = lazyWithRetry(() => import('./components/dashboard/Dashboard'))
const LessonsPage       = lazyWithRetry(() => import('./pages/LessonsPage'))
const LessonList        = lazyWithRetry(() => import('./components/lessons/LessonList'))
const LessonViewer      = lazyWithRetry(() => import('./components/lessons/LessonViewer'))
const GrammarPage       = lazyWithRetry(() => import('./pages/GrammarPage'))
const KanjiPage         = lazyWithRetry(() => import('./pages/KanjiPage'))
const KanjiStudy        = lazyWithRetry(() => import('./components/kanji/KanjiStudy'))
const QuizPage          = lazyWithRetry(() => import('./pages/QuizPage'))
const QuizEngine        = lazyWithRetry(() => import('./components/quiz/QuizEngine'))
const SenseiPage        = lazyWithRetry(() => import('./pages/SenseiPage'))
const SRSReview         = lazyWithRetry(() => import('./components/srs/SRSReview'))
const VocabularyPage    = lazyWithRetry(() => import('./pages/VocabularyPage'))
const ProfilePage       = lazyWithRetry(() => import('./pages/ProfilePage'))
const UserProfilePage   = lazyWithRetry(() => import('./pages/UserProfilePage'))
const ProgressPage      = lazyWithRetry(() => import('./pages/ProgressPage'))
const SpeechPage        = lazyWithRetry(() => import('./pages/SpeechPage'))
const SettingsPage      = lazyWithRetry(() => import('./pages/SettingsPage'))
const AchievementsPage  = lazyWithRetry(() => import('./pages/AchievementsPage'))
const KanaPage          = lazyWithRetry(() => import('./pages/KanaPage'))
const LandingPage       = lazyWithRetry(() => import('./pages/LandingPage'))
const ConversationPracticePage = lazyWithRetry(() => import('./pages/ConversationPracticePage'))

function LazyRoute({ Component, message = 'Loading section...' }) {
  return (
    <ErrorBoundary FallbackComponent={RouteErrorFallback}>
      <Suspense fallback={<RouteLoadingFallback message={message} />}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  )
}

export default function App() {
  const { initialize } = useAuthStore()

  useEffect(() => {
    initialize()
    if (typeof window.__dismissLoader === 'function') {
      window.__dismissLoader()
    }
  }, [])

  return (
    <Routes>
      {/* ── Public auth & landing routes ── */}
      <Route path="/"               element={<LazyRoute Component={LandingPage} message="Loading Kando Japanese..." />} />
      <Route element={<AuthGuard requireAuth={false} />}>
        <Route path="/login"          element={<LazyRoute Component={LoginPage} message="Loading sign-in..." />} />
        <Route path="/register"       element={<LazyRoute Component={RegisterPage} message="Loading registration..." />} />
        <Route path="/reset-password" element={<LazyRoute Component={ResetPasswordPage} message="Loading password reset..." />} />
      </Route>

      {/* ── App Shell (wrapped in Layout) ── */}
      <Route element={<Layout />}>
        {/* ── Public / Guest-friendly learning routes ── */}
        <Route path="/reading"             element={<ReadingPage />} />
        <Route path="/reading/:storyId"    element={<ReadingPage />} />
        <Route path="/kana"                element={<LazyRoute Component={KanaPage} message="Loading Kana studio..." />} />
        <Route path="/grammar"             element={<LazyRoute Component={GrammarPage} message="Loading grammar..." />} />
        <Route path="/kanji"               element={<LazyRoute Component={KanjiPage} message="Loading kanji..." />} />
        <Route path="/kanji/:kanjiId"      element={<LazyRoute Component={KanjiStudy} message="Loading kanji details..." />} />

        {/* ── Protected routes requiring Authentication ── */}
        <Route element={<AuthGuard />}>
          <Route path="/dashboard"           element={<LazyRoute Component={Dashboard} message="Loading dashboard..." />} />

          {/* ── Story Lessons (Unified Learning Center: Stories, Grammar, Vocab, Quizzes) ── */}
          <Route path="/lessons/*"           element={<Navigate to="/reading" replace />} />
          <Route path="/lessons"             element={<Navigate to="/reading" replace />} />
          {/* Quiz center and lesson-specific quiz engine */}
          <Route
            path="/quiz"
            element={
              <LazyRoute
                Component={QuizPage}
                message="Loading quiz center..."
              />
            }
          />
          <Route
            path="/quiz/:lessonId"
            element={
              <LazyRoute
                Component={QuizEngine}
                message="Preparing your quiz..."
              />
            }
          />
          <Route
            path="/quiz/*"
            element={<Navigate to="/quiz" replace />}
          />

          {/* ── Legacy Drama redirect to Graded Reader ── */}
          <Route path="/drama/*"             element={<Navigate to="/reading" replace />} />
          <Route path="/drama"               element={<Navigate to="/reading" replace />} />

          {/* ── Chat & 3D Sensei ── */}
          <Route path="/sensei"              element={<LazyRoute Component={SenseiPage} message="Loading Sensei 3D Studio..." />} />
          <Route path="/conversation"        element={<LazyRoute Component={ConversationPracticePage} message="Loading conversation practice..." />} />
          <Route path="/chat"                element={<Navigate to="/conversation" replace />} />
          <Route path="/chat-dojo"           element={<Navigate to="/conversation" replace />} />
          <Route path="/chatbot"             element={<Navigate to="/conversation" replace />} />

          {/* ── SRS review ── */}
          <Route path="/review"              element={<LazyRoute Component={SRSReview} message="Loading SRS review..." />} />

          {/* ── Vocabulary ── */}
          <Route path="/vocabulary"          element={<LazyRoute Component={VocabularyPage} message="Loading vocabulary..." />} />
          <Route path="/flashcards"          element={<Navigate to="/vocabulary" replace />} />

          {/* ── Profile ── */}
          <Route path="/profile"             element={<LazyRoute Component={ProfilePage} message="Loading profile..." />} />
          <Route path="/profile/:userId"     element={<LazyRoute Component={UserProfilePage} message="Loading user profile..." />} />

          {/* ── Other ── */}
          <Route path="/progress"            element={<LazyRoute Component={ProgressPage} message="Loading progress analytics..." />} />
          <Route path="/speech"              element={<LazyRoute Component={SpeechPage} message="Loading speech engine..." />} />
          <Route path="/settings"            element={<LazyRoute Component={SettingsPage} message="Loading settings..." />} />
          <Route path="/achievements"        element={<LazyRoute Component={AchievementsPage} message="Loading achievements..." />} />
        </Route>
      </Route>

      {/* ── 404 fallback ── */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}