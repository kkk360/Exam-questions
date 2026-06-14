import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Descriptions, Tag, Rate, Button, Space, App, Popconfirm, Divider, Spin } from 'antd'
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useQuestionStore } from '../../stores/questionStore'
import {
  QUESTION_TYPE_LABELS,
  QUESTION_TYPE_COLORS,
  DIFFICULTY_LABELS,
  type Question
} from '../../types'
import RichContent from '../../components/RichContent'

const QuestionDetail: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { message } = App.useApp()
  const { deleteQuestion } = useQuestionStore()
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      window.electron.questions.getById(id).then((q) => {
        setQuestion(q)
        setLoading(false)
      })
    }
  }, [id])

  const handleDelete = async () => {
    if (!id) return
    try {
      await deleteQuestion(id)
      message.success('题目已删除')
      navigate('/questions')
    } catch {
      message.error('删除失败')
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!question) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: 50, color: 'var(--text-tertiary)' }}>
          题目不存在
          <br />
          <Button type="link" onClick={() => navigate('/questions')}>
            返回题库
          </Button>
        </div>
      </Card>
    )
  }

  const renderCorrectAnswer = () => {
    if (question.type === 'single_choice') {
      return String(question.correctAnswer)
    }
    if (question.type === 'multiple_choice') {
      return Array.isArray(question.correctAnswer)
        ? question.correctAnswer.join('、')
        : String(question.correctAnswer)
    }
    if (question.type === 'fill_blank') {
      return question.blankAnswers.join(' 或 ')
    }
    return '（主观题，无标准答案）'
  }

  return (
    <div>
      <div className="page-header">
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/questions')}>
            返回
          </Button>
          <div>
            <h2>题目详情</h2>
          </div>
        </Space>
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/questions/${id}/edit`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除此题目？"
            onConfirm={handleDelete}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      </div>

      <Card>
        <Descriptions column={2} bordered size="middle">
          <Descriptions.Item label="题型">
            <Tag color={QUESTION_TYPE_COLORS[question.type]} style={{ borderRadius: 4 }}>
              {QUESTION_TYPE_LABELS[question.type]}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="学科">{question.subject || '-'}</Descriptions.Item>
          <Descriptions.Item label="难度">
            <Space>
              <Rate disabled value={question.difficulty} count={5} style={{ fontSize: 14 }} />
              <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                {DIFFICULTY_LABELS[question.difficulty]}
              </span>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="默认分值">{question.score} 分</Descriptions.Item>
          <Descriptions.Item label="章节" span={2}>
            {question.chapter || '-'}
          </Descriptions.Item>
        </Descriptions>

        <Divider titlePlacement="left" style={{ borderColor: 'var(--border-color)', fontSize: 13, color: 'var(--text-secondary)' }}>
          题干内容
        </Divider>
        <div
          style={{
            padding: 16,
            background: 'var(--fill-quaternary, #f9fafb)',
            borderRadius: 8,
            border: '1px solid var(--border-color)',
            lineHeight: 1.8
          }}
        >
          <RichContent content={question.content} />
        </div>

        {(question.type === 'single_choice' || question.type === 'multiple_choice') &&
          question.options.length > 0 && (
            <>
              <Divider titlePlacement="left" style={{ borderColor: 'var(--border-color)', fontSize: 13, color: 'var(--text-secondary)' }}>
                选项
              </Divider>
              <div style={{ paddingLeft: 16 }}>
                {question.options.map((opt) => (
                  <div key={opt.label} style={{ marginBottom: 8, lineHeight: 1.8 }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{opt.label}.</strong>{' '}
                    <RichContent content={opt.content} />
                  </div>
                ))}
              </div>
            </>
          )}

        <Divider titlePlacement="left" style={{ borderColor: 'var(--border-color)', fontSize: 13, color: 'var(--text-secondary)' }}>
          正确答案
        </Divider>
        <div
          style={{
            padding: '10px 16px',
            background: '#ecfdf5',
            borderRadius: 8,
            border: '1px solid #a7f3d0'
          }}
        >
          <span style={{ color: '#065f46', fontWeight: 500 }}>{renderCorrectAnswer()}</span>
        </div>

        {question.explanation && (
          <>
            <Divider titlePlacement="left" style={{ borderColor: 'var(--border-color)', fontSize: 13, color: 'var(--text-secondary)' }}>
              解析
            </Divider>
            <div
              style={{
                padding: 16,
                background: '#f9fafb',
                borderRadius: 8,
                border: '1px solid #ebedf0',
                lineHeight: 1.8
              }}
            >
              <RichContent content={question.explanation} />
            </div>
          </>
        )}

        {question.tags.length > 0 && (
          <>
            <Divider titlePlacement="left" style={{ borderColor: 'var(--border-color)', fontSize: 13, color: 'var(--text-secondary)' }}>
              标签
            </Divider>
            <Space wrap>
              {question.tags.map((tag) => (
                <Tag key={tag} style={{ borderRadius: 4 }}>
                  {tag}
                </Tag>
              ))}
            </Space>
          </>
        )}
      </Card>
    </div>
  )
}

export default QuestionDetail
