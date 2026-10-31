import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "in.pashu.pehchaan",
  appName: "Pashu Pehchaan",
  webDir: "dist",
  server: {
    // In production APK, can specify remote production URL if hosted, e.g. on Render
    // url: "https://your-production-service.onrender.com",
    cleartext: false,
    androidScheme: "https",
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
