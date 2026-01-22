/**
 * 圖片整合器模組
 * 將生成的圖片整合到 HTML 投影片模板中
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * HTML 模板 - 純圖片投影片
 */
const FULL_IMAGE_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
<style>
html { background: #ffffff; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 0;
  background: {{backgroundColor}};
  display: flex; align-items: center; justify-content: center;
}
.image-container {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
}
.image-container img {
  max-width: 100%; max-height: 100%;
  object-fit: contain;
}
</style>
</head>
<body>
<div class="image-container">
  <img src="{{imagePath}}" alt="{{altText}}">
</div>
</body>
</html>`;

/**
 * HTML 模板 - 標題 + 圖片
 */
const TITLE_IMAGE_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
<style>
html { background: #ffffff; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 0;
  background: {{backgroundColor}}; font-family: Arial, sans-serif;
  display: flex; flex-direction: column;
}
.header {
  background: {{primaryColor}}; padding: 15pt 30pt;
}
h1 {
  color: {{titleColor}}; font-size: 22pt; margin: 0;
}
.content {
  flex: 1; display: flex; align-items: center; justify-content: center;
  padding: 15pt;
}
.content img {
  max-width: 100%; max-height: 100%;
  object-fit: contain;
}
</style>
</head>
<body>
<div class="header">
  <h1>{{title}}</h1>
</div>
<div class="content">
  <img src="{{imagePath}}" alt="{{altText}}">
</div>
</body>
</html>`;

/**
 * HTML 模板 - 左文右圖
 */
const TEXT_IMAGE_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
<style>
html { background: #ffffff; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 0;
  background: {{backgroundColor}}; font-family: Arial, sans-serif;
  display: flex;
}
.text-side {
  width: 45%; padding: 25pt; display: flex; flex-direction: column;
  justify-content: center;
}
h1 {
  color: {{primaryColor}}; font-size: 20pt; margin: 0 0 15pt 0;
}
.text-content {
  color: {{textColor}}; font-size: 11pt; line-height: 1.5;
}
.text-content ul {
  margin: 0; padding-left: 15pt;
}
.text-content li {
  margin-bottom: 8pt;
}
.image-side {
  width: 55%; display: flex; align-items: center; justify-content: center;
  padding: 15pt;
}
.image-side img {
  max-width: 100%; max-height: 100%;
  object-fit: contain; border-radius: 6pt;
}
</style>
</head>
<body>
<div class="text-side">
  <h1>{{title}}</h1>
  <div class="text-content">{{content}}</div>
</div>
<div class="image-side">
  <img src="{{imagePath}}" alt="{{altText}}">
</div>
</body>
</html>`;

/**
 * HTML 模板 - 上圖下文
 */
const IMAGE_TEXT_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
<style>
html { background: #ffffff; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 0;
  background: {{backgroundColor}}; font-family: Arial, sans-serif;
  display: flex; flex-direction: column;
}
.image-area {
  height: 55%; display: flex; align-items: center; justify-content: center;
  padding: 15pt;
}
.image-area img {
  max-width: 100%; max-height: 100%;
  object-fit: contain;
}
.text-area {
  height: 45%; padding: 15pt 30pt;
  background: {{primaryColor}};
}
h1 {
  color: {{titleColor}}; font-size: 18pt; margin: 0 0 10pt 0;
}
.text-content {
  color: {{textColor}}; font-size: 11pt; line-height: 1.4;
}
</style>
</head>
<body>
<div class="image-area">
  <img src="{{imagePath}}" alt="{{altText}}">
</div>
<div class="text-area">
  <h1>{{title}}</h1>
  <div class="text-content">{{content}}</div>
</div>
</body>
</html>`;

// 模板映射
const TEMPLATES = {
  'full-image': FULL_IMAGE_TEMPLATE,
  'title-image': TITLE_IMAGE_TEMPLATE,
  'text-image': TEXT_IMAGE_TEMPLATE,
  'image-text': IMAGE_TEXT_TEMPLATE
};

/**
 * 根據模板和資料生成 HTML
 * @param {string} templateName - 模板名稱
 * @param {object} data - 模板資料
 * @returns {string} 生成的 HTML
 */
function generateHTML(templateName, data) {
  let template = TEMPLATES[templateName];

  if (!template) {
    throw new Error(`未知的模板: ${templateName}`);
  }

  // 設定預設值
  const defaults = {
    backgroundColor: '#FFFFFF',
    primaryColor: '#1E5128',
    titleColor: '#FFFFFF',
    textColor: '#333333',
    title: '',
    content: '',
    imagePath: '',
    altText: '投影片圖片'
  };

  const finalData = { ...defaults, ...data };

  // 替換模板變數
  for (const [key, value] of Object.entries(finalData)) {
    template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }

  return template;
}

/**
 * 選擇最適合的模板
 * @param {object} slideData - 投影片資料
 * @returns {string} 模板名稱
 */
