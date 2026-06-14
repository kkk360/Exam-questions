import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

let dataDir = ''

function getDataDir(): string {
  if (!dataDir) {
    dataDir = join(app.getPath('userData'), 'data')
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true })
    }
  }
  return dataDir
}

export function getQuestionsFilePath(): string {
  return join(getDataDir(), 'questions.json')
}

export function getExamsFilePath(): string {
  return join(getDataDir(), 'exams.json')
}

export function getConfigFilePath(): string {
  return join(getDataDir(), 'config.json')
}

export function getAnswerKeysFilePath(): string {
  return join(getDataDir(), 'answer-keys.json')
}
