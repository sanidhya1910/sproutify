import {
  Waves,
  Sprout,
  Recycle,
  Trees,
  Users,
  Leaf,
  type LucideIcon,
} from 'lucide-react'

/**
 * Single source of truth for event categories.
 *
 * Context: `Event.type` does not exist in the Prisma schema yet — it is added
 * in Phase 2. Today `app/volunteer/events/page.jsx` filters on `event.type`
 * in 7 places, which means the type filter has ALWAYS returned an empty array
 * and every event falls through to the same generic label and colour. The
 * public `/events` page papers over this by keyword-matching `event.title`.
 *
 * `inferType` reproduces that keyword heuristic so the UI can be built and
 * shipped before the column exists, and so the Phase 2 data migration has one
 * canonical implementation to backfill with.
 */
export type EventTypeId =
  | 'CLEANUP'
  | 'PLANTATION'
  | 'EWASTE'
  | 'RESTORATION'
  | 'COMMUNITY'
  | 'OTHER'

export type EventTone = 'primary' | 'success' | 'warning' | 'info' | 'neutral'

export interface EventTypeMeta {
  id: EventTypeId
  label: string
  plural: string
  icon: LucideIcon
  tone: EventTone
  /** Asset manifest slot id for this category's artwork (Phase 5). */
  artSlot: string
}

export const EVENT_TYPES: Record<EventTypeId, EventTypeMeta> = {
  CLEANUP: {
    id: 'CLEANUP',
    label: 'Beach cleanup',
    plural: 'Beach cleanups',
    icon: Waves,
    tone: 'info',
    artSlot: 'event.type.cleanup',
  },
  PLANTATION: {
    id: 'PLANTATION',
    label: 'Tree plantation',
    plural: 'Tree plantations',
    icon: Sprout,
    tone: 'success',
    artSlot: 'event.type.plantation',
  },
  EWASTE: {
    id: 'EWASTE',
    label: 'E-waste drive',
    plural: 'E-waste drives',
    icon: Recycle,
    tone: 'warning',
    artSlot: 'event.type.ewaste',
  },
  RESTORATION: {
    id: 'RESTORATION',
    label: 'Habitat restoration',
    plural: 'Habitat restoration',
    icon: Trees,
    tone: 'primary',
    artSlot: 'event.type.restoration',
  },
  COMMUNITY: {
    id: 'COMMUNITY',
    label: 'Community action',
    plural: 'Community actions',
    icon: Users,
    tone: 'primary',
    artSlot: 'event.type.community',
  },
  OTHER: {
    id: 'OTHER',
    label: 'Environmental event',
    plural: 'Environmental events',
    icon: Leaf,
    tone: 'neutral',
    artSlot: 'event.type.other',
  },
}

export const EVENT_TYPE_LIST: EventTypeMeta[] = Object.values(EVENT_TYPES)

export function isEventTypeId(value: unknown): value is EventTypeId {
  return typeof value === 'string' && value in EVENT_TYPES
}

/**
 * Keyword heuristic, used as a fallback until `Event.type` is populated.
 * Kept here (rather than inline in a page) so the Phase 2 backfill migration
 * and the UI can never disagree about what an event is.
 */
export function inferType(title?: string | null): EventTypeId {
  const t = (title || '').toLowerCase()
  if (/clean|beach|shore|coast|litter/.test(t)) return 'CLEANUP'
  if (/plant|tree|sapling|forest|reforest/.test(t)) return 'PLANTATION'
  if (/e-?waste|electronic|recycl/.test(t)) return 'EWASTE'
  if (/restor|habitat|river|wetland|reef/.test(t)) return 'RESTORATION'
  if (/community|garden|workshop|drive/.test(t)) return 'COMMUNITY'
  return 'OTHER'
}

/** Resolve an event to its category, preferring the real column when present. */
export function resolveEventType(event: {
  type?: string | null
  title?: string | null
}): EventTypeMeta {
  if (isEventTypeId(event?.type)) return EVENT_TYPES[event.type]
  return EVENT_TYPES[inferType(event?.title)]
}
