# KANDO JAPANESE — DYNAMIC SLIME NOTIFICATION SYSTEM
## Production Architectural Guide & Specification

### 1. Overview & Visual Identity
The Kando Japanese notification system is inspired by the tactile, highly engaging Duolingo Android notification shade design, rendered with 100% original Kando Japanese visual identity built around the **Kando Slime mascot**.

- **Surface Design**: Deep forest-charcoal rounded cards (`#141a14` to `#192118`, `20px` border radius) with subtle translucent lime border strokes (`rgba(163, 230, 53, 0.16)`).
- **Mascot Presentation** ([`SlimeNotificationMascot.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/notifications/SlimeNotificationMascot.jsx)):
  - Expressive 2D vector SVG jelly slime with floating motion, specular glossy highlights, and blushing anime cheeks.
  - Thematic mood variants:
    - `daily`: Slime holding a golden alarm clock ⏰ with a friendly waving hand.
    - `srs`: Slime wearing intellectual reading glasses 👓 and holding a spaced-repetition study card.
    - `streak`: Slime surrounded by an energetic flame aura 🔥.
    - `achievement`: Slime crowned with a golden royal crown 👑.
    - `level_up`: Slime leaping with sparkle stars ⭐.
    - `study`: Slime holding an educational pencil ✏️.
    - `general`: Chubby mochi slime waving hello.
- **Card Hierarchy** ([`NotificationCard.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/notifications/NotificationCard.jsx)):
  - **Header**: Mini Slime app icon badge, "Kando Japanese", relative timestamp ("24m ago"), unread indicator dot, and accordion expand/collapse chevron.
  - **Body (Expanded)**: Two-column grid with 2D Slime illustration on the left, lime-green personalized greeting (`Hi {username}! It's Slime.`) and readable message on the right.
  - **Quick Actions**: Primary action pill button (`Start Lesson`, `Review Cards`, `Protect Streak`) and secondary action (`Remind me later` for a 2-hour snooze, or `Dismiss`).

---

### 2. Zero Hardcoding — Dynamic State Integration
Every notification and reminder is derived directly from live application state:
1. **User Profile & Display Name** ([`useAuthStore`](file:///e:/Nihongo-testing/nihongo-master/src/store/authStore.ts)):
   - Personalizes notifications with real usernames (`profile.username` or `user.email`).
2. **Spaced Repetition Queue** ([`useProgressStore`](file:///e:/Nihongo-testing/nihongo-master/src/store/progressStore.ts)):
   - Reads `srsReviewsDue` dynamically fetched via `loadSRSDue(user.id)` on focus and every 5 minutes.
   - Upserts in-place when cards are waiting, and automatically removes the reminder when cards are cleared.
3. **Streak Preservation & Milestones**:
   - Reads `streak` and daily completion state from `useDailyGoalsStore`.
   - Triggers evening streak saver (after 18:00) only if streak > 0 and user has not studied today.
   - Dedupes milestones (3, 7, 14, 30, 100, 365 days) via `seenStreakMilestones` so they never spam.
4. **Achievements & Badges**:
   - Calculates unlocked badges via `getBadges()` and notifies once with real badge titles and descriptions.
5. **JLPT Level Advancement**:
   - Monitors `jlptLevel` and celebrates level jumps (e.g. N5 → N4).
6. **User Preferences** ([`useSettingsStore`](file:///e:/Nihongo-testing/nihongo-master/src/store/settingsStore.js)):
   - Respects user settings: `dailyReminder`, `reminderTime`, `streakAlert`, `achievementAlert`, `weeklyReport`.

---

### 3. Architecture & File Structure
```
src/
├── components/
│   ├── layout/
│   │   └── Navbar.jsx                        # Bell trigger with live unread badge & popover mount
│   └── notifications/
│       ├── NotificationCenter.jsx            # Responsive notification center (popover/sheet)
│       ├── NotificationCard.jsx              # Duolingo-inspired dark rounded tactile card
│       ├── SlimeNotificationMascot.jsx       # 2D vector SVG Slime with 6 mood variants
│       ├── NotificationCenter.css            # Tactile styling, dark surfaces, responsive queries
│       └── __tests__/
│           └── NotificationCenter.test.tsx   # Vitest unit & integration test suite (12/12 passing)
├── hooks/
│   └── useNotificationEngine.js              # State watcher and dynamic notification generator
├── services/
│   └── browserNotificationService.js         # Safe Web Notification API integration & permissions
└── store/
    └── notificationStore.js                  # Persistent Zustand inbox with dedupe & snooze support
```

---

### 4. Browser & PWA Support
- **In-App Notification Center**: 100% operational in all browsers without requiring permissions.
- **Desktop / Web Notifications**:
  - Encapsulated in `browserNotificationService.js`.
  - Prompts permission strictly on user interaction (e.g. toggling reminder in Settings or clicking bell ring action).
  - Handles unsupported browsers and permission denial gracefully without exceptions.
  - Automatically navigates to the target page when the browser notification is clicked.
