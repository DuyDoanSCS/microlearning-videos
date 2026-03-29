import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from 'remotion';
import { theme } from '../styles/theme';

interface MicroIntroProps {
  title: string;
  subtitle?: string;
  lessonNumber?: string;
  emoji?: string;
}

export const MicroIntro: React.FC<MicroIntroProps> = ({
  title,
  subtitle,
  lessonNumber,
  emoji = '📚',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animations
  const bgScale = spring({ frame, fps, config: { damping: 50 } });
  
  const emojiDrop = spring({ 
    frame: frame - 5, fps, 
    config: { damping: 12, mass: 0.8 } 
  });
  
  const titleSlide = spring({ 
    frame: frame - 15, fps, 
    config: { damping: 15 } 
  });
  
  const subtitleFade = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const lessonBadgeScale = spring({
    frame: frame - 10, fps,
    config: { damping: 10, mass: 0.5 },
  });

  const glowPulse = Math.sin(frame * 0.1) * 0.3 + 0.7;

  return (
    <AbsoluteFill
      style={{
        background: theme.gradients.dark,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: theme.fonts.heading,
      }}
    >
      {/* Background decorative circles */}
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.colors.primary}33, transparent)`,
          top: '10%',
          right: '-5%',
          transform: `scale(${bgScale})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.colors.secondary}22, transparent)`,
          bottom: '15%',
          left: '-5%',
          transform: `scale(${bgScale})`,
        }}
      />

      {/* Lesson number badge */}
      {lessonNumber && (
        <div
          style={{
            position: 'absolute',
            top: 200,
            transform: `scale(${lessonBadgeScale})`,
            background: theme.gradients.primary,
            padding: '12px 32px',
            borderRadius: theme.borderRadius.full,
            fontSize: theme.fontSizes.caption,
            color: theme.colors.textWhite,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          {lessonNumber}
        </div>
      )}

      {/* Emoji */}
      <div
        style={{
          fontSize: 100,
          transform: `translateY(${interpolate(emojiDrop, [0, 1], [-80, 0])}px)`,
          opacity: emojiDrop,
          marginBottom: theme.spacing.md,
          filter: `drop-shadow(0 0 ${20 * glowPulse}px ${theme.colors.primary}88)`,
        }}
      >
        {emoji}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: theme.fontSizes.title,
          fontWeight: 800,
          color: theme.colors.textWhite,
          textAlign: 'center',
          transform: `translateY(${interpolate(titleSlide, [0, 1], [60, 0])}px)`,
          opacity: titleSlide,
          maxWidth: '85%',
          lineHeight: 1.3,
          textShadow: `0 4px 20px ${theme.colors.primary}44`,
        }}
      >
        {title}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div
          style={{
            fontSize: theme.fontSizes.subtitle,
            color: theme.colors.textLight,
            textAlign: 'center',
            opacity: subtitleFade,
            marginTop: theme.spacing.sm,
            maxWidth: '80%',
            fontWeight: 400,
          }}
        >
          {subtitle}
        </div>
      )}

      {/* Bottom accent line */}
      <div
        style={{
          position: 'absolute',
          bottom: 180,
          width: interpolate(titleSlide, [0, 1], [0, 200]),
          height: 4,
          background: theme.gradients.primary,
          borderRadius: 2,
        }}
      />
    </AbsoluteFill>
  );
};
