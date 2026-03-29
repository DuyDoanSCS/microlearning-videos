import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from 'remotion';

interface ConceptApplicationProps {
  title?: string;
  applications: string[];
  headingColor: string;
  colors: {
    primary: string;
    accent: string;
    bgDark: string;
    bgGlass: string;
    bgCard: string;
    textWhite: string;
    textLight: string;
    textMuted: string;
    gradientDark: string;
  };
  fonts: { heading: string; body: string };
  totalFrames?: number;
}

export const ConceptApplication: React.FC<ConceptApplicationProps> = ({
  title = 'Tại sao quan trọng?',
  applications,
  headingColor,
  colors,
  fonts,
  totalFrames = 600,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOutStart = Math.floor(totalFrames * 0.90);

  // Badge
  const badgeSpring = spring({ frame: frame - 3, fps, config: { damping: 12 } });

  // Title
  const titleSpring = spring({ frame: frame - 10, fps, config: { damping: 14 } });

  // Fade out
  const fadeOut = interpolate(frame, [fadeOutStart, fadeOutStart + 20], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const appIcons = ['🚀', '💼', '🎯', '🔧', '📈', '💡', '🌟'];

  return (
    <AbsoluteFill
      style={{
        background: colors.gradientDark,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: fonts.heading,
        padding: 48,
        opacity: fadeOut,
      }}
    >
      {/* Badge */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          transform: `scale(${badgeSpring})`,
          background: `${headingColor}22`,
          border: `1px solid ${headingColor}44`,
          padding: '8px 24px',
          borderRadius: 100,
          fontSize: 18,
          fontWeight: 600,
          color: headingColor,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        ⚡ Ứng Dụng
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 44,
          fontWeight: 800,
          color: colors.textWhite,
          textAlign: 'center',
          marginBottom: 40,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)`,
          opacity: titleSpring,
        }}
      >
        {title}
      </div>

      {/* Application items */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          width: '88%',
        }}
      >
        {applications.map((app, i) => {
          const itemDelay = 30 + i * 25;
          const itemSpring = spring({
            frame: frame - itemDelay,
            fps,
            config: { damping: 14, mass: 0.7 },
          });

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                background: colors.bgGlass,
                backdropFilter: 'blur(10px)',
                borderRadius: 16,
                padding: '16px 20px',
                border: `1px solid ${headingColor}22`,
                transform: `translateX(${interpolate(itemSpring, [0, 1], [-50, 0])}px)`,
                opacity: itemSpring,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `${headingColor}22`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: 28,
                  flexShrink: 0,
                }}
              >
                {appIcons[i % appIcons.length]}
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: colors.textLight,
                  lineHeight: 1.5,
                }}
              >
                {app}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
