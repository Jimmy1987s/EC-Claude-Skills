/**
 * 測試內容分析器模組
 */

const { analyzeSlide, analyzePresentation, generateVisualSummary } = require('../modules/content-analyzer');

// 測試資料：模擬 Daniels Health 簡報的投影片
const testSlides = [
  {
    title: '針扎傷害減少 87%',
    content: '經過同行評審研究，使用 Sharpsmart 容器後，醫護人員的針扎傷害減少了 87%。這是業界最高的安全性數據。'
  },
  {
    title: '服務流程',
    content: '步驟 1: 安裝容器 → 步驟 2: 定期收運 → 步驟 3: 專業處理 → 步驟 4: 數據追蹤'
  },
  {
    title: '傳統容器 vs Sharpsmart',
    content: '傳統一次性容器有刺穿風險，需要頻繁更換。Sharpsmart 可重複使用，有 13 項安全設計，✓ 防刺穿 ✓ 防溢出 ✗ 傳統容器無此功能'
  },
  {
    title: '公司發展歷程',
    content: '1986 年在澳洲創立，2000 年進入美國市場，2015 年成為美國第二大醫療廢棄物公司，2024 年服務超過 8,200 家客戶。'
  },
  {
    title: '關於 Daniels Health',
    content: 'Daniels Health 是全球醫療廢棄物管理領導者，總部位於芝加哥，在 6 國設有營運據點，創辦人 Dan Daniels 至今擔任 CEO。'
  },
  {
    title: '核心價值與願景',
    content: '我們的策略是將安全性作為核心競爭力，商業模式是一條龍服務，從容器到處理全程管理，實現永續發展與成本效益的雙贏。'
  },
  {
    title: '總結',
    content: '感謝您的時間，如有任何問題歡迎聯繫。'
  }
];

console.log('=== 內容分析器測試 ===\n');

// 測試單張投影片分析
console.log('1. 測試單張投影片分析:\n');
const singleAnalysis = analyzeSlide({ ...testSlides[0], index: 0 });
console.log('投影片:', testSlides[0].title);
console.log('分析結果:', JSON.stringify(singleAnalysis, null, 2));
console.log();

// 測試整份簡報分析
console.log('2. 測試整份簡報分析:\n');
const allAnalyses = analyzePresentation(testSlides);

for (let i = 0; i < allAnalyses.length; i++) {
  const analysis = allAnalyses[i];
  console.log(`投影片 ${i + 1}: ${testSlides[i].title}`);
  console.log(`  類型: ${analysis.contentTypeName} (${analysis.contentType})`);
  console.log(`  視覺需求: ${analysis.visualNeed}`);
  if (analysis.infographicType) {
    console.log(`  資訊圖表類型: ${analysis.infographicType}`);
  }
  if (analysis.photoCategory) {
    console.log(`  照片類別: ${analysis.photoCategory}`);
  }
  console.log(`  匹配分數: ${analysis.matchScore}`);
  console.log();
}

// 測試視覺摘要
console.log('3. 視覺需求摘要:\n');
const summary = generateVisualSummary(allAnalyses);
console.log('總投影片數:', summary.totalSlides);
console.log('需要資訊圖表:', summary.infographicCount);
console.log('需要照片:', summary.photoCount);
console.log('不需視覺:', summary.noVisualCount);
console.log('預估成本: $', summary.estimatedCost);
console.log('類型分布:', summary.byType);

console.log('\n=== 測試完成 ===');
