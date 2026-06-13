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
    set({ exams: [...get().exams, exam] })
    return exam
  },

  updateExam: async (id, data) => {
    const updated = await window.electron.exams.update(id, data)
    if (updated) {
      set({
        exams: get().exams.map((e) => (e.id === id ? updated : e))
      })
    }
  },

  deleteExam: async (id) => {
    await window.electron.exams.delete(id)
    set({ exams: get().exams.filter((e) => e.id !== id) })
  },

  duplicateExam: async (id) => {
    const duplicated = await window.electron.exams.duplicate(id)
    if (duplicated) {
      set({ exams: [...get().exams, duplicated] })
    }
  }
}))
