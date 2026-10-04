'use client'

import type { SVGProps } from 'react'
import type { LucideIcon } from 'lucide-react'

/**
 * Sproutify's own icon set. Drawn on a 32px grid with a 2px round stroke plus
 * a low-opacity duotone fill, so they read as inked marks rather than the
 * generic outline set every template ships with. All use currentColor.
 *
 * The activity icons double as the centre artwork of passport stamps
 * (components/passport/Stamp.tsx), so each silhouette has to survive being
 * printed small and slightly rotated.
 *
 * Generic UI glyphs (arrows, chevrons, menu, close) still come from lucide:
 * they are meant to be invisible, and a custom chevron adds nothing.
 */

export type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 24, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  )
}

const tint = { fill: 'currentColor', fillOpacity: 0.16, stroke: 'none' } as const

/** Beach cleanup: a bottle riding the shore break. */
export function IconShore(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...tint} d="M3 22c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2 2.5-2 5-2v8H3z" />
      <path d="M3 22c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2 2.5-2 5-2" />
      <path d="M3 27c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2 2.5-2 5-2" />
      <path d="M17.5 4.5h3M18 4.5v2.2c0 .5-.3.9-.7 1.2-1 .7-1.6 1.8-1.6 3v5.6c0 .8.6 1.5 1.5 1.5h3.6c.8 0 1.5-.7 1.5-1.5v-5.6c0-1.2-.6-2.3-1.6-3-.4-.3-.7-.7-.7-1.2V4.5" />
      <path {...tint} d="M15.7 12h6.6v5c0 .8-.7 1.5-1.5 1.5h-3.6c-.9 0-1.5-.7-1.5-1.5z" />
    </Svg>
  )
}

/** Tree plantation: a two-leaf sapling in a mound of soil. */
export function IconSapling(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...tint} d="M5 27c2-4.5 6.5-7 11-7s9 2.5 11 7z" />
      <path d="M5 27c2-4.5 6.5-7 11-7s9 2.5 11 7" />
      <path d="M16 20V11" />
      <path {...tint} d="M16 13c0-4.4-3.4-7.6-8.5-7.6 0 4.6 3.6 7.6 8.5 7.6zM16 11.4c0-3.9 3-6.9 7.6-6.9 0 4-3.1 6.9-7.6 6.9z" />
      <path d="M16 13c0-4.4-3.4-7.6-8.5-7.6 0 4.6 3.6 7.6 8.5 7.6zM16 11.4c0-3.9 3-6.9 7.6-6.9 0 4-3.1 6.9-7.6 6.9z" />
    </Svg>
  )
}

/** E-waste: a circuit chip with a return arrow around it. */
export function IconChip(props: IconProps) {
  return (
    <Svg {...props}>
      <rect {...tint} x="10" y="10" width="12" height="12" rx="2" />
      <rect x="10" y="10" width="12" height="12" rx="2" />
      <path d="M13.5 6.5v3.5M18.5 6.5v3.5M13.5 22v3.5M18.5 22v3.5M6.5 13.5H10M6.5 18.5H10M22 13.5h3.5M22 18.5h3.5" />
      <path d="M14 16h4" />
      <path d="M27.5 9.5A13 13 0 0 0 9 4.5" />
      <path d="M27.8 5.2l-.3 4.3-4.2-.6" />
    </Svg>
  )
}

/** Habitat restoration: a mangrove standing on arched prop roots. */
export function IconMangrove(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...tint} d="M16 4c-5 0-9 3-9 6.8 0 2.8 2.6 4.7 5.6 4.7h6.8c3 0 5.6-1.9 5.6-4.7C25 7 21 4 16 4z" />
      <path d="M16 4c-5 0-9 3-9 6.8 0 2.8 2.6 4.7 5.6 4.7h6.8c3 0 5.6-1.9 5.6-4.7C25 7 21 4 16 4z" />
      <path d="M16 15.5V20M16 20c-1.5 0-4 1.5-5.5 6M16 20c1.5 0 4 1.5 5.5 6M16 20v6M12.8 17.5c-2 .8-3.6 3-4.3 6.5M19.2 17.5c2 .8 3.6 3 4.3 6.5" />
      <path d="M3 26.5h26" strokeDasharray="2.5 3" />
    </Svg>
  )
}

