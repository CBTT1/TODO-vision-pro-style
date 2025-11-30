import { Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'
import { motion } from 'framer-motion'

interface ThemeToggleProps {
  isDark: boolean
  onToggle: () => void
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="glass glass-strong depth-shadow hover:depth-shadow-hover border-2 border-current"
      title={isDark ? '切换到浅色模式（村庄）' : '切换到深色模式（末影之地）'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Moon className="w-5 h-5 text-[#bd93f9]" />
        ) : (
          <Sun className="w-5 h-5 text-[#ffb86c]" />
        )}
      </motion.div>
    </Button>
  )
}

