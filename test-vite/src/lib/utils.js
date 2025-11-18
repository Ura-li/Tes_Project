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

export function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatAccountingRupiah(value) {
  if (value == null || value === "") return "---";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

