import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { BsSpeedometer2, BsFuelPump } from 'react-icons/bs';
import { TbManualGearbox } from 'react-icons/tb';
import { formatPrice, formatMileage, getImageUrl } from '../services/api';

export default function VehicleCard({ car }) {
  if (!car) return null;

  const carId = car.slug || car.id || car._id;

  return (
    <article className="vehicle-card">
      <Link to={`/cars/${carId}`} className="vehicle-card-photo-link">
        <div className="vehicle-card-photo-wrap">
          <img
            src={getImageUrl(car.image)}
            alt={`${car.year} ${car.make} ${car.model}`}
            className="vehicle-card-photo"
            width={1200}
            height={800}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/car-bmw-B_KIGLdL.jpg';
            }}
          />
          {car.featured && <span className="vehicle-ribbon">Galaxy pick</span>}
        </div>
      </Link>
      <div className="vehicle-card-copy">
        <div className="vehicle-card-title-row">
          <div>
            <span className="vehicle-year">{car.year}</span>
            <h3>
              {car.make} {car.model}
            </h3>
          </div>
          <strong className="vehicle-price">{formatPrice(car.price)}</strong>
        </div>
        <div className="vehicle-card-specs">
          <span>
            <BsSpeedometer2 aria-hidden="true" size={15} /> {formatMileage(car.mileage)}
          </span>
          <span>
            <TbManualGearbox aria-hidden="true" size={15} /> {car.transmission}
          </span>
          <span>
            <BsFuelPump aria-hidden="true" size={15} /> {car.fuel}
          </span>
        </div>
        <Link to={`/cars/${carId}`} className="vehicle-view-link">
          View details <FiArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </div>
    </article>
  );
}

