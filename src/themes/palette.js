/**
 * Color intention that you want to used in your theme
 * @param {JsonObject} theme Theme customization object
 */

export default function themePalette(theme) {
  const isDarkMode = theme.mode === 'dark';
  return {
    mode: theme.mode,
    common: {
      black: theme.colors?.darkPaper
    },
    primary: {
      light: theme.colors?.primaryLight,
      main: theme.colors?.primaryMain,
      dark: theme.colors?.primaryDark,
      200: theme.colors?.primary200,
      800: theme.colors?.primary800,
      contrastText: '#fff'
    },
    secondary: {
      light: theme.colors?.secondaryLight,
      main: theme.colors?.secondaryMain,
      dark: theme.colors?.secondaryDark,
      200: theme.colors?.secondary200,
      800: theme.colors?.secondary800
    },
    error: {
      light: theme.colors?.errorLight,
      main: theme.colors?.errorMain,
      dark: theme.colors?.errorDark
    },
    orange: {
      light: theme.colors?.orangeLight,
      main: theme.colors?.orangeMain,
      dark: theme.colors?.orangeDark
    },
    warning: {
      light: theme.colors?.warningLight,
      main: theme.colors?.warningMain,
      dark: theme.colors?.warningDark
    },
    neutral: {
      light: theme.textPrimary,
      main: theme.textPrimary,
      dark: theme.textDark
    },
    success: {
      light: theme.colors?.successLight,
      200: theme.colors?.success200,
      main: theme.colors?.successMain,
      dark: theme.colors?.successDark
    },
    cardGreen: '#50CEB2',
    cardYellow: '#FFC542',
    cardRed: '#F36959',
    grey: {
      50: theme.colors?.grey50,
      100: theme.colors?.grey100,
      500: theme.darkTextSecondary,
      600: theme.heading,
      700: theme.textPrimary,
      900: theme.textDark
    },
    dark: {
      light: theme.colors?.textPrimary,
      main: theme.colors?.darkLevel1,
      dark: theme.colors?.darkLevel2,
      800: theme.colors?.darkBackground,
      900: theme.colors?.darkPaper
    },
    text: {
      primary: theme.textPrimary,
      secondary: theme.darkTextSecondary,
      dark: theme.textDark,
      hint: theme.colors?.grey100
    },
    action: {
      active: theme.darkTextSecondary,
      hover: isDarkMode ? theme.colors?.grey600 : theme.colors?.grey100,
      selected: theme.colors?.primaryDark,
      disabled: theme.colors?.grey300,
      disabledBackground: theme.colors?.grey200,
      focus: theme.colors?.grey100
    },
    border: theme.mode === 'dark' ? '0.5px solid rgba(255, 255, 255, 0.2)' : '0.5px solid rgba(30, 30, 30, 0.2)',
    shadowBlue: 'rgba(98, 174, 255, 0.25) 0px 9px 17px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;',

    /*     main gradient bg set is compStyleOverride.js
     */
    background: {
      paper: theme.paper,
      default: theme.background,
      semiTransparent: theme.backgroundSemiTransparent,
      semiTransparent2: theme.backgroundSemiTransparent2
    }
  };
}
