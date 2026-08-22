import type { Customer } from "@/types";

const PALETTE = [
  { bg: "#EAEDFC", fg: "#2A3FB8" }, // brand soft
  { bg: "#E4F5EC", fg: "#17825A" }, // paid soft
  { bg: "#E9EAF0", fg: "#11131A" }, // ink soft
  { bg: "#FBEAEA", fg: "#D14343" }, // owe soft
];

function colorFor(name: string) {
  const hash = Array.from(name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return PALETTE[hash % PALETTE.length];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const chars = parts.length > 1 ? [parts[0][0], parts[1][0]] : [parts[0]?.[0] ?? "?"];
  return chars.join("").toUpperCase();
}

const SIZE_CLASSES = {
  sm: "h-10 w-10 text-sm",
  md: "h-14 w-14 text-lg",
  lg: "h-20 w-20 text-2xl",
} as const;

interface CustomerAvatarProps {
  customer: Pick<Customer, "name" | "avatarUrl">;
  size?: keyof typeof SIZE_CLASSES;
}

export function CustomerAvatar({ customer, size = "md" }: CustomerAvatarProps) {
  if (customer.avatarUrl) {
    return (
      <img
        src={customer.avatarUrl}
        alt=""
        className={`${SIZE_CLASSES[size]} shrink-0 rounded-full object-cover`}
      />
    );
  }

  const { bg, fg } = colorFor(customer.name);
  return (
    <div
      className={`${SIZE_CLASSES[size]} flex shrink-0 items-center justify-center rounded-full font-display font-semibold`}
      style={{ backgroundColor: bg, color: fg }}
      aria-hidden="true"
    >
      {initials(customer.name)}
    </div>
  );
}
