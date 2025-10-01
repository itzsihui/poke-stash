import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're in Telegram WebApp
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Authentication Required
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Please open this app through Telegram to access admin features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>This application requires Telegram authentication.</p>
            <p>Make sure you're accessing it through the Telegram app.</p>
          </div>
          <Button 
            onClick={() => navigate("/")} 
            className="w-full bg-gradient-primary hover:opacity-90"
          >
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
