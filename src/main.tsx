// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Fix Tauri CSP for dev
if ((import.meta as any).env.DEV) {
  (window as any).__TAURI_INTERNALS__ = (window as any).__TAURI_INTERNALS__ || undefined;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
