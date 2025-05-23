/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Color } from '@/constants/Colors';

export function useThemeColor(
  props: { dark?: string },
  colorName: keyof typeof Color.dark
) {
  const theme = 'dark';
  return props.dark || Color.dark;
}
