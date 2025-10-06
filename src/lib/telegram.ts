// Telegram WebApp utilities
export const initializeTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp;
    
    // Initialize the WebApp
    webApp.ready();
    
    // Expand the WebApp to full height
    webApp.expand();
    
    // Set theme colors to match the app (if available)
    if ('setHeaderColor' in webApp) {
      (webApp as any).setHeaderColor('#1a1a1a');
    }
    if ('setBackgroundColor' in webApp) {
      (webApp as any).setBackgroundColor('#0a0a0a');
    }
    
    return webApp;
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
