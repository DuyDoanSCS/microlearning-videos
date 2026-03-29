// TTS Script cho bài Concept Explainer: "OOP là gì?"
// Pipeline: generate-tts-concept.js → build-durations.js → render

const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'audio', 'concept-oop');
const VOICE = 'vi-VN-HoaiMyNeural';

const sections = [
  {
    id: 'hook',
    text: 'Bạn có biết hơn 90 phần trăm ứng dụng di động hiện nay đều được xây dựng bằng lập trình hướng đối tượng? Vậy Object Oriented Programming, hay OOP, thực sự là gì? Hãy cùng tìm hiểu!',
  },
  {
    id: 'definition',
    text: 'OOP, viết tắt của Object Oriented Programming, có nghĩa là Lập trình hướng đối tượng. Đây là mô hình lập trình tổ chức phần mềm thành các đối tượng. Mỗi đối tượng chứa dữ liệu, gọi là thuộc tính, và hành vi, gọi là phương thức. Các đối tượng này phản ánh các thực thể trong thế giới thực. Hãy ghi nhớ 5 từ khóa quan trọng: Đối tượng, Thuộc tính, Phương thức, Lớp, và Kế thừa.',
  },
  {
    id: 'visual',
    text: 'Để dễ hiểu, hãy tưởng tượng OOP giống như một bản thiết kế nhà. Lớp, hay Class, là bản vẽ thiết kế. Còn mỗi ngôi nhà được xây ra chính là một Đối tượng, hay Object, với màu sơn, số phòng khác nhau. Ví dụ, ta có Lớp Xe, với thuộc tính là màu sắc, tốc độ tối đa, và phương thức là khởi động, tăng tốc, phanh. Mỗi chiếc xe thực tế trên đường là một Object được tạo từ Lớp Xe.',
  },
  {
    id: 'example',
    text: 'Một ví dụ thực tế rất gần gũi là ứng dụng Grab. Trong Grab, mỗi tài xế là một Object thuộc Lớp TàiXế, với thuộc tính tên, biển số xe, đánh giá, và các phương thức như nhận đơn, di chuyển. Mỗi khách hàng là một Object thuộc Lớp KháchHàng, với thuộc tính tên, vị trí, phương thức thanh toán, và các hành động đặt xe, đánh giá. Như vậy, mọi thứ trong ứng dụng đều là đối tượng!',
  },
  {
    id: 'application',
    text: 'Vậy tại sao phải học OOP? Thứ nhất, code dễ bảo trì hơn vì mỗi đối tượng độc lập, sửa một chỗ không ảnh hưởng chỗ khác. Thứ hai, bạn có thể tái sử dụng code, viết một lần dùng nhiều lần nhờ tính kế thừa. Thứ ba, làm việc nhóm hiệu quả vì mỗi người phụ trách một nhóm đối tượng. Và cuối cùng, OOP giúp mô hình hóa thế giới thực, dễ hiểu và dễ thiết kế hệ thống lớn.',
  },
  {
    id: 'quiz',
    text: 'Hãy cùng kiểm tra nhanh nhé! Câu hỏi: Trong OOP, Class là gì? A: Một biến lưu trữ dữ liệu. B: Bản thiết kế để tạo ra các đối tượng. C: Một hàm xử lý dữ liệu. D: Một thư viện có sẵn. Hãy suy nghĩ. Đáp án đúng là B. Class là bản thiết kế, hay blueprint, chứa thuộc tính và phương thức. Object là thực thể cụ thể được tạo từ Class.',
  },
  {
    id: 'recap',
    text: 'Tuyệt vời! Hãy ôn lại nhanh. OOP là lập trình hướng đối tượng, Object Oriented Programming. Class là bản thiết kế. Object là thực thể cụ thể tạo từ Class. Và OOP có 4 tính chất cốt lõi: Đóng gói, Kế thừa, Đa hình, và Trừu tượng. Hãy thử tạo một Class đơn giản trong Python hoặc Java ngay hôm nay! Hẹn gặp bạn trong bài tiếp theo: 4 Tính chất cốt lõi của OOP.',
  },
];

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

async function generateAllAudio() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  for (const section of sections) {
    const outputPath = path.join(OUTPUT_DIR, `${section.id}.mp3`);
    process.stdout.write(`[TTS] ${section.id}.mp3 ... `);
    try {
      const { audioStream } = tts.toStream(section.text);
      const size = await streamToFile(audioStream, outputPath);
      console.log(`OK (${(size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.log(`LOI: ${err.message || err}`);
    }
  }

  console.log('\n=== Hoan thanh TTS OOP! ===');
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.mp3'));
  console.log(`Tong: ${files.length} files`);
  files.forEach(f => {
    const s = fs.statSync(path.join(OUTPUT_DIR, f));
    console.log(`  ${f}: ${(s.size / 1024).toFixed(1)} KB`);
  });
}

generateAllAudio().catch(console.error);
