import { Link } from 'react-router-dom'

const LINKS = {
  Product: [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Scoring', href: '#scoring' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Open Trinity', href: '/chat' },
  ],
  Team: [
    { label: 'Sign in', href: '/signin' },
    { label: 'Team dashboard', href: '/dashboard' },
    { label: 'Leads', href: '/dashboard' },
    { label: 'Settings', href: '/settings' },
  ],
  Venturizer: [
    { label: 'About', href: 'https://venturizer.co', external: true },
    { label: 'Ecosystem', href: 'https://venturizer.co', external: true },
    { label: 'Ventures', href: 'https://venturizer.co', external: true },
    { label: 'Join the Ecosystem', href: 'https://venturizer.co', external: true },
  ],
}

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#0A0A0A',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '64px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr repeat(3, auto)',
          gap: '48px',
          alignItems: 'start',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: '"Geist Variable", sans-serif',
              fontWeight: 600,
              fontSize: '18px',
              letterSpacing: '-0.04em',
              color: '#FFFFFF',
              marginBottom: '10px',
            }}
          >
            Trinity
          </div>
          <p
            style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: '12px',
              color: '#444',
              letterSpacing: '-0.01em',
              lineHeight: 1.6,
              margin: '0 0 20px',
              maxWidth: '220px',
            }}
          >
            Lead-qualification engine for Venturizer. Scores inbound founders and investors 0–100, automatically.
          </p>
          <div
            style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: '11px',
              color: '#333',
              letterSpacing: '-0.01em',
            }}
          >
            Internal tool · Venturizer © 2025
          </div>
        </div>

        {Object.entries(LINKS).map(([col, links]) => (
          <div key={col}>
            <div
              style={{
                fontFamily: '"Inter", system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: 500,
                color: '#444',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              {col}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {links.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: '"Inter", system-ui, sans-serif',
                      fontSize: '13px',
                      color: '#555',
                      textDecoration: 'none',
                      letterSpacing: '-0.01em',
                      transition: 'color 150ms ease',
                    }}
                    onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.target.style.color = '#555')}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    style={{
                      fontFamily: '"Inter", system-ui, sans-serif',
                      fontSize: '13px',
                      color: '#555',
                      textDecoration: 'none',
                      letterSpacing: '-0.01em',
                      transition: 'color 150ms ease',
                    }}
                    onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.target.style.color = '#555')}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 680px) {
          footer > div {
            grid-template-columns: 1fr 1fr !important;
          }
          footer > div > div:first-child {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </footer>
  )
}
