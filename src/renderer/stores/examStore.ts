import { create } from 'zustand'
import type { ExamPaper } from '../types'

interface ExamStore {
  exams: ExamPaper[]
  trash: ExamPaper[]
  loading: boolean
  setExams: (exams: ExamPaper[]) => void
  setTrash: (trash: ExamPaper[]) => void
  setLoading: (loading: boolean) => void
  fetchExams: () => Promise<void>
  fetchTrash: () => Promise<void>
  createExam: (data: any) => Promise<ExamPaper>
  updateExam: (id: string, data: any) => Promise<void>
  deleteExam: (id: string) => Promise<void>
  duplicateExam: (id: string) => Promise<void>
  restoreExam: (id: string) => Promise<void>
  permanentDelete: (id: string) => Promise<void>
  emptyTrash: () => Promise<void>
}

export const useExamStore = create<ExamStore>((set, get) => ({
  exams: [],
  trash: [],
  loading: false,

  setExams: (exams) => set({ exams }),
  setTrash: (trash) => set({ trash }),
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

  fetchTrash: async () => {
    const trash = await window.electron.exams.listTrash()
    set({ trash })
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
    set({
      exams: get().exams.filter((e) => e.id !== id),
      trash: [
        ...get().trash,
        {
          ...get().exams.find((e) => e.id === id)!,
          deleted: true,
          deletedAt: new Date().toISOString()
        }
      ]
    })
  },

  duplicateExam: async (id) => {
    const duplicated = await window.electron.exams.duplicate(id)
    if (duplicated) {
      set({ exams: [...get().exams, duplicated] })
    }
  },

  restoreExam: async (id) => {
    const restored = await window.electron.exams.restore(id)
    if (restored) {
      set({
        trash: get().trash.filter((e) => e.id !== id),
        exams: [...get().exams, restored]
      })
    }
  },

  permanentDelete: async (id) => {
    await window.electron.exams.permanentDelete(id)
    set({ trash: get().trash.filter((e) => e.id !== id) })
  },

  emptyTrash: async () => {
    await window.electron.exams.emptyTrash()
    set({ trash: [] })
  }
}))
