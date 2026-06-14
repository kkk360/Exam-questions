import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table, Button, Tag, Space, Input, Select, Card, Rate, App, Popconfirm
} from 'antd'
import {
  PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined,
  ExportOutlined, SearchOutlined
} from '@ant-design/icons'
import { useQuestionStore } from '../../stores/questionStore'
import {
  QUESTION_TYPE_LABELS, QUESTION_TYPE_COLORS, DIFFICULTY_LABELS,
  type Question, type QuestionFilters
} from '../../types'

const { Option } = Select

const QuestionList: React.FC = () => {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const { questions, loading, fetchQuestions, deleteQuestion, batchDelete } = useQuestionStore()

  const [filters, setFilters] = useState<QuestionFilters>({})
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const debouncedFetch = useCallback((f: QuestionFilters) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchQuestions(f)
    }, 300)
  }, [fetchQuestions])

  useEffect(() => {
    debouncedFetch(filters)
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [filters, debouncedFetch])

  const handleFilterChange = (key: keyof QuestionFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }))
    setCurrentPage(1)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteQuestion(id)
      message.success('题目已删除')
    } catch {
      message.error('删除失败')
    }
  }

  const handleBatchDelete = async () => {
    try {
      await batchDelete(selectedRowKeys as string[])
      message.success(`已删除 ${selectedRowKeys.length} 道题目`)
      setSelectedRowKeys([])
    } catch {
      message.error('批量删除失败')
    }
  }

  const handleExport = async () => {
    try {
      const filePath = await window.electron.export.showSaveDialog(
        '题库导出.json',
        [{ name: 'JSON文件', extensions: ['json'] }]
      )
      if (!filePath) return
      const ids = selectedRowKeys.length > 0 ? (selectedRowKeys as string[]) : undefined
      await window.electron.data.exportQuestions(filePath, ids)
      message.success('导出成功')
    } catch {
      message.error('导出失败')
    }
  }

  const truncateContent = (content: string, maxLen = 80): string => {
    const plain = content.replace(/\$\$[\s\S]*?\$\$/g, '[公式]').replace(/\$[^$]+?\$/g, '[公式]')
    return plain.length > maxLen ? plain.slice(0, maxLen) + '...' : plain
  }

  const columns = [
    {
      title: '题型',
      dataIndex: 'type',
      width: 90,
      render: (type: string) => (
        <Tag color={QUESTION_TYPE_COLORS[type]}>{QUESTION_TYPE_LABELS[type]}</Tag>
      )
    },
    {
      title: '题目内容',
      dataIndex: 'content',
      ellipsis: true,
      render: (content: string) => (
        <span style={{ color: '#52525b' }}>{truncateContent(content)}</span>
      )
    },
    {
      title: '学科',
      dataIndex: 'subject',
      width: 80,
      render: (subject: string) => subject || '-'
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      width: 140,
      render: (difficulty: number) => (
        <Rate disabled defaultValue={difficulty} count={5} style={{ fontSize: 14 }} />
      )
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 180,
      render: (tags: string[]) => (
        <Space size={[0, 4]} wrap>
          {tags.slice(0, 3).map((tag) => (
            <Tag key={tag} style={{ margin: 0 }}>{tag}</Tag>
          ))}
          {tags.length > 3 && <Tag>+{tags.length - 3}</Tag>}
        </Space>
      )
    },
    {
      title: '分值',
      dataIndex: 'score',
      width: 60,
      render: (score: number) => score || '-'
    },
    {
      title: '操作',
      width: 150,
      render: (_: any, record: Question) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/questions/${record.id}`)}
          />
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/questions/${record.id}/edit`)}
          />
          <Popconfirm
            title="确认删除此题目？"
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Card
      title="题库管理"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/questions/new')}
        >
          新建题目
        </Button>
      }
    >
      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          placeholder="题型"
          allowClear
          style={{ width: 120 }}
          onChange={(v) => handleFilterChange('type', v)}
          value={filters.type}
        >
          {Object.entries(QUESTION_TYPE_LABELS).map(([key, label]) => (
            <Option key={key} value={key}>{label}</Option>
          ))}
        </Select>
        <Select
          placeholder="难度"
          allowClear
          style={{ width: 100 }}
          onChange={(v) => handleFilterChange('difficulty', v)}
          value={filters.difficulty}
        >
          {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
            <Option key={key} value={Number(key)}>{label}</Option>
          ))}
        </Select>
        <Input
          placeholder="搜索关键词..."
          prefix={<SearchOutlined />}
          allowClear
          style={{ width: 200 }}
          onChange={(e) => handleFilterChange('keyword', e.target.value)}
          value={filters.keyword}
        />
        {selectedRowKeys.length > 0 && (
          <>
            <Popconfirm
              title={`确认删除选中的 ${selectedRowKeys.length} 道题目？`}
              onConfirm={handleBatchDelete}
              okText="删除"
              cancelText="取消"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />}>
                批量删除 ({selectedRowKeys.length})
              </Button>
            </Popconfirm>
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              导出选中
            </Button>
          </>
        )}
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={questions}
        loading={loading}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys
        }}
        pagination={{
          current: currentPage,
          pageSize,
          total: questions.length,
          onChange: setCurrentPage,
          showSizeChanger: false,
          showTotal: (total) => `共 ${total} 道题目`
        }}
        size="middle"
      />
    </Card>
  )
}

export default QuestionList
