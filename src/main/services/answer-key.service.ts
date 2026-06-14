import { randomUUID } from 'crypto'
import { getAnswerKeys, saveAnswerKeys, type AnswerKey } from '../storage/store'

export function listAnswerKeys(): AnswerKey[] {
  return getAnswerKeys().answerKeys.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function createAnswerKey(
  data: Omit<AnswerKey, 'id' | 'createdAt' | 'updatedAt'>
): AnswerKey {
  const now = new Date().toISOString()
  const key: AnswerKey = {
    ...data,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now
  }
  const store = getAnswerKeys()
  store.answerKeys.push(key)
  saveAnswerKeys(store)
  return key
}

export function deleteAnswerKey(id: string): boolean {
  const store = getAnswerKeys()
  const len = store.answerKeys.length
  store.answerKeys = store.answerKeys.filter((k) => k.id !== id)
  if (store.answerKeys.length === len) return false
  saveAnswerKeys(store)
  return true
}

export function getAnswerKeyById(id: string): AnswerKey | null {
  return getAnswerKeys().answerKeys.find((k) => k.id === id) || null
}
