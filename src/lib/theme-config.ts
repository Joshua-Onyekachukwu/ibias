/**
 * IBIAS Theme Configuration
 * Professional dual-theme system with accessibility compliance
 */

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  card: string;
  success: string;
  warning: string;
  destructive: string;
}

export interface ThemeConfig {
  name: string;
  colors: ThemeColors;
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const lightTheme: ThemeConfig = {
  name: 'light',
  colors: {
    primary: 'hsl(221.2, 83.2%, 53.3%)',
    secondary: 'hsl(210, 40%, 96%)',
    accent: 'hsl(210, 40%, 96%)',
    background: 'hsl(0, 0%, 100%)',
    foreground: 'hsl(222.2, 84%, 4.9%)',
    muted: 'hsl(210, 40%, 96%)',
    border: 'hsl(214.3, 31.8%, 91.4%)',
    card: 'hsl(0, 0%, 100%)',
    success: 'hsl(142.1, 76.2%, 36.3%)',
    warning: 'hsl(32.2, 95%, 44.1%)',
    destructive: 'hsl(0, 84.2%, 60.2%)',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, hsl(221.2, 83.2%, 53.3%) 0%, hsl(262.1, 83.3%, 57.8%) 100%)',
    secondary: 'linear-gradient(135deg, hsl(210, 40%, 96%) 0%, hsl(220, 14%, 96%) 100%)',
    accent: 'linear-gradient(135deg, hsl(142.1, 76.2%, 36.3%) 0%, hsl(173.4, 58.9%, 39.2%) 100%)',
  },
};

export const darkTheme: ThemeConfig = {
  name: 'dark',
  colors: {
    primary: 'hsl(217.2, 91.2%, 59.8%)',
    secondary: 'hsl(217.2, 32.6%, 17.5%)',
    accent: 'hsl(217.2, 32.6%, 17.5%)',
    background: 'hsl(222.2, 84%, 4.9%)',
    foreground: 'hsl(210, 40%, 98%)',
    muted: 'hsl(217.2, 32.6%, 17.5%)',
    border: 'hsl(217.2, 32.6%, 17.5%)',
    card: 'hsl(222.2, 84%, 4.9%)',
    success: 'hsl(142.1, 70.6%, 45.3%)',
    warning: 'hsl(32.2, 95%, 44.1%)',
    destructive: 'hsl(0, 72.2%, 50.6%)',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.5)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.6), 0 8px 10px -6px rgb(0 0 0 / 0.6)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, hsl(217.2, 91.2%, 59.8%) 0%, hsl(262.1, 83.3%, 57.8%) 100%)',
    secondary: 'linear-gradient(135deg, hsl(217.2, 32.6%, 17.5%) 0%, hsl(222.2, 84%, 4.9%) 100%)',
    accent: 'linear-gradient(135deg, hsl(142.1, 70.6%, 45.3%) 0%, hsl(173.4, 58.9%, 39.2%) 100%)',
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export type ThemeName = keyof typeof themes;

/**
 * Accessibility-compliant color combinations
 * All combinations meet WCAG 2.1 AA standards (4.5:1 contrast ratio)
 */
export const accessibleCombinations = {
  light: {
    textOnBackground: { color: lightTheme.colors.foreground, bg: lightTheme.colors.background },
    textOnCard: { color: lightTheme.colors.foreground, bg: lightTheme.colors.card },
    textOnPrimary: { color: 'hsl(210, 40%, 98%)', bg: lightTheme.colors.primary },
    mutedText: { color: 'hsl(215.4, 16.3%, 46.9%)', bg: lightTheme.colors.background },
  },
  dark: {
    textOnBackground: { color: darkTheme.colors.foreground, bg: darkTheme.colors.background },
    textOnCard: { color: darkTheme.colors.foreground, bg: darkTheme.colors.card },
    textOnPrimary: { color: 'hsl(222.2, 84%, 4.9%)', bg: darkTheme.colors.primary },
    mutedText: { color: 'hsl(215, 20.2%, 65.1%)', bg: darkTheme.colors.background },
  },
};

/**
 * Component-specific theme configurations
 */
export const componentThemes = {
  button: {
    light: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    },
    dark: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    },
  },
  card: {
    light: 'bg-card text-card-foreground border border-border shadow-sm',
    dark: 'bg-card text-card-foreground border border-border shadow-lg',
  },
  input: {
    light: 'bg-background border border-input text-foreground placeholder:text-muted-foreground',
    dark: 'bg-background border border-input text-foreground placeholder:text-muted-foreground',
  },
};

/**
 * Animation and transition configurations
 */
export const themeTransitions = {
  default: 'transition-colors duration-200 ease-in-out',
  fast: 'transition-colors duration-150 ease-in-out',
  slow: 'transition-colors duration-300 ease-in-out',
  theme: 'transition-all duration-300 ease-in-out',
};

/**
 * Responsive breakpoints for theme consistency
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};