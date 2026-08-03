'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.75rem', fontWeight: 'bold' }}>500</h1>
        <p style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '0.5rem' }}>Something went wrong</p>
        <p style={{ marginTop: '1rem', maxWidth: '28rem', margin: '1rem auto' }}>
          An unexpected error occurred. Please try again.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => reset()}
            style={{ padding: '0.5rem 1.5rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '0.5rem', fontWeight: '600', border: 'none', cursor: 'pointer' }}
          >
            Try Again
          </button>
          <a href="/" style={{ padding: '0.5rem 1.5rem', backgroundColor: '#e5e7eb', color: '#1f2937', borderRadius: '0.5rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center' }}>
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}
