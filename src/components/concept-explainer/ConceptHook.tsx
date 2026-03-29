import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from 'remotion';

interface ConceptHookProps {
  hookText: string;
  hookStat?: string;
  title: string;
  subtitle?: string;
  lessonNumber?: string;
  emoji?: string;
  colors: {
    primary: string;
    primaryLight: string;
    accent: string;
    bgDark: string;
    bgGlass: string;
    textWhite: string;
    textLight: string;
    gradientPrimary: string;
    gradientDark: string;
  };
  fonts: { heading: string; body: string };
}

export const ConceptHook: React.FC<ConceptHookProps> = ({
  hookText,
  hookStat,
  title,
  subtitle,
  lessonNumber,
  emoji = '🤔',
  colors,
  fonts,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Emoji bounce in
  const emojiBounce = spring({ frame: frame - 5, fps, config: { damping: 8, mass: 0.5 } });

  // Stat count-up animation
  const statNumber = hookStat ? parseFloat(hookStat.replace(/[^0-9.]/g, '')) : 0;
  const statSuffix = hookStat ? hookStat.replace(/[0-9.]/g, '') : '';
  const countUp = interpolate(frame, [15, 50], [0, statNumber], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Hook text typewriter
  const hookChars = Math.floor(interpolate(frame, [35, 90], [0, hookText.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));

  // Title slide in
  const titleSpring = spring({ frame: frame - 100, fps, config: { damping: 14 } });

  // Subtitle fade
  const subtitleFade = interpolate(frame, [120, 140], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Lesson badge
  const badgeScale = spring({ frame: frame - 3, fps, config: { damping: 10, mass: 0.4 } });

  // Pulse ring
  const pulseScale = interpolate(frame, [0, 60], [0.8, 1.6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pulseOpacity = interpolate(frame, [0, 60], [0.4, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: colors.gradientDark,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: fonts.heading,
        padding: 48,
      }}
    >
      {/* Lesson badge */}
      {lessonNumber && (
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 40,
            transform: `scale(${badgeScale})`,
            background: colors.bgGlass,
            backdropFilter: 'blur(10px)',
            padding: '8px 20px',
            borderRadius: 100,
            fontSize: 18,
            color: colors.textLight,
            border: `1px solid ${colors.primary}33`,
          }}
        >
          {lessonNumber}
        </div>
      )}

      {/* Emoji with pulse */}
      <div style={{ position: 'relative', marginBottom: 30 }}>
        <div
          style={{
            position: 'absolute',
            width: 120, height: 120,
            borderRadius: '50%',
            border: `2px solid ${colors.primary}`,
            transform: `translate(-50%, -50%) scale(${pulseScale})`,
            left: '50%', top: '50%',
            opacity: pulseOpacity,
          }}
        />
        <div style={{ fontSize: 80, transform: `scale(${emojiBounce})` }}>
          {emoji}
        </div>
      </div>

      {/* Stat number (count-up) */}
      {hookStat && (
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: colors.accent,
            marginBottom: 16,
            textShadow: `0 0 30px ${colors.accent}44`,
          }}
        >
          {Math.round(countUp)}{statSuffix}
        </div>
      )}

      {/* Hook text (typewriter) */}
      <div
        style={{
          fontSize: 30,
          color: colors.textLight,
          textAlign: 'center',
          lineHeight: 1.6,
          maxWidth: '90%',
          minHeight: 100,
        }}
      >
        {hookText.substring(0, hookChars)}
        {hookChars < hookText.length && (
          <span style={{ opacity: frame % 15 < 8 ? 1 : 0, color: colors.accent }}>|</span>
        )}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: colors.textWhite,
          textAlign: 'center',
          marginTop: 40,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [40, 0])}px)`,
          opacity: titleSpring,
          lineHeight: 1.3,
        }}
      >
        {title}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div
          style={{
            fontSize: 22,
            color: colors.primaryLight,
            textAlign: 'center',
            marginTop: 12,
            opacity: subtitleFade,
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};
