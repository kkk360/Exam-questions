import React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Tooltip } from 'antd'
import {
  FileTextOutlined,
  BookOutlined,
  SettingOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  AppstoreOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons'

const { Sider, Content } = Layout

const menuGroups = [
  {
    type: 'group' as const,
    label: '工作台',
    children: [
      {
        key: '/exams',
        icon: <FileTextOutlined />,
        label: '试卷管理'
      },
      {
        key: '/questions',
        icon: <BookOutlined />,
        label: '题库管理'
      },
      {
        key: '/answer-keys',
        icon: <CheckCircleOutlined />,
        label: '参考答案'
      }
    ]
  },
  {
    type: 'group' as const,
    label: '系统',
    children: [
      {
        key: '/exam-trash',
        icon: <DeleteOutlined />,
        label: '回收站'
      },
      {
        key: '/settings',
        icon: <SettingOutlined />,
        label: '设置'
      }
    ]
  }
]

const AppLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const selectedKey = '/' + location.pathname.split('/')[1]

  return (
    <Layout style={{ height: '100vh', background: 'var(--bg-layout)' }}>
      <Sider
        width={232}
        style={{
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 20px',
            borderBottom: '1px solid var(--border-color)',
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <AppstoreOutlined style={{ color: '#fff', fontSize: 16 }} />
          </div>
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.2
              }}
            >
              智能出题系统
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.2 }}>
              Smart Exam Builder
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', paddingTop: 8 }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuGroups}
            onClick={({ key }) => navigate(key)}
            style={{
              borderRight: 'none',
              background: 'transparent',
              fontSize: 13
            }}
          />
        </div>

        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 600,
              color: '#0369a1'
            }}
          >
            T
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>
              教师端
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>v1.0.0</div>
          </div>
          <Tooltip title="帮助">
            <QuestionCircleOutlined
              style={{ color: 'var(--text-tertiary)', fontSize: 14, cursor: 'pointer' }}
            />
          </Tooltip>
        </div>
      </Sider>

      <Layout>
        <Content
          style={{
            padding: 20,
            background: 'var(--bg-layout)',
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout
