/**
 * 資訊圖表 Prompt 模板
 * 用於生成不同類型的資訊圖表
 */

/**
 * 基礎風格指令
 */
const BASE_STYLE = `
Create a professional infographic illustration with:
- Clean, modern design
- Simple flat design style
- No text or labels (text will be added separately)
- High contrast colors
- White or light background
- Suitable for business presentations
- 16:9 aspect ratio
`;

/**
 * 統計數據資訊圖表模板
 */
function statisticsPrompt(data, colors) {
  const { number, trend, subject } = data;

  let trendElement = '';
  if (trend === 'increase') {
    trendElement = 'upward trending arrow, growth indicator';
  } else if (trend === 'decrease') {
    trendElement = 'downward trending arrow, reduction indicator';
  }

  return `${BASE_STYLE}

Design a statistics infographic showing:
- A large, prominent circular or semi-circular gauge/meter as the focal point
- The gauge should visually represent a percentage or metric
- ${trendElement ? trendElement : 'neutral metric display'}
- Abstract icons representing ${subject || 'the concept'}
- Subtle grid or dot pattern background
- Visual elements suggesting data/analytics

Color scheme:
- Primary: ${colors.primary}
- Secondary: ${colors.secondary}
- Accent: ${colors.accent}

Style: Corporate data visualization, clean metrics display
NO TEXT, NO NUMBERS - pure visual representation`;
}

/**
 * 流程圖資訊圖表模板
 */
function processPrompt(data, colors) {
  const { steps = [] } = data;
  const stepCount = steps.length || 4;

  return `${BASE_STYLE}

Design a process flow infographic with:
- ${stepCount} connected stages/steps arranged horizontally
- Each step represented by a circular node or icon container
- Flowing arrows or lines connecting each step
- Subtle numbered indicators (1, 2, 3...) within each node
- Professional icons inside each step representing different phases
- Gradient or color progression through the flow

Color scheme:
- Primary: ${colors.primary}
- Secondary: ${colors.secondary}
- Flow should progress from darker to lighter or use gradient

Style: Modern workflow diagram, clean connections
Each step should be visually distinct but part of a cohesive flow
NO TEXT LABELS - only visual icons and numbered indicators`;
}

/**
 * 比較對照資訊圖表模板
 */
function comparisonPrompt(data, colors) {
  const { left, right, items } = data;
  const itemCount = items?.length || 4;

  return `${BASE_STYLE}

Design a comparison infographic with:
- Clear two-column layout divided vertically
- Left side and right side clearly distinguished by color
- ${itemCount} rows of comparison points
- Check marks (✓) and X marks (✗) or similar indicators
- Professional icons representing each comparison category
- Central dividing line or element
- Balance scale or versus symbol as header element

Color scheme:
- Left side: ${colors.primary} tones
- Right side: ${colors.secondary} tones
- Indicators: Green for positive, Red for negative

Style: Clean comparison chart, professional evaluation matrix
Clear visual hierarchy showing advantages and disadvantages
NO TEXT - only visual indicators and icons`;
}

/**
 * 時間軸資訊圖表模板
 */
function timelinePrompt(data, colors) {
  const { events = [] } = data;
  const eventCount = events.length || 4;

  return `${BASE_STYLE}

Design a timeline infographic with:
- Horizontal timeline line as the central element
- ${eventCount} milestone markers along the timeline
- Each milestone with a circular node and vertical connector
- Alternating positions (above/below) for milestone details
- Year/date indicators at each milestone point
- Small icons representing each milestone event
- Subtle decorative elements suggesting progress/growth

Color scheme:
- Timeline line: ${colors.primary}
- Milestone nodes: ${colors.secondary}
- Alternating accent colors for variety

Style: Modern horizontal timeline, corporate milestones visualization
Progressive flow from left (past) to right (present/future)
Include year markers but NO descriptive text`;
}

/**
 * 概念說明資訊圖表模板
 */
function conceptPrompt(data, colors) {
  const { concept, elements = [] } = data;

  return `${BASE_STYLE}

Design a concept diagram infographic with:
- Central hub element representing the core concept
- 4-6 radiating elements connected to the center
- Each element with a distinct icon
- Connecting lines or arrows from center to each element
- Hub-and-spoke or mind-map style layout
- Subtle background patterns suggesting interconnection

Color scheme:
- Central hub: ${colors.primary}
- Radiating elements: ${colors.secondary}
- Connections: lighter tones

Style: Strategic concept visualization, relationship diagram
Shows how multiple elements connect to a central idea
Professional, corporate strategy look
NO TEXT - only visual elements and icons`;
}

/**
 * 階層結構資訊圖表模板
 */
function hierarchyPrompt(data, colors) {
  const { levels = 3 } = data;

  return `${BASE_STYLE}

Design a hierarchy/pyramid infographic with:
- ${levels}-level pyramid structure
- Each level clearly distinguished by size and color
- Icons or symbols representing each level
- Upward progression suggesting importance/priority
- Subtle shadows or 3D effect for depth
- Professional business hierarchy appearance

Color scheme:
- Top level: ${colors.accent}
- Middle levels: ${colors.primary}
- Base level: ${colors.secondary}

Style: Corporate pyramid diagram, organizational hierarchy
Clear visual progression from base to apex
NO TEXT - pure visual hierarchy representation`;
}

/**
 * 公司介紹資訊圖表模板
 */
function companyPrompt(data, colors) {
  const { keywords = [] } = data;

  let industryHint = 'corporate business';
  if (keywords.includes('healthcare')) industryHint = 'healthcare medical';
  if (keywords.includes('technology')) industryHint = 'technology innovation';
  if (keywords.includes('environmental')) industryHint = 'sustainability green';

  return `${BASE_STYLE}

Design a corporate/company introduction infographic with:
- Central building or headquarters silhouette
- Globe or world map element suggesting global presence
- Team/people icons showing organization
- Upward growth arrow or chart element
- Industry-specific icons for ${industryHint}
- Professional, trustworthy corporate aesthetic
- Subtle connection lines between elements

Color scheme:
- Primary: ${colors.primary}
- Secondary: ${colors.secondary}
- Accent highlights: ${colors.accent}

Style: Corporate identity visualization, company overview graphic
Professional and trustworthy appearance
NO TEXT, NO COMPANY NAMES - pure visual representation`;
}

/**
 * 根據類型獲取對應的 Prompt 生成函數
 */
function getPromptBuilder(type) {
  const builders = {
    statistics: statisticsPrompt,
    process: processPrompt,
    comparison: comparisonPrompt,
    timeline: timelinePrompt,
    concept: conceptPrompt,
    hierarchy: hierarchyPrompt,
    company: companyPrompt
  };

  return builders[type] || conceptPrompt;
}

/**
 * 生成完整的 Prompt
 * @param {string} type - 資訊圖表類型
 * @param {object} data - 內容數據
 * @param {object} colors - 配色方案
 * @returns {string} 完整的 Prompt
 */
function buildPrompt(type, data, colors) {
  const builder = getPromptBuilder(type);
  const defaultColors = {
    primary: '#1E5128',
    secondary: '#4E9F3D',
    accent: '#FFFFFF',
    background: '#FFFFFF'
  };

  return builder(data, { ...defaultColors, ...colors });
}

module.exports = {
  BASE_STYLE,
  statisticsPrompt,
  processPrompt,
  comparisonPrompt,
  timelinePrompt,
  conceptPrompt,
  hierarchyPrompt,
  companyPrompt,
  getPromptBuilder,
  buildPrompt
};
