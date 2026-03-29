import React from 'react';
import { Audio, staticFile } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { ConceptHook } from '../components/concept-explainer/ConceptHook';
import { ConceptDefinition } from '../components/concept-explainer/ConceptDefinition';
import { ConceptExample } from '../components/concept-explainer/ConceptExample';
import { ConceptApplication } from '../components/concept-explainer/ConceptApplication';
import { QuizCard } from '../components/QuizCard';
import { MicroOutro } from '../components/MicroOutro';
import { getTheme, toRemotionTheme } from '../styles/theme-loader';

import audioDurations from '../audioDurations-concept.json';

// ============================================================
// CONCEPT EXPLAINER: "OOP là gì?"
// Template: Hook → Definition → Visual → Example → Application → Quiz → Recap
// Bloom Level: Remember, Understand
// ============================================================

const FPS = 30;
const TRANSITION_FRAMES = 15;
const BUFFER_FRAMES = 60; // 2s

// Lấy duration từ audio hoặc fallback
const getDuration = (id: string, fallbackSeconds: number): number => {
  const section = audioDurations.sections?.[id];
  return section?.frames ?? fallbackSeconds * FPS;
};

// Theme
const videoTheme = getTheme('tech-blue');
const t = toRemotionTheme(videoTheme);
const headingColors = videoTheme.colors.headingColors;

// Helper: tạo colors object cho components
const colorProps = {
  primary: videoTheme.colors.primary,
  primaryLight: videoTheme.colors.primaryLight,
  accent: videoTheme.colors.accent,
  accentGreen: videoTheme.colors.accentGreen,
  accentRed: videoTheme.colors.accentRed,
  bgDark: videoTheme.colors.bgDark,
  bgDarkAlt: videoTheme.colors.bgDarkAlt,
  bgCard: videoTheme.colors.bgCard,
  bgGlass: videoTheme.colors.bgGlass,
  textWhite: videoTheme.colors.textWhite,
  textLight: videoTheme.colors.textLight,
  textMuted: videoTheme.colors.textMuted,
  gradientPrimary: videoTheme.gradients.primary,
  gradientDark: videoTheme.gradients.dark,
};

// ============ LESSON DATA ============

const lessonData = {
  hook: {
    hookText: 'Bạn có biết hơn 90% ứng dụng di động hiện nay đều được xây dựng bằng lập trình hướng đối tượng?',
    hookStat: '90%',
    title: 'OOP là gì?',
    subtitle: 'Lập trình hướng đối tượng cho người mới bắt đầu',
    lessonNumber: 'Bài 01 · Chương 1: Giới thiệu OOP',
    emoji: '🤔',
    audio: 'audio/concept-oop/hook.mp3',
    duration: getDuration('hook', 12),
  },

  definition: {
    term: 'OOP',
    termEnglish: 'Object-Oriented Programming',
    definition: 'Là mô hình lập trình tổ chức phần mềm thành các đối tượng. Mỗi đối tượng chứa dữ liệu và hành vi liên quan, phản ánh các thực thể trong thế giới thực.',
    keywords: ['Đối tượng', 'Thuộc tính', 'Phương thức', 'Lớp', 'Kế thừa'],
    headingColor: headingColors[0],
    audio: 'audio/concept-oop/definition.mp3',
    duration: getDuration('definition', 25),
  },

  visualExplain: {
    analogy: 'OOP giống như bản thiết kế nhà. Class là bản vẽ, mỗi ngôi nhà xây ra là một Object khác nhau.',
    content: '🚗 Lớp Xe:\n• Thuộc tính: màu sắc, tốc độ tối đa\n• Phương thức: khởi động, tăng tốc, phanh\n\nMỗi chiếc xe trên đường = 1 Object tạo từ Lớp Xe.',
    headingColor: headingColors[1],
    audio: 'audio/concept-oop/visual.mp3',
    duration: getDuration('visual', 30),
  },

  example: {
    analogy: 'Ứng dụng Grab: Mỗi tài xế = 1 Object TàiXế, mỗi khách = 1 Object KháchHàng.',
    content: '👤 Lớp TàiXế:\n• tên, biển số, đánh giá\n• nhậnĐơn(), diChuyển()\n\n📱 Lớp KháchHàng:\n• tên, vị trí, thanh toán\n• đặtXe(), đánhGiá()',
    headingColor: headingColors[2],
    audio: 'audio/concept-oop/example.mp3',
    duration: getDuration('example', 30),
  },

  application: {
    title: 'Tại sao phải học OOP?',
    applications: [
      'Code dễ bảo trì — sửa 1 chỗ không ảnh hưởng chỗ khác',
      'Tái sử dụng code — viết 1 lần, dùng nhiều lần',
      'Làm việc nhóm hiệu quả — mỗi người 1 nhóm đối tượng',
      'Mô hình hóa thế giới thực — dễ thiết kế hệ thống lớn',
    ],
    headingColor: headingColors[3],
    audio: 'audio/concept-oop/application.mp3',
    duration: getDuration('application', 25),
  },

  quiz: {
    question: 'Trong OOP, Class là gì?',
    options: [
      'Một biến lưu trữ dữ liệu',
      'Bản thiết kế để tạo ra các đối tượng',
      'Một hàm xử lý dữ liệu',
      'Một thư viện có sẵn',
    ],
    correctIndex: 1,
    explanation: 'Class = bản thiết kế (blueprint). Object = thực thể cụ thể tạo từ Class.',
    audio: 'audio/concept-oop/quiz.mp3',
    duration: getDuration('quiz', 22),
  },

  recap: {
    summary: 'OOP = Tổ chức code thành đối tượng.\nClass = Bản thiết kế.\nObject = Thực thể cụ thể.',
    nextLesson: '4 Tính chất cốt lõi của OOP',
    channelName: 'Microlearning · Đại học',
    audio: 'audio/concept-oop/recap.mp3',
    duration: getDuration('recap', 28),
    recapSteps: [
      { icon: '📖', text: 'OOP = Đối tượng hóa', color: headingColors[0] },
      { icon: '🏗️', text: 'Class = Bản thiết kế', color: headingColors[1] },
      { icon: '🚗', text: 'Object = Thực thể', color: headingColors[2] },
      { icon: '⚡', text: '4 tính chất cốt lõi', color: headingColors[3] },
    ],
  },
};

