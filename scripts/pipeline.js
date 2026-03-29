// ============================================================
// Pipeline E2E — content.json → Validate → TTS → Duration → Adapt → Render
// Usage: node scripts/pipeline.js <content.json> [--skip-tts] [--skip-render]
// 
// Output: output/<lesson-slug>/
//   ├── audio/         ← audio files  
//   ├── images/        ← image files (nếu có)
//   ├── props.json     ← adapted props cho Remotion
//   └── <slug>-v1.mp4  ← video final
// ============================================================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { adaptContent } = require('./content-adapter');

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
};

// ============ MAIN ============

async function pipeline() {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║   🎬 Microlearning Video Pipeline v2         ║');
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

  // Validate sections
  if (!content.sections || content.sections.length < 2) {
    console.error('❌ content.json phải có ít nhất 2 sections');
    process.exit(1);
  }

  // Kiểm tra mỗi section có id
  for (const s of content.sections) {
    if (!s.id) {
      console.error(`❌ Section type "${s.type}" thiếu field "id". Mỗi section cần có id duy nhất.`);
      process.exit(1);
    }
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
  let durationsData = {};
  try {
    execSync(`node scripts/build-durations-generic.js "${contentPath}"`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
    });
    // Đọc kết quả
    const durationsPath = path.join(__dirname, '..', 'src', `audioDurations-${lessonSlug}.json`);
    if (fs.existsSync(durationsPath)) {
      durationsData = JSON.parse(fs.readFileSync(durationsPath, 'utf-8'));
    }
  } catch (err) {
    console.error('❌ Build durations thất bại!');
    process.exit(1);
  }
  console.log('');

  // ────── Step 4: Transform — content-adapter ──────
  console.log('🔄 Step 4: Transform content → Remotion props...');

  // Load theme
  let theme = {};
  const themePath = path.join(__dirname, '..', 'data', 'themes', `${themeId}.json`);
  if (fs.existsSync(themePath)) {
    theme = JSON.parse(fs.readFileSync(themePath, 'utf-8'));
    console.log(`   ✅ Theme loaded: ${themeId}`);
  } else {
    console.log(`   ⚠️  Theme "${themeId}" không tìm thấy, dùng mặc định`);
  }

  // Adapt
  const audioDir = `audio/${lessonSlug}`;
  const props = adaptContent(content, durationsData, theme, audioDir);

  // Lưu props.json vào output
  const propsPath = path.join(outputDir, 'props.json');
  fs.writeFileSync(propsPath, JSON.stringify(props, null, 2));
  console.log(`   ✅ Props saved: ${propsPath}`);
  console.log(`   📊 Sections: ${Object.keys(props.lessonData).join(', ')}`);
  console.log('');

  // ────── Step 5: Render ──────
  if (skipRender) {
    console.log('⏭️  Step 5: SKIP Render (--skip-render)\n');
  } else {
    const videoFileName = `${lessonSlug}-v1.mp4`;
    const videoPath = path.join(outputDir, videoFileName);

    console.log(`🎬 Step 5: Render video → ${videoPath}...`);

    // Escape props path cho shell
    const propsPathForShell = propsPath.replace(/\\/g, '/');

    try {
      execSync(
        `npx remotion render ${compositionId} "${videoPath}" --props="${propsPathForShell}"`,
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
  console.log('║   ✅ Pipeline v2 hoàn thành!                 ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`\n📁 Output: ${outputDir}/`);

  // List files
  const listDir = (dir, prefix = '   ') => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach(f => {
      const stat = fs.statSync(path.join(dir, f));
      if (stat.isFile()) {
        const sizeKB = stat.size / 1024;
        const sizeStr = sizeKB > 1024
          ? `${(sizeKB / 1024).toFixed(1)} MB`
          : `${sizeKB.toFixed(1)} KB`;
        console.log(`${prefix}${f} (${sizeStr})`);
      }
    });
  };

  console.log('   📂 audio/');
  listDir(path.join(outputDir, 'audio'), '      ');
  console.log('   📂 images/');
  listDir(path.join(outputDir, 'images'), '      ');

  const rootFiles = fs.readdirSync(outputDir).filter(f => {
    const stat = fs.statSync(path.join(outputDir, f));
    return stat.isFile();
  });
  if (rootFiles.length > 0) {
    console.log('   📄 files:');
    rootFiles.forEach(f => {
      const stat = fs.statSync(path.join(outputDir, f));
      const sizeKB = stat.size / 1024;
      const sizeStr = sizeKB > 1024
        ? `${(sizeKB / 1024).toFixed(1)} MB`
        : `${sizeKB.toFixed(1)} KB`;
      console.log(`      ${f} (${sizeStr})`);
    });
  }
}

pipeline().catch(err => {
  console.error('Pipeline error:', err);
  process.exit(1);
});
