import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from 'remotion';

interface ConceptDefinitionProps {
  term: string;
  termEnglish?: string;
  definition: string;
  keywords?: string[];
  headingColor: string;
  colors: {
    primary: string;
    bgDark: string;
    bgDarkAlt: string;
    bgGlass: string;
    textWhite: string;
    textLight: string;
    textMuted: string;
    gradientDark: string;
  };
  fonts: { heading: string; body: string };
  totalFrames?: number;
}

export const ConceptDefinition: React.FC<ConceptDefinitionProps> = ({
  term,
  termEnglish,
  definition,
  keywords = [],
  headingColor,
  colors,
  fonts,
  totalFrames = 750,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOutStart = Math.floor(totalFrames * 0.90);

  // Badge slide
  const badgeSpring = spring({ frame: frame - 3, fps, config: { damping: 12 } });

  // Term card animation
  const cardScale = spring({ frame: frame - 10, fps, config: { damping: 14, mass: 0.8 } });

  // English term fade
  const engFade = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Definition reveal
  const defSpring = spring({ frame: frame - 50, fps, config: { damping: 15 } });

  // Keywords stagger
  const keywordDelay = 80;

  // Fade out
  const fadeOut = interpolate(frame, [fadeOutStart, fadeOutStart + 20], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Underline grow
  const underlineWidth = interpolate(frame, [15, 35], [0, 100], {
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
        opacity: fadeOut,
      }}
    >
      {/* Section badge */}
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
        📖 Khái Niệm
      </div>

      {/* Term card */}
      <div
        style={{
          transform: `scale(${cardScale})`,
          background: colors.bgGlass,
          backdropFilter: 'blur(20px)',
          borderRadius: 24,
          padding: '40px 40px 30px',
          width: '88%',
          border: `2px solid ${headingColor}44`,
          boxShadow: `0 20px 60px ${colors.bgDark}88`,
          textAlign: 'center',
          marginBottom: 30,
        }}
      >
        {/* Term */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: headingColor,
            marginBottom: 8,
          }}
        >
          {term}
        </div>

        {/* Underline */}
        <div
          style={{
            width: `${underlineWidth}%`,
            height: 3,
            background: headingColor,
            margin: '0 auto 16px',
            borderRadius: 2,
            opacity: 0.6,
          }}
        />

        {/* English term */}
        {termEnglish && (
          <div
            style={{
              fontSize: 26,
              color: colors.textMuted,
              fontStyle: 'italic',
              opacity: engFade,
              marginBottom: 20,
            }}
          >
            {termEnglish}
          </div>
        )}

        {/* Definition */}
        <div
          style={{
            fontSize: 28,
            color: colors.textLight,
            lineHeight: 1.7,
            transform: `translateY(${interpolate(defSpring, [0, 1], [20, 0])}px)`,
            opacity: defSpring,
          }}
        >
          {definition}
        </div>
      </div>

      {/* Keywords */}
      {keywords.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'center',
            maxWidth: '85%',
          }}
        >
          {keywords.map((kw, i) => {
            const kwSpring = spring({
              frame: frame - (keywordDelay + i * 10),
              fps,
              config: { damping: 12 },
            });

            return (
              <div
                key={i}
                style={{
                  background: `${headingColor}15`,
                  border: `1px solid ${headingColor}33`,
                  borderRadius: 100,
                  padding: '8px 18px',
                  fontSize: 18,
                  color: headingColor,
                  fontWeight: 500,
                  transform: `scale(${kwSpring})`,
                  opacity: kwSpring,
                }}
              >
                {kw}
              </div>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};
