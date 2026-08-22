export type ButtonVariant = "primary" | "owe" | "paid" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-ink text-paper hover:bg-ink/90 active:bg-ink/80",
  owe: "bg-owe text-white hover:bg-owe/90 active:bg-owe/80",
  paid: "bg-paid text-white hover:bg-paid/90 active:bg-paid/80",
  secondary: "bg-surface text-ink border border-border hover:bg-gold-soft/60",
  ghost: "bg-transparent text-ink-soft hover:bg-ink/5",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "min-h-11 px-4 text-sm gap-2",
  lg: "min-h-14 px-6 text-base gap-2.5",
};

/** Shared class builder so non-<button> elements (e.g. router Links) can look identical to Button. */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  fullWidth = false,
  className = "",
) {
  return `inline-flex items-center justify-center rounded-2xl font-bold transition-colors
    disabled:opacity-50 disabled:pointer-events-none
    ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${fullWidth ? "w-full" : ""} ${className}`;
}
