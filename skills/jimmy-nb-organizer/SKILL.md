# Jimmy NB 檔案整理器

結合通用檔案整理能力與 Jimmy 個人化分類規則的智慧整理工具。

## 何時使用此技能

- 桌面太亂需要整理
- 下載資料夾一團混亂
- 任何資料夾需要組織
- 尋找重複檔案
- 歸檔舊專案
- 建立新的資料夾結構

## 個人化設定檔

**重要**：此技能參照個人化設定檔 `JIMMY-RULES.md`，位於同目錄下。

- 每次整理時，先讀取 `JIMMY-RULES.md` 取得個人化規則
- 整理完成後，將新學到的分類規則更新回 `JIMMY-RULES.md`

```
~/.claude/skills/jimmy-nb-organizer/
├── SKILL.md          # 通用整理流程（本檔案）
└── JIMMY-RULES.md    # 個人化規則（自動更新）
```

---

## 整理流程

### 第一步：識別電腦並讀取規則

```bash
# 1. 識別當前電腦
echo "電腦名稱: $COMPUTERNAME"
echo "使用者: $USERNAME"

# 2. 讀取個人化設定
cat ~/.claude/skills/jimmy-nb-organizer/JIMMY-RULES.md
```

確認：
- **當前電腦是否已註冊**（在「已註冊的電腦」表格中）
- 如果是新電腦，詢問用途並新增到表格
- 取得該電腦的路徑對應（桌面、文件、下載）
- 標準資料夾結構
- 關鍵字分類規則
- 不動的資料夾清單
- 歷史整理經驗

**新電腦註冊流程**：
```bash
# 取得電腦資訊
echo "電腦名稱: $COMPUTERNAME"
echo "使用者: $USERNAME"
echo "桌面路徑: $USERPROFILE/Desktop"
```
詢問使用者此電腦的用途（公司筆電/個人電腦/其他），然後更新 `JIMMY-RULES.md`。

### 第二步：分析目標資料夾

```bash
# 列出所有內容
ls -la [target_directory]

# 統計檔案類型
find [target_directory] -maxdepth 1 -type f | sed 's/.*\.//' | sort | uniq -c | sort -rn

# 列出資料夾
ls -la [target_directory] | grep "^d"

# 檢查檔案時間範圍
ls -lt [target_directory] | head -20
ls -ltr [target_directory] | head -20
```

總結發現：
- 總檔案和資料夾數
- 檔案類型分布
- 時間跨度
- 明顯的組織問題

### 第三步：制定整理計劃

1. **比對個人化規則**：檢查 `JIMMY-RULES.md` 中的關鍵字分類
2. **識別新模式**：發現規則中沒有的新分類需求
3. **提出計劃**：列出要建立的資料夾、要移動的檔案
4. **標記待決定**：無法自動分類的檔案列出來詢問

### 第四步：執行整理

```bash
# 建立資料夾結構
mkdir -p "path/to/new/folders"

# 移動檔案
mv "old/path/file" "new/path/file"

# 合併資料夾（如果 mv 失敗）
cp -r "source_folder" "dest_folder/" && rm -rf "source_folder"
```

**重要規則**：
- 刪除前始終確認
- 記錄所有移動
- 遇到不確定的檔案，放入「待整理」

### 第五步：更新個人化規則

整理完成後，檢查是否有新的分類規則需要記錄：

1. **新的關鍵字對應**：例如發現「緯創」應該歸到某個專案
2. **新的資料夾結構**：例如新增了「專案-進行中/新專案名稱」
3. **新的不動資料夾**：例如某個資料夾使用者說不要動
4. **整理經驗**：例如某種檔案的最佳處理方式

**自動更新** `JIMMY-RULES.md`：
- 新增關鍵字到對應表
- 更新資料夾結構
- 記錄本次整理經驗

---

## 通用整理功能

### 尋找重複檔案

```bash
# 透過檔名尋找重複
find [directory] -type f -printf '%f\n' | sort | uniq -d

# 透過大小尋找可能重複
find [directory] -type f -printf '%s %p\n' | sort -n | uniq -D -w 10
```

### 按日期歸檔

```bash
# 找出超過 1 年的檔案
find [directory] -type f -mtime +365

# 找出特定年份的檔案
find [directory] -type f -newermt "2023-01-01" ! -newermt "2024-01-01"
```

