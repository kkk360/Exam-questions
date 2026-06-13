import React from 'react'
import katex from 'katex'

interface LaTeXRendererProps {
  content: string
  style?: React.CSSProperties
  className?: string
}

interface Segment {
  type: 'text' | 'inline' | 'display'
  value: string
}

function parseContent(content: string): Segment[] {
  const segments: Segment[] = []
  let remaining = content

  while (remaining.length > 0) {
    // Check for display math $$...$$
    const displayMatch = remaining.match(/^\$\$([\s\S]*?)\$\$/)
    if (displayMatch) {
      segments.push({ type: 'display', value: displayMatch[1] })
      remaining = remaining.slice(displayMatch[0].length)
      continue
    }

    // Check for inline math $...$
    const inlineMatch = remaining.match(/^\$([^$]+?)\$/)
    if (inlineMatch) {
      segments.push({ type: 'inline', value: inlineMatch[1] })
      remaining = remaining.slice(inlineMatch[0].length)
      continue
    }

    // Regular text - consume until next $
    const nextDollar = remaining.indexOf('$', 1)
    if (nextDollar === -1) {
      segments.push({ type: 'text', value: remaining })
      remaining = ''
    } else {
      segments.push({ type: 'text', value: remaining.slice(0, nextDollar) })
      remaining = remaining.slice(nextDollar)
    }
  }

  return segments
}

function renderSegment(segment: Segment): React.ReactNode {
  if (segment.type === 'text') {
    return <span key={segment.value}>{segment.value}</span>
  }

  try {
    const html = katex.renderToString(segment.value.trim(), {
      displayMode: segment.type === 'display',
      throwOnError: false,
      strict: false
    })
    return (
      <span
        key={segment.value}
        dangerouslySetInnerHTML={{ __html: html }}
        style={segment.type === 'display' ? { display: 'block', margin: '8px 0', textAlign: 'center' } : undefined}
      />
    )
  } catch {
    return (
      <span
        key={segment.value}
        style={{ color: '#ff4d4f', background: '#fff2f0', padding: '0 4px', borderRadius: 2 }}
      >
        {segment.type === 'display' ? `$$${segment.value}$$` : `$${segment.value}$`}
      </span>
    )
  }
}

const LaTeXRenderer: React.FC<LaTeXRendererProps> = ({ content, style, className }) => {
  const segments = parseContent(content)

  return (
    <span className={className} style={{ lineHeight: 1.8, ...style }}>
      {segments.map((seg, i) => (
        <React.Fragment key={i}>{renderSegment(seg)}</React.Fragment>
      ))}
    </span>
  )
}

export default LaTeXRenderer
