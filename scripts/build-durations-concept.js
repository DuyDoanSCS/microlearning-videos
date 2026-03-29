// build-durations-concept.js — Đo audio concept-oop → tạo audioDurations-concept.json
const fs = require('fs');
const path = require('path');

const AUDIO_DIR = path.join(__dirname, '..', 'public', 'audio', 'concept-oop');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'audioDurations-concept.json');
const FPS = 30;
const BITRATE = 48000;
const BUFFER_SECONDS = 2;

const SECTION_ORDER = ['hook', 'definition', 'visual', 'example', 'application', 'quiz', 'recap'];

function getAudioDuration(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size * 8) / BITRATE;
}

function buildDurations() {
  console.log('=== Build Audio Durations (Concept: OOP) ===\n');
  
  const durations = {};
  let totalFrames = 0;
  const TRANSITION_FRAMES = 15;
  let sectionCount = 0;

  console.log('Section'.padEnd(14) + 'Audio(s)'.padEnd(10) + '+Buffer'.padEnd(10) + 'Frames');
  console.log('-'.repeat(50));

  for (const id of SECTION_ORDER) {
    const filePath = path.join(AUDIO_DIR, `${id}.mp3`);
    if (!fs.existsSync(filePath)) {
      console.log(`${id.padEnd(14)} ❌ NOT FOUND`);
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
    sectionCount++;
    console.log(`${id.padEnd(14)}${audioDuration.toFixed(1)}s`.padEnd(24) + `${withBuffer.toFixed(1)}s`.padEnd(10) + frames);
  }

  const totalTransitions = sectionCount - 1;
  const overlapFrames = totalTransitions * TRANSITION_FRAMES;
  const finalFrames = totalFrames - overlapFrames;
  const finalSeconds = Math.ceil(finalFrames / FPS);

  console.log('-'.repeat(50));
  console.log(`Final: ${finalFrames} frames = ${finalSeconds}s (~${Math.floor(finalSeconds/60)}:${String(finalSeconds%60).padStart(2,'0')})`);

  const output = {
    _meta: {
      generatedAt: new Date().toISOString(),
      videoType: 'concept_explainer',
      lesson: 'OOP là gì?',
      fps: FPS,
      bufferSeconds: BUFFER_SECONDS,
      transitionFrames: TRANSITION_FRAMES,
      totalDurationSeconds: finalSeconds,
      totalDurationFrames: finalFrames,
    },
    sections: durations,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\n✅ Saved: ${OUTPUT_FILE}`);
  console.log(`📺 Video: ${finalSeconds}s (~${Math.floor(finalSeconds/60)}:${String(finalSeconds%60).padStart(2,'0')})`);
}

buildDurations();
