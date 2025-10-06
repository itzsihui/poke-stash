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
      if (!window.Telegram?.WebApp) {
        toast({
          title: "Error",
          description: "This app must be used within Telegram",
          variant: "destructive",
        });
        throw new Error("Not in Telegram environment");
      }

      const webApp = window.Telegram.WebApp;
      const user = webApp.initDataUnsafe?.user;

      if (!user) {
        toast({
          title: "Error",
          description: "User not authenticated",
          variant: "destructive",
        });
        throw new Error("User not authenticated");
      }

      // For testing, we'll simulate the payment flow
      // In production, you would need a backend bot to handle the actual payment
      toast({
        title: "Payment Simulation",
        description: `Simulating ${starsAmount} stars payment for ${gachaType} gacha`,
      });

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For now, we'll simulate successful payment
      // In production, this would be handled by your bot's webhook
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
    if (!window.Telegram?.WebApp) {
      return 0;
    }
    
    // Telegram doesn't expose exact star balance, but we can check if user is premium
    const webApp = window.Telegram.WebApp;
    return webApp.initDataUnsafe?.user?.is_premium ? 1000 : 0; // Mock balance
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
