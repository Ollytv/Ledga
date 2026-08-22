/** Returns "Today", "Yesterday", or a short date like "12 Aug" for a timeline. */
export function friendlyDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();

  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOf(now) - startOf(date)) / 86_400_000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return date.toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

export function timeOfDay(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit" });
}

export function isSameDay(isoA: string, isoB: string): boolean {
  const a = new Date(isoA);
  const b = new Date(isoB);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function todayIso(): string {
  return new Date().toISOString();
}
