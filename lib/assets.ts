/**
 * ASSET MANIFEST — single source of truth for every image slot in the app.
 *
 * Why this exists: `next.config.js` sets `images: { unoptimized: true }`
 * (Next's optimiser doesn't run on Cloudflare Workers), so Next performs no
 * build-time existence check — a missing file renders as a silently broken
 * image. `status` is what makes a placeholder render instead.
 *
 * THE CONTRACT (Phase 5): to add a generated asset, copy the file to `src`
 * and flip `status` to 'ready'. No component changes, no page changes.
 * Placeholders render at the exact declared aspect ratio, so nothing shifts
 * when the real image lands.
 *
 * GENERATION CONSTRAINTS (for ComfyUI):
 *  - Composite onto #FBFAF7 (the page background).
 *  - Palette from primary-100/400/700 (#DCEDE2 / #52A276 / #14532D) plus the
 *    cobalt signal #1D4ED8. No other hues.
 *  - No emoji, no rendered text, no drop shadows, no gradient meshes.
 *  - Photographic -> WebP q82. Illustration/badges -> WebP q90 (keep a PNG
 *    source). Every file under 300KB: they ship unoptimised through the
 *    Worker.
 */

export type AssetCategory = 'scene' | 'category' | 'reward' | 'brand' | 'texture'
export type Placeholder = 'skeleton' | 'gradient' | 'icon' | 'initials' | 'mark'

export interface AssetSlot {
  id: string
  category: AssetCategory
  /** Human-readable note for whoever generates this. */
  purpose: string
  /** public/ path, with leading slash. */
  src: string
  width: number
  height: number
  aspect: string
  fit: 'cover' | 'contain'
  alt: string
  placeholder: Placeholder
  /** LCP candidates only. */
  priority?: boolean
  status: 'pending' | 'ready'
  prompt: string
}

