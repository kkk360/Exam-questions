import React, { useEffect, useState } from 'react'
import { Card, Button, Space, Table, Tag, App, Popconfirm, Empty } from 'antd'
import {
  RollbackOutlined,
  DeleteOutlined,
  ClearOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import { useExamStore } from '../../stores/examStore'
import type { ExamPaper } from '../../types'

const ExamTrash: React.FC = () => {
  const { message } = App.useApp()
  const { trash, fetchTrash, restoreExam, permanentDelete, emptyTrash } = useExamStore()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTrash()
  }, [])

  const handleRestore = async (id: string) => {
    await restoreExam(id)
    message.success('试卷已恢复')
  }

  const handlePermanentDelete = async (id: string) => {
    await permanentDelete(id)
    message.success('试卷已永久删除')
  }

  const handleEmptyTrash = async () => {
    setLoading(true)
    try {
      await emptyTrash()
      message.success('回收站已清空')
    } catch {
      message.error('操作失败')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: '试卷名称',
      dataIndex: 'title',
      render: (title: string) => (
        <Space>
          <FileTextOutlined style={{ color: '#a1a1aa' }} />
          <span style={{ color: '#52525b' }}>{title}</span>
        </Space>
      )
    },
    {
      title: '学科',
      dataIndex: 'subject',
      width: 100,
      render: (subject: string) => (subject ? <Tag color="green">{subject}</Tag> : '-')
    },
    {
      title: '删除时间',
      dataIndex: 'deletedAt',
      width: 180,
      render: (t: string) => (t ? new Date(t).toLocaleString('zh-CN') : '-')
    },
    {
      title: '操作',
      width: 200,
      render: (_: any, record: ExamPaper) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<RollbackOutlined />}
            onClick={() => handleRestore(record.id)}
          >
            恢复
          </Button>
          <Popconfirm
            title="确认永久删除？"
            description="此操作不可撤销"
            onConfirm={() => handlePermanentDelete(record.id)}
            okText="永久删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              永久删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Card
      title={
        <Space>
          <DeleteOutlined style={{ color: '#a1a1aa' }} />
          <span>回收站</span>
        </Space>
      }
      extra={
        trash.length > 0 ? (
          <Popconfirm
            title="确认清空回收站？"
            description="所有试卷将被永久删除，此操作不可撤销"
            onConfirm={handleEmptyTrash}
            okText="清空"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<ClearOutlined />} loading={loading}>
              清空回收站
            </Button>
          </Popconfirm>
        ) : undefined
      }
      style={{ borderRadius: 12 }}
    >
      {trash.length === 0 ? (
        <Empty description="回收站为空" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={trash}
          pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 份试卷` }}
        />
      )}
    </Card>
  )
}

export default ExamTrash
