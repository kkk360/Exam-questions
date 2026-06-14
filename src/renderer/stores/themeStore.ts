import { create } from 'zustand'

type ThemeMode = 'light' | 'dark'

interface ThemeStore {
  mode: ThemeMode
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
}

const getInitialMode = (): ThemeMode => {
  try {
    const saved = localStorage.getItem('theme-mode')
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    /* ignore */
  }
  return 'light'
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: getInitialMode(),
  toggleTheme: () =>
    set((state) => {
      const next = state.mode === 'light' ? 'dark' : 'light'
      try {
        localStorage.setItem('theme-mode', next)
      } catch {
        /* ignore */
      }
      return { mode: next }
    }),
  setTheme: (mode) => {
    try {
      localStorage.setItem('theme-mode', mode)
    } catch {
      /* ignore */
    }
    set({ mode })
  }
}))
