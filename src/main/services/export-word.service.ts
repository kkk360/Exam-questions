import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle
} from 'docx'
import { writeFileSync } from 'fs'
import { getExamWithQuestions } from './exam.service'

function createTextRuns(text: string): TextRun[] {
  // Simple text run - LaTeX formulas will be shown as raw text in Word
  // For a full implementation, we'd render LaTeX to images and embed them
  return [new TextRun({ text, font: 'SimSun', size: 24 })]
}

function createTitleParagraph(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [
      new TextRun({
        text,
        font: 'SimHei',
        size: 36,
        bold: true
      })
    ]
  })
}

export async function exportToWord(examId: string, outputPath: string): Promise<boolean> {
  const data = getExamWithQuestions(examId)
  if (!data) return false

  const { exam, questionsMap } = data

  const children: (Paragraph | Table)[] = []

  // Header
  if (exam.schoolName) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: exam.schoolName, font: 'SimSun', size: 24 })]
      })
    )
  }

  children.push(createTitleParagraph(exam.title))

  if (exam.subtitle) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: exam.subtitle, font: 'SimSun', size: 24 })]
      })
    )
  }

  // Exam info
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `考试时间：${exam.duration}分钟    满分：${exam.totalScore}分`,
          font: 'SimSun',
          size: 20
        })
      ]
    })
  )

  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: '姓名：______________    班级：______________    得分：______________',
          font: 'SimSun',
          size: 20
        })
      ]
    })
  )

  // Separator line
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000' } },
      children: []
    })
  )

  // Sections
  let globalIndex = 0
  for (const section of exam.sections) {
    // Section title
    children.push(
      new Paragraph({
        spacing: { before: 300, after: 100 },
        children: [
          new TextRun({
            text: section.title,
            font: 'SimHei',
            size: 28,
            bold: true
          })
        ]
      })
    )

    if (section.description) {
      children.push(
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: section.description,
              font: 'SimSun',
              size: 20,
              color: '666666'
            })
          ]
        })
      )
    }

    // Questions
    for (const sq of section.questions) {
      globalIndex++
      const question = questionsMap[sq.questionId]
      if (!question) continue

      // Question content
      children.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: `${globalIndex}. `,
              font: 'SimSun',
              size: 24,
              bold: true
            }),
            ...createTextRuns(question.content),
            new TextRun({
              text: `  （${sq.points}分）`,
              font: 'SimSun',
              size: 18,
              color: '888888'
            })
          ]
        })
      )

      // Options for choice questions
      if (
        (question.type === 'single_choice' || question.type === 'multiple_choice') &&
        question.options
      ) {
        for (const opt of question.options) {
          children.push(
            new Paragraph({
              indent: { left: 480 },
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: `${opt.label}. `,
                  font: 'SimSun',
                  size: 24,
                  bold: true
                }),
                ...createTextRuns(opt.content)
              ]
            })
          )
        }
      }

      // Answer area
      if (question.type === 'fill_blank') {
        children.push(
          new Paragraph({
            indent: { left: 480 },
            spacing: { before: 80, after: 80 },
            children: [
              new TextRun({ text: '答：____________________', font: 'SimSun', size: 24 })
            ]
          })
        )
      } else if (question.type === 'essay') {
        // Add empty lines for essay answer space
        for (let i = 0; i < 5; i++) {
          children.push(new Paragraph({ spacing: { after: 200 }, children: [] }))
        }
      }
    }
  }

  // Answer key
  if (exam.pageConfig.showAnswerKey) {
    children.push(
      new Paragraph({
        children: [new PageBreak()]
      })
    )
    children.push(createTitleParagraph('参考答案'))

    globalIndex = 0
    for (const section of exam.sections) {
      children.push(
        new Paragraph({
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: section.title,
              font: 'SimHei',
              size: 24,
              bold: true
            })
          ]
        })
      )

      for (const sq of section.questions) {
        globalIndex++
        const question = questionsMap[sq.questionId]
        if (!question) continue

        let answer = ''
        if (question.type === 'single_choice') {
          answer = String(question.correctAnswer)
        } else if (question.type === 'multiple_choice') {
          answer = Array.isArray(question.correctAnswer)
            ? question.correctAnswer.join('、')
            : String(question.correctAnswer)
        } else if (question.type === 'fill_blank') {
          answer = question.blankAnswers.join(' 或 ')
        } else {
          answer = question.explanation || '（见解析）'
        }

        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: `${globalIndex}. `,
                font: 'SimSun',
                size: 22,
                bold: true
              }),
              new TextRun({ text: answer, font: 'SimSun', size: 22 })
            ]
          })
        )
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906, // A4 width in twips
              height: 16838 // A4 height in twips
            },
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        children
      }
    ]
  })

  const buffer = await Packer.toBuffer(doc)
  writeFileSync(outputPath, buffer)
  return true
}