/** Community action: two hands cupping a leaf. */
export function IconHands(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...tint} d="M16 15.5c0-4.5 3-7.5 7.5-7.5 0 4.5-3 7.5-7.5 7.5z" />
      <path d="M16 15.5c0-4.5 3-7.5 7.5-7.5 0 4.5-3 7.5-7.5 7.5zM16 15.5l3.4-3.4" />
      <path d="M4 19.5l4.2-1.7c1.2-.5 2.6-.4 3.7.3l3.2 2c.9.5 1.1 1.7.4 2.5-.6.6-1.5.7-2.2.3L10.5 21" />
      <path d="M28 19.5l-4.2-1.7c-1.2-.5-2.6-.4-3.7.3l-3.2 2" />
      <path d="M4 26l5.8-1.4c.9-.2 1.8-.1 2.6.3l2.4 1.2c.8.4 1.6.4 2.4 0l2.4-1.2c.8-.4 1.7-.5 2.6-.3L28 26" />
    </Svg>
  )
}

/** Any other environmental event: a single veined leaf. */
export function IconLeaf(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...tint} d="M6 26C6 13.5 13.5 6 26 6c0 12.5-7.5 20-20 20z" />
      <path d="M6 26C6 13.5 13.5 6 26 6c0 12.5-7.5 20-20 20z" />
      <path d="M6 26L19.5 12.5M12 20h5.5M15.5 16.5V11" />
    </Svg>
  )
}

/** EcoToken: a coin struck with a sprout. */
export function IconToken(props: IconProps) {
  return (
    <Svg {...props}>
      <circle {...tint} cx="16" cy="16" r="12" />
      <circle cx="16" cy="16" r="12" />
      <circle cx="16" cy="16" r="8.5" strokeDasharray="1.5 2.4" strokeWidth={1.5} />
      <path d="M16 21v-6M16 15.8c0-2.6-1.9-4.4-4.8-4.4 0 2.7 2 4.4 4.8 4.4zM16 14.8c0-2.2 1.7-3.9 4.2-3.9 0 2.3-1.7 3.9-4.2 3.9z" />
    </Svg>
  )
}

/** QR check-in: a code inside scanner corners. */
export function IconScan(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 10V6.5C4 5.1 5.1 4 6.5 4H10M22 4h3.5C26.9 4 28 5.1 28 6.5V10M28 22v3.5c0 1.4-1.1 2.5-2.5 2.5H22M10 28H6.5C5.1 28 4 26.9 4 25.5V22" />
      <rect {...tint} x="9" y="9" width="5.5" height="5.5" rx="1" />
      <rect x="9" y="9" width="5.5" height="5.5" rx="1" />
      <rect x="17.5" y="9" width="5.5" height="5.5" rx="1" />
      <rect x="9" y="17.5" width="5.5" height="5.5" rx="1" />
      <path d="M17.5 17.5h2M23 17.5v2M17.5 21v2h2M21.5 23H23" />
    </Svg>
  )
}

/** Event ticket: a stub with a perforation. */
export function IconTicket(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...tint} d="M4 9.5C4 8.1 5.1 7 6.5 7h19C26.9 7 28 8.1 28 9.5V13a3 3 0 0 0 0 6v3.5c0 1.4-1.1 2.5-2.5 2.5h-19C5.1 25 4 23.9 4 22.5V19a3 3 0 0 0 0-6z" />
      <path d="M4 9.5C4 8.1 5.1 7 6.5 7h19C26.9 7 28 8.1 28 9.5V13a3 3 0 0 0 0 6v3.5c0 1.4-1.1 2.5-2.5 2.5h-19C5.1 25 4 23.9 4 22.5V19a3 3 0 0 0 0-6z" />
      <path d="M20 7.5v2.5M20 14.75v2.5M20 22v2.5" />
    </Svg>
  )
}

