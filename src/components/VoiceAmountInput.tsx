import { useVoiceAmount } from "@/hooks/useVoiceAmount";
import { AmountDisplay } from "@/components/AmountDisplay";
import { VoiceListeningRings, VoiceWaveform } from "@/components/svg/VoiceListeningVisual";
import { formatNaira } from "@/utils/currency";

interface VoiceAmountInputProps {
  /** Called with the recognized amount once the trader confirms it. */
  onConfirm: (amount: number) => void;
}

/**
 * Tap-to-speak amount capture. Always paired with a manual entry field by
 * the caller — this component never blocks the trader if voice fails or
 * isn't supported.
 */
export function VoiceAmountInput({ onConfirm }: VoiceAmountInputProps) {
  const voice = useVoiceAmount();

  if (!voice.isSupported) {
    return (
      <div className="mb-4 flex flex-col items-center gap-2 rounded-3xl border border-dashed border-border bg-surface/60 py-6 text-center">
        <p className="text-sm font-medium text-ink-faint">Voice entry isn't available on this browser.</p>
      </div>
    );
  }

  return (
    <div className="mb-4 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-surface/60 px-4 py-8 text-center">
      {voice.status === "idle" && (
        <>
          <button
            type="button"
            onClick={voice.start}
            aria-label="Speak amount"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-white shadow-card transition-transform hover:-translate-y-0.5 active:scale-95"
          >
            <MicIcon />
          </button>
          <p className="text-sm font-medium text-ink-soft">Tap to speak the amount</p>
        </>
      )}

      {voice.status === "listening" && (
        <>
          <button
            type="button"
            onClick={voice.stop}
            aria-label="Stop listening"
            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-owe text-white shadow-card"
          >
            <VoiceListeningRings />
            <MicIcon />
          </button>
          <p role="status" aria-live="polite" className="text-sm font-semibold text-owe">
            Listening…
          </p>
          <VoiceWaveform />
          <p className="text-xs text-ink-faint">Say the amount, e.g. "thirty thousand"</p>
        </>
      )}

      {voice.status === "recognized" && voice.amount !== null && (
        <div className="w-full space-y-3">
          <p className="text-sm font-medium text-ink-soft">Did you mean?</p>
          <AmountDisplay amount={voice.amount} tone="gold" size="lg" />
          <div className="flex justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={voice.reset}
              className="min-h-11 rounded-2xl border border-border bg-surface px-5 text-sm font-bold text-ink-soft hover:bg-ink/5"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => voice.amount !== null && onConfirm(voice.amount)}
              className="min-h-11 rounded-2xl bg-ink px-5 text-sm font-bold text-paper hover:bg-ink/90"
            >
              Yes, save {formatNaira(voice.amount)}
            </button>
          </div>
        </div>
      )}

      {voice.status === "permission-denied" && (
        <>
          <MicOffIcon />
          <p role="alert" className="text-sm font-medium text-owe">
            Microphone access is needed for voice entry.
          </p>
          <button
            type="button"
            onClick={voice.start}
            className="min-h-11 rounded-2xl bg-ink px-5 text-sm font-bold text-paper hover:bg-ink/90"
          >
            Try Again
          </button>
          <p className="text-xs text-ink-faint">Or type the amount below.</p>
        </>
      )}

      {voice.status === "no-match" && (
        <>
          <MicOffIcon />
          <p role="alert" className="text-sm font-medium text-owe">
            I couldn't hear the amount clearly.
          </p>
          {voice.transcript && (
            <p className="text-xs text-ink-faint">Heard: "{voice.transcript}"</p>
          )}
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={voice.start}
              className="min-h-11 rounded-2xl bg-ink px-5 text-sm font-bold text-paper hover:bg-ink/90"
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={voice.reset}
              className="min-h-11 rounded-2xl border border-border bg-surface px-5 text-sm font-bold text-ink-soft hover:bg-ink/5"
            >
              Enter Amount
            </button>
          </div>
        </>
      )}

      {voice.status === "error" && (
        <>
          <MicOffIcon />
          <p role="alert" className="text-sm font-medium text-owe">
            Voice entry ran into a problem.
          </p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={voice.start}
              className="min-h-11 rounded-2xl bg-ink px-5 text-sm font-bold text-paper hover:bg-ink/90"
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={voice.reset}
              className="min-h-11 rounded-2xl border border-border bg-surface px-5 text-sm font-bold text-ink-soft hover:bg-ink/5"
            >
              Enter Amount
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function MicIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M5 11a7 7 0 0014 0M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MicOffIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-ink-faint">
      <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M5 11a7 7 0 0014 0M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
