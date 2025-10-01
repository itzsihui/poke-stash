import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Replicate from "https://esm.sh/replicate@0.25.2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY')
    if (!REPLICATE_API_KEY) {
      throw new Error('REPLICATE_API_KEY is not set')
    }

    const replicate = new Replicate({
      auth: REPLICATE_API_KEY,
    })

    const body = await req.json()

    // Check status of existing prediction
    if (body.predictionId) {
      console.log("Checking video generation status:", body.predictionId)
      const prediction = await replicate.predictions.get(body.predictionId)
      console.log("Status:", prediction.status)
      return new Response(JSON.stringify(prediction), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Generate new video
    if (!body.prompt && !body.image) {
      return new Response(
        JSON.stringify({ error: "Either prompt or image is required" }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log("Starting video generation with:", body.prompt || "image input")
    
    // Use Stable Video Diffusion for image-to-video
    const input: any = {
      fps: body.fps || 24,
      width: body.width || 1024,
      height: body.height || 576,
      num_frames: body.numFrames || 25,
      motion_bucket_id: body.motionBucket || 127,
    }

    if (body.image) {
      input.image = body.image
    }

    if (body.prompt) {
      input.cond_aug = 0.02
    }

    const prediction = await replicate.predictions.create({
      version: "stable-video-diffusion-img2vid-xt",
      input: input,
    })

    console.log("Video generation started:", prediction.id)
    
    return new Response(JSON.stringify({ 
      predictionId: prediction.id,
      status: prediction.status 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("Error in generate-video function:", error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