/** Volunteer passport: a booklet with an embossed leaf. */
export function IconPassport(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...tint} d="M7 5.5C7 4.7 7.7 4 8.5 4h15c.8 0 1.5.7 1.5 1.5v21c0 .8-.7 1.5-1.5 1.5h-15c-.8 0-1.5-.7-1.5-1.5z" />
      <path d="M7 5.5C7 4.7 7.7 4 8.5 4h15c.8 0 1.5.7 1.5 1.5v21c0 .8-.7 1.5-1.5 1.5h-15c-.8 0-1.5-.7-1.5-1.5z" />
      <path d="M11 4v24" />
      <path d="M14.5 19c0-4.2 2.8-7 7-7 0 4.2-2.8 7-7 7zM14.5 19l3-3" />
      <path d="M15 23.5h6" />
    </Svg>
  )
}

/** Meeting point: a map pin with a leaf in the head. */
export function IconPin(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...tint} d="M16 29s9-8.2 9-15.3A9 9 0 0 0 7 13.7C7 20.8 16 29 16 29z" />
      <path d="M16 29s9-8.2 9-15.3A9 9 0 0 0 7 13.7C7 20.8 16 29 16 29z" />
      <path d="M12.5 16.5c0-3.3 2.2-5.5 5.5-5.5 0 3.3-2.2 5.5-5.5 5.5zM12.5 16.5l2.4-2.4" />
    </Svg>
  )
}

/** Rubber stamp: for "verified" moments. */
export function IconStamp(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12.5 13.5V9.5a3.5 3.5 0 1 1 7 0v4" />
      <path {...tint} d="M6 17.5c0-1.7 1.3-3 3-3h14c1.7 0 3 1.3 3 3v3H6z" />
      <path d="M6 17.5c0-1.7 1.3-3 3-3h14c1.7 0 3 1.3 3 3v3H6z" />
      <path d="M5 24.5h22M8 28h16" />
    </Svg>
  )
}

/** Gear/rewards: a tote bag. */
export function IconTote(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...tint} d="M6.5 12h19l-1.4 14.2c-.1 1-1 1.8-2 1.8H9.9c-1 0-1.9-.8-2-1.8z" />
      <path d="M6.5 12h19l-1.4 14.2c-.1 1-1 1.8-2 1.8H9.9c-1 0-1.9-.8-2-1.8z" />
      <path d="M11.5 15v-5a4.5 4.5 0 1 1 9 0v5" />
      <path d="M13 22c0-2.6 1.6-4.2 4.2-4.2 0 2.6-1.6 4.2-4.2 4.2z" />
    </Svg>
  )
}

/** Hosts / organisations: a megaphone. */
export function IconMegaphone(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...tint} d="M5 13.5c0-1 .8-1.8 1.8-1.8H11l11-6v20.6l-11-6H6.8c-1 0-1.8-.8-1.8-1.8z" />
      <path d="M5 13.5c0-1 .8-1.8 1.8-1.8H11l11-6v20.6l-11-6H6.8c-1 0-1.8-.8-1.8-1.8z" />
      <path d="M11 11.7v8.6M10 20.3l1.6 5.7h3l-1.4-5.4" />
      <path d="M25.5 12.5a5 5 0 0 1 0 7" />
    </Svg>
  )
}

/** Verified: a tick inside a scalloped seal. */
export function IconSeal(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        {...tint}
        d="M16 3.5l2.6 2.1 3.3-.5 1.3 3.1 3.1 1.3-.5 3.3 2.1 2.6-2.1 2.6.5 3.3-3.1 1.3-1.3 3.1-3.3-.5L16 28.5l-2.6-2.1-3.3.5-1.3-3.1-3.1-1.3.5-3.3L4.1 16l2.1-2.6-.5-3.3 3.1-1.3 1.3-3.1 3.3.5z"
      />
      <path d="M16 3.5l2.6 2.1 3.3-.5 1.3 3.1 3.1 1.3-.5 3.3 2.1 2.6-2.1 2.6.5 3.3-3.1 1.3-1.3 3.1-3.3-.5L16 28.5l-2.6-2.1-3.3.5-1.3-3.1-3.1-1.3.5-3.3L4.1 16l2.1-2.6-.5-3.3 3.1-1.3 1.3-3.1 3.3.5z" />
      <path d="M11.5 16.3l3 3 6-6.3" />
    </Svg>
  )
}

