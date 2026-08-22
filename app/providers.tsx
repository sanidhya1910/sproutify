"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Toaster, toast } from 'sonner';
import muiBridge from '@/lib/mui-bridge';

/**
 * Compat shim — TEMPORARY, deleted in Phase 4.
 *
 * Three pages still import `useSnackbar` (admin/volunteers/[id],
 * volunteer/redeem-shop, volunteer/events). Rather than touch them now, keep
 * the exact same API and re-implement it over sonner. Call sites migrate to
 * calling `toast()` directly as their pages get rebuilt.
 */
export function useSnackbar() {
  return {
    showSuccess: (message: string) => toast.success(message),
    showError: (message: string) => toast.error(message),
    showInfo: (message: string) => toast(message),
  };
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 2,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* muiBridge is scaffolding for the not-yet-rebuilt MUI pages; both it
          and this ThemeProvider are removed in Phase 4. CssBaseline is
          deliberately gone — Tailwind's preflight owns the reset now, and
          MuiCssBaseline was the second source of the broken font stack. */}
      <ThemeProvider theme={muiBridge}>
        {children}
        <Toaster richColors closeButton position="bottom-right" />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
