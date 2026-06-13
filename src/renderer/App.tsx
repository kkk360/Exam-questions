import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider, App as AntdApp, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import AppLayout from './components/Layout/AppLayout'
import ExamList from './features/exam/ExamList'
import ExamBuilder from './features/exam/ExamBuilder'
import SettingsPage from './features/settings/SettingsPage'
import QuestionList from './features/questions/QuestionList'
import QuestionDetail from './features/questions/QuestionDetail'
import QuestionEditor from './features/questions/QuestionEditor'

function App(): React.ReactElement {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#4f46e5',
          colorSuccess: '#10b981',
          colorWarning: '#f59e0b',
          colorError: '#ef4444',
          colorInfo: '#3b82f6',
          borderRadius: 8,
          fontSize: 14,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
          colorBgContainer: '#ffffff',
          colorBgLayout: '#f8fafc',
          colorBorder: '#e2e8f0',
          colorText: '#1e293b',
          colorTextSecondary: '#64748b',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
        components: {
          Button: {
            borderRadius: 8,
            controlHeight: 36,
          },
          Card: {
            borderRadiusLG: 12,
            boxShadowTertiary: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          },
          Input: {
            borderRadius: 8,
            controlHeight: 36,
          },
          Select: {
            borderRadius: 8,
            controlHeight: 36,
          },
          Table: {
            borderRadiusLG: 12,
            headerBg: '#f8fafc',
          },
          Menu: {
            itemBorderRadius: 8,
            itemMarginInline: 8,
            itemPaddingInline: 12,
          },
        },
      }}
    >
      <AntdApp>
        <HashRouter>
          <Routes>
            {/* Routes inside AppLayout (with sidebar navigation) */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/exams" replace />} />
              <Route path="/exams" element={<ExamList />} />
              <Route path="/questions" element={<QuestionList />} />
              <Route path="/questions/new" element={<QuestionEditor />} />
              <Route path="/questions/:id" element={<QuestionDetail />} />
              <Route path="/questions/:id/edit" element={<QuestionEditor />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Full-screen routes (no sidebar) */}
            <Route path="/exams/new" element={<ExamBuilder />} />
            <Route path="/exams/:id/edit" element={<ExamBuilder />} />
          </Routes>
        </HashRouter>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
