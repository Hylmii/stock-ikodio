// Design System Colors
export const colors = {
  // Base colors
  white: '#FFFFFF',
  black: '#0A0A0A',
  
  // Neutral scale
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Primary gradient (Purple to Blue)
  primary: {
    purple: '#8B5CF6',
    purpleLight: '#A78BFA',
    purpleDark: '#7C3AED',
    blue: '#3B82F6',
    blueLight: '#60A5FA',
    blueDark: '#2563EB',
  },
  
  // Trading colors
  trading: {
    bullish: '#10B981', // Green for price up
    bearish: '#EF4444', // Red for price down
    prediction: '#A855F7', // Purple for prediction line
    predictionGlow: 'rgba(168, 85, 247, 0.2)',
  },
  
  // Glassmorphism
  glass: {
    light: 'rgba(255, 255, 255, 0.8)',
    dark: 'rgba(10, 10, 10, 0.8)',
    border: 'rgba(107, 114, 128, 0.1)',
  }
} as const;

// Typography System
export const typography = {
  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', Consolas, monospace",
  },
  
  sizes: {
    hero: '64px',
    h1: '48px',
    h2: '32px',
    h3: '24px',
    body: '16px',
    bodyLarge: '18px',
    small: '14px',
    tiny: '12px',
  },
  
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
  }
} as const;

// Spacing and Layout
export const spacing = {
  xs: '8px',
  sm: '16px',
  md: '24px',
  lg: '32px',
  xl: '48px',
  '2xl': '64px',
  '3xl': '96px',
} as const;

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  full: '9999px',
} as const;

export const shadows = {
  soft: '0 2px 8px rgba(0, 0, 0, 0.08)',
  medium: '0 4px 16px rgba(0, 0, 0, 0.12)',
  large: '0 8px 32px rgba(0, 0, 0, 0.16)',
  glow: '0 0 24px rgba(168, 85, 247, 0.3)',
} as const;

// Animation presets
export const animations = {
  spring: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30
  },
  smooth: {
    duration: 0.6,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
  },
  fast: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
  }
} as const;