### 按類型分類

| 類型 | 副檔名 |
|------|--------|
| 文件 | .pdf, .docx, .doc, .txt |
| 試算表 | .xlsx, .xls, .csv |
| 簡報 | .pptx, .ppt |
| 圖片 | .jpg, .png, .gif, .bmp |
| 壓縮檔 | .zip, .rar, .7z |
| 程式碼 | .js, .py, .sql, .html |
| 捷徑 | .lnk |

---

## 整理原則

### 桌面整理準則

1. **桌面是「工作台」，不是「倉庫」**
   - 只放目前正在處理的檔案
   - 目標：控制在 15-20 個以內

2. **定期維護週期**
   | 頻率 | 動作 |
   |------|------|
   | 每天 | 整理當天下載的檔案 |
   | 每週 | 清空暫存、歸檔完成專案 |
   | 每月 | 超過 30 天沒動的 → 歸檔 |
   | 每季 | 找重複檔案、整理歸檔區 |

### 命名規則

**資料夾**：
- 使用清晰描述性名稱
- 用前綴排序：`_捷徑`、`01-進行中`、`02-歸檔`

**檔案**：
- 包含日期：`2025-01-16_會議記錄.docx`
- 移除下載痕跡：`document (1).pdf` → `document.pdf`

### 歸檔時機

- 專案結案超過 6 個月
- 檔案超過 1 年未修改
- 年份開頭的資料夾（如 `2023xxx`）→ 移到 `歸檔-2023/`

---

## 整理報告格式

整理完成後，輸出以下格式：

```markdown
## ✅ 整理完成報告

### 整理前
- 資料夾：X 個
- 散落檔案：Y 個

### 整理後
- 主分類資料夾：X 個
- 已分類檔案：Y 個
- 待決定檔案：Z 個

### 資料夾結構
[顯示新結構樹]

### 待決定檔案
[列出需要使用者決定的檔案]

### 個人化規則更新
- 新增關鍵字：[列表]
- 新增資料夾：[列表]
```

---

## 專案資料夾整理

### 何時使用

當整理的是一個專案資料夾（如 `H2H-Project`、`AI-Chatbot` 等），而非桌面或下載資料夾時。

### 專案整理規則

#### 1. 檔案命名規則

所有檔案加上日期前綴：`YYYY-MM-DD_檔名.副檔名`

```bash
# 範例
報告.pdf → 2026-01-14_報告.pdf
create_pdf.py → 2026-01-14_create_pdf.py
```

**日期來源優先順序**：
1. 檔案修改日期
2. 檔名中已有的日期
3. 當天日期（新檔案）

#### 2. 標準專案資料夾結構

```
專案名稱/
├── docs/                # 文件、筆記、進度記錄 (.md)
│   └── plans/           # 實作計劃
├── 簡報/                # 簡報檔案 (.pptx)
├── 報告/                # 正式報告 (.pdf)
├── 腳本/                # 程式腳本 (.py, .js, .sh)
├── workspace/           # 工作區（子專案、暫存）
├── design-philosophy.md # 設計理念（根目錄）
├── SESSION-NOTES.md     # 工作日誌（根目錄）
└── .gitignore
```

#### 3. 分類規則

| 檔案類型 | 目標資料夾 |
|---------|-----------|
| `.md`（進度、大綱、筆記） | → `docs/` |
| `.md`（利害關係人分析） | → `報告/`（和 PDF 放一起） |
| `.pptx` | → `簡報/` |
| `.pdf`（報告類） | → `報告/` |
| `.pdf`（_protected 保護版） | → `簡報/` |
| `.py`, `.js`, `.sh` | → `腳本/` |
| `design-*.md`, `SESSION-*.md` | → 根目錄（不移動） |

#### 4. 清理規則

刪除以下檔案：
- `tmpclaude-*` - Claude Code 臨時檔案
- `nul` - Windows 保留字空檔案
- 重複檔案（保留有日期前綴的版本）

#### 5. 整理流程

```bash
# 1. 刪除臨時檔案
rm -f "$PROJECT/tmpclaude-*"
rm -f "$PROJECT/nul"

# 2. 建立標準資料夾結構
mkdir -p "$PROJECT/docs" "$PROJECT/簡報" "$PROJECT/報告" "$PROJECT/腳本"

# 3. 移動並重命名檔案（加日期前綴）
# 取得檔案修改日期
date=$(stat -c %y "file.pdf" | cut -d' ' -f1)
mv "file.pdf" "報告/${date}_file.pdf"

# 4. 清理重複檔案（保留有日期的版本）
```

