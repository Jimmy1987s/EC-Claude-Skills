---
name: dafong-html-report
description: 使用大豐環保企業風格建立 HTML 報告，適用於需要製作專業視覺化報告時。
---

# 大豐環保 HTML 報告風格

此 skill 定義大豐環保（DF）的企業 HTML 報告視覺標準。

## 何時使用此 Skill

- 製作大豐環保相關 HTML 報告
- 需要專業環保主題的視覺化報告
- 建立企業風格的資料呈現頁面
- 職務說明、專案規劃、進度報告等文件

---

## 輸出路徑規範

### 預設輸出位置

報告檔案應存放在專案的 `docs/reports/` 目錄下：

```
專案根目錄/
└── docs/
    └── reports/
        ├── YYYY-MM-DD-report-name.html    ← HTML 報告
        ├── YYYY-MM-DD-report-name.pdf     ← PDF 版本
        └── images/                         ← 報告用圖片
            ├── dafong-logo.png
            └── cover-bg.png
```

### 命名規則

| 類型 | 格式 | 範例 |
|------|------|------|
| HTML 報告 | `YYYY-MM-DD-<描述>.html` | `2025-01-20-ai-data-center-guide.html` |
| PDF 版本 | `YYYY-MM-DD-<描述>.pdf` | `2025-01-20-ai-data-center-guide.pdf` |
| 封面背景 | `cover-bg.png` 或 `<報告名>-cover.png` | `ai-data-center-cover.png` |

### 建立流程

```bash
# 1. 建立輸出目錄（如果不存在）
mkdir -p docs/reports/images

# 2. 複製 Logo 到報告目錄
cp ~/.claude/skills/dafong-presentation-style/resources/ppt_logo.png docs/reports/images/dafong-logo.png

# 3. 建立 HTML 報告
# → 存放至 docs/reports/YYYY-MM-DD-report-name.html

# 4. 轉換 PDF（如需要）
# → 存放至 docs/reports/YYYY-MM-DD-report-name.pdf
# → 使用全域 playwright（無需專案內安裝）
```

### 路徑引用

在 HTML 中引用圖片時使用相對路徑：

```html
<!-- Logo -->
<img src="images/dafong-logo.png" alt="大豐環保">

<!-- 封面背景 -->
background: url('images/cover-bg.png') center/cover no-repeat;
```

## 統一模式系統

Claude 依據使用者的**關鍵詞**自動判斷報告模式：

| 模式 | 觸發詞 | Logo | AI 生圖 | 動畫效果 |
|:----:|--------|:----:|:-------:|:--------:|
| **草稿** | 「草稿」「筆記」「先簡單做」「快速」 | ❌ | ❌ | ❌ |
| **標準** | 「報告」「文件」「做一份」 | ✅ | ❌ | ❌ |
| **正式** | 「正式」「對外」「提案」「簡報」「重要」 | ✅ | ✅ | ❌ |
| **精緻** | 「美化」「加動畫」「更精緻」「最好」 | ✅ | ✅ | ✅ |

### 模式判斷流程

```
使用者輸入 → 掃描關鍵詞 → 匹配模式 → 執行對應層次
                ↓
         找不到關鍵詞？
                ↓
         詢問：「這份報告是內部使用還是對外正式文件？」
```

### 使用者覆寫指令

| 使用者說 | 動作 |
|----------|------|
| 「不用生圖」 | 跳過 AI 生圖，其他照模式執行 |
| 「要生圖」 | 強制執行 AI 生圖 |
| 「不用 Logo」 | 跳過 Logo（草稿模式） |
| 「用大豐風格」 | 至少執行標準模式 |

---

## UI/UX 設計原則

### 視覺層次（Visual Hierarchy）

**核心原則：引導視線，突出重點**

```
重要度層級：
┌─────────────────────────────────────────────────┐
│  Level 1: 標題/數據重點 ← 最大、最粗、品牌色    │
│  Level 2: 區塊標題     ← 中等、加粗             │
│  Level 3: 內文說明     ← 標準大小、適中字重     │
│  Level 4: 輔助資訊     ← 較小、較淡             │
└─────────────────────────────────────────────────┘
```

| 層級 | 字體大小 | 字重 | 顏色 | 用途 |
|:----:|:--------:|:----:|------|------|
| L1 | 28-42px | 700 | 品牌藍/白 | 封面標題、重點數據 |
| L2 | 18-24px | 600 | 深海藍 | 卡片標題、區塊標題 |
| L3 | 14-16px | 500 | 深海藍 | 內文、說明文字 |
| L4 | 12-13px | 400 | `#666` | 備註、來源、日期 |

### 留白與呼吸感（Whitespace）

**核心原則：留白不是浪費，是讓內容呼吸**

```css
/* 標準間距系統（8px 為基準） */
--space-xs: 4px;   /* 緊密元素間 */
--space-sm: 8px;   /* 相關元素間 */
--space-md: 16px;  /* 區塊內元素間 */
--space-lg: 24px;  /* 區塊間 */
--space-xl: 32px;  /* 主要區塊間 */
--space-2xl: 48px; /* 頁面區段間 */
```

| 位置 | 間距 | 說明 |
|------|------|------|
| 卡片內 padding | 24px | 內容與邊框的距離 |
| 卡片間 margin | 24px | 卡片之間的距離 |
| 元素間 gap | 12-16px | 同一區塊內元素間距 |
| 標題與內容 | 16px | 標題下方到內容的距離 |
| 段落間 | 16px | 段落之間的距離 |

### 對比與易讀性（Contrast & Readability）

**WCAG 2.1 AA 標準：對比度至少 4.5:1**

| 組合 | 對比度 | 狀態 |
|------|:------:|:----:|
| 白字 on 深海藍 `#1e4a6e` | 7.2:1 | ✅ 優秀 |
| 白字 on 環保綠 `#4caf50` | 3.0:1 | ⚠️ 需加粗或加陰影 |
| 深海藍 on 白色 | 7.2:1 | ✅ 優秀 |
| 深海藍 on 淺灰 `#f5f5f5` | 6.8:1 | ✅ 良好 |
| `#666` on 白色 | 5.7:1 | ✅ 適合輔助文字 |

**環保綠背景的處理方式：**
```css
/* 方法 1: 加文字陰影 */
text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

/* 方法 2: 使用較深的森林綠 #2e7d32（對比度 4.8:1） */
background: linear-gradient(135deg, #4caf50, #2e7d32);

/* 方法 3: 加粗字體 */
font-weight: 600;
```

### 一致性原則（Consistency）

**相同功能 = 相同樣式**

| 元素類型 | 統一規範 |
|----------|----------|
| 所有圓角 | 8px（小元件）/ 12px（卡片）/ 16px（大容器） |
| 所有陰影 | `0 2px 8px rgba(0,0,0,0.08)` 或 `0 4px 20px rgba(0,0,0,0.15)` |
| 所有過渡 | `transition: all 0.2s ease` |
| 所有邊框 | `1px solid #e0e0e0` 或 `rgba(255,255,255,0.1)` |

