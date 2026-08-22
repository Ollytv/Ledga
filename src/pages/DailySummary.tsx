import { useDailySummary } from "@/hooks/useDailySummary";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { AmountDisplay } from "@/components/AmountDisplay";
import { DailyFlowBar } from "@/components/DailyFlowBar";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { amountToWords } from "@/utils/currency";
import type { DailySummary as DailySummaryData } from "@/types";

function buildSummarySpeech(data: DailySummaryData): string {
  const { totalCredit, totalCollected, stillOwed, transactionCount } = data;

  if (transactionCount === 0) {
    return "You have no transactions recorded today.";
  }

  const parts: string[] = [];
  if (totalCredit > 0) {
    parts.push(`you recorded ${amountToWords(totalCredit)} naira in credit`);
  }
  if (totalCollected > 0) {
    parts.push(`collected ${amountToWords(totalCollected)} naira`);
  }

  const sentence =
    parts.length > 0
      ? `Today ${parts.join(" and ")}.`
      : "Today you had no credit or collections recorded.";

  const owedSentence =
    stillOwed > 0
      ? ` ${amountToWords(stillOwed)} naira is still owed.`
      : stillOwed < 0
        ? " You collected more than was credited today."
        : " Nothing is still owed from today.";

  return sentence + owedSentence;
}

export function DailySummary() {
  const state = useDailySummary();
  const speech = useSpeechSynthesis();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Today's Summary</h1>

      {state.status === "loading" && <LoadingState label="Loading today's summary" rows={4} />}
      {state.status === "error" && <ErrorState message={state.message} />}

      {state.status === "success" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard label="Today's Credit" amount={state.data.totalCredit} tone="owe" />
            <SummaryCard label="Collected" amount={state.data.totalCollected} tone="paid" />
            <SummaryCard label="Still Owed" amount={state.data.stillOwed} tone="gold" />
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm font-medium text-ink-faint">Transactions</p>
              <span className="font-display text-3xl font-semibold text-ink">{state.data.transactionCount}</span>
            </div>
          </div>

          {state.data.transactionCount > 0 && (
            <DailyFlowBar totalCredit={state.data.totalCredit} totalCollected={state.data.totalCollected} />
          )}

          {speech.isSupported ? (
            <button
              onClick={() => {
                if (speech.status === "speaking") {
                  speech.stop();
                } else {
                  speech.speak(buildSummarySpeech(state.data));
                }
              }}
              aria-label={speech.status === "speaking" ? "Stop speaking" : "Read my summary"}
              className={`flex w-full items-center justify-center gap-2.5 rounded-2xl border px-6 py-5 transition-colors ${
                speech.status === "speaking"
                  ? "border-owe bg-owe-soft/60 text-owe"
                  : "border-border bg-surface text-ink hover:bg-gold-soft/40"
              }`}
            >
              <SpeakerIcon />
              <span className="font-semibold">
                {speech.status === "speaking"
                  ? "Stop Speaking"
                  : speech.status === "completed"
                    ? "🔊 Read My Summary Again"
                    : "🔊 Read My Summary"}
              </span>
            </button>
          ) : (
            <p role="status" className="text-center text-sm text-ink-faint">
              Voice summary isn't available on this browser.
            </p>
          )}
          {speech.status === "error" && (
            <p role="alert" className="text-center text-sm font-medium text-owe">
              Couldn't read the summary aloud. Try again.
            </p>
          )}
        </>
      )}
    </div>
  );
}

function SpeakerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10v4h3.5L12 17.5v-11L7.5 10H4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SummaryCard({ label, amount, tone }: { label: string; amount: number; tone: "owe" | "paid" | "gold" }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="text-sm font-medium text-ink-faint">{label}</p>
      <AmountDisplay amount={amount} tone={tone} size="md" className="mt-1 block" />
    </div>
  );
}
