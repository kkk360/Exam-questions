import React, { useEffect, useState } from 'react'
import { Card, Button, Space, App, Divider, Select, Rate, Switch, Descriptions } from 'antd'
import { ImportOutlined, ExportOutlined, FolderOpenOutlined } from '@ant-design/icons'
import type { AppConfig } from '../../types'

const SettingsPage: React.FC = () => {
  const { message } = App.useApp()
  const [config, setConfig] = useState<AppConfig | null>(null)
  const [appInfo, setAppInfo] = useState<{ version: string; dataDir: string } | null>(null)

  useEffect(() => {
    window.electron.system.getConfig().then(setConfig)
    window.electron.system.getAppInfo().then(setAppInfo)
  }, [])

  const updatePreference = async (key: string, value: any) => {
    if (!config) return
    const updated = await window.electron.system.updateConfig({
      preferences: { ...config.preferences, [key]: value }
    })
    setConfig(updated)
    message.success('设置已保存')
  }

  const handleImportExams = async () => {
    try {
      const filePath = await window.electron.export.showOpenDialog([
        { name: 'JSON文件', extensions: ['json'] }
      ])
      if (!filePath) return
      const result = await window.electron.data.importExams(filePath)
      if (result.errors.length > 0) {
        message.error(`导入出错：${result.errors.join(', ')}`)
      } else {
        message.success(`成功导入 ${result.success} 份试卷${result.skipped > 0 ? `，跳过 ${result.skipped} 份重复试卷` : ''}`)
      }
    } catch {
      message.error('导入失败')
    }
  }

  const handleExportExams = async () => {
    try {
      const filePath = await window.electron.export.showSaveDialog(
        '试卷导出.json',
        [{ name: 'JSON文件', extensions: ['json'] }]
      )
      if (!filePath) return
      await window.electron.data.exportExams(filePath)
      message.success('试卷导出成功')
    } catch {
      message.error('导出失败')
    }
  }

  const handleOpenDataDir = async () => {
    if (appInfo?.dataDir) {
      await window.electron.system.openPath(appInfo.dataDir)
    }
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <Card title="数据管理">
        <Divider titlePlacement="left">试卷数据</Divider>
        <Space>
          <Button icon={<ImportOutlined />} onClick={handleImportExams}>
            导入试卷
          </Button>
          <Button icon={<ExportOutlined />} onClick={handleExportExams}>
            导出试卷
          </Button>
        </Space>
      </Card>

      <Card title="偏好设置" style={{ marginTop: 16 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>默认学科</div>
            <Select
              placeholder="选择默认学科"
              allowClear
              style={{ width: 200 }}
              value={config?.preferences.defaultSubject || undefined}
              onChange={(v) => updatePreference('defaultSubject', v)}
              options={[
                { value: '数学' }, { value: '物理' }, { value: '化学' },
                { value: '生物' }, { value: '语文' }, { value: '英语' }
              ]}
            />
          </div>
          <div>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>默认难度</div>
            <Rate
              value={config?.preferences.defaultDifficulty || 3}
              onChange={(v) => updatePreference('defaultDifficulty', v)}
            />
          </div>
          <div>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>LaTeX 实时预览</div>
            <Switch
              checked={config?.preferences.latexPreviewEnabled ?? true}
              onChange={(v) => updatePreference('latexPreviewEnabled', v)}
            />
          </div>
        </Space>
      </Card>

      <Card title="关于" style={{ marginTop: 16 }}>
        <Descriptions column={1}>
          <Descriptions.Item label="应用名称">智能出题系统</Descriptions.Item>
          <Descriptions.Item label="版本号">{appInfo?.version || '-'}</Descriptions.Item>
          <Descriptions.Item label="数据目录">
            <Space>
              <span style={{ fontSize: 12, color: '#666' }}>{appInfo?.dataDir || '-'}</span>
              <Button
                type="link"
                size="small"
                icon={<FolderOpenOutlined />}
                onClick={handleOpenDataDir}
              >
                打开
              </Button>
            </Space>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  )
}

export default SettingsPage
