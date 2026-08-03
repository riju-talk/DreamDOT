export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.75rem', fontWeight: 'bold' }}>404</h1>
        <p style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '0.5rem' }}>Page Not Found</p>
        <p style={{ marginTop: '1rem', maxWidth: '28rem', margin: '1rem auto' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ marginTop: '2rem' }}>
          <a href="/" style={{ padding: '0.5rem 1.5rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '0.5rem', fontWeight: '600', display: 'inline-block' }}>
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}
