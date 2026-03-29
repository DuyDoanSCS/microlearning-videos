import React from 'react';
import { Audio, staticFile, getInputProps } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { ConceptHook } from '../components/concept-explainer/ConceptHook';
import { ConceptDefinition } from '../components/concept-explainer/ConceptDefinition';
import { ConceptExample } from '../components/concept-explainer/ConceptExample';
import { ConceptApplication } from '../components/concept-explainer/ConceptApplication';
import { QuizCard } from '../components/QuizCard';
import { MicroOutro } from '../components/MicroOutro';

// ============================================================
// CONCEPT EXPLAINER — Dynamic Template
// Đọc data từ inputProps (pipeline truyền vào lúc render)
// Fallback: dùng data mẫu OOP cho Studio preview
// ============================================================

const FPS = 30;
const TRANSITION_FRAMES = 15;

// ============ FALLBACK DATA (cho Remotion Studio preview) ============

const FALLBACK_PROPS = {
  lessonData: {
    hook: {
      hookText: 'Bạn có biết hơn 90% ứng dụng di động đều dùng lập trình hướng đối tượng?',
      hookStat: '90%',
      title: 'OOP là gì?',
      subtitle: 'Lập trình hướng đối tượng cho người mới',
      lessonNumber: 'Bài 01 · Chương 1: Giới thiệu OOP',
      emoji: '🤔',
      audio: 'audio/oop-la-gi/hook.mp3',
      duration: 421,
    },
    definition: {
      term: 'OOP',
      termEnglish: 'Object-Oriented Programming',
      definition: 'Là mô hình lập trình tổ chức phần mềm thành các đối tượng, mỗi đối tượng chứa dữ liệu và hành vi liên quan.',
      keywords: ['Đối tượng', 'Thuộc tính', 'Phương thức', 'Lớp', 'Kế thừa'],
      headingColor: '#60A5FA',
      audio: 'audio/oop-la-gi/definition.mp3',
      duration: 614,
    },
    visualExplain: {
      analogy: 'OOP giống như bản thiết kế nhà. Class = bản vẽ, Object = ngôi nhà.',
      content: '🚗 Lớp Xe:\n• Thuộc tính: màu sắc, tốc độ\n• Phương thức: khởi động, tăng tốc\n\nMỗi chiếc xe = 1 Object.',
      headingColor: '#34D399',
      audio: 'audio/oop-la-gi/visual.mp3',
      duration: 931,
    },
    example: {
      analogy: 'Grab: Mỗi tài xế = 1 Object TàiXế.',
      content: '👤 Lớp TàiXế:\n• tên, biển số\n• nhậnĐơn()\n\n📱 Lớp KháchHàng:\n• tên, vị trí\n• đặtXe()',
      headingColor: '#FBBF24',
      audio: 'audio/oop-la-gi/example.mp3',
      duration: 999,
    },
    application: {
      title: 'Tại sao phải học OOP?',
      applications: [
        'Code dễ bảo trì',
        'Tái sử dụng code',
        'Làm việc nhóm hiệu quả',
        'Mô hình hóa thế giới thực',
      ],
      headingColor: '#F472B6',
      audio: 'audio/oop-la-gi/application.mp3',
      duration: 786,
    },
    quiz: {
      question: 'Trong OOP, Class là gì?',
      options: ['Một biến lưu trữ', 'Bản thiết kế đối tượng', 'Một hàm xử lý', 'Thư viện có sẵn'],
      correctIndex: 1,
      explanation: 'Class = bản thiết kế. Object = thực thể.',
      audio: 'audio/oop-la-gi/quiz.mp3',
      duration: 913,
    },
    recap: {
      summary: 'OOP = đối tượng hóa. Class = Bản thiết kế. Object = Thực thể.',
      nextLesson: '4 Tính chất cốt lõi của OOP',
      channelName: 'Microlearning · Đại học',
      recapSteps: [
        { icon: '📖', text: 'OOP = Đối tượng hóa', color: '#60A5FA' },
        { icon: '🏗️', text: 'Class = Bản thiết kế', color: '#34D399' },
        { icon: '🚗', text: 'Object = Thực thể', color: '#FBBF24' },
        { icon: '⚡', text: '4 tính chất cốt lõi', color: '#F472B6' },
      ],
      audio: 'audio/oop-la-gi/recap.mp3',
      duration: 528,
    },
  },
  colorProps: {
    primary: '#2563EB',
    primaryLight: '#60A5FA',
    accent: '#F59E0B',
    accentGreen: '#10B981',
    accentRed: '#EF4444',
    bgDark: '#0F172A',
    bgDarkAlt: '#1E293B',
    bgCard: '#1E293B',
    bgGlass: 'rgba(255,255,255,0.05)',
    textWhite: '#F8FAFC',
    textLight: '#CBD5E1',
    textMuted: '#64748B',
    gradientPrimary: 'linear-gradient(135deg, #2563EB, #06B6D4)',
    gradientDark: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
  },
  headingColors: ['#60A5FA', '#34D399', '#FBBF24', '#F472B6', '#A78BFA'],
};

