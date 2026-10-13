import React, { useState, useEffect, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import MobileNav from './MobileNav'
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
  const [isReady, setIsReady] = useState(false)

  const checkMobile = useCallback(() => {
    const mobile = window.innerWidth < MOBILE_BREAKPOINT
    setIsMobile(mobile)
    if (!mobile) setMobileDrawerOpen(false)
  }, [])

  useEffect(() => {
    checkMobile()
    const t = setTimeout(() => setIsReady(true), 50)
    window.addEventListener('resize', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
      clearTimeout(t)
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
      {/* ── Fixed Navbar spans full width at top ── */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar onMobileMenuToggle={isMobile ? () => setMobileDrawerOpen((prev) => !prev) : undefined} />
      </div>

      {/* ── Body row: sidebar + main content ── */}
      <div className="flex flex-1 pt-16">
        {/* Desktop sidebar — fixed, sits below navbar */}
        {!isMobile && (
          <div
            className="fixed top-16 left-0 bottom-0 z-40 overflow-hidden transition-all duration-300 border-r border-border"
            style={{ width: sidebarWidth }}
          >
            <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapsed} />
          </div>
        )}

        {/* Main scrollable content — push right by sidebar width */}
        <motion.main
          animate={{ marginLeft: isMobile ? 0 : sidebarWidth }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-1 min-h-[calc(100vh-4rem)] pb-20 md:pb-6 w-full"
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
            <AnimatePresence mode="wait">
              {isReady && (
                <motion.div
                  key="outlet"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <Outlet />
                </motion.div>
              )}
            </AnimatePresence>
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
    </div>
  )
}

export default Layout
