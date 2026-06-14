import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Input, Popover, Button, Space, Typography, Tooltip } from 'antd'
import { FunctionOutlined } from '@ant-design/icons'
import LaTeXRenderer from '../LaTeXRenderer'
import { symbolGroups, type SymbolItem } from './SymbolPalette'

const { TextArea } = Input
const { Text } = Typography

interface FormulaEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  rows?: number
  disabled?: boolean
  showPreview?: boolean
}

const SymbolToolbar: React.FC<{ onInsert: (latex: string) => void }> = ({ onInsert }) => {
  const [activeGroup, setActiveGroup] = useState(0)

  return (
    <div style={{ marginBottom: 8 }}>
      <Space size={[0, 4]} wrap style={{ marginBottom: 4 }}>
        {symbolGroups.map((group, i) => (
          <Button
            key={group.name}
            size="small"
            type={i === activeGroup ? 'primary' : 'default'}
            onClick={() => setActiveGroup(i)}
            style={{ borderRadius: 6 }}
          >
            {group.name}
          </Button>
        ))}
      </Space>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
        {symbolGroups[activeGroup].symbols.map((sym) => (
          <Tooltip key={sym.latex} title={sym.latex}>
            <Button
              size="small"
              onClick={() => onInsert(sym.latex)}
              style={{
                minWidth: 36,
                fontFamily: 'serif',
                fontSize: 13,
                borderRadius: 6
              }}
            >
              {sym.label}
            </Button>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}

const FormulaEditor: React.FC<FormulaEditorProps> = ({
  value = '',
  onChange,
  placeholder = '输入内容，支持 LaTeX 公式：$行内公式$ 或 $$块级公式$$',
  rows = 5,
  disabled = false,
  showPreview = true
}) => {
  const textAreaRef = useRef<any>(null)
  const [previewContent, setPreviewContent] = useState(value)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Debounced preview update
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setPreviewContent(value)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [value])

  const handleInsert = useCallback(
    (latex: string) => {
      const textarea = textAreaRef.current?.resizableTextArea?.textArea
      if (!textarea) {
        // Fallback: append to end
        const newValue = value + `$${latex}$`
        onChange?.(newValue)
        return
      }

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const insertion = `$${latex}$`
      const newValue = value.slice(0, start) + insertion + value.slice(end)
      onChange?.(newValue)

      // Restore cursor position after insertion
      setTimeout(() => {
        textarea.focus()
        const newCursor = start + insertion.length
        textarea.setSelectionRange(newCursor, newCursor)
      }, 0)
    },
    [value, onChange]
  )

  const toolbarContent = <SymbolToolbar onInsert={handleInsert} />

  return (
    <div>
      <div style={{ marginBottom: 4 }}>
        <Popover
          content={toolbarContent}
          title="插入公式"
          trigger="click"
          placement="bottomLeft"
          overlayStyle={{ maxWidth: 600 }}
        >
          <Button size="small" icon={<FunctionOutlined />} disabled={disabled}>
            插入公式
          </Button>
        </Popover>
        <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
          $行内$ | $$块级$$
        </Text>
      </div>

      <TextArea
        ref={textAreaRef}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        style={{ fontFamily: 'monospace' }}
      />

      {showPreview && value && (
        <div
          style={{
            marginTop: 8,
            padding: '12px 16px',
            background: '#fafafa',
            border: '1px solid #e4e4e7',
            borderRadius: 8,
            minHeight: 48,
            lineHeight: 1.8,
            transition: 'border-color 0.2s, box-shadow 0.2s'
          }}
        >
          <Text
            type="secondary"
            style={{ fontSize: 12, display: 'block', marginBottom: 4, color: '#a1a1aa' }}
          >
            预览：
          </Text>
          <LaTeXRenderer content={previewContent} />
        </div>
      )}
    </div>
  )
}

export default FormulaEditor
