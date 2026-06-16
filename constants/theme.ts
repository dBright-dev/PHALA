/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Brand colors extracted directly from requirements documentation
const TSG_PURPLE = '#52006A';
const TSG_RED = '#CD1130';
const TSG_ORANGE = '#FF7600';
const TSG_AMBER = '#FFA900';

export const Colors = {
  light: {
    text: '#ECEDEE',
    background: '#0F0F10',
    tint: TSG_ORANGE,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: TSG_ORANGE,
    primary: TSG_PURPLE,
    secondary: TSG_RED,
    accent: TSG_AMBER,
  },
  dark: {
    text: '#ECEDEE',
    background: '#0F0F10',
    tint: TSG_AMBER,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: TSG_AMBER,
    primary: TSG_PURPLE,
    secondary: TSG_RED,
    accent: TSG_ORANGE,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
