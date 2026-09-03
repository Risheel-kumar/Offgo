export const colors = {
  brand: {
    primary: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981', // Emerald Primary
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22',
    },
    secondary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Sky/Cyan Accent
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
  },
  neutral: {
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
  },
  status: {
    success: {
      light: '#d1fae5',
      main: '#10b981',
      dark: '#047857',
      contrast: '#ffffff',
    },
    warning: {
      light: '#fef3c7',
      main: '#f59e0b',
      dark: '#b45309',
      contrast: '#ffffff',
    },
    error: {
      light: '#fee2e2',
      main: '#ef4444',
      dark: '#b91c1c',
      contrast: '#ffffff',
    },
    info: {
      light: '#e0f2fe',
      main: '#0284c7',
      dark: '#0369a1',
      contrast: '#ffffff',
    },
  },
} as const;
