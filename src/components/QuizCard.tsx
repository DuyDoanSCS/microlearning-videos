import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from 'remotion';
import { theme } from '../styles/theme';

interface QuizCardProps {
  question: string;
  options: string[];
  correctIndex: number;
  revealAtFrame?: number;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  options,
  correctIndex,
  revealAtFrame = 120,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isRevealed = frame >= revealAtFrame;

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

  return (
    <AbsoluteFill
      style={{
        background: theme.gradients.dark,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: theme.fonts.heading,
        padding: theme.spacing.xl,
      }}
    >
      {/* Quiz badge */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          background: theme.colors.accent,
          padding: '10px 28px',
          borderRadius: theme.borderRadius.full,
          fontSize: theme.fontSizes.caption,
          fontWeight: 700,
          color: theme.colors.bgDark,
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
          background: theme.colors.bgCard,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${timerProgress}%`,
            background: timerProgress > 30
              ? theme.colors.accent
              : theme.colors.accentRed,
            borderRadius: 3,
          }}
        />
      </div>

      {/* Question */}
      <div
        style={{
          fontSize: theme.fontSizes.heading - 4,
          fontWeight: 700,
          color: theme.colors.textWhite,
          textAlign: 'center',
          maxWidth: '85%',
          lineHeight: 1.4,
          marginTop: 40,
          marginBottom: theme.spacing.lg,
          transform: `translateY(${interpolate(questionSlide, [0, 1], [50, 0])}px)`,
          opacity: questionSlide,
        }}
      >
        {question}
      </div>

      {/* Options */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.sm,
          width: '85%',
        }}
      >
        {options.map((option, index) => {
          const optionDelay = 20 + index * 8;
          const optionSpring = spring({
            frame: frame - optionDelay,
            fps,
            config: { damping: 14 },
          });

          const isCorrect = index === correctIndex;
          const labels = ['A', 'B', 'C', 'D'];

          let bgColor = theme.colors.bgGlass;
          let borderColor = `${theme.colors.primary}44`;
          let textColor = theme.colors.textWhite;

          if (isRevealed) {
            if (isCorrect) {
              bgColor = `${theme.colors.accentGreen}22`;
              borderColor = theme.colors.accentGreen;
              textColor = theme.colors.accentGreen;
            } else {
              bgColor = `${theme.colors.accentRed}11`;
              borderColor = `${theme.colors.accentRed}44`;
              textColor = theme.colors.textMuted;
            }
          }

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
                background: bgColor,
                border: `2px solid ${borderColor}`,
                borderRadius: theme.borderRadius.md,
                padding: '16px 24px',
                transform: `translateX(${interpolate(optionSpring, [0, 1], [-60, 0])}px)`,
                opacity: optionSpring,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: theme.borderRadius.sm,
                  background: isRevealed && isCorrect
                    ? theme.colors.accentGreen
                    : theme.colors.primary,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: theme.fontSizes.body,
                  fontWeight: 700,
                  color: theme.colors.textWhite,
                  flexShrink: 0,
                }}
              >
                {isRevealed && isCorrect ? '✓' : labels[index]}
              </div>
              <div
                style={{
                  fontSize: theme.fontSizes.body - 2,
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
    </AbsoluteFill>
  );
};
