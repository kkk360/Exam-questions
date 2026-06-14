import React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import {
  FileTextOutlined,
  BookOutlined,
  SettingOutlined,
  DeleteOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'

const { Sider, Content } = Layout

const menuItems = [
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
  },
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

const AppLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const selectedKey = '/' + location.pathname.split('/')[1]

  return (
    <Layout style={{ height: '100vh', background: '#f4f4f5' }}>
      <Sider
        width={220}
        style={{
          background: '#ffffff',
          borderRight: '1px solid #e4e4e7',
          boxShadow: '1px 0 2px 0 rgb(24 24 27 / 0.04)'
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #e4e4e7',
            background: '#059669'
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              color: '#ffffff',
              fontWeight: 600,
              letterSpacing: '0.3px'
            }}
          >
            智能出题系统
          </h2>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 'none', marginTop: 8, background: 'transparent' }}
        />
      </Sider>
      <Layout>
        <Content
          style={{
            padding: 24,
            background: '#f4f4f5',
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
