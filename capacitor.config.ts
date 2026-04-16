// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gridnote.app',
  appName: 'GridNote',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