/** Calendar page with a single marked day. */
export function IconCalendar(props: IconProps) {
  return (
    <Svg {...props}>
      <rect {...tint} x="5" y="7" width="22" height="20" rx="2.5" />
      <rect x="5" y="7" width="22" height="20" rx="2.5" />
      <path d="M5 13h22M11 4.5v4M21 4.5v4" />
      <circle cx="20.5" cy="20" r="2.5" fill="currentColor" stroke="none" />
    </Svg>
  )
}

/** Clock face, for start/end times. */
export function IconClock(props: IconProps) {
  return (
    <Svg {...props}>
      <circle {...tint} cx="16" cy="16" r="12" />
      <circle cx="16" cy="16" r="12" />
      <path d="M16 9v7l4.5 3" />
    </Svg>
  )
}

/** Group of volunteers. */
export function IconCrew(props: IconProps) {
  return (
    <Svg {...props}>
      <circle {...tint} cx="16" cy="10" r="4" />
      <circle cx="16" cy="10" r="4" />
      <path d="M8.5 26c0-4.1 3.4-7.5 7.5-7.5s7.5 3.4 7.5 7.5" />
      <circle cx="7" cy="13" r="2.8" />
      <circle cx="25" cy="13" r="2.8" />
      <path d="M3 24c0-3 1.7-5.2 4.2-5.6M29 24c0-3-1.7-5.2-4.2-5.6" />
    </Svg>
  )
}

/** Open field guide. */
export function IconGuide(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...tint} d="M4 7.5c4-1.5 8-1.5 12 1v18c-4-2.5-8-2.5-12-1z" />
      <path d="M4 7.5c4-1.5 8-1.5 12 1v18c-4-2.5-8-2.5-12-1zM28 7.5c-4-1.5-8-1.5-12 1v18c4-2.5 8-2.5 12-1z" />
      <path d="M19.5 13.5c2-.6 3.8-.6 5 0M19.5 18c2-.6 3.8-.6 5 0" />
    </Svg>
  )
}

/** Waste management: two sorting bins, wet and dry. */
export function IconBins(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...tint} d="M4.5 11h10l-1.2 15c-.1.8-.7 1.5-1.6 1.5H7.3c-.8 0-1.5-.7-1.6-1.5z" />
      <path d="M4.5 11h10l-1.2 15c-.1.8-.7 1.5-1.6 1.5H7.3c-.8 0-1.5-.7-1.6-1.5zM3.5 11h12M7.5 11V8.5h4V11" />
      <path d="M17.5 11h10l-1.2 15c-.1.8-.7 1.5-1.6 1.5h-4.4c-.8 0-1.5-.7-1.6-1.5zM16.5 11h12M20.5 11V8.5h4V11" />
      <path d="M8 17.5c0-1.9 1.2-3 3-3 0 1.9-1.2 3-3 3zM20 15.5h5M20 19.5h5" />
    </Svg>
  )
}

/** Water conservation: a drop over a ripple. */
export function IconDrop(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...tint} d="M16 3.5s-8 8.6-8 14a8 8 0 0 0 16 0c0-5.4-8-14-8-14z" />
      <path d="M16 3.5s-8 8.6-8 14a8 8 0 0 0 16 0c0-5.4-8-14-8-14z" />
      <path d="M12 18.5a4 4 0 0 0 4 4" />
      <path d="M4 28.5c2 0 2-1.2 4-1.2s2 1.2 4 1.2M20 28.5c2 0 2-1.2 4-1.2s2 1.2 4 1.2" />
    </Svg>
  )
}

/** Any component that renders like one of the icons above. */
export type AppIcon = React.ComponentType<IconProps>

/** Either one of these icons or a lucide icon, for shared components used by app screens. */
export type AnyIcon = AppIcon | LucideIcon
