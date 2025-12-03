// Configuration des thèmes et couleurs pour le dashboard moderne
export const colorPalette = {
  // Couleurs primaires
  primary: {
    50: '#f3f4f6',
    100: '#e5e7eb',
    200: '#d1d5db',
    300: '#9ca3af',
    400: '#6b7280',
    500: '#374151',
    600: '#1f2937',
    700: '#111827',
    800: '#0f172a',
    900: '#0c0a09'
  },
  
  // Couleurs secondaires (violet/bleu)
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87'
  },
  
  // Couleurs d'accent (bleu)
  accent: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },
  
  // Couleurs de succès (vert)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
  },
  
  // Couleurs d'avertissement (orange)
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f'
  },
  
  // Couleurs d'erreur (rouge)
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  },
  
  // Couleurs d'information (cyan)
  info: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63'
  }
};

// Gradients prédéfinis
export const gradients = {
  primary: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
  secondary: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
  success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  error: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
  info: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
  
  // Gradients spéciaux
  sunset: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
  ocean: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  forest: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
  fire: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  
  // Gradients pour les cards
  cardLight: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  cardDark: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
  
  // Gradients pour les boutons
  buttonPrimary: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
  buttonSecondary: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
  buttonSuccess: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  buttonWarning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  buttonError: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
};

// Configuration des thèmes
export const themes = {
  light: {
    name: 'Clair',
    colors: {
      background: '#ffffff',
      surface: '#f8fafc',
      surfaceVariant: '#f1f5f9',
      primary: '#8B5CF6',
      secondary: '#3B82F6',
      text: '#1f2937',
      textSecondary: '#6b7280',
      textTertiary: '#9ca3af',
      border: '#e5e7eb',
      borderLight: '#f3f4f6',
      shadow: 'rgba(0, 0, 0, 0.1)',
      shadowLight: 'rgba(0, 0, 0, 0.05)'
    },
    gradients: {
      primary: gradients.primary,
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      card: gradients.cardLight
    }
  },
  
  dark: {
    name: 'Sombre',
    colors: {
      background: '#111827',
      surface: '#1f2937',
      surfaceVariant: '#374151',
      primary: '#a855f7',
      secondary: '#60a5fa',
      text: '#f9fafb',
      textSecondary: '#d1d5db',
      textTertiary: '#9ca3af',
      border: '#374151',
      borderLight: '#4b5563',
      shadow: 'rgba(0, 0, 0, 0.3)',
      shadowLight: 'rgba(0, 0, 0, 0.2)'
    },
    gradients: {
      primary: gradients.primary,
      background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
      card: gradients.cardDark
    }
  }
};

// Configuration des ombres
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  
  // Ombres colorées
  primary: '0 10px 15px -3px rgba(139, 92, 246, 0.1), 0 4px 6px -2px rgba(139, 92, 246, 0.05)',
  secondary: '0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)',
  success: '0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05)',
  warning: '0 10px 15px -3px rgba(245, 158, 11, 0.1), 0 4px 6px -2px rgba(245, 158, 11, 0.05)',
  error: '0 10px 15px -3px rgba(239, 68, 68, 0.1), 0 4px 6px -2px rgba(239, 68, 68, 0.05)',
  
  // Ombres pour le mode sombre
  dark: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)'
  }
};

// Configuration des bordures
export const borders = {
  radius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  
  width: {
    0: '0',
    1: '1px',
    2: '2px',
    4: '4px',
    8: '8px'
  }
};

// Configuration des espacements
export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem'
};

// Configuration des tailles de police
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Georgia', 'serif'],
    mono: ['Monaco', 'Consolas', 'monospace']
  },
  
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem'
  },
  
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },
  
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  }
};

// Configuration des breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Configuration des z-index
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800
};

// Configuration des transitions
export const transitions = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms'
  },
  
  timing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

// Configuration des effets de glass morphism
export const glassMorphism = {
  light: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  
  dark: {
    background: 'rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  }
};

export default {
  colorPalette,
  gradients,
  themes,
  shadows,
  borders,
  spacing,
  typography,
  breakpoints,
  zIndex,
  transitions,
  glassMorphism
};
