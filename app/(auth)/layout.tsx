import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { Stamp } from '@/components/passport/Stamp'
import { IconPassport } from '@/components/passport/icons'

/**
 * Split-screen auth. Focused, single-task screens: no marketing navbar and no
 * footer, just the brand, a way back to the site, and the form.
 *
 * The left panel is the front cover of the volunteer passport the homepage
 * talks about: embossed title, the organisation's seal, and one line on
 * what goes inside. Only at lg+; on phones the form owns the screen.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <aside className="relative isolate hidden flex-col items-center justify-between overflow-hidden bg-primary-900 p-10 text-center text-primary-100 lg:flex xl:p-14">
        {/* Security print and a stitched border inset from the edge */}
        <div aria-hidden className="guilloche absolute inset-0 -z-10 opacity-60" />
        <div aria-hidden className="absolute inset-5 -z-10 rounded-[20px] border-2 border-dashed border-primary-700" />

        <Link href="/" className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-primary-300 hover:text-primary-100">
          Sproutify · Mumbai
        </Link>

        <div className="flex flex-col items-center">
          <div className="w-[220px] opacity-90">
            <Stamp top="Volunteer passport" bottom="Est. 2020" icon={IconPassport} ink="paper" rotate={0} fluid seed={21} />
          </div>
          <p className="mt-10 font-display text-[clamp(2rem,1rem+2.4vw,3.25rem)] leading-[0.95] text-primary-100 [text-shadow:0_1px_0_hsl(var(--primary-700)),0_-1px_0_hsl(144_62%_6%)]">
            Volunteer
            <br />
            passport
          </p>
        </div>

        <p className="mb-4 max-w-xs text-body text-primary-200">
          Every event you turn up to gets stamped in here, with the hours to prove it.
        </p>
      </aside>

      <div className="flex flex-col">
        <div className="flex h-16 items-center justify-between px-5 md:px-10">
          <Link href="/" className="flex items-center gap-2 lg:invisible">
            <Image src="/logo.png" alt="" width={24} height={24} className="size-6 object-contain" />
            <span className="font-display text-[1rem] leading-none text-foreground">Sproutify</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-body-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
          >
            <ArrowLeft size={15} strokeWidth={1.75} aria-hidden />
            Back to site
          </Link>
        </div>
        <main className="flex flex-1 items-center justify-center px-5 py-10 md:px-10">
          {children}
        </main>
      </div>
    </div>
  )
}
