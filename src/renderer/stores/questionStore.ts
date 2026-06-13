import { create } from 'zustand'
import type { Question, QuestionFilters } from '../types'

interface QuestionStore {
  questions: Question[]
  filters: QuestionFilters
  loading: boolean
  setQuestions: (questions: Question[]) => void
  setFilters: (filters: QuestionFilters) => void
  setLoading: (loading: boolean) => void
  fetchQuestions: (filters?: QuestionFilters) => Promise<void>
  createQuestion: (data: any) => Promise<Question>
  updateQuestion: (id: string, data: any) => Promise<void>
  deleteQuestion: (id: string) => Promise<void>
  batchDelete: (ids: string[]) => Promise<void>
}

export const useQuestionStore = create<QuestionStore>((set, get) => ({
  questions: [],
  filters: {},
  loading: false,

  setQuestions: (questions) => set({ questions }),
  setFilters: (filters) => set({ filters }),
  setLoading: (loading) => set({ loading }),

  fetchQuestions: async (filters) => {
    set({ loading: true })
    try {
      const questions = await window.electron.questions.list(filters || get().filters)
      set({ questions })
    } finally {
      set({ loading: false })
    }
  },

  createQuestion: async (data) => {
    const question = await window.electron.questions.create(data)
    set({ questions: [...get().questions, question] })
    return question
  },

  updateQuestion: async (id, data) => {
    const updated = await window.electron.questions.update(id, data)
    if (updated) {
      set({
        questions: get().questions.map((q) => (q.id === id ? updated : q))
      })
    }
  },

  deleteQuestion: async (id) => {
    await window.electron.questions.delete(id)
    set({ questions: get().questions.filter((q) => q.id !== id) })
  },

  batchDelete: async (ids) => {
    await window.electron.questions.batchDelete(ids)
    const idSet = new Set(ids)
    set({ questions: get().questions.filter((q) => !idSet.has(q.id)) })
  }
}))
