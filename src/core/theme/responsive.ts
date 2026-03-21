import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Realme 5i design base: 360 x 780dp
const BASE_W = 360;
const BASE_H = 780;

/**
 * Horizontal scale — proportional to screen width.
 * Use for widths, paddings, margins, icon sizes.
 */
export const s = (size: number): number =>
  Math.round((SCREEN_W / BASE_W) * size);

/**
 * Vertical scale — proportional to screen height.
 * Use for heights and vertical spacing.
 */
export const vs = (size: number): number =>
  Math.round((SCREEN_H / BASE_H) * size);

/**
 * Moderate scale — blends horizontal scale with a damping factor.
 * Use for font sizes so they don't scale too aggressively.
 * factor 0 = no scaling, factor 1 = full scaling. Default: 0.4
 */
export const ms = (size: number, factor = 0.4): number =>
  Math.round(size + (s(size) - size) * factor);

/** Current screen dimensions */
export const SCREEN = { width: SCREEN_W, height: SCREEN_H };

/** True when running on a compact phone (width <= 360dp, like Realme 5i) */
export const isCompact = SCREEN_W <= 360;
