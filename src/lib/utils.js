import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge conditional className strings and resolve conflicting Tailwind
 * utility classes (e.g. "px-2" vs "px-4") the way the last one wins.
 * Standard shadcn/ui-style helper used by ui/button.jsx and friends.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
