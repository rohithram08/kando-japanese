// src/pages/ProgressPage.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'

/**
 * Progress and stats are now unified directly inside the Dashboard!
 * This page redirects to /dashboard.
 */
export default function ProgressPage() {
  return <Navigate to="/dashboard" replace />
}
