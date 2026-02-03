---
name: using-git-worktrees
description: 當開始需要與當前工作區隔離的功能工作或在執行實作計劃之前使用 - 建立具有智慧目錄選擇和安全驗證的隔離 git 工作樹
---

# 使用 Git 工作樹

## 概述

Git 工作樹建立共享同一儲存庫的隔離工作區，允許同時在多個分支上工作而無需切換。

**核心原則：** 系統性目錄選擇 + 安全驗證 = 可靠的隔離。

**開始時宣布：** "我正在使用 using-git-worktrees 技能來設定隔離的工作區。"

## 目錄選擇流程

按此優先順序：

### 1. 檢查現有目錄

```bash
# 按優先順序檢查
ls -d .worktrees 2>/dev/null     # 首選（隱藏）
ls -d worktrees 2>/dev/null      # 替代
```

**如果找到：** 使用該目錄。如果兩者都存在，`.worktrees` 優先。

### 2. 檢查 CLAUDE.md

```bash
grep -i "worktree.*director" CLAUDE.md 2>/dev/null
```

**如果指定了偏好：** 使用它而不詢問。

### 3. 詢問使用者

如果沒有目錄存在且沒有 CLAUDE.md 偏好：

```
未找到工作樹目錄。我應該在哪裡建立工作樹？

1. .worktrees/（專案本地，隱藏）
2. ~/.config/hi-skills/worktrees/<project-name>/（全域位置）

你偏好哪個？
```

## 安全驗證

### 對於專案本地目錄（.worktrees 或 worktrees）

**必須在建立工作樹之前驗證目錄被忽略：**

```bash
# 檢查目錄是否被忽略（尊重本地、全域和系統 gitignore）
git check-ignore -q .worktrees 2>/dev/null || git check-ignore -q worktrees 2>/dev/null
```

**如果沒有被忽略：**

根據 Jesse 的規則"立即修復壞掉的東西"：
1. 將適當的行添加到 .gitignore
2. 提交變更
3. 繼續建立工作樹

**為什麼關鍵：** 防止意外將工作樹內容提交到儲存庫。

### 對於全域目錄（~/.config/hi-skills/worktrees）

不需要 .gitignore 驗證 - 完全在專案之外。

## 建立步驟

### 1. 偵測專案名稱

```bash
project=$(basename "$(git rev-parse --show-toplevel)")
```

### 2. 建立工作樹

```bash
# 確定完整路徑
case $LOCATION in
  .worktrees|worktrees)
    path="$LOCATION/$BRANCH_NAME"
    ;;
  ~/.config/hi-skills/worktrees/*)
    path="~/.config/hi-skills/worktrees/$project/$BRANCH_NAME"
    ;;
esac

# 用新分支建立工作樹
git worktree add "$path" -b "$BRANCH_NAME"
cd "$path"
```

### 3. 執行專案設定

自動偵測並執行適當的設定：

```bash
# Node.js
if [ -f package.json ]; then npm install; fi

# Rust
if [ -f Cargo.toml ]; then cargo build; fi

# Python
if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
if [ -f pyproject.toml ]; then poetry install; fi

# Go
if [ -f go.mod ]; then go mod download; fi
```

### 4. 驗證乾淨基線

執行測試以確保工作樹從乾淨狀態開始：

```bash
# 範例 - 使用專案適當的命令
npm test
cargo test
pytest
go test ./...
```

**如果測試失敗：** 報告失敗，詢問是否繼續或調查。

**如果測試通過：** 報告準備好了。

### 5. 報告位置

```
工作樹準備好在 <full-path>
測試通過（<N> 測試，0 失敗）
準備實作 <feature-name>
```

## 快速參考

| 情況 | 動作 |
|-----------|--------|
| `.worktrees/` 存在 | 使用它（驗證被忽略） |
| `worktrees/` 存在 | 使用它（驗證被忽略） |
| 兩者都存在 | 使用 `.worktrees/` |
| 都不存在 | 檢查 CLAUDE.md → 詢問使用者 |
| 目錄未被忽略 | 添加到 .gitignore + 使用 `/auto-commit` 提交 |
| 基線測試失敗 | 報告失敗 + 詢問 |
| 沒有 package.json/Cargo.toml | 跳過依賴安裝 |

## 常見錯誤

### 跳過忽略驗證

- **問題：** 工作樹內容被追蹤，污染 git status
- **修復：** 在建立專案本地工作樹之前始終使用 `git check-ignore`

### 假設目錄位置

- **問題：** 造成不一致，違反專案慣例
- **修復：** 遵循優先順序：現有 > CLAUDE.md > 詢問

### 在測試失敗時繼續

- **問題：** 無法區分新錯誤和預先存在的問題
- **修復：** 報告失敗，獲得明確許可才繼續

### 硬編碼設定命令

- **問題：** 在使用不同工具的專案上壞掉
- **修復：** 從專案檔案自動偵測（package.json 等）

## 範例工作流程

```
你：我正在使用 using-git-worktrees 技能來設定隔離的工作區。

[檢查 .worktrees/ - 存在]
[驗證被忽略 - git check-ignore 確認 .worktrees/ 被忽略]
[建立工作樹：git worktree add .worktrees/auth -b feature/auth]
[執行 npm install]
[執行 npm test - 47 通過]

工作樹準備好在 /Users/jesse/myproject/.worktrees/auth
測試通過（47 測試，0 失敗）
準備實作 auth 功能
```

## 危險信號

**絕不：**
- 在未驗證被忽略的情況下建立工作樹（專案本地）
- 跳過基線測試驗證
- 在測試失敗時不詢問就繼續
- 在模糊時假設目錄位置
- 跳過 CLAUDE.md 檢查

**始終：**
- 遵循目錄優先順序：現有 > CLAUDE.md > 詢問
- 驗證目錄被忽略（專案本地）
- 自動偵測並執行專案設定
- 驗證乾淨測試基線

## 整合

**被以下呼叫：**
- **brainstorming**（第 4 階段）- 當設計被批准且實作隨後時必要
- 任何需要隔離工作區的技能

**配合使用：**
- **finishing-a-development-branch** - 工作完成後清理必要
- **executing-plans** 或 **subagent-driven-development** - 工作在這個工作樹中進行
