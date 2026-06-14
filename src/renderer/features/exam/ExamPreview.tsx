import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Button, Space, App, Spin, Divider } from 'antd'
import { ArrowLeftOutlined, FilePdfOutlined, FileWordOutlined } from '@ant-design/icons'
import RichContent from '../../components/RichContent'
import type { ExamPaper, Question } from '../../types'

const ExamPreview: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { message } = App.useApp()
  const [exam, setExam] = useState<ExamPaper | null>(null)
  const [questionsMap, setQuestionsMap] = useState<Record<string, Question>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      window.electron.exams.getWithQuestions(id).then((data) => {
        if (data) {
          setExam(data.exam)
          setQuestionsMap(data.questionsMap)
        }
        setLoading(false)
      })
    }
  }, [id])

  const handleExportPdf = async () => {
    if (!id) return
    try {
      const filePath = await window.electron.export.showSaveDialog(`${exam?.title || '试卷'}.pdf`, [
        { name: 'PDF文件', extensions: ['pdf'] }
      ])
      if (!filePath) return
      await window.electron.export.toPdf(id, filePath)
      message.success('PDF导出成功')
    } catch {
      message.error('PDF导出失败')
    }
  }

  const handleExportWord = async () => {
    if (!id) return
    try {
      const filePath = await window.electron.export.showSaveDialog(
        `${exam?.title || '试卷'}.docx`,
        [{ name: 'Word文档', extensions: ['docx'] }]
      )
      if (!filePath) return
      await window.electron.export.toWord(id, filePath)
      message.success('Word导出成功')
    } catch {
      message.error('Word导出失败')
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!exam) {
    return <Card style={{ borderRadius: 12 }}>试卷不存在</Card>
  }

  let globalIndex = 0

  return (
    <>
      <Card
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/exams/${id}/edit`)}>
              返回编辑
            </Button>
            <span>试卷预览</span>
          </Space>
        }
        extra={
          <Space>
            <Button icon={<FilePdfOutlined />} onClick={handleExportPdf}>
              导出PDF
            </Button>
            <Button icon={<FileWordOutlined />} onClick={handleExportWord}>
              导出Word
            </Button>
          </Space>
        }
      >
        {/* A4 paper simulation */}
        <div
          style={{
            maxWidth: 794,
            margin: '0 auto',
            background: '#ffffff',
            padding: '60px 50px',
            boxShadow: '0 4px 12px rgb(24 24 27 / 0.08)',
            fontFamily: '"SimSun", "宋体", serif',
            lineHeight: 1.8,
            color: '#000'
          }}
        >
          {/* Header */}
          <div
            style={{
              textAlign: 'center',
              borderBottom: '2px solid #18181b',
              paddingBottom: 20,
              marginBottom: 20
            }}
          >
            {exam.schoolName && (
              <div style={{ fontSize: 14, color: '#52525b', marginBottom: 4 }}>
                {exam.schoolName}
              </div>
            )}
            <h1
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                margin: '8px 0',
                fontFamily: '"SimHei", "黑体", sans-serif'
              }}
            >
              {exam.title}
            </h1>
            {exam.subtitle && (
              <div style={{ fontSize: 14, color: '#52525b', marginBottom: 4 }}>{exam.subtitle}</div>
            )}
            <div style={{ fontSize: 12, color: '#71717a', marginTop: 8 }}>
              考试时间：{exam.duration}分钟 | 满分：{exam.totalScore}分
            </div>
            <div
              style={{
                fontSize: 12,
                marginTop: 12,
                display: 'flex',
                justifyContent: 'center',
                gap: 40
              }}
            >
              <span>姓名：______________</span>
              <span>班级：______________</span>
              <span>得分：______________</span>
            </div>
          </div>

          {/* Sections */}
          {exam.sections.map((section) => (
            <div key={section.id} style={{ marginTop: 24 }}>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  fontFamily: '"SimHei", "黑体", sans-serif',
                  marginBottom: 4
                }}
              >
                {section.title}
              </h2>
              {section.description && (
                <div style={{ fontSize: 12, color: '#71717a', marginBottom: 12 }}>
                  {section.description}
                </div>
              )}

              {section.questions.map((sq) => {
                globalIndex++
                const question = questionsMap[sq.questionId]
                if (!question) return null

                return (
                  <div key={sq.questionId} style={{ marginBottom: 16, pageBreakInside: 'avoid' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontWeight: 'bold', minWidth: 24 }}>{globalIndex}.</span>
                      <div style={{ flex: 1 }}>
                        <RichContent content={question.content} />
                      </div>
                      <span style={{ fontSize: 11, color: '#a1a1aa', whiteSpace: 'nowrap' }}>
                        （{sq.points}分）
                      </span>
                    </div>

                    {/* Options */}
                    {(question.type === 'single_choice' || question.type === 'multiple_choice') &&
                      question.options.length > 0 && (
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '4px 20px',
                            marginLeft: 28,
                            marginTop: 6
                          }}
                        >
                          {question.options.map((opt) => (
                            <div key={opt.label} style={{ display: 'flex', gap: 4 }}>
                              <span style={{ fontWeight: 'bold' }}>{opt.label}.</span>
                              <RichContent content={opt.content} />
                            </div>
                          ))}
                        </div>
                      )}

                    {/* Answer area for fill-in-the-blank */}
                    {question.type === 'fill_blank' && (
                      <div style={{ marginLeft: 28, marginTop: 8 }}>答：____________________</div>
                    )}

                    {/* Answer space for essay */}
                    {question.type === 'essay' && (
                      <div
                        style={{
                          marginLeft: 28,
                          marginTop: 8,
                          minHeight: 100,
                          border: '1px dashed #d4d4d8'
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          ))}

          {/* Answer Key */}
          {exam.pageConfig.showAnswerKey && (
            <>
              <Divider style={{ pageBreakBefore: 'always' }} />
              <h2 style={{ textAlign: 'center', fontFamily: '"SimHei", "黑体", sans-serif' }}>
                参考答案
              </h2>
              {exam.sections.map((section) => (
                <div key={section.id}>
                  <h3 style={{ fontSize: 14, marginTop: 12 }}>{section.title}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                    {section.questions.map((sq) => {
                      const q = questionsMap[sq.questionId]
                      if (!q) return null
                      let answer = ''
                      if (q.type === 'single_choice') {
                        answer = String(q.correctAnswer)
                      } else if (q.type === 'multiple_choice') {
                        answer = Array.isArray(q.correctAnswer)
                          ? q.correctAnswer.join('、')
                          : String(q.correctAnswer)
                      } else if (q.type === 'fill_blank') {
                        answer = q.blankAnswers.join(' 或 ')
                      } else {
                        answer = '（见解析）'
                      }
                      return (
                        <div key={sq.questionId} style={{ fontSize: 12 }}>
                          <strong>{sq.displayOrder + 1}.</strong> {answer}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </Card>
    </>
  )
}

export default ExamPreview
