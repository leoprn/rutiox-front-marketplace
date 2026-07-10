import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkshopBySlug, NotFoundError } from '../api';
import type { WorkshopProfile } from '../types';

const ICON_MAP: Record<string, string> = {
  'gauge':               '🛢️',
  'wrench':              '🔧',
  'settings-2':          '⚙️',
  'disc-3':              '🔵',
  'circle-dot':          '🛞',
  'zap':                 '⚡',
  'snowflake':           '❄️',
  'spray-can':           '🎨',
  'panel-top':           '🪟',
  'fuel':                '⛽',
  'sparkles':            '✨',
  'droplets':            '💧',
  'shield-check':        '🛡️',
  'life-buoy':           '🆘',
  'file-text':           '📄',
  'wrench-screwdriver':  '🔧',
  'bolt':                '⚡',
  'settings':            '⚙️',
  'shield':              '🛡️',
};

function categoryIcon(iconName: string | null): string {
  if (!iconName) return '🔩';
  return ICON_MAP[iconName] ?? '🔩';
}

export default function WorkshopProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const [workshop, setWorkshop] = useState<WorkshopProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getWorkshopBySlug(slug)
      .then((data) => {
        setWorkshop(data);
        document.title = `${data.name} | RutioX`;
        setMeta('description', `${data.name} — ${data.address}`);
        setMeta('og:title', data.name);
        setMeta('og:description', `${data.name} — ${data.address}`);
        if (data.logoUrl) setMeta('og:image', data.logoUrl);
        setMeta('og:url', window.location.href);
      })
      .catch((err) => {
        if (err instanceof NotFoundError) setNotFound(true);
        else setError(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingScreen />;
  if (notFound) return <NotFoundScreen />;
  if (error) return <ErrorScreen />;
  if (!workshop) return null;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          {workshop.logoUrl ? (
            <img src={workshop.logoUrl} alt={workshop.name} style={styles.logo} />
          ) : (
            <div style={styles.logoPlaceholder}>
              <span style={{ fontSize: 32 }}>🔧</span>
            </div>
          )}
          <div style={styles.headerInfo}>
            <h1 style={styles.name}>{workshop.name}</h1>
            <p style={styles.address}>📍 {workshop.address}</p>
            {workshop.phoneNumber && (
              <a href={`tel:${workshop.phoneNumber}`} style={styles.phone}>
                📞 {workshop.phoneNumber}
              </a>
            )}
            {workshop.responseTimeBadge && (
              <span style={styles.badge}>{workshop.responseTimeBadge}</span>
            )}
          </div>
        </div>

        {/* Categories */}
        {workshop.categories.length > 0 && (
          <Section title="Especialidades">
            <div style={styles.pills}>
              {workshop.categories.map((c) => (
                <span key={c.id} style={styles.pill}>
                  {categoryIcon(c.iconEmoji)} {c.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Services */}
        {workshop.services.length > 0 && (
          <Section title="Servicios">
            <div style={styles.pills}>
              {workshop.services.map((s) => (
                <span key={s.id} style={styles.pillOutline}>
                  {s.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Gallery */}
        {workshop.photoUrls.length > 0 && (
          <Section title="Fotos">
            <div style={styles.gallery}>
              {workshop.photoUrls.map((url, i) => (
                <img key={i} src={url} alt={`Foto ${i + 1}`} style={styles.galleryImg} />
              ))}
            </div>
          </Section>
        )}

        {/* CTA */}
        <div style={styles.cta}>
          <a
            href="https://rutiox.com"
            style={styles.ctaButton}
          >
            Pedir turno en RutioX
          </a>
          <p style={styles.ctaHint}>Descargá la app y reservá tu turno en segundos</p>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <span style={styles.footerLogo}>RutioX</span>
          <span style={styles.footerTagline}>La plataforma para talleres mecánicos</span>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={styles.centered}>
      <div style={styles.spinner} />
      <p style={{ color: '#888', marginTop: 16 }}>Cargando perfil...</p>
    </div>
  );
}

function NotFoundScreen() {
  return (
    <div style={styles.centered}>
      <p style={{ fontSize: 48 }}>🔍</p>
      <h2 style={{ color: '#fff', margin: '16px 0 8px' }}>Taller no encontrado</h2>
      <p style={{ color: '#888' }}>El link que seguiste ya no existe o fue movido.</p>
    </div>
  );
}

function ErrorScreen() {
  return (
    <div style={styles.centered}>
      <p style={{ fontSize: 48 }}>⚠️</p>
      <h2 style={{ color: '#fff', margin: '16px 0 8px' }}>Algo salió mal</h2>
      <p style={{ color: '#888' }}>Intentá de nuevo en unos minutos.</p>
    </div>
  );
}

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[property="${name}"], meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#0f0f0f',
    color: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '24px 16px',
  },
  container: {
    maxWidth: 680,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    gap: 20,
    alignItems: 'flex-start',
    marginBottom: 32,
    padding: 24,
    background: '#1a1a1a',
    borderRadius: 16,
    border: '1px solid #2a2a2a',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    objectFit: 'cover',
    flexShrink: 0,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    background: '#2a2a2a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    margin: '0 0 8px',
    fontSize: 24,
    fontWeight: 700,
    color: '#fff',
  },
  address: {
    margin: '0 0 6px',
    fontSize: 14,
    color: '#aaa',
  },
  phone: {
    display: 'block',
    margin: '0 0 8px',
    fontSize: 14,
    color: '#e07b00',
    textDecoration: 'none',
  },
  badge: {
    display: 'inline-block',
    background: '#e07b0020',
    color: '#e07b00',
    border: '1px solid #e07b0040',
    borderRadius: 20,
    padding: '2px 10px',
    fontSize: 12,
    fontWeight: 600,
  },
  section: {
    marginBottom: 28,
    padding: 20,
    background: '#1a1a1a',
    borderRadius: 12,
    border: '1px solid #2a2a2a',
  },
  sectionTitle: {
    margin: '0 0 14px',
    fontSize: 14,
    fontWeight: 600,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  pills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    background: '#e07b0015',
    color: '#e07b00',
    border: '1px solid #e07b0030',
    borderRadius: 20,
    padding: '5px 12px',
    fontSize: 13,
    fontWeight: 500,
  },
  pillOutline: {
    background: '#2a2a2a',
    color: '#ccc',
    border: '1px solid #333',
    borderRadius: 20,
    padding: '5px 12px',
    fontSize: 13,
  },
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: 8,
  },
  galleryImg: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    borderRadius: 8,
  },
  cta: {
    textAlign: 'center',
    padding: '28px 20px',
    background: '#1a1a1a',
    borderRadius: 12,
    border: '1px solid #2a2a2a',
    marginBottom: 24,
  },
  ctaButton: {
    display: 'inline-block',
    background: '#e07b00',
    color: '#fff',
    padding: '14px 28px',
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 16,
    textDecoration: 'none',
    marginBottom: 10,
  },
  ctaHint: {
    color: '#666',
    fontSize: 13,
    margin: '10px 0 0',
  },
  footer: {
    textAlign: 'center',
    paddingBottom: 32,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  footerLogo: {
    fontWeight: 700,
    fontSize: 18,
    color: '#e07b00',
  },
  footerTagline: {
    color: '#555',
    fontSize: 12,
  },
  centered: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0f0f0f',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  spinner: {
    width: 40,
    height: 40,
    border: '3px solid #2a2a2a',
    borderTop: '3px solid #e07b00',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};
