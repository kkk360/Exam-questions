import React, { useEffect, useState } from 'react'
import {
  Card,
  Button,
  Space,
  App,
  Select,
  Rate,
  Switch,
  Descriptions,
  Row,
  Col,
  Radio,
  Tooltip
} from 'antd'
import {
  ImportOutlined,
  ExportOutlined,
  FolderOpenOutlined,
  SettingOutlined,
  DatabaseOutlined,
  InfoCircleOutlined,
  BulbOutlined,
  PlusCircleOutlined,
  SyncOutlined,
  QuestionCircleOutlined,
  GithubOutlined,
  MailOutlined,
  UserOutlined
} from '@ant-design/icons'
import type { AppConfig } from '../../types'
import { useThemeStore } from '../../stores/themeStore'

const SettingsPage: React.FC = () => {
  const { message } = App.useApp()
  const [config, setConfig] = useState<AppConfig | null>(null)
  const [appInfo, setAppInfo] = useState<{ version: string; dataDir: string } | null>(null)
  const { mode, toggleTheme } = useThemeStore()
  const [importMode, setImportMode] = useState<'append' | 'overwrite'>('append')

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
      const result = await window.electron.data.importExams(filePath, importMode === 'overwrite')
      if (result.errors.length > 0) {
        message.error(`导入出错：${result.errors.join(', ')}`)
      } else {
        message.success(
          importMode === 'overwrite'
            ? `成功覆盖导入 ${result.success} 份试卷`
            : `成功导入 ${result.success} 份试卷${result.skipped > 0 ? `，跳过 ${result.skipped} 份重复试卷` : ''}`
        )
      }
    } catch {
      message.error('导入失败')
    }
  }

  const handleExportExams = async () => {
    try {
      const filePath = await window.electron.export.showSaveDialog('试卷导出.json', [
        { name: 'JSON文件', extensions: ['json'] }
      ])
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

  const settingRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: 'var(--fill-quaternary, #f9fafb)',
    borderRadius: 8
  } as const

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>设置</h2>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 2 }}>
            管理应用偏好和数据
          </div>
        </div>
      </div>

      <Row gutter={20}>
        <Col span={14}>
          <Card
            title={
              <Space>
                <SettingOutlined style={{ color: 'var(--primary-color)' }} />
                <span>偏好设置</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={settingRowStyle}>
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 13 }}>
                    外观模式
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    切换亮色 / 暗黑主题
                  </div>
                </div>
                <Space>
                  <BulbOutlined style={{ color: mode === 'dark' ? '#fbbf24' : 'var(--text-tertiary)' }} />
                  <Switch
                    checked={mode === 'dark'}
                    onChange={toggleTheme}
                    checkedChildren="暗"
                    unCheckedChildren="亮"
                  />
                </Space>
              </div>

              <div style={settingRowStyle}>
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 13 }}>
                    默认学科
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    新建题目时的默认学科
                  </div>
                </div>
                <Select
                  placeholder="选择默认学科"
                  allowClear
                  style={{ width: 160 }}
                  value={config?.preferences.defaultSubject || undefined}
                  onChange={(v) => updatePreference('defaultSubject', v)}
                  options={[
                    { value: '数学' },
                    { value: '物理' },
                    { value: '化学' },
                    { value: '生物' },
                    { value: '语文' },
                    { value: '英语' }
                  ]}
                />
              </div>

              <div style={settingRowStyle}>
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 13 }}>
                    默认难度
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    新建题目时的默认难度等级
                  </div>
                </div>
                <Rate
                  value={config?.preferences.defaultDifficulty || 3}
                  onChange={(v) => updatePreference('defaultDifficulty', v)}
                />
              </div>

              <div style={settingRowStyle}>
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 13 }}>
                    LaTeX 实时预览
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    输入公式时实时渲染预览
                  </div>
                </div>
                <Switch
                  checked={config?.preferences.latexPreviewEnabled ?? true}
                  onChange={(v) => updatePreference('latexPreviewEnabled', v)}
                />
              </div>
            </div>
          </Card>

          <Card
            title={
              <Space>
                <DatabaseOutlined style={{ color: 'var(--primary-color)' }} />
                <span>数据管理</span>
              </Space>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>导入模式</div>
                <Radio.Group
                  value={importMode}
                  onChange={(e) => setImportMode(e.target.value)}
                  style={{ display: 'flex', width: '100%' }}
                  buttonStyle="solid"
                >
                  <Radio.Button value="append" style={{ flex: 1, textAlign: 'center' }}>
                    <Space size={4}>
                      <PlusCircleOutlined />
                      <span>追加导入</span>
                      <Tooltip title="将新试卷添加到现有数据中，跳过已存在的试卷">
                        <QuestionCircleOutlined style={{ color: 'var(--text-tertiary)' }} />
                      </Tooltip>
                    </Space>
                  </Radio.Button>
                  <Radio.Button value="overwrite" style={{ flex: 1, textAlign: 'center' }}>
                    <Space size={4}>
                      <SyncOutlined />
                      <span>覆盖导入</span>
                      <Tooltip title="用导入的试卷完全替换现有数据，现有数据将被清除">
                        <QuestionCircleOutlined style={{ color: 'var(--text-tertiary)' }} />
                      </Tooltip>
                    </Space>
                  </Radio.Button>
                </Radio.Group>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Button icon={<ImportOutlined />} onClick={handleImportExams} size="large" style={{ flex: 1 }}>
                  导入试卷
                </Button>
                <Button icon={<ExportOutlined />} onClick={handleExportExams} size="large" style={{ flex: 1 }}>
                  导出所有
                </Button>
              </div>
            </div>
          </Card>
        </Col>

        <Col span={10}>
          <Card
            title={
              <Space>
                <InfoCircleOutlined style={{ color: 'var(--primary-color)' }} />
                <span>关于</span>
              </Space>
            }
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px 0'
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16
                }}
              >
                <SettingOutlined style={{ color: '#fff', fontSize: 28 }} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                智能出题系统
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 20 }}>
                Smart Exam Builder
              </div>

              <Descriptions
                column={1}
                size="small"
                style={{ width: '100%' }}
                labelStyle={{ color: 'var(--text-secondary)', width: 80 }}
                contentStyle={{ color: 'var(--text-primary)' }}
              >
                <Descriptions.Item label="版本号">
                  {appInfo?.version || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="作者">
                  <Space size={4}>
                    <UserOutlined style={{ color: 'var(--text-tertiary)' }} />
                    <span>wangkai</span>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="邮箱">
                  <Space size={4}>
                    <MailOutlined style={{ color: 'var(--text-tertiary)' }} />
                    <a href="mailto:wangkaicode@foxmail.com">wangkaicode@foxmail.com</a>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="GitHub">
                  <Space size={4}>
                    <GithubOutlined style={{ color: 'var(--text-tertiary)' }} />
                    <a
                      href="https://github.com/kkk360/Exam-questions"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      github.com/kkk360/Exam-questions
                    </a>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="数据目录">
                  <Space direction="vertical" size={2}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
                      {appInfo?.dataDir || '-'}
                    </span>
                    <Button
                      type="link"
                      size="small"
                      icon={<FolderOpenOutlined />}
                      onClick={handleOpenDataDir}
                      style={{ padding: 0, height: 'auto' }}
                    >
                      打开目录
                    </Button>
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default SettingsPage
