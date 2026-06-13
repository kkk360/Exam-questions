import React from 'react'
import LaTeXRenderer from './LaTeXRenderer'

interface RichContentProps {
  content: string
  style?: React.CSSProperties
  className?: string
}

const RichContent: React.FC<RichContentProps> = ({ content, style, className }) => {
  return (
    <div className={className} style={{ lineHeight: 1.8, whiteSpace: 'pre-wrap', ...style }}>
      <LaTeXRenderer content={content} />
    </div>
  )
}

export default RichContent
