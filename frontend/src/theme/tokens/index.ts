import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';
import { shadow } from './shadow';
import { zIndex } from './zIndex';
import { motionPresets } from './motion';

export { colors, typography, spacing, radius, shadow, zIndex, motionPresets };

export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadow,
  zIndex,
  motion: motionPresets,
} as const;

export type Theme = typeof theme;
