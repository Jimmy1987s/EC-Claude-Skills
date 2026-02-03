---
name: dafong-presentation-style
description: 使用大豐環保企業風格設計並製作 PowerPoint 簡報，適用於需要製作專業環保主題簡報時。
---

# 大豐環保簡報風格

此 skill 定義大豐環保（DF）的企業簡報視覺標準，並提供直接產生 .pptx 檔案的能力。

## 何時使用此 Skill

- 製作大豐環保相關簡報
- 需要專業環保主題的簡報設計
- 建立企業風格的封面頁或內頁
- 需要直接輸出 .pptx 檔案

## CIS 企業識別

### 官方 Logo 檔案

```
路徑：resources/ppt_logo.png
```

**使用規範：**
- 封面頁：Logo 置於左下角
- 內頁：Logo 可縮小置於頁尾
- 保持 Logo 原始比例，不可變形
- Logo 周圍保留適當留白空間

## 設計規範

### 品牌色彩

| 用途 | 顏色 | Hex | RGB |
|------|------|-----|-----|
| 主背景 | 深海藍 | `#1e4a6e` | `30, 74, 110` |
| 強調色 | 環保綠 | `#4caf50` | `76, 175, 80` |
| 標題文字 | 純白 | `#ffffff` | `255, 255, 255` |
| 次要文字 | 淺灰 | `#e0e0e0` | `224, 224, 224` |

### 版面結構

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    ╭──────────────────╮                                     │
│    │                  │                                     │
│    │    大標題        │          [情境圖片區]               │
│    │    (白色粗體)    │                                     │
│    │                  │                                     │
│    ╰──────────────────╯                                     │
│                                                             │
│    🌐 大豐環保 Logo                                          │
│    (左下角)                                                  │
└─────────────────────────────────────────────────────────────┘
```

### 封面頁設計要素

1. **背景**：深海藍 (`#1e4a6e`) 純色
2. **主標題**：
   - 位置：左側偏中
   - 字體：粗體、超大字號
   - 顏色：純白
3. **分隔線**：綠色圓弧曲線，從左下延伸至右上
4. **圖片區**：右側放置與主題相關的情境照片
5. **Logo**：左下角，包含「DF」圖標 + 「大豐環保」文字

### 字體建議

| 元素 | 字體 | 大小 | 粗細 |
|------|------|------|------|
| 封面標題 | 微軟正黑體 | 72-96pt | Bold |
| 章節標題 | 微軟正黑體 | 48-60pt | Bold |
| 內文 | 微軟正黑體 | 24-32pt | Regular |
| 註腳 | 微軟正黑體 | 12-16pt | Light |

---

## 製作 PowerPoint 簡報

使用 `document-pptx` skill 的 html2pptx 工作流程來產生 .pptx 檔案。

### 工作流程

1. **讀取 html2pptx.md**：先完整讀取 `~/.claude/skills/document-pptx/html2pptx.md`
2. **建立 HTML 投影片**：每張投影片一個 HTML 檔案（720pt × 405pt for 16:9）
3. **轉換為 PPTX**：使用 html2pptx.js 轉換
4. **驗證輸出**：產生縮圖確認版面正確

### 封面頁 HTML 範本

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 720pt;
      height: 405pt;
      background: #1e4a6e;
      position: relative;
      overflow: hidden;
      font-family: 'Microsoft JhengHei', 'Arial', sans-serif;
    }

    /* 綠色弧形分隔線 */
    .arc-divider {
      position: absolute;
      right: 180pt;
      top: -50pt;
      width: 400pt;
      height: 505pt;
      border-radius: 50%;
      border-left: 4pt solid #4caf50;
      background: transparent;
    }

    /* 右側圖片區 */
    .image-area {
      position: absolute;
      right: 0;
      top: 0;
      width: 320pt;
      height: 405pt;
      background-color: #2d5a7e;
      clip-path: ellipse(100% 100% at 100% 50%);
    }

    /* 主標題 */
    .main-title {
      position: absolute;
      left: 40pt;
      top: 50%;
      transform: translateY(-50%);
      color: #ffffff;
      font-size: 72pt;
      font-weight: bold;
      letter-spacing: 8pt;
    }

    /* Logo 區 */
    .logo-area {
      position: absolute;
      left: 40pt;
      bottom: 30pt;
    }

    .logo-img {
      height: 40pt;
      width: auto;
    }
  </style>
