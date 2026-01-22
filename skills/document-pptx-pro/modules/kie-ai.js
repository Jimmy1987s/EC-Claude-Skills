/**
 * Kie.ai API 整合模組
 * 用於生成 Infographic 圖片
 */

const fs = require('fs').promises;
const path = require('path');

const KIE_API_BASE = 'https://api.kie.ai/v1';

/**
 * 生成圖片
 * @param {string} apiKey - Kie.ai API Key
 * @param {object} params - 生成參數
 * @param {string} params.model - 模型名稱 ('4o-image', 'flux-kontext', 'nano-banana')
 * @param {string} params.prompt - 圖片描述
 * @param {string} params.size - 圖片尺寸 ('1024x576' for 16:9)
 * @param {string} params.quality - 品質 ('high', 'medium')
 * @returns {Promise<string>} 圖片 URL
 */
async function generateImage(apiKey, params) {
  const { model = '4o-image', prompt, size = '1024x576', quality = 'high' } = params;

  const response = await fetch(`${KIE_API_BASE}/images/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      prompt,
      size,
      quality
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Kie.ai API 錯誤: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.image_url || data.data?.[0]?.url;
}

/**
 * 下載圖片到本地
 * @param {string} url - 圖片 URL
 * @param {string} outputPath - 輸出路徑
 * @returns {Promise<string>} 本地檔案路徑
 */
async function downloadImage(url, outputPath) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`下載圖片失敗: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 確保目錄存在
  const dir = path.dirname(outputPath);
  await fs.mkdir(dir, { recursive: true });

  await fs.writeFile(outputPath, buffer);
  return outputPath;
}

/**
 * 生成 Infographic 並下載到本地
 * @param {string} apiKey - API Key
 * @param {object} options - 選項
 * @param {string} options.type - Infographic 類型 ('statistics', 'process', 'comparison', 'timeline')
 * @param {object} options.data - 內容資料
 * @param {string[]} options.colors - 配色陣列 (hex)
 * @param {string} options.outputPath - 輸出路徑
 * @returns {Promise<string>} 本地檔案路徑
 */
async function generateInfographic(apiKey, options) {
  const { type, data, colors, outputPath } = options;

  // 根據類型建立 prompt
  const prompt = buildInfographicPrompt(type, data, colors);

  console.log(`生成 ${type} Infographic...`);

  // 呼叫 API 生成圖片
  const imageUrl = await generateImage(apiKey, {
    model: '4o-image',
    prompt,
    size: '1024x576',
    quality: 'high'
  });

  // 下載到本地
  const localPath = await downloadImage(imageUrl, outputPath);
  console.log(`Infographic 已儲存: ${localPath}`);

  return localPath;
}

/**
 * 建立 Infographic Prompt
 */
function buildInfographicPrompt(type, data, colors) {
  const colorStr = colors.join(', ');

  const templates = {
    statistics: `
Create a clean, modern infographic image for a business presentation slide.

KEY DATA:
- Main number: ${data.number}
- Trend: ${data.trend} (use ${data.trend === 'decrease' ? 'downward' : 'upward'} arrow icon)
- Subject: ${data.subject}

STYLE:
- Primary colors: ${colorStr}
- Style: minimalist, professional, corporate
- Background: subtle gradient using the primary colors
- The number should be VERY LARGE and prominent (at least 50% of the image height)

COMPOSITION:
- Center the main number
- Add a clear trend arrow (${data.trend === 'decrease' ? '↓' : '↑'}) next to or below the number
- Include a simple icon representing ${data.subject}
- Clean, uncluttered layout with lots of white space

IMPORTANT:
- NO text except the main number and % symbol if applicable
- Use universal icons only
- Professional business presentation style
- 16:9 aspect ratio
- High contrast for readability
`,

    process: `
Create a horizontal process flow infographic for a business presentation.

PROCESS DETAILS:
- Number of steps: ${data.steps.length}
- Step concepts: ${data.steps.join(' → ')}

STYLE:
- Colors: ${colorStr}
- Modern, clean design with connected flow
- Each step represented by a distinct icon in a circle or rounded square
- Steps connected by arrows or flowing lines
- Left-to-right flow direction

COMPOSITION:
- Evenly spaced steps across the width
- Clear visual connection between steps
- Numbered steps (1, 2, 3...) or just icons

IMPORTANT:
- Minimal text - use icons to represent each step
- Clear visual hierarchy showing progression
- Professional corporate style
- 16:9 aspect ratio
`,

    comparison: `
Create a side-by-side comparison infographic for a business presentation.

COMPARISON:
- Left side label: ${data.left.title}
- Right side label: ${data.right.title}
- Comparison points: ${data.items.length} items

STYLE:
- Colors: ${colorStr}
- Left side: use subtle red/gray tones with X marks
- Right side: use green/primary color tones with checkmarks
- Clear visual division in the middle

COMPOSITION:
- Split layout: 50/50 or clearly divided
- Each side has ${data.items.length} icon rows
- Use ✗ and ✓ symbols prominently
- Balanced, symmetrical design

IMPORTANT:
- Visual symbols (✗, ✓) instead of text
- Clear contrast between negative (left) and positive (right)
- Professional business style
- 16:9 aspect ratio
`,

    timeline: `
Create a timeline infographic for a business presentation.

TIMELINE DATA:
- Number of events: ${data.events.length}
- Time span: ${data.events[0]?.year} to ${data.events[data.events.length - 1]?.year}

STYLE:
- Colors: ${colorStr}
- Horizontal timeline with clear date markers
- Each milestone has an icon above or below the line
- Modern, clean design

COMPOSITION:
- Main horizontal line as the timeline backbone
- Year/date markers clearly visible
- Icons representing each event
- Alternating above/below placement for visual interest

IMPORTANT:
- Include year numbers as the only text
- Use icons to represent events
- Clear chronological flow
- Professional style
- 16:9 aspect ratio
`,

    concept: `
Create a conceptual infographic for a business presentation.

CONCEPT:
- Main idea: ${data.concept}
- Supporting elements: ${data.elements?.join(', ') || 'key points'}

STYLE:
- Colors: ${colorStr}
- Abstract, modern design
- Central focal point with radiating or connected elements
- Professional corporate aesthetic

COMPOSITION:
- Central main concept icon/shape
- Surrounding or connected supporting elements
- Visual hierarchy emphasizing the main concept
- Clean lines and geometric shapes

IMPORTANT:
- Minimal to no text
- Abstract representation of the concept
- Professional business style
- 16:9 aspect ratio
`
  };

  return templates[type] || templates.concept;
}

module.exports = {
  generateImage,
  downloadImage,
  generateInfographic,
  buildInfographicPrompt
};
