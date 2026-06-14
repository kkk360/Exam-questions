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
          colorPrimary: '#059669',
          colorPrimaryHover: '#047857',
          colorPrimaryActive: '#036b50',
          colorSuccess: '#10b981',
          colorWarning: '#f59e0b',
          colorError: '#ef4444',
          colorInfo: '#0ea5e9',
          borderRadius: 8,
          borderRadiusLG: 12,
          borderRadiusSM: 6,
          fontSize: 14,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
          colorBgContainer: '#ffffff',
          colorBgLayout: '#f4f4f5',
          colorBgElevated: '#ffffff',
          colorBorder: '#e4e4e7',
          colorBorderSecondary: '#f0f0f1',
          colorText: '#18181b',
          colorTextSecondary: '#71717a',
          colorTextTertiary: '#a1a1aa',
          colorFillTertiary: '#f4f4f5',
          colorFillQuaternary: '#fafafa',
          boxShadow: '0 1px 3px 0 rgb(24 24 27 / 0.05), 0 1px 2px -1px rgb(24 24 27 / 0.04)',
          boxShadowSecondary: '0 4px 6px -1px rgb(24 24 27 / 0.06), 0 2px 4px -2px rgb(24 24 27 / 0.05)',
        },
        components: {
          Button: {
            borderRadius: 8,
            borderRadiusLG: 8,
            borderRadiusSM: 6,
            controlHeight: 36,
            controlHeightLG: 44,
            controlHeightSM: 28,
            primaryShadow: '0 1px 2px 0 rgb(5 150 105 / 0.2)',
          },
          Card: {
            borderRadiusLG: 12,
            boxShadowTertiary: '0 1px 3px 0 rgb(24 24 27 / 0.05), 0 1px 2px -1px rgb(24 24 27 / 0.04)',
            colorBorderSecondary: '#f0f0f1',
          },
          Input: {
            borderRadius: 8,
            controlHeight: 36,
            activeShadow: '0 0 0 2px rgb(5 150 105 / 0.1)',
          },
          Select: {
            borderRadius: 8,
            controlHeight: 36,
          },
          Table: {
            borderRadiusLG: 12,
            headerBg: '#fafafa',
            headerColor: '#52525b',
            borderColor: '#f0f0f1',
            rowHoverBg: '#f4f4f5',
          },
          Menu: {
            itemBorderRadius: 6,
            itemMarginInline: 8,
            itemPaddingInline: 12,
            itemColor: '#52525b',
            itemHoverColor: '#18181b',
            itemHoverBg: '#f4f4f5',
            itemSelectedColor: '#059669',
            itemSelectedBg: '#ecfdf5',
          },
          Modal: {
            borderRadiusLG: 12,
          },
          Popconfirm: {
            borderRadiusLG: 10,
          },
          Tag: {
            borderRadiusSM: 4,
          },
          Radio: {
            borderRadiusSM: 6,
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
