import { dialog } from 'electron'
import { readFileSync, writeFileSync } from 'fs'
import { getQuestions, saveQuestions, getExams, saveExams } from '../storage/store'

interface ImportResult {
  success: number
  skipped: number
  errors: string[]
}

export function importQuestions(filePath: string): ImportResult {
  try {
    const raw = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw)

    if (!data.questions || !Array.isArray(data.questions)) {
      return { success: 0, skipped: 0, errors: ['Invalid format: missing questions array'] }
    }

    const store = getQuestions()
    const existingIds = new Set(store.questions.map((q) => q.id))
    let success = 0
    let skipped = 0

    for (const q of data.questions) {
      if (existingIds.has(q.id)) {
        skipped++
      } else {
        store.questions.push(q)
        success++
      }
    }

    if (success > 0) saveQuestions(store)
    return { success, skipped, errors: [] }
  } catch (e: any) {
    return { success: 0, skipped: 0, errors: [e.message] }
  }
}

export function exportQuestions(filePath: string, ids?: string[]): void {
  const { questions } = getQuestions()
  let toExport = questions
  if (ids && ids.length > 0) {
    const idSet = new Set(ids)
    toExport = questions.filter((q) => idSet.has(q.id))
  }
  const data = JSON.stringify({ version: 1, questions: toExport }, null, 2)
  writeFileSync(filePath, data, 'utf-8')
}

export function importExams(filePath: string): ImportResult {
  try {
    const raw = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw)

    if (!data.exams || !Array.isArray(data.exams)) {
      return { success: 0, skipped: 0, errors: ['Invalid format: missing exams array'] }
    }

    const store = getExams()
    const existingIds = new Set(store.exams.map((e) => e.id))
    let success = 0
    let skipped = 0

    for (const exam of data.exams) {
      if (existingIds.has(exam.id)) {
        skipped++
      } else {
        store.exams.push(exam)
        success++
      }
    }

    if (success > 0) saveExams(store)
    return { success, skipped, errors: [] }
  } catch (e: any) {
    return { success: 0, skipped: 0, errors: [e.message] }
  }
}

export function exportExams(filePath: string, ids?: string[]): void {
  const { exams } = getExams()
  let toExport = exams
  if (ids && ids.length > 0) {
    const idSet = new Set(ids)
    toExport = exams.filter((e) => idSet.has(e.id))
  }
  const data = JSON.stringify({ version: 1, exams: toExport }, null, 2)
  writeFileSync(filePath, data, 'utf-8')
}

export async function showSaveDialog(
  defaultName: string,
  filters: { name: string; extensions: string[] }[]
): Promise<string | null> {
  const result = await dialog.showSaveDialog({
    defaultPath: defaultName,
    filters
  })
  return result.canceled ? null : result.filePath || null
}

export async function showOpenDialog(
  filters: { name: string; extensions: string[] }[]
): Promise<string | null> {
  const result = await dialog.showOpenDialog({
    filters,
    properties: ['openFile']
  })
  return result.canceled || result.filePaths.length === 0 ? null : result.filePaths[0]
}
