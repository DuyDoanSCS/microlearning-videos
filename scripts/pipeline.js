// ============================================================
// Pipeline E2E — Đọc content.json → Validate → TTS → Duration → Render
// Usage: node scripts/pipeline.js <content.json> [--skip-tts] [--skip-render]
// 
// Output: output/<lesson-slug>/
//   ├── audio/         ← audio files
//   ├── images/        ← image files (nếu có)
//   └── <slug>-v1.mp4  ← video
// ============================================================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============ HELPERS ============

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Template → Composition mapping
const TEMPLATE_MAP = {
  concept_explainer: 'ConceptExplainerVideo',
  step_by_step: 'MicroLearningVideo',
  // Thêm template mới ở đây
};

// ============ MAIN ============

async function pipeline() {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║   🎬 Microlearning Video Pipeline            ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  // Parse arguments
  const args = process.argv.slice(2);
  const contentPath = args.find(a => !a.startsWith('--'));
  const skipTTS = args.includes('--skip-tts');
  const skipRender = args.includes('--skip-render');

  if (!contentPath) {
    console.error('Usage: node scripts/pipeline.js <content.json> [--skip-tts] [--skip-render]');
    process.exit(1);
  }

  // ────── Step 1: Đọc & validate content.json ──────
  console.log('📋 Step 1: Đọc content.json...');
  if (!fs.existsSync(contentPath)) {
    console.error(`❌ File không tồn tại: ${contentPath}`);
    process.exit(1);
  }

  const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
  const meta = content.meta || {};
  const videoType = content.video_type || 'concept_explainer';
  const themeId = content.style?.theme || 'universal-dark';
  const lessonSlug = slugify(meta.lesson || 'untitled');

  console.log(`   📖 Bài: ${meta.lesson}`);
  console.log(`   🎨 Theme: ${themeId}`);
  console.log(`   📐 Template: ${videoType}`);
  console.log(`   📂 Slug: ${lessonSlug}`);
  console.log(`   📑 Sections: ${content.sections?.length || 0}\n`);

  // Kiểm tra template
  const compositionId = TEMPLATE_MAP[videoType];
  if (!compositionId) {
    console.error(`❌ Template chưa hỗ trợ: ${videoType}`);
    console.log(`   Các template có sẵn: ${Object.keys(TEMPLATE_MAP).join(', ')}`);
    process.exit(1);
  }

  // Validate cơ bản
  if (!content.sections || content.sections.length < 2) {
    console.error('❌ content.json phải có ít nhất 2 sections');
    process.exit(1);
  }

  // Kiểm tra theme tồn tại
  const themePath = path.join(__dirname, '..', 'data', 'themes', `${themeId}.json`);
  if (!fs.existsSync(themePath)) {
    console.warn(`⚠️  Theme "${themeId}" không tìm thấy, dùng universal-dark`);
  }

  // Tạo thư mục output
  const outputDir = path.join(__dirname, '..', 'output', lessonSlug);
  fs.mkdirSync(path.join(outputDir, 'audio'), { recursive: true });
  fs.mkdirSync(path.join(outputDir, 'images'), { recursive: true });

  // ────── Step 2: Sinh TTS ──────
  if (skipTTS) {
    console.log('⏭️  Step 2: SKIP TTS (--skip-tts)\n');
  } else {
    console.log('🎤 Step 2: Sinh TTS audio...');
    try {
      execSync(`node scripts/generate-tts-generic.js "${contentPath}"`, {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit',
      });
    } catch (err) {
      console.error('❌ TTS thất bại!');
      process.exit(1);
    }
    console.log('');
  }

  // ────── Step 3: Đo duration ──────
  console.log('📏 Step 3: Đo audio durations...');
  try {
    execSync(`node scripts/build-durations-generic.js "${contentPath}"`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
    });
  } catch (err) {
    console.error('❌ Build durations thất bại!');
    process.exit(1);
  }
  console.log('');

  // ────── Step 4: Render ──────
  if (skipRender) {
    console.log('⏭️  Step 4: SKIP Render (--skip-render)\n');
  } else {
    const videoFileName = `${lessonSlug}-v1.mp4`;
    const videoPath = path.join(outputDir, videoFileName);

    console.log(`🎬 Step 4: Render video → ${videoPath}...`);
    try {
      execSync(
        `npx remotion render ${compositionId} "${videoPath}"`,
        {
          cwd: path.join(__dirname, '..'),
          stdio: 'inherit',
        }
      );
    } catch (err) {
      console.error('❌ Render thất bại!');
      process.exit(1);
    }
    console.log('');

    // Kiểm tra output
    if (fs.existsSync(videoPath)) {
      const size = fs.statSync(videoPath).size;
      console.log(`✅ Video: ${videoPath} (${(size / 1024 / 1024).toFixed(1)} MB)`);
    }
  }

  // ────── Summary ──────
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║   ✅ Pipeline hoàn thành!                    ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`\n📁 Output: ${outputDir}/`);

  // List files
  const listDir = (dir) => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach(f => {
      const stat = fs.statSync(path.join(dir, f));
      if (stat.isFile()) {
        console.log(`   ${f} (${(stat.size / 1024).toFixed(1)} KB)`);
      }
    });
  };

  console.log('   📂 audio/');
  listDir(path.join(outputDir, 'audio'));
  console.log('   📂 images/');
  listDir(path.join(outputDir, 'images'));

  const videos = fs.readdirSync(outputDir).filter(f => f.endsWith('.mp4'));
  if (videos.length > 0) {
    console.log('   🎬 videos:');
    videos.forEach(v => {
      const size = fs.statSync(path.join(outputDir, v)).size;
      console.log(`   ${v} (${(size / 1024 / 1024).toFixed(1)} MB)`);
    });
  }
}

pipeline().catch(err => {
  console.error('Pipeline error:', err);
  process.exit(1);
});
