import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Card, Form, Input, Select, Radio, InputNumber, Button, Space, Rate, App, Divider
} from 'antd'
import { PlusOutlined, MinusCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useQuestionStore } from '../../stores/questionStore'
import { QUESTION_TYPE_LABELS, type Question } from '../../types'
import FormulaEditor from '../../components/FormulaEditor/FormulaEditor'

const { TextArea } = Input

const defaultOptionLabels = ['A', 'B', 'C', 'D']

const QuestionEditor: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { message } = App.useApp()
  const { createQuestion, updateQuestion } = useQuestionStore()
  const [form] = Form.useForm()
  const [questionType, setQuestionType] = useState<string>('single_choice')
  const [saving, setSaving] = useState(false)
  const isEdit = Boolean(id)

  useEffect(() => {
    if (id) {
      window.electron.questions.getById(id).then((q) => {
        if (q) {
          form.setFieldsValue({
            type: q.type,
            subject: q.subject,
            difficulty: q.difficulty,
            content: q.content,
            options: q.options || [],
            correctAnswer: q.correctAnswer,
            blankAnswers: q.blankAnswers || [''],
            explanation: q.explanation,
            tags: q.tags,
            score: q.score,
            chapter: q.chapter
          })
          setQuestionType(q.type)
        }
      })
    } else {
      form.setFieldsValue({
        type: 'single_choice',
        difficulty: 3,
        score: 5,
        options: defaultOptionLabels.map((label) => ({ label, content: '' })),
        blankAnswers: ['']
      })
    }
  }, [id])

  const handleTypeChange = (type: string) => {
    setQuestionType(type)
    if (type === 'single_choice' || type === 'multiple_choice') {
      const currentOptions = form.getFieldValue('options')
      if (!currentOptions || currentOptions.length === 0) {
        form.setFieldValue(
          'options',
          defaultOptionLabels.map((label) => ({ label, content: '' }))
        )
      }
    }
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      setSaving(true)

      const data = {
        type: values.type,
        subject: values.subject || '',
        chapter: values.chapter || '',
        difficulty: values.difficulty || 3,
        content: values.content || '',
        contentImages: [],
        options: values.options || [],
        correctAnswer: values.correctAnswer || (values.type === 'multiple_choice' ? [] : ''),
        blankAnswers: values.blankAnswers || [],
        explanation: values.explanation || '',
        tags: values.tags || [],
        score: values.score || 0
      }

      if (isEdit && id) {
        await updateQuestion(id, data)
        message.success('题目已更新')
      } else {
        await createQuestion(data)
        message.success('题目已创建')
      }
      navigate('/questions')
    } catch (e: any) {
      if (e.errorFields) return // form validation error
      message.error('保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card
      title={
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/questions')}>
            返回
          </Button>
          <span>{isEdit ? '编辑题目' : '新建题目'}</span>
        </Space>
      }
      extra={
        <Space>
          <Button onClick={() => navigate('/questions')}>取消</Button>
          <Button type="primary" loading={saving} onClick={handleSave}>
            保存
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 800 }}
      >
        <Form.Item
          name="type"
          label="题型"
          rules={[{ required: true, message: '请选择题型' }]}
        >
          <Radio.Group onChange={(e) => handleTypeChange(e.target.value)}>
            {Object.entries(QUESTION_TYPE_LABELS).map(([key, label]) => (
              <Radio.Button key={key} value={key}>{label}</Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        <Space size="large" style={{ display: 'flex' }}>
          <Form.Item name="subject" label="学科" style={{ width: 200 }}>
            <Select
              placeholder="选择或输入学科"
              allowClear
              showSearch
              options={[
                { value: '数学' },
                { value: '物理' },
                { value: '化学' },
                { value: '生物' },
                { value: '语文' },
                { value: '英语' },
                { value: '历史' },
                { value: '地理' },
                { value: '政治' }
              ]}
            />
          </Form.Item>

          <Form.Item name="difficulty" label="难度">
            <Rate count={5} />
          </Form.Item>

          <Form.Item name="score" label="默认分值" style={{ width: 120 }}>
            <InputNumber min={0} max={100} />
          </Form.Item>
        </Space>

        <Form.Item name="chapter" label="章节/知识点">
          <Input placeholder="如：第三章 函数与方程" />
        </Form.Item>

        <Form.Item
          name="content"
          label="题干内容"
          rules={[{ required: true, message: '请输入题干' }]}
          extra="支持 LaTeX 公式：$行内公式$ 或 $$块级公式$$"
        >
          <TextArea
            rows={6}
            placeholder="输入题干内容，支持 LaTeX 公式，如：计算 $\int_0^1 x^2 dx$ 的值"
          />
        </Form.Item>

        {/* Choice questions: options */}
        {(questionType === 'single_choice' || questionType === 'multiple_choice') && (
          <>
            <Divider titlePlacement="left" style={{ borderColor: '#e4e4e7' }}>选项</Divider>
            <Form.List name="options">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Space key={field.key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, width: 24, display: 'inline-block' }}>
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <Form.Item
                        {...field}
                        name={[field.name, 'content']}
                        rules={[{ required: true, message: '请输入选项内容' }]}
                        style={{ marginBottom: 0 }}
                      >
                        <Input placeholder={`选项 ${String.fromCharCode(65 + index)}`} style={{ width: 500 }} />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'label']}
                        initialValue={String.fromCharCode(65 + index)}
                        hidden
                      >
                        <Input />
                      </Form.Item>
                      {fields.length > 2 && (
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      )}
                    </Space>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add({ label: String.fromCharCode(65 + fields.length), content: '' })}
                    icon={<PlusOutlined />}
                    style={{ width: 548 }}
                    disabled={fields.length >= 8}
                  >
                    添加选项
                  </Button>
                </>
              )}
            </Form.List>

            <Form.Item
              name="correctAnswer"
              label="正确答案"
              rules={[{ required: true, message: '请选择正确答案' }]}
              style={{ marginTop: 16 }}
            >
              {questionType === 'single_choice' ? (
                <Radio.Group>
                  <Form.List name="options">
                    {(fields) =>
                      fields.map((field, index) => (
                        <Radio key={field.key} value={String.fromCharCode(65 + index)}>
                          {String.fromCharCode(65 + index)}
                        </Radio>
                      ))
                    }
                  </Form.List>
                </Radio.Group>
              ) : (
                <Select
                  mode="multiple"
                  placeholder="选择正确答案（可多选）"
                  style={{ width: 300 }}
                  options={Array.from({ length: 8 }, (_, i) => ({
                    label: String.fromCharCode(65 + i),
                    value: String.fromCharCode(65 + i)
                  })).slice(0, form.getFieldValue('options')?.length || 4)}
                />
              )}
            </Form.Item>
          </>
        )}

        {/* Fill-in-the-blank: answers */}
        {questionType === 'fill_blank' && (
          <>
            <Divider titlePlacement="left" style={{ borderColor: '#e4e4e7' }}>答案</Divider>
            <Form.List name="blankAnswers">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Space key={field.key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                      <Form.Item
                        {...field}
                        rules={[{ required: true, message: '请输入答案' }]}
                        style={{ marginBottom: 0 }}
                      >
                        <Input placeholder="填空答案（支持多个可接受答案）" style={{ width: 500 }} />
                      </Form.Item>
                      {fields.length > 1 && (
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      )}
                    </Space>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add('')}
                    icon={<PlusOutlined />}
                    style={{ width: 548 }}
                  >
                    添加可接受答案
                  </Button>
                </>
              )}
            </Form.List>
          </>
        )}

        <Divider titlePlacement="left" style={{ borderColor: '#e4e4e7' }}>解析与标签</Divider>

        <Form.Item
          name="explanation"
          label="解析"
        >
          <FormulaEditor rows={4} placeholder="输入题目解析（可选）" />
        </Form.Item>

        <Form.Item name="tags" label="标签">
          <Select
            mode="tags"
            placeholder="输入标签后按回车添加"
            style={{ width: '100%' }}
            tokenSeparators={[',']}
          />
        </Form.Item>
      </Form>
    </Card>
  )
}

export default QuestionEditor
