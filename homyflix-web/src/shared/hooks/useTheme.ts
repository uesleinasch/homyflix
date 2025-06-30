import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { MantineColorScheme } from '@mantine/core';
import { 
  selectColorScheme, 
  selectResolvedColorScheme,
  selectIsThemeInitialized,
  setColorScheme, 
  initializeTheme, 
  toggleColorScheme,
  type ColorScheme
} from '../../store/slices/themeSlice';
import type { RootState, AppDispatch } from '../../store/store';

export const useTheme = () => {
  const dispatch = useDispatch<AppDispatch>();
  const colorScheme = useSelector((state: RootState) => selectColorScheme(state));
  const resolvedColorScheme = useSelector((state: RootState) => selectResolvedColorScheme(state));
  const isInitialized = useSelector((state: RootState) => selectIsThemeInitialized(state));



  // Inicializar tema na primeira renderização
  useEffect(() => {
    if (!isInitialized) {
      dispatch(initializeTheme(undefined));
    }
  }, [dispatch, isInitialized]);

  // Escutar mudanças na preferência do sistema quando auto está selecionado
  useEffect(() => {
    if (colorScheme === 'auto' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleSystemChange = () => {
        // Força re-renderização quando a preferência do sistema muda
        // O selector já vai recalcular automaticamente através do estado
        window.dispatchEvent(new CustomEvent('theme-system-change'));
      };

      mediaQuery.addEventListener('change', handleSystemChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleSystemChange);
      };
    }
  }, [colorScheme]);

  const changeColorScheme = (newScheme: ColorScheme) => {
    dispatch(setColorScheme(newScheme));
  };

  const toggle = () => {
    dispatch(toggleColorScheme(undefined));
  };

  const getColorSchemeOptions = () => [
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Escuro' },
    { value: 'auto', label: 'Sistema' },
  ];

  return {
    colorScheme,
    resolvedColorScheme: resolvedColorScheme as 'light' | 'dark',
    isInitialized,
    changeColorScheme,
    toggle,
    getColorSchemeOptions,
    isDark: resolvedColorScheme === 'dark',
    isLight: resolvedColorScheme === 'light',
    isAuto: colorScheme === 'auto',
  };
}; 