import React from 'react';
import { Audio, staticFile } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { MicroIntro } from './components/MicroIntro';
import { KeyPoint } from './components/KeyPoint';
import { QuizCard } from './components/QuizCard';
import { MicroOutro } from './components/MicroOutro';
import { theme } from './styles/theme';

// ============================================================
// BÀI HỌC: "5 Bước Viết Email Chuyên Nghiệp" — v4
// Đối tượng: Sinh viên đại học năm 1-2
// Thời lượng: ~179s (≈3:00) — 0 dead time
// Voiceover: Tiếng Việt (vi-VN-HoaiMyNeural)
// Nâng cấp v4:
//   - Heading colors riêng cho mỗi bước (Attention Theory)
//   - Tip card ở cuối mỗi KeyPoint
//   - TransitionSeries fade 0.5s giữa sections
//   - Visual recap ở Outro (Forgetting Curve)
//   - Quiz rút gọn, không dead time
// ============================================================

const fps = 30;
const TRANSITION_FRAMES = 15; // 0.5s fade transition

const headingColors = theme.colors.headingColors;

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
      headingColor: headingColors[0],
      tip: 'Hãy viết tiêu đề cuối cùng, sau khi hoàn thành nội dung email.',
      duration: 26 * fps,
    },
    {
      icon: '👋',
      title: 'Lời chào & Giới thiệu (Greeting)',
      description:
        '"Kính gửi Thầy/Cô..."\n\nTự giới thiệu: Họ tên + Lớp + Mã SV\n\nVí dụ: "Em là Nguyễn Văn A, lớp CNTT K29, MSSV 2024001"',
      audio: 'audio/point-2.mp3',
      illustration: 'images/step2-greeting.png',
      headingColor: headingColors[1],
      tip: 'Với giảng viên chưa quen, hãy giới thiệu kỹ hơn để tạo ấn tượng tốt.',
      duration: 26 * fps,
    },
    {
      icon: '📝',
      title: 'Nội dung chính (Body)',
      description:
        'Trình bày rõ ràng trong 2-3 câu.\nDùng đoạn văn ngắn, tránh dài dòng.\nNêu mục đích cụ thể.\n\nVí dụ: "Em xin phép nghỉ học ngày 15/04 vì có lịch khám bệnh."',
      audio: 'audio/point-3.mp3',
      illustration: 'images/step3-body.png',
      headingColor: headingColors[2],
      tip: 'Quy tắc vàng: Email dài hơn 5 câu → hãy dùng bullet points.',
      duration: 26 * fps,
    },
    {
      icon: '✍️',
      title: 'Lời kết & Ký tên (Closing)',
      description:
        '"Em xin chân thành cảm ơn Thầy.\nKính thư" hoặc "Trân trọng"\n\nGhi rõ: Họ tên đầy đủ + SĐT liên hệ',
      audio: 'audio/point-4.mp3',
      illustration: 'images/step4-closing.png',
      headingColor: headingColors[3],
      tip: 'Tránh dùng từ viết tắt — hãy dùng ngôn ngữ trang trọng và chuyên nghiệp.',
      duration: 26 * fps,
    },
    {
      icon: '🔍',
      title: 'Kiểm tra trước khi gửi (Review)',
      description:
        '✅ Soát lỗi chính tả & ngữ pháp\n✅ Kiểm tra tệp đính kèm (Attachment)\n✅ Xác nhận địa chỉ email người nhận\n\n→ Email không lỗi = Chuyên nghiệp!',
      audio: 'audio/point-5.mp3',
      illustration: 'images/step5-review.png',
      headingColor: headingColors[4],
      tip: 'Mẹo nhanh: Đọc to email trước khi gửi — phát hiện lỗi dễ hơn!',
      duration: 26 * fps,
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
    explanation: 'Tiêu đề ngắn gọn, cụ thể, có thông tin định danh → Chuyên nghiệp!',
    audio: 'audio/quiz.mp3',
    duration: 20 * fps,
  },

  outro: {
    summary:
      '5 bước: Tiêu đề rõ ràng → Chào hỏi lịch sự → Nội dung ngắn gọn → Lời kết trang trọng → Kiểm tra kỹ.\n\nHãy thực hành ngay hôm nay!',
    nextLesson: 'Cách trình bày (Presentation) hiệu quả',
    channelName: 'Microlearning · Đại học',
    audio: 'audio/outro.mp3',
    duration: 24 * fps,
    recapSteps: [
      { icon: '📌', text: 'Tiêu đề rõ ràng', color: headingColors[0] },
      { icon: '👋', text: 'Chào hỏi lịch sự', color: headingColors[1] },
      { icon: '📝', text: 'Nội dung ngắn gọn', color: headingColors[2] },
      { icon: '✍️', text: 'Lời kết trang trọng', color: headingColors[3] },
      { icon: '🔍', text: 'Kiểm tra kỹ', color: headingColors[4] },
    ],
  },
};

export const MicroLearningVideo: React.FC = () => {
  return (
    <TransitionSeries>
      {/* INTRO */}
      <TransitionSeries.Sequence durationInFrames={lessonData.intro.duration}>
        <>
          <Audio src={staticFile(lessonData.intro.audio)} />
          <MicroIntro
            title={lessonData.intro.title}
            subtitle={lessonData.intro.subtitle}
            lessonNumber={lessonData.intro.lessonNumber}
            emoji={lessonData.intro.emoji}
          />
        </>
      </TransitionSeries.Sequence>

      {/* TRANSITION: Intro → KeyPoint 1 */}
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      {/* 5 KEY POINTS with transitions */}
      {lessonData.keyPoints.map((point, index) => (
        <React.Fragment key={index}>
          <TransitionSeries.Sequence durationInFrames={point.duration}>
            <>
              <Audio src={staticFile(point.audio)} />
              <KeyPoint
                pointNumber={index + 1}
                totalPoints={lessonData.keyPoints.length}
                title={point.title}
                description={point.description}
                icon={point.icon}
                illustration={point.illustration}
                headingColor={point.headingColor}
                tip={point.tip}
              />
            </>
          </TransitionSeries.Sequence>

          {/* TRANSITION between points / to quiz */}
          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
          />
        </React.Fragment>
      ))}

      {/* QUIZ */}
      <TransitionSeries.Sequence durationInFrames={lessonData.quiz.duration}>
        <>
          <Audio src={staticFile(lessonData.quiz.audio)} />
          <QuizCard
            question={lessonData.quiz.question}
            options={lessonData.quiz.options}
            correctIndex={lessonData.quiz.correctIndex}
            explanation={lessonData.quiz.explanation}
            revealAtFrame={12 * fps}
          />
        </>
      </TransitionSeries.Sequence>

      {/* TRANSITION: Quiz → Outro */}
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      {/* OUTRO with visual recap */}
      <TransitionSeries.Sequence durationInFrames={lessonData.outro.duration}>
        <>
          <Audio src={staticFile(lessonData.outro.audio)} />
          <MicroOutro
            summary={lessonData.outro.summary}
            nextLesson={lessonData.outro.nextLesson}
            channelName={lessonData.outro.channelName}
            recapSteps={lessonData.outro.recapSteps}
          />
        </>
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
