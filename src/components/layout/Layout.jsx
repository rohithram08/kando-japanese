import React, { useState, useEffect, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import MobileNav from './MobileNav'
import CelebrationPortal from '../celebration/CelebrationPortal'
import { useNotificationEngine } from '../../hooks/useNotificationEngine'
const SenseiCompanion = React.lazy(() => import('../sensei/SenseiCompanion'))

const MOBILE_BREAKPOINT = 768
const SIDEBAR_OPEN_WIDTH = 240
const SIDEBAR_CLOSED_WIDTH = 72
const COLLAPSE_STORAGE_KEY = 'nihongo-sidebar-collapsed'

const Layout = () => {
  // Watches real app state (SRS due, streaks, badges, level, daily goals)
  // and generates real notifications — runs for the whole authenticated app.
  useNotificationEngine()

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })
  const [isMobile, setIsMobile] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const checkMobile = useCallback(() => {
    const mobile = window.innerWidth < MOBILE_BREAKPOINT
    setIsMobile(mobile)
    if (!mobile) setMobileDrawerOpen(false)
  }, [])

  useEffect(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [checkMobile])

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem(COLLAPSE_STORAGE_KEY, next ? '1' : '0')
      } catch {
        /* localStorage unavailable — non-critical */
      }
      return next
    })
  }

  const sidebarWidth = isMobile ? 0 : collapsed ? SIDEBAR_CLOSED_WIDTH : SIDEBAR_OPEN_WIDTH

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* ── Desktop sidebar: Full height on desktop, starting from top-0 ── */}
      {!isMobile && (
        <div
          className="fixed top-0 left-0 bottom-0 z-40 overflow-hidden transition-all duration-300"
          style={{ width: sidebarWidth }}
        >
          <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapsed} />
        </div>
      )}

      {/* ── Fixed Navbar: on desktop sits right of sidebar, on mobile spans full width ── */}
      <div
        className="fixed top-0 right-0 z-30 transition-all duration-300"
        style={{ left: isMobile ? 0 : sidebarWidth }}
      >
        <Navbar onMobileMenuToggle={isMobile ? () => setMobileDrawerOpen((prev) => !prev) : undefined} />
      </div>

      {/* ── Body row: main content ── */}
      <div className="flex flex-1 pt-16">
        {/* Main scrollable content — push right by sidebar width */}
        <motion.main
          animate={{ marginLeft: isMobile ? 0 : sidebarWidth }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-1 min-h-[calc(100vh-4rem)] pb-20 md:pb-6 w-full"
        >
          <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <Outlet />
          </div>
        </motion.main>
      </div>

      {/* ── Mobile bottom nav ── */}
      {isMobile && <MobileNav onMoreClick={() => setMobileDrawerOpen(true)} />}

      {/* ── Mobile sidebar drawer ── */}
      <AnimatePresence>
        {isMobile && mobileDrawerOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileDrawerOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 left-0 h-full z-50"
            >
              <Sidebar isMobileDrawer onClose={() => setMobileDrawerOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <React.Suspense fallback={null}>
        <SenseiCompanion />
      </React.Suspense>

      {/* ── Global 2D Celebration Portal (Level Up, XP Gain, Streak Step) ── */}
      <CelebrationPortal />
    </div>
  )
}

export default Layout
