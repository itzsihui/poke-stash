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

      // Create Stars (XTR) invoice link via Bot API
      const invoiceResponse = await fetch(`${BOT_API_URL}/createInvoiceLink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${gachaType === "premium" ? "Premium" : "Normal"} Gacha Draw`,
          description: `Draw 1 card from ${gachaType} gacha machine`,
          payload: JSON.stringify({
            type: "gacha_draw",
            gachaType,
            starsAmount, // store Stars amount for backend processing
            userId: finalUser.id,
            timestamp: Date.now()
          }),
          provider_token: "", // Stars for digital goods: provider_token must be empty
          currency: "XTR", // Telegram Stars currency
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
      
      if (!invoiceData.ok || !invoiceData.result) {
        throw new Error(invoiceData.description || 'Failed to create invoice link');
      }

      const invoiceUrl: string = invoiceData.result;

      // Open invoice inside the Mini App and wait for the result
      const webAppAny: any = window.Telegram?.WebApp as any;
      if (!webAppAny || typeof webAppAny.openInvoice !== 'function') {
        throw new Error('Telegram WebApp.openInvoice not available');
      }

      return await new Promise<{ success: boolean; starsAmount: number }>((resolve, reject) => {
        try {
          webAppAny.openInvoice(invoiceUrl, (status: string) => {
            if (status === 'paid') {
              toast({ title: 'Payment Successful!' });
              resolve({ success: true, starsAmount });
            } else if (status === 'cancelled') {
              reject(new Error('Payment cancelled'));
            } else if (status === 'failed') {
              reject(new Error('Payment failed'));
            } else {
              // pending or unknown status
              reject(new Error(`Payment status: ${status}`));
            }
          });
        } catch (e: any) {
          reject(e);
        }
      });

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

