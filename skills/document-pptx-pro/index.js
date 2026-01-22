/**
 * document-pptx-pro 主要入口
 * 視覺增強版簡報生成工具（全部使用 Kie.ai）
 */

// 匯出所有模組
const contentAnalyzer = require('./modules/content-analyzer');
const visualDecider = require('./modules/visual-decider');
const kieAi = require('./modules/kie-ai');
const imageIntegrator = require('./modules/image-integrator');
const infographicTemplates = require('./prompts/infographic-templates');

/**
 * 主要工作流程：為投影片生成視覺內容
 * @param {object[]} slides - 投影片資料陣列
 * @param {object} options - 配置選項
 * @returns {Promise<object>} 處理結果
 */
async function enhancePresentation(slides, options = {}) {
  const {
    kieApiKey = process.env.KIE_AI_API_KEY,
    outputDir = './workspace',
    colors = {
      primary: '#1E5128',
      secondary: '#4E9F3D',
      accent: '#FFFFFF',
      background: '#FFFFFF'
    },
    budget = null,
    dryRun = false
  } = options;

  // 1. 分析所有投影片內容
  console.log('分析投影片內容...');
  const analyses = contentAnalyzer.analyzePresentation(slides);

  // 2. 決定視覺策略
  console.log('決定視覺策略...');
  const { decisions, summary } = visualDecider.decidePresentationVisuals(slides, {
    colors,
    budget
  });

  console.log(`需要生成 ${summary.infographicCount} 張資訊圖表`);
  console.log(`預估成本: $${summary.estimatedCost}`);

  // 如果是 dry run，只返回分析結果
  if (dryRun) {
    return {
      analyses,
      decisions,
      summary,
      slides: slides.map((slide, i) => ({
        ...slide,
        decision: decisions[i]
      }))
    };
  }

  // 3. 驗證 API 金鑰
  if (!kieApiKey) {
    throw new Error('缺少 Kie.ai API 金鑰，請設定 KIE_AI_API_KEY 環境變數');
  }

  // 4. 生成視覺內容
  console.log('開始生成視覺內容...');
  const results = [];

  for (let i = 0; i < decisions.length; i++) {
    const decision = decisions[i];
    const slide = slides[i];

    try {
      if (decision.strategy?.source === 'kie-ai') {
        console.log(`生成投影片 ${i + 1} 的資訊圖表...`);
        const imagePath = await kieAi.generateInfographic(kieApiKey, {
          ...decision.params,
          outputPath: `${outputDir}/slide${String(i + 1).padStart(2, '0')}-infographic.png`
        });
        decision.imagePath = imagePath;
        decision.status = 'success';
      } else {
        decision.status = 'skipped';
      }
    } catch (error) {
      console.error(`投影片 ${i + 1} 處理失敗:`, error.message);
      decision.status = 'error';
      decision.error = error.message;
    }

    results.push({
      slideIndex: i,
      title: slide.title,
      decision,
      imagePath: decision.imagePath
    });
  }

  // 5. 整合到 HTML（如果需要）
  if (options.generateHtml !== false) {
    console.log('整合圖片到 HTML...');
    for (const result of results) {
      if (result.imagePath) {
        try {
          const htmlPath = await imageIntegrator.integrateImage({
            imagePath: result.imagePath,
            slideData: slides[result.slideIndex],
            outputPath: `${outputDir}/slide${String(result.slideIndex + 1).padStart(2, '0')}.html`,
            colors
          });
          result.htmlPath = htmlPath;
        } catch (error) {
          console.error(`HTML 整合失敗:`, error.message);
          result.htmlError = error.message;
        }
      }
    }
  }

  // 6. 生成摘要報告
  const finalSummary = {
    ...summary,
    processed: results.filter(r => r.decision.status === 'success').length,
    failed: results.filter(r => r.decision.status === 'error').length,
    skipped: results.filter(r => r.decision.status === 'skipped').length
  };

  console.log('處理完成！');
  console.log(`成功: ${finalSummary.processed}, 失敗: ${finalSummary.failed}, 跳過: ${finalSummary.skipped}`);

  return {
    results,
    summary: finalSummary,
    outputDir
  };
}

/**
 * 快速分析投影片內容（不生成圖片）
 */
function analyzeOnly(slides) {
  const analyses = contentAnalyzer.analyzePresentation(slides);
  const summary = contentAnalyzer.generateVisualSummary(analyses);

  return {
    analyses,
    summary,
    slides: slides.map((slide, i) => ({
      ...slide,
      analysis: analyses[i]
    }))
  };
}

// 匯出 API
module.exports = {
  // 主要功能
  enhancePresentation,
  analyzeOnly,

  // 模組
  contentAnalyzer,
  visualDecider,
  kieAi,
  imageIntegrator,
  infographicTemplates,

  // 便捷方法
  analyzeSlide: contentAnalyzer.analyzeSlide,
  analyzePresentation: contentAnalyzer.analyzePresentation,
  decideVisual: visualDecider.decideVisual,
  generateInfographic: kieAi.generateInfographic,
  integrateImage: imageIntegrator.integrateImage
};
