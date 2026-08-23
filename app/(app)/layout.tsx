import AppShell from '@/components/chrome/AppShell'

/**
 * AuthGuard is intentionally NOT mounted here — the two sections require
 * different roles (`ADMIN` vs `VOLUNTEER`), so each page keeps its own guard
 * with the correct requiredRole. This layout only supplies the chrome.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
