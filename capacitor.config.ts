import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e77f240a8495417bbda6e31d28c2f188',
  appName: 'scribe-master-pro',
  webDir: 'dist',
  server: {
    url: 'https://e77f240a-8495-417b-bda6-e31d28c2f188.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;