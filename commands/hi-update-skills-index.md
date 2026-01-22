# 更新 Skills 索引

掃描 `~/.claude/skills/` 資料夾，讀取所有 SKILL.md 的 description，並更新 `~/.claude/skills/README.md`。

## 步驟

1. 用 Glob 找出所有 `skills/*/SKILL.md`
2. 用 Grep 提取每個技能的 `description:` 欄位
3. 根據以下分類整理技能：
   - 🧠 流程/工作方法：brainstorming, writing-plans, executing-plans, dispatching-parallel-agents, subagent-driven-development, using-hi-skills
   - 🔧 開發流程：test-driven-development, systematic-debugging, using-git-worktrees, finishing-a-development-branch, requesting-code-review, receiving-code-review, verification-before-completion, webapp-testing
   - 📄 文件處理：document-pdf, document-docx, document-xlsx, document-pptx
   - 🎨 創意/設計：artifacts-builder, canvas-design, brand-guidelines, theme-factory, slack-gif-creator, image-enhancer
   - 📝 內容/寫作：content-research-writer, changelog-generator, internal-comms, jimmy-nian-style
   - 🔍 研究/分析：lead-research-assistant, competitive-ads-extractor, meeting-insights-analyzer, developer-growth-analysis
   - 🛠️ 工具/實用：mcp-builder, file-organizer, invoice-organizer, domain-name-brainstormer, raffle-winner-picker, video-downloader
   - 📋 專案特定：fsr-plan, fsr-exe
   - 🔧 技能管理：skill-creator, writing-skills, skill-share, template-skill
4. 未分類的新技能放到「🆕 未分類」區塊
5. 用 Write 工具更新 README.md
6. 回報新增/移除/變更的技能數量
