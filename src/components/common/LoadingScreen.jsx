import { motion } from 'framer-motion'
import KandoSlimeLogo from '../mascot/KandoSlimeLogo'
import { APP_VERSION, APP_CODENAME } from '../../config/version'

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background text-foreground
                    flex flex-col items-center justify-center transition-colors">
      <motion.div
        animate={{
          scale: [1, 1.15, 0.95, 1],
          y: [0, -12, 2, 0],
        }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-5"
      >
        <KandoSlimeLogo size={84} showBlossom />
      </motion.div>
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-2xl font-bold text-foreground">Kando Japanese</h1>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          v{APP_VERSION}
        </span>
      </div>
      <p className="text-xs text-muted-foreground/80 font-medium">Release {APP_CODENAME}</p>
      <div className="flex gap-1 mt-4">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            className="w-2.5 h-2.5 bg-primary rounded-full"
          />
        ))}
      </div>
      <p className="text-muted-foreground text-sm mt-4 font-jp">日本語を学ぼう...</p>
    </div>
  )
}
