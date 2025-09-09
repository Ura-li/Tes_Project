import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export function formatDateForInput(dateString) {
  const date = new Date(dateString);
  const offsetDate = new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000)); // handle timezone
  return offsetDate.toISOString().split('T')[0]; // ambil 'YYYY-MM-DD'
};
