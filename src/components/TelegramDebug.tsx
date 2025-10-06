import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export const TelegramDebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const info = {
      hasTelegram: !!window.Telegram,
      hasWebApp: !!window.Telegram?.WebApp,
      initData: window.Telegram?.WebApp?.initData,
      initDataUnsafe: window.Telegram?.WebApp?.initDataUnsafe,
      user: window.Telegram?.WebApp?.initDataUnsafe?.user,
      isDev: import.meta.env.DEV,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
    
    setDebugInfo(info);
    console.log("Telegram Debug Info:", info);
  }, []);

  // Only show in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <Card className="p-4 m-4 bg-yellow-50 border-yellow-200">
      <h3 className="font-bold text-yellow-800 mb-2">🔧 Telegram Debug Info</h3>
      <div className="text-xs space-y-1">
        <div><strong>Has Telegram:</strong> {debugInfo.hasTelegram ? "✅" : "❌"}</div>
        <div><strong>Has WebApp:</strong> {debugInfo.hasWebApp ? "✅" : "❌"}</div>
        <div><strong>Has InitData:</strong> {debugInfo.initData ? "✅" : "❌"}</div>
        <div><strong>Has User:</strong> {debugInfo.user ? "✅" : "❌"}</div>
        <div><strong>Dev Mode:</strong> {debugInfo.isDev ? "✅" : "❌"}</div>
        {debugInfo.user && (
          <div className="mt-2 p-2 bg-gray-100 rounded">
            <strong>User Info:</strong>
            <pre className="text-xs mt-1">{JSON.stringify(debugInfo.user, null, 2)}</pre>
          </div>
        )}
      </div>
    </Card>
  );
};
