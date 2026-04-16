// src/store/settingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings } from '../types';
import i18n from '../i18n';

interface SettingsState extends AppSettings {
  setTheme: (theme: AppSettings['theme']) => void;
  setLanguage: (lang: AppSettings['language']) => void;
  toggleSnapToGrid: () => void;
  setGridSize: (size: number) => void;
  toggleAutoSave: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      language: 'en',
      snapToGrid: false,
      gridSize: 20,
      autoSave: true,
      autoSaveInterval: 30,
      fontSize: 14,
      defaultCardColor: 'default',
      defaultCardWidth: 280,
      defaultCardHeight: 200,

      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
      setLanguage: (language) => {
        set({ language });
        i18n.changeLanguage(language);
        localStorage.setItem('gridnote-lang', language);
      },
      toggleSnapToGrid: () => set((s) => ({ snapToGrid: !s.snapToGrid })),
      setGridSize: (gridSize) => set({ gridSize }),
      toggleAutoSave: () => set((s) => ({ autoSave: !s.autoSave })),
      updateSettings: (settings) => set(settings),
    }),
    {
      name: 'gridnote-settings',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
          i18n.changeLanguage(state.language);
        }
      },
    }
  )
);

export function applyTheme(theme: AppSettings['theme']) {
  const root = document.documentElement;
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }
}
