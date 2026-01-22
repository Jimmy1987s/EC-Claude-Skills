# Hi-Ace 統一工作流程

統一入口管理三階段開發流程：brainstorm → write-plan → execute-plan

## 啟動流程

### 1. 更新並讀取索引

先執行 `/hi-update-plans-index` 更新索引，然後讀取 `~/.claude/plans/index.yaml`：

**索引檔格式**（`YYYY-MM-DD-<project-name>.md`）：
```yaml
# project-name

project_path: /path/to/project
status: brainstorm | planning | executing | done
phase: 1  # 當前階段編號（執行中時使用）
design_file: docs/plans/YYYY-MM-DD-<topic>-design.md
plan_file: docs/plans/YYYY-MM-DD-<topic>-plan.md  # 可選
```

**狀態對應**：
```
status 值                             → 專案階段
-----------------------------------------
brainstorm                            → 正在腦力激盪
planning                              → 設計完成，正在撰寫計畫
executing                             → 計畫完成，正在執行
done                                  → 已完成
```

**實際檔案位置**：
- 設計文件、實作計畫等**詳細檔案都在專案目錄內**：`<project_path>/docs/plans/`
- 索引檔只是輕量追蹤，指向專案位置

### 2. 選擇專案

- **有未完成專案時**：使用 AskUserQuestion 列出選單
  - 選項依最近修改時間排序，最近的在最上方並標註「(最近)」
  - 顯示每個專案的當前階段（從索引檔的 status 讀取）
  - 最後一個選項是「開始新專案」

- **無未完成專案時**：直接詢問「想做什麼？」開始新專案

### 3. 根據狀態執行對應階段

## 階段執行

### 階段 1 - Brainstorm

1. 調用 `brainstorming` skill
2. 遵循 skill 的一次一個問題流程
3. 完成後：
   - 產出設計文件到：`<project_path>/docs/plans/YYYY-MM-DD-<topic>-design.md`
   - 建立/更新索引檔：`~/.claude/plans/YYYY-MM-DD-<project-name>.md`（status: planning）
4. **自動進入階段 2**

### 階段 2 - Write Plan

1. 讀取對應的 `*-design.md` 檔案作為上下文
2. 調用 `writing-plans` skill
3. 根據設計文件撰寫詳細實作計畫
4. 完成後：
   - 產出計畫到：`<project_path>/docs/plans/YYYY-MM-DD-<topic>-plan.md`
   - 更新索引檔 status: executing
5. **自動進入階段 3**

### 階段 3 - Execute

1. 讀取對應的 `*-design.md` 和 `*-plan.md` 作為上下文
2. 調用 `executing-plans` skill
3. 按計畫逐步執行，帶審查檢查點
4. 完成後執行「完成處理」

## 完成處理

1. 將專案目錄的檔案（`*-design.md`、`*-plan.md`）移到 `<project_path>/docs/plans/archive/`
2. 將索引檔移到 `~/.claude/plans/archive/`
3. 詢問：「專案完成！要開始新專案嗎？」
   - 是 → 回到啟動流程
   - 否 → 結束

## 檔案結構範例

```
~/.claude/plans/
├── 2026-01-04-yoga-tw.md              # 索引檔（輕量追蹤）
├── 2026-01-05-another-project.md
└── archive/
    └── 2025-12-01-old-project.md      # 已完成的索引

<project>/docs/plans/
├── 2026-01-04-yoga-tw-design.md       # 設計文件（詳細）
├── 2026-01-04-yoga-tw-phase1-foundation.md  # 實作計畫（詳細）
└── archive/
    └── ...                            # 已完成的計畫
```

## 檔案命名規則

**索引檔**（在 `~/.claude/plans/`）：
- 格式：`YYYY-MM-DD-<project-name>.md`

**設計/計畫檔**（在專案目錄）：
- 格式：`YYYY-MM-DD-<topic>-<type>.md`
- topic：小寫、連字號分隔（如 `logout-button`、`dark-mode`）
- type：`design`（設計）或 `plan`（計畫）

## 中途離開

使用者可隨時離開對話。下次執行 `/hi-ace` 時：
- 掃描 `~/.claude/plans/` 的索引檔
- 根據 project_path 找到專案目錄
- 從索引檔的 status 判斷上次停的階段繼續

## 全域規則

### Git Commit 規範

所有 commit 訊息必須：
- 使用**繁體中文**描述
- 遵循 Conventional Commits 格式：`<type>: <描述>`
- 類型包括：`feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`test`、`chore`

範例：
```
feat: 新增多語系管理功能
fix: 修復對話訊息重複顯示的問題
docs: 新增智能工作室架構優化設計文件
```
