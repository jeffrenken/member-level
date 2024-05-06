import { createTheme } from '@mui/material/styles';

// assets
import colors from '@/assets/scss/_themes-vars.module.scss';

// project imports
import componentStyleOverrides from './compStyleOverride';
import themePalette from './palette';
import themeTypography from './typography';

export const theme = (mode) => {
  const color = colors;
  /* backgroundColor: '#FAACA8',
      backgroundImage: `linear-gradient(19deg, #FAACA8 0%, #DDD6F3 100%)`
    }, */

  const themeOption = {
    colors: color,
    heading: mode === 'dark' ? color.darkTextPrimary : color.textPrimary,
    paper: mode === 'dark' ? color.darkPaper : color.paper,
    //backgroundDefault: backgroundGradient, //mode === 'dark' ? color.darkPaper : '#3ed3ed',
    //background: mode === 'dark' ? color.darkBackground : color.background,
    backgroundSemiTransparent: mode === 'dark' ? 'rgba(16, 27, 38, 0.5)' : 'rgba(255, 255, 255, 0.9)',
    backgroundSemiTransparent2: mode === 'dark' ? 'rgba(16, 27, 38, 0.95)' : 'rgba(255, 255, 255, 0.9)',
    textPrimary: mode === 'dark' ? color.darkTextPrimary : color.textPrimary,
    darkTextSecondary: mode === 'dark' ? color.darkTextSecondary : color.textSecondary,
    //darkTextSecondary: color.grey300,
    textDark: color.grey900,
    menuSelected: mode === 'dark' ? color.darkTextFocused : color.textFocused,
    menuSelectedBack: color.secondaryLight,
    divider: color.grey200,
    mode: mode,
    background: mode === 'dark' ? color.darkBackground : color.background
  };

  const themeOptions = {
    direction: 'ltr',
    palette: themePalette(themeOption),
    mixins: {
      toolbar: {
        minHeight: '48px',
        padding: '16px',
        '@media (min-width: 600px)': {
          minHeight: '48px'
        }
      }
    },
    typography: themeTypography(themeOption)
  };

  const themes = createTheme(themeOptions);
  themes.components = componentStyleOverrides(themeOption);

  return themes;
};

export default theme;
