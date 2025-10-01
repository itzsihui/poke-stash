import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AdminVideoGenerator() {
  const [imageUrl, setImageUrl] = useState("");
  const [fps, setFps] = useState(24);
  const [numFrames, setNumFrames] = useState(25);
  const [isGenerating, setIsGenerating] = useState(false);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!imageUrl) {
      toast.error("Please provide an image URL");
      return;
    }

    setIsGenerating(true);
    setVideoUrl(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-video', {
        body: {
          image: imageUrl,
          fps,
          numFrames,
          width: 1024,
          height: 576,
        }
      });

      if (error) throw error;

      setPredictionId(data.predictionId);
      toast.success("Video generation started! Checking status...");
      
      // Poll for status
      checkStatus(data.predictionId);
    } catch (error: any) {
      console.error("Error generating video:", error);
      toast.error(error.message || "Failed to start video generation");
      setIsGenerating(false);
    }
  };

  const checkStatus = async (id: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-video', {
        body: { predictionId: id }
      });

      if (error) throw error;

      console.log("Status check:", data.status);

      if (data.status === "succeeded") {
        setVideoUrl(data.output[0]);
        toast.success("Video generated successfully!");
        setIsGenerating(false);
      } else if (data.status === "failed") {
        toast.error("Video generation failed");
        setIsGenerating(false);
      } else {
        // Still processing, check again in 3 seconds
        setTimeout(() => checkStatus(id), 3000);
      }
    } catch (error: any) {
      console.error("Error checking status:", error);
      toast.error("Failed to check generation status");
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Video Generator</h1>
          <p className="text-muted-foreground">
            Generate custom videos for your gacha animations
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generate Video from Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Provide a URL to an image that will be animated into a video
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fps">FPS</Label>
                <Input
                  id="fps"
                  type="number"
                  min="12"
                  max="60"
                  value={fps}
                  onChange={(e) => setFps(parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frames">Number of Frames</Label>
                <Input
                  id="frames"
                  type="number"
                  min="14"
                  max="50"
                  value={numFrames}
                  onChange={(e) => setNumFrames(parseInt(e.target.value))}
                />
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Video"
              )}
            </Button>
          </CardContent>
        </Card>

        {videoUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Video</CardTitle>
            </CardHeader>
            <CardContent>
              <video 
                src={videoUrl} 
                controls 
                className="w-full rounded-lg"
                autoPlay
                loop
              />
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Right-click the video and "Save video as..." to download
                </p>
                <a 
                  href={videoUrl} 
                  download 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full">
                    Download Video
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
