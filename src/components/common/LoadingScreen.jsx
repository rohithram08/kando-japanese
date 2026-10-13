import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white
                    flex flex-col items-center justify-center">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-7xl mb-6"
      >
        🎌
      </motion.div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">NihonGo Master</h1>
      <div className="flex gap-1 mt-4">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            className="w-2.5 h-2.5 bg-red-400 rounded-full"
          />
        ))}
      </div>
      <p className="text-gray-400 text-sm mt-4">日本語を学ぼう...</p>
    </div>
  )
}