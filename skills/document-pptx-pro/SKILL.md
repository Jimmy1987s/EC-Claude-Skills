# document-pptx-pro

## 概述

document-pptx 的進階版本，具備自動視覺內容生成功能。使用 **Kie.ai** 為所有需要視覺的投影片生成資訊圖表。

**主要功能：**
- **自動分析內容**：判斷投影片內容需要什麼類型的視覺元素
- **AI 資訊圖表**：使用 Kie.ai 生成統計、流程、比較、時間軸、公司介紹等資訊圖表
- **智慧決策**：自動判斷哪些投影片需要視覺元素

## 何時使用此技能

- 需要製作包含視覺元素的專業簡報
- 投影片內容包含統計數據、流程說明、比較對照等
- 希望自動生成資訊圖表而非手動設計

## 必要 API 金鑰

```bash
# Kie.ai API 金鑰
export KIE_AI_API_KEY="your-kie-ai-key"
```

## 模組架構

```
document-pptx-pro/
├── SKILL.md                    # 本文件
├── index.js                    # 主要入口
├── modules/
│   ├── content-analyzer.js     # 內容分析器
│   ├── visual-decider.js       # 視覺決策器
│   ├── kie-ai.js              # Kie.ai API 整合
│   └── image-integrator.js    # 圖片整合器
├── prompts/
│   └── infographic-templates.js # 資訊圖表 Prompt 模板
└── test/
    ├── test-analyzer.js        # 內容分析器測試
    └── test-decider.js         # 視覺決策器測試
```

## 使用流程

### 1. 內容分析

```javascript
const { analyzeSlide } = require('./modules/content-analyzer');

const analysis = analyzeSlide({
  title: '針扎傷害減少 87%',
  content: '透過使用 Sharpsmart 容器，醫院可降低...',
  index: 0
});

// 分析結果
// {
//   contentType: 'statistics',
//   visualNeed: 'infographic',
//   infographicType: 'statistics',
//   keyElements: { number: '87%', trend: 'decrease', subject: '針扎' }
// }
```

### 2. 視覺決策

```javascript
const { decideVisual } = require('./modules/visual-decider');

const decision = decideVisual({
  title: '服務流程',
  content: '步驟 1: 收集 → 步驟 2: 運輸 → 步驟 3: 處理',
  index: 1
});

// 決策結果
// {
//   strategy: { source: 'kie-ai', model: '4o-image' },
//   params: { type: 'process', style: 'flow diagram', ... }
// }
```

### 3. 生成資訊圖表

```javascript
const { generateInfographic } = require('./modules/kie-ai');

const imagePath = await generateInfographic(apiKey, {
  type: 'statistics',
  data: { number: '87%', trend: 'decrease', subject: '針扎傷害' },
  colors: { primary: '#1E5128', secondary: '#4E9F3D' },
  outputPath: './workspace/slide01-infographic.png'
});
```

### 4. 整合到 HTML

```javascript
const { integrateImage } = require('./modules/image-integrator');

const htmlPath = await integrateImage({
  imagePath: './workspace/slide01-infographic.png',
  slideData: {
    title: '針扎傷害減少 87%',
    content: '經科學驗證的安全性數據'
  },
  outputPath: './workspace/slide01.html',
  colors: { primary: '#1E5128' }
});
```

## 內容類型與資訊圖表對應

| 內容類型 | 資訊圖表類型 | 範例觸發詞 |
|---------|-------------|-----------|
| statistics | 統計數據圖 | 百分比、減少、增加、數據 |
| process | 流程圖 | 步驟、流程、階段、→ |
| comparison | 比較圖 | vs、對比、優缺點 |
| timeline | 時間軸 | 年份、歷史、里程碑 |
| company_intro | 公司介紹圖 | 公司、企業、團隊 |
| concept | 概念圖 | 策略、模式、價值 |
| text_only | 不生成 | 無特定視覺需求 |

## 配色方案

預設使用森林綠配色，可自訂：

```javascript
const colors = {
  primary: '#1E5128',      // 主要色
  secondary: '#4E9F3D',    // 次要色
  accent: '#FFFFFF',       // 強調色
  background: '#FFFFFF'    // 背景色
};
```

## 成本估算

- **Kie.ai 資訊圖表**：約 $0.05/張

## 完整範例

```javascript
const { enhancePresentation } = require('./index');

const slides = [
  { title: '針扎傷害減少 87%', content: '經過研究證實...' },
  { title: '服務流程', content: '步驟 1 → 步驟 2 → 步驟 3' },
  { title: '總結', content: '感謝您的時間' }
];

// 完整流程
const result = await enhancePresentation(slides, {
  kieApiKey: process.env.KIE_AI_API_KEY,
  outputDir: './workspace',
  colors: { primary: '#1E5128', secondary: '#4E9F3D' }
});

console.log(result.summary);
// { totalSlides: 3, infographicCount: 2, noVisualCount: 1, ... }
```

## Dry Run 模式

只分析不生成圖片：

```javascript
const result = await enhancePresentation(slides, {
  dryRun: true
});

// 查看分析結果和預估成本
console.log(result.summary.estimatedCost);
```

## 與 document-pptx 的關係

此技能是 `document-pptx` 的增強版本，保留所有原有功能並新增視覺生成能力。原有的 HTML 製作和 PPTX 轉換流程不變，只在需要視覺元素時調用新增模組。
