import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Row, Col, App, Popconfirm, Empty, Space, Tag } from 'antd'
import {
  PlusOutlined, EditOutlined, CopyOutlined,
  DeleteOutlined, FilePdfOutlined, FileWordOutlined
} from '@ant-design/icons'
import { useExamStore } from '../../stores/examStore'
import type { ExamPaper } from '../../types'

const ExamList: React.FC = () => {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const { exams, loading, fetchExams, deleteExam, duplicateExam } = useExamStore()

  useEffect(() => {
    fetchExams()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteExam(id)
      message.success('试卷已删除')
    } catch {
      message.error('删除失败')
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
      const filePath = await window.electron.export.showSaveDialog(
        `${exam.title}.pdf`,
        [{ name: 'PDF文件', extensions: ['pdf'] }]
      )
      if (!filePath) return
      await window.electron.export.toPdf(exam.id, filePath)
      message.success('PDF导出成功')
    } catch {
      message.error('PDF导出失败')
    }
  }

  const handleExportWord = async (exam: ExamPaper) => {
    try {
      const filePath = await window.electron.export.showSaveDialog(
        `${exam.title}.docx`,
        [{ name: 'Word文档', extensions: ['docx'] }]
      )
      if (!filePath) return
      await window.electron.export.toWord(exam.id, filePath)
      message.success('Word导出成功')
    } catch {
      message.error('Word导出失败')
    }
  }

  if (exams.length === 0 && !loading) {
    return (
      <Card title="试卷管理" extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/exams/new')}>
          新建试卷
        </Button>
      }>
        <Empty
          description="还没有试卷，点击上方按钮创建第一份试卷"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    )
  }

  return (
    <Card
      title="试卷管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/exams/new')}>
          新建试卷
        </Button>
      }
    >
      <Row gutter={[16, 16]}>
        {exams.map((exam) => (
          <Col key={exam.id} xs={24} sm={12} lg={8} xl={6}>
            <Card
              hoverable
              style={{ height: '100%' }}
              onClick={() => navigate(`/exams/${exam.id}/edit`)}
              actions={[
                <EditOutlined key="edit" onClick={(e) => { e.stopPropagation(); navigate(`/exams/${exam.id}/edit`) }} />,
                <CopyOutlined key="copy" onClick={(e) => { e.stopPropagation(); handleDuplicate(exam.id) }} />,
                <Popconfirm
                  key="delete"
                  title="确认删除此试卷？"
                  onConfirm={() => handleDelete(exam.id)}
                  okText="删除"
                  cancelText="取消"
                  okButtonProps={{ danger: true }}
                >
                  <DeleteOutlined onClick={(e) => e.stopPropagation()} />
                </Popconfirm>,
              ]}
            >
              <Card.Meta
                title={<span style={{ fontSize: 16 }}>{exam.title}</span>}
                description={
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    {exam.subject && <Tag color="green">{exam.subject}</Tag>}
                    <div style={{ color: '#71717a', fontSize: 13 }}>
                      <div>考试时长：{exam.duration} 分钟</div>
                      <div>满分：{exam.totalScore} 分</div>
                      <div>大题数：{exam.sections.length}</div>
                    </div>
                    <Space size="small">
                      <Button
                        size="small"
                        icon={<FilePdfOutlined />}
                        onClick={(e) => { e.stopPropagation(); handleExportPdf(exam) }}
                      >
                        PDF
                      </Button>
                      <Button
                        size="small"
                        icon={<FileWordOutlined />}
                        onClick={(e) => { e.stopPropagation(); handleExportWord(exam) }}
                      >
                        Word
                      </Button>
                    </Space>
                  </Space>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  )
}

export default ExamList
