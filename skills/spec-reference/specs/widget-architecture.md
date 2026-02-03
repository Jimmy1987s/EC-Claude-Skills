# Widget 整體架構規格

## 概述
Widget 是嵌入式聊天元件，透過 iframe 嵌入客戶網站，提供訪客與 AI/客服的即時對話功能。

## 架構組成

```
┌─────────────────────────────────────────────────────────────────┐
│  客戶網站                                                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  widget.js（外層容器）                                      │  │
│  │  - 載入按鈕、視窗容器                                       │  │
│  │  - 自動開啟觸發器                                          │  │
│  │  - postMessage 通訊                                        │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  iframe (/embed)                                    │  │  │
│  │  │  ┌───────────────────────────────────────────────┐  │  │  │
│  │  │  │  chat-widget.tsx（React 元件）                 │  │  │  │
│  │  │  │  - 訊息狀態管理                               │  │  │  │
│  │  │  │  - Firestore 即時同步                         │  │  │  │
│  │  │  │  - Buffer 佇列控制                            │  │  │  │
│  │  │  └───────────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 關鍵檔案

| 檔案 | 用途 |
|------|------|
| [public/widget.js](../../../Hi-ChatBot/public/widget.js) | 外層容器、樣式、postMessage |
| [src/components/widget/chat-widget.tsx](../../../Hi-ChatBot/src/components/widget/chat-widget.tsx) | React 核心元件 |
| [src/components/chat/chat-window.tsx](../../../Hi-ChatBot/src/components/chat/chat-window.tsx) | 聊天視窗 UI |
| [src/app/embed/page.tsx](../../../Hi-ChatBot/src/app/embed/page.tsx) | iframe 進入點 |
| [src/app/api/widget/chat/route.ts](../../../Hi-ChatBot/src/app/api/widget/chat/route.ts) | Chat API |
| [src/app/api/widget/buffer/route.ts](../../../Hi-ChatBot/src/app/api/widget/buffer/route.ts) | Buffer API |

## 訊息處理流程

### 正常流程（AI 未回覆中）

```
使用者輸入訊息
    ↓
[樂觀更新] 立即顯示在 UI（optimisticMessages）
    ↓
[寫入 Firestore] 訊息立即持久化
    ↓
[Buffer API] 加入緩衝區
    ↓
[等待計時器] 基礎等待時間 + 連發加成時間
    ↓
[Chat API] 合併訊息，呼叫 AI
    ↓
[AI 回覆] 寫入 Firestore → onSnapshot 同步到 UI
```

### 排隊流程（AI 回覆中）- 2026-01-16 新增

```
使用者輸入訊息（AI 正在回覆）
    ↓
[樂觀更新] 立即顯示在 UI
    ↓
[寫入 Firestore] 訊息立即持久化
    ↓
[等待佇列] 加入 pendingQueue（不觸發 AI）
    ↓
... AI 回覆完成 ...
    ↓
[自動處理] 佇列訊息進入 Buffer 流程
    ↓
[觸發下一輪 AI]
```

## 狀態管理

### chat-widget.tsx 核心狀態

| 狀態 | 類型 | 說明 |
|------|------|------|
| `messages` | `ChatMessage[]` | Firestore 同步的訊息 |
| `optimisticMessages` | `ChatMessage[]` | 樂觀更新，等待 Firestore 確認 |
| `pendingQueue` | `Array<{text, attachment}>` | AI 回覆中的等待佇列 |
| `isLoading` | `boolean` | AI 是否正在回覆 |
| `queueSize` | `number` | Buffer 佇列大小 |
| `isQueueFull` | `boolean` | 佇列是否已滿 |

### 顯示邏輯

```typescript
// 可見訊息 = Firestore 訊息（已顯示的）+ 樂觀訊息
const displayMessages = [...visibleMessages, ...optimisticMessages];
```

## Buffer 機制

### 設定項目

| 設定 | 預設值 | 說明 |
|------|--------|------|
| 基礎等待時間 | 1 秒 | 收到訊息後的基本等待 |
| 連發加成時間 | +4 秒 | 30 秒內連發額外等待 |
| 最大排隊訊息數 | 5 則 | AI 回覆前的佇列上限 |

### 合併規則

- 多則訊息以換行合併
- 圖片取最後一則的附件
- 等待時間內的訊息視為同一批

## postMessage 通訊

### widget.js → iframe

| 類型 | 說明 |
|------|------|
| `open-widget` | 開啟聊天視窗 |
| `auto-open-with-greeting` | 自動開啟並發送問候語 |

### iframe → widget.js

| 類型 | 說明 |
|------|------|
| `widget-ready` | Widget 準備完成，包含設定 |
| `close-widget` | 關閉視窗 |
| `unread-count` | 未讀訊息數更新 |
| `switch-to-chat-compact` | LINE 風格切換到聊天模式 |
| `reset-widget` | 重置 Widget 狀態 |

## LINE 風格模式

### 狀態切換

```
[LINE 歡迎畫面] → 點擊/發送訊息 → [LINE 聊天模式]
   line-welcome                      line-chat
```

### 視窗尺寸

| 模式 | 桌面版 | 手機版 |
|------|--------|--------|
| 歡迎畫面 | 280px × 240px | 同左 |
| 聊天模式 | 370px × 500px | 滿版（留邊距） |

## 注意事項

### 訊息順序
- Firestore 使用 `timestamp` 排序
- 樂觀訊息顯示在最後
- AI 回覆透過 `pendingAiQueue` 逐則延遲顯示

### 重複訊息防護
- `processedIdsRef` 追蹤已處理的訊息 ID
- `greetingWrittenRef` 防止問候語重複寫入

### 手機版適配
- 使用 `dvh` 單位處理動態網址列
- `safe-area-inset-bottom` 處理底部安全區域

## 變更記錄

| 日期 | 變更內容 |
|------|----------|
| 2026-01-16 | 新增 pendingQueue 排隊機制設計 |
| 2026-01-16 | 初版：建立架構規格文件 |
