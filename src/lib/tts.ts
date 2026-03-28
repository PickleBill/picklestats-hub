import { supabase } from "@/integrations/supabase/client";

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
    const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
      body: { text, persona, stability: 0.6, similarity_boost: 0.8 },
    });

    if (error) throw error;

    // data comes back as the raw response — convert to blob
    const blob = data instanceof Blob
      ? data
      : new Blob([data], { type: 'audio/mpeg' });

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
