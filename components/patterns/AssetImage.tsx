import Image from 'next/image'
import { Leaf, type LucideIcon } from 'lucide-react'
import { getAsset, type AssetId, type AssetSlot } from '@/lib/assets'
import { cn } from '@/lib/utils'

/**
 * The single consumption point for the asset manifest.
 *
 * Built in Phase 1 (not Phase 5) so every rebuilt page authors against it
 * from day one — which is what makes Phase 5 pure asset-dropping rather than
 * a second pass over every component.
 *
 * Placeholders render at the slot's exact aspect ratio, so flipping an asset
 * to `status: 'ready'` causes zero layout shift.
 */

interface AssetImageProps {
  slot: AssetId
  className?: string
  sizes?: string
  /**
   * Escape hatch for user-supplied URLs that can't live in a static manifest
   * — chiefly `Event.imageUrl`, a free-text column set by admins. When
   * non-empty this wins over the manifest entry.
   */
  override?: string | null
  /** Overrides the manifest icon for `placeholder: 'icon'` slots. */
  icon?: LucideIcon
  /** Overrides manifest alt text (e.g. per-event alt for category art). */
  alt?: string
}

function aspectStyle(asset: AssetSlot) {
  return { aspectRatio: `${asset.width} / ${asset.height}` }
}

function AssetPlaceholder({
  asset,
  className,
  icon: Icon = Leaf,
}: {
  asset: AssetSlot
  className?: string
  icon?: LucideIcon
}) {
  const base = 'flex w-full items-center justify-center overflow-hidden'

  if (asset.placeholder === 'skeleton') {
    return (
      <div
        style={aspectStyle(asset)}
        className={cn(base, 'animate-pulse bg-surface-sunken', className)}
        aria-hidden
      />
    )
  }

  if (asset.placeholder === 'gradient') {
    return (
      <div
        style={aspectStyle(asset)}
        className={cn(base, 'bg-gradient-to-br from-primary-100 to-primary-200', className)}
        aria-hidden
      >
        <Icon className="text-primary-700/30" size={40} strokeWidth={1.5} />
      </div>
    )
  }

  if (asset.placeholder === 'mark') {
    return (
      <div
        style={aspectStyle(asset)}
        className={cn(base, 'bg-primary-50', className)}
        aria-hidden
      >
        <span className="text-h4 tracking-tight text-primary-700">Sproutify</span>
      </div>
    )
  }

  // 'icon' — the honest replacement for the old 4rem emoji on a green
  // gradient. Category art degrades to a real vector icon, never an emoji.
  return (
    <div
      style={aspectStyle(asset)}
      className={cn(base, 'bg-primary-50', className)}
      aria-hidden
    >
      <Icon className="text-primary-400" size={32} strokeWidth={1.5} />
    </div>
  )
}

export function AssetImage({
  slot,
  className,
  sizes,
  override,
  icon,
  alt,
}: AssetImageProps) {
  const asset = getAsset(slot)
  const src = override?.trim() || (asset.status === 'ready' ? asset.src : null)

  if (!src) {
    return <AssetPlaceholder asset={asset} className={className} icon={icon} />
  }

  return (
    <Image
      src={src}
      alt={alt ?? asset.alt}
      width={asset.width}
      height={asset.height}
      priority={asset.priority}
      sizes={sizes}
      className={cn(
        'w-full',
        asset.fit === 'cover' ? 'object-cover' : 'object-contain',
        className
      )}
    />
  )
}
