const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

let currentAudio: HTMLAudioElement | null = null;

export const playTTS = async (
  text: string,
  persona: string,
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  onStart?.();

  try {
    // Use fetch + blob instead of supabase SDK to preserve binary audio
    const response = await fetch(`${SUPABASE_URL}/functions/v1/elevenlabs-tts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ text, persona, stability: 0.6, similarity_boost: 0.8 }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`TTS failed: ${response.status} ${errText}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    currentAudio = audio;

    audio.onended = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      onEnd?.();
    };

    audio.onerror = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      onEnd?.();
    };

    await audio.play();
  } catch (err) {
    console.warn("ElevenLabs TTS failed, falling back to browser speech:", err);
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.onend = () => onEnd?.();
    speechSynthesis.speak(u);
  }
};

export const stopTTS = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  speechSynthesis.cancel();
};
