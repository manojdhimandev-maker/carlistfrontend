import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiShield, FiCreditCard } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import VehicleCard from '../components/VehicleCard';
import QuickSearch from '../components/QuickSearch';
import { getCars } from '../services/api';

export default function Home() {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchCars = async () => {
      try {
        const res = await getCars();
        if (isMounted && res.success) {
          setCars(res.data);
        }
      } catch (err) {
        console.error('Error fetching cars for home:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCars();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchSubmit = () => {
    const searchParams = new URLSearchParams();
    if (filters.search) searchParams.set('search', filters.search);
    if (filters.fuel) searchParams.set('fuel', filters.fuel);
    navigate(`/cars?${searchParams.toString()}`);
  };

  const featuredCars = cars.filter((c) => c.featured).slice(0, 3);
  const latestCars = [...cars].slice(-3).reverse();

  return (
    <main>
      {/* 1. Hero Section */}
      <section className="home-hero">
        <img
          src="/images/dealership-hero-BwD2TsJP.jpg"
          alt="A premium car outside a contemporary dealership"
          width={1536}
          height={1024}
          className="home-hero-image"
        />
        <div className="home-hero-shade" />
        <div className="page-width home-hero-content">
          <span className="eyebrow eyebrow-light">
            <span className="eyebrow-dot" /> Fawmond Galaxy Car Supermarket
          </span>
          <h1>
            Make your next
            <br />
            <span>move a great one.</span>
          </h1>
          <p>
            Carefully selected cars. Clear, considered service.
            <br className="desktop-only" /> Find a car that feels right for you.
          </p>
          <div className="hero-actions">
            <Link to="/cars" className="btn button-green button-large">
              Browse our cars <FiArrowRight size={17} />
            </Link>
            <a href="tel:08058364295" className="hero-phone">
              Call us on <strong>08058364295</strong>
            </a>
          </div>
          <div className="hero-proof">
            <span>
              <FiShield size={16} /> Carefully selected
            </span>
            <span>
              <FiCreditCard size={16} /> Clear pricing
            </span>
            <span>
              <BsStars size={16} /> Friendly service
            </span>
          </div>
        </div>
        <div className="hero-image-caption">
          <span className="caption-line" /> A better way to find your next car
        </div>
      </section>

      {/* 2. Quick Search Band */}
      <section className="search-band" aria-label="Search cars">
        <div className="page-width search-band-inner">
          <div className="search-intro">
            <span className="section-kicker">Start your search</span>
            <h2>Find your next car</h2>
          </div>
          <QuickSearch
            compact={true}
            filters={filters}
            onChange={setFilters}
            onSubmit={handleSearchSubmit}
          />
        </div>
      </section>

      {/* 3. Featured Vehicles */}
      <section className="content-section page-width">
        <div className="section-heading-row">
          <div>
            <span className="section-kicker">Hand-picked for you</span>
            <h2>Featured vehicles</h2>
            <p>Standout cars, selected with care.</p>
          </div>
          <Link to="/cars" className="btn btn-outline desktop-only-button">
            View all cars <FiArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted-foreground)' }}>
            Loading featured cars...
          </div>
        ) : (
          <div className="vehicle-grid">
            {(featuredCars.length > 0 ? featuredCars : cars.slice(0, 3)).map((car) => (
              <VehicleCard key={car.id || car.slug || car._id} car={car} />
            ))}
          </div>
        )}

        <div className="mobile-only-link">
          <Link to="/cars">
            View all cars <FiArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 4. Brand Promise / Why Choose Us */}
      <section className="brand-promise">
        <div className="page-width promise-inner">
          <span className="section-kicker section-kicker-light">The Galaxy difference</span>
          <h2>
            Great cars. A more
            <br className="desktop-only" /> straightforward experience.
          </h2>
          <p>
            Choosing your next car should feel exciting, not complicated. Our team is here to help
            you explore your options and find the right fit.
          </p>
          <div className="promise-values">
            <div>
              <span className="promise-num">01</span>
              <h3>Carefully selected</h3>
              <p>Every vehicle is chosen and checked with care before it reaches our forecourt.</p>
            </div>
            <div>
              <span className="promise-num">02</span>
              <h3>Friendly customer service</h3>
              <p>Straightforward advice without the pressure, whenever you’re ready to talk.</p>
            </div>
            <div>
              <span className="promise-num">03</span>
              <h3>Transparent experience</h3>
              <p>Clear pricing, honest guidance and support from first enquiry to handover.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Latest Arrivals */}
      <section className="content-section page-width">
        <div className="section-heading-row">
          <div>
            <span className="section-kicker">Recently added</span>
            <h2>Latest arrivals</h2>
            <p>Fresh to our collection.</p>
          </div>
          <Link to="/cars" className="btn btn-outline desktop-only-button">
            View all cars <FiArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted-foreground)' }}>
            Loading latest arrivals...
          </div>
        ) : (
          <div className="vehicle-grid">
            {latestCars.map((car) => (
              <VehicleCard key={car.id || car.slug || car._id} car={car} />
            ))}
          </div>
        )}

        <div className="mobile-only-link">
          <Link to="/cars">
            View all cars <FiArrowRight size={16} />
          </Link>
        </div>
      </section>

      
    </main>
  );
}
