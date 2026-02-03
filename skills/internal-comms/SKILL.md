---
name: internal-comms
description: 一組資源，協助我使用公司偏好的格式撰寫各種內部溝通文件。當被要求撰寫任何形式的內部溝通（狀態報告、領導層更新、3P 更新、公司通訊、FAQ、事件報告、專案更新等）時，Claude 應使用此技能。
license: Complete terms in LICENSE.txt
---

## 何時使用此技能
撰寫內部溝通文件時，此技能適用於：
- 3P 更新（Progress、Plans、Problems）
- 公司通訊
- FAQ 回應
- 狀態報告
- 領導層更新
- 專案更新
- 事件報告

## 如何使用此技能

撰寫任何內部溝通文件時：

1. **從請求中識別溝通類型**
2. **從 `examples/` 目錄載入適當的指南檔案**：
    - `examples/3p-updates.md` - 用於 Progress/Plans/Problems 團隊更新
    - `examples/company-newsletter.md` - 用於全公司通訊
    - `examples/faq-answers.md` - 用於回答常見問題
    - `examples/general-comms.md` - 用於任何其他未明確符合上述類型的文件
3. **遵循該檔案中關於格式、語調和內容收集的具體指示**

如果溝通類型不符合任何現有指南，請要求釐清或詢問所需格式的更多背景資訊。

## 關鍵字
3P updates、company newsletter、company comms、weekly update、faqs、common questions、updates、internal comms
