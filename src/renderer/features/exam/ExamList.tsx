import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Row, Col, App, Popconfirm, Empty, Space, Tag, Tooltip } from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  DashboardOutlined,
  ExportOutlined
} from '@ant-design/icons'
import { useExamStore } from '../../stores/examStore'
import type { ExamPaper } from '../../types'

const ExamList: React.FC = () => {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const { exams, loading, fetchExams, deleteExam, duplicateExam } = useExamStore()
  const deletingRef = useRef(false)

  useEffect(() => {
    fetchExams()
  }, [])

  const handleDelete = async (id: string) => {
    deletingRef.current = true
    try {
      await deleteExam(id)
      message.success('已移入回收站')
    } catch {
      message.error('删除失败')
    } finally {
      setTimeout(() => {
        deletingRef.current = false
      }, 300)
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateExam(id)
      message.success('试卷已复制')
    } catch {
      message.error('复制失败')
    }
  }

  const handleExportPdf = async (exam: ExamPaper) => {
    try {
      const filePath = await window.electron.export.showSaveDialog(`${exam.title}.pdf`, [
        { name: 'PDF文件', extensions: ['pdf'] }
      ])
      if (!filePath) return
      await window.electron.export.toPdf(exam.id, filePath)
      message.success('PDF导出成功')
    } catch {
      message.error('PDF导出失败')
    }
  }

  const handleExportWord = async (exam: ExamPaper) => {
    try {
      const filePath = await window.electron.export.showSaveDialog(`${exam.title}.docx`, [
        { name: 'Word文档', extensions: ['docx'] }
      ])
      if (!filePath) return
      await window.electron.export.toWord(exam.id, filePath)
      message.success('Word导出成功')
    } catch {
      message.error('Word导出失败')
    }
  }

  const handleExportJson = async (exam: ExamPaper) => {
    try {
      const filePath = await window.electron.export.showSaveDialog(`${exam.title}.json`, [
        { name: 'JSON文件', extensions: ['json'] }
      ])
      if (!filePath) return
      await window.electron.data.exportExams(filePath, [exam.id])
      message.success('试卷导出成功')
    } catch {
      message.error('导出失败')
    }
  }

  const totalExams = exams.length
  const totalQuestions = exams.reduce(
    (s, e) => s + e.sections.reduce((s2, sec) => s2 + sec.questions.length, 0),
    0
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>试卷管理</h2>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 2 }}>
            创建和管理您的试卷
          </div>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate('/exams/new')}
          >
            新建试卷
          </Button>
        </Space>
      </div>

      {exams.length > 0 && (
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={12}>
            <div className="stats-card">
              <div className="stats-value">{totalExams}</div>
              <div className="stats-label">试卷总数</div>
            </div>
          </Col>
          <Col span={12}>
            <div className="stats-card">
              <div className="stats-value">{totalQuestions}</div>
              <div className="stats-label">题目总数</div>
            </div>
          </Col>
        </Row>
      )}

      {exams.length === 0 && !loading ? (
        <Card>
          <Empty
            description="还没有试卷，点击上方按钮创建第一份试卷"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/exams/new')}>
              新建试卷
            </Button>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {exams.map((exam) => (
            <Col key={exam.id} xs={24} sm={12} lg={8} xl={8}>
              <Card
                hoverable
                style={{
                  height: '100%',
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
                onClick={() => {
                  if (deletingRef.current) return
                  navigate(`/exams/${exam.id}/edit`)
                }}
                actions={[
                  <Tooltip title="编辑" key="edit">
                    <EditOutlined
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/exams/${exam.id}/edit`)
                      }}
                    />
                  </Tooltip>,
                  <Tooltip title="复制" key="copy">
                    <CopyOutlined
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDuplicate(exam.id)
                      }}
                    />
                  </Tooltip>,
                  <Popconfirm
                    key="delete"
                    title="将试卷移入回收站？"
                    description="可在回收站中恢复或永久删除"
                    onConfirm={() => handleDelete(exam.id)}
                    okText="移入回收站"
                    cancelText="取消"
                    okButtonProps={{ danger: true }}
                  >
                    <Tooltip title="删除">
                      <DeleteOutlined onClick={(e) => e.stopPropagation()} />
                    </Tooltip>
                  </Popconfirm>
                ]}
              >
                <div style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12
                    }}
                  >
                    <FileTextOutlined style={{ color: '#059669', fontSize: 18 }} />
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: 8,
                      lineHeight: 1.3
                    }}
                  >
                    {exam.title}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: 16,
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                    padding: '10px 0 0',
                    borderTop: '1px solid var(--border-color)'
                  }}
                >
                  <Space size={4}>
                    <ClockCircleOutlined />
                    <span>{exam.duration}分钟</span>
                  </Space>
                  <Space size={4}>
                    <TrophyOutlined />
                    <span>{exam.totalScore}分</span>
                  </Space>
                  <Space size={4}>
                    <DashboardOutlined />
                    <span>{exam.sections.length}大题</span>
                  </Space>
                </div>

                <div style={{ marginTop: 10 }}>
                  <Space size="small">
                    <Button
                      size="small"
                      icon={<FilePdfOutlined />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExportPdf(exam)
                      }}
                    >
                      PDF
                    </Button>
                    <Button
                      size="small"
                      icon={<FileWordOutlined />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExportWord(exam)
                      }}
                    >
                      Word
                    </Button>
                    <Button
                      size="small"
                      icon={<ExportOutlined />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExportJson(exam)
                      }}
                    >
                      导出
                    </Button>
                  </Space>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default ExamList
