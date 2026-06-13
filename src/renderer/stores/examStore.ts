import { create } from 'zustand'
import type { ExamPaper } from '../types'

interface ExamStore {
  exams: ExamPaper[]
  loading: boolean
  setExams: (exams: ExamPaper[]) => void
  setLoading: (loading: boolean) => void
  fetchExams: () => Promise<void>
  createExam: (data: any) => Promise<ExamPaper>
  updateExam: (id: string, data: any) => Promise<void>
  deleteExam: (id: string) => Promise<void>
  duplicateExam: (id: string) => Promise<void>
}

export const useExamStore = create<ExamStore>((set, get) => ({
  exams: [],
  loading: false,

  setExams: (exams) => set({ exams }),
  setLoading: (loading) => set({ loading }),

  fetchExams: async () => {
    set({ loading: true })
    try {
      const exams = await window.electron.exams.list()
      set({ exams })
    } finally {
      set({ loading: false })
    }
  },

  createExam: async (data) => {
    const exam = await window.electron.exams.create(data)
    await get().fetchExams()
    return exam
  },

  updateExam: async (id, data) => {
    await window.electron.exams.update(id, data)
    await get().fetchExams()
  },

  deleteExam: async (id) => {
    await window.electron.exams.delete(id)
    await get().fetchExams()
  },

  duplicateExam: async (id) => {
    await window.electron.exams.duplicate(id)
    await get().fetchExams()
  }
}))