### 親密性原則（Proximity）

**相關內容靠近，不相關內容分開**

```
✅ 正確：
┌─────────────────┐
│ 標題            │ ← 標題與內容靠近
│ 內容說明文字    │
│                 │
│ 相關數據        │ ← 數據與圖表靠近
│ [圖表]          │
└─────────────────┘

❌ 錯誤：
┌─────────────────┐
│ 標題            │
│                 │ ← 太多空白分隔相關內容
│                 │
│ 內容說明文字    │
└─────────────────┘
```

### 資訊密度平衡

| 報告類型 | 資訊密度 | 每頁建議元件數 |
|----------|:--------:|:--------------:|
| 高階主管摘要 | 低 | 2-3 個重點卡片 |
| 一般業務報告 | 中 | 3-4 個內容區塊 |
| 技術文件 | 高 | 4-5 個詳細區塊 |

**黃金比例：文字 60% + 視覺 40%**

---

## CIS 企業識別

### 官方 Logo 檔案

```
路徑：~/.claude/skills/dafong-presentation-style/resources/ppt_logo.png
```

**使用規範：**
- 封面：Logo 與標題並排，左側放置
- 使用 `filter: drop-shadow()` 增加與背景的融合感
- 保持 Logo 原始比例，不可變形

### 品牌色彩

| 用途 | 顏色 | Hex |
|------|------|-----|
| 主背景/標題 | 深海藍 | `#1e4a6e` |
| 強調色 | 環保綠 | `#4caf50` |
| 深綠色 | 森林綠 | `#2e7d32` |
| 標題文字 | 純白 | `#ffffff` |
| 次要文字 | 淺灰 | `#e0e0e0` |
| 內文背景 | 白色 | `#ffffff` |
| 輔助背景 | 淺灰 | `#f5f5f5` |

### 文字對比度規範（重要）

**核心原則：所有文字使用深海藍 `#1e4a6e`，只有深色背景用白字**

| 背景色 | 文字色 | 用途 |
|--------|--------|------|
| 深海藍 `#1e4a6e` | 純白 `#ffffff` | 標題、卡片標頭 |
| 環保綠 `#4caf50` | 純白 `#ffffff` | 強調區塊 |
| 白色 `#ffffff` | 深藍 `#1e4a6e` | 內文標題、表格內容 |
| 淺灰 `#f5f5f5` | 深藍 `#1e4a6e` | 卡片內文、圖例 |
| 淺灰 `#f8f9fa` | 深藍 `#1e4a6e` | 流程步驟、說明 |

**禁止使用**：`#666666`、`#999999` 等灰色作為主要文字色

**文字陰影**：在彩色背景上使用 `text-shadow: 0 1px 2px rgba(0,0,0,0.2)` 增加可讀性

**字重建議**：內文使用 `font-weight: 500` 或 `600` 增加清晰度

### 字體

```css
font-family: "Microsoft JhengHei", "PingFang TC", sans-serif;
```

---

## 報告敘事框架

使用 **SCQA 框架** 組織報告結構，讓讀者快速理解重點。

### SCQA 通用框架

| 區塊 | 名稱 | 用途 | 建議元件 |
|:----:|------|------|----------|
| **S** | Situation 背景 | 讓讀者進入情境 | 封面卡片 + 1-2 句副標題 |
| **C** | Complication 挑戰 | 說明問題或機會 | `highlight-card` 強調區塊 |
| **Q** | Question 核心問題 | 這份報告要回答什麼 | （通常隱含在標題中） |
| **A** | Answer 解答 | 主體內容 | 依報告類型選擇（見下表） |

### 依報告類型選擇 Answer 結構

| 報告類型 | Answer 結構 | 建議元件組合 |
|----------|------------|--------------|
| **專案提案** | 方案 → 效益 → 時程 → 預算 | `flow-section` → `benefits` → `timeline` → `table` |
| **進度報告** | 成果 → 數據 → 問題 → 下一步 | `highlight-card` → `pie-chart`/`table` → `<ul>` → `timeline` |
| **教學說明** | 概念 → 步驟 → 範例 → 注意事項 | `card` → `flow-section` → 程式碼區塊 → `<ul>` |

---

## 內容 → 元件對應表

當你有一段內容，不確定該用什麼元件時：

| 你的內容是... | 建議元件 | 為什麼 |
|--------------|----------|--------|
| **一個數字很重要** | `highlight-card` | 大字體 + 漸層背景，一眼就看到 |
| **3-5 個並列重點** | `benefits` | 等寬排列，視覺平衡 |
| **比例/佔比資料** | `pie-chart` | 直覺看出大小關係 |
| **多欄位比較** | `table` | 結構化資料最清楚 |
| **有順序的步驟** | `flow-section` | 箭頭引導閱讀順序 |
| **時間軸/階段** | `timeline` | 強調進程和里程碑 |
| **一般說明文字** | `card` | 標準容器，可放任何內容 |
| **條列式清單** | `card` + `<ul>` | 卡片內放清單 |

### 強調層級對照

| 強調程度 | 使用元件 | 視覺效果 |
|:--------:|----------|----------|
| ⭐⭐⭐ 最強 | `highlight-card` | 綠色漸層背景 + 大字 + 圖示 |
| ⭐⭐ 中等 | `card-header` + `badge` | 深藍標題列 + 彩色標籤 |
| ⭐ 一般 | `card-body` 內文 | 白底 + 深藍字 |

**經驗法則**：
- 每份報告只有 **1-2 個** `highlight-card`（太多就不強調了）
- 重要數據用 `badge` 標籤標記
- 其他內容用標準卡片

---

## 視覺呈現決策樹

當你不確定該用「圖片」「圖表」還是「純文字」時：

```
你的內容是什麼？
│
├─ 數據/數字 ─────────────────┐
│   │                         │
│   ├─ 比例/佔比？ ──────────→ 圓餅圖 pie-chart
│   ├─ 多項目比較？ ──────────→ 表格 table
│   └─ 單一重點數字？ ────────→ highlight-card
│
├─ 流程/步驟 ─────────────────┐
│   │                         │
│   ├─ 3-5 步驟？ ────────────→ flow-section 流程圖
│   ├─ 有時間順序？ ──────────→ timeline 時間軸
│   └─ 步驟很多（>5）？ ──────→ 表格 + 編號
│
├─ 概念/情境 ─────────────────┐
│   │                         │
│   ├─ 抽象概念？ ────────────→ AI 生成示意圖 🎨
│   ├─ 實際場景？ ────────────→ AI 生成情境圖 🎨
│   └─ 技術架構？ ────────────→ 流程圖 或 ASCII 圖
│
└─ 條列/說明 ─────────────────┐
    │                         │
    ├─ 3-5 個並列重點？ ──────→ benefits 效益卡片
    ├─ 超過 5 個？ ───────────→ card + <ul> 清單
    └─ 需要強調？ ────────────→ badge 標籤標記
```

### AI 生圖時機判斷（🎨 標記處）

