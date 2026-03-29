import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
  staticFile,
} from 'remotion';
import { theme } from '../styles/theme';

interface KeyPointProps {
  pointNumber: number;
  totalPoints: number;
  title: string;
  description: string;
  icon?: string;
  illustration?: string;
  headingColor?: string;
  tip?: string; // Mẹo/tip hiện ở cuối
}

export const KeyPoint: React.FC<KeyPointProps> = ({
  pointNumber,
  totalPoints,
  title,
  description,
  icon = '💡',
  illustration,
  headingColor,
  tip,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Staggered animations
  const cardSlide = spring({
    frame: frame - 5,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const iconBounce = spring({
    frame: frame - 10,
    fps,
    config: { damping: 8, mass: 0.6 },
  });

  const titleReveal = spring({
    frame: frame - 18,
    fps,
    config: { damping: 15 },
  });

  const descFade = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Illustration animation — fade in + scale up after description
  const illustrationScale = spring({
    frame: frame - 50,
    fps,
    config: { damping: 12, mass: 0.7 },
  });

  const illustrationFade = interpolate(frame, [45, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Tip card animation — hiện ở cuối (frame 600+)
  const tipSlide = spring({
    frame: frame - 580,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const tipFade = interpolate(frame, [570, 600], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade-out cuối section cho transition mượt (frame 720-780)
  const fadeOut = interpolate(frame, [720, 770], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const progressWidth = interpolate(
    frame,
    [0, 20],
    [0, (pointNumber / totalPoints) * 100],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const numberPop = spring({
    frame: frame - 3,
    fps,
    config: { damping: 10, mass: 0.4 },
  });

  const resolvedHeadingColor = headingColor || theme.colors.textWhite;

  return (
    <AbsoluteFill
      style={{
        background: theme.gradients.dark,
        justifyContent: 'flex-start',
        alignItems: 'center',
        fontFamily: theme.fonts.heading,
        padding: theme.spacing.xl,
        paddingTop: 80,
        opacity: fadeOut,
      }}
    >
      {/* Progress bar at top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: theme.colors.bgDarkAlt,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progressWidth}%`,
            background: theme.gradients.primary,
            borderRadius: '0 3px 3px 0',
            transition: 'width 0.3s',
          }}
        />
      </div>

      {/* Point counter */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          right: 40,
          transform: `scale(${numberPop})`,
          background: theme.colors.bgGlass,
          backdropFilter: 'blur(10px)',
          padding: '10px 24px',
          borderRadius: theme.borderRadius.full,
          fontSize: theme.fontSizes.caption,
          color: resolvedHeadingColor,
          fontWeight: 600,
          border: `1px solid ${resolvedHeadingColor}44`,
        }}
      >
        {pointNumber}/{totalPoints}
      </div>

      {/* Main card */}
      <div
        style={{
          transform: `translateY(${interpolate(cardSlide, [0, 1], [100, 0])}px)`,
          opacity: cardSlide,
          background: theme.colors.bgGlass,
          backdropFilter: 'blur(20px)',
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          width: '92%',
          border: `1px solid ${resolvedHeadingColor}33`,
          boxShadow: `0 20px 60px ${theme.colors.bgDark}88`,
          marginTop: 30,
        }}
      >
        {/* Icon */}
        <div
          style={{
            fontSize: 56,
            marginBottom: theme.spacing.sm,
            transform: `scale(${iconBounce})`,
          }}
        >
          {icon}
        </div>

        {/* Title — với heading color riêng */}
        <div
          style={{
            fontSize: theme.fontSizes.heading,
            fontWeight: 700,
            color: resolvedHeadingColor,
            marginBottom: theme.spacing.sm,
            transform: `translateX(${interpolate(titleReveal, [0, 1], [-40, 0])}px)`,
            opacity: titleReveal,
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: theme.fontSizes.body - 2,
            color: theme.colors.textLight,
            opacity: descFade,
            lineHeight: 1.6,
            whiteSpace: 'pre-line',
          }}
        >
          {description}
        </div>
      </div>

      {/* INFOGRAPHIC ILLUSTRATION */}
      {illustration && (
        <div
          style={{
            marginTop: 20,
            opacity: illustrationFade,
            transform: `scale(${interpolate(illustrationScale, [0, 1], [0.85, 1])})`,
            width: '88%',
            borderRadius: theme.borderRadius.lg,
            overflow: 'hidden',
            border: `2px solid ${resolvedHeadingColor}44`,
            boxShadow: `0 10px 40px ${theme.colors.bgDark}66`,
          }}
        >
          <Img
            src={staticFile(illustration)}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </div>
      )}

      {/* 💡 TIP CARD — xuất hiện ở cuối section */}
      {tip && frame >= 560 && (
        <div
          style={{
            position: 'absolute',
            bottom: 120,
            width: '85%',
            opacity: tipFade,
            transform: `translateY(${interpolate(tipSlide, [0, 1], [30, 0])}px)`,
          }}
        >
          <div
            style={{
              background: `${resolvedHeadingColor}15`,
              border: `1px solid ${resolvedHeadingColor}44`,
              borderRadius: theme.borderRadius.md,
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <div style={{ fontSize: 28, flexShrink: 0 }}>💡</div>
            <div
              style={{
                fontSize: theme.fontSizes.small + 2,
                color: theme.colors.textLight,
                lineHeight: 1.5,
                fontStyle: 'italic',
              }}
            >
              {tip}
            </div>
          </div>
        </div>
      )}

      {/* Bottom decorative dots */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          display: 'flex',
          gap: 12,
        }}
      >
        {Array.from({ length: totalPoints }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i + 1 === pointNumber ? 32 : 10,
              height: 10,
              borderRadius: theme.borderRadius.full,
              background:
                i + 1 === pointNumber
                  ? resolvedHeadingColor
                  : theme.colors.bgCard,
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
