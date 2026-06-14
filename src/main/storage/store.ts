import { readFileSync, writeFileSync, existsSync, copyFileSync, renameSync } from 'fs'
import {
  getQuestionsFilePath,
  getExamsFilePath,
  getConfigFilePath,
  getAnswerKeysFilePath
} from './paths'

interface Question {
  id: string
  type: 'single_choice' | 'multiple_choice' | 'fill_blank' | 'essay'
  subject: string
  chapter: string
  difficulty: number
  content: string
  contentImages: string[]
  options: { label: string; content: string }[]
  correctAnswer: string | string[]
  blankAnswers: string[]
  explanation: string
  tags: string[]
  score: number
  createdAt: string
  updatedAt: string
}

interface SectionQuestion {
  questionId: string
  displayOrder: number
  points: number
}

interface Section {
  id: string
  title: string
  description: string
  sortOrder: number
  questions: SectionQuestion[]
}

interface PageConfig {
  pageSize: 'A4' | 'B5' | 'Letter'
  orientation: 'portrait' | 'landscape'
  margins: { top: number; right: number; bottom: number; left: number }
  showAnswerKey: boolean
  showScoreBox: boolean
  headerFontSize: number
}

interface ExamPaper {
  id: string
  title: string
  subtitle: string
  subject: string
  duration: number
  totalScore: number
  schoolName: string
  sections: Section[]
  pageConfig: PageConfig
  deleted?: boolean
  deletedAt?: string
  createdAt: string
  updatedAt: string
}

interface AppConfig {
  dataDir: string
  lastOpenedAt: string
  preferences: {
    defaultSubject: string
    defaultDifficulty: number
    recentTags: string[]
    recentSubjects: string[]
    latexPreviewEnabled: boolean
  }
}

interface QuestionsData {
  version: number
  questions: Question[]
}

interface ExamsData {
  version: number
  exams: ExamPaper[]
}

// In-memory cache
let questionsCache: QuestionsData | null = null
let examsCache: ExamsData | null = null
let configCache: AppConfig | null = null

function atomicWrite(filePath: string, data: string): void {
  const tmpPath = filePath + '.tmp'
  writeFileSync(tmpPath, data, 'utf-8')
  if (existsSync(filePath)) {
    copyFileSync(filePath, filePath + '.bak')
  }
  renameSync(tmpPath, filePath)
}

function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (existsSync(filePath)) {
      const raw = readFileSync(filePath, 'utf-8')
      return JSON.parse(raw) as T
    }
  } catch (e) {
    console.error(`Failed to read ${filePath}:`, e)
  }
  return defaultValue
}

export function initStore(): void {
  const questionsPath = getQuestionsFilePath()
  const examsPath = getExamsFilePath()
  const configPath = getConfigFilePath()

  if (!existsSync(questionsPath)) {
    atomicWrite(questionsPath, JSON.stringify({ version: 1, questions: [] }))
  }
  if (!existsSync(examsPath)) {
    atomicWrite(examsPath, JSON.stringify({ version: 1, exams: [] }))
  }
  const answerKeysPath = getAnswerKeysFilePath()
  if (!existsSync(answerKeysPath)) {
    atomicWrite(answerKeysPath, JSON.stringify({ version: 1, answerKeys: [] }))
  }

  if (!existsSync(configPath)) {
    atomicWrite(
      configPath,
      JSON.stringify({
        dataDir: '',
        lastOpenedAt: new Date().toISOString(),
        preferences: {
          defaultSubject: '',
          defaultDifficulty: 3,
          recentTags: [],
          recentSubjects: [],
          latexPreviewEnabled: true
        }
      })
    )
  }
}

// Questions operations
export function getQuestions(): QuestionsData {
  if (!questionsCache) {
    questionsCache = readJsonFile<QuestionsData>(getQuestionsFilePath(), {
      version: 1,
      questions: []
    })
  }
  return questionsCache
}

export function saveQuestions(data: QuestionsData): void {
  questionsCache = data
  atomicWrite(getQuestionsFilePath(), JSON.stringify(data, null, 2))
}

// Exams operations
export function getExams(): ExamsData {
  if (!examsCache) {
    examsCache = readJsonFile<ExamsData>(getExamsFilePath(), { version: 1, exams: [] })
  }
  return examsCache
}

export function saveExams(data: ExamsData): void {
  examsCache = data
  atomicWrite(getExamsFilePath(), JSON.stringify(data, null, 2))
}

// Config operations
export function getConfig(): AppConfig {
  if (!configCache) {
    configCache = readJsonFile<AppConfig>(getConfigFilePath(), {
      dataDir: '',
      lastOpenedAt: new Date().toISOString(),
      preferences: {
        defaultSubject: '',
        defaultDifficulty: 3,
        recentTags: [],
        recentSubjects: [],
        latexPreviewEnabled: true
      }
    })
  }
  return configCache
}

export function saveConfig(config: AppConfig): void {
  configCache = config
  atomicWrite(getConfigFilePath(), JSON.stringify(config, null, 2))
}

// Re-export types for use in services
interface AnswerKeyItem {
  questionIndex: number
  type: string
  content: string
  answer: string
  explanation: string
}

interface AnswerKeySection {
  title: string
  description: string
  items: AnswerKeyItem[]
}

interface AnswerKey {
  id: string
  examId: string
  examTitle: string
  title: string
  subject: string
  sections: AnswerKeySection[]
  createdAt: string
  updatedAt: string
}

interface AnswerKeysData {
  version: number
  answerKeys: AnswerKey[]
}

let answerKeysCache: AnswerKeysData | null = null

export function getAnswerKeys(): AnswerKeysData {
  if (!answerKeysCache) {
    answerKeysCache = readJsonFile<AnswerKeysData>(getAnswerKeysFilePath(), {
      version: 1,
      answerKeys: []
    })
  }
  return answerKeysCache
}

export function saveAnswerKeys(data: AnswerKeysData): void {
  answerKeysCache = data
  atomicWrite(getAnswerKeysFilePath(), JSON.stringify(data, null, 2))
}

export type {
  Question,
  ExamPaper,
  Section,
  SectionQuestion,
  PageConfig,
  AppConfig,
  QuestionsData,
  ExamsData,
  AnswerKey,
  AnswerKeySection,
  AnswerKeyItem
}
