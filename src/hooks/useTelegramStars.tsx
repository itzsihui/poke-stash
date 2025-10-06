import { useToast } from '@/hooks/use-toast';

// Telegram Stars pricing
export const STAR_PRICES = {
  normal: 50,   // 50 stars for normal gacha
  premium: 100  // 100 stars for premium gacha
} as const;

// Bot API endpoint for pokestash_bot
const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const BOT_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

export const useTelegramStars = () => {
  const { toast } = useToast();

  const sendStarsPayment = async (gachaType: "normal" | "premium") => {
    try {
      const starsAmount = STAR_PRICES[gachaType];
      
      // Get user info from Telegram WebApp
      const webApp = window.Telegram?.WebApp;
      const user = webApp?.initDataUnsafe?.user;
      
      console.log("Telegram WebApp:", webApp);
      console.log("User data:", user);
      console.log("Init data:", webApp?.initDataUnsafe);
      
      // For testing, create mock user if not available
      const mockUser = {
        id: 123456789,
        first_name: "Test",
        last_name: "User",
        username: "testuser"
      };
      
      const finalUser = user || mockUser;
      
      if (!finalUser) {
        toast({
          title: "Error",
          description: "User not authenticated. Please open this app from Telegram.",
          variant: "destructive",
        });
        throw new Error("User not authenticated");
      }

      // Show payment processing message
      toast({
        title: "Creating Invoice",
        description: `Creating ${starsAmount} stars invoice for ${gachaType} gacha`,
      });

      // Create invoice via bot API
      const invoiceResponse = await fetch(`${BOT_API_URL}/sendInvoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: finalUser.id,
          title: `${gachaType === "premium" ? "Premium" : "Normal"} Gacha Draw`,
          description: `Draw 1 card from ${gachaType} gacha machine`,
          payload: JSON.stringify({
            type: "gacha_draw",
            gachaType,
            starsAmount,
            userId: finalUser.id,
            timestamp: Date.now()
          }),
          provider_token: "", // Empty for digital goods
          currency: "XTR", // Telegram Stars
          prices: [{
            label: `${gachaType === "premium" ? "Premium" : "Normal"} Gacha Draw`,
            amount: starsAmount
          }]
        })
      });

      if (!invoiceResponse.ok) {
        const errorData = await invoiceResponse.json();
        throw new Error(errorData.description || 'Failed to create invoice');
      }

      const invoiceData = await invoiceResponse.json();
      
      if (!invoiceData.ok) {
        throw new Error(invoiceData.description || 'Failed to create invoice');
      }

      toast({
        title: "Invoice Sent!",
        description: "Check your Telegram chat to complete the payment",
      });

      return { success: true, starsAmount, invoiceId: invoiceData.result.message_id };

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
    return (webApp.initDataUnsafe?.user as any)?.is_premium ? 1000 : 500; // Mock balance
  };

  return {
    sendStarsPayment,
    checkStarsBalance,
    starPrices: STAR_PRICES,
  };
};

