export interface ElectronAPI {
  questions: {
    list: (filters?: QuestionFilters) => Promise<Question[]>
    getById: (id: string) => Promise<Question | null>
    create: (data: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Question>
    update: (id: string, data: Partial<Question>) => Promise<Question | null>
    delete: (id: string) => Promise<boolean>
    batchDelete: (ids: string[]) => Promise<number>
  }
  exams: {
    list: () => Promise<ExamPaper[]>
    getById: (id: string) => Promise<ExamPaper | null>
    getWithQuestions: (
      id: string
    ) => Promise<{ exam: ExamPaper; questionsMap: Record<string, Question> } | null>
    create: (data: Omit<ExamPaper, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ExamPaper>
    update: (id: string, data: Partial<ExamPaper>) => Promise<ExamPaper | null>
    delete: (id: string) => Promise<boolean>
    duplicate: (id: string) => Promise<ExamPaper | null>
    listTrash: () => Promise<ExamPaper[]>
    restore: (id: string) => Promise<ExamPaper | null>
    permanentDelete: (id: string) => Promise<boolean>
    emptyTrash: () => Promise<number>
  }
  answerKeys: {
    list: () => Promise<AnswerKey[]>
    create: (data: Omit<AnswerKey, 'id' | 'createdAt' | 'updatedAt'>) => Promise<AnswerKey>
    delete: (id: string) => Promise<boolean>
    exportPdf: (id: string, outputPath: string) => Promise<boolean>
  }
  export: {
    toPdf: (examId: string, outputPath: string) => Promise<boolean>
    toWord: (examId: string, outputPath: string) => Promise<boolean>
    showSaveDialog: (defaultName: string, filters: FileFilter[]) => Promise<string | null>
    showOpenDialog: (filters: FileFilter[]) => Promise<string | null>
  }
  data: {
    importQuestions: (filePath: string) => Promise<ImportResult>
    exportQuestions: (filePath: string, ids?: string[]) => Promise<void>
    importExams: (filePath: string) => Promise<ImportResult>
    exportExams: (filePath: string, ids?: string[]) => Promise<void>
  }
  system: {
    getAppInfo: () => Promise<{ version: string; name: string; dataDir: string }>
    getConfig: () => Promise<AppConfig>
    updateConfig: (partial: Partial<AppConfig>) => Promise<AppConfig>
    selectDirectory: () => Promise<string | null>
    openPath: (path: string) => Promise<void>
  }
}

declare global {
  interface Window {
    electron: ElectronAPI
  }
}

export interface FileFilter {
  name: string
  extensions: string[]
}

export interface ImportResult {
  success: number
  skipped: number
  errors: string[]
}

export interface Option {
  label: string
  content: string
}

export interface Question {
  id: string
  type: 'single_choice' | 'multiple_choice' | 'fill_blank' | 'essay'
  subject: string
  chapter: string
  difficulty: number
  content: string
  contentImages: string[]
  options: Option[]
  correctAnswer: string | string[]
  blankAnswers: string[]
  explanation: string
  tags: string[]
  score: number
  createdAt: string
  updatedAt: string
}

export interface SectionQuestion {
  questionId: string
  displayOrder: number
  points: number
}

export interface Section {
  id: string
  title: string
  description: string
  sortOrder: number
  questions: SectionQuestion[]
}

export interface PageConfig {
  pageSize: 'A4' | 'B5' | 'Letter'
  orientation: 'portrait' | 'landscape'
  margins: { top: number; right: number; bottom: number; left: number }
  showAnswerKey: boolean
  showScoreBox: boolean
  headerFontSize: number
}

export interface ExamPaper {
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

export interface AppConfig {
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

export interface QuestionFilters {
  type?: string
  subject?: string
  difficulty?: number
  tags?: string[]
  keyword?: string
}

export const QUESTION_TYPE_LABELS: Record<string, string> = {
  single_choice: '单选题',
  multiple_choice: '多选题',
  fill_blank: '填空题',
  essay: '大题'
}

export const QUESTION_TYPE_COLORS: Record<string, string> = {
  single_choice: '#1677ff',
  multiple_choice: '#722ed1',
  fill_blank: '#13c2c2',
  essay: '#fa8c16'
}

export const DIFFICULTY_LABELS: Record<number, string> = {
  1: '基础',
  2: '简单',
  3: '中等',
  4: '较难',
  5: '困难'
}

export interface AnswerKeyItem {
  questionIndex: number
  type: string
  content: string
  answer: string
  explanation: string
}

export interface AnswerKeySection {
  title: string
  description: string
  items: AnswerKeyItem[]
}

export interface AnswerKey {
  id: string
  examId: string
  examTitle: string
  title: string
  subject: string
  sections: AnswerKeySection[]
  createdAt: string
  updatedAt: string
}
