export interface PasswordStrength {
  score: 0 | 1 | 2 | 3;
  label: string;
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: "" };

  let points = 0;
  if (password.length >= 6) points++;
  if (password.length >= 10) points++;
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) points++;
  if (/[^A-Za-z0-9]/.test(password)) points++;

  if (points <= 1) return { score: 1, label: "Weak" };
  if (points <= 2) return { score: 2, label: "Good" };
  return { score: 3, label: "Strong" };
}
