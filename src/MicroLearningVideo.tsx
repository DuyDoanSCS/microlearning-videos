import React from 'react';
import { Audio, staticFile, Series } from 'remotion';
import { MicroIntro } from './components/MicroIntro';
import { KeyPoint } from './components/KeyPoint';
import { QuizCard } from './components/QuizCard';
import { MicroOutro } from './components/MicroOutro';

// ============================================================
// BÀI HỌC: "5 Bước Viết Email Chuyên Nghiệp"
// Đối tượng: Sinh viên đại học năm 1-2
// Thời lượng: 3 phút (180s = 5400 frames @ 30fps)
// Voiceover: Tiếng Việt (vi-VN-HoaiMyNeural)
// ============================================================

const fps = 30;

const lessonData = {
  intro: {
    title: '5 Bước Viết Email\nChuyên Nghiệp',
    subtitle: 'Kỹ năng thiết yếu cho sinh viên đại học',
    lessonNumber: 'Bài 01 · Kỹ năng mềm (Soft Skills)',
    emoji: '✉️',
    audio: 'audio/intro.mp3',
    duration: 8 * fps,
  },

  keyPoints: [
    {
      icon: '📌',
      title: 'Dòng tiêu đề (Subject Line)',
      description:
        'Ngắn gọn, cụ thể, nêu rõ mục đích.\n\nVí dụ: "Xin phép nghỉ học ngày 15/04 — Lớp CNTT K29"\n\n❌ Tránh: "Thầy ơi cho em hỏi" hoặc "Email quan trọng"',
      audio: 'audio/point-1.mp3',
      illustration: 'images/step1-subject.png',
      duration: 22 * fps,
    },
    {
      icon: '👋',
      title: 'Lời chào & Giới thiệu (Greeting)',
      description:
        '"Kính gửi Thầy/Cô..."\n\nTự giới thiệu: Họ tên + Lớp + Mã SV\n\nVí dụ: "Em là Nguyễn Văn A, lớp CNTT K29, MSSV 2024001"',
      audio: 'audio/point-2.mp3',
      illustration: 'images/step2-greeting.png',
      duration: 22 * fps,
    },
    {
      icon: '📝',
      title: 'Nội dung chính (Body)',
      description:
        'Trình bày rõ ràng trong 2-3 câu.\nDùng đoạn văn ngắn, tránh dài dòng.\nNêu mục đích cụ thể.\n\nVí dụ: "Em xin phép nghỉ học ngày 15/04 vì có lịch khám bệnh."',
      audio: 'audio/point-3.mp3',
      illustration: 'images/step3-body.png',
      duration: 22 * fps,
    },
    {
      icon: '✍️',
      title: 'Lời kết & Ký tên (Closing)',
      description:
        '"Em xin chân thành cảm ơn Thầy.\nKính thư" hoặc "Trân trọng"\n\nGhi rõ: Họ tên đầy đủ + SĐT liên hệ',
      audio: 'audio/point-4.mp3',
      illustration: 'images/step4-closing.png',
      duration: 22 * fps,
    },
    {
      icon: '🔍',
      title: 'Kiểm tra trước khi gửi (Review)',
      description:
        '✅ Soát lỗi chính tả & ngữ pháp\n✅ Kiểm tra tệp đính kèm (Attachment)\n✅ Xác nhận địa chỉ email người nhận\n\n→ Email không lỗi = Chuyên nghiệp!',
      audio: 'audio/point-5.mp3',
      illustration: 'images/step5-review.png',
      duration: 22 * fps,
    },
  ],

  quiz: {
    question: 'Tiêu đề email nào sau đây là CHUYÊN NGHIỆP nhất?',
    options: [
      'Thầy ơi cho em hỏi',
      'Xin hỏi về bài tập — Nguyễn Văn A, K29',
      'Help!!!',
      'email quan trọng',
    ],
    correctIndex: 1,
    audio: 'audio/quiz.mp3',
    duration: 30 * fps,
  },

  outro: {
    summary:
      '5 bước: Tiêu đề rõ ràng → Chào hỏi lịch sự → Nội dung ngắn gọn → Lời kết trang trọng → Kiểm tra kỹ.\n\nHãy thực hành ngay hôm nay!',
    nextLesson: 'Cách trình bày (Presentation) hiệu quả',
    channelName: 'Microlearning · Đại học',
    audio: 'audio/outro.mp3',
    duration: 32 * fps,
  },
};

export const MicroLearningVideo: React.FC = () => {
  return (
    <Series>
      {/* INTRO */}
      <Series.Sequence durationInFrames={lessonData.intro.duration}>
        <>
          <Audio src={staticFile(lessonData.intro.audio)} />
          <MicroIntro
            title={lessonData.intro.title}
            subtitle={lessonData.intro.subtitle}
            lessonNumber={lessonData.intro.lessonNumber}
            emoji={lessonData.intro.emoji}
          />
        </>
      </Series.Sequence>

      {/* 5 KEY POINTS */}
      {lessonData.keyPoints.map((point, index) => (
        <Series.Sequence key={index} durationInFrames={point.duration}>
          <>
            <Audio src={staticFile(point.audio)} />
            <KeyPoint
              pointNumber={index + 1}
              totalPoints={lessonData.keyPoints.length}
              title={point.title}
              description={point.description}
              icon={point.icon}
              illustration={point.illustration}
            />
          </>
        </Series.Sequence>
      ))}

      {/* QUIZ */}
      <Series.Sequence durationInFrames={lessonData.quiz.duration}>
        <>
          <Audio src={staticFile(lessonData.quiz.audio)} />
          <QuizCard
            question={lessonData.quiz.question}
            options={lessonData.quiz.options}
            correctIndex={lessonData.quiz.correctIndex}
            revealAtFrame={16 * fps}
          />
        </>
      </Series.Sequence>

      {/* OUTRO */}
      <Series.Sequence durationInFrames={lessonData.outro.duration}>
        <>
          <Audio src={staticFile(lessonData.outro.audio)} />
          <MicroOutro
            summary={lessonData.outro.summary}
            nextLesson={lessonData.outro.nextLesson}
            channelName={lessonData.outro.channelName}
          />
        </>
      </Series.Sequence>
    </Series>
  );
};
