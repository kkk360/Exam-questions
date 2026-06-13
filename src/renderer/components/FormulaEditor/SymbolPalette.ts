export interface SymbolItem {
  label: string
  latex: string
}

export interface SymbolGroup {
  name: string
  symbols: SymbolItem[]
}

export const symbolGroups: SymbolGroup[] = [
  {
    name: '基础运算',
    symbols: [
      { label: '±', latex: '\\pm' },
      { label: '×', latex: '\\times' },
      { label: '÷', latex: '\\div' },
      { label: '≠', latex: '\\neq' },
      { label: '≤', latex: '\\leq' },
      { label: '≥', latex: '\\geq' },
      { label: '≈', latex: '\\approx' },
      { label: '∝', latex: '\\propto' },
      { label: '°', latex: '^{\\circ}' }
    ]
  },
  {
    name: '分数与幂次',
    symbols: [
      { label: 'a/b', latex: '\\frac{a}{b}' },
      { label: 'xⁿ', latex: 'x^{n}' },
      { label: 'xₙ', latex: 'x_{n}' },
      { label: '√x', latex: '\\sqrt{x}' },
      { label: 'ⁿ√x', latex: '\\sqrt[n]{x}' },
      { label: '|x|', latex: '|x|' }
    ]
  },
  {
    name: '希腊字母',
    symbols: [
      { label: 'α', latex: '\\alpha' },
      { label: 'β', latex: '\\beta' },
      { label: 'γ', latex: '\\gamma' },
      { label: 'δ', latex: '\\delta' },
      { label: 'ε', latex: '\\varepsilon' },
      { label: 'θ', latex: '\\theta' },
      { label: 'λ', latex: '\\lambda' },
      { label: 'μ', latex: '\\mu' },
      { label: 'π', latex: '\\pi' },
      { label: 'σ', latex: '\\sigma' },
      { label: 'φ', latex: '\\varphi' },
      { label: 'ω', latex: '\\omega' },
      { label: 'Δ', latex: '\\Delta' },
      { label: 'Σ', latex: '\\Sigma' },
      { label: 'Ω', latex: '\\Omega' }
    ]
  },
  {
    name: '微积分',
    symbols: [
      { label: '∫', latex: '\\int' },
      { label: '∬', latex: '\\iint' },
      { label: '∫ₐᵇ', latex: '\\int_{a}^{b}' },
      { label: 'lim', latex: '\\lim_{x \\to }' },
      { label: '∞', latex: '\\infty' },
      { label: '∂', latex: '\\partial' },
      { label: '∑', latex: '\\sum' },
      { label: '∏', latex: '\\prod' },
      { label: 'dx', latex: '\\,dx' },
      { label: '∇', latex: '\\nabla' }
    ]
  },
  {
    name: '集合与逻辑',
    symbols: [
      { label: '∈', latex: '\\in' },
      { label: '∉', latex: '\\notin' },
      { label: '⊂', latex: '\\subset' },
      { label: '⊆', latex: '\\subseteq' },
      { label: '∪', latex: '\\cup' },
      { label: '∩', latex: '\\cap' },
      { label: '∅', latex: '\\emptyset' },
      { label: '∀', latex: '\\forall' },
      { label: '∃', latex: '\\exists' },
      { label: '⇒', latex: '\\Rightarrow' },
      { label: '⇔', latex: '\\Leftrightarrow' }
    ]
  },
  {
    name: '矩阵与方程',
    symbols: [
      { label: '矩阵', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
      { label: '方阵', latex: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}' },
      { label: '方程组', latex: '\\begin{cases} x + y = 1 \\\\ x - y = 0 \\end{cases}' },
      { label: '连等', latex: '\\begin{aligned} a &= b \\\\ &= c \\end{aligned}' }
    ]
  },
  {
    name: '化学',
    symbols: [
      { label: 'H₂O', latex: '\\text{H}_2\\text{O}' },
      { label: 'CO₂', latex: '\\text{CO}_2' },
      { label: '↑', latex: '\\uparrow' },
      { label: '↓', latex: '\\downarrow' },
      { label: '→', latex: '\\rightarrow' },
      { label: '⇌', latex: '\\rightleftharpoons' },
      { label: '△', latex: '\\triangle' }
    ]
  },
  {
    name: '物理',
    symbols: [
      { label: 'F⃗', latex: '\\vec{F}' },
      { label: 'v⃗', latex: '\\vec{v}' },
      { label: 'x̂', latex: '\\hat{x}' },
      { label: 'ẋ', latex: '\\dot{x}' },
      { label: 'ẍ', latex: '\\ddot{x}' },
      { label: 'θ̇', latex: '\\dot{\\theta}' },
      { label: '⟨⟩', latex: '\\langle \\rangle' }
    ]
  }
]
