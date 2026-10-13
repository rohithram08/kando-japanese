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

// ── Route-level code-split pages (loaded on demand) ─────────────
const LoginPage         = lazy(() => import('./components/auth/LoginPage'))
const RegisterPage      = lazy(() => import('./components/auth/RegisterPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const Dashboard         = lazy(() => import('./components/dashboard/Dashboard'))
const LessonsPage       = lazy(() => import('./pages/LessonsPage'))
const LessonList        = lazy(() => import('./components/lessons/LessonList'))
const LessonViewer      = lazy(() => import('./components/lessons/LessonViewer'))
const GrammarPage       = lazy(() => import('./pages/GrammarPage'))
const KanjiPage         = lazy(() => import('./pages/KanjiPage'))
const KanjiStudy        = lazy(() => import('./components/kanji/KanjiStudy'))
const QuizPage          = lazy(() => import('./pages/QuizPage'))
const QuizEngine        = lazy(() => import('./components/quiz/QuizEngine'))
const DramaPlayer       = lazy(() => import('./components/drama/DramaPlayer'))
const SenseiPage        = lazy(() => import('./pages/SenseiPage'))
const ChatInterface     = lazy(() => import('./components/chatbot/ChatInterface'))
const ChatDojo          = lazy(() => import('./pages/ChatDojo'))
const SRSReview         = lazy(() => import('./components/srs/SRSReview'))
const VocabularyPage    = lazy(() => import('./pages/VocabularyPage'))
const ProfilePage       = lazy(() => import('./pages/ProfilePage'))
const UserProfilePage   = lazy(() => import('./pages/UserProfilePage'))
const ProgressPage      = lazy(() => import('./pages/ProgressPage'))
const SpeechPage        = lazy(() => import('./pages/SpeechPage'))
const SettingsPage      = lazy(() => import('./pages/SettingsPage'))
const AchievementsPage  = lazy(() => import('./pages/AchievementsPage'))
const KanaPage          = lazy(() => import('./pages/KanaPage'))
const LandingPage       = lazy(() => import('./pages/LandingPage'))
const ConversationPracticePage = lazy(() => import('./pages/ConversationPracticePage'))

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
      <Route path="/"               element={<LazyRoute Component={LandingPage} message="Loading Nihongo Master..." />} />
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

        {/* ── Protected routes requiring Authentication ── */}
        <Route element={<AuthGuard />}>
          <Route path="/dashboard"           element={<LazyRoute Component={Dashboard} message="Loading dashboard..." />} />

          {/* ── Lessons ── */}
          <Route path="/lessons"             element={<LazyRoute Component={LessonsPage} message="Loading lessons..." />} />
          <Route path="/lessons/browse"      element={<LazyRoute Component={LessonList} message="Loading lesson catalog..." />} />
          <Route path="/lessons/:level/:day" element={<LazyRoute Component={LessonViewer} message="Loading lesson..." />} />

          {/* ── Grammar ── */}
          <Route path="/grammar"             element={<LazyRoute Component={GrammarPage} message="Loading grammar guide..." />} />

          {/* ── Kanji ── */}
          <Route path="/kanji"               element={<LazyRoute Component={KanjiPage} message="Loading Kanji library..." />} />
          <Route path="/kanji/study"         element={<LazyRoute Component={KanjiStudy} message="Loading Kanji study..." />} />

          {/* ── Quiz ── */}
          <Route path="/quiz"                element={<LazyRoute Component={QuizPage} message="Loading quiz..." />} />
          <Route path="/quiz/:lessonId"      element={<LazyRoute Component={QuizEngine} message="Loading quiz engine..." />} />

          {/* ── Drama ── */}
          <Route path="/drama"               element={<LazyRoute Component={DramaPlayer} message="Loading drama player..." />} />

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