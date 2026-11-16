import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function NoPage() { 

  const image = "/images/pagenotfound.png"
  return (
    <main className="page-width not-found-page" style={{ padding: '90px 20px', textAlign: 'center' }}>
      <img
        src={image}
        alt="404 Page Not Found"
        className="not-found-illustration"

      />
      <span className="section-kicker">404 Error</span>
      <h1 style={{ marginTop: '8px', marginBottom: '12px' }}>Page not found.</h1>
      <p style={{ color: 'var(--muted-foreground)', maxWidth: '480px', margin: '0 auto 24px' }}>
        The page you are looking for doesn't exist or has moved. Browse our available collection or head back home.
      </p>
      <Link
        to="/"
        className="btn button-green"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px 28px',
          color: '#ffffff',
          textDecoration: 'none',
          fontWeight: '600',
        }}
      >
        Back to Homepage <FiArrowRight size={16} />
      </Link>
    </main>
  );
}
