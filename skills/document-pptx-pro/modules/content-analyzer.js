/**
 * 內容分析器模組
 * 分析投影片內容，判斷需要什麼類型的視覺元素
 */

// 內容類型定義
const CONTENT_TYPES = {
  statistics: {
    name: '統計數據',
    description: '包含百分比、數字、比較數據',
    visual: 'infographic',
    infographicType: 'statistics'
  },
  process: {
    name: '流程說明',
    description: '步驟、流程、順序、方法',
    visual: 'infographic',
    infographicType: 'process'
  },
  comparison: {
    name: '比較對照',
    description: 'A vs B、優缺點、差異比較',
    visual: 'infographic',
    infographicType: 'comparison'
  },
  timeline: {
    name: '時間軸',
    description: '年份、歷史、發展歷程',
    visual: 'infographic',
    infographicType: 'timeline'
  },
  company_intro: {
    name: '公司介紹',
    description: '公司、品牌、產品介紹',
    visual: 'infographic',
    infographicType: 'company'
  },
  concept: {
    name: '概念說明',
    description: '抽象概念、策略、理念',
    visual: 'infographic',
    infographicType: 'concept'
  },
  text_only: {
    name: '純文字',
    description: '不需要視覺輔助的內容',
    visual: 'none'
  }
};

// 模式匹配規則
const PATTERNS = {
  statistics: [
    /(\d+(\.\d+)?)\s*%/,                    // 百分比
    /減少|降低|增加|成長|提升/,              // 趨勢詞
    /\d+\s*(萬|億|千|百)/,                   // 大數字
    /第\s*\d+\s*(大|名|位)/,                 // 排名
    /倍|翻倍/,                               // 倍數
    /比較|對比.*數據/                        // 數據比較
  ],
  process: [
    /步驟|流程|階段|phase/i,                 // 步驟詞
    /第\s*\d+\s*(步|階段)/,                  // 編號步驟
    /→|->|⟶|然後|接著|最後/,                // 流程連接詞
    /一條龍|端到端|end.to.end/i,            // 完整流程
    /從.*到.*的/                             // 流程描述
  ],
  comparison: [
    /vs\.?|versus|對比|比較/i,               // 比較詞
    /優點|缺點|優勢|劣勢/,                   // 優缺點
    /傳統.*vs|.*與.*的差異/,                 // 對比結構
    /✓|✗|√|×/,                              // 勾叉符號
    /勝出|落後|領先/                         // 比較結果
  ],
  timeline: [
    /\d{4}\s*年/,                            // 年份
    /歷史|發展|沿革|里程碑/,                 // 時間軸詞
    /創立|成立|創辦|起源/,                   // 起點
    /至今|迄今|目前|現在/,                   // 終點
    /從.*年.*到/                             // 時間跨度
  ],
  company_intro: [
    /公司|企業|集團|品牌/,                   // 公司詞
    /總部|headquarters/i,                    // 總部
    /創辦人|CEO|執行長/,                     // 領導人
    /成立於|創立於/,                         // 成立
    /服務.*客戶|客戶.*家/                    // 客戶數
  ],
  concept: [
    /策略|戰略|模式|理念/,                   // 概念詞
    /核心|價值|願景|使命/,                   // 核心詞
    /商業模式|business model/i,             // 商業模式
    /競爭優勢|差異化/,                       // 策略詞
    /永續|ESG|創新/                          // 現代概念
  ]
};

/**
 * 分析單一投影片內容
 * @param {object} slide - 投影片資料
 * @param {string} slide.title - 標題
 * @param {string} slide.content - 內容
 * @param {number} slide.index - 投影片索引
 * @returns {object} 分析結果
 */
function analyzeSlide(slide) {
  const { title = '', content = '', index } = slide;
  const fullText = `${title} ${content}`;

  // 計算各類型的匹配分數
  const scores = {};
  for (const [type, patterns] of Object.entries(PATTERNS)) {
    scores[type] = calculateMatchScore(fullText, patterns);
  }

  // 找出最高分數的類型
  let bestType = 'text_only';
  let bestScore = 0;

  for (const [type, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestType = type;
    }
  }

  // 如果分數太低，視為純文字
  if (bestScore < 1) {
    bestType = 'text_only';
  }

  // 提取關鍵元素
  const keyElements = extractKeyElements(fullText, bestType);

  return {
    slideIndex: index,
    title,
    contentType: bestType,
    contentTypeName: CONTENT_TYPES[bestType].name,
    visualNeed: CONTENT_TYPES[bestType].visual,
    infographicType: CONTENT_TYPES[bestType].infographicType || null,
    photoCategory: CONTENT_TYPES[bestType].photoCategory || null,
    matchScore: bestScore,
    keyElements
  };
}

/**
 * 計算匹配分數
 */
function calculateMatchScore(text, patterns) {
  let score = 0;
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      score += 1;
      // 多次匹配給額外分數
      if (matches.length > 1) {
        score += 0.5;
      }
    }
  }
  return score;
}

