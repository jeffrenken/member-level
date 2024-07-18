import { useContext } from 'react';
import { ThemeContext } from './ThemeContextProvider';

export function useThemeContext() {
  return useContext(ThemeContext);
}
