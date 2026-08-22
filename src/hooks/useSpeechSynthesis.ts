import { useCallback, useEffect, useState } from "react";

export type SpeechPlaybackStatus = "idle" | "speaking" | "completed" | "unsupported" | "error";

export interface UseSpeechSynthesisResult {
  status: SpeechPlaybackStatus;
  isSupported: boolean;
  speak: (text: string) => void;
  stop: () => void;
}

function getSynthesis(): SpeechSynthesis | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  return window.speechSynthesis;
}

/**
 * Thin wrapper around the browser SpeechSynthesis API. Cleans up on unmount
 * so navigating away never leaves speech running or a dangling utterance
 * listener behind.
 */
export function useSpeechSynthesis(): UseSpeechSynthesisResult {
  const [isSupported] = useState(() => getSynthesis() !== null);
  const [status, setStatus] = useState<SpeechPlaybackStatus>(isSupported ? "idle" : "unsupported");

  useEffect(() => {
    const synth = getSynthesis();
    return () => {
      synth?.cancel();
    };
  }, []);

  const speak = useCallback((text: string) => {
    const synth = getSynthesis();
    if (!synth) {
      setStatus("unsupported");
      return;
    }

    synth.cancel(); // never let two summaries overlap
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onstart = () => setStatus("speaking");
    utterance.onend = () => setStatus("completed");
    utterance.onerror = () => setStatus("error");
    synth.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    getSynthesis()?.cancel();
    setStatus("idle");
  }, []);

  return { status, isSupported, speak, stop };
}
