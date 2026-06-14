import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider, App as AntdApp, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import AppLayout from './components/Layout/AppLayout'
import ExamList from './features/exam/ExamList'
import ExamBuilder from './features/exam/ExamBuilder'
import ExamTrash from './features/exam/ExamTrash'
import AnswerKeyList from './features/answerKey/AnswerKeyList'
import SettingsPage from './features/settings/SettingsPage'
import QuestionList from './features/questions/QuestionList'
import QuestionDetail from './features/questions/QuestionDetail'
import QuestionEditor from './features/questions/QuestionEditor'
import { useThemeStore } from './stores/themeStore'

const lightTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#059669',
    colorPrimaryHover: '#047857',
    colorPrimaryActive: '#036b50',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#3b82f6',
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    fontSize: 14,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f8f9fb',
    colorBgElevated: '#ffffff',
    colorBorder: '#ebedf0',
    colorBorderSecondary: '#f0f0f0',
    colorText: '#1a1a1a',
    colorTextSecondary: '#6b7280',
    colorTextTertiary: '#9ca3af',
    colorFillTertiary: '#f3f4f6',
    colorFillQuaternary: '#f9fafb',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.03)',
    boxShadowSecondary:
      '0 4px 12px 0 rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)'
  },
  components: {
    Button: {
      borderRadius: 8,
      borderRadiusLG: 8,
      borderRadiusSM: 6,
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
      primaryShadow: '0 1px 3px 0 rgb(5 150 105 / 0.2)'
    },
    Card: {
      borderRadiusLG: 12,
      boxShadowTertiary:
        '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.03)',
      colorBorderSecondary: '#f0f0f0'
    },
    Input: {
      borderRadius: 8,
      controlHeight: 36,
      activeShadow: '0 0 0 2px rgb(5 150 105 / 0.08)'
    },
    Select: {
      borderRadius: 8,
      controlHeight: 36
    },
    Table: {
      borderRadiusLG: 12,
      headerBg: '#f9fafb',
      headerColor: '#6b7280',
      borderColor: '#f0f0f0',
      rowHoverBg: '#f9fafb'
    },
    Menu: {
      itemBorderRadius: 8,
      itemMarginInline: 8,
      itemPaddingInline: 12,
      itemColor: '#6b7280',
      itemHoverColor: '#1a1a1a',
      itemHoverBg: '#f3f4f6',
      itemSelectedColor: '#059669',
      itemSelectedBg: '#ecfdf5',
      subMenuItemBg: 'transparent'
    },
    Modal: { borderRadiusLG: 12 },
    Popconfirm: { borderRadiusLG: 10 },
    Tag: { borderRadiusSM: 6 },
    Radio: { borderRadiusSM: 6 }
  }
}

const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#10b981',
    colorPrimaryHover: '#34d399',
    colorPrimaryActive: '#059669',
    colorSuccess: '#34d399',
    colorWarning: '#fbbf24',
    colorError: '#f87171',
    colorInfo: '#60a5fa',
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    fontSize: 14,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
    colorBgContainer: '#1e1e2e',
    colorBgLayout: '#181825',
    colorBgElevated: '#1e1e2e',
    colorBorder: '#313244',
    colorBorderSecondary: '#2a2a3c',
    colorText: '#cdd6f4',
    colorTextSecondary: '#9399b2',
    colorTextTertiary: '#6c7086',
    colorFillTertiary: '#2a2a3c',
    colorFillQuaternary: '#232334',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.2), 0 1px 2px -1px rgb(0 0 0 / 0.15)',
    boxShadowSecondary:
      '0 4px 12px 0 rgb(0 0 0 / 0.25), 0 2px 4px -2px rgb(0 0 0 / 0.2)'
  },
  components: {
    Button: {
      borderRadius: 8,
      borderRadiusLG: 8,
      borderRadiusSM: 6,
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
      primaryShadow: '0 1px 3px 0 rgb(16 185 129 / 0.25)'
    },
    Card: {
      borderRadiusLG: 12,
      boxShadowTertiary:
        '0 1px 3px 0 rgb(0 0 0 / 0.2), 0 1px 2px -1px rgb(0 0 0 / 0.15)',
      colorBorderSecondary: '#2a2a3c'
    },
    Input: {
      borderRadius: 8,
      controlHeight: 36,
      activeShadow: '0 0 0 2px rgb(16 185 129 / 0.15)'
    },
    Select: {
      borderRadius: 8,
      controlHeight: 36
    },
    Table: {
      borderRadiusLG: 12,
      headerBg: '#1e1e2e',
      headerColor: '#9399b2',
      borderColor: '#2a2a3c',
      rowHoverBg: '#232334'
    },
    Menu: {
      itemBorderRadius: 8,
      itemMarginInline: 8,
      itemPaddingInline: 12,
      itemColor: '#9399b2',
      itemHoverColor: '#cdd6f4',
      itemHoverBg: '#2a2a3c',
      itemSelectedColor: '#10b981',
      itemSelectedBg: 'rgb(16 185 129 / 0.12)',
      subMenuItemBg: 'transparent'
    },
    Modal: { borderRadiusLG: 12 },
    Popconfirm: { borderRadiusLG: 10 },
    Tag: { borderRadiusSM: 6 },
    Radio: { borderRadiusSM: 6 }
  }
}

function App(): React.ReactElement {
  const mode = useThemeStore((s) => s.mode)

  return (
    <ConfigProvider locale={zhCN} theme={mode === 'dark' ? darkTheme : lightTheme}>
      <AntdApp>
        <div
          data-theme={mode}
          style={{ height: '100%', background: mode === 'dark' ? '#181825' : '#f8f9fb' }}
        >
          <HashRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Navigate to="/exams" replace />} />
                <Route path="/exams" element={<ExamList />} />
                <Route path="/questions" element={<QuestionList />} />
                <Route path="/questions/new" element={<QuestionEditor />} />
                <Route path="/questions/:id" element={<QuestionDetail />} />
                <Route path="/questions/:id/edit" element={<QuestionEditor />} />
                <Route path="/exam-trash" element={<ExamTrash />} />
                <Route path="/answer-keys" element={<AnswerKeyList />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route path="/exams/new" element={<ExamBuilder />} />
              <Route path="/exams/:id/edit" element={<ExamBuilder />} />
            </Routes>
          </HashRouter>
        </div>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