</head>
<body>
  <div class="arc-divider"></div>
  <div class="image-area"></div>
  <h1 class="main-title">廢車</h1>
  <div class="logo-area">
    <img class="logo-img" src="resources/ppt_logo.png" alt="大豐環保">
  </div>
</body>
</html>
```

### 內頁 HTML 範本

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 720pt;
      height: 405pt;
      background: #ffffff;
      position: relative;
      font-family: 'Microsoft JhengHei', 'Arial', sans-serif;
    }

    /* 頂部色條 */
    .header-bar {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 60pt;
      background: #1e4a6e;
    }

    /* 頁面標題 */
    .page-title {
      position: absolute;
      top: 15pt;
      left: 40pt;
      color: #ffffff;
      font-size: 28pt;
      font-weight: bold;
    }

    /* 內容區 */
    .content {
      position: absolute;
      top: 80pt;
      left: 40pt;
      right: 40pt;
      bottom: 50pt;
    }

    /* 項目符號清單 */
    .content ul {
      list-style: none;
      padding-left: 20pt;
    }

    .content li {
      font-size: 20pt;
      color: #333333;
      margin-bottom: 15pt;
      position: relative;
    }

    .content li::before {
      content: "●";
      color: #4caf50;
      position: absolute;
      left: -20pt;
    }

    /* 底部 Logo */
    .footer-logo {
      position: absolute;
      left: 40pt;
      bottom: 15pt;
    }

    .footer-logo-img {
      height: 25pt;
      width: auto;
    }

    /* 綠色底部線條 */
    .bottom-line {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4pt;
      background: #4caf50;
    }
  </style>
</head>
<body>
  <div class="header-bar"></div>
  <h1 class="page-title">頁面標題</h1>

  <div class="content">
    <ul>
      <li>第一個重點項目</li>
      <li>第二個重點項目</li>
      <li>第三個重點項目</li>
    </ul>
  </div>

  <div class="footer-logo">
    <img class="footer-logo-img" src="resources/ppt_logo.png" alt="大豐環保">
  </div>
  <div class="bottom-line"></div>
</body>
</html>
```

### 產生 PPTX 的 JavaScript 範例

```javascript
const { html2pptx, createPresentation } = require('/path/to/html2pptx.js');
const pptx = createPresentation({ layout: 'LAYOUT_16x9' });

// 封面頁
await html2pptx(pptx, 'slide-cover.html');

// 內頁
await html2pptx(pptx, 'slide-content.html');

// 儲存
await pptx.writeFile('大豐環保簡報.pptx');
```

---

## 使用情境

**使用者**：「幫我做一個廢車回收的簡報」

**輸出**：
1. 建立封面頁 HTML（套用大豐環保風格）
2. 建立內頁 HTML（如需要）
3. 使用 html2pptx 轉換為 .pptx 檔案
4. 產生縮圖驗證版面

---

## 主題建議圖片

| 主題 | 建議圖片元素 |
|------|-------------|
| 廢車 | 汽車、回收場、金屬零件 |
| 廢棄物 | 回收桶、分類垃圾、環保容器 |
| 環保 | 綠色植物、可回收材料、自然元素 |
| 資源 | 再生材料、循環圖示、永續圖像 |

---

## 注意事項

- 保持版面簡潔，封面只放一個主標題
- 圖片選擇應與主題高度相關
- Logo 位置固定在左下角，不可移動
- 綠色弧線是品牌識別元素，必須保留
- 使用 `document-pptx` skill 的工具產生實際 .pptx 檔案
- 產生後務必用縮圖驗證版面正確性