| 情境 | 生圖？ | Prompt 方向 |
|------|:------:|-------------|
| 封面需要專業感 | ✅ | 主題相關 + 大豐色調 |
| 解釋抽象概念（如「AI 辨識流程」） | ✅ | 技術示意圖 |
| 展示未來願景 | ✅ | 情境渲染圖 |
| 純數據報告 | ❌ | 用圖表就夠 |
| 內部快速溝通 | ❌ | 浪費時間 |

---

## 報告範例

### 範例 A：完整 HTML 範例

三種報告類型的完整可運行範例：

| 範例 | 檔案路徑 | 適用情境 |
|------|----------|----------|
| 專案提案 | `examples/proposal-example.html` | 說服主管採用方案 |
| 進度報告 | `examples/progress-report-example.html` | 彙報季度成果 |
| 教學說明 | `examples/tutorial-example.html` | 新進人員教育訓練 |

#### 專案提案範例內容
- **S**：封面卡片（Logo + 標題 + 副標題）
- **C**：highlight-card 強調痛點
- **A1**：flow-section 方案流程
- **A2**：benefits 預期效益
- **A3**：timeline 導入時程
- **A4**：table 預算規劃

#### 進度報告範例內容
- **S**：封面卡片
- **重點**：highlight-card 達成率
- **A1**：pie-chart + table 數據
- **A2**：issue-list 待解決問題
- **A3**：timeline 下季計畫

#### 教學說明範例內容
- **S**：封面卡片
- **A1**：system-overview 系統概述
- **A2**：flow-section + step-detail 操作步驟
- **A3**：screenshot-box 操作範例
- **A4**：notice-list 注意事項

可直接用瀏覽器開啟查看效果，或作為新報告的起點複製修改。

### 範例 B：結構對照範例

以「AI 辨識系統導入提案」為例，展示內容如何對應到元件：

| SCQA | 內容 | 元件 | 強調層級 |
|:----:|------|------|:--------:|
| **S** | 報告標題「AI 辨識系統導入提案」+ 副標題「提升廢車分類效率」 | `cover-card` + Logo | - |
| **C** | 「目前人工分類耗時 30 分鐘/車」 | `highlight-card` | ⭐⭐⭐ |
| **A1** | 方案說明：拍照 → AI 辨識 → 產出報告 | `flow-section` | ⭐⭐ |
| **A2** | 三大效益：省時、精準、可追蹤 | `benefits` | ⭐⭐ |
| **A3** | 導入時程：Q1 測試 → Q2 上線 → Q3 全廠 | `timeline` | ⭐⭐ |
| **A4** | 預算表：硬體/軟體/維護費用 | `table` | ⭐ |

### 範例 C：三種報告類型骨架

#### 專案提案骨架

```
┌─────────────────────────────────────┐
│  cover-card                         │  ← S: 背景
│  Logo + 標題 + 副標題               │
├─────────────────────────────────────┤
│  highlight-card                     │  ← C: 挑戰
│  「目前痛點：XXX」                   │
├─────────────────────────────────────┤
│  card: 方案說明                     │  ← A1
│  └── flow-section（流程圖）         │
├─────────────────────────────────────┤
│  card: 預期效益                     │  ← A2
│  └── benefits（3-4 個效益卡片）     │
├─────────────────────────────────────┤
│  card: 導入時程                     │  ← A3
│  └── timeline（階段規劃）           │
├─────────────────────────────────────┤
│  card: 預算                         │  ← A4
│  └── table（費用明細）              │
└─────────────────────────────────────┘
```

#### 進度報告骨架

```
┌─────────────────────────────────────┐
│  cover-card                         │  ← S: 背景
│  Logo + 「Q1 進度報告」              │
├─────────────────────────────────────┤
│  highlight-card                     │  ← 重點成果
│  「本季達成率 95%」                  │
├─────────────────────────────────────┤
│  card: 數據總覽                     │  ← A1
│  └── pie-chart + table              │
├─────────────────────────────────────┤
│  card: 待解決問題                   │  ← A2
│  └── <ul> 清單 + badge 標籤         │
├─────────────────────────────────────┤
│  card: 下季計畫                     │  ← A3
│  └── timeline（里程碑）             │
└─────────────────────────────────────┘
```

#### 教學說明骨架

```
┌─────────────────────────────────────┐
│  cover-card                         │  ← S: 背景
│  Logo + 「系統操作手冊」             │
├─────────────────────────────────────┤
│  card: 系統概述                     │  ← A1: 概念
│  └── 說明文字 + AI 生成示意圖       │
├─────────────────────────────────────┤
│  card: 操作步驟                     │  ← A2: 步驟
│  └── flow-section（步驟流程）       │
├─────────────────────────────────────┤
│  card: 操作範例                     │  ← A3: 範例
│  └── 截圖 + 說明                    │
├─────────────────────────────────────┤
│  card: 注意事項                     │  ← A4
│  └── <ul> 清單                      │
└─────────────────────────────────────┘
```

---

