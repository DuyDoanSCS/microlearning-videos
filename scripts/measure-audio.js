// Script đo thời lượng thực tế của mỗi file audio MP3
const fs = require('fs');
const path = require('path');

const AUDIO_DIR = path.join(__dirname, '..', 'public', 'audio');
const FPS = 30;

// Với MP3 48kbps mono, công thức: duration = fileSize * 8 / bitrate
const BITRATE = 48000; // 48kbps

const files = fs.readdirSync(AUDIO_DIR)
  .filter(f => f.endsWith('.mp3'))
  .sort();

console.log('=== Đo thời lượng audio ===\n');
console.log('File'.padEnd(18) + 'Size(KB)'.padEnd(10) + 'Duration(s)'.padEnd(14) + 'Frames'.padEnd(10) + 'Allocated(s)');
console.log('-'.repeat(70));

const allocated = {
  'intro.mp3': 8,
  'point-1.mp3': 26,
  'point-2.mp3': 26,
  'point-3.mp3': 26,
  'point-4.mp3': 26,
  'point-5.mp3': 26,
  'quiz.mp3': 20,
  'outro.mp3': 24,
};

let totalAudio = 0;
let totalAllocated = 0;

files.forEach(f => {
  const stats = fs.statSync(path.join(AUDIO_DIR, f));
  const sizeKB = stats.size / 1024;
  const durationS = (stats.size * 8) / BITRATE;
  const frames = Math.ceil(durationS * FPS);
  const alloc = allocated[f] || 0;
  const diff = durationS - alloc;
  const status = diff > 0 ? `⚠️  +${diff.toFixed(1)}s CẮT!` : `✅ OK (${(-diff).toFixed(1)}s dư)`;
  
  totalAudio += durationS;
  totalAllocated += alloc;
  
  console.log(
    f.padEnd(18) + 
    sizeKB.toFixed(1).padEnd(10) + 
    durationS.toFixed(1).padEnd(14) + 
    String(frames).padEnd(10) + 
    `${alloc}s    ${status}`
  );
});

console.log('-'.repeat(70));
console.log(`Tổng audio: ${totalAudio.toFixed(1)}s | Tổng allocated: ${totalAllocated}s | Chênh lệch: ${(totalAudio - totalAllocated).toFixed(1)}s`);
