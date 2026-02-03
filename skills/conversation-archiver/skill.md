---
name: conversation-archiver
description: 備份 Claude Code 對話原始檔案。當對話太長想要保留原始對話時使用。
---

# 對話備份器

備份當前 Claude Code 對話的原始 .jsonl 檔案，保留完整對話記錄。

## 何時使用此 Skill

- 使用者說「對話太長了，幫我備份」、「備份對話」
- 使用者說「archive conversation」、「backup conversation」
- 對話變得太長，想要保留原始記錄
- 使用者想要在開始新對話前保存當前對話

## 備份位置與命名格式

```
~/.claude/conversation-archives/[專案名稱]/[日期]_[主題]_[sessionId前8碼].jsonl
```

例如：
```
~/.claude/conversation-archives/Hi-ChatBot/2026-01-10_MCP服務器配置_b9fcd561.jsonl
~/.claude/conversation-archives/claude-config/2026-01-10_對話備份功能開發_a1b2c3d4.jsonl
```

**命名規則**：
- `日期`: YYYY-MM-DD 格式
- `主題`: 簡短描述對話主題（支援中文，用連字號或底線連接多個詞）
- `sessionId前8碼`: 保留原始 Session ID 以便還原

## 如何使用

```
/conversation-archiver
```

備份當前對話的原始 .jsonl 檔案。

## 執行步驟

### 1. 確認備份目錄存在

```bash
mkdir -p ~/.claude/conversation-archives/[專案名稱]
```

專案名稱從工作目錄推導，例如：
- `c:\Users\jimmy.nian\Documents\Claude\Hi-ChatBot` → `Hi-ChatBot`

### 2. 找到當前對話檔案

**使用對話中最近一則使用者訊息來搜尋**：

從對話歷史中取得使用者最近說的一句獨特的話（觸發此 skill 的那句話最佳），用 grep 搜尋：

```bash
# 範例：使用者說「幫我備份對話」
grep -l "幫我備份對話" ~/.claude/projects/[編碼專案路徑]/*.jsonl
```

**編碼專案路徑規則**：
- `c:\Users\jimmy.nian\Documents\Claude\Hi-ChatBot`
- → `c--Users-jimmy-nian-Documents-Claude-Hi-ChatBot`

**注意**：如果搜尋到多個檔案，用更獨特的關鍵字再搜尋一次。

### 3. 自動推導對話主題

**不要詢問使用者**，直接從對話內容自動推導一個簡短主題：

- 分析對話中討論的主要功能或任務
- 使用簡潔的中文描述（5-15 個字）
- 多個主題時用「與」連接，例如：「LINE風格Widget與網域引導人設整合」

### 4. 複製並重新命名對話檔案

```bash
# 取得今天日期
DATE=$(date +%Y-%m-%d)

# 取得 sessionId 前 8 碼
SHORT_ID=${sessionId:0:8}

# 複製並重新命名
cp ~/.claude/projects/[編碼專案路徑]/[sessionId].jsonl \
   ~/.claude/conversation-archives/[專案名稱]/${DATE}_[主題]_${SHORT_ID}.jsonl
```

### 5. 回報結果

```
✅ 對話已備份

📄 備份位置：~/.claude/conversation-archives/Hi-ChatBot/2026-01-10_MCP服務器配置_b9fcd561.jsonl
📊 檔案大小：X MB
🆔 Session ID：b9fcd561-0854-476f-b296-a26b358fc4f5

原始對話仍在原位，可正常使用 --resume 繼續。
```

## 還原備份

使用 `/conversation-restorer` skill 來還原已備份的對話。

## 查看備份

```bash
# 列出所有備份
ls ~/.claude/conversation-archives/

# 查看特定專案的備份
ls -la ~/.claude/conversation-archives/Hi-ChatBot/
```

## 注意事項

- 原始 .jsonl 檔案不會被刪除，只是複製備份
- 備份位置不會被 Claude Code 掃描，不會在對話列表中出現
- 備份檔保留完整對話內容，可隨時還原

## 相關 Skill

- `/conversation-restorer` - 還原備份的對話
