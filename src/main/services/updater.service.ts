import { autoUpdater, UpdateInfo } from 'electron-updater'
import { BrowserWindow, dialog, app } from 'electron'
import { getConfig, saveConfig } from '../storage/store'

let mainWindow: BrowserWindow | null = null
let isChecking = false

export function setMainWindow(win: BrowserWindow): void {
  mainWindow = win
}

function sendToRenderer(channel: string, data?: any): void {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, data)
  }
}

export function initAutoUpdater(): void {
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = false

  autoUpdater.on('checking-for-update', () => {
    isChecking = true
    sendToRenderer('updater:checking')
  })

  autoUpdater.on('update-available', (info: UpdateInfo) => {
    isChecking = false
    sendToRenderer('updater:available', {
      version: info.version,
      releaseDate: info.releaseDate,
      releaseNotes: info.releaseNotes || '暂无更新说明'
    })
  })

  autoUpdater.on('update-not-available', () => {
    isChecking = false
    sendToRenderer('updater:not-available')
  })

  autoUpdater.on('download-progress', (progress) => {
    sendToRenderer('updater:progress', {
      percent: progress.percent,
      bytesPerSecond: progress.bytesPerSecond,
      transferred: progress.transferred,
      total: progress.total
    })
  })

  autoUpdater.on('update-downloaded', () => {
    sendToRenderer('updater:downloaded')
  })

  autoUpdater.on('error', (error) => {
    isChecking = false
    sendToRenderer('updater:error', error.message)
  })
}

export async function checkForUpdates(manual = false): Promise<void> {
  if (isChecking) return

  const config = getConfig()
  if (!manual && config.preferences.autoUpdateEnabled === false) {
    sendToRenderer('updater:disabled')
    return
  }

  try {
    await autoUpdater.checkForUpdates()
  } catch (error: any) {
    if (manual) {
      sendToRenderer('updater:error', error.message || '检查更新失败')
    }
  }
}

export async function downloadUpdate(): Promise<void> {
  try {
    await autoUpdater.downloadUpdate()
  } catch (error: any) {
    sendToRenderer('updater:error', error.message || '下载更新失败')
  }
}

export function installUpdate(): void {
  autoUpdater.quitAndInstall(false, true)
}

export function getUpdateConfig(): { autoUpdateEnabled: boolean } {
  const config = getConfig()
  return {
    autoUpdateEnabled: config.preferences.autoUpdateEnabled !== false
  }
}

export function setAutoUpdateEnabled(enabled: boolean): void {
  const config = getConfig()
  const updated = {
    ...config,
    preferences: {
      ...config.preferences,
      autoUpdateEnabled: enabled
    }
  }
  saveConfig(updated)
}
