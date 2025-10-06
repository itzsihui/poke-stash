import { useToast } from '@/hooks/use-toast';

// Telegram Stars pricing
export const STAR_PRICES = {
  normal: 50,   // 50 stars for normal gacha
  premium: 100  // 100 stars for premium gacha
} as const;

// Bot API endpoint - you'll need to replace this with your actual bot token
const BOT_API_URL = import.meta.env.VITE_TELEGRAM_BOT_API_URL || 'https://api.telegram.org/bot';

export const useTelegramStars = () => {
  const { toast } = useToast();

  const sendStarsPayment = async (gachaType: "normal" | "premium") => {
    try {
      const starsAmount = STAR_PRICES[gachaType];
      
      // Check if we're in Telegram WebApp environment
      const isTelegramEnv = window.Telegram?.WebApp;
      const isDevMode = import.meta.env.DEV;
      
      console.log("Telegram WebApp detected:", !!isTelegramEnv);
      console.log("Development mode:", isDevMode);
      console.log("Window.Telegram:", window.Telegram);
      
      // Allow testing in development mode even without Telegram WebApp
      if (!isTelegramEnv && !isDevMode) {
        toast({
          title: "Error",
          description: "This app must be used within Telegram",
          variant: "destructive",
        });
        throw new Error("Not in Telegram environment");
      }

      const webApp = window.Telegram?.WebApp;
      const user = webApp?.initDataUnsafe?.user;

      // In development mode, simulate user data if not available
      const mockUser = isDevMode && !user ? {
        id: 123456789,
        first_name: "Test",
        last_name: "User",
        username: "testuser",
        is_premium: true
      } : user;

      if (!mockUser && !isDevMode) {
        toast({
          title: "Error",
          description: "User not authenticated",
          variant: "destructive",
        });
        throw new Error("User not authenticated");
      }

      // Show payment simulation message
      toast({
        title: isDevMode ? "Development Mode" : "Payment Processing",
        description: `Processing ${starsAmount} stars payment for ${gachaType} gacha`,
      });

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful payment
      toast({
        title: "Payment Successful!",
        description: `${starsAmount} stars deducted for ${gachaType} gacha draw`,
      });

      return { success: true, starsAmount };

    } catch (error: any) {
      console.error("Telegram Stars payment error:", error);
      toast({
        title: "Payment Failed",
        description: error?.message || "Failed to process Telegram Stars payment",
        variant: "destructive",
      });
      throw error;
    }
  };

  const checkStarsBalance = () => {
    const isDevMode = import.meta.env.DEV;
    const webApp = window.Telegram?.WebApp;
    
    // In development mode, return mock balance
    if (isDevMode) {
      return 1000; // Mock balance for testing
    }
    
    if (!webApp) {
      return 0;
    }
    
    // Telegram doesn't expose exact star balance, but we can check if user is premium
    return webApp.initDataUnsafe?.user?.is_premium ? 1000 : 500; // Mock balance
  };

  return {
    sendStarsPayment,
    checkStarsBalance,
    starPrices: STAR_PRICES,
  };
};

// Extend Window interface for Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initDataUnsafe?: {
          user?: {
            id: number;
            is_premium?: boolean;
            first_name?: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        showInvoice: (invoice: any, callback: (status: string) => void) => void;
        ready: () => void;
        expand: () => void;
        close: () => void;
      };
    };
  }
}
