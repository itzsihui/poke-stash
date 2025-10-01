import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
    const initTelegram = async () => {
      // Check if running in Telegram WebApp
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();

        const user = tg.initDataUnsafe.user;
        
        if (user) {
          setTelegramUser(user);

          // Create or update profile in database
          const { error } = await supabase
            .from("profiles")
            .upsert([
              {
                telegram_id: user.id.toString(),
                telegram_username: user.username || user.first_name,
              },
            ], {
              onConflict: 'telegram_id'
            });

          if (error) {
            console.error("Error upserting profile:", error);
          }
        } else {
          // For development: use mock data
          const mockUser = {
            id: 123456789,
            first_name: "Dev",
            username: "devuser",
          };
          setTelegramUser(mockUser);

          // Create mock profile
          await supabase
            .from("profiles")
            .upsert([
              {
                telegram_id: mockUser.id.toString(),
                telegram_username: mockUser.username,
              },
            ], {
              onConflict: 'telegram_id'
            });
        }
      } else {
        // Development fallback
        const mockUser = {
          id: 123456789,
          first_name: "Dev",
          username: "devuser",
        };
        setTelegramUser(mockUser);

        await supabase
          .from("profiles")
          .upsert([
            {
              telegram_id: mockUser.id.toString(),
              telegram_username: mockUser.username,
            },
          ], {
            onConflict: 'telegram_id'
          });
      }

      setIsLoading(false);
    };

    initTelegram();
  }, []);

  return {
    telegramUser,
    isLoading,
    telegramId: telegramUser?.id.toString() || "",
  };
};
