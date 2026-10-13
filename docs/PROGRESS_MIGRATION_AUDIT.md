# Progress & XP Migration Audit (Checkpoint F4)

> **Date**: 2026-08-23  
> **Status**: In Progress  
> **Scope**: user_lesson_progress, user_kanji_progress, user_vocabulary_progress, user_streaks, user_badges, XP calculation, streaks, badges, progress reset, progress dashboard charts.

---

## 1. Executive Summary

This document audits all legacy Supabase operations related to progress tracking, XP points, streaks, badges, and user statistics across the Nihongo Master application, and defines the exact backend API endpoints and schema operations replacing them.

---

## 2. Legacy Supabase Operation Inventory

| Feature | Component / File | Old Supabase Operation | Target Backend Replacement |
|---|---|---|---|
| **Overview Stats** | useProgress.js, ProgressPage.jsx, ProfilePage.jsx | supabase.from('user_lesson_progress').select('*', { count: 'exact' })<br>supabase.from('user_kanji_progress').select(...)<br>supabase.from('user_vocabulary_progress').select(...)<br>supabase.from('srs_cards').select(...)<br>supabase.from('user_badges').select(...) | GET /api/progress<br>(Calls pi.progress.getProgress()) |
| **Lesson Completion** | useProgress.js (completeLesson) | supabase.from('user_lesson_progress').upsert(...)<br>supabase.from('user_streaks').upsert(...)<br>Client-side XP & streak update to user_profiles | POST /api/progress/lesson<br>(Server-side atomic progress upsert, streak update, XP award, and badge evaluation) |
| **Activity XP Awarding** | progressStore.js (ddXP, ward*XP) | supabase.from('user_profiles').update({ xp_points, current_level }) | POST /api/progress/xp<br>(Server-side atomic XP increments with validation) |
| **Daily Streak Update** | progressStore.js (updateStreak) | supabase.from('user_profiles').update({ streak_days, last_study_date }) | POST /api/progress/streak<br>(Calculated via server streakService.ts) |
| **Badge Checking & Awarding** | useProgress.js (checkAndAwardBadges) | supabase.from('user_badges').select(...)<br>supabase.from('user_badges').insert(...) | GET /api/progress/badges<br>POST /api/progress/badges<br>(Automatic evaluation on progress events) |
| **Streak History / Chart** | ProgressChart.jsx | supabase.from('user_streaks').select('*').eq('user_id', ...).order('date') | GET /api/progress/streaks<br>(Calls pi.progress.getStreakHistory()) |
| **Progress Reset** | SettingsPage.jsx | Cascading supabase.from(...).delete() queries | DELETE /api/progress/reset<br>(Atomic Drizzle transaction) |

---

## 3. Detailed Business Logic & Formula Preservations

### A. XP Calculation
- **Lesson XP**:
  - Score >= 90%: 15 XP (LESSON_PERFECT)
  - Score >= 80%: 12 XP (LESSON_GREAT)
  - Score >= 60%: 8 XP (LESSON_GOOD)
  - Score < 60%: 3 XP (LESSON_PASS)
- **Quiz XP**:
  - Score >= 100%: 12 XP
  - Score >= 80%: 8 XP
  - Score >= 60%: 4 XP
  - Score < 60%: 1 XP
- **SRS Reviews**:
  - Correct review (quality >= 3): 2 XP
  - Easy review (quality >= 5): 3 XP
  - Mastered card: 5 XP
- **Milestones / New Items**:
  - Kanji Learned: 8 XP
  - Vocabulary Learned: 4 XP
  - Grammar Point: 6 XP
  - Daily Goal Completed: 10 XP
  - First activity of day: 3 XP

### B. JLPT & User Levels
- **JLPT Thresholds**:
  - N5: 0 - 2,499 XP
  - N4: 2,500 - 7,999 XP
  - N3: 8,000 - 19,999 XP
  - N2: 20,000 - 44,999 XP
  - N1: 45,000+ XP
- **User Level**:
  - Quadratic progression: Level $ threshold =  \times L \times (L + 1) / 2$.

### C. Streak Calculation
- **Rule**: Consecutive UTC calendar days with qualifying learning activity in user_streaks.
- **Deduplication**: Multiple activities on the same date are upserted into the same (user_id, date) row and increment lessons_completed / minutes_studied.
- **Gaps**: A gap of 1+ days resets the current streak to 1 (if active today) or 0 (if inactive today and yesterday).
- **Streak Bonus XP**: Flat bonus at day 7 (+5 XP), day 30 (+15 XP), day 100 (+30 XP), and day 365 (+50 XP).

### D. Badge Awarding
- Total 22 badges across lessons (1, 10, 25, 50, 100), kanji (10, 50, 100, 200, 500), vocab (50, 200, 500), streaks (3, 7, 14, 30, 100, 365), XP (500, 2500, 8000, 20000, 45000), and SRS (100, 500, 50 mastered).
- Enforced by unique constraint user_badge_unique (user_id, badge_type) in TiDB to prevent duplicates.

---

## 4. Backend Endpoints Matrix

1. GET /api/progress: Complete progress summary (	otalXP, streakDays, userLevel, jlptLevel, lessonsCompleted, kanjiLearned, ocabLearned, cardsMastered, srsReviewsDue).
2. POST /api/progress/lesson: Completes lesson, updates streak and XP, checks badges.
3. POST /api/progress/xp: Submits XP event (e.g., kanji learned, quiz completed, srs review).
4. GET /api/progress/streak: Current and longest streak info.
5. POST /api/progress/streak: Records activity for today and returns updated streak.
6. GET /api/progress/streaks: Historical streak records for the last 30 days.
7. GET /api/progress/badges: List of earned badges.
8. POST /api/progress/badges: Manually award/unlock badge if requirements met.
9. DELETE /api/progress/reset: Transactional deletion of all user progress, resetting XP and streak to 0.

