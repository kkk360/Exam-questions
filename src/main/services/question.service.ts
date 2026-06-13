import { v4 as uuidv4 } from 'uuid'
import {
  getQuestions,
  saveQuestions,
  type Question
} from '../storage/store'

export interface QuestionFilters {
  type?: string
  subject?: string
  difficulty?: number
  tags?: string[]
  keyword?: string
}

export function listQuestions(filters?: QuestionFilters): Question[] {
  const { questions } = getQuestions()
  if (!filters) return questions

  return questions.filter((q) => {
    if (filters.type && q.type !== filters.type) return false
    if (filters.subject && q.subject !== filters.subject) return false
    if (filters.difficulty && q.difficulty !== filters.difficulty) return false
    if (filters.tags && filters.tags.length > 0) {
      if (!filters.tags.some((t) => q.tags.includes(t))) return false
    }
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase()
      if (!q.content.toLowerCase().includes(kw) && !q.tags.some((t) => t.toLowerCase().includes(kw))) {
        return false
      }
    }
    return true
  })
}

export function getQuestionById(id: string): Question | null {
  const { questions } = getQuestions()
  return questions.find((q) => q.id === id) || null
}

export function createQuestion(data: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Question {
  const now = new Date().toISOString()
  const question: Question = {
    ...data,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now
  }
  const store = getQuestions()
  store.questions.push(question)
  saveQuestions(store)
  return question
}

export function updateQuestion(id: string, data: Partial<Question>): Question | null {
  const store = getQuestions()
  const index = store.questions.findIndex((q) => q.id === id)
  if (index === -1) return null

  store.questions[index] = {
    ...store.questions[index],
    ...data,
    id,
    updatedAt: new Date().toISOString()
  }
  saveQuestions(store)
  return store.questions[index]
}

export function deleteQuestion(id: string): boolean {
  const store = getQuestions()
  const len = store.questions.length
  store.questions = store.questions.filter((q) => q.id !== id)
  if (store.questions.length === len) return false
  saveQuestions(store)
  return true
}

export function batchDeleteQuestions(ids: string[]): number {
  const store = getQuestions()
  const idSet = new Set(ids)
  const before = store.questions.length
  store.questions = store.questions.filter((q) => !idSet.has(q.id))
  const deleted = before - store.questions.length
  if (deleted > 0) saveQuestions(store)
  return deleted
}
