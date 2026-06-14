import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Input, InputNumber, Select, Button, Space, App,
  Collapse, Radio, Divider, Popconfirm
} from 'antd'
import {
  PlusOutlined, DeleteOutlined, ArrowLeftOutlined,
  FilePdfOutlined, FileWordOutlined, MenuOutlined
} from '@ant-design/icons'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { useExamStore } from '../../stores/examStore'
import { QUESTION_TYPE_LABELS, type Section, type SectionQuestion } from '../../types'
import FormulaEditor from '../../components/FormulaEditor/FormulaEditor'
import RichContent from '../../components/RichContent'
import QuestionPicker from './QuestionPicker'

const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

interface PaperQuestion {
  id: string
  type: 'single_choice' | 'multiple_choice' | 'fill_blank' | 'essay'
  content: string
  options: { label: string; content: string }[]
  correctAnswer: string | string[]
  blankAnswers: string[]
  explanation: string
  score: number
}

interface PaperSection {
  id: string
  title: string
  description: string
  questions: PaperQuestion[]
}

const defaultPageConfig = {
  pageSize: 'A4' as const,
  orientation: 'portrait' as const,
  margins: { top: 25, right: 20, bottom: 25, left: 20 },
  showAnswerKey: true,
  showScoreBox: true,
  headerFontSize: 12
}

/* ===== Right panel: edit a single question ===== */
const QuestionFormPanel: React.FC<{
  question: PaperQuestion
  onChange: (q: PaperQuestion) => void
}> = ({ question, onChange }) => {
  const update = (partial: Partial<PaperQuestion>) => onChange({ ...question, ...partial })

  return (
    <div>
      <Space style={{ marginBottom: 12 }}>
        <span style={{ fontWeight: 500, color: '#52525b' }}>分值：</span>
        <InputNumber min={0} max={100} size="small" value={question.score}
          onChange={(v) => update({ score: v || 0 })} style={{ width: 80 }} />
      </Space>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 500, marginBottom: 4, color: '#52525b' }}>题干</div>
        <FormulaEditor value={question.content} onChange={(v) => update({ content: v })}
          rows={4} placeholder="输入题干，支持 $LaTeX公式$" />
      </div>

      {(question.type === 'single_choice' || question.type === 'multiple_choice') && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 500, marginBottom: 4, color: '#52525b' }}>选项</div>
          {question.options.map((opt, i) => (
            <Space key={i} align="baseline" style={{ display: 'flex', marginBottom: 6 }}>
              <span style={{ fontWeight: 600, width: 20 }}>{opt.label}.</span>
              <Input size="small" value={opt.content}
                onChange={(e) => {
                  const opts = [...question.options]
                  opts[i] = { ...opts[i], content: e.target.value }
                  update({ options: opts })
                }}
                placeholder={`选项 ${opt.label}`} style={{ width: 280 }} />
              {question.options.length > 2 && (
                  <DeleteOutlined onClick={() => {
                    const opts = question.options.filter((_, j) => j !== i)
                      .map((o, j) => ({ ...o, label: String.fromCharCode(65 + j) }))
                    update({ options: opts })
                  }} style={{ color: '#a1a1aa' }} />
              )}
            </Space>
          ))}
          {question.options.length < 8 && (
            <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={() => {
              const label = String.fromCharCode(65 + question.options.length)
              update({ options: [...question.options, { label, content: '' }] })
            }}>添加选项</Button>
          )}
            <div style={{ marginTop: 8 }}>
            <span style={{ fontWeight: 500, marginRight: 8, color: '#52525b' }}>答案：</span>
            {question.type === 'single_choice' ? (
              <Radio.Group value={question.correctAnswer as string}
                onChange={(e) => update({ correctAnswer: e.target.value })}>
                {question.options.map((o) => <Radio key={o.label} value={o.label}>{o.label}</Radio>)}
              </Radio.Group>
            ) : (
              <Select mode="multiple" size="small" value={question.correctAnswer as string[]}
                onChange={(v) => update({ correctAnswer: v })}
                options={question.options.map((o) => ({ label: o.label, value: o.label }))}
                placeholder="选择正确答案" style={{ minWidth: 200 }} />
            )}
          </div>
        </div>
      )}

      {question.type === 'fill_blank' && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 500, marginBottom: 4, color: '#52525b' }}>答案</div>
          {question.blankAnswers.map((ans, i) => (
            <Space key={i} style={{ marginBottom: 6 }}>
              <Input size="small" value={ans}
                onChange={(e) => {
                  const arr = [...question.blankAnswers]; arr[i] = e.target.value
                  update({ blankAnswers: arr })
                }}
                placeholder="填空答案" style={{ width: 280 }} />
              {question.blankAnswers.length > 1 && (
                <DeleteOutlined onClick={() => update({ blankAnswers: question.blankAnswers.filter((_, j) => j !== i) })} style={{ color: '#a1a1aa' }} />
              )}
            </Space>
          ))}
          <Button type="dashed" size="small" icon={<PlusOutlined />}
            onClick={() => update({ blankAnswers: [...question.blankAnswers, ''] })}>添加备选答案</Button>
        </div>
      )}

      <div>
        <div style={{ fontWeight: 500, marginBottom: 4, color: '#52525b' }}>解析（可选）</div>
        <FormulaEditor value={question.explanation} onChange={(v) => update({ explanation: v })}
          rows={3} placeholder="输入解析" showPreview={false} />
      </div>
    </div>
  )
}

