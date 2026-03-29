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
  primaryLight?: string;
  accent?: string;
  bgDark: string;
  bgGlass: string;
  textWhite: string;
  textMuted: string;
  gradientPrimary?: string;
  gradientDark?: string;
}

interface MicroOutroProps {
  summary: string;
  nextLesson?: string;
  channelName?: string;
  recapSteps?: Array<{ icon: string; text: string; color: string }>;
  totalFrames?: number;
  colors?: ThemeColors; // ← DYNAMIC THEME
}

export const MicroOutro: React.FC<MicroOutroProps> = ({
  summary,
  nextLesson,
  channelName = 'Microlearning',
  recapSteps = [],
  totalFrames = 720,
  colors,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Theme: dùng colors prop nếu có, fallback theme.ts
  const c: ThemeColors = colors || {
    primary: defaultTheme.colors.primary,
    primaryLight: defaultTheme.colors.primaryLight,
    bgDark: defaultTheme.colors.bgDark,
    bgGlass: defaultTheme.colors.bgGlass,
    textWhite: defaultTheme.colors.textWhite,
    textMuted: defaultTheme.colors.textMuted,
    gradientPrimary: defaultTheme.gradients.primary,
    gradientDark: defaultTheme.gradients.dark,
  };

  const gradientDark = c.gradientDark || defaultTheme.gradients.dark;
  const gradientPrimary = c.gradientPrimary || defaultTheme.gradients.primary;
  const primaryLight = c.primaryLight || c.primary;

  // Tỉ lệ % cho animations
  const ctaStartFrame = Math.floor(totalFrames * 0.55);
  const fadeOutStart = Math.floor(totalFrames * 0.90);
  const fadeOutEnd = Math.floor(totalFrames * 0.97);

  const checkScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 8, mass: 0.6 },
  });

  const titleFade = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ctaSlide = spring({
    frame: frame - ctaStartFrame,
    fps,
    config: { damping: 14 },
  });

  const ctaPulse = Math.sin((frame - ctaStartFrame - 30) * 0.12) * 0.04 + 1;

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
      {/* Checkmark */}
      <div
        style={{
          width: 100, height: 100,
          borderRadius: '50%',
          background: gradientPrimary,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontSize: 52,
          transform: `scale(${checkScale})`,
          boxShadow: `0 0 40px ${c.primary}44`,
          marginBottom: defaultTheme.spacing.md,
        }}
      >
        ✅
      </div>

      <div
        style={{
          fontSize: defaultTheme.fontSizes.heading - 4,
          fontWeight: 800,
          color: c.textWhite,
          opacity: titleFade,
          marginBottom: defaultTheme.spacing.md,
        }}
      >
        Hoàn thành bài học!
      </div>

      {/* VISUAL RECAP — tuần tự */}
      {recapSteps.length > 0 && (
        <div
          style={{
            display: 'flex', flexDirection: 'column',
            gap: 10, width: '88%',
            marginBottom: defaultTheme.spacing.md,
          }}
        >
          {recapSteps.map((step, index) => {
            const stepDelay = 60 + index * 50;
            const stepSpring = spring({
              frame: frame - stepDelay,
              fps,
              config: { damping: 14, mass: 0.7 },
            });

            if (frame < stepDelay - 10) return null;

            return (
              <div
                key={index}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  opacity: interpolate(stepSpring, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(stepSpring, [0, 1], [-40, 0])}px)`,
                }}
              >
                <div
                  style={{
                    width: 40, height: 40,
                    borderRadius: '50%',
                    background: `${step.color}22`,
                    border: `2px solid ${step.color}66`,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    fontSize: 22, flexShrink: 0,
                  }}
                >
                  {step.icon}
                </div>
                <div
                  style={{
                    fontSize: defaultTheme.fontSizes.body - 4,
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

      {/* Next lesson CTA */}
      {nextLesson && (
        <div
          style={{
            background: c.bgGlass,
            border: `1px solid ${c.primary}33`,
            borderRadius: defaultTheme.borderRadius.lg,
            padding: '16px 28px',
            transform: `translateY(${interpolate(ctaSlide, [0, 1], [40, 0])}px) scale(${frame > ctaStartFrame + 30 ? ctaPulse : 1})`,
            opacity: ctaSlide,
            textAlign: 'center',
            width: '85%',
          }}
        >
          <div
            style={{
              fontSize: defaultTheme.fontSizes.small,
              color: c.textMuted,
              marginBottom: 6,
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            Bài tiếp theo
          </div>
          <div
            style={{
              fontSize: defaultTheme.fontSizes.subtitle - 4,
              fontWeight: 700,
              color: primaryLight,
            }}
          >
            {nextLesson}
          </div>
        </div>
      )}

      {/* Watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          fontSize: defaultTheme.fontSizes.small,
          color: c.textMuted,
          opacity: titleFade,
        }}
      >
        🎓 {channelName}
      </div>
    </AbsoluteFill>
  );
};
