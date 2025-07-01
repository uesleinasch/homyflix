import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type ColorScheme = 'light' | 'dark' | 'auto';

export interface ThemeState {
  colorScheme: ColorScheme;
  isInitialized: boolean;
}

const getSystemPreference = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark'; 
};

const getInitialColorScheme = (): ColorScheme => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('homyflix-theme');
    if (stored && ['light', 'dark', 'auto'].includes(stored)) {
      return stored as ColorScheme;
    }
  }
  return 'auto'; 
};

export const resolveColorScheme = (colorScheme: ColorScheme): 'light' | 'dark' => {
  if (colorScheme === 'auto') {
    return getSystemPreference();
  }
  return colorScheme;
};

const initialState: ThemeState = {
  colorScheme: getInitialColorScheme(),
  isInitialized: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setColorScheme: (state, action: PayloadAction<ColorScheme>) => {
      state.colorScheme = action.payload;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('homyflix-theme', action.payload);
      }
    },
    
    initializeTheme: (state, action: PayloadAction<void>) => {
      state.isInitialized = true;
    },
    
    toggleColorScheme: (state, action: PayloadAction<void>) => {
      const currentResolved = resolveColorScheme(state.colorScheme);
      const newScheme = currentResolved === 'dark' ? 'light' : 'dark';
      
      state.colorScheme = newScheme;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('homyflix-theme', newScheme);
      }
    },
  },
});

export const { setColorScheme, initializeTheme, toggleColorScheme } = themeSlice.actions;

// Selectors
export const selectColorScheme = (state: { theme: ThemeState }) => state.theme.colorScheme;
export const selectResolvedColorScheme = (state: { theme: ThemeState }) => 
  resolveColorScheme(state.theme.colorScheme);
export const selectIsThemeInitialized = (state: { theme: ThemeState }) => state.theme.isInitialized;

export default themeSlice.reducer; 