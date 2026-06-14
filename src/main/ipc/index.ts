import { ipcMain, dialog, app, shell } from 'electron'
import * as questionService from '../services/question.service'
import * as examService from '../services/exam.service'
import * as answerKeyService from '../services/answer-key.service'
import * as importExportService from '../services/import-export.service'
import { exportToPdf, exportAnswerKeyToPdf } from '../services/export-pdf.service'
import { exportToWord } from '../services/export-word.service'
import { getConfig, saveConfig } from '../storage/store'
import {
  checkForUpdates,
  downloadUpdate,
  installUpdate,
  getUpdateConfig,
  setAutoUpdateEnabled
} from '../services/updater.service'

export function registerAllHandlers(): void {
  // ========== Question handlers ==========
  ipcMain.handle('questions:list', (_event, filters?) => {
    return questionService.listQuestions(filters)
  })

  ipcMain.handle('questions:getById', (_event, id: string) => {
    return questionService.getQuestionById(id)
  })

  ipcMain.handle('questions:create', (_event, data) => {
    return questionService.createQuestion(data)
  })

  ipcMain.handle('questions:update', (_event, id: string, data) => {
    return questionService.updateQuestion(id, data)
  })

  ipcMain.handle('questions:delete', (_event, id: string) => {
    return questionService.deleteQuestion(id)
  })

  ipcMain.handle('questions:batchDelete', (_event, ids: string[]) => {
    return questionService.batchDeleteQuestions(ids)
  })

  // ========== Exam handlers ==========
  ipcMain.handle('exams:list', () => {
    return examService.listExams()
  })

  ipcMain.handle('exams:getById', (_event, id: string) => {
    return examService.getExamById(id)
  })

  ipcMain.handle('exams:getWithQuestions', (_event, id: string) => {
    return examService.getExamWithQuestions(id)
  })

  ipcMain.handle('exams:create', (_event, data) => {
    return examService.createExam(data)
  })

  ipcMain.handle('exams:update', (_event, id: string, data) => {
    return examService.updateExam(id, data)
  })

  ipcMain.handle('exams:delete', (_event, id: string) => {
    return examService.deleteExam(id)
  })

  ipcMain.handle('exams:duplicate', (_event, id: string) => {
    return examService.duplicateExam(id)
  })

  // ========== Trash handlers ==========
  ipcMain.handle('exams:listTrash', () => {
    return examService.listTrashExams()
  })

  ipcMain.handle('exams:restore', (_event, id: string) => {
    return examService.restoreExam(id)
  })

  ipcMain.handle('exams:permanentDelete', (_event, id: string) => {
    return examService.permanentDeleteExam(id)
  })

  ipcMain.handle('exams:emptyTrash', () => {
    return examService.emptyTrash()
  })

  // ========== Export handlers ==========
  ipcMain.handle('export:toPdf', async (_event, examId: string, outputPath: string) => {
    return exportToPdf(examId, outputPath)
  })

  ipcMain.handle('export:toWord', async (_event, examId: string, outputPath: string) => {
    return exportToWord(examId, outputPath)
  })

  ipcMain.handle('export:showSaveDialog', async (_event, defaultName, filters) => {
    return importExportService.showSaveDialog(defaultName, filters)
  })

  ipcMain.handle('export:showOpenDialog', async (_event, filters) => {
    return importExportService.showOpenDialog(filters)
  })

  // ========== Import/Export data handlers ==========
  ipcMain.handle('data:importQuestions', (_event, filePath: string) => {
    return importExportService.importQuestions(filePath)
  })

  ipcMain.handle('data:exportQuestions', (_event, filePath: string, ids?: string[]) => {
    return importExportService.exportQuestions(filePath, ids)
  })

  ipcMain.handle('data:importExams', (_event, filePath: string, overwrite?: boolean) => {
    return importExportService.importExams(filePath, overwrite)
  })

  ipcMain.handle('data:exportExams', (_event, filePath: string, ids?: string[]) => {
    return importExportService.exportExams(filePath, ids)
  })

  // ========== Answer Key handlers ==========
  ipcMain.handle('answerKeys:list', () => {
    return answerKeyService.listAnswerKeys()
  })

  ipcMain.handle('answerKeys:create', (_event, data) => {
    return answerKeyService.createAnswerKey(data)
  })

  ipcMain.handle('answerKeys:delete', (_event, id: string) => {
    return answerKeyService.deleteAnswerKey(id)
  })

  ipcMain.handle('answerKeys:exportPdf', async (_event, id: string, outputPath: string) => {
    const key = answerKeyService.getAnswerKeyById(id)
    if (!key) return false
    return exportAnswerKeyToPdf(key, outputPath)
  })

  // ========== System handlers ==========
  ipcMain.handle('system:getAppInfo', () => {
    return {
      version: app.getVersion(),
      name: app.getName(),
      dataDir: app.getPath('userData')
    }
  })

  ipcMain.handle('system:getConfig', () => {
    return getConfig()
  })

  ipcMain.handle('system:updateConfig', (_event, partial) => {
    const config = getConfig()
    const updated = {
      ...config,
      ...partial,
      preferences: { ...config.preferences, ...partial.preferences }
    }
    saveConfig(updated)
    return updated
  })

  ipcMain.handle('system:selectDirectory', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    return result.canceled ? null : result.filePaths[0]
  })

  ipcMain.handle('system:openPath', async (_event, path: string) => {
    shell.openPath(path)
  })

  // ========== Updater handlers ==========
  ipcMain.handle('updater:check', async (_event, manual: boolean) => {
    await checkForUpdates(manual)
  })

  ipcMain.handle('updater:download', async () => {
    await downloadUpdate()
  })

  ipcMain.handle('updater:install', () => {
    installUpdate()
  })

  ipcMain.handle('updater:getConfig', () => {
    return getUpdateConfig()
  })

  ipcMain.handle('updater:setEnabled', (_event, enabled: boolean) => {
    setAutoUpdateEnabled(enabled)
    return { autoUpdateEnabled: enabled }
  })
}