/**
 * 提取關鍵元素
 */
function extractKeyElements(text, type) {
  const elements = {};

  switch (type) {
    case 'statistics':
      // 提取數字和百分比
      const percentMatch = text.match(/(\d+(\.\d+)?)\s*%/);
      if (percentMatch) {
        elements.number = percentMatch[0];
      }

      // 判斷趨勢
      if (/減少|降低|下降/.test(text)) {
        elements.trend = 'decrease';
      } else if (/增加|成長|提升|上升/.test(text)) {
        elements.trend = 'increase';
      }

      // 提取主題
      const subjectMatch = text.match(/(針扎|傷害|成本|效率|銷售|營收|用戶|客戶)/);
      if (subjectMatch) {
        elements.subject = subjectMatch[0];
      }
      break;

    case 'process':
      // 提取步驟
      const steps = [];
      const stepMatches = text.match(/(?:步驟|階段|Phase)\s*\d+[：:]\s*([^。\n]+)/gi);
      if (stepMatches) {
        steps.push(...stepMatches.map(s => s.replace(/步驟\s*\d+[：:]\s*/, '')));
      }
      // 或從箭頭分隔的文字提取
      if (steps.length === 0 && text.includes('→')) {
        const arrowSteps = text.split(/→|->/).map(s => s.trim()).filter(s => s.length < 20);
        steps.push(...arrowSteps);
      }
      elements.steps = steps.length > 0 ? steps : ['步驟 1', '步驟 2', '步驟 3'];
      break;

    case 'comparison':
      // 提取比較對象
      const vsMatch = text.match(/(.{2,10})\s*(?:vs\.?|對比|比較)\s*(.{2,10})/i);
      if (vsMatch) {
        elements.left = { title: vsMatch[1].trim() };
        elements.right = { title: vsMatch[2].trim() };
      } else {
        elements.left = { title: '傳統方案' };
        elements.right = { title: '新方案' };
      }

      // 計算比較項目數
      const checkmarks = (text.match(/✓|✗|√|×|優點|缺點/g) || []).length;
      elements.items = new Array(Math.max(3, Math.ceil(checkmarks / 2)));
      break;

    case 'timeline':
      // 提取年份事件
      const yearMatches = text.match(/(\d{4})\s*年?[：:\s]*([^。\n]{5,30})?/g);
      elements.events = [];
      if (yearMatches) {
        for (const match of yearMatches) {
          const [, year, desc] = match.match(/(\d{4})\s*年?[：:\s]*(.*)/) || [];
          if (year) {
            elements.events.push({ year, description: desc?.trim() || '' });
          }
        }
      }
      if (elements.events.length === 0) {
        elements.events = [
          { year: '2020' },
          { year: '2022' },
          { year: '2024' }
        ];
      }
      break;

    case 'company_intro':
      // 提取公司關鍵字
      elements.keywords = [];
      const companyMatch = text.match(/([A-Za-z\s]+(?:Health|Tech|Corp|Inc|Ltd)?)/);
      if (companyMatch) {
        elements.keywords.push(companyMatch[1].trim());
      }
      // 提取產業關鍵字
      if (/醫療|healthcare/i.test(text)) elements.keywords.push('healthcare');
      if (/科技|technology/i.test(text)) elements.keywords.push('technology');
      if (/環保|環境/i.test(text)) elements.keywords.push('environmental');
      if (/金融|finance/i.test(text)) elements.keywords.push('finance');
      break;

    case 'concept':
      // 提取概念關鍵字
      const conceptMatch = text.match(/(策略|模式|理念|價值|願景|商業模式|競爭優勢)/);
      elements.concept = conceptMatch ? conceptMatch[0] : '核心概念';
      elements.elements = [];
      break;
  }

  return elements;
}

/**
 * 批量分析多個投影片
 * @param {object[]} slides - 投影片陣列
 * @returns {object[]} 分析結果陣列
 */
function analyzePresentation(slides) {
  return slides.map((slide, index) => analyzeSlide({ ...slide, index }));
}

/**
 * 生成視覺需求摘要
 * @param {object[]} analyses - 分析結果陣列
 * @returns {object} 摘要
 */
function generateVisualSummary(analyses) {
  const summary = {
    totalSlides: analyses.length,
    infographicCount: 0,
    photoCount: 0,
    noVisualCount: 0,
    byType: {}
  };

  for (const analysis of analyses) {
    if (analysis.visualNeed === 'infographic') {
      summary.infographicCount++;
    } else if (analysis.visualNeed === 'photo') {
      summary.photoCount++;
    } else {
      summary.noVisualCount++;
    }

    const type = analysis.contentType;
    summary.byType[type] = (summary.byType[type] || 0) + 1;
  }

  summary.estimatedCost = (summary.infographicCount * 0.05).toFixed(2);

  return summary;
}

module.exports = {
  CONTENT_TYPES,
  analyzeSlide,
  analyzePresentation,
  generateVisualSummary,
  extractKeyElements
};
