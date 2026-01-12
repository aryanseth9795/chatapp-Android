export const colors = {
  primary: {
    50: "#f0f0ff",
    100: "#e0e0ff",
    200: "#c7c4ff",
    300: "#ada8ff",
    400: "#8a84ff",
    500: "#6c63ff",
    600: "#5a52d5",
    700: "#4a42b5",
    800: "#3a3495",
    900: "#2d2775",
  },
  background: {
    primary: "#0f0e17",
    secondary: "#1a1a2e",
    tertiary: "#16213e",
    card: "#1c1c2e",
  },
  text: {
    primary: "#fffffe",
    secondary: "#a7a9be",
    tertiary: "#72757e",
    disabled: "#4a4a5e",
  },
  accent: {
    pink: "#ff006e",
    cyan: "#06ffa5",
    yellow: "#ffd803",
    purple: "#9d4edd",
  },
  status: {
    online: "#06ffa5",
    offline: "#72757e",
    away: "#ffd803",
    busy: "#ff006e",
  },
  message: {
    sent: "#6c63ff",
    received: "#2a2a3e",
    sentText: "#ffffff",
    receivedText: "#fffffe",
  },
  border: {
    light: "#2a2a3e",
    medium: "#3a3a4e",
    heavy: "#4a4a5e",
  },
  error: "#ff6b6b",
  success: "#06ffa5",
  warning: "#ffd803",
};

export const gradients = {
  primary: ["#6c63ff", "#5a52d5"],
  secondary: ["#9d4edd", "#6c63ff"],
  background: ["#0f0e17", "#1a1a2e"],
  message: ["#1a1a2e", "#16213e"],
  card: ["rgba(108, 99, 255, 0.15)", "rgba(108, 99, 255, 0.05)"],
  overlay: ["rgba(15, 14, 23, 0)", "rgba(15, 14, 23, 0.95)"],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: "600" as const,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
    letterSpacing: 0,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  button: {
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
};

export const shadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const theme = {
  colors,
  gradients,
  spacing,
  borderRadius,
  typography,
  shadows,
};

export default theme;
