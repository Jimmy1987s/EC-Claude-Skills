/**
 * 視覺決策器模組
 * 根據內容分析結果決定使用哪種視覺元素
 */

const { analyzeSlide, analyzePresentation, generateVisualSummary } = require('./content-analyzer');

// 視覺策略配置（全部使用 Kie.ai）
const VISUAL_STRATEGIES = {
  // AI 生成資訊圖表
  infographic: {
    source: 'kie-ai',
    model: '4o-image',
    size: '1024x576',
    quality: 'high'
  },
  // 不需要視覺
  none: {
    source: null
  }
};

// 資訊圖表類型與 Prompt 策略對應
const INFOGRAPHIC_STRATEGIES = {
  statistics: {
    style: 'modern infographic',
    elements: ['large numbers', 'trend arrows', 'progress bars'],
    layout: 'centered focal point'
  },
  process: {
    style: 'flow diagram',
    elements: ['numbered steps', 'connecting arrows', 'icons'],
    layout: 'horizontal or vertical flow'
  },
  comparison: {
    style: 'comparison chart',
    elements: ['two columns', 'check marks', 'icons'],
    layout: 'side by side'
  },
  timeline: {
    style: 'timeline graphic',
    elements: ['year markers', 'milestone dots', 'connecting line'],
    layout: 'horizontal timeline'
  },
  concept: {
    style: 'concept diagram',
    elements: ['central idea', 'radiating elements', 'icons'],
    layout: 'hub and spoke'
  },
  company: {
    style: 'corporate illustration',
    elements: ['building silhouette', 'globe', 'team icons', 'growth chart'],
    layout: 'centered composition'
  }
};

/**
 * 決定單張投影片的視覺策略
 * @param {object} slideContent - 投影片內容
 * @param {object} options - 選項
 * @returns {object} 視覺決策結果
 */
function decideVisual(slideContent, options = {}) {
  const { colors = {}, forceType = null } = options;

  // 分析內容
  const analysis = analyzeSlide(slideContent);

  // 如果強制指定類型
  if (forceType && VISUAL_STRATEGIES[forceType]) {
    analysis.visualNeed = forceType;
  }

  // 根據分析結果建立決策
  const decision = {
    slideIndex: slideContent.index,
    title: slideContent.title,
    analysis,
    strategy: null,
    params: null
  };

  // 全部使用 Kie.ai 生成
  if (analysis.visualNeed === 'infographic') {
    decision.strategy = VISUAL_STRATEGIES.infographic;
    decision.params = buildInfographicParams(analysis, colors);
  } else {
    decision.strategy = VISUAL_STRATEGIES.none;
    decision.params = null;
  }

  return decision;
}

/**
 * 建立資訊圖表參數
 */
function buildInfographicParams(analysis, colors) {
  const infographicType = analysis.infographicType || 'concept';
  const strategy = INFOGRAPHIC_STRATEGIES[infographicType];

  return {
    type: infographicType,
    style: strategy.style,
    elements: strategy.elements,
    layout: strategy.layout,
    data: analysis.keyElements,
    colors: {
      primary: colors.primary || '#1E5128',
      secondary: colors.secondary || '#4E9F3D',
      accent: colors.accent || '#FFFFFF',
      background: colors.background || '#FFFFFF'
    },
    title: analysis.title,
    context: buildContextString(analysis)
  };
}


/**
 * 建立上下文字串用於 Prompt
 */
function buildContextString(analysis) {
  const parts = [];

  if (analysis.title) {
    parts.push(`標題: ${analysis.title}`);
  }

  if (analysis.contentTypeName) {
    parts.push(`類型: ${analysis.contentTypeName}`);
  }

  // 根據類型加入特定資訊
  const elements = analysis.keyElements || {};

  if (elements.number) {
    parts.push(`數據: ${elements.number}`);
  }

  if (elements.trend) {
    parts.push(`趨勢: ${elements.trend === 'increase' ? '上升' : '下降'}`);
  }

  if (elements.steps?.length > 0) {
    parts.push(`步驟數: ${elements.steps.length}`);
  }

  if (elements.events?.length > 0) {
    parts.push(`時間點: ${elements.events.length}個`);
  }

  return parts.join(', ');
}

/**
 * 批量決策整份簡報的視覺策略
 * @param {object[]} slides - 投影片陣列
 * @param {object} options - 選項
 * @returns {object} 決策結果
 */
function decidePresentationVisuals(slides, options = {}) {
  const { colors = {}, budget = null } = options;

  // 為每張投影片做決策
  const decisions = slides.map((slide, index) =>
    decideVisual({ ...slide, index }, { colors })
  );

  // 如果有預算限制，優先處理高分數的投影片
  if (budget && budget.maxInfographics) {
    optimizeForBudget(decisions, budget);
  }

  // 生成摘要
  const summary = {
    totalSlides: decisions.length,
    infographicCount: decisions.filter(d => d.strategy?.source === 'kie-ai').length,
    noVisualCount: decisions.filter(d => d.strategy?.source === null).length,
    estimatedCost: calculateEstimatedCost(decisions)
  };

  return {
    decisions,
    summary
  };
}

/**
 * 根據預算優化決策
 */
function optimizeForBudget(decisions, budget) {
  const { maxInfographics = 5 } = budget;

  // 找出所有需要資訊圖表的決策
  const infographicDecisions = decisions
    .filter(d => d.strategy?.source === 'kie-ai')
    .sort((a, b) => b.analysis.matchScore - a.analysis.matchScore);

  // 如果超過預算，將低分數的轉為不需要視覺
  if (infographicDecisions.length > maxInfographics) {
    const toRemove = infographicDecisions.slice(maxInfographics);

    for (const decision of toRemove) {
      decision.strategy = VISUAL_STRATEGIES.none;
      decision.params = null;
      decision.budgetLimited = true;
    }
  }
}

/**
 * 計算預估成本
 */
function calculateEstimatedCost(decisions) {
  const infographicCount = decisions.filter(d => d.strategy?.source === 'kie-ai').length;
  // 假設每張資訊圖表約 $0.05
  return (infographicCount * 0.05).toFixed(2);
}

/**
 * 驗證決策是否可執行
 * @param {object} decision - 決策結果
 * @param {object} apiKeys - API 金鑰配置
 * @returns {object} 驗證結果
 */
function validateDecision(decision, apiKeys = {}) {
  const result = {
    valid: true,
    errors: [],
    warnings: []
  };

  if (decision.strategy?.source === 'kie-ai') {
    if (!apiKeys.kieAi) {
      result.valid = false;
      result.errors.push('缺少 Kie.ai API 金鑰');
    }
  }

  // 警告低分數的決策
  if (decision.analysis?.matchScore < 1.5 && decision.strategy?.source !== null) {
    result.warnings.push(`投影片 ${decision.slideIndex} 的匹配分數較低 (${decision.analysis.matchScore})，視覺效果可能不夠精準`);
  }

  return result;
}

module.exports = {
  VISUAL_STRATEGIES,
  INFOGRAPHIC_STRATEGIES,
  decideVisual,
  decidePresentationVisuals,
  validateDecision,
  buildInfographicParams
};
