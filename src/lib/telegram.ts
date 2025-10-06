// Telegram WebApp utilities
export const initializeTelegramWebApp = () => {
  // Wait for Telegram WebApp script to load
  if (typeof window !== 'undefined') {
    // Check if Telegram WebApp is available
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      
      console.log("✅ Telegram WebApp found:", webApp);
      console.log("Init data unsafe:", webApp.initDataUnsafe);
      console.log("User:", webApp.initDataUnsafe?.user);
      console.log("Version:", (webApp as any).version);
      console.log("Platform:", (webApp as any).platform);
      
      // Initialize the WebApp
      webApp.ready();
      
      // Expand the WebApp to full height
      webApp.expand();
      
      // Set theme colors to match the app
      try {
        (webApp as any).setHeaderColor('#1a1a1a');
        (webApp as any).setBackgroundColor('#0a0a0a');
      } catch (e) {
        console.log("Theme colors not supported:", e);
      }
      
      return webApp;
    } else {
      console.log("❌ Telegram WebApp not available");
      console.log("Window.Telegram:", window.Telegram);
      
      // Try to load the script if not available
      if (!window.Telegram) {
        console.log("Loading Telegram WebApp script...");
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-web-app.js?59';
        script.onload = () => {
          console.log("Telegram WebApp script loaded");
          if (window.Telegram?.WebApp) {
            const webApp = window.Telegram.WebApp;
            webApp.ready();
            webApp.expand();
          }
        };
        document.head.appendChild(script);
      }
    }
  }
  
  return null;
};

export const getTelegramUser = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp.initDataUnsafe?.user;
  }
  return null;
};

export const isTelegramEnvironment = () => {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
};
