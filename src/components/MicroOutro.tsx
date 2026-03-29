import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from 'remotion';
import { theme } from '../styles/theme';

interface MicroOutroProps {
  summary: string;
  nextLesson?: string;
  channelName?: string;
  recapSteps?: Array<{ icon: string; text: string; color: string }>;
}

export const MicroOutro: React.FC<MicroOutroProps> = ({
  summary,
  nextLesson,
  channelName = 'Microlearning',
  recapSteps = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const checkScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 8, mass: 0.6 },
  });

  const titleFade = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // CTA card
  const ctaSlide = spring({
    frame: frame - 450,
    fps,
    config: { damping: 14 },
  });

  const ctaPulse = Math.sin((frame - 500) * 0.12) * 0.04 + 1;

  // Fade-out cuối cùng (2s cuối → fade to black)
  const fadeOut = interpolate(frame, [660, 710], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: theme.gradients.dark,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: theme.fonts.heading,
        padding: theme.spacing.xl,
        opacity: fadeOut,
      }}
    >
      {/* Success checkmark */}
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: theme.gradients.primary,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 52,
          transform: `scale(${checkScale})`,
          boxShadow: `0 0 40px ${theme.colors.primary}44`,
          marginBottom: theme.spacing.md,
        }}
      >
        ✅
      </div>

      {/* "Hoàn thành" text */}
      <div
        style={{
          fontSize: theme.fontSizes.heading - 4,
          fontWeight: 800,
          color: theme.colors.textWhite,
          opacity: titleFade,
          marginBottom: theme.spacing.md,
        }}
      >
        Hoàn thành bài học!
      </div>

      {/* VISUAL RECAP — 5 bước xuất hiện tuần tự */}
      {recapSteps.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            width: '88%',
            marginBottom: theme.spacing.md,
          }}
        >
          {recapSteps.map((step, index) => {
            const stepDelay = 60 + index * 50; // Mỗi bước cách 1.7s
            const stepSpring = spring({
              frame: frame - stepDelay,
              fps,
              config: { damping: 14, mass: 0.7 },
            });

            const stepVisible = frame >= stepDelay - 10;

            if (!stepVisible) return null;

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  opacity: interpolate(stepSpring, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(stepSpring, [0, 1], [-40, 0])}px)`,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: `${step.color}22`,
                    border: `2px solid ${step.color}66`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {step.icon}
                </div>
                <div
                  style={{
                    fontSize: theme.fontSizes.body - 4,
                    color: step.color,
                    fontWeight: 600,
                  }}
                >
                  {step.text}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Next lesson card */}
      {nextLesson && (
        <div
          style={{
            background: theme.colors.bgGlass,
            border: `1px solid ${theme.colors.primary}33`,
            borderRadius: theme.borderRadius.lg,
            padding: '16px 28px',
            transform: `translateY(${interpolate(ctaSlide, [0, 1], [40, 0])}px) scale(${frame > 480 ? ctaPulse : 1})`,
            opacity: ctaSlide,
            textAlign: 'center',
            width: '85%',
          }}
        >
          <div
            style={{
              fontSize: theme.fontSizes.small,
              color: theme.colors.textMuted,
              marginBottom: 6,
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            Bài tiếp theo
          </div>
          <div
            style={{
              fontSize: theme.fontSizes.subtitle - 4,
              fontWeight: 700,
              color: theme.colors.primaryLight,
            }}
          >
            {nextLesson}
          </div>
        </div>
      )}

      {/* Channel watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          fontSize: theme.fontSizes.small,
          color: theme.colors.textMuted,
          opacity: titleFade,
        }}
      >
        🎓 {channelName}
      </div>
    </AbsoluteFill>
  );
};
