import { randomUUID } from 'crypto'
import { getExams, saveExams, getQuestions, type ExamPaper, type Section } from '../storage/store'

export function listExams(): ExamPaper[] {
  return getExams().exams.filter((e) => !e.deleted)
}

export function listTrashExams(): ExamPaper[] {
  return getExams().exams.filter((e) => e.deleted)
}

export function getExamById(id: string): ExamPaper | null {
  return getExams().exams.find((e) => e.id === id) || null
}

export function getExamWithQuestions(id: string): {
  exam: ExamPaper
  questionsMap: Record<string, any>
} | null {
  const exam = getExamById(id)
  if (!exam) return null

  const allQuestions = getQuestions().questions
  const questionsMap: Record<string, any> = {}
  for (const section of exam.sections) {
    for (const sq of section.questions) {
      if (!questionsMap[sq.questionId]) {
        const q = allQuestions.find((q) => q.id === sq.questionId)
        if (q) questionsMap[sq.questionId] = q
      }
    }
  }
  return { exam, questionsMap }
}

export function createExam(data: Omit<ExamPaper, 'id' | 'createdAt' | 'updatedAt'>): ExamPaper {
  const now = new Date().toISOString()
  const exam: ExamPaper = {
    ...data,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now
  }
  const store = getExams()
  store.exams.push(exam)
  saveExams(store)
  return exam
}

export function updateExam(id: string, data: Partial<ExamPaper>): ExamPaper | null {
  const store = getExams()
  const index = store.exams.findIndex((e) => e.id === id)
  if (index === -1) return null

  store.exams[index] = {
    ...store.exams[index],
    ...data,
    id,
    updatedAt: new Date().toISOString()
  }
  saveExams(store)
  return store.exams[index]
}

export function deleteExam(id: string): boolean {
  const store = getExams()
  const exam = store.exams.find((e) => e.id === id)
  if (!exam) return false
  exam.deleted = true
  exam.deletedAt = new Date().toISOString()
  saveExams(store)
  return true
}

export function restoreExam(id: string): ExamPaper | null {
  const store = getExams()
  const exam = store.exams.find((e) => e.id === id)
  if (!exam) return null
  delete exam.deleted
  delete exam.deletedAt
  exam.updatedAt = new Date().toISOString()
  saveExams(store)
  return exam
}

export function permanentDeleteExam(id: string): boolean {
  const store = getExams()
  const len = store.exams.length
  store.exams = store.exams.filter((e) => !(e.id === id && e.deleted))
  if (store.exams.length === len) return false
  saveExams(store)
  return true
}

export function emptyTrash(): number {
  const store = getExams()
  const before = store.exams.length
  store.exams = store.exams.filter((e) => !e.deleted)
  const deleted = before - store.exams.length
  if (deleted > 0) saveExams(store)
  return deleted
}

export function duplicateExam(id: string): ExamPaper | null {
  const original = getExamById(id)
  if (!original) return null

  const now = new Date().toISOString()
  const newSections: Section[] = original.sections.map((s) => ({
    ...s,
    id: randomUUID(),
    questions: s.questions.map((q) => ({ ...q }))
  }))

  const newExam: ExamPaper = {
    ...original,
    id: randomUUID(),
    title: original.title + ' (副本)',
    sections: newSections,
    createdAt: now,
    updatedAt: now
  }

  const store = getExams()
  store.exams.push(newExam)
  saveExams(store)
  return newExam
}
