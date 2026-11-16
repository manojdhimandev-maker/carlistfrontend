import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiHeart, FiAward, FiCheckCircle } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';

export default function About() {
  return (
    <main>
      {/* 1. Page Banner */}
      <section className="page-banner">
        <div className="page-width page-banner-content">
          <span className="eyebrow">
            <span className="eyebrow-dot" /> About Fawmond Galaxy
          </span>
          <h1>Driven by quality, defined by trust.</h1>
          <p>
            A fresh, transparent approach to buying your next car. We focus on curated quality,
            unhurried service, and complete peace of mind.
          </p>
        </div>
      </section>

      {/* 2. Story Section */}
      <section className="content-section page-width">
        <div className="about-story-grid">
          <div>
            <span className="section-kicker">Our Story</span>
            <h2>A better dealership experience for today's drivers.</h2>
            <p style={{ lineHeight: '1.7', color: 'var(--muted-foreground)', marginTop: '16px' }}>
              At Fawmond Galaxy, we believe buying a car should be as rewarding and dependable as
              driving one. Founded with the mission to eliminate high-pressure sales and murky
              histories, we bring hand-picked vehicles to drivers who value quality, transparency,
              and genuine personal service.
            </p>
            <p style={{ lineHeight: '1.7', color: 'var(--muted-foreground)' }}>
              From premium saloons and family-ready estates to efficient hybrids and modern SUVs,
              every vehicle on our forecourt is thoroughly inspected, mechanically verified, and
              prepared to the highest standard.
            </p>
            <div style={{ marginTop: '24px' }}>
              <Link to="/cars" className="btn button-green">
                Explore our collection <FiArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div>
            <img
              src="/images/dealership-hero-BwD2TsJP.jpg"
              alt="Fawmond Galaxy Dealership"
              className="about-story-img"
            />
          </div>
        </div>
      </section>

      {/* 3. Core Values */}
      <section className="brand-promise">
        <div className="page-width promise-inner">
          <span className="section-kicker section-kicker-light">What sets us apart</span>
          <h2>The Galaxy standards we stand by every day.</h2>
          <p>
            Every step of our process is designed around honesty, vehicle reliability, and your
            complete confidence.
          </p>
          <div className="promise-values">
            <div>
              <span className="promise-num">01</span>
              <h3>Hand-Selected Vehicles</h3>
              <p>
                We do not bulk-buy auction lots. Each car is individually evaluated for provenance,
                maintenance history, and overall condition.
              </p>
            </div>
            <div>
              <span className="promise-num">02</span>
              <h3>No Pressure Experience</h3>
              <p>
                Take your time, review specifications, test drive at your pace, and get answers from
                people who genuinely know cars.
              </p>
            </div>
            <div>
              <span className="promise-num">03</span>
              <h3>Clear & Fair Pricing</h3>
              <p>
                No hidden admin fees, surprise add-ons, or convoluted finance traps. What you see is
                what you pay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trust & Service Highlights */}
      <section className="content-section page-width">
        <div className="section-heading-row">
          <div>
            <span className="section-kicker">Peace of mind</span>
            <h2>Why drivers choose Fawmond Galaxy</h2>
            <p>Our commitment to excellence extends well beyond handing over the keys.</p>
          </div>
        </div>

        <div className="about-features-grid">
          <div className="about-feature-card">
            <FiShield size={28} style={{ color: 'var(--galaxy-green)' }} />
            <h3>Comprehensive Health Check</h3>
            <p>
              Each car undergoes a multi-point mechanical inspection by experienced technicians
              before listing.
            </p>
          </div>
          <div className="about-feature-card">
            <FiAward size={28} style={{ color: 'var(--galaxy-green)' }} />
            <h3>HPI & History Verified</h3>
            <p>
              Every vehicle is checked for outstanding finance, recorded mileage integrity, and
              accident damage history.
            </p>
          </div>
          <div className="about-feature-card">
            <BsStars size={28} style={{ color: 'var(--galaxy-green)' }} />
            <h3>Professional Valeting</h3>
            <p>
              Delivered in immaculate condition, cleaned inside and out with premium automotive care
              products.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Contact CTA */}
      {/* <section className="contact-strip page-width">
        <div className="contact-strip-inner">
          <div>
            <span className="section-kicker">Get started today</span>
            <h2>Looking for your next car?</h2>
            <p>Browse our current collection or get in touch with our friendly team.</p>
          </div>
          <div className="contact-strip-actions">
            <Link to="/cars" className="btn button-green">
              Browse our cars
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Contact our team
            </Link>
          </div>
        </div>
      </section> */}
    </main>
  );
}
