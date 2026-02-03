---
name: git-commit-principles
description: Git 提交原則。當執行 git commit 或 /auto-commit 時自動套用此原則。
---

# Git 提交原則

## 核心原則：依功能分類

每個 commit 應該代表一個獨立、完整的功能變更。不同功能的變更必須分開提交。

## 分類規則

### 1. 功能邊界判斷

| 情境 | 處理方式 |
|------|----------|
| 同一功能的 docs + code | 一起提交 |
| 不同功能的變更 | 分開提交 |
| 功能程式碼 + 對應測試 | 一起提交 |
| 純重構（無功能變更） | 單獨提交 |
| 純文件更新 | 單獨提交 |

### 2. 常見分類範例

```
功能 A 的變更：
├── src/components/feature-a/
├── src/services/feature-a-service.ts
├── src/__tests__/feature-a.test.ts
└── docs/plans/feature-a-design.md
→ 一個 commit

功能 B 的變更：
├── src/components/feature-b/
└── src/services/feature-b-service.ts
→ 另一個 commit

共用依賴更新：
├── package.json
└── package-lock.json
→ 跟隨使用該依賴的功能一起提交，或單獨提交
```

## 提交訊息格式

使用 Conventional Commits，繁體中文描述：

```
<type>: <簡短描述>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Type 對照

| type | 使用時機 |
|------|---------|
| `feat` | 新功能 |
| `fix` | 錯誤修復 |
| `docs` | 純文件變更 |
| `refactor` | 重構（不改功能） |
| `test` | 純測試變更 |
| `chore` | 建置/工具變更 |
| `style` | 格式調整 |

### Scope（可選）

當變更屬於特定模組時加上 scope：

```
feat(ai-studio): 新增 A/B 測試功能
fix(inbox): 修復訊息重複顯示問題
docs(line): 新增 LINE 整合設計文件
```

## 執行流程

1. `git status` 檢視所有變更
2. 依功能分組變更的檔案
3. 詢問使用者確認分組方式（如有多個功能）
4. 依序提交每個功能群組
5. 確認所有變更已提交

## 特殊情況

### 混合變更

當 `git status` 顯示多個不相關功能的變更時：

1. 列出變更並分組
2. 詢問：「這些變更要一起提交還是分開？」
3. 依使用者指示執行

### 單一功能

當所有變更都屬於同一功能時，直接提交，不需詢問。