/* ===== Left panel: live preview ===== */
const PaperPreview: React.FC<{
  title: string; subtitle: string; schoolName: string; subject: string
  duration: number; sections: PaperSection[]; showAnswerKey: boolean
}> = ({ title, subtitle, schoolName, subject, duration, sections, showAnswerKey }) => {
  const totalScore = sections.reduce((s, sec) => s + sec.questions.reduce((s2, q) => s2 + q.score, 0), 0)
  let globalIndex = 0

  return (
    <div style={{ background: '#ffffff', padding: '40px 36px', fontFamily: '"SimSun","宋体",serif', lineHeight: 1.8, color: '#000', minHeight: '100%' }}>
      <div style={{ textAlign: 'center', borderBottom: '2px solid #18181b', paddingBottom: 16, marginBottom: 16 }}>
        {schoolName && <div style={{ fontSize: 13, color: '#52525b' }}>{schoolName}</div>}
        <h1 style={{ fontSize: 20, fontWeight: 'bold', margin: '6px 0', fontFamily: '"SimHei","黑体",sans-serif' }}>{title || '未命名试卷'}</h1>
        {subtitle && <div style={{ fontSize: 13, color: '#52525b' }}>{subtitle}</div>}
        <div style={{ fontSize: 11, color: '#71717a', marginTop: 6 }}>
          {subject && <span>{subject} | </span>}考试时间：{duration}分钟 | 满分：{totalScore}分
        </div>
        <div style={{ fontSize: 11, marginTop: 8, display: 'flex', justifyContent: 'center', gap: 30 }}>
          <span>姓名：__________</span><span>班级：__________</span><span>得分：__________</span>
        </div>
      </div>

      {sections.map((section) => (
        <div key={section.id} style={{ marginTop: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 'bold', fontFamily: '"SimHei","黑体",sans-serif', marginBottom: 2 }}>{section.title}</h2>
          {section.description && <div style={{ fontSize: 11, color: '#71717a', marginBottom: 8 }}>{section.description}</div>}
          {section.questions.length === 0 && <div style={{ color: '#d4d4d8', fontSize: 12, padding: '12px 0' }}>暂无题目</div>}
          {section.questions.map((q) => {
            globalIndex++
            return (
              <div key={q.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontWeight: 'bold', minWidth: 22 }}>{globalIndex}.</span>
                  <div style={{ flex: 1 }}><RichContent content={q.content || '（请输入题干）'} /></div>
                  <span style={{ fontSize: 10, color: '#a1a1aa', whiteSpace: 'nowrap' }}>（{q.score}分）</span>
                </div>
                {(q.type === 'single_choice' || q.type === 'multiple_choice') && q.options.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 16px', marginLeft: 24, marginTop: 4 }}>
                    {q.options.map((opt) => (
                      <div key={opt.label} style={{ fontSize: 13 }}><strong>{opt.label}.</strong> {opt.content}</div>
                    ))}
                  </div>
                )}
                {q.type === 'fill_blank' && <div style={{ marginLeft: 24, marginTop: 4, fontSize: 13 }}>答：____________________</div>}
                {q.type === 'essay' && <div style={{ marginLeft: 24, marginTop: 4, minHeight: 60, border: '1px dashed #ddd' }} />}
              </div>
            )
          })}
        </div>
      ))}

      {showAnswerKey && sections.some((s) => s.questions.length > 0) && (
        <>
          <Divider style={{ margin: '24px 0 16px' }} />
          <h2 style={{ textAlign: 'center', fontSize: 16, fontFamily: '"SimHei","黑体",sans-serif' }}>参考答案</h2>
          {sections.map((section) => section.questions.length > 0 ? (
            <div key={section.id}>
              <div style={{ fontWeight: 'bold', fontSize: 13, marginTop: 8 }}>{section.title}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, fontSize: 12 }}>
                {section.questions.map((q, i) => {
                  let answer = ''
                  if (q.type === 'single_choice') answer = String(q.correctAnswer)
                  else if (q.type === 'multiple_choice') answer = Array.isArray(q.correctAnswer) ? q.correctAnswer.join('、') : String(q.correctAnswer)
                  else if (q.type === 'fill_blank') answer = q.blankAnswers.join(' 或 ')
                  else answer = '（见解析）'
                  return <div key={q.id}><strong>{i + 1}.</strong> {answer}</div>
                })}
              </div>
            </div>
          ) : null)}
        </>
      )}
    </div>
  )
}

