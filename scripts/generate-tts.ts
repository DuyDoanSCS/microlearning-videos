// Script tạo voiceover tiếng Việt cho video microlearning
// Sử dụng edge-tts-universal (miễn phí, giọng neural Microsoft Edge)

import { EdgeTTS } from 'edge-tts-universal';
import * as fs from 'fs';
import * as path from 'path';

const OUTPUT_DIR = path.join(import.meta.dirname, '..', 'public', 'audio');

// Giọng đọc: vi-VN-HoaiMyNeural (nữ, rõ ràng)
const VOICE = 'vi-VN-HoaiMyNeural';

// Kịch bản voiceover cho từng phần
const sections = [
  {
    id: 'intro',
    text: `Xin chào các bạn sinh viên! Hôm nay chúng ta sẽ cùng học 5 bước để viết một email chuyên nghiệp. Đây là kỹ năng thiết yếu mà mọi sinh viên đại học cần nắm vững.`,
  },
  {
    id: 'point-1',
    text: `Bước 1: Dòng tiêu đề, hay còn gọi là Subject Line. Dòng tiêu đề phải ngắn gọn, cụ thể và nêu rõ mục đích email. Ví dụ: "Xin phép nghỉ học ngày 15 tháng 4 — Lớp Công nghệ thông tin K29". Tránh những tiêu đề mơ hồ như "Thầy ơi cho em hỏi" hay "Email quan trọng". Một tiêu đề tốt giúp người nhận nắm bắt nội dung ngay khi đọc lướt hộp thư.`,
  },
  {
    id: 'point-2',
    text: `Bước 2: Lời chào và giới thiệu. Luôn bắt đầu bằng lời chào lịch sự: "Kính gửi Thầy" hoặc "Kính gửi Cô". Tiếp theo, hãy tự giới thiệu ngắn gọn: họ tên, lớp, mã sinh viên. Ví dụ: "Em là Nguyễn Văn A, sinh viên lớp Công nghệ thông tin K29, mã số sinh viên 2024001". Điều này giúp giảng viên nhận biết bạn ngay lập tức.`,
  },
  {
    id: 'point-3',
    text: `Bước 3: Nội dung chính, hay còn gọi là Body. Hãy trình bày rõ ràng mục đích email trong 2 đến 3 câu. Dùng đoạn văn ngắn, tránh viết dài dòng. Nêu cụ thể yêu cầu hoặc thông tin bạn muốn truyền đạt. Ví dụ: "Em viết email này để xin phép nghỉ học buổi thứ Hai, ngày 15 tháng 4, vì em có lịch khám bệnh. Em sẽ nhờ bạn ghi chép bài và hoàn thành bài tập đúng hạn."`,
  },
  {
    id: 'point-4',
    text: `Bước 4: Lời kết và ký tên, hay còn gọi là Closing. Kết thúc email bằng lời cảm ơn và lời chào kính: "Em xin chân thành cảm ơn Thầy. Kính thư" hoặc "Trân trọng". Bên dưới, ghi rõ họ tên đầy đủ, số điện thoại liên hệ nếu cần. Một lời kết lịch sự tạo ấn tượng tốt với người nhận.`,
  },
  {
    id: 'point-5',
    text: `Bước 5: Kiểm tra trước khi gửi, hay còn gọi là Review. Đây là bước quan trọng nhất mà nhiều sinh viên hay bỏ qua. Hãy đọc lại toàn bộ email để soát lỗi chính tả và ngữ pháp. Kiểm tra xem đã đính kèm tệp hay chưa nếu có nhắc đến. Xác nhận địa chỉ email người nhận chính xác. Một email không có lỗi thể hiện sự chuyên nghiệp và tôn trọng người nhận.`,
  },
  {
    id: 'quiz',
    text: `Bây giờ, hãy cùng kiểm tra kiến thức nhé! Câu hỏi thứ nhất: Tiêu đề email nào sau đây là chuyên nghiệp nhất? Hãy chọn đáp án đúng. Đáp án đúng là B: "Xin hỏi về bài tập — Nguyễn Văn A, K29". Vì tiêu đề này ngắn gọn, cụ thể và có thông tin định danh. Câu hỏi thứ hai: Phần nào nên đặt NGAY SAU lời chào trong email? Đáp án đúng là C: Tự giới thiệu bản thân. Giảng viên cần biết bạn là ai trước khi đọc nội dung.`,
  },
  {
    id: 'outro',
    text: `Tuyệt vời! Bạn đã hoàn thành bài học. Hãy ghi nhớ 5 bước viết email chuyên nghiệp: Một, tiêu đề rõ ràng. Hai, lời chào lịch sự. Ba, nội dung ngắn gọn. Bốn, lời kết trang trọng. Và năm, kiểm tra kỹ trước khi gửi. Hãy thực hành viết email ngay hôm nay để rèn luyện kỹ năng nhé! Hẹn gặp lại bạn trong bài học tiếp theo.`,
  },
];

async function generateAllAudio() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const tts = new EdgeTTS();

  for (const section of sections) {
    const outputPath = path.join(OUTPUT_DIR, `${section.id}.mp3`);
    console.log(`🎙️ Đang tạo: ${section.id}.mp3 ...`);
    
    try {
      await tts.synthesize(section.text, VOICE, {});
      const audio = tts.toBuffer();
      fs.writeFileSync(outputPath, Buffer.from(audio));
      console.log(`   ✅ Hoàn thành: ${outputPath}`);
    } catch (err) {
      console.error(`   ❌ Lỗi tạo ${section.id}:`, err);
    }
  }

  console.log('\n🎉 Đã tạo xong tất cả file voiceover!');
}

generateAllAudio();
