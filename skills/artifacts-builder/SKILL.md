---
name: artifacts-builder
description: 使用現代前端網頁技術（React、Tailwind CSS、shadcn/ui）建立精緻的多元件 claude.ai HTML 成品的工具套件。適用於需要狀態管理、路由或 shadcn/ui 元件的複雜成品 - 不適用於簡單的單檔 HTML/JSX 成品。
license: 完整條款請見 LICENSE.txt
---

# 成品建構器

要建構強大的前端 claude.ai 成品，請遵循以下步驟：
1. 使用 `scripts/init-artifact.sh` 初始化前端儲存庫
2. 編輯生成的程式碼來開發您的成品
3. 使用 `scripts/bundle-artifact.sh` 將所有程式碼打包成單一 HTML 檔案
4. 向使用者展示成品
5. （選用）測試成品

**技術堆疊**：React 18 + TypeScript + Vite + Parcel（打包）+ Tailwind CSS + shadcn/ui

## 設計與風格指南

非常重要：為避免常被稱為「AI 泥沙」的問題，請避免使用過多的置中版面、紫色漸層、統一的圓角和 Inter 字型。

## 快速入門

### 步驟 1：初始化專案

執行初始化腳本以建立新的 React 專案：
```bash
bash scripts/init-artifact.sh <project-name>
cd <project-name>
```

這會建立一個完整配置的專案，包含：
- ✅ React + TypeScript（透過 Vite）
- ✅ Tailwind CSS 3.4.1 搭配 shadcn/ui 主題系統
- ✅ 路徑別名（`@/`）已配置
- ✅ 40+ 個 shadcn/ui 元件已預先安裝
- ✅ 包含所有 Radix UI 依賴項目
- ✅ Parcel 已配置用於打包（透過 .parcelrc）
- ✅ Node 18+ 相容性（自動偵測並鎖定 Vite 版本）

### 步驟 2：開發您的成品

要建構成品，請編輯生成的檔案。請參閱下方的**常見開發任務**以獲取指導。

### 步驟 3：打包成單一 HTML 檔案

要將 React 應用程式打包成單一 HTML 成品：
```bash
bash scripts/bundle-artifact.sh
```

這會建立 `bundle.html` - 一個包含所有 JavaScript、CSS 和依賴項目的獨立成品。此檔案可以直接在 Claude 對話中作為成品分享。

**要求**：您的專案必須在根目錄有一個 `index.html`。

**腳本的作用**：
- 安裝打包依賴項目（parcel、@parcel/config-default、parcel-resolver-tspaths、html-inline）
- 建立具有路徑別名支援的 `.parcelrc` 配置
- 使用 Parcel 建構（無原始碼映射）
- 使用 html-inline 將所有資源內嵌到單一 HTML 中

### 步驟 4：與使用者分享成品

最後，在對話中與使用者分享打包的 HTML 檔案，以便他們可以將其作為成品查看。

### 步驟 5：測試/視覺化成品（選用）

注意：這是一個完全選用的步驟。僅在必要或被要求時執行。

要測試/視覺化成品，請使用可用的工具（包括其他 Skills 或內建工具如 Playwright 或 Puppeteer）。一般來說，避免預先測試成品，因為這會增加請求和查看完成成品之間的延遲。如果被要求或出現問題，請在展示成品後再進行測試。

## 參考資料

- **shadcn/ui 元件**：https://ui.shadcn.com/docs/components
