import { useEffect, useState } from "react";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: TelegramUser;
          query_id?: string;
          auth_date?: number;
          hash?: string;
        };
        ready: () => void;
        expand: () => void;
        MainButton: {
          setText: (text: string) => void;
          show: () => void;
          hide: () => void;
        };
      };
    };
  }
}

export const useTelegramAuth = () => {
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = () => {
      try {
        // Prefer Telegram WebApp user if present
        if (window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          tg.ready?.();
          tg.expand?.();

          const user = tg.initDataUnsafe?.user;
          if (user?.id) {
            setTelegramUser(user as TelegramUser);
            setIsLoading(false);
            return;
          }
        }

        // Fallback: per-device guest ID so each device/user is isolated for the demo
        const stored = localStorage.getItem("guest_telegram_id");
        let guestId = stored ?? "";
        if (!guestId) {
          const rand = Math.floor(Math.random() * 1_000_000);
          guestId = `${Date.now()}${rand}`;
          localStorage.setItem("guest_telegram_id", guestId);
        }

        const mockUser: TelegramUser = {
          // keep within safe integer range while satisfying the number type
          id: Number(guestId.slice(-9)),
          first_name: "Guest",
          username: `guest_${guestId.slice(-4)}`,
        };
        setTelegramUser(mockUser);
      } catch (e) {
        console.error("Auth init error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  return {
    telegramUser,
    isLoading,
    telegramId: telegramUser?.id.toString() || "",
  };
};
