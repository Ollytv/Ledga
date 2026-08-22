import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { motion } from "motion/react";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: ReactNode;
  /** Rendered on the right, e.g. a password visibility toggle button. */
  trailing?: ReactNode;
  error?: boolean;
}

export function AuthField({ label, icon, trailing, error, id, ...rest }: AuthFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <motion.div
        animate={{
          boxShadow: focused ? "0 0 0 4px #EAEDFC" : "0 0 0 0px rgba(234, 237, 252, 0)",
        }}
        transition={{ duration: 0.15 }}
        className={`flex items-center gap-2.5 rounded-xl border bg-surface px-4 ${
          error ? "border-owe" : focused ? "border-brand" : "border-border"
        }`}
      >
        <span className="text-ink-faint" aria-hidden="true">
          {icon}
        </span>
        <input
          id={inputId}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          className="min-h-12 w-full bg-transparent text-base text-ink outline-none placeholder:text-ink-faint"
          {...rest}
        />
        {trailing}
      </motion.div>
    </div>
  );
}
