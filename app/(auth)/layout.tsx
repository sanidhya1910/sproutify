import Navbar from '@/components/chrome/Navbar'
import { AssetImage } from '@/components/patterns/AssetImage'

/**
 * Auth pages get the public navbar but no footer: these are focused,
 * single-task screens and a four-column footer under a login card is noise.
 *
 * The `login.bg` slot was marked ready in the asset manifest but nothing
 * rendered it after the rebuild, so sign-in and register were a small card
 * floating in an empty field of paper. It is wired back up here, held behind
 * a heavy scrim so the form keeps full contrast.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <AssetImage
          slot="login.bg"
          className="h-full w-full object-cover"
          sizes="100vw"
          alt=""
        />
        <div className="absolute inset-0 bg-background/92" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-5 py-12">{children}</main>
    </div>
  )
}
