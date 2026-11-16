import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { FiPhone, FiMenu, FiX } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/cars', label: 'Our cars' },
    // { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    // { to: '/admin', label: 'Admin' },
  ];

  // Automatically close mobile menu when navigating to another route
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="site-header">
      <div className="site-header-inner page-width">
        <Link to="/" aria-label="Fawmond Galaxy home" className="brand-logo-link">
          <img
            src="/images/logo.png"
            alt="Fawmond Galaxy"
            className="brand-logo"
            width="170"
            height="46"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/logo.png';
            }}
          />
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `nav-link ${
                  isActive || (link.to === '/' && location.pathname === '/home')
                    ? 'nav-link-active active'
                    : ''
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-contact">
          <a href="tel:08058364295" className="header-phone">
            <FiPhone aria-hidden="true" size={16} />
            <span className="number-edit">08058364295</span>
          </a>
          <a
            href="https://wa.me/08058364295"
            target="_blank"
            rel="noreferrer"
            className="btn button-green header-cta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
            }}
          >
            <FaWhatsapp aria-hidden="true" size={16} />
            WhatsApp us
          </a>
        </div>

        <button
          type="button"
          className="mobile-menu-trigger"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-nav-drawer ${mobileOpen ? 'open' : ''}`}>
        <nav className="mobile-nav page-width" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `mobile-nav-link ${
                  isActive || (link.to === '/' && location.pathname === '/home')
                    ? 'active'
                    : ''
                }`
              }
            >
              <span>{link.label}</span>
            </NavLink>
          ))}

          <div className="mobile-nav-actions">
            <a href="tel:08058364295" className="mobile-phone-link">
              <FiPhone size={16} />
              <span>08058364295</span>
            </a>
            <a
              href="https://wa.me/08058364295"
              target="_blank"
              rel="noreferrer"
              className="btn button-green mobile-whatsapp-link"
              onClick={() => setMobileOpen(false)}
            >
              <FaWhatsapp size={16} />
              <span>WhatsApp us</span>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
