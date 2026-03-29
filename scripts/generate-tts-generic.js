// ============================================================
// TTS Generic Script — Đọc content.json → Sinh audio cho mọi template
// Usage: node scripts/generate-tts-generic.js <content.json>
// Output: output/<lesson-slug>/audio/<section-id>.mp3
// Đồng thời copy sang public/audio/<lesson-slug>/ cho Remotion staticFile
// ============================================================

const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const fs = require('fs');
const path = require('path');

// ============ HELPERS ============

function streamToFile(audioStream, outputPath) {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(outputPath);
    const chunks = [];
    audioStream.on('data', (chunk) => {
      if (chunk instanceof Buffer) {
        chunks.push(chunk);
        writeStream.write(chunk);
      } else if (chunk && chunk.data instanceof Buffer) {
        chunks.push(chunk.data);
        writeStream.write(chunk.data);
      }
    });
    audioStream.on('end', () => {
      writeStream.end(() => resolve(chunks.reduce((sum, c) => sum + c.length, 0)));
    });
    audioStream.on('error', reject);
    writeStream.on('error', reject);
  });
}

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ============ SECTION → TTS TEXT ============

/**
 * Chuyển section data thành text cho TTS.
 * Mỗi video_type có cách xây dựng TTS text khác nhau.
 */
function sectionToTTSText(section, meta) {
  switch (section.type) {
    case 'hook':
      return [
        section.hook_text || '',
        section.title ? `Vậy ${section.title} thực sự là gì?` : '',
        'Hãy cùng tìm hiểu!',
      ].filter(Boolean).join(' ');

    case 'definition':
      return [
        `${section.term}, viết tắt của ${section.term_english || section.term},`,
        section.definition,
        section.keywords?.length ? `Hãy ghi nhớ các từ khóa quan trọng: ${section.keywords.join(', ')}.` : '',
      ].filter(Boolean).join(' ');

    case 'visual':
    case 'example':
      return [
        section.analogy || '',
        section.content || '',
        section.tip ? `Mẹo nhanh: ${section.tip}` : '',
      ].filter(Boolean).join(' ');

    case 'application':
      const appList = (section.applications || [])
        .map((app, i) => `Thứ ${['nhất', 'hai', 'ba', 'tư', 'năm', 'sáu', 'bảy'][i] || i + 1}, ${app}`)
        .join('. ');
      return [
        section.title ? `${section.title}?` : 'Ứng dụng thực tế:',
        appList,
      ].filter(Boolean).join(' ');

    case 'key_point':
      return [
        section.title || '',
        section.content || '',
        section.example ? `Ví dụ: ${section.example}` : '',
        section.tip ? `Mẹo nhanh: ${section.tip}` : '',
      ].filter(Boolean).join('. ');

    case 'quiz':
      const labels = ['A', 'B', 'C', 'D'];
      const optionsText = (section.options || [])
        .map((opt, i) => `${labels[i]}: ${opt}`)
        .join('. ');
      return [
        'Hãy cùng kiểm tra nhanh nhé!',
        `Câu hỏi: ${section.question}`,
        optionsText,
        'Hãy suy nghĩ.',
        `Đáp án đúng là ${labels[section.correct || 0]}.`,
        section.explanation || '',
      ].filter(Boolean).join(' ');

    case 'recap':
      return [
        'Tuyệt vời! Hãy ôn lại nhanh.',
        section.summary || '',
        section.next_lesson ? `Hẹn gặp bạn trong bài tiếp theo: ${section.next_lesson}.` : '',
      ].filter(Boolean).join(' ');

    case 'intro':
      return [
        section.hook || '',
        section.title || '',
        section.subtitle || '',
      ].filter(Boolean).join('. ');

    case 'outro':
      return [
        section.summary || '',
        section.cta || '',
      ].filter(Boolean).join(' ');

    default:
      return section.tts_text || section.content || section.text || '';
  }
}

// ============ MAIN ============

async function main() {
  const contentPath = process.argv[2];
  if (!contentPath) {
    console.error('Usage: node scripts/generate-tts-generic.js <content.json>');
    process.exit(1);
  }

  // Đọc content.json
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
  const meta = content.meta || {};
  const voice = content.style?.voice || 'vi-VN-HoaiMyNeural';
  const lessonSlug = slugify(meta.lesson || 'untitled');

  // Tạo thư mục output
  const outputDir = path.join(__dirname, '..', 'output', lessonSlug, 'audio');
  const publicDir = path.join(__dirname, '..', 'public', 'audio', lessonSlug);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });

  console.log(`\n=== TTS Generic: "${meta.lesson || 'Unknown'}" ===`);
  console.log(`Voice: ${voice}`);
  console.log(`Output: ${outputDir}`);
  console.log(`Public: ${publicDir}\n`);

  // Khởi tạo TTS
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  // Sinh audio cho mỗi section
  const sections = content.sections || [];
  let totalFiles = 0;

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const sectionId = section.id || section.type || `section-${i}`;
    const ttsText = sectionToTTSText(section, meta);

    if (!ttsText.trim()) {
      console.log(`[SKIP] ${sectionId} — no TTS text`);
      continue;
    }

    const outputPath = path.join(outputDir, `${sectionId}.mp3`);
    const publicPath = path.join(publicDir, `${sectionId}.mp3`);

    process.stdout.write(`[TTS] ${sectionId}.mp3 ... `);
    try {
      const { audioStream } = tts.toStream(ttsText);
      const size = await streamToFile(audioStream, outputPath);
      // Copy sang public/ cho Remotion staticFile
      fs.copyFileSync(outputPath, publicPath);
      console.log(`OK (${(size / 1024).toFixed(1)} KB)`);
      totalFiles++;
    } catch (err) {
      console.log(`FAIL: ${err.message || err}`);
    }
  }

  console.log(`\n=== Hoàn thành TTS! ===`);
  console.log(`Tổng: ${totalFiles}/${sections.length} files`);
  console.log(`Audio: ${outputDir}`);
  console.log(`Public: ${publicDir}`);

  return { lessonSlug, outputDir, publicDir, totalFiles };
}

module.exports = { main, sectionToTTSText, slugify };

if (require.main === module) {
  main().catch(console.error);
}
