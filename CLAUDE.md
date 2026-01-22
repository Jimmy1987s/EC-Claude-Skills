# Global Guidelines

For project architecture and conventions, see [README.md](README.md).

## Communication
- 回覆使用繁體中文
- 程式碼註解使用繁體中文

## Testing Preferences
- 當使用者說「測試一下」時，使用 `/browser-testing` 技能進行瀏覽器測試
- 開發伺服器測試優先使用 PORT 3300：`npm run dev -- -p 3300`
- 若 PORT 3300 被佔用，可選擇其他可用端口（如 3301、3302 等）
- 33xx 端口範圍保留給 VSCode 開發測試使用
- 測試完畢後關閉伺服器

## Skill 自動升級
- 每次瀏覽器測試完成後，自動檢視是否有新的經驗值可記錄到相關 skill
- 經驗值包括：新發現的問題、解決方案、選擇器技巧、超時設定等
- 升級時機：測試結束後，無論成功或失敗
- 升級方式：直接編輯 `~/.claude/skills/<skill-name>/SKILL.md`
- 不需要使用者額外要求，自主進行

## Code Style
- 使用 2 空格縮進
- 優先使用 TypeScript

## Constraints
- 修改前先讀取檔案
- 不做未要求的重構
