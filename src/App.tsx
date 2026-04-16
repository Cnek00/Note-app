// src/App.tsx
import React, { useEffect } from 'react';
import './styles/globals.css';
import '../src/i18n';  // Initialize i18n
import MainLayout from './components/layout/MainLayout';
import { useStorage } from './hooks/useStorage';
import { useSettingsStore, applyTheme } from './store/settingsStore';

// Wrap in an inner component so hooks work after i18n init
function AppInner() {
  const { loadAll } = useStorage();
  const { theme } = useSettingsStore();

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    // Listen to system theme changes
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') applyTheme('system');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  // Load saved data on startup
  useEffect(() => {
    loadAll();
  }, []); // eslint-disable-line

  return <MainLayout />;
}

export default function App() {
  return <AppInner />;
}
