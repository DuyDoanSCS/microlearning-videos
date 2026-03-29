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

interface ConceptExampleProps {
  analogy: string;
  content: string;
  illustration?: string;
  headingColor: string;
  colors: {
    primary: string;
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

export const ConceptExample: React.FC<ConceptExampleProps> = ({
  analogy,
  content,
  illustration,
  headingColor,
  colors,
  fonts,
  totalFrames = 900,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOutStart = Math.floor(totalFrames * 0.90);

  // Badge
  const badgeSpring = spring({ frame: frame - 3, fps, config: { damping: 12 } });

  // Analogy card
  const analogySlide = spring({ frame: frame - 10, fps, config: { damping: 14 } });

  // Illustration
  const imgScale = spring({ frame: frame - 40, fps, config: { damping: 12, mass: 0.7 } });
  const imgFade = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Content text
  const contentFade = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const contentSlide = spring({ frame: frame - 65, fps, config: { damping: 14 } });

  // Fade out
  const fadeOut = interpolate(frame, [fadeOutStart, fadeOutStart + 20], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: colors.gradientDark,
        justifyContent: 'flex-start',
        alignItems: 'center',
        fontFamily: fonts.heading,
        padding: 48,
        paddingTop: 80,
        opacity: fadeOut,
      }}
    >
      {/* Badge */}
      <div
        style={{
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
          marginBottom: 24,
        }}
      >
        💡 Cách Hiểu
      </div>

      {/* Analogy card */}
      <div
        style={{
          background: `${headingColor}12`,
          border: `1px solid ${headingColor}33`,
          borderRadius: 16,
          padding: '16px 24px',
          width: '88%',
          transform: `translateY(${interpolate(analogySlide, [0, 1], [30, 0])}px)`,
          opacity: analogySlide,
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 20, color: colors.textMuted, marginBottom: 6 }}>🎯 Ví von:</div>
        <div
          style={{
            fontSize: 26,
            color: headingColor,
            fontWeight: 600,
            fontStyle: 'italic',
            lineHeight: 1.5,
          }}
        >
          "{analogy}"
        </div>
      </div>

      {/* Illustration */}
      {illustration && (
        <div
          style={{
            width: '88%',
            borderRadius: 20,
            overflow: 'hidden',
            border: `2px solid ${headingColor}33`,
            boxShadow: `0 10px 40px ${colors.bgDark}66`,
            opacity: imgFade,
            transform: `scale(${interpolate(imgScale, [0, 1], [0.9, 1])})`,
            marginBottom: 20,
          }}
        >
          <Img
            src={staticFile(illustration)}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      )}

      {/* Content explanation */}
      <div
        style={{
          background: colors.bgGlass,
          backdropFilter: 'blur(20px)',
          borderRadius: 16,
          padding: '20px 24px',
          width: '88%',
          opacity: contentFade,
          transform: `translateY(${interpolate(contentSlide, [0, 1], [20, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: colors.textLight,
            lineHeight: 1.7,
            whiteSpace: 'pre-line',
          }}
        >
          {content}
        </div>
      </div>
    </AbsoluteFill>
  );
};
