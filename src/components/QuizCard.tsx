import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from 'remotion';
import { theme as defaultTheme } from '../styles/theme';

// Colors interface — cho phép truyền theme dynamic
interface ThemeColors {
  primary: string;
  accent: string;
  accentGreen: string;
  accentRed: string;
  bgDark: string;
  bgCard: string;
  bgGlass: string;
  textWhite: string;
  textLight: string;
  textMuted: string;
  gradientDark?: string;
}

interface QuizCardProps {
  question: string;
  options: string[];
  correctIndex: number;
  revealAtFrame?: number;
  explanation?: string;
  colors?: ThemeColors; // ← DYNAMIC THEME
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  options,
  correctIndex,
  revealAtFrame = 360,
  explanation,
  colors,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Theme: dùng colors prop nếu có, fallback theme.ts
  const c: ThemeColors = colors || {
    primary: defaultTheme.colors.primary,
    accent: defaultTheme.colors.accent,
    accentGreen: defaultTheme.colors.accentGreen,
    accentRed: defaultTheme.colors.accentRed,
    bgDark: defaultTheme.colors.bgDark,
    bgCard: defaultTheme.colors.bgCard,
    bgGlass: defaultTheme.colors.bgGlass,
    textWhite: defaultTheme.colors.textWhite,
    textLight: defaultTheme.colors.textLight,
    textMuted: defaultTheme.colors.textMuted,
    gradientDark: defaultTheme.gradients.dark,
  };

  const gradientDark = c.gradientDark || defaultTheme.gradients.dark;

  const isRevealed = frame >= revealAtFrame;

  // Fade-out cuối section — tỉ lệ %
  const fadeOutStart = Math.floor(durationInFrames * 0.88);
  const fadeOutEnd = Math.floor(durationInFrames * 0.96);

  const questionSlide = spring({
    frame: frame - 5,
    fps,
    config: { damping: 15 },
  });

  const timerProgress = interpolate(
    frame,
    [20, revealAtFrame],
    [100, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const explanationFade = interpolate(
    frame,
    [revealAtFrame + 15, revealAtFrame + 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const explanationSlide = spring({
    frame: frame - (revealAtFrame + 15),
    fps,
    config: { damping: 14 },
  });

  const sparkleScale = spring({
    frame: frame - (revealAtFrame + 5),
    fps,
    config: { damping: 8, mass: 0.5 },
  });

  const fadeOut = interpolate(frame, [fadeOutStart, fadeOutEnd], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: gradientDark,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: defaultTheme.fonts.heading,
        padding: defaultTheme.spacing.xl,
        opacity: fadeOut,
      }}
    >
      {/* Quiz badge */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          background: c.accent,
          padding: '10px 28px',
          borderRadius: defaultTheme.borderRadius.full,
          fontSize: defaultTheme.fontSizes.caption,
          fontWeight: 700,
          color: c.bgDark,
          transform: `scale(${spring({ frame: frame - 3, fps, config: { damping: 10 } })})`,
        }}
      >
        ❓ CÂU HỎI NHANH
      </div>

      {/* Timer bar */}
      <div
        style={{
          position: 'absolute',
          top: 160,
          width: '80%',
          height: 6,
          background: c.bgCard,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${timerProgress}%`,
            background: timerProgress > 30 ? c.accent : c.accentRed,
            borderRadius: 3,
          }}
        />
      </div>

      {/* Question */}
      <div
        style={{
          fontSize: defaultTheme.fontSizes.heading - 4,
          fontWeight: 700,
          color: c.textWhite,
          textAlign: 'center',
          maxWidth: '85%',
          lineHeight: 1.4,
          marginTop: 40,
          marginBottom: defaultTheme.spacing.lg,
          transform: `translateY(${interpolate(questionSlide, [0, 1], [50, 0])}px)`,
          opacity: questionSlide,
        }}
      >
        {question}
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: defaultTheme.spacing.sm, width: '85%' }}>
        {options.map((option, index) => {
          const optionDelay = 20 + index * 8;
          const optionSpring = spring({ frame: frame - optionDelay, fps, config: { damping: 14 } });
          const isCorrect = index === correctIndex;
          const labels = ['A', 'B', 'C', 'D'];

          let bgColor = c.bgGlass;
          let borderColor = `${c.primary}44`;
          let textColor = c.textWhite;

          if (isRevealed) {
            if (isCorrect) {
              bgColor = `${c.accentGreen}22`;
              borderColor = c.accentGreen;
              textColor = c.accentGreen;
            } else {
              bgColor = `${c.accentRed}11`;
              borderColor = `${c.accentRed}44`;
              textColor = c.textMuted;
            }
          }

          return (
            <div
              key={index}
              style={{
                display: 'flex', alignItems: 'center', gap: defaultTheme.spacing.sm,
                background: bgColor,
                border: `2px solid ${borderColor}`,
                borderRadius: defaultTheme.borderRadius.md,
                padding: '14px 20px',
                transform: `translateX(${interpolate(optionSpring, [0, 1], [-60, 0])}px)`,
                opacity: optionSpring,
              }}
            >
              <div
                style={{
                  width: 40, height: 40,
                  borderRadius: defaultTheme.borderRadius.sm,
                  background: isRevealed && isCorrect ? c.accentGreen : c.primary,
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  fontSize: defaultTheme.fontSizes.body - 2,
                  fontWeight: 700, color: c.textWhite, flexShrink: 0,
                }}
              >
                {isRevealed && isCorrect ? '✓' : labels[index]}
              </div>
              <div
                style={{
                  fontSize: defaultTheme.fontSizes.body - 4,
                  color: textColor,
                  fontWeight: isRevealed && isCorrect ? 700 : 400,
                }}
              >
                {option}
              </div>
            </div>
          );
        })}
      </div>

      {/* Celebration sparkle */}
      {isRevealed && (
        <div
          style={{
            position: 'absolute', top: 60, right: 60,
            fontSize: 48,
            transform: `scale(${sparkleScale}) rotate(${frame * 2}deg)`,
            opacity: interpolate(sparkleScale, [0, 1], [0, 0.8]),
          }}
        >
          ✨
        </div>
      )}

      {/* Explanation */}
      {isRevealed && explanation && (
        <div
          style={{
            position: 'absolute', bottom: 100, width: '80%',
            opacity: explanationFade,
            transform: `translateY(${interpolate(explanationSlide, [0, 1], [20, 0])}px)`,
          }}
        >
          <div
            style={{
              background: `${c.accentGreen}15`,
              border: `1px solid ${c.accentGreen}44`,
              borderRadius: defaultTheme.borderRadius.md,
              padding: '14px 20px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: defaultTheme.fontSizes.small + 2,
                color: c.accentGreen,
                lineHeight: 1.5,
                fontWeight: 500,
              }}
            >
              {explanation}
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
