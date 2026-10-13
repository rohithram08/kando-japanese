import React from 'react'
import { motion } from 'framer-motion'

const SIZES = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
  xl: 'w-16 h-16 border-4',
}

const LoadingSpinner = ({ size = 'md', className = '', text = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`
          ${SIZES[size] || SIZES.md}
          rounded-full
          border-gray-700
          border-t-red-500
        `}
      />
      {text && (
        <p className="text-sm text-gray-400 animate-pulse">{text}</p>
      )}
    </div>
  )
}

export default LoadingSpinner