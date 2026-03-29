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
}

export const MicroOutro: React.FC<MicroOutroProps> = ({
  summary,
  nextLesson,
  channelName = 'Microlearning',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const checkScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 8, mass: 0.6 },
  });

  const summaryFade = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const nextSlide = spring({
    frame: frame - 35,
    fps,
    config: { damping: 14 },
  });

  const ctaPulse = Math.sin((frame - 50) * 0.15) * 0.05 + 1;

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
      {/* Success checkmark */}
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: theme.gradients.primary,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 64,
          transform: `scale(${checkScale})`,
          boxShadow: `0 0 40px ${theme.colors.primary}44`,
          marginBottom: theme.spacing.lg,
        }}
      >
        ✅
      </div>

      {/* "Hoàn thành" text */}
      <div
        style={{
          fontSize: theme.fontSizes.heading,
          fontWeight: 800,
          color: theme.colors.textWhite,
          opacity: summaryFade,
          marginBottom: theme.spacing.sm,
        }}
      >
        Hoàn thành bài học!
      </div>

      {/* Summary */}
      <div
        style={{
          fontSize: theme.fontSizes.body,
          color: theme.colors.textLight,
          textAlign: 'center',
          opacity: summaryFade,
          maxWidth: '85%',
          lineHeight: 1.5,
          marginBottom: theme.spacing.xl,
        }}
      >
        {summary}
      </div>

      {/* Next lesson card */}
      {nextLesson && (
        <div
          style={{
            background: theme.colors.bgGlass,
            border: `1px solid ${theme.colors.primary}33`,
            borderRadius: theme.borderRadius.lg,
            padding: '20px 32px',
            transform: `translateY(${interpolate(nextSlide, [0, 1], [40, 0])}px) scale(${frame > 50 ? ctaPulse : 1})`,
            opacity: nextSlide,
            textAlign: 'center',
            width: '85%',
          }}
        >
          <div
            style={{
              fontSize: theme.fontSizes.small,
              color: theme.colors.textMuted,
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            Bài tiếp theo
          </div>
          <div
            style={{
              fontSize: theme.fontSizes.subtitle,
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
          bottom: 80,
          fontSize: theme.fontSizes.small,
          color: theme.colors.textMuted,
          opacity: summaryFade,
        }}
      >
        🎓 {channelName}
      </div>
    </AbsoluteFill>
  );
};
