/**
 * 測試視覺決策器模組
 */

const { decideVisual, decidePresentationVisuals, validateDecision } = require('../modules/visual-decider');

// 注意：已移除 Unsplash，全部使用 Kie.ai

// 測試資料
const testSlides = [
  {
    title: '針扎傷害減少 87%',
    content: '經過同行評審研究，使用 Sharpsmart 容器後，醫護人員的針扎傷害減少了 87%。'
  },
  {
    title: '服務流程',
    content: '步驟 1: 安裝容器 → 步驟 2: 定期收運 → 步驟 3: 專業處理'
  },
  {
    title: '關於 Daniels Health',
    content: 'Daniels Health 是全球醫療廢棄物管理領導者，總部位於芝加哥。'
  },
  {
    title: '總結',
    content: '感謝您的時間。'
  }
];

console.log('=== 視覺決策器測試 ===\n');

// 測試單張投影片決策
console.log('1. 測試單張投影片決策:\n');
const singleDecision = decideVisual({ ...testSlides[0], index: 0 }, {
  colors: { primary: '#1E5128', secondary: '#4E9F3D' }
});
console.log('投影片:', testSlides[0].title);
console.log('策略來源:', singleDecision.strategy?.source);
console.log('參數:', JSON.stringify(singleDecision.params, null, 2));
console.log();

// 測試整份簡報決策
console.log('2. 測試整份簡報決策:\n');
const { decisions, summary } = decidePresentationVisuals(testSlides, {
  colors: { primary: '#1E5128', secondary: '#4E9F3D' }
});

for (let i = 0; i < decisions.length; i++) {
  const decision = decisions[i];
  console.log(`投影片 ${i + 1}: ${testSlides[i].title}`);
  console.log(`  策略來源: ${decision.strategy?.source || 'none'}`);
  if (decision.params) {
    if (decision.strategy?.source === 'kie-ai') {
      console.log(`  資訊圖表類型: ${decision.params.type}`);
      console.log(`  風格: ${decision.params.style}`);
    } else if (decision.strategy?.source === 'unsplash') {
      console.log(`  搜尋關鍵字: ${decision.params.query}`);
    }
  }
  console.log();
}

console.log('3. 決策摘要:\n');
console.log('總投影片數:', summary.totalSlides);
console.log('資訊圖表數:', summary.infographicCount);
console.log('照片數:', summary.photoCount);
console.log('無視覺數:', summary.noVisualCount);
console.log('預估成本: $', summary.estimatedCost);

// 測試驗證
console.log('\n4. 測試 API 金鑰驗證:\n');
const validation1 = validateDecision(decisions[0], { kieAi: 'test-key' });
console.log('有 API 金鑰:', validation1.valid ? '通過' : '失敗');

const validation2 = validateDecision(decisions[0], {});
console.log('無 API 金鑰:', validation2.valid ? '通過' : `失敗 - ${validation2.errors.join(', ')}`);

// 測試預算限制
console.log('\n5. 測試預算限制:\n');
const { decisions: budgetDecisions, summary: budgetSummary } = decidePresentationVisuals(testSlides, {
  colors: { primary: '#1E5128', secondary: '#4E9F3D' },
  budget: { maxInfographics: 2 }
});

console.log('限制最多 2 張資訊圖表後:');
console.log('資訊圖表數:', budgetSummary.infographicCount);
const budgetLimited = budgetDecisions.filter(d => d.budgetLimited);
console.log('因預算被取消:', budgetLimited.length);

console.log('\n=== 測試完成 ===');
