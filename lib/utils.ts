import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number | string | null | undefined): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount ?? 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function calculateSavings(original: number, current: number): { amount: number; percentage: number } {
  if (!original || original <= current) return { amount: 0, percentage: 0 };
  const amount = original - current;
  const percentage = Math.round((amount / original) * 100);
  return { amount, percentage };
}
