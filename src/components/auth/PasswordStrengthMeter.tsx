import { evaluatePasswordStrength, type PasswordStrength } from "@/utils/passwordStrength";

const BAR_COLORS: Record<PasswordStrength["score"], string> = {
  0: "bg-border",
  1: "bg-owe",
  2: "bg-gold-deep",
  3: "bg-paid",
};

const LABEL_COLORS: Record<PasswordStrength["score"], string> = {
  0: "text-ink-faint",
  1: "text-owe",
  2: "text-gold-deep",
  3: "text-paid",
};

export function PasswordStrengthMeter({ password }: { password: string }) {
  const strength = evaluatePasswordStrength(password);

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[1, 2, 3].map((bar) => (
          <div
            key={bar}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
              bar <= strength.score ? BAR_COLORS[strength.score] : "bg-border"
            }`}
          />
        ))}
      </div>
      {strength.label && (
        <p className={`mt-1 text-xs font-medium ${LABEL_COLORS[strength.score]}`}>{strength.label} password</p>
      )}
    </div>
  );
}
