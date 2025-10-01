import { useTonConnectUI } from '@tonconnect/ui-react';
import { useToast } from '@/hooks/use-toast';

const CONTRACT_ADDR = import.meta.env.VITE_GACHA_CONTRACT_ADDR || "EQCvH5PpwmWu0dqzS3Zb8joTcwolcrCd5lxQiIlQZKJI_Lu7";

export const useTonPayment = () => {
  const [tonConnectUI] = useTonConnectUI();
  const { toast } = useToast();

  const sendTonPayment = async (amountTon: number = 0.001) => {
    try {
      if (!tonConnectUI.connected) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your TON wallet first",
          variant: "destructive",
        });
        throw new Error("Wallet not connected");
      }

      const amountNano = (BigInt(Math.floor(amountTon * 1e9))).toString();

      const transaction = await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: CONTRACT_ADDR,
            amount: amountNano,
          },
        ],
      });

      toast({
        title: "Payment sent",
      });

      return transaction;
    } catch (error: any) {
      console.error("TON payment error:", error);
      toast({
        title: "Payment Failed",
        description: error?.message || "Failed to send TON payment",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    sendTonPayment,
    isConnected: tonConnectUI.connected,
    tonConnectUI,
  };
};
