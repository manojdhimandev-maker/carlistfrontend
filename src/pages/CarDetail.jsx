import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi';
import { BsSpeedometer2, BsFuelPump } from 'react-icons/bs';
import { TbManualGearbox } from 'react-icons/tb';
import { FaWhatsapp } from 'react-icons/fa';
import { getCarById, formatPrice, formatMileage, getImageUrl } from '../services/api';

export default function CarDetail() {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchCar = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getCarById(carId);
        if (isMounted && res.success && res.data) {
          setCar(res.data);
          setActiveImage(res.data.image || (res.data.images && res.data.images[0]) || '');
        } else {
          setError('Vehicle not found');
        }
      } catch (err) {
        console.error('Error fetching car details:', err);
        setError('Failed to load vehicle details.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCar();
    return () => {
      isMounted = false;
    };
  }, [carId]);

  if (loading) {
    return (
      <main className="page-width not-found-page" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--muted-foreground)' }}>Loading vehicle details...</p>
      </main>
    );
  }

  if (error || !car) {
    return (
      <main className="page-width not-found-page" style={{ padding: '80px 20px' }}>
        <span className="section-kicker">Vehicle not found</span>
        <h1>This car is no longer listed.</h1>
        <Link to="/cars" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          Back to all cars <FiArrowRight size={16} />
        </Link>
      </main>
    );
  }

  const imagesList = car.images && car.images.length > 0 ? car.images : [car.image];
  const vehicleFullName = `${car.year} ${car.make} ${car.model}`;

  const specs = [
    { icon: BsSpeedometer2, label: 'Mileage', value: formatMileage(car.mileage) },
    { icon: TbManualGearbox, label: 'Transmission', value: car.transmission },
    { icon: BsFuelPump, label: 'Fuel type', value: car.fuel },
    { icon: FiCheck, label: 'Body style', value: car.body },
  ];

  return (
    <main className="page-width detail-page">
      <Link to="/cars" className="back-link">
        <FiArrowLeft size={16} /> Back to all cars
      </Link>

      <div className="detail-layout">
        {/* Main Column */}
        <div className="detail-main">
          <div className="detail-image-wrap">
            <img
              src={getImageUrl(activeImage || car.image)}
              alt={vehicleFullName}
              width={1200}
              height={800}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/car-bmw-B_KIGLdL.jpg';
              }}
            />
          </div>

          {imagesList.length > 1 && (
            <div className="detail-gallery">
              {imagesList.map((img, idx) => (
                <img
                  key={`${img}-${idx}`}
                  src={getImageUrl(img)}
                  alt={`${car.make} ${car.model}, view ${idx + 1}`}
                  width={1200}
                  height={800}
                  loading="lazy"
                  style={{
                    cursor: 'pointer',
                    outline: activeImage === img ? '2px solid var(--galaxy-green)' : 'none',
                  }}
                  onClick={() => setActiveImage(img)}
                />
              ))}
            </div>
          )}

          <div className="detail-description">
            <span className="section-kicker">A closer look</span>
            <h2>About this car</h2>
            <p>{car.description}</p>
            <p>
              Contact our team to ask a question, check availability or arrange a viewing.
            </p>
          </div>
        </div>

        {/* Sidebar Column */}
        <aside className="detail-sidebar">
          <span className="vehicle-year">
            {car.year} · {car.body}
          </span>
          <h1>
            {car.make}
            <br />
            {car.model}
          </h1>
          <p className="detail-price">{formatPrice(car.price)}</p>
          <p className="detail-price-caption">Clear, straightforward pricing</p>

          <div className="detail-spec-list">
            {specs.map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <span>
                  <Icon size={16} /> {label}
                </span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <Link
            to={`/contact?vehicle=${encodeURIComponent(vehicleFullName)}`}
            className="btn button-green detail-enquire-button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              textDecoration: 'none',
              width: '100%',
            }}
          >
            Enquire about this car <FiArrowRight size={16} />
          </Link>

          <a
            href={`https://wa.me/08058364295?text=${encodeURIComponent(
              `Hi, I'm interested in the ${vehicleFullName}`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline detail-whatsapp-button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textDecoration: 'none',
              width: '100%',
            }}
          >
            <FaWhatsapp size={17} /> Ask us on WhatsApp
          </a>

          <a className="detail-call-link" href="tel:08058364295">
            Call 08058364295
          </a>
        </aside>
      </div>
    </main>
  );
}

