import React, { useEffect, useState, useRef } from 'react'
import { Modal, Table, Input, Select, Tag, Space, InputNumber } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useQuestionStore } from '../../stores/questionStore'
import {
  QUESTION_TYPE_LABELS,
  QUESTION_TYPE_COLORS,
  DIFFICULTY_LABELS,
  type QuestionFilters
} from '../../types'

interface QuestionPickerProps {
  visible: boolean
  onCancel: () => void
  onConfirm: (questionIds: string[], points: number) => void
  existingIds?: string[]
}

const { Option } = Select

const QuestionPicker: React.FC<QuestionPickerProps> = ({
  visible,
  onCancel,
  onConfirm,
  existingIds = []
}) => {
  const { questions, loading, fetchQuestions } = useQuestionStore()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [points, setPoints] = useState(5)
  const [filters, setFilters] = useState<QuestionFilters>({})
  const prevVisible = useRef(visible)

  useEffect(() => {
    if (visible && !prevVisible.current) {
      fetchQuestions(filters)
    }
    prevVisible.current = visible
  }, [visible, filters])

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setSelectedRowKeys([]))
      return () => clearTimeout(timer)
    }
  }, [visible])

  // Filter out questions that are already in the exam
  const availableQuestions = questions.filter((q) => !existingIds.includes(q.id))

  const handleFilterChange = (key: keyof QuestionFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }))
  }

  const handleConfirm = () => {
    if (selectedRowKeys.length === 0) return
    onConfirm(selectedRowKeys as string[], points)
    setSelectedRowKeys([])
  }

  const truncateContent = (content: string, maxLen = 60): string => {
    const plain = content.replace(/\$\$[\s\S]*?\$\$/g, '[公式]').replace(/\$[^$]+?\$/g, '[公式]')
    return plain.length > maxLen ? plain.slice(0, maxLen) + '...' : plain
  }

  const columns = [
    {
      title: '题型',
      dataIndex: 'type',
      width: 80,
      render: (type: string) => (
        <Tag color={QUESTION_TYPE_COLORS[type]}>{QUESTION_TYPE_LABELS[type]}</Tag>
      )
    },
    {
      title: '题目内容',
      dataIndex: 'content',
      ellipsis: true,
      render: (content: string) => truncateContent(content)
    },
    {
      title: '学科',
      dataIndex: 'subject',
      width: 70,
      render: (subject: string) => subject || '-'
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      width: 70,
      render: (d: number) => DIFFICULTY_LABELS[d] || '-'
    }
  ]

  return (
    <Modal
      title="从题库选择题目"
      open={visible}
      onCancel={onCancel}
      onOk={handleConfirm}
      okText={`确认添加 (${selectedRowKeys.length})`}
      okButtonProps={{ disabled: selectedRowKeys.length === 0 }}
      width={800}
    >
      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          placeholder="题型"
          allowClear
          style={{ width: 110 }}
          onChange={(v) => handleFilterChange('type', v)}
        >
          {Object.entries(QUESTION_TYPE_LABELS).map(([key, label]) => (
            <Option key={key} value={key}>
              {label}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="难度"
          allowClear
          style={{ width: 100 }}
          onChange={(v) => handleFilterChange('difficulty', v)}
        >
          {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
            <Option key={key} value={Number(key)}>
              {label}
            </Option>
          ))}
        </Select>
        <Input
          placeholder="搜索..."
          prefix={<SearchOutlined />}
          allowClear
          style={{ width: 180 }}
          onChange={(e) => handleFilterChange('keyword', e.target.value)}
        />
        <Space>
          <span>每题分值：</span>
          <InputNumber min={0} max={100} value={points} onChange={(v) => setPoints(v || 0)} />
        </Space>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={availableQuestions}
        loading={loading}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys
        }}
        pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 题` }}
        size="small"
      />
    </Modal>
  )
}

export default QuestionPicker