### 專案整理報告格式

```markdown
## ✅ 專案整理完成

### 整理前
- 根目錄檔案：X 個
- 臨時檔案：Y 個

### 整理後
- docs/：X 個文件
- 簡報/：X 個簡報
- 報告/：X 個報告
- 腳本/：X 個腳本

### 清理項目
- 刪除臨時檔案：X 個
- 刪除重複檔案：X 個

### 資料夾結構
[顯示新結構]
```

---

## 合約檔案整理

### 何時使用

當整理的檔案是合約、報價單、簽回文件等商業文件時。

### 合約整理規則

#### 1. 判斷是否為合約類檔案

符合以下條件視為合約類：
- 檔名包含：合約、契約、報價、簽回、協議
- 來自特定客戶或協力廠商

#### 2. 確認主客戶

詢問使用者：
- 這是哪個主客戶的案件？（如：台積電）
- 是否透過協力廠商？（如：智聯）

#### 3. 檔案命名

**格式**：`YYYY-MM-[協力廠商]-[描述].pdf`

```bash
# 範例
大豐環保-服務費 2.pdf → 2026-01-智聯-大豐環保服務費報價.pdf
大豐環保-服務費_簽回.pdf → 2026-01-智聯-大豐環保服務費簽回.pdf
```

#### 4. 存放位置

```
桌面/合約管理/[主客戶]/
```

#### 5. 整理流程

```bash
# 1. 建立合約管理資料夾
mkdir -p "$DESKTOP/合約管理/台積電"

# 2. 移動並重新命名
mv "原檔名.pdf" "$DESKTOP/合約管理/台積電/2026-01-智聯-描述.pdf"
```

### 合約整理報告格式

```markdown
## ✅ 合約歸檔完成

### 檔案
- 原始檔名：xxx.pdf
- 新檔名：2026-01-智聯-xxx.pdf

### 存放位置
桌面/合約管理/台積電/

### 命名規則
- 年月：2026-01
- 協力廠商：智聯
- 描述：大豐環保服務費報價
```

---

## 注意事項

- 整理前先讀取 `JIMMY-RULES.md`
- 整理後必須更新 `JIMMY-RULES.md`
- 不確定的檔案放入「待整理」，不要擅自刪除
- 尊重「不動的資料夾」清單
- **專案整理**：檔案加日期前綴，按類型分資料夾
- **合約整理**：依主客戶分資料夾，檔名含協力廠商和日期

---

## Windows 檔案刪除規則

**重要**：在 Windows 環境下刪除檔案時，必須使用垃圾桶而非永久刪除。

### 禁止使用

```bash
# 禁止 - 會永久刪除
rm -rf "檔案或資料夾"
rm -f "檔案"
```

### 正確做法 - 使用 PowerShell 移到垃圾桶

```powershell
# 刪除單一檔案到垃圾桶
powershell -Command "Add-Type -AssemblyName Microsoft.VisualBasic; [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile('檔案路徑', 'OnlyErrorDialogs', 'SendToRecycleBin')"

# 刪除資料夾到垃圾桶
powershell -Command "Add-Type -AssemblyName Microsoft.VisualBasic; [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory('資料夾路徑', 'OnlyErrorDialogs', 'SendToRecycleBin')"
```

### 範例

```bash
# 刪除桌面上的檔案到垃圾桶
powershell -Command "Add-Type -AssemblyName Microsoft.VisualBasic; [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile('C:\Users\jimmy.nian\Desktop\test.pdf', 'OnlyErrorDialogs', 'SendToRecycleBin')"

# 刪除資料夾到垃圾桶
powershell -Command "Add-Type -AssemblyName Microsoft.VisualBasic; [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory('C:\Users\jimmy.nian\Desktop\舊資料夾', 'OnlyErrorDialogs', 'SendToRecycleBin')"
```

### 例外情況

以下可以使用 `rm` 永久刪除：
- `tmpclaude-*` Claude 暫存檔
- `.DS_Store` Mac 系統檔
- `__MACOSX` Mac 解壓縮垃圾
- `nul` Windows 保留字空檔
