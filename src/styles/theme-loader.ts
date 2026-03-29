// Theme Loader — Đọc theme từ thư viện JSON (Remotion-compatible)
// Dùng require thay import để tương thích với Remotion bundler

import techBlue from '../../data/themes/tech-blue.json';
import businessGold from '../../data/themes/business-gold.json';
import scienceGreen from '../../data/themes/science-green.json';
import creativePurple from '../../data/themes/creative-purple.json';
import universalDark from '../../data/themes/universal-dark.json';

// ============ TYPE DEFINITIONS ============

export interface VideoThemeColors {
  primary: string;
  primaryLight: string;
  accent: string;
  accentGreen: string;
  accentRed: string;
  headingColors: string[];
  bgDark: string;
  bgDarkAlt: string;
  bgCard: string;
  bgGlass: string;
  textWhite: string;
  textLight: string;
  textMuted: string;
}

export interface VideoTheme {
  id: string;
  name: string;
  category: string;
  colors: VideoThemeColors;
  gradients: {
    primary: string;
    dark: string;
    card: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  animation_style: string;
  corner_radius: string;
}

// ============ THEME MAP ============

const THEME_MAP: Record<string, VideoTheme> = {
  'tech-blue': techBlue as unknown as VideoTheme,
  'business-gold': businessGold as unknown as VideoTheme,
  'science-green': scienceGreen as unknown as VideoTheme,
  'creative-purple': creativePurple as unknown as VideoTheme,
  'universal-dark': universalDark as unknown as VideoTheme,
};

const DEFAULT_THEME_ID = 'universal-dark';

// ============ PUBLIC API ============

export function getTheme(themeId?: string): VideoTheme {
  if (!themeId) return THEME_MAP[DEFAULT_THEME_ID];
  return THEME_MAP[themeId] || THEME_MAP[DEFAULT_THEME_ID];
}

export function getAvailableThemes(): string[] {
  return Object.keys(THEME_MAP);
}

export function suggestTheme(category?: string): VideoTheme {
  if (!category) return THEME_MAP[DEFAULT_THEME_ID];
  const match = Object.values(THEME_MAP).find(t => t.category === category);
  return match || THEME_MAP[DEFAULT_THEME_ID];
}

export function toRemotionTheme(videoTheme: VideoTheme) {
  return {
    colors: { ...videoTheme.colors },
    gradients: { ...videoTheme.gradients },
    fonts: videoTheme.fonts,
    fontSizes: { heading: 52, subtitle: 36, body: 28, caption: 22, small: 18 },
    spacing: { xs: 8, sm: 16, md: 24, lg: 40, xl: 48 },
    borderRadius: { sm: 8, md: 16, lg: 24, full: 100 },
    video: { width: 1080, height: 1920, fps: 30 },
  };
}
