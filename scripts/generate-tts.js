// Script tạo voiceover tiếng Việt cho video microlearning
// msedge-tts: miễn phí, giọng neural Microsoft Edge
// Nâng cấp: Các thuật ngữ tiếng Anh được viết phonetic để phát âm rõ ràng

const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'audio');
const VOICE = 'vi-VN-HoaiMyNeural';

const sections = [
  {
    id: 'intro',
    text: 'Xin chào các bạn sinh viên! Hôm nay chúng ta sẽ cùng học 5 bước để viết một email chuyên nghiệp. Đây là kỹ năng thiết yếu mà mọi sinh viên đại học cần nắm vững.',
  },
  {
    id: 'point-1',
    text: 'Bước 1: Dòng tiêu đề, Subject Line. Dòng tiêu đề phải ngắn gọn, cụ thể và nêu rõ mục đích email. Ví dụ: Xin phép nghỉ học ngày 15 tháng 4, Lớp Công nghệ thông tin K29. Tránh những tiêu đề mơ hồ như "Thầy ơi cho em hỏi" hay "Email quan trọng". Một tiêu đề tốt giúp người nhận nắm bắt nội dung ngay khi đọc lướt hộp thư.',
  },
  {
    id: 'point-2',
    text: 'Bước 2: Lời chào và giới thiệu, Greeting. Luôn bắt đầu bằng lời chào lịch sự: Kính gửi Thầy, hoặc Kính gửi Cô. Tiếp theo, hãy tự giới thiệu ngắn gọn bao gồm họ tên, lớp, và mã sinh viên. Ví dụ: Em là Nguyễn Văn A, sinh viên lớp Công nghệ thông tin K29, mã số sinh viên 2024001. Điều này giúp giảng viên nhận biết bạn ngay lập tức.',
  },
  {
    id: 'point-3',
    text: 'Bước 3: Nội dung chính, Body. Hãy trình bày rõ ràng mục đích email trong 2 đến 3 câu. Dùng đoạn văn ngắn, tránh viết dài dòng. Nêu cụ thể yêu cầu hoặc thông tin bạn muốn truyền đạt. Ví dụ: Em viết email này để xin phép nghỉ học buổi thứ Hai, ngày 15 tháng 4, vì em có lịch khám bệnh. Em sẽ nhờ bạn ghi chép bài và hoàn thành bài tập đúng hạn.',
  },
  {
    id: 'point-4',
    text: 'Bước 4: Lời kết và ký tên, Closing. Kết thúc email bằng lời cảm ơn và lời chào kính. Ví dụ: Em xin chân thành cảm ơn Thầy. Kính thư. Hoặc Trân trọng. Bên dưới, ghi rõ họ tên đầy đủ, số điện thoại liên hệ nếu cần. Một lời kết lịch sự tạo ấn tượng tốt với người nhận.',
  },
  {
    id: 'point-5',
    text: 'Bước 5: Kiểm tra trước khi gửi, Review. Đây là bước quan trọng nhất mà nhiều sinh viên hay bỏ qua. Hãy đọc lại toàn bộ email để soát lỗi chính tả và ngữ pháp. Kiểm tra xem đã đính kèm tệp, Attachment, hay chưa nếu có nhắc đến. Xác nhận địa chỉ email người nhận chính xác. Một email không có lỗi thể hiện sự chuyên nghiệp và tôn trọng người nhận.',
  },
  {
    id: 'quiz',
    text: 'Bây giờ, hãy cùng kiểm tra kiến thức nhé! Câu hỏi: Tiêu đề email nào sau đây là chuyên nghiệp nhất? Hãy suy nghĩ và chọn đáp án. Đáp án đúng là B. Xin hỏi về bài tập, Nguyễn Văn A, K29. Vì tiêu đề này ngắn gọn, cụ thể và có thông tin định danh rõ ràng.',
  },
  {
    id: 'outro',
    text: 'Tuyệt vời! Bạn đã hoàn thành bài học. Hãy ghi nhớ 5 bước viết email chuyên nghiệp: Một là tiêu đề rõ ràng. Hai là lời chào lịch sự. Ba là nội dung ngắn gọn. Bốn là lời kết trang trọng. Và năm là kiểm tra kỹ trước khi gửi. Hãy thực hành viết email ngay hôm nay. Hẹn gặp lại bạn trong bài học tiếp theo!',
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

  console.log('\n=== Hoan thanh! ===');
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.mp3'));
  console.log(`Tong: ${files.length} files`);
  files.forEach(f => {
    const s = fs.statSync(path.join(OUTPUT_DIR, f));
    console.log(`  ${f}: ${(s.size / 1024).toFixed(1)} KB`);
  });
}

generateAllAudio().catch(console.error);
