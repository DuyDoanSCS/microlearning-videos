// ============================================================
// Build Durations Generic — Đọc content.json → đo audio → tạo audioDurations JSON
// Usage: node scripts/build-durations-generic.js <content.json>
// Output: src/audioDurations-<slug>.json
// ============================================================

const fs = require('fs');
const path = require('path');

const FPS = 30;
const BITRATE = 48000; // 48kbps MP3
const BUFFER_SECONDS = 2;
const TRANSITION_FRAMES = 15;

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getAudioDuration(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size * 8) / BITRATE;
}

function main() {
  const contentPath = process.argv[2];
  if (!contentPath) {
    console.error('Usage: node scripts/build-durations-generic.js <content.json>');
    process.exit(1);
  }

  const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
  const meta = content.meta || {};
  const lessonSlug = slugify(meta.lesson || 'untitled');
  const videoType = content.video_type || 'concept_explainer';

  // Audio có thể ở output/<slug>/audio/ hoặc public/audio/<slug>/
  const outputAudioDir = path.join(__dirname, '..', 'output', lessonSlug, 'audio');
  const publicAudioDir = path.join(__dirname, '..', 'public', 'audio', lessonSlug);
  const audioDir = fs.existsSync(outputAudioDir) ? outputAudioDir : publicAudioDir;

  const durationsFile = path.join(__dirname, '..', 'src', `audioDurations-${lessonSlug}.json`);

  console.log(`\n=== Build Durations: "${meta.lesson || 'Unknown'}" ===`);
  console.log(`Audio dir: ${audioDir}\n`);

  const sections = content.sections || [];
  const durations = {};
  let totalFrames = 0;
  let sectionCount = 0;

  console.log('Section'.padEnd(16) + 'Audio(s)'.padEnd(10) + '+Buffer'.padEnd(10) + 'Frames');
  console.log('-'.repeat(54));

  for (const section of sections) {
    const sectionId = section.id || section.type;
    const filePath = path.join(audioDir, `${sectionId}.mp3`);

    if (!fs.existsSync(filePath)) {
      console.log(`${sectionId.padEnd(16)} ❌ NOT FOUND`);
      continue;
    }

    const audioDuration = getAudioDuration(filePath);
    const withBuffer = audioDuration + BUFFER_SECONDS;
    const frames = Math.ceil(withBuffer * FPS);

    durations[sectionId] = {
      audioDuration: Math.round(audioDuration * 10) / 10,
      totalSeconds: Math.ceil(withBuffer),
      frames: frames,
    };

    totalFrames += frames;
    sectionCount++;
    console.log(
      `${sectionId.padEnd(16)}${audioDuration.toFixed(1)}s`.padEnd(26) +
      `${withBuffer.toFixed(1)}s`.padEnd(10) +
      frames
    );
  }

  const totalTransitions = Math.max(0, sectionCount - 1);
  const overlapFrames = totalTransitions * TRANSITION_FRAMES;
  const finalFrames = totalFrames - overlapFrames;
  const finalSeconds = Math.ceil(finalFrames / FPS);

  console.log('-'.repeat(54));
  console.log(`Final: ${finalFrames} frames = ${finalSeconds}s (~${Math.floor(finalSeconds / 60)}:${String(finalSeconds % 60).padStart(2, '0')})`);

  const output = {
    _meta: {
      generatedAt: new Date().toISOString(),
      videoType,
      lesson: meta.lesson,
      lessonSlug,
      fps: FPS,
      bufferSeconds: BUFFER_SECONDS,
      transitionFrames: TRANSITION_FRAMES,
      totalDurationSeconds: finalSeconds,
      totalDurationFrames: finalFrames,
      audioDir: `audio/${lessonSlug}`,
    },
    sections: durations,
  };

  fs.writeFileSync(durationsFile, JSON.stringify(output, null, 2));
  console.log(`\n✅ Saved: ${durationsFile}`);
  console.log(`📺 Video: ${finalSeconds}s (~${Math.floor(finalSeconds / 60)}:${String(finalSeconds % 60).padStart(2, '0')})`);

  return output;
}

module.exports = { main };

if (require.main === module) {
  main();
}
