export const typography = {
  fontFamily: {
    sans: [
      'Plus Jakarta Sans',
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'sans-serif',
    ].join(', '),
    mono: [
      'JetBrains Mono',
      'Fira Code',
      'Consolas',
      'Monaco',
      'monospace',
    ].join(', '),
    serif: [
      'Playfair Display',
      'Georgia',
      'Cambria',
      'serif',
    ].join(', '),
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
    sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0em' }],
    base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.01em' }],
    lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.015em' }],
    xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.02em' }],
    '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;
