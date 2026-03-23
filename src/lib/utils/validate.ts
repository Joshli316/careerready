export function isValidEmail(email: string): boolean {
  // Require: non-empty local part, @ sign, domain with at least one dot, TLD with 2+ chars
  return /^[^\s@]+@[^\s@.][^\s@]*\.[^\s@]{2,}$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  // Accepts: (555) 555-5555, 555-555-5555, 5555555555, +1 555-555-5555
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export function isValidUrl(url: string): boolean {
  if (!url) return true; // Optional fields
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
}

export function isValidDate(date: string): boolean {
  if (!date) return true; // Optional fields
  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength);
}

export const MAX_LENGTHS = {
  name: 100,
  email: 254,
  phone: 20,
  url: 500,
  shortText: 200,
  mediumText: 2000,
  longText: 10000,
  bulletPoint: 500,
  statement: 2000,
} as const;
