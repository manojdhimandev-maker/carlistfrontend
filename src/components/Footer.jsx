
import React from 'react';
import { Link } from 'react-router-dom';

const ContactIcon = ({ type }) => {
  const icons = {
    phone: (
      <>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 11.2 18.8a19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 3.18 2 2 0 0 1 4.1 1h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.08 8.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.58 2.8.7A2 2 0 0 1 22 16.92Z" />
      </>
    ),
    email: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 7L2 7" />
      </>
    ),
    location: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    instagram: (
  <>  
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r=".8" />
  </>
),
  };

  return (
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      {icons[type]}
    </svg>
  );
};

const SocialIcon = ({ name }) => {
  const icons = {
    Facebook: <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v5h4v-5h3l1-4h-4V9c0-.7.3-1 1-1Z" />,
    Instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".8" />
      </>
    ),
    LinkedIn: (
      <>
        <path d="M5 9v10M5 5v.1M10 19v-6a4 4 0 0 1 8 0v6M10 10v9" />
      </>
    ),
    X: <path d="m5 4 14 16M19 4 5 20" />,
  };

  return (
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      {icons[name]}
    </svg>
  );
};

const FooterContactCard = ({ type, label, children, href }) => {
  const content = (
    <>
      <span className="fg-contact-icon">
        <ContactIcon type={type} />
      </span>
      <span className="fg-contact-text">
        <span className="fg-contact-label">{label}</span>
        <span className="fg-contact-value">{children}</span>
      </span>
    </>
  );

  return href ? (
    <a href={href} className="fg-contact-card">
      {content}
    </a>
  ) : (
    <div className="fg-contact-card">
      {content}
    </div>
  );
};

export default function Footer({
  contactEmail,
  address,
  socialLinks = {},
  privacyPath,
  termsPath,
}) {
  const socials = ['Facebook', 'Instagram', 'LinkedIn', 'X'];

  return (
    <footer className="site-footer">
      <div className="fg-footer-container">

        <div className="fg-footer-grid">

          {/* BRAND */}
          <div className="fg-brand-column">
            <Link to="/" className="fg-logo" aria-label="Fawmond Galaxy home">
              <img
                className="footer-logo"
                src="/images/logo.png"
                alt="Fawmond Galaxy"
                width="170"
                height="46"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/logo.png';
                }}
              />
            </Link>

            <p className="fg-description">
              Find your next car with Fawmond Galaxy.
              Explore quality vehicles, discover great deals
              and enjoy a simple, transparent car-buying
              experience.
            </p>

            {/* <div className="fg-socials">
              {socials.map((name) => (
                socialLinks[name] ? (
                  <a
                    key={name}
                    href={socialLinks[name]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fg-social-link"
                    aria-label={name}
                  >
                    <SocialIcon name={name} />
                  </a>
                ) : (
                  <span
                    key={name}
                    className="fg-social-link"
                    aria-label={`${name} link not configured`}
                    title={`${name} link not configured`}
                  >
                    <SocialIcon name={name} />
                  </span>
                )
              ))}
            </div> */}
          </div>

          {/* EXPLORE CARS */}
          <div className="fg-explore-column">
            <h3 className="fg-heading">Explore Cars</h3>

            <div className="fg-explore-links">
              <ul>
                <li><Link to="/cars">Browse All Cars</Link></li>
                <li><Link to="/cars">Featured Cars</Link></li>
                <li><Link to="/cars">Latest Arrivals</Link></li>
              </ul>

              <ul>
                <li><Link to="/cars">Used Cars</Link></li>
                <li><Link to="/contact">Contact About a Car</Link></li>
              </ul>
            </div>
          </div>

          {/* COMPANY */}
          <div className="fg-company-column">
            <h3 className="fg-heading">Company</h3>

            <ul className="fg-nav-links">
              <li><Link to="/contact">About Us</Link></li>
              <li><Link to="/cars">Our Cars</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>

              {/* {termsPath && (
                <li><Link to={termsPath}>Terms &amp; Conditions</Link></li>
              )}

              {privacyPath && (
                <li><Link to={privacyPath}>Privacy Policy</Link></li>
              )} */}
            </ul>
          </div>

          {/* CONTACT */}
         
{/* CONTACT */}
<div className="fg-contact-column">
  <h3 className="fg-heading">Contact</h3>

  <div className="fg-contact-list">

    <FooterContactCard
      type="phone"
      label="Call Us"
      href="tel:08058364295"
    >
      08058364295
    </FooterContactCard>

    <FooterContactCard
      type="phone"
      label="Call Us"
      href="tel:08058364295"
    >
      +447931224287
    </FooterContactCard>

    <FooterContactCard
      type="phone"
      label="Call Us"
      href="tel:+13172968221"
    >
      +1 317 296 8221
    </FooterContactCard>

    <FooterContactCard
      type="instagram"
      label="Follow Us"
      href="https://www.instagram.com/fawmondgalaxy/"
    >
      @fawmondgalaxy
    </FooterContactCard>

  </div>
</div>


        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="fg-footer-bottom">

          <p>
            © 2026 Fawmond Galaxy. All rights reserved.
          </p>

          <div className="fg-bottom-links">
            {/* {termsPath && (
              <Link to={termsPath}>Terms &amp; Conditions</Link>
            )}

            {privacyPath && (
              <Link to={privacyPath}>Privacy Policy</Link>
            )} */}

            <span>Your Journey. Our Priority.</span>
          </div>

        </div>

      </div>
    </footer>
  );
}
