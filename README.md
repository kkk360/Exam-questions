# 智能出题系统

一款面向教师的桌面端出题与组卷应用，支持题库管理、试卷组卷、LaTeX 公式渲染、PDF/Word 导出等功能。

## 功能特性

### 题库管理
- 支持四种题型：单选题、多选题、填空题、大题
- 五级难度分类：基础、简单、中等、较难、困难
- 按学科、章节、标签、关键词多维筛选
- 批量删除、导入/导出（JSON 格式）
- LaTeX 数学公式实时预览（KaTeX）

### 试卷组卷
- 自由创建试卷，配置标题、副标题、学校名称、考试时长、总分
- 分章节组织试题，自定义每题分值
- 拖拽排序试题顺序
- 试卷复制、回收站管理

### 页面配置
- 纸张大小：A4 / B5 / Letter
- 方向：纵向 / 横向
- 自定义页边距
- 可选显示答题区、分数栏、参考答案

### 导出功能
- 导出为 PDF（含 LaTeX 公式渲染）
- 导出为 Word（.docx）
- 答题卡单独导出

### 其他
- 数据本地存储，支持自定义数据目录
- 深色/浅色主题跟随系统

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Electron 33 + electron-vite |
| 前端 | React 18 + TypeScript + Ant Design 6 |
| 状态管理 | Zustand |
| 公式渲染 | KaTeX |
| Word 导出 | docx |
| 拖拽排序 | @dnd-kit |

## 开发环境要求

- **Node.js** >= 18
- **npm** >= 9

## 快速开始

```bash
# 克隆项目
git clone <仓库地址>
cd ai出题

# 安装依赖
npm install

# 启动开发模式
npm run dev
```

## 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发模式（热重载） |
| `npm run build` | 构建生产版本 |
| `npm run build:win` | 构建 Windows 安装包（NSIS） |
| `npm run build:unpack` | 构建但不打包（调试用） |
| `npm run typecheck` | TypeScript 类型检查 |
| `npm run preview` | 预览构建产物 |

## 项目结构

```
src/
├── main/                      # Electron 主进程
│   ├── index.ts               # 应用入口
│   ├── ipc/                   # IPC 通信处理
│   ├── services/              # 业务逻辑
│   │   ├── question.service.ts    # 题目 CRUD
│   │   ├── exam.service.ts        # 试卷 CRUD
│   │   ├── answer-key.service.ts  # 答题卡
│   │   ├── export-pdf.service.ts  # PDF 导出
│   │   ├── export-word.service.ts # Word 导出
│   │   └── import-export.service.ts # 数据导入导出
│   └── storage/               # 数据持久化
│       ├── store.ts               # JSON 文件读写
│       └── paths.ts               # 存储路径
├── preload/                   # 预加载脚本（桥接 IPC）
└── renderer/                  # React 渲染进程
    ├── App.tsx                # 路由与全局配置
    ├── components/            # 通用组件
    ├── features/              # 功能模块
    │   ├── exam/              # 试卷管理页面
    │   ├── questions/         # 题目管理页面
    │   └── settings/          # 设置页面
    ├── stores/                # Zustand 状态
    └── types/                 # TypeScript 类型定义
```

## 数据存储

应用数据以 JSON 文件存储在用户数据目录下：

- `questions.json` — 题库数据
- `exams.json` — 试卷数据
- `answer-keys.json` — 答题卡数据
- `config.json` — 应用配置

首次启动会自动初始化空数据文件并写入示例数据。

## 构建与分发

```bash
# 构建 Windows 安装包
npm run build:win
```

构建产物位于 `dist/` 目录，使用 NSIS 安装器，支持自定义安装路径。

## 许可证

MIT
