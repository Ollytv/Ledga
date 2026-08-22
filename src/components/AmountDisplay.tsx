import { formatNaira } from "@/utils/currency";

type Tone = "ink" | "gold" | "owe" | "paid";

const TONE_CLASSES: Record<Tone, string> = {
  ink: "text-ink",
  gold: "text-gold-deep",
  owe: "text-owe",
  paid: "text-paid",
};

const SIZE_CLASSES = {
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-5xl",
  xl: "text-6xl",
} as const;

interface AmountDisplayProps {
  amount: number;
  tone?: Tone;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}

export function AmountDisplay({ amount, tone = "ink", size = "md", className = "" }: AmountDisplayProps) {
  return (
    <span className={`font-display font-semibold tabular-nums ${TONE_CLASSES[tone]} ${SIZE_CLASSES[size]} ${className}`}>
      {formatNaira(amount)}
    </span>
  );
}
