import React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import {
  FileTextOutlined,
  BookOutlined,
  SettingOutlined
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
    <Layout style={{ height: '100vh', background: '#f8fafc' }}>
      <Sider
        width={220}
        style={{
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          boxShadow: '1px 0 3px 0 rgb(0 0 0 / 0.05)',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #e2e8f0',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, color: '#ffffff', fontWeight: 600, letterSpacing: '0.5px' }}>
            智能出题系统
          </h2>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 'none', marginTop: 12, background: 'transparent' }}
        />
      </Sider>
      <Layout>
        <Content
          style={{
            padding: 24,
            background: '#f8fafc',
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout
