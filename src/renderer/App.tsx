import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider, App as AntdApp, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import AppLayout from './components/Layout/AppLayout'
import ExamList from './features/exam/ExamList'
import ExamBuilder from './features/exam/ExamBuilder'
import SettingsPage from './features/settings/SettingsPage'

function App(): React.ReactElement {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
          fontSize: 14
        }
      }}
    >
      <AntdApp>
        <HashRouter>
          <Routes>
            {/* Routes inside AppLayout (with sidebar navigation) */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/exams" replace />} />
              <Route path="/exams" element={<ExamList />} />
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
