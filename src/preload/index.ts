import { contextBridge, ipcRenderer } from 'electron'

const electronAPI = {
  questions: {
    list: (filters?: any) => ipcRenderer.invoke('questions:list', filters),
    getById: (id: string) => ipcRenderer.invoke('questions:getById', id),
    create: (data: any) => ipcRenderer.invoke('questions:create', data),
    update: (id: string, data: any) => ipcRenderer.invoke('questions:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('questions:delete', id),
    batchDelete: (ids: string[]) => ipcRenderer.invoke('questions:batchDelete', ids)
  },
  exams: {
    list: () => ipcRenderer.invoke('exams:list'),
    getById: (id: string) => ipcRenderer.invoke('exams:getById', id),
    getWithQuestions: (id: string) => ipcRenderer.invoke('exams:getWithQuestions', id),
    create: (data: any) => ipcRenderer.invoke('exams:create', data),
    update: (id: string, data: any) => ipcRenderer.invoke('exams:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('exams:delete', id),
    duplicate: (id: string) => ipcRenderer.invoke('exams:duplicate', id),
    listTrash: () => ipcRenderer.invoke('exams:listTrash'),
    restore: (id: string) => ipcRenderer.invoke('exams:restore', id),
    permanentDelete: (id: string) => ipcRenderer.invoke('exams:permanentDelete', id),
    emptyTrash: () => ipcRenderer.invoke('exams:emptyTrash')
  },
  export: {
    toPdf: (examId: string, outputPath: string) =>
      ipcRenderer.invoke('export:toPdf', examId, outputPath),
    toWord: (examId: string, outputPath: string) =>
      ipcRenderer.invoke('export:toWord', examId, outputPath),
    showSaveDialog: (defaultName: string, filters: any[]) =>
      ipcRenderer.invoke('export:showSaveDialog', defaultName, filters),
    showOpenDialog: (filters: any[]) => ipcRenderer.invoke('export:showOpenDialog', filters)
  },
  data: {
    importQuestions: (filePath: string) => ipcRenderer.invoke('data:importQuestions', filePath),
    exportQuestions: (filePath: string, ids?: string[]) =>
      ipcRenderer.invoke('data:exportQuestions', filePath, ids),
    importExams: (filePath: string) => ipcRenderer.invoke('data:importExams', filePath),
    exportExams: (filePath: string, ids?: string[]) =>
      ipcRenderer.invoke('data:exportExams', filePath, ids)
  },
  answerKeys: {
    list: () => ipcRenderer.invoke('answerKeys:list'),
    create: (data: any) => ipcRenderer.invoke('answerKeys:create', data),
    delete: (id: string) => ipcRenderer.invoke('answerKeys:delete', id),
    exportPdf: (id: string, outputPath: string) =>
      ipcRenderer.invoke('answerKeys:exportPdf', id, outputPath)
  },
  system: {
    getAppInfo: () => ipcRenderer.invoke('system:getAppInfo'),
    getConfig: () => ipcRenderer.invoke('system:getConfig'),
    updateConfig: (partial: any) => ipcRenderer.invoke('system:updateConfig', partial),
    selectDirectory: () => ipcRenderer.invoke('system:selectDirectory'),
    openPath: (path: string) => ipcRenderer.invoke('system:openPath', path)
  }
}

contextBridge.exposeInMainWorld('electron', electronAPI)
