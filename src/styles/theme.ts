// Theme Design Tokens cho Microlearning Videos
// Phong cách: Hiện đại, chuyên nghiệp, phù hợp giáo dục đại học

export const theme = {
  colors: {
    // Bảng màu chính — tông xanh dương học thuật
    primary: '#2563EB',        // Xanh dương chính
    primaryDark: '#1E40AF',    // Xanh dương đậm
    primaryLight: '#60A5FA',   // Xanh dương nhạt
    
    // Bảng màu phụ — tông teal/cyan
    secondary: '#06B6D4',      // Cyan
    secondaryDark: '#0891B2',  // Cyan đậm
    
    // Accent — điểm nhấn
    accent: '#F59E0B',         // Vàng amber
    accentGreen: '#10B981',    // Xanh lá (đáp án đúng)
    accentRed: '#EF4444',      // Đỏ (đáp án sai)
    
    // Nền
    bgDark: '#0F172A',         // Nền tối chính (Slate 900)
    bgDarkAlt: '#1E293B',      // Nền tối phụ (Slate 800)
    bgCard: '#334155',         // Nền card (Slate 700)
    bgGlass: 'rgba(30, 41, 59, 0.85)', // Glass effect
    
    // Chữ
    textWhite: '#F8FAFC',      // Chữ trắng chính
    textLight: '#CBD5E1',      // Chữ xám nhạt
    textMuted: '#94A3B8',      // Chữ mờ
  },
  
  fonts: {
    heading: "'Inter', 'Segoe UI', sans-serif",
    body: "'Inter', 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Consolas', monospace",
  },
  
  fontSizes: {
    title: 52,        // Tiêu đề chính
    subtitle: 32,     // Phụ đề
    heading: 40,      // Heading trong nội dung
    body: 28,         // Nội dung chính
    caption: 22,      // Caption, ghi chú
    small: 18,        // Chữ nhỏ
  },
  
  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 40,
    xl: 60,
    xxl: 80,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 20,
    full: 999,
  },
  
  // Gradient
  gradients: {
    primary: 'linear-gradient(135deg, #2563EB, #06B6D4)',
    dark: 'linear-gradient(180deg, #0F172A, #1E293B)',
    accent: 'linear-gradient(135deg, #F59E0B, #EF4444)',
    card: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(6,182,212,0.1))',
  },
  
  // Video specs
  video: {
    width: 1080,      // Vertical format cho mobile
    height: 1920,
    fps: 30,
    durationInSeconds: 180,
  },
} as const;

export type Theme = typeof theme;
