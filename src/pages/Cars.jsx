import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSliders, FiArrowRight } from 'react-icons/fi';
import VehicleCard from '../components/VehicleCard';
import QuickSearch from '../components/QuickSearch';
import Pagination from '../components/Pagination';
import { getCars } from '../services/api';

const CARS_PER_PAGE = 6;

export default function Cars() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize filters from searchParams
  const [filters, setFilters] = useState(() => ({
    search: searchParams.get('search') || '',
    make: searchParams.get('make') || '',
    fuel: searchParams.get('fuel') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minYear: searchParams.get('minYear') || '',
    maxMileage: searchParams.get('maxMileage') || '',
  }));

  // Update URL search parameters when filters change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key]) params.set(key, newFilters[key]);
    });
    setSearchParams(params, { replace: true });
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      search: '',
      make: '',
      fuel: '',
      maxPrice: '',
      minYear: '',
      maxMileage: '',
    };
    setFilters(emptyFilters);
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
  };

  // Fetch cars whenever filters change
  useEffect(() => {
    let isMounted = true;
    const fetchFilteredCars = async () => {
      setLoading(true);
      try {
        const res = await getCars(filters);
        if (isMounted && res.success) {
          setCars(res.data);
        }
      } catch (err) {
        console.error('Error fetching cars:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFilteredCars();
    return () => {
      isMounted = false;
    };
  }, [filters]);

  // Reset to page 1 on filter changes & ensure page is in bounds
  const totalPages = Math.max(1, Math.ceil(cars.length / CARS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [cars.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * CARS_PER_PAGE;
  const paginatedCars = cars.slice(startIndex, startIndex + CARS_PER_PAGE);

  return (
    <main>
      {/* 1. Page Banner */}
      <section className="page-banner">
        <div className="page-width page-banner-content">
          <span className="eyebrow">
            <span className="eyebrow-dot" /> The Fawmond Galaxy collection
          </span>
          <h1>Find a car that fits.</h1>
          <p>Explore our current collection and narrow the search to what matters to you.</p>
        </div>
      </section>

      {/* 2. Inventory Section */}
      <section className="inventory-section page-width">
        <div className="inventory-topline">
          <div>
            <span className="section-kicker">Available now</span>
            <h2>Our cars</h2>
          </div>
          <p className="results-count">
            <strong>{cars.length}</strong> {cars.length === 1 ? 'car' : 'cars'} to explore
          </p>
        </div>

        <div className="inventory-layout">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar" aria-label="Filter cars">
            <div className="filter-sidebar-heading">
              <FiSliders size={17} />
              <h3>Refine your search</h3>
            </div>
            <QuickSearch
              compact={false}
              filters={filters}
              onChange={handleFilterChange}
            />
            <button
              type="button"
              onClick={handleClearFilters}
              className="clear-filter-button"
            >
              Clear all filters
            </button>
          </aside>

          {/* Results Grid / Empty State */}
          <div className="inventory-results">
            {loading ? (
              <div
                style={{
                  padding: '60px',
                  textAlign: 'center',
                  color: 'var(--muted-foreground)',
                }}
              >
                Loading matching vehicles...
              </div>
            ) : cars.length > 0 ? (
              <>
                <div className="vehicle-grid inventory-grid">
                  {paginatedCars.map((car) => (
                    <VehicleCard key={car.id || car.slug || car._id} car={car} />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalRecords={cars.length}
                  pageSize={CARS_PER_PAGE}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    const topElement = document.querySelector('.inventory-topline');
                    if (topElement) {
                      topElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  itemName="cars"
                />
              </>
            ) : (
              <div className="empty-results">
                <span className="empty-results-icon">
                  <FiSliders size={22} />
                </span>
                <h3>No cars match those filters</h3>
                <p>Try adjusting your search to see more of our collection.</p>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleClearFilters}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Help Callout */}
        <div className="inventory-help">
          <span>Looking for something specific?</span>
          <Link to="/contact">
            Tell us what you need <FiArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}

