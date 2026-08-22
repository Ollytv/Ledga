import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "motion/react";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "@/utils/buttonStyles";

type ConflictingHandlers =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, ConflictingHandlers> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  fullWidth,
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      className={buttonClasses(variant, size, fullWidth, className)}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.12 }}
      {...rest}
    >
      {icon}
      {children}
    </motion.button>
  );
}
