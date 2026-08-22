import { useCallback, useEffect, useRef, useState } from "react";
import { parseSpokenAmount } from "@/utils/speechAmount";

/**
 * Minimal shape of the SpeechRecognition API this hook depends on. Kept
 * separate from `dom.d.ts` lib types so this file compiles regardless of
 * TS lib config, and so a future non-browser STT provider can satisfy the
 * same surface without pulling in DOM speech types.
 */
interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionResultEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/**
 * Voice capture status. Kept generic (not tied to Web Speech API specifics)
 * so a future speech provider (e.g. a server-side STT call) can drive the
 * same state machine without any UI changes.
 */
export type VoiceAmountStatus =
  | "idle"
  | "listening"
  | "recognized"
  | "permission-denied"
  | "no-match"
  | "unsupported"
  | "error";

export interface UseVoiceAmountResult {
  status: VoiceAmountStatus;
  /** The parsed Naira amount once recognized, else null. */
  amount: number | null;
  /** Raw transcript, useful for a "you said: ..." hint on no-match. */
  transcript: string | null;
  /** Whether this browser exposes any speech recognition implementation at all. */
  isSupported: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

/**
 * Captures a spoken Naira amount via the browser's SpeechRecognition API
 * and parses it into a whole-Naira integer. Provider-agnostic by design:
 * everything specific to Web Speech API is isolated in this hook, so
 * swapping in a different STT backend later only means changing the
 * implementation of `start`, not any consuming UI.
 */
export function useVoiceAmount(): UseVoiceAmountResult {
  // Resolved once and reused; not a ref because it's read during render
  // (isSupported) as well as inside handlers.
  const [isSupported] = useState(() => getSpeechRecognitionCtor() !== null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [status, setStatus] = useState<VoiceAmountStatus>(isSupported ? "idle" : "unsupported");
  const [amount, setAmount] = useState<number | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);

  const teardown = useCallback(() => {
    const rec = recognitionRef.current;
    if (rec) {
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      try {
        rec.abort();
      } catch {
        // Already stopped — nothing to clean up.
      }
    }
    recognitionRef.current = null;
  }, []);

  // Ensure the microphone/listener is never left active after unmount
  // (e.g. trader navigates away mid-listen).
  useEffect(() => teardown, [teardown]);

  const start = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setStatus("unsupported");
      return;
    }

    teardown();
    setAmount(null);
    setTranscript(null);
    setStatus("listening");

    const recognition = new Ctor();
    recognition.lang = "en-NG";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const heard = event.results[0]?.[0]?.transcript ?? "";
      setTranscript(heard);
      const parsed = parseSpokenAmount(heard);
      if (parsed !== null) {
        setAmount(parsed);
        setStatus("recognized");
      } else {
        setStatus("no-match");
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "permission-denied") {
        setStatus("permission-denied");
      } else if (event.error === "no-speech" || event.error === "aborted") {
        setStatus("no-match");
      } else {
        setStatus("error");
      }
    };

    recognition.onend = () => {
      // If recognition ended without ever firing onresult/onerror (e.g.
      // silence timeout on some browsers), surface that as no-match rather
      // than leaving the UI stuck on "listening".
      setStatus((current) => (current === "listening" ? "no-match" : current));
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setStatus("error");
    }
  }, [teardown]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const reset = useCallback(() => {
    teardown();
    setAmount(null);
    setTranscript(null);
    setStatus(isSupported ? "idle" : "unsupported");
  }, [teardown, isSupported]);

  return {
    status,
    amount,
    transcript,
    isSupported,
    start,
    stop,
    reset,
  };
}