/* ===== Main ExamBuilder ===== */
const ExamBuilder: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { message } = App.useApp()
  const { createExam, updateExam } = useExamStore()

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [subject, setSubject] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [duration, setDuration] = useState(120)
  const [showAnswerKey, setShowAnswerKey] = useState(true)
  const [sections, setSections] = useState<PaperSection[]>([
    { id: genId(), title: '一、选择题', description: '（每题5分）', questions: [] }
  ])
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [examId, setExamId] = useState(id)
  const [pickerVisible, setPickerVisible] = useState(false)
  const [pickerSectionId, setPickerSectionId] = useState<string | null>(null)
  const [autoSaving, setAutoSaving] = useState(false)
  const [autoSavedTime, setAutoSavedTime] = useState(0)
  const isLoadedRef = useRef(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const isSavingRef = useRef(false)
  const hideAutoSavedTimerRef = useRef<ReturnType<typeof setTimeout>>()

  React.useEffect(() => {
    if (id) {
      window.electron.exams.getWithQuestions(id).then((data) => {
        if (!data) { isLoadedRef.current = true; return }
        const { exam } = data
        setTitle(exam.title); setSubtitle(exam.subtitle); setSubject(exam.subject)
        setSchoolName(exam.schoolName); setDuration(exam.duration)
        setShowAnswerKey(exam.pageConfig.showAnswerKey)
        setSections(exam.sections.map((s: any) => ({
          id: s.id, title: s.title, description: s.description,
          questions: s.questions.map((sq: any) => {
            const q = data.questionsMap[sq.questionId]
            return {
              id: sq.questionId, type: q?.type || 'single_choice' as const,
              content: q?.content || '', options: q?.options || [],
              correctAnswer: q?.correctAnswer || '', blankAnswers: q?.blankAnswers || [],
              explanation: q?.explanation || '', score: sq.points || 0
            }
          })
        })))
        isLoadedRef.current = true
      })
    } else {
      isLoadedRef.current = true
    }
  }, [id])

  const totalScore = useMemo(() =>
    sections.reduce((s, sec) => s + sec.questions.reduce((s2, q) => s2 + q.score, 0), 0), [sections])

  const addQuestion = (sectionId: string, type: PaperQuestion['type']) => {
    const newQ: PaperQuestion = {
      id: genId(), type, content: '',
      options: (type === 'single_choice' || type === 'multiple_choice')
        ? ['A', 'B', 'C', 'D'].map((l) => ({ label: l, content: '' })) : [],
      correctAnswer: type === 'multiple_choice' ? [] : '',
      blankAnswers: type === 'fill_blank' ? [''] : [],
      explanation: '', score: 5
    }
    setSections(sections.map((s) => s.id === sectionId ? { ...s, questions: [...s.questions, newQ] } : s))
    setActiveQuestionId(newQ.id)
  }

  const openPicker = (sectionId: string) => {
    setPickerSectionId(sectionId)
    setPickerVisible(true)
  }

  const handlePickerConfirm = async (questionIds: string[], points: number) => {
    if (!pickerSectionId) return
    const allQuestions = await window.electron.questions.list()
    const picked = allQuestions.filter((q) => questionIds.includes(q.id))
    const newQuestions: PaperQuestion[] = picked.map((q) => ({
      id: q.id, type: q.type, content: q.content, options: q.options,
      correctAnswer: q.correctAnswer, blankAnswers: q.blankAnswers,
      explanation: q.explanation, score: points
    }))
    setSections(sections.map((s) => s.id === pickerSectionId
      ? { ...s, questions: [...s.questions, ...newQuestions] } : s))
    setPickerVisible(false)
    setPickerSectionId(null)
  }

  const updateQuestion = (sectionId: string, qId: string, q: PaperQuestion) => {
    setSections(sections.map((s) => s.id === sectionId
      ? { ...s, questions: s.questions.map((pq) => pq.id === qId ? q : pq) } : s))
  }

  const removeQuestion = (sectionId: string, qId: string) => {
    setSections(sections.map((s) => s.id === sectionId ? { ...s, questions: s.questions.filter((q) => q.id !== qId) } : s))
    if (activeQuestionId === qId) setActiveQuestionId(null)
  }

  const saveExam = async (isAuto: boolean) => {
    if (isSavingRef.current) return
    isSavingRef.current = true
    if (!isAuto) setSaving(true)
    else setAutoSaving(true)
    try {
      for (const section of sections) {
        for (const q of section.questions) {
          const existing = await window.electron.questions.getById(q.id)
          const qData = { type: q.type, content: q.content, options: q.options, correctAnswer: q.correctAnswer, blankAnswers: q.blankAnswers, explanation: q.explanation, score: q.score, subject, contentImages: [] as string[], tags: [] as string[], chapter: '', difficulty: 3 }
          if (existing) await window.electron.questions.update(q.id, qData)
          else await window.electron.questions.create(qData)
        }
      }
      const storageSections: Section[] = sections.map((s, si) => ({
        id: s.id, title: s.title, description: s.description, sortOrder: si,
        questions: s.questions.map((q, qi): SectionQuestion => ({ questionId: q.id, displayOrder: qi, points: q.score }))
      }))
      const data = { title: title || '未命名试卷', subtitle, subject, schoolName, duration, totalScore, sections: storageSections, pageConfig: { ...defaultPageConfig, showAnswerKey } }
      if (examId) { await updateExam(examId, data); if (!isAuto) message.success('已保存') }
      else { const ne = await createExam(data); setExamId(ne.id); if (!isAuto) { message.success('已创建'); navigate(`/exams/${ne.id}/edit`, { replace: true }) } }
      if (isAuto) {
        setAutoSavedTime(Date.now())
        if (hideAutoSavedTimerRef.current) clearTimeout(hideAutoSavedTimerRef.current)
        hideAutoSavedTimerRef.current = setTimeout(() => setAutoSavedTime(0), 3000)
      }
    } catch { if (!isAuto) message.error('保存失败') }
    finally { isSavingRef.current = false; if (!isAuto) setSaving(false); else setAutoSaving(false) }
  }

  const saveExamRef = useRef(saveExam)
  useEffect(() => { saveExamRef.current = saveExam })

  useEffect(() => {
    if (!isLoadedRef.current) return
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => saveExamRef.current(true), 800)
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current) }
  }, [title, subtitle, subject, schoolName, duration, showAnswerKey, sections])

  const handleSave = async () => {
    if (isSavingRef.current) { message.info('正在自动保存，请稍候...'); return }
    await saveExam(false)
  }

  const handleExportPdf = async () => {
    if (!examId) { message.warning('请先保存'); return }
    const fp = await window.electron.export.showSaveDialog(`${title || '试卷'}.pdf`, [{ name: 'PDF', extensions: ['pdf'] }])
    if (!fp) return
    await window.electron.export.toPdf(examId, fp); message.success('PDF导出成功')
  }

  const handleExportWord = async () => {
    if (!examId) { message.warning('请先保存'); return }
    const fp = await window.electron.export.showSaveDialog(`${title || '试卷'}.docx`, [{ name: 'Word', extensions: ['docx'] }])
    if (!fp) return
    await window.electron.export.toWord(examId, fp); message.success('Word导出成功')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top metadata bar */}
      <div style={{ background: '#ffffff', padding: '10px 16px', borderBottom: '1px solid #e4e4e7', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/exams')}>返回</Button>
          <Input placeholder="试卷标题" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: 220, fontWeight: 600 }} />
          <Select placeholder="学科" value={subject || undefined} onChange={(v) => setSubject(v || '')} allowClear style={{ width: 100 }}
            options={['数学','物理','化学','生物','语文','英语','历史','地理','政治'].map((s) => ({ value: s }))} />
          <Input placeholder="学校" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} style={{ width: 130 }} />
          <Input placeholder="副标题" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} style={{ width: 150 }} />
          <Space size="small"><span style={{ fontSize: 13, color: '#71717a' }}>时长</span>
            <InputNumber min={1} max={300} value={duration} onChange={(v) => setDuration(v || 120)} size="small" style={{ width: 65 }} />
            <span style={{ fontSize: 13, color: '#71717a' }}>分钟</span></Space>
          <span style={{ fontSize: 13, color: '#71717a' }}>总分：<strong style={{ color: '#059669' }}>{totalScore}</strong></span>
          <div style={{ marginLeft: 'auto' }}>
            <Space>
              {autoSaving && <span style={{ fontSize: 12, color: '#a1a1aa' }}>正在保存…</span>}
              {!autoSaving && autoSavedTime > 0 && <span style={{ fontSize: 12, color: '#10b981' }}>已自动保存</span>}
              <Button type="primary" onClick={handleSave} loading={saving}>保存</Button>
              <Button icon={<FilePdfOutlined />} onClick={handleExportPdf}>PDF</Button>
              <Button icon={<FileWordOutlined />} onClick={handleExportWord}>Word</Button>
            </Space>
          </div>
        </div>
      </div>

      {/* Split: left preview + right editor */}
      <Group orientation="horizontal" style={{ flex: 1, overflow: 'hidden' }}>
        <Panel defaultSize="60%" minSize="25%">
          <div style={{ height: '100%', overflow: 'auto', background: '#e4e4e7', padding: 20 }}>
            <div style={{ maxWidth: 700, margin: '0 auto', boxShadow: '0 4px 12px rgb(24 24 27 / 0.08)', minHeight: 900 }}>
              <PaperPreview title={title} subtitle={subtitle} schoolName={schoolName} subject={subject}
                duration={duration} sections={sections} showAnswerKey={showAnswerKey} />
            </div>
          </div>
        </Panel>

        <Separator style={{
          width: 4, cursor: 'col-resize', background: '#d4d4d8', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s',
        }}>
          <div style={{
            width: 2, height: 32, borderRadius: 2, background: '#a1a1aa', transition: 'background 0.2s',
          }} />
        </Separator>

        <Panel defaultSize="40%" minSize="20%">
          <div style={{ height: '100%', borderLeft: '1px solid #e4e4e7', background: '#ffffff', overflow: 'auto' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #e4e4e7', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#18181b' }}>出题面板</span>
            </div>
            <div style={{ padding: 12 }}>
            <Collapse size="small" defaultActiveKey={sections.map((s) => s.id)}
              items={sections.map((section) => ({
                key: section.id,
                label: (
                  <Space onClick={(e) => e.stopPropagation()}>
                    <Input size="small" value={section.title} onChange={(e) => setSections(sections.map((s) => s.id === section.id ? { ...s, title: e.target.value } : s))}
                      onClick={(e) => e.stopPropagation()} style={{ width: 130 }} />
                    <Input size="small" value={section.description} onChange={(e) => setSections(sections.map((s) => s.id === section.id ? { ...s, description: e.target.value } : s))}
                      onClick={(e) => e.stopPropagation()} placeholder="描述" style={{ width: 110 }} />
                    <span style={{ color: '#a1a1aa', fontSize: 12 }}>{section.questions.reduce((s, q) => s + q.score, 0)}分</span>
                  </Space>
                ),
                extra: (
                  <Popconfirm title="删除此分区？" onConfirm={(e) => { e?.stopPropagation(); setSections(sections.filter((s) => s.id !== section.id)) }}>
                    <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
                  </Popconfirm>
                ),
                children: (
                  <div>
                    {section.questions.map((q, idx) => (
                      <div key={q.id} style={{ marginBottom: 6 }}>
                        <div onClick={() => setActiveQuestionId(activeQuestionId === q.id ? null : q.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 6, cursor: 'pointer',
                            background: activeQuestionId === q.id ? '#ecfdf5' : '#fafafa',
                            border: activeQuestionId === q.id ? '1px solid #6ee7b7' : '1px solid #e4e4e7',
                          }}>
                          <MenuOutlined style={{ color: '#d4d4d8' }} />
                          <span style={{ fontWeight: 600, fontSize: 12, color: '#52525b' }}>{idx + 1}.</span>
                          <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 4, background: '#f4f4f5', color: '#71717a' }}>{QUESTION_TYPE_LABELS[q.type]}</span>
                          <span style={{ flex: 1, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#52525b' }}>
                            {q.content ? q.content.replace(/\$[^$]*\$/g, '[公式]').slice(0, 25) : '（空题目）'}
                          </span>
                          <span style={{ fontSize: 11, color: '#a1a1aa' }}>{q.score}分</span>
                          <Popconfirm title="删除？" onConfirm={(e) => { e?.stopPropagation(); removeQuestion(section.id, q.id) }}>
                            <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
                          </Popconfirm>
                        </div>
                        {activeQuestionId === q.id && (
                          <div style={{ padding: '10px 0 4px 24px', borderBottom: '1px solid #f0f0f1' }}>
                            <QuestionFormPanel question={q} onChange={(u) => updateQuestion(section.id, q.id, u)} />
                          </div>
                        )}
                      </div>
                    ))}
                    <Space size="small" wrap style={{ marginTop: 8 }}>
                      {(['single_choice', 'multiple_choice', 'fill_blank', 'essay'] as const).map((t) => (
                        <Button key={t} size="small" type="dashed" icon={<PlusOutlined />} onClick={() => addQuestion(section.id, t)}>
                          {QUESTION_TYPE_LABELS[t]}
                        </Button>
                      ))}
                      <Button size="small" type="primary" ghost icon={<PlusOutlined />} onClick={() => openPicker(section.id)}>
                        从题库选择
                      </Button>
                    </Space>
                  </div>
                )
              }))} />
            <Button type="dashed" icon={<PlusOutlined />} block onClick={() => {
              const names = ['一','二','三','四','五','六','七','八']
              setSections([...sections, { id: genId(), title: `${names[sections.length] || (sections.length + 1)}、`, description: '', questions: [] }])
            }} style={{ marginTop: 12 }}>添加大题分区</Button>
          </div>
        </div>
        </Panel>
      </Group>
      <QuestionPicker
        visible={pickerVisible}
        onCancel={() => setPickerVisible(false)}
        onConfirm={handlePickerConfirm}
        existingIds={sections.flatMap((s) => s.questions.map((q) => q.id))}
      />
    </div>
  )
}

export default ExamBuilder
