import React from 'react';
import { FiSearch, FiSliders } from 'react-icons/fi';

const MAKES = ['BMW', 'Audi', 'Volvo', 'Mercedes-Benz'];
const FUELS = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const YEARS = [2024, 2023, 2022, 2021, 2020, 2019];

export default function QuickSearch({
  filters = {},
  onChange,
  onSubmit,
  compact = false,
}) {
  const update = (key, value) => {
    onChange && onChange({ ...filters, [key]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit();
  };

  return (
    <form
      className={compact ? 'filter-bar compact-filter-bar' : 'filter-bar'}
      onSubmit={handleSubmit}
    >
      <label className="filter-field filter-search">
        <span>Search</span>
        <span className="filter-input-icon">
          <FiSearch aria-hidden="true" size={17} />
          <input
            type="text"
            value={filters.search ?? ''}
            onChange={(e) => update('search', e.target.value)}
            placeholder="Make, model or keyword"
          />
        </span>
      </label>

      {!compact && (
        <label className="filter-field">
          <span>Make</span>
          <select
            value={filters.make ?? ''}
            onChange={(e) => update('make', e.target.value)}
          >
            <option value="">Any make</option>
            {MAKES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="filter-field">
        <span>Fuel</span>
        <select
          value={filters.fuel ?? ''}
          onChange={(e) => update('fuel', e.target.value)}
        >
          <option value="">Any fuel</option>
          {FUELS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </label>

      {!compact && (
        <>
          <label className="filter-field">
            <span>Up to price</span>
            <select
              value={filters.maxPrice ?? ''}
              onChange={(e) => update('maxPrice', e.target.value)}
            >
              <option value="">Any price</option>
              <option value="15000">£15,000</option>
              <option value="25000">£25,000</option>
              <option value="35000">£35,000</option>
              <option value="50000">£50,000</option>
            </select>
          </label>

          <label className="filter-field">
            <span>Year from</span>
            <select
              value={filters.minYear ?? ''}
              onChange={(e) => update('minYear', e.target.value)}
            >
              <option value="">Any year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field">
            <span>Max miles</span>
            <select
              value={filters.maxMileage ?? ''}
              onChange={(e) => update('maxMileage', e.target.value)}
            >
              <option value="">Any mileage</option>
              <option value="20000">20,000 miles</option>
              <option value="30000">30,000 miles</option>
              <option value="50000">50,000 miles</option>
              <option value="75000">75,000 miles</option>
            </select>
          </label>
        </>
      )}

      {compact && (
        <button type="submit" className="button-green filter-submit">
          <FiSliders size={16} /> Find cars
        </button>
      )}
    </form>
  );
}