export const ConceptExplainerVideo: React.FC = () => {
  return (
    <TransitionSeries>
      {/* HOOK */}
      <TransitionSeries.Sequence durationInFrames={lessonData.hook.duration}>
        <>
          <Audio src={staticFile(lessonData.hook.audio)} />
          <ConceptHook
            hookText={lessonData.hook.hookText}
            hookStat={lessonData.hook.hookStat}
            title={lessonData.hook.title}
            subtitle={lessonData.hook.subtitle}
            lessonNumber={lessonData.hook.lessonNumber}
            emoji={lessonData.hook.emoji}
            colors={colorProps}
            fonts={videoTheme.fonts}
          />
        </>
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      {/* DEFINITION */}
      <TransitionSeries.Sequence durationInFrames={lessonData.definition.duration}>
        <>
          <Audio src={staticFile(lessonData.definition.audio)} />
          <ConceptDefinition
            term={lessonData.definition.term}
            termEnglish={lessonData.definition.termEnglish}
            definition={lessonData.definition.definition}
            keywords={lessonData.definition.keywords}
            headingColor={lessonData.definition.headingColor}
            colors={colorProps}
            fonts={videoTheme.fonts}
            totalFrames={lessonData.definition.duration}
          />
        </>
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      {/* VISUAL EXPLAIN */}
      <TransitionSeries.Sequence durationInFrames={lessonData.visualExplain.duration}>
        <>
          <Audio src={staticFile(lessonData.visualExplain.audio)} />
          <ConceptExample
            analogy={lessonData.visualExplain.analogy}
            content={lessonData.visualExplain.content}
            headingColor={lessonData.visualExplain.headingColor}
            colors={colorProps}
            fonts={videoTheme.fonts}
            totalFrames={lessonData.visualExplain.duration}
          />
        </>
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      {/* REAL EXAMPLE */}
      <TransitionSeries.Sequence durationInFrames={lessonData.example.duration}>
        <>
          <Audio src={staticFile(lessonData.example.audio)} />
          <ConceptExample
            analogy={lessonData.example.analogy}
            content={lessonData.example.content}
            headingColor={lessonData.example.headingColor}
            colors={colorProps}
            fonts={videoTheme.fonts}
            totalFrames={lessonData.example.duration}
          />
        </>
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      {/* APPLICATION */}
      <TransitionSeries.Sequence durationInFrames={lessonData.application.duration}>
        <>
          <Audio src={staticFile(lessonData.application.audio)} />
          <ConceptApplication
            title={lessonData.application.title}
            applications={lessonData.application.applications}
            headingColor={lessonData.application.headingColor}
            colors={colorProps}
            fonts={videoTheme.fonts}
            totalFrames={lessonData.application.duration}
          />
        </>
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      {/* QUIZ */}
      <TransitionSeries.Sequence durationInFrames={lessonData.quiz.duration}>
        <>
          <Audio src={staticFile(lessonData.quiz.audio)} />
          <QuizCard
            question={lessonData.quiz.question}
            options={lessonData.quiz.options}
            correctIndex={lessonData.quiz.correctIndex}
            explanation={lessonData.quiz.explanation}
            revealAtFrame={Math.floor(lessonData.quiz.duration * 0.6)}
          />
        </>
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      {/* RECAP */}
      <TransitionSeries.Sequence durationInFrames={lessonData.recap.duration}>
        <>
          <Audio src={staticFile(lessonData.recap.audio)} />
          <MicroOutro
            summary={lessonData.recap.summary}
            nextLesson={lessonData.recap.nextLesson}
            channelName={lessonData.recap.channelName}
            recapSteps={lessonData.recap.recapSteps}
            totalFrames={lessonData.recap.duration}
          />
        </>
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
