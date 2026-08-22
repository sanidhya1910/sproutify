"use client"

// Catches errors thrown by the root layout itself (including the providers
// tree), so it can't rely on anything the layout would normally provide —
// no MUI theme, no shared components. Kept deliberately minimal/self-styled.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          background: '#ffffff',
          color: '#111111',
        }}
      >
        <div style={{ textAlign: 'center', padding: 32, maxWidth: 420 }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Something went wrong</h1>
          <p style={{ color: '#555555', marginBottom: 24 }}>
            Sproutify hit an unexpected error. Please try again.
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: '#2e7d32',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 20px',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
