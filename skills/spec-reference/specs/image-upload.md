# 圖片上傳與壓縮規格

## 概述
前端壓縮圖片後存入 Firestore，確保符合單一欄位大小限制。

## 限制條件

| 項目 | 限制值 | 說明 |
|------|--------|------|
| Firestore 單一欄位 | 1,048,487 bytes | **字串長度**限制（非解碼後大小） |
| 最大圖片尺寸 | 1920 x 1920 px | 長邊不超過此值 |
| 最小圖片尺寸 | 400 x 400 px | 避免壓縮過度影響畫質 |
| 初始壓縮品質 | 0.8 | WebP 格式 |
| 最低壓縮品質 | 0.5 | 品質下限 |
| 最大嘗試次數 | 10 次 | 保證成功壓縮 |

## 實作流程

```
使用者選擇圖片（任意大小）
    ↓
前端 compressImage() 壓縮
    ↓
檢查 dataUrl.length < 1,048,487
    ↓
    ├─ 通過 → 寫入 Firestore
    └─ 未通過 → 降品質或縮尺寸，重複檢查（最多 10 次）
```

### 壓縮策略（保證成功）
1. **先降品質**：從 0.8 逐步降到 0.5
2. **再縮尺寸**：品質到底後，每次縮小約 75%
3. **迴圈嘗試**：最多 10 次，理論上任何圖片都能壓到限制內

## 關鍵程式碼

| 檔案 | 用途 |
|------|------|
| [src/lib/image-utils.ts](../../../src/lib/image-utils.ts) | 壓縮工具函數 |
| [src/components/chat/chat-window.tsx](../../../src/components/chat/chat-window.tsx) | Widget 圖片上傳 |

### 核心函數

```typescript
// src/lib/image-utils.ts
export async function compressImage(
  file: File,
  options?: CompressOptions
): Promise<CompressResult>

// 使用方式
const result = await compressImage(file, {
  maxWidth: 1920,
  maxHeight: 1920,
  maxSizeBytes: 1048487,
});
// result.dataUrl 可直接存入 Firestore
```

## 注意事項

### ⚠️ 字串長度 vs 解碼大小
- Firestore 限制的是 `dataUrl.length`（字串長度）
- **不是** base64 解碼後的原始圖片大小
- base64 編碼會增加約 33%（原始 750KB → dataUrl 約 1MB）

### ⚠️ 錯誤計算方式（已修正）
```javascript
// ❌ 錯誤：計算解碼後大小
const base64 = dataUrl.split(',')[1];
return Math.ceil((base64.length * 3) / 4);

// ✅ 正確：直接用字串長度
return dataUrl.length;
```

### 格式選擇
- 統一使用 **WebP** 格式
- 壓縮率高、瀏覽器相容性佳
- `canvas.toDataURL('image/webp', quality)`

## 變更記錄

| 日期 | 變更內容 |
|------|----------|
| 2026-01-16 | 修正大小計算邏輯：改用 dataUrl.length |
| 2026-01-16 | 初版：建立規格文件 |
