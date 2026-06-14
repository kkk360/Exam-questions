import React, { useEffect } from 'react'
import { Table, Button, Space, App, Popconfirm, Empty, Card } from 'antd'
import {
  DeleteOutlined,
  FilePdfOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import { useAnswerKeyStore } from '../../stores/answerKeyStore'

const AnswerKeyList: React.FC = () => {
  const { message } = App.useApp()
  const { keys, loading, fetchKeys, deleteKey } = useAnswerKeyStore()

  useEffect(() => {
    fetchKeys()
  }, [])

  const handleExportPdf = async (record: any) => {
    const defaultName = `${record.title}.pdf`
    const fp = await window.electron.export.showSaveDialog(defaultName, [
      { name: 'PDF', extensions: ['pdf'] }
    ])
    if (!fp) return
    await window.electron.answerKeys.exportPdf(record.id, fp)
    message.success('答案PDF导出成功')
  }

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (title: string) => (
        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{title}</span>
      )
    },
    {
      title: '对应试卷',
      dataIndex: 'examTitle',
      key: 'examTitle',
      ellipsis: true,
      render: (title: string) => <span style={{ color: 'var(--text-secondary)' }}>{title}</span>
    },
    {
      title: '学科',
      dataIndex: 'subject',
      key: 'subject',
      width: 100,
      render: (subject: string) => <span style={{ color: 'var(--text-secondary)' }}>{subject || '-'}</span>
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (v: string) => (
        <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          {new Date(v).toLocaleString('zh-CN')}
        </span>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 160,
      render: (_: any, record: any) => (
        <Space size={2}>
          <Button
            type="text"
            size="small"
            icon={<FilePdfOutlined />}
            onClick={() => handleExportPdf(record)}
          >
            导出PDF
          </Button>
          <Popconfirm
            title="删除此答案卷？"
            onConfirm={async () => {
              await deleteKey(record.id)
              message.success('已删除')
            }}
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>参考答案</h2>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 2 }}>
            查看和管理试卷的参考答案
          </div>
        </div>
        <Button icon={<ReloadOutlined />} onClick={fetchKeys}>
          刷新
        </Button>
      </div>

      <Card>
        {keys.length === 0 && !loading ? (
          <Empty description="暂无参考答案，在试卷编辑器中可生成答案卷">
            <div style={{ color: 'var(--text-tertiary)', fontSize: 13, marginTop: 8 }}>
              创建试卷后会自动生成参考答案
            </div>
          </Empty>
        ) : (
          <Table
            dataSource={keys}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 份答案` }}
          />
        )}
      </Card>
    </div>
  )
}

export default AnswerKeyList
