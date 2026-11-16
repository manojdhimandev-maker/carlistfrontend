import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiCheckCircle, FiAlertCircle, FiLock } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { submitEnquiry } from '../services/api';

export default function Contact() {
  const [searchParams] = useSearchParams();
  const vehicleParam = searchParams.get('vehicle') || '';

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    vehicle: vehicleParam,
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Update vehicle if query param changes
  useEffect(() => {
    if (vehicleParam) {
      setForm((prev) => ({ ...prev, vehicle: vehicleParam }));
    }
  }, [vehicleParam]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!form.name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!form.phone.trim()) {
      setError('Please provide a phone number.');
      return;
    }
    if (!form.message.trim()) {
      setError('Please write a message.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitEnquiry(form);
      if (res.success) {
        setSuccess(true);
        setForm({
          name: '',
          phone: '',
          email: '',
          vehicle: '',
          message: '',
        });
      } else {
        setError(res.message || 'Unable to submit your enquiry. Please try again.');
      }
    } catch (err) {
      console.error('Enquiry error:', err);
      setError(
        err.response?.data?.message ||
          'Something went wrong sending your enquiry. Please try again or call us instead.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* 1. Page Banner */}
      <section className="page-banner contact-banner">
        <div className="page-width page-banner-content">
          <span className="eyebrow">
            <span className="eyebrow-dot" /> We’re here to help
          </span>
          <h1>Let’s talk cars.</h1>
          <p>Questions, viewings, or just getting started? Reach out to our team.</p>
        </div>
      </section>

      {/* 2. Contact Grid */}
      <section className="page-width contact-page-grid">
        {/* Left Column */}
        <div className="contact-intro">
          <span className="section-kicker">Get in touch</span>
          <h2>
            Good conversations
            <br />
            start here.
          </h2>
          <p>
            Tell us a little about what you need. We’ll make sure your enquiry reaches the right
            person.
          </p>

          <div className="contact-methods">
            <a href="tel:08058364295">
              <span className="contact-method-icon">
                <FiPhone size={18} />
              </span>
              <span>
                <small>Give us a call</small>
                <strong>08058364295</strong>
              </span>
            </a>

            <a href="https://wa.me/08058364295" target="_blank" rel="noreferrer">
              <span className="contact-method-icon">
                <FaWhatsapp size={18} />
              </span>
              <span>
                <small>Chat on WhatsApp</small>
                <strong>Message our team</strong>
              </span>
            </a>

            <div>
              <span className="contact-method-icon">
                <FiMail size={18} />
              </span>
              <span>
                <small>Email</small>
                <strong>Contact form enquiries</strong>
                <em>Direct response within 24 hours</em>
              </span>
            </div>

            <div>
              <span className="contact-method-icon">
                <FiMapPin size={18} />
              </span>
              <span>
                <small>Find us</small>
                <strong>Contact us for directions</strong>
              </span>
            </div>
          </div>

          <Link to="/cars" className="contact-browse-link">
            Browse our cars <span>→</span>
          </Link>
        </div>

        {/* Right Column: Form */}
        <div className="contact-form-wrap">
          <div className="contact-form-heading">
            <span className="section-kicker">Send an enquiry</span>
            <h2>How can we help?</h2>
            <p className="contact-form-subtitle">
              Fill in your details below and our team will get back to you shortly.
            </p>
          </div>

          {success ? (
            <div className="form-success" role="status">
              <span>
                <FiCheckCircle size={32} />
              </span>
              <h3>Thanks, your message is with us.</h3>
              <p>
                Your enquiry has been saved. You can also reach us directly by phone or WhatsApp.
              </p>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setSuccess(false)}
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-two-cols">
                <div className="form-field">
                  <label htmlFor="enquiry-name">Your name</label>
                  <input
                    id="enquiry-name"
                    autoComplete="name"
                    maxLength={100}
                    required
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g. Alex Morgan"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="enquiry-phone">Phone number</label>
                  <input
                    id="enquiry-phone"
                    autoComplete="tel"
                    type="tel"
                    maxLength={40}
                    required
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="Your best contact number"
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="enquiry-email">
                  <span>Email address</span>
                  <span className="optional-label">Optional</span>
                </label>
                <input
                  id="enquiry-email"
                  autoComplete="email"
                  type="email"
                  maxLength={254}
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div className="form-field">
                <label htmlFor="enquiry-vehicle">
                  <span>Car you’re interested in</span>
                  <span className="optional-label">Optional</span>
                </label>
                <input
                  id="enquiry-vehicle"
                  maxLength={160}
                  value={form.vehicle}
                  onChange={(e) => handleChange('vehicle', e.target.value)}
                  placeholder="Make and model"
                />
              </div>

              <div className="form-field">
                <label htmlFor="enquiry-message">Your message</label>
                <textarea
                  id="enquiry-message"
                  required
                  minLength={1}
                  maxLength={2000}
                  value={form.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Tell us what you’d like to know…"
                  rows={5}
                />
              </div>

              {error && (
                <div className="form-error" role="alert">
                  <FiAlertCircle size={18} className="form-error-icon" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn button-green contact-submit"
              >
                {loading ? (
                  <>
                    <span className="contact-submit-spinner" aria-hidden="true" />
                    <span>Sending enquiry…</span>
                  </>
                ) : (
                  <>
                    <span>Send my enquiry</span>
                    <span className="contact-submit-arrow" aria-hidden="true">→</span>
                  </>
                )}
              </button>

              <p className="form-privacy-note">
                <FiLock size={13} className="privacy-lock-icon" aria-hidden="true" />
                <span>Your enquiry is stored securely so our team can follow up with you.</span>
              </p>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
