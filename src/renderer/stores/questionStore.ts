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
    await get().fetchQuestions()
    return question
  },

  updateQuestion: async (id, data) => {
    await window.electron.questions.update(id, data)
    await get().fetchQuestions()
  },

  deleteQuestion: async (id) => {
    await window.electron.questions.delete(id)
    await get().fetchQuestions()
  },

  batchDelete: async (ids) => {
    await window.electron.questions.batchDelete(ids)
    await get().fetchQuestions()
  }
}))