## HTML 報告完整範本

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>報告標題</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: "Microsoft JhengHei", "PingFang TC", sans-serif;
      background: #1e4a6e;
      min-height: 100vh;
      padding: 40px 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    /* ========== 封面卡片（帶背景圖） ========== */
    .cover-card {
      border-radius: 16px;
      padding: 48px;
      margin-bottom: 24px;
      border: 1px solid rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      gap: 32px;
      min-height: 280px;
      position: relative;
      overflow: hidden;
    }
    .cover-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: url('images/cover-bg.png') center/cover no-repeat;
      z-index: 0;
    }
    .cover-card::after {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(135deg, rgba(30, 74, 110, 0.75) 0%, rgba(45, 90, 126, 0.7) 100%);
      z-index: 1;
    }
    .cover-logo {
      height: 60px;
      width: auto;
      position: relative;
      z-index: 2;
      filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
    }
    .cover-text {
      position: relative;
      z-index: 2;
    }
    .cover-text h1 {
      color: #ffffff;
      font-size: 42px;
      font-weight: bold;
      letter-spacing: 6px;
      margin-bottom: 12px;
      text-shadow: 0 2px 12px rgba(0,0,0,0.5);
    }
    .cover-text .subtitle {
      color: rgba(255,255,255,0.9);
      font-size: 18px;
      text-shadow: 0 1px 6px rgba(0,0,0,0.4);
    }

    /* ========== 內容卡片 ========== */
    .card {
      background: #ffffff;
      border-radius: 12px;
      margin-bottom: 24px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }
    .card-header {
      background: #1e4a6e;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .card-header-icon {
      width: 32px;
      height: 32px;
      background: rgba(76, 175, 80, 0.2);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
    .card-header h2 {
      color: #ffffff;
      font-size: 20px;
      font-weight: bold;
      text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }
    .card-body {
      padding: 24px;
    }

    /* ========== 圓餅圖 ========== */
    .chart-section {
      display: flex;
      gap: 32px;
      align-items: center;
      margin-bottom: 24px;
    }
    .pie-chart {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      /* 依比例調整角度: 40%=144deg, 10%=36deg, 50%=180deg */
      background: conic-gradient(
        #1e4a6e 0deg 144deg,
        #4caf50 144deg 180deg,
        #2e7d32 180deg 360deg
      );
      position: relative;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }
    .pie-chart::after {
      content: "100%";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80px;
      height: 80px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: bold;
      color: #1e4a6e;
    }
    .chart-legend {
      flex: 1;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      padding: 12px 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .legend-color {
      width: 16px;
      height: 16px;
      border-radius: 4px;
    }
    .legend-text {
      flex: 1;
      font-weight: 500;
      color: #1e4a6e;
    }
    .legend-value {
      font-weight: bold;
      color: #1e4a6e;
    }

    /* ========== 表格 ========== */
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 14px 16px;
      text-align: center;
      border-bottom: 1px solid #e0e0e0;
    }
    th {
      background: #f5f5f5;
      color: #1e4a6e;
      font-weight: 600;
    }
    td {
      color: #1e4a6e;
      font-weight: 500;
    }
    tr:hover {
      background: #f9f9f9;
    }

    /* ========== 標籤 ========== */
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: bold;
      color: white;
      text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }
    .badge-primary { background: #1e4a6e; }
    .badge-accent { background: #4caf50; }
    .badge-secondary { background: #2e7d32; }

    /* ========== 強調區塊 ========== */
    .highlight-card {
      background: linear-gradient(135deg, #4caf50, #2e7d32);
      color: white;
      padding: 24px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 24px;
    }
    .highlight-icon {
      width: 72px;
      height: 72px;
      background: rgba(255,255,255,0.2);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
    }
    .highlight-text h3 {
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: 4px;
    }
    .highlight-text p {
      font-size: 28px;
      font-weight: bold;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    /* ========== 流程圖 ========== */
    .flow-section {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 24px;
    }
    .flow-title {
      text-align: center;
      color: #1e4a6e;
      margin-bottom: 20px;
      font-size: 14px;
    }
    .flow-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
    }
    .flow-step {
      text-align: center;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      min-width: 120px;
      position: relative;
    }
    .flow-step::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #4caf50, #2e7d32);
      border-radius: 12px 12px 0 0;
    }
    .flow-icon {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      margin: 0 auto 12px;
    }
    .flow-label {
      font-size: 15px;
      color: #1e4a6e;
      font-weight: 600;
    }
    .flow-arrow {
      font-size: 24px;
      color: #4caf50;
      font-weight: bold;
    }

    /* ========== 時間軸/階段 ========== */
    .timeline {
      position: relative;
      padding: 20px 0;
    }
    .timeline::before {
      content: "";
      position: absolute;
      top: 44px;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #1e4a6e, #4caf50, #2e7d32, #1e4a6e);
      border-radius: 2px;
    }
    .stages {
      display: flex;
      justify-content: space-between;
      position: relative;
    }
    .stage {
      flex: 1;
      text-align: center;
      padding: 0 8px;
    }
    .stage-dot {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #1e4a6e, #2d5a7e);
      border-radius: 50%;
      margin: 0 auto 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 18px;
      box-shadow: 0 4px 12px rgba(30, 74, 110, 0.3);
      position: relative;
      z-index: 1;
    }
    .stage-content {
      background: white;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .stage-title {
      font-size: 15px;
      font-weight: bold;
      color: #1e4a6e;
    }
    .stage-desc {
      font-size: 12px;
      color: #1e4a6e;
      margin-top: 4px;
    }

    /* ========== 效益/重點卡片 ========== */
    .benefits {
      display: flex;
      gap: 16px;
    }
    .benefit {
      flex: 1;
      background: linear-gradient(135deg, #f8f9fa, #ffffff);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      border: 1px solid #e0e0e0;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .benefit:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }
    .benefit-icon {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      margin: 0 auto 12px;
    }
    .benefit p {
      color: #1e4a6e;
      font-size: 15px;
      font-weight: 600;
    }

    /* ========== 底部綠線 ========== */
    .green-line {
      height: 4px;
      background: linear-gradient(90deg, #4caf50, #2e7d32);
    }

    /* ========== 頁尾 ========== */
    .footer {
      text-align: center;
      color: rgba(255,255,255,0.6);
      font-size: 12px;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- 內容放這裡 -->
  </div>
</body>
</html>
```

---

## 元件使用指南

### 1. 封面卡片

用於報告最上方，包含大豐 Logo 和標題。

```html
<div class="cover-card">
  <img src="images/dafong-logo.png" alt="大豐環保" class="cover-logo">
  <div class="cover-text">
    <h1>報告標題</h1>
    <p class="subtitle">副標題說明</p>
  </div>
</div>
```

**注意**：需先複製 Logo 到報告的 images 資料夾：
```bash
cp ~/.claude/skills/dafong-presentation-style/resources/ppt_logo.png ./images/dafong-logo.png
```

### 2. 內容卡片

標準內容區塊，標題列含圖示。

```html
<div class="card">
  <div class="card-header">
    <div class="card-header-icon">📊</div>
    <h2>區塊標題</h2>
  </div>
  <div class="card-body">
    <!-- 內容 -->
  </div>
  <div class="green-line"></div>
</div>
```

### 3. 圓餅圖（適合比例資料）

```html
<div class="chart-section">
  <div class="pie-chart"></div>
  <div class="chart-legend">
    <div class="legend-item">
      <div class="legend-color" style="background: #1e4a6e;"></div>
      <span class="legend-text">項目一</span>
      <span class="legend-value">40%</span>
    </div>
    <!-- 更多項目 -->
  </div>
</div>
```

**圓餅圖角度計算**：比例 × 360deg（如 40% = 144deg）

### 4. 強調區塊（適合重點資訊）

```html
<div class="highlight-card">
  <div class="highlight-icon">👁️</div>
  <div class="highlight-text">
    <h3>小標題</h3>
    <p>重點內容</p>
  </div>
</div>
```

### 5. 流程圖（適合步驟說明）

```html
<div class="flow-section">
  <p class="flow-title">流程說明</p>
  <div class="flow-container">
    <div class="flow-step">
      <div class="flow-icon">📸</div>
      <div class="flow-label">步驟一</div>
    </div>
    <div class="flow-arrow">→</div>
    <div class="flow-step">
      <div class="flow-icon">🤖</div>
      <div class="flow-label">步驟二</div>
    </div>
    <!-- 更多步驟 -->
  </div>
</div>
```

### 6. 時間軸（適合階段規劃）

```html
<div class="timeline">
  <div class="stages">
    <div class="stage">
      <div class="stage-dot">1</div>
      <div class="stage-content">
        <div class="stage-title">階段名稱</div>
        <div class="stage-desc">簡短說明</div>
      </div>
    </div>
    <!-- 更多階段 -->
  </div>
</div>
```

### 7. 效益卡片（適合列舉重點）

```html
<div class="benefits">
  <div class="benefit">
    <div class="benefit-icon">⏱️</div>
    <p>效益說明</p>
  </div>
  <!-- 更多效益 -->
</div>
```

---

## 圖示系統

使用 **Icons8 Fluency Systems Regular** 線性圖示，保持專業簡潔風格。

### 圖示設計原則

**核心理念：圖示是輔助，不是主角**

```
圖示使用黃金法則：
┌────────────────────────────────────────────────────┐
│  1. 簡潔優先：線性圖示 > 填充圖示 > 彩色圖示       │
│  2. 一致風格：同一報告使用同一套圖示庫             │
│  3. 適度克制：不是每個標題都需要圖示               │
│  4. 語意明確：圖示要能傳達含義，不只是裝飾         │
└────────────────────────────────────────────────────┘
```

### 圖示尺寸規範

| 使用場景 | 尺寸 | 容器大小 | 視覺效果 |
|----------|:----:|:--------:|----------|
| 卡片標題 | 20px | 32px | 小巧精緻，不搶標題風采 |
| 流程步驟 | 24px | 48px | 清晰辨識，與文字平衡 |
| 效益卡片 | 28px | 56px | 適度醒目，強調價值 |
| 強調區塊 | 36px | 64px | 視覺焦點，引起注意 |
| 封面主視覺 | 48px+ | 80px+ | 大型圖示作為視覺錨點 |

**圖示與容器比例：圖示佔容器 50-60%**

### 圖示配色系統

**❌ 常見錯誤：直接用品牌色填充圖示**

```
問題分析：
- 深海藍圖示在淺藍/綠色背景上對比度不足
- CSS filter 轉換的顏色不精確，看起來髒髒的
- 彩色圖示容器內再放彩色圖示，視覺混亂
```

**✅ 正確做法：依背景選擇圖示顏色**

| 背景類型 | 圖示顏色 | 取得方式 | 視覺效果 |
|----------|----------|----------|----------|
| 深色背景（深海藍、環保綠漸層） | 純白 | URL 參數 `/ffffff/` | 高對比，清晰 |
| 淺色背景（白色、淺灰） | 深海藍 | URL 參數 `/1e4a6e/` | 品牌一致 |
| 彩色容器（淺綠、淺藍漸層） | 深海藍 | URL 參數 `/1e4a6e/` | 避免色彩衝突 |

### 圖示容器設計

**核心原則：容器顏色要柔和，圖示顏色要清晰**

```css
/* ✅ 推薦：柔和背景 + 深色圖示 */
.icon-container-soft {
  background: linear-gradient(135deg, #f0f7ff, #e8f4f8);  /* 極淺藍灰 */
  border-radius: 12px;
  padding: 12px;
}
.icon-container-soft img {
  filter: none;  /* 使用 URL 參數取得深海藍圖示 */
}

/* ✅ 推薦：深色背景 + 白色圖示 */
.icon-container-dark {
  background: linear-gradient(135deg, #1e4a6e, #2d5a7e);
  border-radius: 12px;
  padding: 12px;
}
.icon-container-dark img {
  filter: none;  /* 使用 URL 參數取得白色圖示 */
}

/* ❌ 避免：鮮豔背景 + 鮮豔圖示 */
.icon-container-bad {
  background: linear-gradient(135deg, #4caf50, #2e7d32);  /* 太鮮豔 */
}
```

### 推薦配色組合

| 組合名稱 | 容器背景 | 圖示顏色 | 適用場景 |
|----------|----------|----------|----------|
| 柔和專業 | `#f5f9fc` 淺灰藍 | `#1e4a6e` 深海藍 | 流程步驟、效益卡片 |
| 清新自然 | `#f1f8e9` 淺綠 | `#1e4a6e` 深海藍 | 環保主題 |
| 深邃穩重 | `#1e4a6e` 深海藍 | `#ffffff` 白色 | 卡片標題、強調區塊 |
| 透明輕盈 | `rgba(30,74,110,0.1)` | `#1e4a6e` 深海藍 | 次要圖示 |

### Icons8 URL 顏色參數

**直接在 URL 指定顏色，避免 CSS filter 失真**

```
URL 格式：
https://img.icons8.com/fluency-systems-regular/{size}/{color}/{icon-name}.png

範例：
白色 48px 圖示：/fluency-systems-regular/48/ffffff/robot.png
深海藍 24px 圖示：/fluency-systems-regular/24/1e4a6e/chart.png
```

### 常用圖示對照

| 主題 | Icons8 搜尋關鍵字 | 建議圖示名稱 |
|------|------------------|--------------|
| AI/機器人 | robot, ai | `robot`, `artificial-intelligence` |
| 圖表/分析 | chart, analytics | `combo-chart`, `analytics` |
| 目標/聚焦 | target, goal | `target`, `goal` |
| 學習/書本 | book, education | `book`, `reading` |
| 時間/效率 | time, clock | `time`, `clock` |
| 標準化 | ruler, measure | `ruler`, `design` |
| 循環/擴展 | sync, refresh | `synchronize`, `refresh` |
| 重點/星星 | star, highlight | `star`, `favorite` |
| 相機/拍照 | camera, photo | `camera`, `screenshot` |
| 文件/結果 | document, file | `document`, `file` |
| 環保/回收 | recycle, eco | `recycle-sign`, `leaf` |
| 成功/完成 | check, done | `checkmark`, `ok` |
| 警告/注意 | warning, alert | `error`, `attention` |
| 設定/工具 | settings, tool | `settings`, `maintenance` |
| 使用者/人員 | user, person | `user`, `customer` |
| 連結/整合 | link, connect | `link`, `data-transfer` |

### 完整樣式範例

```css
/* ========== 圖示容器基礎樣式 ========== */

/* 卡片標題圖示 - 深色背景用白圖示 */
.card-header-icon {
  width: 32px;
  height: 32px;
  background: rgba(76, 175, 80, 0.2);  /* 半透明綠 */
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-header-icon img {
  width: 20px;
  height: 20px;
  /* 使用 /ffffff/ URL 取得白色圖示，無需 filter */
}

/* 流程步驟圖示 - 柔和背景用深色圖示 */
.flow-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f0f7ff, #e8f4f8);  /* 極淺藍灰 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.flow-icon img {
  width: 24px;
  height: 24px;
  /* 使用 /1e4a6e/ URL 取得深海藍圖示 */
}

/* 效益卡片圖示 - 淺綠背景用深色圖示 */
.benefit-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #f1f8e9, #e8f5e9);  /* 極淺綠 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.benefit-icon img {
  width: 28px;
  height: 28px;
}

/* 強調區塊圖示 - 半透明白背景用白圖示 */
.highlight-icon {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.15);  /* 半透明白 */
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.highlight-icon img {
  width: 36px;
  height: 36px;
}
```

### HTML 使用範例

```html
<!-- 卡片標題（深色背景） -->
<div class="card-header">
  <div class="card-header-icon">
    <img src="https://img.icons8.com/fluency-systems-regular/24/ffffff/combo-chart.png" alt="">
  </div>
  <h2>數據分析</h2>
</div>

<!-- 流程步驟（淺色背景） -->
<div class="flow-step">
  <div class="flow-icon">
    <img src="https://img.icons8.com/fluency-systems-regular/32/1e4a6e/camera.png" alt="">
  </div>
  <div class="flow-label">拍照上傳</div>
</div>

<!-- 效益卡片（淺色背景） -->
<div class="benefit">
  <div class="benefit-icon">
    <img src="https://img.icons8.com/fluency-systems-regular/40/1e4a6e/time.png" alt="">
  </div>
  <h4>節省時間</h4>
  <p>效率提升 80%</p>
</div>

<!-- 強調區塊（深色/漸層背景） -->
<div class="highlight-card">
  <div class="highlight-icon">
    <img src="https://img.icons8.com/fluency-systems-regular/48/ffffff/target.png" alt="">
  </div>
  <div class="highlight-text">
    <h3>本季達成率</h3>
    <p>目標達成 112%</p>
  </div>
</div>
```

### 圖示使用檢查清單

```
製作報告時，逐項確認：

□ 同一報告是否使用同一套圖示風格？
□ 深色背景是否使用白色圖示？
□ 淺色背景是否使用深海藍圖示？
□ 圖示尺寸是否與容器比例協調（50-60%）？
□ 圖示是否能傳達語意，還是純裝飾？
□ 是否避免了 CSS filter 造成的顏色失真？
□ 容器背景是否足夠柔和，不與圖示搶眼？
```

### 離線使用

如需離線使用，先下載圖示到 `images/icons/` 資料夾：

```bash
# 建立圖示資料夾
mkdir -p images/icons

# 下載常用圖示（範例）
curl -o images/icons/chart.png "https://img.icons8.com/fluency-systems-regular/48/1e4a6e/combo-chart.png"
curl -o images/icons/target.png "https://img.icons8.com/fluency-systems-regular/48/1e4a6e/target.png"
curl -o images/icons/time.png "https://img.icons8.com/fluency-systems-regular/48/1e4a6e/time.png"
```

---

## AI 圖片生成整合

使用 Nano Banana API (Gemini) 生成報告背景圖和視覺化圖示。

> **施作時機**：依「統一模式系統」判斷，正式/精緻模式自動執行。

### API 設定

```
端點: https://api.kie.ai/api/v1/jobs/createTask
模型: google/nano-banana
```

### 建立圖片生成任務

```bash
curl -X POST "https://api.kie.ai/api/v1/jobs/createTask" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "google/nano-banana",
    "input": {
      "prompt": "圖片描述，包含 deep sea blue (#1e4a6e) and eco green (#4caf50) 色調",
      "output_format": "png",
      "image_size": "16:9"
    }
  }'
```

### 查詢任務結果

```bash
curl -X GET "https://api.kie.ai/api/v1/jobs/recordInfo?taskId=TASK_ID" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### 常用圖片 Prompt 範本

| 用途 | Prompt 範本 |
|------|-------------|
| 封面背景 | `Professional AI robot assistant with glowing blue and green digital eyes, deep sea blue (#1e4a6e) and eco green (#4caf50) color scheme, corporate technology style, futuristic setting, clean modern design, 3D rendered` |
| 工業流程 | `Industrial conveyor belt system with cameras and robotic arms, factory automation, deep sea blue and green accent colors, modern clean design, technical illustration` |
| 環保主題 | `Recycling facility with sorting machines, eco-friendly green and blue tones, sustainable environment, professional corporate style` |
| 數據分析 | `Data visualization dashboard with charts and graphs, digital interface, blue and green color scheme, modern tech style` |

### 帶背景圖的封面卡片 CSS

```css
/* 封面卡片 - 帶背景圖 */
.cover-card {
  border-radius: 16px;
  padding: 48px;
  margin-bottom: 24px;
  border: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  gap: 32px;
  min-height: 280px;
  position: relative;
  overflow: hidden;
}
.cover-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('images/cover-bg.png') center/cover no-repeat;
  z-index: 0;
}
.cover-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(30, 74, 110, 0.75) 0%, rgba(45, 90, 126, 0.7) 100%);
  z-index: 1;
}
.cover-icon {
  position: relative;
  z-index: 2;
  /* 其他樣式同原始設定 */
}
.cover-text {
  position: relative;
  z-index: 2;
}
```

### 帶背景圖的流程區塊 CSS

```css
/* 流程圖 - 帶背景圖 */
.flow-section {
  background: linear-gradient(135deg, rgba(248, 249, 250, 0.95), rgba(255, 255, 255, 0.92)),
              url('images/flow-bg.png') center/cover no-repeat;
  border-radius: 12px;
  padding: 24px;
  position: relative;
}
```

### 圖片展示區元件

```html
<div class="ai-visual-showcase">
  <img src="images/generated-image.png" alt="圖片說明" class="showcase-image">
  <p class="showcase-caption">圖片標題</p>
</div>
```

```css
/* AI 生成圖片展示區 */
.ai-visual-showcase {
  margin-top: 24px;
  text-align: center;
}
.showcase-image {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  border: 3px solid #e8f5e9;
}
.showcase-caption {
  margin-top: 12px;
  font-size: 14px;
  color: #1e4a6e;
  font-weight: 500;
}
```

### 工作流程

1. **確定需要的圖片**：封面、流程、主題相關
2. **生成圖片**：使用 API 發送包含大豐色調的 prompt
3. **下載圖片**：從結果 URL 下載到 `images/` 資料夾
4. **整合到 HTML**：使用 `::before` 偽元素或 `<img>` 標籤

---

## 注意事項

1. **文字對比度**：深色背景用白字，淺色背景用深藍/深灰字
2. **文字陰影**：彩色背景上的白字加 `text-shadow` 增加可讀性
3. **底部綠線**：每個內容卡片底部加上 `green-line`
4. **圖示搭配**：每個區塊標題加上對應圖示增加視覺化
5. **漸層使用**：強調區塊和按鈕使用漸層增加層次感
6. **圓餅圖**：依實際比例計算角度，使用 `conic-gradient`
7. **背景圖層疊**：使用 `::before` 放圖片，`::after` 放漸層遮罩，內容 z-index: 2

---

## 模式對應執行清單

依「統一模式系統」判斷後，執行對應項目：

| 項目 | 草稿 | 標準 | 正式 | 精緻 |
|------|:----:|:----:|:----:|:----:|
| HTML 骨架 + 大豐配色 | ✅ | ✅ | ✅ | ✅ |
| 內容填充（文字/表格/圖表） | ✅ | ✅ | ✅ | ✅ |
| 複製 Logo 到 images/ | ❌ | ✅ | ✅ | ✅ |
| 封面 `<img class="cover-logo">` | ❌ | ✅ | ✅ | ✅ |
| AI 生成封面背景圖 | ❌ | ❌ | ✅ | ✅ |
| AI 生成主題相關圖 | ❌ | ❌ | ✅ | ✅ |
| hover 動畫效果 | ❌ | ❌ | ❌ | ✅ |
| 響應式調整 | ❌ | ❌ | ❌ | ✅ |

### 快速檢查清單

| 模式 | 檢查項目 |
|:----:|----------|
| 草稿 | ☑ 大豐配色 ☑ 基礎結構 |
| 標準 | ☑ 大豐配色 ☑ Logo ☑ 每卡片底部綠線 |
| 正式 | ☑ 大豐配色 ☑ Logo ☑ 綠線 ☑ AI 背景圖 |
| 精緻 | ☑ 大豐配色 ☑ Logo ☑ 綠線 ☑ AI 圖 ☑ 動畫 |

---

## Logo 放置位置指引

### 放置規則

| 位置 | 何時使用 | 樣式 |
|------|----------|------|
| **封面左側** | ✅ 必要（標準模式以上） | `height: 60px` + `drop-shadow` |
| **內頁頁尾** | ⚠️ 選用（正式對外文件） | `height: 25px`，左下角 |
| **每頁右上角** | ❌ 不建議 | 太多 Logo 會分散注意力 |

### 封面 Logo

```html
<img src="images/dafong-logo.png" alt="大豐環保" class="cover-logo">
```

```css
.cover-logo {
  height: 60px;
  width: auto;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
}
```

### 內頁頁尾 Logo（選用）

```html
<div class="footer-logo">
  <img src="images/dafong-logo.png" alt="大豐環保" class="footer-logo-img">
</div>
```

```css
.footer-logo {
  position: absolute;
  left: 24px;
  bottom: 16px;
}
.footer-logo-img {
  height: 25px;
  width: auto;
  opacity: 0.8;
}
```

### Logo 使用決策

```
報告是什麼類型？
│
├─ 內部草稿 ──────────→ 不需要 Logo
├─ 內部正式文件 ──────→ 封面 Logo
├─ 對外提案/簡報 ─────→ 封面 Logo + 頁尾 Logo（選用）
└─ 品牌宣傳材料 ──────→ 封面 Logo + 每頁頁尾 Logo
```

---

## 常見錯誤與避坑指南

### ❌ 常見錯誤

| 錯誤 | 問題 | 正確做法 |
|------|------|----------|
| 文字用 `#666666` 灰色 | 對比度不足，難以閱讀 | 用 `#1e4a6e` 深海藍 |
| 卡片沒加 `green-line` | 缺少品牌識別 | 每個 `card` 底部加綠線 |
| `highlight-card` 用太多 | 什麼都強調 = 什麼都不強調 | 每份報告最多 1-2 個 |
| Logo 變形拉伸 | 不專業 | 保持原始比例，只設 height |
| 背景圖沒加遮罩 | 文字看不清 | 用 `::after` 加半透明漸層 |
| 圓餅圖角度算錯 | 比例失真 | 比例 × 360deg |

### ✅ 自我檢查清單

製作完報告後，逐項確認：

```
□ 所有文字都看得清楚嗎？（對比度）
□ 每個卡片底部有綠線嗎？
□ highlight-card 是否超過 2 個？
□ Logo 有變形嗎？
□ 背景圖上的文字有加陰影嗎？
□ 表格 hover 效果正常嗎？
□ 在不同螢幕寬度下排版正常嗎？
```

### 除錯技巧

| 問題 | 可能原因 | 檢查方式 |
|------|----------|----------|
| 文字看不見 | 白字配淺背景 | 檢查 `color` 和 `background` |
| Logo 不顯示 | 路徑錯誤 | 確認 `images/` 資料夾有檔案 |
| 圓餅圖不圓 | 寬高不一致 | 確認 `width` = `height` |
| 流程圖擠在一起 | 容器太窄 | 加 `flex-wrap: wrap` |

---

## 響應式與列印優化

### 響應式調整（精緻模式）

```css
/* 平板（<768px） */
@media (max-width: 768px) {
  .cover-card {
    flex-direction: column;
    text-align: center;
    padding: 32px;
  }
  .cover-text h1 {
    font-size: 28px;
    letter-spacing: 2px;
  }
  .benefits {
    flex-direction: column;
  }
  .flow-container {
    flex-wrap: wrap;
  }
  .stages {
    flex-direction: column;
    gap: 24px;
  }
  .timeline::before {
    display: none; /* 隱藏橫向時間軸線 */
  }
}

/* 手機（<480px） */
@media (max-width: 480px) {
  body {
    padding: 16px 12px;
  }
  .card-body {
    padding: 16px;
  }
  table {
    font-size: 13px;
  }
  th, td {
    padding: 10px 8px;
  }
}
```

### 列印優化

```css
@media print {
  body {
    background: white;
    padding: 0;
  }
  .container {
    max-width: 100%;
  }
  .card {
    box-shadow: none;
    border: 1px solid #e0e0e0;
    break-inside: avoid; /* 避免卡片被分頁截斷 */
  }
  .highlight-card {
    -webkit-print-color-adjust: exact; /* 保留背景色 */
    print-color-adjust: exact;
  }
  .benefit:hover {
    transform: none; /* 列印時取消 hover 效果 */
  }
}
```

---

## 與其他 Skill 整合

### 相關 Skill 概覽

| Skill | 用途 | 何時搭配使用 |
|-------|------|--------------|
| `/dafong-presentation-style` | 製作 PowerPoint 簡報 | 需要 .pptx 格式時 |
| `/document-pptx` | HTML → PPTX 轉換工具 | 將 HTML 報告轉為簡報 |
| `/canvas-design` | 生成 PNG/PDF 視覺設計 | 需要海報、單頁圖像時 |

### 與 `/dafong-presentation-style` 搭配

兩個 skill 共用同一套 CIS（企業識別）資源：

```
共用資源：
├── Logo：~/.claude/skills/dafong-presentation-style/resources/ppt_logo.png
├── 主色：深海藍 #1e4a6e
├── 強調色：環保綠 #4caf50
└── 字體：Microsoft JhengHei
```

**工作流程選擇**：

```
需要什麼輸出格式？
│
├─ HTML（網頁瀏覽、螢幕分享）────→ 用 /dafong-html-report
├─ PPTX（實體簡報、投影機）─────→ 用 /dafong-presentation-style
└─ 兩者都要 ─────────────────────→ 先做 HTML，再轉 PPTX
```

### HTML 報告轉 PPTX

當你已有 HTML 報告，需要轉成 PowerPoint：

**步驟 1：拆分 HTML 為投影片**

每個 `card` 區塊對應一張投影片：

| HTML 元件 | PPTX 投影片類型 |
|-----------|-----------------|
| `cover-card` | 封面頁 |
| `highlight-card` | 重點頁（大字） |
| `card` + `flow-section` | 流程說明頁 |
| `card` + `table` | 數據表格頁 |
| `card` + `timeline` | 時程規劃頁 |

**步驟 2：使用 `/document-pptx` 轉換**

```
先讀取 html2pptx.md：
~/.claude/skills/document-pptx/html2pptx.md

投影片尺寸：720pt × 405pt (16:9)
```

**步驟 3：驗證輸出**

生成縮圖確認版面正確。

### 從 HTML 報告抽取內容給 PPTX

如果不是轉換，而是**重新製作**簡報，可以這樣重用內容：

```
HTML 報告                    PPTX 簡報
─────────────────────────────────────────
cover-card 標題文字    →    封面頁標題
highlight-card 數據    →    重點頁大數字
flow-section 步驟      →    流程圖投影片
table 數據            →    表格投影片
timeline 時程         →    時程投影片
```

### Logo 資源共用

兩個 skill 使用同一份 Logo 檔案：

```bash
# HTML 報告使用時，複製到報告的 images 資料夾
cp ~/.claude/skills/dafong-presentation-style/resources/ppt_logo.png ./images/dafong-logo.png

# PPTX 直接引用原路徑
src="resources/ppt_logo.png"
```

### 整合工作流程範例

**情境**：需要同時產出 HTML 報告和 PPT 簡報

```
1. 先用 /dafong-html-report 製作完整 HTML 報告
   └── 包含所有內容、圖表、數據

2. 確認 HTML 報告內容無誤

3. 決定 PPTX 策略：
   ├─ A) 直接轉換：用 /document-pptx 的 html2pptx
   └─ B) 精簡重製：用 /dafong-presentation-style 重新設計
       （簡報通常比報告精簡，不是所有內容都放）

4. 生成 PPTX 並驗證
```

### 與 `/canvas-design` 搭配

當需要單頁圖像（海報、社群圖）而非多頁報告：

| 需求 | 使用 Skill |
|------|------------|
| 多區塊、可捲動的網頁報告 | `/dafong-html-report` |
| 單頁固定尺寸的圖像（PNG/PDF） | `/canvas-design` |
| 多頁投影片（PPTX） | `/dafong-presentation-style` |

**設計資源共用**：

```
/dafong-html-report 的配色和元件風格
可以作為 /canvas-design 的設計參考

顏色一致：#1e4a6e, #4caf50, #2e7d32
字體一致：Microsoft JhengHei
```

---

## HTML 轉 PDF

使用 Playwright 將 HTML 報告轉換為 PDF。

### 環境設定（User 層級，只需設定一次）

```bash
# 檢查全域 playwright
npm list -g playwright

# 若未安裝，執行以下指令
npm install -g playwright
npx playwright install chromium
```

### PDF 轉換方式

Claude 執行 PDF 轉換時，動態產生腳本並執行：

```javascript
// 動態產生的轉換腳本（使用相對路徑）
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 使用相對路徑，自動轉換為 file:// URL
  const htmlFile = 'docs/reports/REPORT_NAME.html';  // 替換為實際檔名
  const pdfFile = 'docs/reports/REPORT_NAME.pdf';

  const htmlPath = 'file:///' + path.resolve(htmlFile).replace(/\\/g, '/');

  await page.goto(htmlPath, { waitUntil: 'networkidle' });
  await page.pdf({
    path: pdfFile,
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' }
  });

  await browser.close();
})();
```

### 注意事項

- **全域安裝**：使用全域 playwright，避免每個專案重複安裝
- **相對路徑**：腳本使用相對於專案根目錄的路徑，確保可移植性
- **背景色**：`printBackground: true` 確保漸層和背景顏色正確輸出
- **邊距**：保留適當邊距，避免內容太靠近紙張邊緣

---

## 列印/PDF 背景色保留（重要）

### 問題說明

瀏覽器列印或轉 PDF 時，預設會移除背景色以節省墨水。這會導致：
- 深色背景區塊變成白底，白色文字看不見
- 漸層背景消失
- 品牌色調完全丟失

### 解決方案：強制保留背景色

**必須在 CSS 中加入以下列印樣式**：

```css
/* ========== 列印優化（保留背景色） ========== */
@media print {
  @page {
    size: A4;
    margin: 10mm;
  }

  /* 全域強制保留背景色 - 三種屬性確保跨瀏覽器相容 */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  /* 保留頁面深色背景 */
  body {
    background: #1e4a6e !important;
    padding: 20px 16px;
  }

  .container {
    max-width: 100%;
  }

  .card {
    box-shadow: none;
    border: 1px solid #e0e0e0;
  }

  /* 封面卡片背景 */
  .cover-card {
    background: linear-gradient(135deg, rgba(30, 74, 110, 0.95) 0%, rgba(45, 90, 126, 0.9) 100%) !important;
  }

  /* 卡片標題列背景 */
  .card-header {
    background: #1e4a6e !important;
  }

  /* 聯絡資訊區塊背景 */
  .contact-section {
    background: rgba(255,255,255,0.1) !important;
  }

  /* 步驟數字圓形背景 */
  .step-number {
    background: linear-gradient(135deg, #1e4a6e, #2d5a7e) !important;
  }

  /* 警示標籤背景 */
  .badge-warning {
    background: #ff9800 !important;
  }

  /* 標準標籤背景 */
  .badge-standard {
    background: #4caf50 !important;
  }

  /* 底部綠線 */
  .green-line {
    background: linear-gradient(90deg, #4caf50, #2e7d32) !important;
  }

  /* 強調區塊背景 */
  .highlight-card {
    background: linear-gradient(135deg, #4caf50, #2e7d32) !important;
  }
}
```

### 關鍵技術要點

| 屬性 | 用途 | 瀏覽器支援 |
|------|------|------------|
| `-webkit-print-color-adjust: exact` | Chrome/Safari/Edge | WebKit 核心 |
| `print-color-adjust: exact` | 標準屬性 | Firefox/現代瀏覽器 |
| `color-adjust: exact` | 舊版標準 | 向後相容 |

### 必須加 `!important` 的元素

所有使用深色背景搭配淺色文字的元素都需要：

```
✅ 需要 !important：
├── body（頁面整體背景）
├── .cover-card（封面區塊）
├── .card-header（卡片標題列）
├── .highlight-card（強調區塊）
├── .contact-section（聯絡資訊）
├── .step-number（步驟數字圓形）
├── .badge-*（所有標籤）
└── .green-line（底部綠線）

❌ 不需要 !important：
├── .card（白色背景卡片）
├── .card-body（白色內容區）
└── table（表格本身是白底）
```

### 檢查清單

製作報告轉 PDF 前，確認：

```
□ @media print 區塊是否存在？
□ 全域 * 選擇器是否有三種 print-color-adjust？
□ body 背景色是否有 !important？
□ 所有深色背景元素是否都有對應的 !important 規則？
□ Playwright 的 printBackground 是否設為 true？
```

### 常見錯誤

| 問題 | 原因 | 解決方法 |
|------|------|----------|
| 封面標題看不見 | 白字配上被移除的深色背景 | 加 `.cover-card` 的 `!important` |
| 步驟數字消失 | 圓形背景被移除 | 加 `.step-number` 的 `!important` |
| 卡片標題看不見 | 標題列背景被移除 | 加 `.card-header` 的 `!important` |
| 整體變白底 | body 背景被移除 | 加 `body` 的 `!important` |
