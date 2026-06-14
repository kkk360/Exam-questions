import { BrowserWindow } from 'electron'
import { readFileSync, writeFileSync } from 'fs'
import katex from 'katex'
import { getExamWithQuestions } from './exam.service'

function renderLatex(text: string): string {
  // Replace display math $$...$$ first
  let result = text.replace(/\$\$([\s\S]*?)\$\$/g, (_match, formula) => {
    try {
      return katex.renderToString(formula.trim(), { displayMode: true, throwOnError: false })
    } catch {
      return `<span class="latex-error">${formula}</span>`
    }
  })
  // Replace inline math $...$
  result = result.replace(/\$([^$]+?)\$/g, (_match, formula) => {
    try {
      return katex.renderToString(formula.trim(), { displayMode: false, throwOnError: false })
    } catch {
      return `<span class="latex-error">${formula}</span>`
    }
  })
  return result
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderContent(text: string): string {
  return renderLatex(escapeHtml(text))
}

export async function exportToPdf(examId: string, outputPath: string): Promise<boolean> {
  const data = getExamWithQuestions(examId)
  if (!data) return false

  const { exam, questionsMap } = data

  // Get KaTeX CSS content - we need to inline it for the hidden window
  const katexCssPath = require.resolve('katex/dist/katex.min.css')
  const katexCss = readFileSync(katexCssPath, 'utf-8')

  // Build HTML
  let sectionsHtml = ''
  let globalIndex = 0

  for (const section of exam.sections) {
    let questionsHtml = ''
    for (const sq of section.questions) {
      globalIndex++
      const question = questionsMap[sq.questionId]
      if (!question) continue

      const contentHtml = renderContent(question.content)

      // Options for choice questions
      let optionsHtml = ''
      if (
        (question.type === 'single_choice' || question.type === 'multiple_choice') &&
        question.options
      ) {
        optionsHtml = '<div class="options">'
        for (const opt of question.options) {
          optionsHtml += `<div class="option"><span class="option-label">${opt.label}.</span> ${renderContent(opt.content)}</div>`
        }
        optionsHtml += '</div>'
      }

      // Answer area
      let answerHtml = ''
      if (question.type === 'fill_blank') {
        answerHtml = '<div class="answer-line">答：____________________</div>'
      } else if (question.type === 'essay') {
        answerHtml = '<div class="answer-space"></div>'
      }

      questionsHtml += `
        <div class="question">
          <div class="question-content">
            <span class="question-number">${globalIndex}.</span>
            <span class="question-text">${contentHtml}</span>
            <span class="question-points">（${sq.points}分）</span>
          </div>
          ${optionsHtml}
          ${answerHtml}
        </div>
      `
    }

    sectionsHtml += `
      <div class="section">
        <h2 class="section-title">${section.title}</h2>
        <p class="section-desc">${section.description}</p>
        ${questionsHtml}
      </div>
    `
  }

  const pc = exam.pageConfig
  const margins = pc.margins

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
${katexCss}

@page {
  size: ${pc.pageSize} ${pc.orientation};
  margin: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
}

body {
  font-family: "SimSun", "宋体", serif;
  font-size: ${pc.headerFontSize}pt;
  line-height: 1.8;
  color: #000;
}

.exam-header {
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #000;
  padding-bottom: 15px;
}

.exam-title {
  font-size: 18pt;
  font-weight: bold;
  font-family: "SimHei", "黑体", sans-serif;
  margin: 0;
}

.exam-subtitle {
  font-size: 12pt;
  color: #333;
  margin: 5px 0;
}

.exam-info {
  font-size: 10pt;
  color: #666;
  margin-top: 8px;
}

.section {
  margin-top: 20px;
}

.section-title {
  font-size: 14pt;
  font-weight: bold;
  font-family: "SimHei", "黑体", sans-serif;
  margin-bottom: 5px;
}

.section-desc {
  font-size: 10pt;
  color: #666;
  margin-bottom: 10px;
}

.question {
  margin-bottom: 15px;
  page-break-inside: avoid;
}

.question-content {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.question-number {
  font-weight: bold;
  min-width: 24px;
}

.question-text {
  flex: 1;
}

.question-points {
  font-size: 9pt;
  color: #888;
  white-space: nowrap;
}

.options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 20px;
  margin: 8px 0 4px 28px;
}

.option {
  display: flex;
  gap: 4px;
}

.option-label {
  font-weight: bold;
}

.answer-line {
  margin: 8px 0 0 28px;
}

.answer-space {
  min-height: 100px;
  border: 1px dashed #ccc;
  margin: 8px 0 0 28px;
}

.answer-key {
  page-break-before: always;
}

.answer-key h2 {
  text-align: center;
  font-family: "SimHei", "黑体", sans-serif;
}

.answer-key h3 {
  font-size: 12pt;
  margin-top: 15px;
}

.answers {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.answer-item {
  display: flex;
  gap: 4px;
}

.answer-num {
  font-weight: bold;
}
</style>
</head>
<body>
<div class="exam-header">
  ${exam.schoolName ? `<p class="exam-subtitle">${exam.schoolName}</p>` : ''}
  <h1 class="exam-title">${exam.title}</h1>
  ${exam.subtitle ? `<p class="exam-subtitle">${exam.subtitle}</p>` : ''}
  <div class="exam-info">
    考试时间：${exam.duration}分钟 | 满分：${exam.totalScore}分
  </div>
  <div class="exam-info">
    姓名：______________ &nbsp;&nbsp; 班级：______________ &nbsp;&nbsp; 得分：______________
  </div>
</div>
${sectionsHtml}
</body>
</html>`

  // Create hidden window and generate PDF
  const pdfWindow = new BrowserWindow({
    show: false,
    webPreferences: { offscreen: true }
  })

  try {
    await pdfWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)

    // Map page size - Electron doesn't support "B5" directly, use dimensions
    const pageSizeMap: Record<string, any> = {
      A4: 'A4',
      B5: { width: 176000, height: 250000 }, // B5 in microns
      Letter: 'Letter'
    }

    const pdfBuffer = await pdfWindow.webContents.printToPDF({
      pageSize: pageSizeMap[pc.pageSize] || 'A4',
      landscape: pc.orientation === 'landscape',
      printBackground: true,
      margins: {
        top: margins.top / 25.4, // Convert mm to inches
        right: margins.right / 25.4,
        bottom: margins.bottom / 25.4,
        left: margins.left / 25.4
      }
    })

    writeFileSync(outputPath, pdfBuffer)
    return true
  } finally {
    if (!pdfWindow.isDestroyed()) {
      pdfWindow.destroy()
    }
  }
}

export async function exportAnswerKeyToPdf(answerKey: any, outputPath: string): Promise<boolean> {
  const katexCssPath = require.resolve('katex/dist/katex.min.css')
  const katexCss = readFileSync(katexCssPath, 'utf-8')

  let sectionsHtml = ''
  let globalIndex = 0

  for (const section of answerKey.sections) {
    let itemsHtml = ''
    for (const item of section.items) {
      globalIndex++
      const contentHtml = renderContent(item.content)
      const answerHtml = renderContent(item.answer)
      const explanationHtml = item.explanation ? renderContent(item.explanation) : ''

      itemsHtml += `
        <div class="question">
          <div class="question-content">
            <span class="question-number">${globalIndex}.</span>
            <span class="question-text">${contentHtml}</span>
          </div>
          <div class="answer-row"><strong>答案：</strong>${answerHtml}</div>
          ${explanationHtml ? `<div class="explanation-row"><strong>解析：</strong>${explanationHtml}</div>` : ''}
        </div>
      `
    }

    sectionsHtml += `
      <div class="section">
        <h2 class="section-title">${section.title}</h2>
        ${section.description ? `<p class="section-desc">${section.description}</p>` : ''}
        ${itemsHtml}
      </div>
    `
  }

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
${katexCss}
@page { size: A4 portrait; margin: 20mm 15mm; }
body {
  font-family: "SimSun", "宋体", serif;
  font-size: 12pt;
  line-height: 1.8;
  color: #000;
}
h1 {
  text-align: center;
  font-family: "SimHei", "黑体", sans-serif;
  font-size: 18pt;
  border-bottom: 2px solid #000;
  padding-bottom: 12px;
  margin-bottom: 20px;
}
.section { margin-top: 20px; }
.section-title {
  font-size: 14pt;
  font-weight: bold;
  font-family: "SimHei", "黑体", sans-serif;
  margin-bottom: 5px;
}
.section-desc { font-size: 10pt; color: #666; margin-bottom: 10px; }
.question { margin-bottom: 12px; page-break-inside: avoid; }
.question-content { display: flex; align-items: baseline; gap: 4px; }
.question-number { font-weight: bold; min-width: 24px; }
.question-text { flex: 1; }
.answer-row { margin: 2px 0 2px 28px; font-size: 11pt; color: #065f46; }
.explanation-row { margin: 2px 0 2px 28px; font-size: 10pt; color: #71717a; }
</style>
</head>
<body>
<h1>${answerKey.title}</h1>
${sectionsHtml}
</body>
</html>`

  const pdfWindow = new BrowserWindow({
    show: false,
    webPreferences: { offscreen: true }
  })

  try {
    await pdfWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
    const pdfBuffer = await pdfWindow.webContents.printToPDF({
      pageSize: 'A4',
      printBackground: true,
      margins: { top: 0.8, right: 0.6, bottom: 0.8, left: 0.6 }
    })
    writeFileSync(outputPath, pdfBuffer)
    return true
  } finally {
    if (!pdfWindow.isDestroyed()) {
      pdfWindow.destroy()
    }
  }
}
