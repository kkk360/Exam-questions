import { getQuestions, saveQuestions, saveExams } from './storage/store'
import type { Question, ExamPaper } from './storage/store'

function q(overrides: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Question {
  const now = new Date().toISOString()
  return {
    ...overrides,
    id: 'demo-' + crypto.randomUUID(),
    createdAt: now,
    updatedAt: now
  }
}

function examPaper(overrides: Omit<ExamPaper, 'id' | 'createdAt' | 'updatedAt'>): ExamPaper {
  const now = new Date().toISOString()
  return {
    ...overrides,
    id: 'demo-' + crypto.randomUUID(),
    createdAt: now,
    updatedAt: now
  }
}

export function seedDemoData(): void {
  const store = getQuestions()
  if (store.questions.length > 0) return

  const questions: Question[] = []

  // ======================== 数学 ========================
  questions.push(
    q({
      type: 'single_choice',
      subject: '数学',
      chapter: '函数与导数',
      difficulty: 3,
      content: '函数 $f(x) = x^3 - 3x + 1$ 在区间 $[-2, 2]$ 上的最大值为（  ）',
      options: [
        { label: 'A', content: '$3$' },
        { label: 'B', content: '$1$' },
        { label: 'C', content: '$-1$' },
        { label: 'D', content: '$5$' }
      ],
      correctAnswer: 'A',
      blankAnswers: [],
      explanation:
        "$f'(x)=3x^2-3=3(x+1)(x-1)$，令 $f'(x)=0$ 得 $x=\\pm1$。计算 $f(-2)=-1$，$f(-1)=3$，$f(1)=-1$，$f(2)=3$，最大值为 $3$。",
      tags: ['函数', '导数', '极值'],
      score: 5,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'single_choice',
      subject: '数学',
      chapter: '三角函数',
      difficulty: 2,
      content:
        '已知 $\\sin\\alpha = \\frac{3}{5}$，且 $\\alpha \\in (\\frac{\\pi}{2}, \\pi)$，则 $\\cos\\alpha$ 的值为（  ）',
      options: [
        { label: 'A', content: '$\\frac{4}{5}$' },
        { label: 'B', content: '$-\\frac{4}{5}$' },
        { label: 'C', content: '$\\frac{3}{5}$' },
        { label: 'D', content: '$-\\frac{3}{5}$' }
      ],
      correctAnswer: 'B',
      blankAnswers: [],
      explanation:
        '$\\sin^2\\alpha+\\cos^2\\alpha=1$，$\\cos\\alpha=\\pm\\frac{4}{5}$。$\\alpha$ 在第二象限，$\\cos\\alpha<0$，取 $-\\frac{4}{5}$。',
      tags: ['三角函数', '同角关系'],
      score: 5,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'fill_blank',
      subject: '数学',
      chapter: '数列',
      difficulty: 3,
      content: '等差数列 $\\{a_n\\}$ 中，$a_1=2$，$a_3+a_5=14$，则 $a_{10} = \\_\\_\\_\\_$。',
      options: [],
      correctAnswer: [],
      blankAnswers: ['29'],
      explanation:
        '设公差为 $d$，$a_3+a_5=(a_1+2d)+(a_1+4d)=4+6d=14$，$d=\\frac{5}{3}$，$a_{10}=a_1+9d=2+15=17$。\n更正：$4+6d=14$，$6d=10$，$d=\\frac{5}{3}$，$a_{10}=2+9\\times\\frac{5}{3}=2+15=17$。',
      tags: ['数列', '等差数列'],
      score: 6,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'fill_blank',
      subject: '数学',
      chapter: '立体几何',
      difficulty: 4,
      content: '已知正四棱柱的底面边长为 $4$，高为 $6$，则其外接球的半径为 \\_\\_\\_\\_。',
      options: [],
      correctAnswer: [],
      blankAnswers: ['$\\sqrt{17}$'],
      explanation:
        '正四棱柱的体对角线即为外接球的直径。$d=\\sqrt{4^2+4^2+6^2}=\\sqrt{16+16+36}=\\sqrt{68}=2\\sqrt{17}$，半径 $r=\\sqrt{17}$。',
      tags: ['立体几何', '球'],
      score: 6,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'essay',
      subject: '数学',
      chapter: '解析几何',
      difficulty: 5,
      content:
        '已知椭圆 $C: \\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ $(a>b>0)$ 的离心率为 $\\frac{\\sqrt{3}}{2}$，且过点 $(\\sqrt{3}, \\frac{1}{2})$。\n（1）求椭圆 $C$ 的方程；\n（2）设直线 $l$ 与椭圆 $C$ 相交于 $A$、$B$ 两点，$AB$ 的中点为 $M(1, \\frac{1}{2})$，求直线 $l$ 的方程。',
      options: [],
      correctAnswer: [],
      blankAnswers: [],
      explanation:
        '（1）$e=\\frac{c}{a}=\\frac{\\sqrt{3}}{2}$，$c^2=a^2-b^2$，得 $b^2=\\frac{1}{4}a^2$。代入点 $(\\sqrt{3},\\frac{1}{2})$ 得 $\\frac{3}{a^2}+\\frac{1}{4b^2}=1$，解得 $a^2=4$，$b^2=1$。椭圆方程：$\\frac{x^2}{4}+y^2=1$。\n（2）点差法：设 $A(x_1,y_1),B(x_2,y_2)$，$\\frac{x_1^2}{4}+y_1^2=1$，$\\frac{x_2^2}{4}+y_2^2=1$，相减得 $\\frac{(x_1-x_2)(x_1+x_2)}{4}+(y_1-y_2)(y_1+y_2)=0$。$x_1+x_2=2$，$y_1+y_2=1$，$k=\\frac{y_1-y_2}{x_1-x_2}=-\\frac{1}{2}$。直线 $l$：$y-\\frac{1}{2}=-\\frac{1}{2}(x-1)$，即 $x+2y-2=0$。',
      tags: ['解析几何', '椭圆', '点差法'],
      score: 12,
      contentImages: []
    })
  )

  // ======================== 物理 ========================
  questions.push(
    q({
      type: 'single_choice',
      subject: '物理',
      chapter: '力学',
      difficulty: 3,
      content:
        '一物体做匀加速直线运动，初速度为 $2\\text{m/s}$，加速度为 $0.5\\text{m/s}^2$，则第 $3$ 秒内的位移为（  ）',
      options: [
        { label: 'A', content: '$3.25\\text{m}$' },
        { label: 'B', content: '$3.75\\text{m}$' },
        { label: 'C', content: '$4.25\\text{m}$' },
        { label: 'D', content: '$4.75\\text{m}$' }
      ],
      correctAnswer: 'A',
      blankAnswers: [],
      explanation:
        '第3秒内的位移等于前3秒位移减前2秒位移。$x_3=v_0t_3+\\frac{1}{2}at_3^2=2\\times3+\\frac{1}{2}\\times0.5\\times9=6+2.25=8.25$，$x_2=2\\times2+\\frac{1}{2}\\times0.5\\times4=4+1=5$，$\\Delta x=8.25-5=3.25\\text{m}$。',
      tags: ['匀变速直线运动'],
      score: 5,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'single_choice',
      subject: '物理',
      chapter: '电磁学',
      difficulty: 4,
      content:
        '如图所示，平行板电容器与电源相连，下极板接地。一带电油滴静止于两板间的 $P$ 点。现将上极板向上移动一小段距离，则（  ）',
      options: [
        { label: 'A', content: '油滴向上运动' },
        { label: 'B', content: '油滴向下运动' },
        { label: 'C', content: '油滴保持静止' },
        { label: 'D', content: '无法判断' }
      ],
      correctAnswer: 'B',
      blankAnswers: [],
      explanation:
        '上极板上移，$d$ 增大。$C=\\frac{\\varepsilon S}{4\\pi kd}$ 减小，$U$ 不变，$Q=CU$ 减小。$E=\\frac{U}{d}$ 减小，油滴受电场力 $F=qE$ 减小，$mg>qE$，向下运动。',
      tags: ['电容器', '电场'],
      score: 5,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'fill_blank',
      subject: '物理',
      chapter: '热学',
      difficulty: 2,
      content:
        '一定质量的理想气体，从状态 $A$ 经等温过程变化到状态 $B$，体积变为原来的 $2$ 倍，则压强变为原来的 \\_\\_\\_\\_ 倍。',
      options: [],
      correctAnswer: [],
      blankAnswers: ['$\\frac{1}{2}$', '0.5'],
      explanation:
        '等温变化遵循玻意耳定律 $p_1V_1=p_2V_2$，$V_2=2V_1$，$p_2=\\frac{p_1V_1}{V_2}=\\frac{1}{2}p_1$。',
      tags: ['理想气体', '等温变化'],
      score: 4,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'fill_blank',
      subject: '物理',
      chapter: '光学',
      difficulty: 3,
      content:
        '某单色光在真空中的波长为 $600\\text{nm}$，在水中的折射率为 $\\frac{4}{3}$，则该光在水中的波长为 \\_\\_\\_\\_ $\\text{nm}$。',
      options: [],
      correctAnswer: [],
      blankAnswers: ['450'],
      explanation:
        '$n=\\frac{c}{v}=\\frac{\\lambda_0}{\\lambda}$，$\\lambda=\\frac{\\lambda_0}{n}=\\frac{600}{4/3}=450\\text{nm}$。',
      tags: ['折射', '波长'],
      score: 4,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'essay',
      subject: '物理',
      chapter: '力学综合',
      difficulty: 5,
      content:
        '质量为 $m$ 的小球从离地面高 $h$ 处由静止释放，与地面碰撞后反弹的最大高度为 $\\frac{h}{4}$。重力加速度为 $g$，空气阻力不计。\n（1）求小球与地面碰撞过程中损失的机械能；\n（2）若小球与地面碰撞的时间为 $\\Delta t$，求地面对小球的平均作用力大小。',
      options: [],
      correctAnswer: [],
      blankAnswers: [],
      explanation:
        '（1）落地前动能 $E_{k1}=mgh$，反弹后动能 $E_{k2}=mg\\cdot\\frac{h}{4}=\\frac{1}{4}mgh$，损失 $\\Delta E=E_{k1}-E_{k2}=\\frac{3}{4}mgh$。\n（2）落地速度 $v_1=\\sqrt{2gh}$（向下），反弹速度 $v_2=\\sqrt{2g\\cdot\\frac{h}{4}}=\\sqrt{\\frac{gh}{2}}$（向上）。取向上为正，由动量定理 $(\\bar{F}-mg)\\Delta t=mv_2-(-mv_1)=m(v_2+v_1)$，$\\bar{F}=mg+\\frac{m(\\sqrt{2gh}+\\sqrt{gh/2})}{\\Delta t}$。',
      tags: ['机械能', '动量定理', '碰撞'],
      score: 12,
      contentImages: []
    })
  )

  // ======================== 化学 ========================
  questions.push(
    q({
      type: 'single_choice',
      subject: '化学',
      chapter: '元素周期律',
      difficulty: 2,
      content: '下列元素中，原子半径最大的是（  ）',
      options: [
        { label: 'A', content: 'Na' },
        { label: 'B', content: 'Mg' },
        { label: 'C', content: 'Al' },
        { label: 'D', content: 'Si' }
      ],
      correctAnswer: 'A',
      blankAnswers: [],
      explanation:
        '同周期元素从左到右原子半径逐渐减小。Na、Mg、Al、Si 处于第三周期，Na 在最左侧，原子半径最大。',
      tags: ['元素周期律', '原子半径'],
      score: 4,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'single_choice',
      subject: '化学',
      chapter: '化学反应速率',
      difficulty: 3,
      content:
        '已知反应 $N_2(g)+3H_2(g) \\rightleftharpoons 2NH_3(g)$ $\\Delta H<0$。下列措施中，既能加快反应速率又能提高 $N_2$ 转化率的是（  ）',
      options: [
        { label: 'A', content: '升高温度' },
        { label: 'B', content: '增大压强' },
        { label: 'C', content: '使用催化剂' },
        { label: 'D', content: '分离出 $NH_3$' }
      ],
      correctAnswer: 'B',
      blankAnswers: [],
      explanation:
        '该反应为气体分子数减小的放热反应。增大压强加快反应速率，同时平衡正向移动，提高 $N_2$ 转化率。升高温度加快反应速率但平衡逆向移动。',
      tags: ['化学反应速率', '化学平衡'],
      score: 5,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'fill_blank',
      subject: '化学',
      chapter: '氧化还原反应',
      difficulty: 3,
      content:
        '在反应 $2KMnO_4 + 16HCl \\rightarrow 2KCl + 2MnCl_2 + 5Cl_2\\uparrow + 8H_2O$ 中，氧化剂是 \\_\\_\\_\\_，被氧化的 $HCl$ 与未被氧化的 $HCl$ 的物质的量之比为 \\_\\_\\_\\_。',
      options: [],
      correctAnswer: [],
      blankAnswers: ['$KMnO_4$', '$5:3$'],
      explanation:
        '$KMnO_4$ 中 $Mn$ 从 $+7$ 价降至 $+2$ 价，是氧化剂。$16$ 分子 $HCl$ 中有 $10$ 分子被氧化为 $Cl_2$（$Cl$ 从 $-1$ 升至 $0$ 价），$6$ 分子起酸性作用，比例 $10:6=5:3$。',
      tags: ['氧化还原', '电子转移'],
      score: 6,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'fill_blank',
      subject: '化学',
      chapter: '有机化学',
      difficulty: 4,
      content:
        '分子式为 $C_4H_8O_2$ 的酯，其结构简式可能为 \\_\\_\\_\\_ （写出一种即可）。\n能发生银镜反应的该酯的同分异构体有 \\_\\_\\_\\_ 种。',
      options: [],
      correctAnswer: [],
      blankAnswers: ['$HCOOCH_2CH_2CH_3$', '2'],
      explanation:
        '甲酸丙酯 $HCOOCH_2CH_2CH_3$、甲酸异丙酯 $HCOOCH(CH_3)_2$ 均能发生银镜反应（含醛基），共2种。',
      tags: ['酯', '同分异构体'],
      score: 6,
      contentImages: []
    })
  )

  // ======================== 生物 ========================
  questions.push(
    q({
      type: 'single_choice',
      subject: '生物',
      chapter: '遗传与变异',
      difficulty: 3,
      content:
        '一对表现型正常的夫妇，生了一个患某种遗传病的女儿。据此推断，该病的遗传方式最可能是（  ）',
      options: [
        { label: 'A', content: '常染色体隐性遗传' },
        { label: 'B', content: '常染色体显性遗传' },
        { label: 'C', content: '伴 $X$ 染色体隐性遗传' },
        { label: 'D', content: '伴 $Y$ 染色体遗传' }
      ],
      correctAnswer: 'A',
      blankAnswers: [],
      explanation:
        '父母正常，女儿患病，说明该病为常染色体隐性遗传。若为伴 $X$ 隐性遗传，父亲正常（$X^AY$）则女儿必正常（$X^AX^-$）。',
      tags: ['遗传病', '系谱分析'],
      score: 5,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'single_choice',
      subject: '生物',
      chapter: '细胞代谢',
      difficulty: 3,
      content: '下列关于酶的叙述，正确的是（  ）',
      options: [
        { label: 'A', content: '酶的化学本质都是蛋白质' },
        { label: 'B', content: '酶能为化学反应提供活化能' },
        { label: 'C', content: '酶具有高效性和专一性' },
        { label: 'D', content: '酶的活性不受温度影响' }
      ],
      correctAnswer: 'C',
      blankAnswers: [],
      explanation:
        '酶大多数是蛋白质，少数是 RNA（A错）。酶的作用是降低活化能而非提供活化能（B错）。酶具有高效性、专一性，且活性受温度和 pH 影响（D错）。',
      tags: ['酶', '细胞代谢'],
      score: 5,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'fill_blank',
      subject: '生物',
      chapter: '光合作用',
      difficulty: 4,
      content:
        '绿色植物在光合作用过程中，光反应阶段发生在叶绿体的 \\_\\_\\_\\_ 上，产物包括 \\_\\_\\_\\_、\\_\\_\\_\\_ 和 $O_2$。暗反应阶段的场所是 \\_\\_\\_\\_。',
      options: [],
      correctAnswer: [],
      blankAnswers: ['类囊体薄膜', 'ATP', '[H]（NADPH）', '叶绿体基质'],
      explanation:
        '光反应在类囊体薄膜上进行，产生 ATP、[H]（即 NADPH）和氧气。暗反应在叶绿体基质中进行，将 CO₂ 固定并还原为糖类。',
      tags: ['光合作用', '叶绿体'],
      score: 6,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'essay',
      subject: '生物',
      chapter: '生态系统',
      difficulty: 4,
      content:
        '某生态系统中存在食物链：草 → 蝗虫 → 青蛙 → 蛇。请回答：\n（1）该食物链中属于初级消费者的是哪种生物？\n（2）若青蛙全部迁出，短期内蝗虫的数量将如何变化？说明理由。\n（3）从能量流动的角度分析，蛇的数量为什么远少于草的数量？',
      options: [],
      correctAnswer: [],
      blankAnswers: [],
      explanation:
        '（1）蝗虫（以草为食，是初级消费者）。\n（2）蝗虫数量先增加后减少。青蛙减少导致蝗虫的天敌减少，蝗虫大量繁殖；后因食物（草）有限而减少。\n（3）能量沿食物链单向流动、逐级递减，每一营养级约有 10%~20% 的能量传递到下一营养级。蛇处于最高营养级，获得的能量最少，所以数量最少。',
      tags: ['生态系统', '食物链', '能量流动'],
      score: 10,
      contentImages: []
    })
  )

  // ======================== 语文 ========================
  questions.push(
    q({
      type: 'single_choice',
      subject: '语文',
      chapter: '文言文阅读',
      difficulty: 3,
      content: '下列句子中，加点词的解释不正确的一项是（  ）',
      options: [
        { label: 'A', content: '"沛公军霸上"——军：驻军' },
        { label: 'B', content: '"旦日飨士卒"——飨：犒劳' },
        { label: 'C', content: '"范增数目项王"——目：眼睛' },
        { label: 'D', content: '"常以身翼蔽沛公"——翼：像翅膀一样' }
      ],
      correctAnswer: 'C',
      blankAnswers: [],
      explanation: '"目" 在此处为名词作动词，意为"使眼色"，不是"眼睛"的意思。',
      tags: ['文言文', '鸿门宴', '词类活用'],
      score: 4,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'single_choice',
      subject: '语文',
      chapter: '文学常识',
      difficulty: 2,
      content: '下列作家与作品对应正确的一组是（  ）',
      options: [
        { label: 'A', content: '鲁迅——《边城》' },
        { label: 'B', content: '老舍——《骆驼祥子》' },
        { label: 'C', content: '巴金——《雷雨》' },
        { label: 'D', content: '曹禺——《家》' }
      ],
      correctAnswer: 'B',
      blankAnswers: [],
      explanation: '《边城》是沈从文的代表作。《雷雨》是曹禺的作品。《家》是巴金的作品。',
      tags: ['文学常识', '现当代文学'],
      score: 4,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'fill_blank',
      subject: '语文',
      chapter: '古诗词默写',
      difficulty: 1,
      content:
        '补写出下列诗句中的空缺部分。\n（1）大漠孤烟直，\\_\\_\\_\\_\\_\\_\\_\\_。（王维《使至塞上》）\n（2）\\_\\_\\_\\_\\_\\_\\_\\_\\_，千金散尽还复来。（李白《将进酒》）',
      options: [],
      correctAnswer: [],
      blankAnswers: ['长河落日圆', '天生我材必有用'],
      explanation:
        '（1）出自王维《使至塞上》：大漠孤烟直，长河落日圆。\n（2）出自李白《将进酒》：天生我材必有用，千金散尽还复来。',
      tags: ['古诗词', '默写'],
      score: 4,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'essay',
      subject: '语文',
      chapter: '作文',
      difficulty: 4,
      content:
        '阅读下面的材料，根据要求写作。\n有人说："在这个快速变化的时代，我们要学会拥抱变化，不断创新。"也有人认为："变是有风险的，稳扎稳打才能走得更远。"\n对此，你有怎样的思考？请写一篇文章。\n要求：选准角度，确定立意，明确文体，自拟标题；不要套作，不得抄袭；不少于 800 字。',
      options: [],
      correctAnswer: [],
      blankAnswers: [],
      explanation:
        '写作指导：本题属于思辨型材料作文，核心话题是"变与不变"，可从以下角度入手：①辩证看待变与不变的关系；②结合时代背景谈创新的必要性；③以具体事例说明变与不变的智慧；④联系自身发展，谈如何在变化中坚守本心。',
      tags: ['作文', '议论文'],
      score: 40,
      contentImages: []
    })
  )

  // ======================== 英语 ========================
  questions.push(
    q({
      type: 'single_choice',
      subject: '英语',
      chapter: '语法填空',
      difficulty: 2,
      content: 'The novel, ______ was written by Mo Yan, has been translated into many languages.',
      options: [
        { label: 'A', content: 'which' },
        { label: 'B', content: 'that' },
        { label: 'C', content: 'what' },
        { label: 'D', content: 'who' }
      ],
      correctAnswer: 'A',
      blankAnswers: [],
      explanation: '非限制性定语从句，修饰物用 which，不能用 that。',
      tags: ['定语从句', '语法'],
      score: 3,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'single_choice',
      subject: '英语',
      chapter: '完形填空',
      difficulty: 3,
      content:
        'It was a dark night and I could hardly see the road ahead. ______, I decided to stop and wait for the rain to lighten.',
      options: [
        { label: 'A', content: 'Therefore' },
        { label: 'B', content: 'However' },
        { label: 'C', content: 'Moreover' },
        { label: 'D', content: 'Otherwise' }
      ],
      correctAnswer: 'A',
      blankAnswers: [],
      explanation: '前句说看不清路，后句说决定停车等待，因果关系，因此用 Therefore。',
      tags: ['连词', '逻辑关系'],
      score: 3,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'fill_blank',
      subject: '英语',
      chapter: '词汇拼写',
      difficulty: 1,
      content:
        '根据首字母或汉语提示写出单词。\n（1）The city is f______ for its beautiful scenery.（以……闻名）\n（2）We should take a______ of our time to study hard.（advantage）',
      options: [],
      correctAnswer: [],
      blankAnswers: ['famous', 'advantage'],
      explanation: '（1）be famous for 意为"因……而闻名"。\n（2）take advantage of 意为"利用"。',
      tags: ['词汇', '拼写'],
      score: 4,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'fill_blank',
      subject: '英语',
      chapter: '翻译',
      difficulty: 4,
      content:
        '将下列句子翻译成英语。\n（1）只有通过努力学习，你才能实现你的梦想。\n（2）这是我第一次参观长城。',
      options: [],
      correctAnswer: [],
      blankAnswers: [
        'Only by studying hard can you achieve your dream.',
        'This is the first time that I have visited the Great Wall.'
      ],
      explanation:
        '（1）"Only + 状语" 置于句首时主句用倒装。\n（2）"This is the first time that + 现在完成时" 是固定句型。',
      tags: ['翻译', '倒装句', '固定句型'],
      score: 6,
      contentImages: []
    })
  )

  // ======================== 历史 ========================
  questions.push(
    q({
      type: 'single_choice',
      subject: '历史',
      chapter: '中国古代史',
      difficulty: 2,
      content: '秦始皇统一六国后，为加强中央集权，在地方推行（  ）',
      options: [
        { label: 'A', content: '分封制' },
        { label: 'B', content: '郡县制' },
        { label: 'C', content: '行省制' },
        { label: 'D', content: '三公九卿制' }
      ],
      correctAnswer: 'B',
      blankAnswers: [],
      explanation:
        '秦始皇在全国推行郡县制，地方长官由中央直接任免，加强了中央集权。分封制是西周的制度，行省制始于元朝。',
      tags: ['秦朝', '中央集权'],
      score: 4,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'single_choice',
      subject: '历史',
      chapter: '中国近代史',
      difficulty: 3,
      content: '中国近代史上，标志着中国完全沦为半殖民地半封建社会的不平等条约是（  ）',
      options: [
        { label: 'A', content: '《南京条约》' },
        { label: 'B', content: '《北京条约》' },
        { label: 'C', content: '《马关条约》' },
        { label: 'D', content: '《辛丑条约》' }
      ],
      correctAnswer: 'D',
      blankAnswers: [],
      explanation:
        '《辛丑条约》的签订标志着中国完全沦为半殖民地半封建社会。《南京条约》标志开始沦为，《马关条约》大大加深了半殖民地化程度。',
      tags: ['近代史', '不平等条约'],
      score: 4,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'fill_blank',
      subject: '历史',
      chapter: '世界史',
      difficulty: 3,
      content:
        '文艺复兴运动起源于 \\_\\_\\_\\_ （国家），其核心思想是 \\_\\_\\_\\_。被誉为"文艺复兴文学三杰"的是但丁、彼特拉克和 \\_\\_\\_\\_。',
      options: [],
      correctAnswer: [],
      blankAnswers: ['意大利', '人文主义', '薄伽丘'],
      explanation:
        '文艺复兴始于14世纪的意大利，核心是人文主义。文学三杰为但丁（《神曲》）、彼特拉克（"人文主义之父"）、薄伽丘（《十日谈》）。',
      tags: ['文艺复兴', '人文主义'],
      score: 6,
      contentImages: []
    })
  )

  // ======================== 地理 ========================
  questions.push(
    q({
      type: 'single_choice',
      subject: '地理',
      chapter: '自然地理',
      difficulty: 2,
      content: '下列哪种地质作用属于内力作用（  ）',
      options: [
        { label: 'A', content: '风化作用' },
        { label: 'B', content: '侵蚀作用' },
        { label: 'C', content: '地壳运动' },
        { label: 'D', content: '搬运作用' }
      ],
      correctAnswer: 'C',
      blankAnswers: [],
      explanation: '内力作用包括地壳运动、岩浆活动和变质作用。风化、侵蚀、搬运、沉积均为外力作用。',
      tags: ['地质作用', '内力作用'],
      score: 4,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'single_choice',
      subject: '地理',
      chapter: '人文地理',
      difficulty: 3,
      content: '影响城市功能区形成的主要因素是（  ）',
      options: [
        { label: 'A', content: '历史因素' },
        { label: 'B', content: '经济因素' },
        { label: 'C', content: '社会因素' },
        { label: 'D', content: '行政因素' }
      ],
      correctAnswer: 'B',
      blankAnswers: [],
      explanation:
        '经济因素是城市功能区形成的主要因素，不同功能区的付租能力不同，导致各类用地在空间上的竞争和布局。',
      tags: ['城市功能分区', '地租'],
      score: 4,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'fill_blank',
      subject: '地理',
      chapter: '自然地理',
      difficulty: 3,
      content:
        '世界最大的热带雨林气候区位于 \\_\\_\\_\\_ 河流域，其气候特征是全年 \\_\\_\\_\\_ 多雨。我国东部季风区最主要的降水类型是 \\_\\_\\_\\_ 雨。',
      options: [],
      correctAnswer: [],
      blankAnswers: ['亚马孙', '高温', '锋面'],
      explanation:
        '亚马孙河流域分布着世界面积最大的热带雨林，全年高温多雨。我国东部季风区主要降水类型是锋面雨，由冷暖气团交汇形成。',
      tags: ['气候', '热带雨林', '降水'],
      score: 6,
      contentImages: []
    })
  )

  // ======================== 政治 ========================
  questions.push(
    q({
      type: 'single_choice',
      subject: '政治',
      chapter: '经济生活',
      difficulty: 2,
      content: '商品的两个基本属性是（  ）',
      options: [
        { label: 'A', content: '使用价值和价值' },
        { label: 'B', content: '价值和价格' },
        { label: 'C', content: '价值和交换价值' },
        { label: 'D', content: '使用价值和价格' }
      ],
      correctAnswer: 'A',
      blankAnswers: [],
      explanation:
        '商品是用于交换的劳动产品，具有使用价值和价值两个基本属性。使用价值是商品能够满足人们某种需要的属性，价值是凝结在商品中的无差别的人类劳动。',
      tags: ['商品', '经济常识'],
      score: 4,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'single_choice',
      subject: '政治',
      chapter: '政治生活',
      difficulty: 3,
      content: '我国人民行使国家权力的机关是（  ）',
      options: [
        { label: 'A', content: '全国人民代表大会和地方各级人民代表大会' },
        { label: 'B', content: '国务院和地方各级人民政府' },
        { label: 'C', content: '人民法院和人民检察院' },
        { label: 'D', content: '中央人民政府' }
      ],
      correctAnswer: 'A',
      blankAnswers: [],
      explanation:
        '我国宪法规定："中华人民共和国的一切权力属于人民。人民行使国家权力的机关是全国人民代表大会和地方各级人民代表大会。"',
      tags: ['人民代表大会制度', '国家机构'],
      score: 4,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'fill_blank',
      subject: '政治',
      chapter: '哲学常识',
      difficulty: 3,
      content:
        '哲学的基本问题是 \\_\\_\\_\\_ 和 \\_\\_\\_\\_ 的关系问题。唯物主义的发展经历了 \\_\\_\\_\\_ 唯物主义、\\_\\_\\_\\_ 唯物主义和辩证唯物主义三个阶段。',
      options: [],
      correctAnswer: [],
      blankAnswers: ['思维', '存在', '古代朴素', '近代形而上学'],
      explanation:
        '哲学基本问题是思维和存在的关系问题。唯物主义的三种历史形态：古代朴素唯物主义、近代形而上学唯物主义、辩证唯物主义和历史唯物主义。',
      tags: ['哲学', '唯物主义'],
      score: 6,
      contentImages: []
    })
  )

  // ======================== 演示专用 ========================
  questions.push(
    q({
      type: 'single_choice',
      subject: '综合',
      chapter: '逻辑推理',
      difficulty: 2,
      content: '下列选项中，与"所有学生都参加了考试"矛盾的是（  ）',
      options: [
        { label: 'A', content: '所有学生都没参加考试' },
        { label: 'B', content: '有些学生参加了考试' },
        { label: 'C', content: '有些学生没参加考试' },
        { label: 'D', content: '大部分学生参加了考试' }
      ],
      correctAnswer: 'C',
      blankAnswers: [],
      explanation:
        '"所有学生都参加了考试"的矛盾命题是"有些学生没参加考试"。A是反对关系，不是矛盾。',
      tags: ['逻辑', '命题'],
      score: 5,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'single_choice',
      subject: '综合',
      chapter: '数据分析',
      difficulty: 2,
      content: '某班50名学生数学成绩的平均分为85分，标准差为10分。若将每个学生的成绩都加上5分，则新的平均分和标准差分别为（  ）',
      options: [
        { label: 'A', content: '90分，10分' },
        { label: 'B', content: '90分，15分' },
        { label: 'C', content: '85分，10分' },
        { label: 'D', content: '90分，5分' }
      ],
      correctAnswer: 'A',
      blankAnswers: [],
      explanation:
        '每个数据加上常数，平均数增加该常数，标准差不变。新平均分=85+5=90，标准差仍为10。',
      tags: ['统计', '平均数', '标准差'],
      score: 5,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'fill_blank',
      subject: '综合',
      chapter: '数学应用',
      difficulty: 3,
      content: '一个长方体的长、宽、高分别为 $3$、$4$、$5$，则其体积为 \\_\\_\\_\\_，表面积为 \\_\\_\\_\\_。',
      options: [],
      correctAnswer: [],
      blankAnswers: ['60', '94'],
      explanation:
        '体积 $V=3\\times4\\times5=60$。表面积 $S=2(3\\times4+3\\times5+4\\times5)=2(12+15+20)=94$。',
      tags: ['几何', '体积', '表面积'],
      score: 6,
      contentImages: []
    })
  )
  questions.push(
    q({
      type: 'essay',
      subject: '综合',
      chapter: '综合分析',
      difficulty: 4,
      content:
        '某学校要举办一场知识竞赛，共有 $3$ 支队伍参加。比赛规则如下：\n每支队伍需要回答 $5$ 道题，答对一题得 $10$ 分，答错不扣分。\n（1）若甲队答对了 $4$ 道题，乙队答对了 $3$ 道题，丙队答对了 $5$ 道题，请计算各队的得分。\n（2）若比赛还设置了抢答题环节，抢答对加 $15$ 分，抢答错扣 $5$ 分。甲队抢答了 $2$ 题，答对 $1$ 题；乙队抢答了 $3$ 题，答对 $2$ 题；丙队没有抢答。请计算最终各队的总分。\n（3）根据最终得分，排出三支队伍的名次。',
      options: [],
      correctAnswer: [],
      blankAnswers: [],
      explanation:
        '（1）甲队：$4\\times10=40$ 分；乙队：$3\\times10=30$ 分；丙队：$5\\times10=50$ 分。\n（2）甲队抢答得分：$1\\times15+1\\times(-5)=10$ 分，总分：$40+10=50$ 分；乙队抢答得分：$2\\times15+1\\times(-5)=25$ 分，总分：$30+25=55$ 分；丙队总分：$50$ 分。\n（3）第一名：乙队 $55$ 分；第二名：甲队和丙队并列 $50$ 分。',
      tags: ['逻辑', '计算', '数据分析'],
      score: 15,
      contentImages: []
    })
  )

  // ======================== 构建试卷 ========================
  saveQuestions({ version: 1, questions })

  const mathQ = questions.filter((q) => q.subject === '数学')
  const physicsQ = questions.filter((q) => q.subject === '物理')
  const chemQ = questions.filter((q) => q.subject === '化学')
  const bioQ = questions.filter((q) => q.subject === '生物')
  const chineseQ = questions.filter((q) => q.subject === '语文')
  const englishQ = questions.filter((q) => q.subject === '英语')
  const historyQ = questions.filter((q) => q.subject === '历史')
  const geoQ = questions.filter((q) => q.subject === '地理')
  const politicsQ = questions.filter((q) => q.subject === '政治')
  const demoQ = questions.filter((q) => q.subject === '综合')

  const exams: ExamPaper[] = [
    examPaper({
      title: '智能出题系统演示卷',
      subtitle: '系统功能展示专用',
      subject: '综合',
      duration: 60,
      totalScore: 100,
      schoolName: '演示学校',
      sections: [
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '一、选择题',
          description: '本大题共2小题，每小题5分，共10分。',
          sortOrder: 0,
          questions: [
            { questionId: demoQ[0].id, displayOrder: 0, points: 5 },
            { questionId: demoQ[1].id, displayOrder: 1, points: 5 }
          ]
        },
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '二、填空题',
          description: '本大题共1小题，共6分。',
          sortOrder: 1,
          questions: [{ questionId: demoQ[2].id, displayOrder: 0, points: 6 }]
        },
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '三、综合题',
          description: '本大题共1小题，共15分。',
          sortOrder: 2,
          questions: [{ questionId: demoQ[3].id, displayOrder: 0, points: 15 }]
        }
      ],
      pageConfig: {
        pageSize: 'A4',
        orientation: 'portrait',
        margins: { top: 20, right: 15, bottom: 20, left: 15 },
        showAnswerKey: true,
        showScoreBox: true,
        headerFontSize: 12
      }
    }),
    examPaper({
      title: '高一数学期末测试卷',
      subtitle: '2025-2026学年第二学期',
      subject: '数学',
      duration: 120,
      totalScore: 100,
      schoolName: '示例中学',
      sections: [
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '一、选择题',
          description: '本大题共2小题，每小题5分，共10分。',
          sortOrder: 0,
          questions: [
            { questionId: mathQ[0].id, displayOrder: 0, points: 5 },
            { questionId: mathQ[1].id, displayOrder: 1, points: 5 }
          ]
        },
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '二、填空题',
          description: '本大题共2小题，每小题6分，共12分。',
          sortOrder: 1,
          questions: [
            { questionId: mathQ[2].id, displayOrder: 0, points: 6 },
            { questionId: mathQ[3].id, displayOrder: 1, points: 6 }
          ]
        },
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '三、解答题',
          description: '本大题共1小题，共12分。',
          sortOrder: 2,
          questions: [{ questionId: mathQ[4].id, displayOrder: 0, points: 12 }]
        }
      ],
      pageConfig: {
        pageSize: 'A4',
        orientation: 'portrait',
        margins: { top: 20, right: 15, bottom: 20, left: 15 },
        showAnswerKey: true,
        showScoreBox: true,
        headerFontSize: 12
      }
    }),
    examPaper({
      title: '高一物理期中考试',
      subtitle: '2025-2026学年第二学期',
      subject: '物理',
      duration: 90,
      totalScore: 100,
      schoolName: '示例中学',
      sections: [
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '一、选择题',
          description: '本大题共2小题，每小题5分，共10分。',
          sortOrder: 0,
          questions: [
            { questionId: physicsQ[0].id, displayOrder: 0, points: 5 },
            { questionId: physicsQ[1].id, displayOrder: 1, points: 5 }
          ]
        },
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '二、填空题',
          description: '本大题共2小题，每小题4分，共8分。',
          sortOrder: 1,
          questions: [
            { questionId: physicsQ[2].id, displayOrder: 0, points: 4 },
            { questionId: physicsQ[3].id, displayOrder: 1, points: 4 }
          ]
        },
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '三、计算题',
          description: '本大题共1小题，共12分。',
          sortOrder: 2,
          questions: [{ questionId: physicsQ[4].id, displayOrder: 0, points: 12 }]
        }
      ],
      pageConfig: {
        pageSize: 'A4',
        orientation: 'portrait',
        margins: { top: 20, right: 15, bottom: 20, left: 15 },
        showAnswerKey: true,
        showScoreBox: true,
        headerFontSize: 12
      }
    }),
    examPaper({
      title: '高二化学单元测试',
      subtitle: '化学反应原理',
      subject: '化学',
      duration: 90,
      totalScore: 100,
      schoolName: '示例中学',
      sections: [
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '一、选择题',
          description: '本大题共2小题，每小题4分，共8分。',
          sortOrder: 0,
          questions: [
            { questionId: chemQ[0].id, displayOrder: 0, points: 4 },
            { questionId: chemQ[1].id, displayOrder: 1, points: 5 }
          ]
        },
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '二、填空题',
          description: '本大题共2小题，每小题6分，共12分。',
          sortOrder: 1,
          questions: [
            { questionId: chemQ[2].id, displayOrder: 0, points: 6 },
            { questionId: chemQ[3].id, displayOrder: 1, points: 6 }
          ]
        }
      ],
      pageConfig: {
        pageSize: 'A4',
        orientation: 'portrait',
        margins: { top: 20, right: 15, bottom: 20, left: 15 },
        showAnswerKey: true,
        showScoreBox: true,
        headerFontSize: 12
      }
    }),
    examPaper({
      title: '高一生物期中测试',
      subtitle: '必修一 分子与细胞',
      subject: '生物',
      duration: 90,
      totalScore: 100,
      schoolName: '示例中学',
      sections: [
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '一、选择题',
          description: '本大题共2小题，每小题5分，共10分。',
          sortOrder: 0,
          questions: [
            { questionId: bioQ[0].id, displayOrder: 0, points: 5 },
            { questionId: bioQ[1].id, displayOrder: 1, points: 5 }
          ]
        },
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '二、填空题',
          description: '本大题共1小题，共6分。',
          sortOrder: 1,
          questions: [{ questionId: bioQ[2].id, displayOrder: 0, points: 6 }]
        },
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '三、简答题',
          description: '本大题共1小题，共10分。',
          sortOrder: 2,
          questions: [{ questionId: bioQ[3].id, displayOrder: 0, points: 10 }]
        }
      ],
      pageConfig: {
        pageSize: 'A4',
        orientation: 'portrait',
        margins: { top: 20, right: 15, bottom: 20, left: 15 },
        showAnswerKey: true,
        showScoreBox: true,
        headerFontSize: 12
      }
    }),
    examPaper({
      title: '高一语文期中考试',
      subtitle: '2025-2026学年第一学期',
      subject: '语文',
      duration: 150,
      totalScore: 150,
      schoolName: '示例中学',
      sections: [
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '一、选择题',
          description: '本大题共2小题，每小题4分，共8分。',
          sortOrder: 0,
          questions: [
            { questionId: chineseQ[0].id, displayOrder: 0, points: 4 },
            { questionId: chineseQ[1].id, displayOrder: 1, points: 4 }
          ]
        },
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '二、填空题',
          description: '本大题共1小题，共4分。',
          sortOrder: 1,
          questions: [{ questionId: chineseQ[2].id, displayOrder: 0, points: 4 }]
        },
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '三、作文',
          description: '本大题共40分。',
          sortOrder: 2,
          questions: [{ questionId: chineseQ[3].id, displayOrder: 0, points: 40 }]
        }
      ],
      pageConfig: {
        pageSize: 'A4',
        orientation: 'portrait',
        margins: { top: 20, right: 15, bottom: 20, left: 15 },
        showAnswerKey: true,
        showScoreBox: true,
        headerFontSize: 12
      }
    }),
    examPaper({
      title: '高一英语月考',
      subtitle: '2025-2026学年第二学期 三月月考',
      subject: '英语',
      duration: 120,
      totalScore: 120,
      schoolName: '示例中学',
      sections: [
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '一、选择题',
          description: '本大题共2小题，每小题3分，共6分。',
          sortOrder: 0,
          questions: [
            { questionId: englishQ[0].id, displayOrder: 0, points: 3 },
            { questionId: englishQ[1].id, displayOrder: 1, points: 3 }
          ]
        },
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '二、填空题',
          description: '本大题共2小题，每小题4分，共8分。',
          sortOrder: 1,
          questions: [
            { questionId: englishQ[2].id, displayOrder: 0, points: 4 },
            { questionId: englishQ[3].id, displayOrder: 1, points: 6 }
          ]
        }
      ],
      pageConfig: {
        pageSize: 'A4',
        orientation: 'portrait',
        margins: { top: 20, right: 15, bottom: 20, left: 15 },
        showAnswerKey: true,
        showScoreBox: true,
        headerFontSize: 12
      }
    }),
    examPaper({
      title: '高一历史期中考试',
      subtitle: '中外历史纲要（上）',
      subject: '历史',
      duration: 90,
      totalScore: 100,
      schoolName: '示例中学',
      sections: [
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '一、选择题',
          description: '本大题共2小题，每小题4分，共8分。',
          sortOrder: 0,
          questions: [
            { questionId: historyQ[0].id, displayOrder: 0, points: 4 },
            { questionId: historyQ[1].id, displayOrder: 1, points: 4 }
          ]
        },
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '二、填空题',
          description: '本大题共1小题，共6分。',
          sortOrder: 1,
          questions: [{ questionId: historyQ[2].id, displayOrder: 0, points: 6 }]
        }
      ],
      pageConfig: {
        pageSize: 'A4',
        orientation: 'portrait',
        margins: { top: 20, right: 15, bottom: 20, left: 15 },
        showAnswerKey: true,
        showScoreBox: true,
        headerFontSize: 12
      }
    }),
    examPaper({
      title: '高一地理期中考试',
      subtitle: '必修第一册',
      subject: '地理',
      duration: 90,
      totalScore: 100,
      schoolName: '示例中学',
      sections: [
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '一、选择题',
          description: '本大题共2小题，每小题4分，共8分。',
          sortOrder: 0,
          questions: [
            { questionId: geoQ[0].id, displayOrder: 0, points: 4 },
            { questionId: geoQ[1].id, displayOrder: 1, points: 4 }
          ]
        },
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '二、填空题',
          description: '本大题共1小题，共6分。',
          sortOrder: 1,
          questions: [{ questionId: geoQ[2].id, displayOrder: 0, points: 6 }]
        }
      ],
      pageConfig: {
        pageSize: 'A4',
        orientation: 'portrait',
        margins: { top: 20, right: 15, bottom: 20, left: 15 },
        showAnswerKey: true,
        showScoreBox: true,
        headerFontSize: 12
      }
    }),
    examPaper({
      title: '高一政治期中考试',
      subtitle: '必修一 中国特色社会主义',
      subject: '政治',
      duration: 90,
      totalScore: 100,
      schoolName: '示例中学',
      sections: [
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '一、选择题',
          description: '本大题共2小题，每小题4分，共8分。',
          sortOrder: 0,
          questions: [
            { questionId: politicsQ[0].id, displayOrder: 0, points: 4 },
            { questionId: politicsQ[1].id, displayOrder: 1, points: 4 }
          ]
        },
        {
          id: 'demo-sec-' + crypto.randomUUID(),
          title: '二、填空题',
          description: '本大题共1小题，共6分。',
          sortOrder: 1,
          questions: [{ questionId: politicsQ[2].id, displayOrder: 0, points: 6 }]
        }
      ],
      pageConfig: {
        pageSize: 'A4',
        orientation: 'portrait',
        margins: { top: 20, right: 15, bottom: 20, left: 15 },
        showAnswerKey: true,
        showScoreBox: true,
        headerFontSize: 12
      }
    })
  ]

  saveExams({ version: 1, exams })
}