function selectTemplate(slideData) {
  const { title, content, visualType } = slideData;

  // 純資訊圖表 - 使用全圖模板
  if (visualType === 'infographic' && !content) {
    return 'title-image';
  }

  // 有標題有內容 - 使用左文右圖
  if (title && content) {
    return 'text-image';
  }

  // 只有標題 - 使用標題圖片模板
  if (title) {
    return 'title-image';
  }

  // 預設全圖
  return 'full-image';
}

/**
 * 整合圖片到投影片
 * @param {object} options - 選項
 * @returns {Promise<string>} 生成的 HTML 檔案路徑
 */
async function integrateImage(options) {
  const {
    imagePath,
    slideData,
    outputPath,
    colors = {},
    templateOverride = null
  } = options;

  // 選擇模板
  const templateName = templateOverride || selectTemplate(slideData);

  // 準備模板資料
  const templateData = {
    imagePath: path.relative(path.dirname(outputPath), imagePath).replace(/\\/g, '/'),
    title: slideData.title || '',
    content: formatContent(slideData.content),
    altText: slideData.title || '投影片視覺',
    backgroundColor: colors.background || '#FFFFFF',
    primaryColor: colors.primary || '#1E5128',
    titleColor: colors.titleColor || '#FFFFFF',
    textColor: colors.textColor || '#333333'
  };

  // 生成 HTML
  const html = generateHTML(templateName, templateData);

  // 確保目錄存在
  const dir = path.dirname(outputPath);
  await fs.mkdir(dir, { recursive: true });

  // 寫入檔案
  await fs.writeFile(outputPath, html, 'utf-8');

  return outputPath;
}

/**
 * 格式化內容為 HTML
 */
function formatContent(content) {
  if (!content) return '';

  // 如果是陣列，轉為列表
  if (Array.isArray(content)) {
    const items = content.map(item => `<li>${escapeHtml(item)}</li>`).join('\n');
    return `<ul>\n${items}\n</ul>`;
  }

  // 如果是字串，處理換行
  if (typeof content === 'string') {
    // 檢查是否有項目符號格式
    if (content.includes('\n•') || content.includes('\n-')) {
      const lines = content.split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^[•\-]\s*/, '').trim());
      const items = lines.map(item => `<li>${escapeHtml(item)}</li>`).join('\n');
      return `<ul>\n${items}\n</ul>`;
    }

    // 一般段落
    return `<p>${escapeHtml(content)}</p>`;
  }

  return '';
}

/**
 * HTML 轉義
 */
function escapeHtml(text) {
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, char => escapeMap[char]);
}

/**
 * 批量處理多張投影片
 * @param {object[]} slides - 投影片資料陣列
 * @param {object} options - 選項
 * @returns {Promise<string[]>} HTML 檔案路徑陣列
 */
async function integrateMultipleImages(slides, options = {}) {
  const { outputDir, colors = {}, filePrefix = 'slide' } = options;

  const results = [];

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];

    // 如果有圖片路徑
    if (slide.imagePath) {
      const outputPath = path.join(outputDir, `${filePrefix}${String(i + 1).padStart(2, '0')}.html`);

      const htmlPath = await integrateImage({
        imagePath: slide.imagePath,
        slideData: slide,
        outputPath,
        colors
      });

      results.push(htmlPath);
    } else {
      results.push(null);
    }
  }

  return results;
}

/**
 * 建立圖片佔位符 HTML（用於預覽）
 * @param {object} options - 選項
 * @returns {string} HTML 字串
 */
function createPlaceholderHTML(options) {
  const {
    title = '',
    placeholderText = '圖片將在此處生成',
    colors = {}
  } = options;

  return `<!DOCTYPE html>
<html>
<head>
<style>
html { background: #ffffff; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 0;
  background: ${colors.background || '#FFFFFF'}; font-family: Arial, sans-serif;
  display: flex; flex-direction: column;
}
.header {
  background: ${colors.primary || '#1E5128'}; padding: 15pt 30pt;
}
h1 {
  color: ${colors.titleColor || '#FFFFFF'}; font-size: 22pt; margin: 0;
}
.placeholder {
  flex: 1; display: flex; align-items: center; justify-content: center;
  background: #E0E0E0; margin: 20pt;
  border: 2pt dashed #999999; border-radius: 8pt;
}
.placeholder-text {
  color: #666666; font-size: 14pt;
}
</style>
</head>
<body>
<div class="header">
  <h1>${escapeHtml(title)}</h1>
</div>
<div class="placeholder">
  <p class="placeholder-text">${escapeHtml(placeholderText)}</p>
</div>
</body>
</html>`;
}

module.exports = {
  TEMPLATES,
  generateHTML,
  selectTemplate,
  integrateImage,
  integrateMultipleImages,
  createPlaceholderHTML,
  formatContent
};
