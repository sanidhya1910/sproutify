import { format, formatDistanceToNow, isPast, parseISO } from 'date-fns'

/**
 * Centralised formatting. Previously ~20 call sites hand-rolled
 * `toLocaleDateString` with different option objects, so the same event date
 * rendered differently on the public page, the volunteer list and the admin
 * table.
 */

function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null
  const d = typeof value === 'string' ? parseISO(value) : value
  return Number.isNaN(d.getTime()) ? null : d
}

/** "15 October 2025" */
export function formatEventDate(value: string | Date | null | undefined): string {
  const d = toDate(value)
  return d ? format(d, 'd MMMM yyyy') : 'Date TBC'
}

/** "Wed, 15 Oct" — compact, for cards and table cells */
export function formatEventDateShort(value: string | Date | null | undefined): string {
  const d = toDate(value)
  return d ? format(d, 'EEE, d MMM') : 'TBC'
}

/**
 * "09:00 – 14:00". Both fields are plain strings in the schema (not
 * DateTime), so they're passed through as-is rather than parsed. Returns an
 * empty string when neither exists — the old code rendered a dangling "at"
 * because it interpolated an `event.time` field that never existed.
 */
export function formatEventTime(
  startTime?: string | null,
  endTime?: string | null
): string {
  if (startTime && endTime) return `${startTime} – ${endTime}`
  return startTime || endTime || ''
}

/** "15 October 2025 · 09:00 – 14:00", omitting whichever part is missing */
export function formatEventWhen(
  date: string | Date | null | undefined,
  startTime?: string | null,
  endTime?: string | null
): string {
  const time = formatEventTime(startTime, endTime)
  const day = formatEventDate(date)
  return time ? `${day} · ${time}` : day
}

/** "3 months ago" */
export function formatRelative(value: string | Date | null | undefined): string {
  const d = toDate(value)
  return d ? formatDistanceToNow(d, { addSuffix: true }) : '—'
}

export function isEventPast(value: string | Date | null | undefined): boolean {
  const d = toDate(value)
  return d ? isPast(d) : false
}

/** Thousands separators, tabular-safe. */
export function formatNumber(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('en').format(value)
}

/**
 * Percentage that refuses to produce NaN. The admin dashboard divided
 * attendances by registrations without guarding a zero denominator, printing
 * "NaN%" for any event nobody had registered for yet.
 */
export function formatPercent(
  numerator: number | null | undefined,
  denominator: number | null | undefined
): string {
  if (!denominator || numerator == null) return '—'
  return `${Math.round((numerator / denominator) * 100)}%`
}

/** Same guard, but returns a number for progress bars. Null = "no data". */
export function toPercent(
  numerator: number | null | undefined,
  denominator: number | null | undefined
): number | null {
  if (!denominator || numerator == null) return null
  return Math.min(100, Math.max(0, (numerator / denominator) * 100))
}
