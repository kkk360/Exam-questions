import { create } from 'zustand'
import type { AnswerKey } from '../types'

interface AnswerKeyStore {
  keys: AnswerKey[]
  loading: boolean
  fetchKeys: () => Promise<void>
  createKey: (data: Omit<AnswerKey, 'id' | 'createdAt' | 'updatedAt'>) => Promise<AnswerKey>
  deleteKey: (id: string) => Promise<void>
}

export const useAnswerKeyStore = create<AnswerKeyStore>((set, get) => ({
  keys: [],
  loading: false,

  fetchKeys: async () => {
    set({ loading: true })
    try {
      const keys = await window.electron.answerKeys.list()
      set({ keys })
    } finally {
      set({ loading: false })
    }
  },

  createKey: async (data) => {
    const key = await window.electron.answerKeys.create(data)
    set({ keys: [key, ...get().keys] })
    return key
  },

  deleteKey: async (id) => {
    await window.electron.answerKeys.delete(id)
    set({ keys: get().keys.filter((k) => k.id !== id) })
  }
}))
