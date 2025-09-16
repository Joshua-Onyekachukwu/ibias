import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatNumber(number: number) {
  return new Intl.NumberFormat("en-US").format(number);
}

export function formatPercentage(number: number) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(number / 100);
}

export function formatDate(date: Date | string) {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function truncateText(text: string, length: number) {
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
}

// Safe time formatting to prevent hydration mismatches
export function formatTime(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  if (typeof window === 'undefined') {
    // Server-side: return a consistent format
    return new Date(date).toISOString().slice(11, 19); // HH:MM:SS format
  }
  
  // Client-side: use locale-specific formatting
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('en-US', options || {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

// Safe date formatting to prevent hydration mismatches
export function formatDateTime(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  if (typeof window === 'undefined') {
    // Server-side: return ISO format
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
  }
  
  // Client-side: use locale-specific formatting
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('en-US', options || {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}