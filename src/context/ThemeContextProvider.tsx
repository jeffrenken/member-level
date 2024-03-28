import themes from '@/themes';
import { useMediaQuery } from '@mui/material';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { ReactNode, createContext, useMemo, useState } from 'react';

type ThemeContextType = {
  switchColorMode: () => void;
};

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeContext = createContext<ThemeContextType>({
  switchColorMode: () => {}
});

//if they've set it, use that, otherwise use the system preference

export function ThemeContextProvider({ children }: ThemeProviderProps) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const isDarkMode = localStorage.getItem('darkMode');

  let initialMode = prefersDarkMode ? 'dark' : 'light';

  if (isDarkMode === null) {
    localStorage.setItem('darkMode', JSON.stringify(prefersDarkMode));
  } else {
    initialMode = JSON.parse(isDarkMode) ? 'dark' : 'light';
  }

  const [mode, setMode] = useState<string>(initialMode);

  const switchColorMode = () => {
    localStorage.setItem('darkMode', JSON.stringify(mode === 'light'));
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => themes(mode), [mode]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeContext.Provider value={{ switchColorMode }}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ThemeContext.Provider>
    </StyledEngineProvider>
  );
}
