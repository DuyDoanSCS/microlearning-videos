// ============================================================
// Content Adapter — Chuyển content.json (GV) → props.json (Remotion)
// 
// GV viết nội dung sư phạm thuần túy trong content.json
// Adapter tự bổ sung 8 fields kỹ thuật:
//   1. audio path       (từ TTS output)
//   2. duration          (từ audioDurations)
//   3. headingColor      (từ theme)
//   4. lessonNumber      (ghép từ meta)
//   5. recapSteps        (transform từ recap_points + theme)
//   6. channelName       (mặc định)
//   7. correctIndex      (rename từ correct)
//   8. gradients/colors  (từ theme)
//
// Usage: 
//   const { adaptContent } = require('./content-adapter');
//   const props = adaptContent(content, durations, theme, slug);
// ============================================================

const fs = require('fs');
const path = require('path');

// Icon mặc định cho recap steps (theo thứ tự)
const DEFAULT_RECAP_ICONS = ['📖', '🏗️', '🚗', '⚡', '🔑', '💡', '🎯', '✅'];

/**
 * Chuyển content.json → composition props
 * 
 * @param {Object} content - Dữ liệu từ content.json (GV viết)
 * @param {Object} durations - Dữ liệu từ audioDurations JSON
 * @param {Object} theme - Theme object từ theme-registry
 * @param {string} audioDir - Đường dẫn audio relative (e.g. "audio/oop-la-gi")
 * @returns {Object} Props sẵn sàng cho Remotion composition
 */
function adaptContent(content, durations, theme, audioDir) {
  const meta = content.meta || {};
  const sections = content.sections || [];
  const FPS = 30;

  // Heading colors từ theme
  const headingColors = theme.colors?.headingColors || [
    '#60A5FA', '#34D399', '#FBBF24', '#F472B6', '#A78BFA'
  ];

  // Tạo lessonNumber string
  const lessonNum = meta.lesson_number || 1;
  const lessonNumber = `Bài ${String(lessonNum).padStart(2, '0')} · ${meta.chapter || ''}`;

  // Channel name mặc định
  const channelName = meta.channel_name || 'Microlearning · Đại học';

  // Helper: lấy duration cho section
  const getDuration = (sectionId, fallbackSeconds) => {
    const sectionDur = durations?.sections?.[sectionId];
    return sectionDur?.frames || Math.ceil(fallbackSeconds * FPS);
  };

  // Helper: tạo audio path
  const getAudioPath = (sectionId) => `${audioDir}/${sectionId}.mp3`;

  // ============ TRANSFORM SECTIONS ============

  const lessonData = {};
  let headingIndex = 0;

  for (const section of sections) {
    const id = section.id || section.type;
    const baseProps = {
      audio: getAudioPath(id),
      duration: getDuration(id, 20),
    };

    switch (section.type) {
      case 'hook':
        lessonData.hook = {
          ...baseProps,
          hookText: section.hook_text || '',
          hookStat: section.hook_stat || '',
          title: section.title || meta.lesson || '',
          subtitle: section.subtitle || '',
          lessonNumber: lessonNumber,
          emoji: section.emoji || '🎓',
        };
        break;

      case 'definition':
        lessonData.definition = {
          ...baseProps,
          term: section.term || '',
          termEnglish: section.term_english || '',
          definition: section.definition || '',
          keywords: section.keywords || [],
          headingColor: headingColors[headingIndex++ % headingColors.length],
        };
        break;

      case 'visual':
      case 'visual_explain':
        lessonData.visualExplain = {
          ...baseProps,
          analogy: section.analogy || '',
          content: section.content || '',
          headingColor: headingColors[headingIndex++ % headingColors.length],
        };
        break;

      case 'example':
        lessonData.example = {
          ...baseProps,
          analogy: section.analogy || section.title || '',
          content: section.content || '',
          headingColor: headingColors[headingIndex++ % headingColors.length],
        };
        break;

      case 'application':
        lessonData.application = {
          ...baseProps,
          title: section.title || 'Ứng dụng thực tế',
          applications: section.applications || [],
          headingColor: headingColors[headingIndex++ % headingColors.length],
        };
        break;

      case 'quiz':
        lessonData.quiz = {
          ...baseProps,
          question: section.question || '',
          options: section.options || [],
          correctIndex: section.correct ?? section.correctIndex ?? 0,
          explanation: section.explanation || '',
        };
        break;

      case 'recap':
        // Transform recap_points → recapSteps (thêm icon + color từ theme)
        const recapPoints = section.recap_points || [];
        const recapSteps = recapPoints.map((text, i) => ({
          icon: DEFAULT_RECAP_ICONS[i % DEFAULT_RECAP_ICONS.length],
          text: text,
          color: headingColors[i % headingColors.length],
        }));

        lessonData.recap = {
          ...baseProps,
          summary: section.summary || recapPoints.join('\n'),
          nextLesson: section.next_lesson || '',
          channelName: channelName,
          recapSteps: recapSteps,
        };
        break;

      default:
        // Cho các section type chưa hỗ trợ, giữ nguyên data
        lessonData[id] = {
          ...baseProps,
          ...section,
        };
    }
  }

  // ============ BUILD THEME COLORS ============

  const colorProps = {
    primary: theme.colors?.primary || '#2563EB',
    primaryLight: theme.colors?.primaryLight || '#60A5FA',
    accent: theme.colors?.accent || '#F59E0B',
    accentGreen: theme.colors?.accentGreen || '#10B981',
    accentRed: theme.colors?.accentRed || '#EF4444',
    bgDark: theme.colors?.bgDark || '#0F172A',
    bgDarkAlt: theme.colors?.bgDarkAlt || '#1E293B',
    bgCard: theme.colors?.bgCard || '#1E293B',
    bgGlass: theme.colors?.bgGlass || 'rgba(255,255,255,0.05)',
    textWhite: theme.colors?.textWhite || '#F8FAFC',
    textLight: theme.colors?.textLight || '#CBD5E1',
    textMuted: theme.colors?.textMuted || '#64748B',
    gradientPrimary: theme.gradients?.primary || 'linear-gradient(135deg, #2563EB, #06B6D4)',
    gradientDark: theme.gradients?.dark || 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
  };

  // ============ FINAL PROPS ============

  return {
    meta: {
      lesson: meta.lesson || '',
      course: meta.course || '',
      courseCode: meta.course_code || '',
      chapter: meta.chapter || '',
      instructor: meta.instructor || '',
      bloomLevel: meta.bloom_level || '',
    },
    videoType: content.video_type || 'concept_explainer',
    lessonData: lessonData,
    colorProps: colorProps,
    headingColors: headingColors,
    themeId: content.style?.theme || 'universal-dark',
    durations: durations,
  };
}

