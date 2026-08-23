import Navbar from '@/components/chrome/Navbar'

/**
 * Auth pages get the public navbar but no footer — these are focused,
 * single-task screens and a four-column footer under a login card is noise.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-5 py-12">{children}</main>
    </div>
  )
}
