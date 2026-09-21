# 海梦园 · 个人主页

湖南大学金融与统计学院统计学专业 2024 级本科生的个人主页。

使用原生 HTML / CSS / JavaScript 构建，无任何构建步骤与第三方依赖，可直接托管在 GitHub Pages。

## 目录结构

```
.
├── index.html                  # 页面结构（六大板块）
├── css/
│   └── style.css               # 样式（小众清新 · 学术风）
├── js/
│   └── main.js                 # 交互脚本
└── assets/
    ├── images/                 # 相册照片、贴纸、favicon
    └── resume/                 # PDF 简历
```

## 页面板块

| 板块 | 锚点 | 内容 |
|---|---|---|
| 首屏 | `#home` | 姓名、一句话简介、简历下载、社交链接、座右铭立轴 |
| 关于我 | `#about` | 自我介绍 + 基本信息卡片 |
| 技能特长 | `#skills` | 编程与数据 / 统计与建模 / 工具与软件 |
| 竞赛经历 | `#experience` | 统计建模大赛、华数杯、极限飞盘比赛 |
| 我的相册 | `#gallery` | 三张照片 |
| 联系我 | `#contact` | Email / GitHub / 简历下载 |

## 如何替换内容

照片与简历使用**同名文件覆盖**即可，无需改动代码：

- 三张照片 → `assets/images/photo-1.jpg`、`photo-2.jpg`、`photo-3.jpg`（建议 4:3 横构图）
- PDF 简历 → `assets/resume/HaiMengyuan-Resume.pdf`

## 本地预览

```bash
python -m http.server 8000
# 然后访问 http://localhost:8000
```

## 部署

推送 `main` 分支后，在仓库 **Settings → Pages** 中将 Source 设为
`Deploy from a branch`，分支选择 `main`、目录选择 `/ (root)` 即可。
