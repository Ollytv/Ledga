/**
 * Signature "listening" visual for voice amount capture: expanding rings
 * around the mic button plus a small ambient waveform. Real amplitude data
 * isn't available from the Web Speech API, so this is a tasteful ambient
 * animation rather than a fake audio-reactive visualizer.
 */
export function VoiceListeningRings() {
  return (
    <>
      <span
        className="animate-ring-expand absolute inset-0 rounded-full border-2 border-owe/60"
        aria-hidden="true"
      />
      <span
        className="animate-ring-expand absolute inset-0 rounded-full border-2 border-owe/40"
        style={{ animationDelay: "0.5s" }}
        aria-hidden="true"
      />
      <span
        className="animate-ring-expand absolute inset-0 rounded-full border-2 border-owe/30"
        style={{ animationDelay: "1s" }}
        aria-hidden="true"
      />
    </>
  );
}

const BAR_DELAYS = [0, 0.12, 0.24, 0.36, 0.48];

export function VoiceWaveform() {
  return (
    <div className="flex h-6 items-center gap-1" aria-hidden="true">
      {BAR_DELAYS.map((delay, i) => (
        <span
          key={i}
          className="animate-wave-bar w-1 rounded-full bg-owe"
          style={{ height: "100%", animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  );
}
