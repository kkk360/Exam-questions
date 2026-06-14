import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Space, App, Popconfirm, Empty } from 'antd'
import { DeleteOutlined, FilePdfOutlined, ReloadOutlined } from '@ant-design/icons'
import { useAnswerKeyStore } from '../../stores/answerKeyStore'

const AnswerKeyList: React.FC = () => {
  const navigate = useNavigate()
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
      ellipsis: true
    },
    {
      title: '对应试卷',
      dataIndex: 'examTitle',
      key: 'examTitle',
      ellipsis: true
    },
    {
      title: '学科',
      dataIndex: 'subject',
      key: 'subject',
      width: 100
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (v: string) => new Date(v).toLocaleString('zh-CN')
    },
    {
      title: '操作',
      key: 'actions',
      width: 160,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
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
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20, color: '#18181b' }}>参考答案管理</h2>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchKeys}>
            刷新
          </Button>
        </Space>
      </div>
      {keys.length === 0 && !loading ? (
        <Empty description="暂无参考答案，在试卷编辑器中可生成答案卷" />
      ) : (
        <Table
          dataSource={keys}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      )}
    </div>
  )
}

export default AnswerKeyList