const ASSET_MAP = {
  // ── (a) Photographic scene imagery ────────────────────────────────────
  'home.hero': {
    id: 'home.hero',
    category: 'scene',
    purpose:
      'Homepage hero. Replaces two hard-seamed 50vw Pexels crops (a forest canopy butted against an orange vintage van).',
    src: '/scenes/hero.webp',
    width: 2560,
    height: 1097,
    aspect: '21:9',
    fit: 'cover',
    alt: 'Volunteers working together on a coastal cleanup at golden hour',
    placeholder: 'gradient',
    priority: true,
    status: 'pending',
    prompt:
      'Wide golden-hour documentary photograph of a diverse volunteer group at a coastal cleanup, mid-action, natural candid framing, negative space in the upper left for a headline, muted warm palette that reads well under a dark scrim. Not stock-photo posed.',
  },
  'home.narrative.1': {
    id: 'home.narrative.1',
    category: 'scene',
    purpose: 'Homepage "The problem" section.',
    src: '/scenes/narrative-1.webp',
    width: 720,
    height: 576,
    aspect: '1.25:1',
    fit: 'cover',
    alt: 'Plastic debris washed up along a shoreline',
    placeholder: 'skeleton',
    status: 'pending',
    prompt:
      'Documentary photograph of plastic debris collected along a shoreline, overcast natural light, sombre but not grim, muted palette.',
  },
  'home.narrative.2': {
    id: 'home.narrative.2',
    category: 'scene',
    purpose:
      'Homepage "The challenge" section. Currently illustrated by a salon photo of hair curlers.',
    src: '/scenes/narrative-2.webp',
    width: 720,
    height: 576,
    aspect: '1.25:1',
    fit: 'cover',
    alt: 'Volunteers gathered for a briefing before a restoration project',
    placeholder: 'skeleton',
    status: 'pending',
    prompt:
      'Candid photograph of a small group of volunteers in a briefing circle outdoors, one person gesturing at a map or clipboard, natural daylight, warm neutral palette.',
  },
  'home.narrative.3': {
    id: 'home.narrative.3',
    category: 'scene',
    purpose: 'Homepage "The opportunity" section.',
    src: '/scenes/narrative-3.webp',
    width: 720,
    height: 576,
    aspect: '1.25:1',
    fit: 'cover',
    alt: 'Hands planting a tree sapling in dark soil',
    placeholder: 'skeleton',
    status: 'pending',
    prompt:
      'Close documentary photograph of hands firming soil around a young tree sapling, shallow depth of field, warm natural light, rich green and earth tones.',
  },
  'home.narrative.4': {
    id: 'home.narrative.4',
    category: 'scene',
    purpose: 'Homepage "Our solution" section.',
    src: '/scenes/narrative-4.webp',
    width: 720,
    height: 576,
    aspect: '1.25:1',
    fit: 'cover',
    alt: 'Volunteers sorting collected waste into labelled containers',
    placeholder: 'skeleton',
    status: 'pending',
    prompt:
      'Documentary photograph of volunteers sorting collected waste into labelled bins, organised and purposeful, natural daylight, muted warm palette.',
  },
  'about.story': {
    id: 'about.story',
    category: 'scene',
    purpose: 'About page narrative image.',
    src: '/scenes/about-story.webp',
    width: 1200,
    height: 675,
    aspect: '16:9',
    fit: 'cover',
    alt: 'Organisers coordinating supplies before a community event',
    placeholder: 'skeleton',
    status: 'pending',
    prompt:
      'Candid photograph of event organisers checking supplies and equipment before a volunteer day, warm neutral palette, natural light.',
  },
  'login.bg': {
    id: 'login.bg',
    category: 'scene',
    purpose: 'Auth pages background. ALREADY WORKING — do not regenerate.',
    src: '/background/bg.webp',
    width: 1920,
    height: 1080,
    aspect: '16:9',
    fit: 'cover',
    alt: '',
    placeholder: 'gradient',
    status: 'ready',
    prompt: 'n/a — existing asset.',
  },

  // ── (b) Event category art ────────────────────────────────────────────
  // Fills the 1.8:1 card slot that currently renders a 4rem emoji on a green
  // gradient. Flat editorial illustration, consistent across the set.
  'event.type.cleanup': {
    id: 'event.type.cleanup',
    category: 'category',
    purpose: 'Event card artwork — beach cleanup.',
    src: '/events/type-cleanup.webp',
    width: 720,
    height: 400,
    aspect: '1.8:1',
    fit: 'cover',
    alt: '',
    placeholder: 'icon',
    status: 'pending',
    prompt:
      'Flat editorial illustration: shoreline with collected debris gathered into a neat pile, 2-3 tone build from #DCEDE2 / #52A276 / #14532D on #FBFAF7, one small #1D4ED8 accent, geometric, no gradients, no text, no faces.',
  },
  'event.type.plantation': {
    id: 'event.type.plantation',
    category: 'category',
    purpose: 'Event card artwork — tree plantation.',
    src: '/events/type-plantation.webp',
    width: 720,
    height: 400,
    aspect: '1.8:1',
    fit: 'cover',
    alt: '',
    placeholder: 'icon',
    status: 'pending',
    prompt:
      'Flat editorial illustration: rows of young saplings with a pair of stylised hands placing one, same palette and constraints as the cleanup slot.',
  },
  'event.type.ewaste': {
    id: 'event.type.ewaste',
    category: 'category',
    purpose: 'Event card artwork — e-waste drive.',
    src: '/events/type-ewaste.webp',
    width: 720,
    height: 400,
    aspect: '1.8:1',
    fit: 'cover',
    alt: '',
    placeholder: 'icon',
    status: 'pending',
    prompt:
      'Flat editorial illustration: stacked silhouettes of old devices being sorted, same palette and constraints as the cleanup slot.',
  },
  'event.type.restoration': {
    id: 'event.type.restoration',
    category: 'category',
    purpose: 'Event card artwork — habitat restoration.',
    src: '/events/type-restoration.webp',
    width: 720,
    height: 400,
    aspect: '1.8:1',
    fit: 'cover',
    alt: '',
    placeholder: 'icon',
    status: 'pending',
    prompt:
      'Flat editorial illustration: riverbank with reeds and a returning bird, same palette and constraints as the cleanup slot.',
  },
  'event.type.community': {
    id: 'event.type.community',
    category: 'category',
    purpose: 'Event card artwork — community action.',
    src: '/events/type-community.webp',
    width: 720,
    height: 400,
    aspect: '1.8:1',
    fit: 'cover',
    alt: '',
    placeholder: 'icon',
    status: 'pending',
    prompt:
      'Flat editorial illustration: abstract gathering circle of simplified figures around a shared plot, same palette and constraints as the cleanup slot.',
  },
  'event.type.other': {
    id: 'event.type.other',
    category: 'category',
    purpose: 'Event card artwork — uncategorised fallback.',
    src: '/events/type-other.webp',
    width: 720,
    height: 400,
    aspect: '1.8:1',
    fit: 'cover',
    alt: '',
    placeholder: 'icon',
    status: 'pending',
    prompt:
      'Flat editorial illustration: abstract leaf-and-grid motif, deliberately generic, same palette and constraints as the cleanup slot.',
  },

  // ── (c) Rewards — the reference standard, already correct ─────────────
  'reward.water-bottle': {
    id: 'reward.water-bottle',
    category: 'reward',
    purpose: 'Redeem shop product shot. ALREADY WORKING — match this style.',
    src: '/rewards/water-bottle.png',
    width: 1152,
    height: 896,
    aspect: '9:7',
    fit: 'contain',
    alt: 'Reusable stainless steel water bottle',
    placeholder: 'skeleton',
    status: 'ready',
    prompt: 'n/a — existing asset; use as the lighting/background reference.',
  },
  'reward.seed-pencil': {
    id: 'reward.seed-pencil',
    category: 'reward',
    purpose: 'Redeem shop product shot. ALREADY WORKING.',
    src: '/rewards/seed-pencil.png',
    width: 1152,
    height: 896,
    aspect: '9:7',
    fit: 'contain',
    alt: 'Plantable seed pencil',
    placeholder: 'skeleton',
    status: 'ready',
    prompt: 'n/a — existing asset.',
  },
  'reward.tote-bag': {
    id: 'reward.tote-bag',
    category: 'reward',
    purpose: 'Redeem shop product shot. ALREADY WORKING.',
    src: '/rewards/tote-bag.png',
    width: 1152,
    height: 896,
    aspect: '9:7',
    fit: 'contain',
    alt: 'Organic cotton tote bag',
    placeholder: 'skeleton',
    status: 'ready',
    prompt: 'n/a — existing asset.',
  },

  // ── (d) Brand marks & textures ────────────────────────────────────────
  'brand.logomark': {
    id: 'brand.logomark',
    category: 'brand',
    purpose:
      'Navbar / app shell mark. public/logo.png exists but has only ever been used in OG metadata, never rendered on-page.',
    src: '/logo.png',
    width: 474,
    height: 474,
    aspect: '1:1',
    fit: 'contain',
    alt: 'Sproutify',
    placeholder: 'mark',
    status: 'ready',
    prompt:
      'Replace with a proper vector logomark: single-weight geometric sprout in #14532D, legible at 20px, square lockup.',
  },
  'brand.og': {
    id: 'brand.og',
    category: 'brand',
    purpose:
      'Open Graph / Twitter card. Currently uses the 1:1 logo.png, which crops badly as a social card.',
    src: '/brand/og.png',
    width: 1200,
    height: 630,
    aspect: '1.91:1',
    fit: 'cover',
    alt: 'Sproutify — community-led environmental action',
    placeholder: 'mark',
    status: 'pending',
    prompt:
      'Social card: wordmark and one-line mission on #FBFAF7 with a #14532D band, generous margins, no photograph.',
  },
} satisfies Record<string, AssetSlot>

export const ASSETS = ASSET_MAP
export type AssetId = keyof typeof ASSET_MAP

export function getAsset(id: AssetId): AssetSlot {
  return ASSET_MAP[id]
}

/** Slots still awaiting generation — drives a Phase 5 progress checklist. */
export function pendingAssets(): AssetSlot[] {
  return (Object.values(ASSET_MAP) as AssetSlot[]).filter((a) => a.status === 'pending')
}