// ============ TYPES ============

interface LessonSection {
  audio: string;
  duration: number;
  [key: string]: unknown;
}

interface ConceptInputProps {
  lessonData: Record<string, LessonSection>;
  colorProps: Record<string, string>;
  headingColors: string[];
  [key: string]: unknown;
}

// ============ COMPONENT ============

export const ConceptExplainerVideo: React.FC<ConceptInputProps> = (propsFromComposition) => {
  // Nguồn data: inputProps (từ pipeline --props) > composition props > fallback
  const rawInputProps = getInputProps() as Partial<ConceptInputProps>;

  const hasInputProps = rawInputProps && Object.keys(rawInputProps).length > 0;
  const hasCompositionProps = propsFromComposition?.lessonData && Object.keys(propsFromComposition.lessonData).length > 0;

  let props: ConceptInputProps;
  if (hasInputProps) {
    props = rawInputProps as ConceptInputProps;
  } else if (hasCompositionProps) {
    props = propsFromComposition;
  } else {
    props = FALLBACK_PROPS;
  }

  const { lessonData, colorProps } = props;

  // Fonts (dùng mặc định)
  const fonts = {
    heading: "'Be Vietnam Pro', 'Inter', sans-serif",
    body: "'Inter', sans-serif",
  };

  return (
    <TransitionSeries>
      {/* HOOK */}
      {lessonData.hook && (
        <>
          <TransitionSeries.Sequence durationInFrames={lessonData.hook.duration}>
            <>
              <Audio src={staticFile(lessonData.hook.audio)} />
              <ConceptHook
                hookText={(lessonData.hook as any).hookText}
                hookStat={(lessonData.hook as any).hookStat}
                title={(lessonData.hook as any).title}
                subtitle={(lessonData.hook as any).subtitle}
                lessonNumber={(lessonData.hook as any).lessonNumber}
                emoji={(lessonData.hook as any).emoji}
                colors={colorProps}
                fonts={fonts}
              />
            </>
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
          />
        </>
      )}

      {/* DEFINITION */}
      {lessonData.definition && (
        <>
          <TransitionSeries.Sequence durationInFrames={lessonData.definition.duration}>
            <>
              <Audio src={staticFile(lessonData.definition.audio)} />
              <ConceptDefinition
                term={(lessonData.definition as any).term}
                termEnglish={(lessonData.definition as any).termEnglish}
                definition={(lessonData.definition as any).definition}
                keywords={(lessonData.definition as any).keywords}
                headingColor={(lessonData.definition as any).headingColor}
                colors={colorProps}
                fonts={fonts}
                totalFrames={lessonData.definition.duration}
              />
            </>
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
          />
        </>
      )}

      {/* VISUAL EXPLAIN */}
      {lessonData.visualExplain && (
        <>
          <TransitionSeries.Sequence durationInFrames={lessonData.visualExplain.duration}>
            <>
              <Audio src={staticFile(lessonData.visualExplain.audio)} />
              <ConceptExample
                analogy={(lessonData.visualExplain as any).analogy}
                content={(lessonData.visualExplain as any).content}
                headingColor={(lessonData.visualExplain as any).headingColor}
                colors={colorProps}
                fonts={fonts}
                totalFrames={lessonData.visualExplain.duration}
              />
            </>
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
          />
        </>
      )}

      {/* REAL EXAMPLE */}
      {lessonData.example && (
        <>
          <TransitionSeries.Sequence durationInFrames={lessonData.example.duration}>
            <>
              <Audio src={staticFile(lessonData.example.audio)} />
              <ConceptExample
                analogy={(lessonData.example as any).analogy}
                content={(lessonData.example as any).content}
                headingColor={(lessonData.example as any).headingColor}
                colors={colorProps}
                fonts={fonts}
                totalFrames={lessonData.example.duration}
              />
            </>
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
          />
        </>
      )}

      {/* APPLICATION */}
      {lessonData.application && (
        <>
          <TransitionSeries.Sequence durationInFrames={lessonData.application.duration}>
            <>
              <Audio src={staticFile(lessonData.application.audio)} />
              <ConceptApplication
                title={(lessonData.application as any).title}
                applications={(lessonData.application as any).applications}
                headingColor={(lessonData.application as any).headingColor}
                colors={colorProps}
                fonts={fonts}
                totalFrames={lessonData.application.duration}
              />
            </>
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
          />
        </>
      )}

      {/* QUIZ */}
      {lessonData.quiz && (
        <>
          <TransitionSeries.Sequence durationInFrames={lessonData.quiz.duration}>
            <>
              <Audio src={staticFile(lessonData.quiz.audio)} />
              <QuizCard
                question={(lessonData.quiz as any).question}
                options={(lessonData.quiz as any).options}
                correctIndex={(lessonData.quiz as any).correctIndex}
                explanation={(lessonData.quiz as any).explanation}
                revealAtFrame={Math.floor(lessonData.quiz.duration * 0.6)}
                colors={{
                  primary: colorProps.primary,
                  accent: colorProps.accent,
                  accentGreen: colorProps.accentGreen,
                  accentRed: colorProps.accentRed,
                  bgDark: colorProps.bgDark,
                  bgCard: colorProps.bgCard || '#1E293B',
                  bgGlass: colorProps.bgGlass,
                  textWhite: colorProps.textWhite,
                  textLight: colorProps.textLight,
                  textMuted: colorProps.textMuted,
                  gradientDark: colorProps.gradientDark,
                }}
              />
            </>
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
          />
        </>
      )}

      {/* RECAP */}
      {lessonData.recap && (
        <TransitionSeries.Sequence durationInFrames={lessonData.recap.duration}>
          <>
            <Audio src={staticFile(lessonData.recap.audio)} />
            <MicroOutro
              summary={(lessonData.recap as any).summary}
              nextLesson={(lessonData.recap as any).nextLesson}
              channelName={(lessonData.recap as any).channelName}
              recapSteps={(lessonData.recap as any).recapSteps}
              totalFrames={lessonData.recap.duration}
              colors={{
                primary: colorProps.primary,
                primaryLight: colorProps.primaryLight,
                bgDark: colorProps.bgDark,
                bgGlass: colorProps.bgGlass,
                textWhite: colorProps.textWhite,
                textMuted: colorProps.textMuted,
                gradientPrimary: colorProps.gradientPrimary,
                gradientDark: colorProps.gradientDark,
              }}
            />
          </>
        </TransitionSeries.Sequence>
      )}
    </TransitionSeries>
  );
};
