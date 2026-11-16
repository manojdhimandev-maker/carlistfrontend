import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function FloatingWhatsApp() {
  return (
    <a
      className="floating-whatsapp"
      href="https://wa.me/08058364295"
      target="_blank"
      rel="noreferrer"
      aria-label="Message Fawmond Galaxy on WhatsApp"
      title="Message us on WhatsApp"
    >
      <FaWhatsapp aria-hidden="true" size={24} />
    </a>
  );
}

