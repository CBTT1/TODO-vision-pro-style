import { useEffect, useState } from 'react'

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme-mode')
    return saved ? saved === 'dark' : true
  })

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('theme-mode')
      setIsDark(saved ? saved === 'dark' : true)
    }

    window.addEventListener('storage', handleStorageChange)
    const interval = setInterval(handleStorageChange, 100)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  return isDark
}

