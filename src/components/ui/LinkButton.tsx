import type { ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { motion } from "motion/react";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "@/utils/buttonStyles";

type ConflictingHandlers = "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration";

interface LinkButtonProps extends Omit<LinkProps, ConflictingHandlers> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const MotionLink = motion.create(Link);

export function LinkButton({
  variant = "primary",
  size = "md",
  icon,
  fullWidth,
  className = "",
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <MotionLink
      className={buttonClasses(variant, size, fullWidth, className)}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.12 }}
      {...rest}
    >
      {icon}
      {children}
    </MotionLink>
  );
}
