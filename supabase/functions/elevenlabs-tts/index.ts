const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const VOICE_MAP: Record<string, string> = {
  espn: 'TxGEqnHWrfWFTfGW9XjX',
  hype: 'ErXwobaYiN019PkySvjV',
  ronBurgundy: 'pNInz6obpgDQGcFmaJgB',
  chuckNorris: 'VR6AewLTigWG4xSOukaG',
  leonardo: 'TxGEqnHWrfWFTfGW9XjX',
  raphael: 'VR6AewLTigWG4xSOukaG',
  donatello: 'pNInz6obpgDQGcFmaJgB',
  michelangelo: 'ErXwobaYiN019PkySvjV',
  splinter: 'EXAVITQu4vr4xnSDxMaL',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const text = body.text;
    const voiceId = body.voice_id || VOICE_MAP[body.persona] || VOICE_MAP.espn;
    const stability = body.stability ?? 0.5;
    const similarityBoost = body.similarity_boost ?? 0.75;

    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: 'text is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');

    if (!ELEVENLABS_API_KEY) {
      return new Response(JSON.stringify({ error: 'ELEVENLABS_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability,
            similarity_boost: similarityBoost,
            style: 0.5,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('ElevenLabs API error:', response.status, errText);
      return new Response(JSON.stringify({ error: `ElevenLabs API error: ${response.status}` }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('TTS error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
