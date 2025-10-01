import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function PSACardGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generated, setGenerated] = useState(0);
  const [total] = useState(100);
  const [results, setResults] = useState<any[]>([]);

  const generateCards = async () => {
    setIsGenerating(true);
    setProgress(0);
    setGenerated(0);
    setResults([]);

    const batchSize = 5; // Generate 5 cards at a time to manage rate limits
    let currentIndex = 0;

    try {
      while (currentIndex < total) {
        console.log(`Generating batch starting at index ${currentIndex}`);
        
        const { data, error } = await supabase.functions.invoke('generate-psa-cards', {
          body: { startIndex: currentIndex, batchSize }
        });

        if (error) {
          console.error('Error generating batch:', error);
          toast.error(`Error generating cards: ${error.message}`);
          break;
        }

        if (data?.results) {
          setResults(prev => [...prev, ...data.results]);
          setGenerated(data.completed);
          setProgress((data.completed / total) * 100);

          const successCount = data.results.filter((r: any) => r.success).length;
          toast.success(`Generated ${successCount} cards (${data.completed}/${total})`);

          if (!data.hasMore) {
            toast.success("All cards generated successfully!");
            break;
          }

          currentIndex = data.completed;
          // Wait a bit between batches to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to generate cards");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Downloaded ${filename}`);
    } catch (error) {
      console.error('Error downloading:', error);
      toast.error(`Failed to download ${filename}`);
    }
  };

  const downloadAllSuccessful = () => {
    const successful = results.filter(r => r.success);
    successful.forEach((result, index) => {
      setTimeout(() => {
        downloadImage(result.imageUrl, result.filename);
      }, index * 500); // Stagger downloads
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-foreground">PSA Card Generator</h1>
          
          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground mb-4">
                Generate 100 PSA-graded Pokemon cards with authentic grading labels.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                This will generate cards in batches of 5 to manage rate limits. 
                The process will take approximately 5-10 minutes.
              </p>
            </div>

            <Button
              onClick={generateCards}
              disabled={isGenerating}
              size="lg"
              className="w-full"
            >
              {isGenerating ? "Generating..." : "Generate 100 PSA Cards"}
            </Button>

            {isGenerating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progress</span>
                  <span>{generated} / {total}</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Generated Cards</h2>
                  <Button 
                    onClick={downloadAllSuccessful}
                    variant="outline"
                    disabled={isGenerating}
                  >
                    Download All ({results.filter(r => r.success).length})
                  </Button>
                </div>
                
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {results.map((result, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {result.success ? (
                          <>
                            <span className="text-green-500">✓</span>
                            <span className="font-medium">{result.pokemon}</span>
                            {result.imageUrl && (
                              <img 
                                src={result.imageUrl} 
                                alt={result.pokemon}
                                className="w-16 h-20 object-cover rounded"
                              />
                            )}
                          </>
                        ) : (
                          <>
                            <span className="text-red-500">✗</span>
                            <span className="font-medium text-muted-foreground">
                              {result.pokemon} - {result.error}
                            </span>
                          </>
                        )}
                      </div>
                      {result.success && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => downloadImage(result.imageUrl, result.filename)}
                        >
                          Download
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
