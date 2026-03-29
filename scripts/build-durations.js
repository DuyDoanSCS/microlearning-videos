// ============================================================
// build-durations.js — Đo audio thực tế → Tạo config duration
// BÀI HỌC: KHÔNG BAO GIỜ hardcode durationInFrames!
// Pipeline: generate-tts.js → build-durations.js → render
// ============================================================

const fs = require('fs');
const path = require('path');

const AUDIO_DIR = path.join(__dirname, '..', 'public', 'audio');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'audioDurations.json');
const FPS = 30;
const BITRATE = 48000; // 48kbps mono MP3
const BUFFER_SECONDS = 2; // 2s buffer cho animation (tip card, fade-out)

// Thứ tự các section trong video
const SECTION_ORDER = [
  'intro',
  'point-1',
  'point-2',
  'point-3',
  'point-4',
  'point-5',
  'quiz',
  'outro',
];

function getAudioDuration(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size * 8) / BITRATE;
}

function buildDurations() {
  console.log('=== Build Audio Durations ===\n');
  
  const durations = {};
  let totalFrames = 0;
  const TRANSITION_FRAMES = 15; // 0.5s fade
  let transitionCount = 0;

  console.log(
    'Section'.padEnd(14) +
    'Audio(s)'.padEnd(10) +
    '+Buffer'.padEnd(10) +
    'Frames'.padEnd(10) +
    'Status'
  );
  console.log('-'.repeat(60));

  for (const id of SECTION_ORDER) {
    const filePath = path.join(AUDIO_DIR, `${id}.mp3`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`${id.padEnd(14)} ❌ FILE NOT FOUND`);
      continue;
    }

    const audioDuration = getAudioDuration(filePath);
    const withBuffer = audioDuration + BUFFER_SECONDS;
    const frames = Math.ceil(withBuffer * FPS);

    durations[id] = {
      audioDuration: Math.round(audioDuration * 10) / 10,
      totalSeconds: Math.ceil(withBuffer),
      frames: frames,
    };

    totalFrames += frames;
    transitionCount++;

    console.log(
      id.padEnd(14) +
      `${audioDuration.toFixed(1)}s`.padEnd(10) +
      `${withBuffer.toFixed(1)}s`.padEnd(10) +
      String(frames).padEnd(10) +
      '✅'
    );
  }

  // Trừ transition overlaps (n-1 transitions between n sections)
  const totalTransitions = transitionCount - 1;
  const overlapFrames = totalTransitions * TRANSITION_FRAMES;
  const finalFrames = totalFrames - overlapFrames;
  const finalSeconds = Math.ceil(finalFrames / FPS);

  console.log('-'.repeat(60));
  console.log(`Subtotal frames: ${totalFrames}`);
  console.log(`Transitions: ${totalTransitions} × ${TRANSITION_FRAMES}f = -${overlapFrames}f overlap`);
  console.log(`Final: ${finalFrames} frames = ${finalSeconds}s (~${Math.floor(finalSeconds/60)}:${String(finalSeconds%60).padStart(2,'0')})`);

  // Thêm metadata
  const output = {
    _meta: {
      generatedAt: new Date().toISOString(),
      fps: FPS,
      bufferSeconds: BUFFER_SECONDS,
      transitionFrames: TRANSITION_FRAMES,
      totalDurationSeconds: finalSeconds,
      totalDurationFrames: finalFrames,
    },
    sections: durations,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\n✅ Saved to: ${OUTPUT_FILE}`);
  console.log(`📺 Video duration: ${finalSeconds}s (~${Math.floor(finalSeconds/60)}:${String(finalSeconds%60).padStart(2,'0')})`);
  
  return output;
}

buildDurations();