/**
 * CLI: node scripts/content-adapter.js <content.json> <durations.json> <theme.json>
 * Output: props.json cùng thư mục với content.json
 */
function main() {
  const [contentPath, durationsPath, themePath] = process.argv.slice(2);

  if (!contentPath) {
    console.error('Usage: node scripts/content-adapter.js <content.json> [durations.json] [theme.json]');
    process.exit(1);
  }

  const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

  let durations = {};
  if (durationsPath && fs.existsSync(durationsPath)) {
    durations = JSON.parse(fs.readFileSync(durationsPath, 'utf-8'));
  }

  let theme = {};
  if (themePath && fs.existsSync(themePath)) {
    theme = JSON.parse(fs.readFileSync(themePath, 'utf-8'));
  } else {
    // Try to load from data/themes
    const themeId = content.style?.theme || 'universal-dark';
    const autoThemePath = path.join(__dirname, '..', 'data', 'themes', `${themeId}.json`);
    if (fs.existsSync(autoThemePath)) {
      theme = JSON.parse(fs.readFileSync(autoThemePath, 'utf-8'));
    }
  }

  const slugify = (t) => t.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const slug = slugify(content.meta?.lesson || 'untitled');
  const audioDir = `audio/${slug}`;

  const props = adaptContent(content, durations, theme, audioDir);

  // Output
  const outputPath = path.join(path.dirname(contentPath), `${slug}-props.json`);
  fs.writeFileSync(outputPath, JSON.stringify(props, null, 2));
  console.log(`✅ Props saved: ${outputPath}`);
  console.log(`   Sections: ${Object.keys(props.lessonData).join(', ')}`);
  console.log(`   Theme: ${props.themeId}`);

  return props;
}

module.exports = { adaptContent };

if (require.main === module) {
  main();
}
