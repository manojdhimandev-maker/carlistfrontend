import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiUpload,
  FiX,
  FiSave,
  FiLogOut,
  FiMail,
  FiCheck,
  FiAlertCircle,
} from 'react-icons/fi';
import {
  getCars,
  createCar,
  updateCar,
  deleteCar,
  uploadImages,
  getEnquiries,
  deleteEnquiry,
  logoutAdmin,
  formatPrice,
  formatMileage,
  getImageUrl,
} from '../services/api';
import Pagination from '../components/Pagination';

const ADMIN_CARS_PER_PAGE = 8;
const ADMIN_ENQUIRIES_PER_PAGE = 8;

const INITIAL_FORM = {
  make: '',
  model: '',
  year: 2022,
  mileage: 0,
  transmission: 'Automatic',
  fuel: 'Petrol',
  price: '',
  body: 'Saloon',
  description: '',
  featured: false,
  image: '',
  images: [],
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Tab state: 'cars' | 'enquiries'
  const [activeTab, setActiveTab] = useState('cars');

  // Cars State
  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [currentPageCars, setCurrentPageCars] = useState(1);

  // Enquiries State
  const [enquiries, setEnquiries] = useState([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [currentPageEnquiries, setCurrentPageEnquiries] = useState(1);

  // Modal / Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [statusMessage, setStatusMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // File Upload State
  const fileInputRef = useRef(null);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Fetch cars from DB
  const loadCars = async () => {
    setLoadingCars(true);
    try {
      const res = await getCars();
      if (res.success) {
        setCars(res.data);
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
    } finally {
      setLoadingCars(false);
    }
  };

  // Fetch enquiries from DB
  const loadEnquiries = async () => {
    setLoadingEnquiries(true);
    try {
      const res = await getEnquiries();
      if (res.success) {
        setEnquiries(res.data);
      }
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    } finally {
      setLoadingEnquiries(false);
    }
  };

  useEffect(() => {
    loadCars();
    loadEnquiries();
  }, []);

  // Prevent background scrolling and support Escape key when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setIsModalOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isModalOpen]);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  // Open modal for new vehicle
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ ...INITIAL_FORM });
    setImageUrlInput('');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for editing existing vehicle
  const handleOpenEdit = (car) => {
    setEditingId(car.slug || car.id || car._id);
    setFormData({
      make: car.make || '',
      model: car.model || '',
      year: car.year || 2022,
      mileage: car.mileage || 0,
      transmission: car.transmission || 'Automatic',
      fuel: car.fuel || 'Petrol',
      price: car.price !== undefined && car.price !== null ? String(car.price) : '',
      body: car.body || 'Saloon',
      description: car.description || '',
      featured: !!car.featured,
      image: car.image || '',
      images: car.images && car.images.length > 0 ? car.images : [car.image].filter(Boolean),
    });
    setImageUrlInput('');
    setFormError('');
    setIsModalOpen(true);
  };

  // Delete vehicle with confirmation
  const handleDeleteCar = async (car) => {
    // const confirm = window.confirm(
    //   `Are you sure you want to delete ${car.year} ${car.make} ${car.model} from MongoDB?`
    // );
    // if (!confirm) return;

    try {
      const targetId = car.slug || car.id || car._id;
      const res = await deleteCar(targetId);
      if (res.success) {
        setCars((prev) => prev.filter((c) => (c.slug || c.id || c._id) !== targetId));
        setStatusMessage(`Deleted ${car.make} ${car.model} successfully.`);
      }
    } catch (err) {
      console.error('Error deleting car:', err);
      alert('Failed to delete vehicle: ' + (err.response?.data?.message || err.message));
    }
  };

  // Delete enquiry
  const handleDeleteEnquiry = async (enquiryId) => {
    // if (!window.confirm('Delete this customer enquiry record?')) return;
    try {
      const res = await deleteEnquiry(enquiryId);
      if (res.success) {
        setEnquiries((prev) => prev.filter((e) => e._id !== enquiryId));
      }
    } catch (err) {
      console.error('Error deleting enquiry:', err);
      alert('Failed to delete enquiry.');
    }
  };

  // Handle file uploads (multiple images)
  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_SIZE_MB = 20;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];

    const uploadData = new FormData();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        setFormError(`"${file.name}" is not supported. Use JPEG, PNG, WEBP, or AVIF.`);
        return;
      }

      // Validate size — 20 MB max
      if (file.size > MAX_SIZE_BYTES) {
        const sizeMB = (file.size / 1024 / 1024).toFixed(1);
        setFormError(
          `"${file.name}" is ${sizeMB} MB. Maximum allowed size is ${MAX_SIZE_MB} MB per image.`
        );
        return;
      }

      uploadData.append('images', file);
    }

    try {
      setFormError('');
      const res = await uploadImages(uploadData);
      if (res.success && res.data) {
        const uploadedUrls = res.data;
        setFormData((prev) => {
          const combined = [...prev.images, ...uploadedUrls];
          return {
            ...prev,
            images: combined,
            image: prev.image || combined[0],
          };
        });
      } else {
        setFormError(res.message || 'Upload failed. Please try again.');
      }
    } catch (err) {
      console.error('File upload error:', err);
      // Show the server error message if available, otherwise generic
      const serverMsg = err?.response?.data?.message || err?.message;
      setFormError(serverMsg || 'Failed to upload image(s). Please try again.');
    }
  };

  // Add custom image URL
  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;
    const url = imageUrlInput.trim();
    setFormData((prev) => {
      const updated = [...prev.images, url];
      return {
        ...prev,
        images: updated,
        image: prev.image || url,
      };
    });
    setImageUrlInput('');
  };

  // Remove individual image
  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => {
      const updated = prev.images.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updated,
        image: updated.length > 0 ? updated[0] : '',
      };
    });
  };

  // Submit Add or Edit Car
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.make.trim() || !formData.model.trim()) {
      setFormError('Make and model are required.');
      return;
    }
    if (formData.price === '' || isNaN(Number(formData.price)) || Number(formData.price) < 1) {
      setFormError('Price must be greater than £0.');
      return;
    }
    if (formData.images.length === 0 && !formData.image) {
      setFormError('Please add at least one vehicle image.');
      return;
    }

    const payload = {
      ...formData,
      make: formData.make.trim(),
      model: formData.model.trim(),
      year: Number(formData.year),
      mileage: Number(formData.mileage),
      price: Number(formData.price),
      description: formData.description.trim(),
      image: formData.image || formData.images[0],
      images: formData.images.length > 0 ? formData.images : [formData.image],
    };

    setSaving(true);
    try {
      if (editingId) {
        const res = await updateCar(editingId, payload);
        if (res.success) {
          setStatusMessage(`Updated ${payload.make} ${payload.model} successfully.`);
          setIsModalOpen(false);
          await loadCars();
        }
      } else {
        const res = await createCar(payload);
        if (res.success) {
          setStatusMessage(`Added ${payload.make} ${payload.model} successfully.`);
          setIsModalOpen(false);
          setCurrentPageCars(1);
          await loadCars();
        }
      }
    } catch (err) {
      console.error('Error saving car:', err);
      setFormError(err.response?.data?.message || 'Error saving vehicle to database.');
    } finally {
      setSaving(false);
    }
  };

  // Pagination calculations & clamping
  const totalCarPages = Math.max(1, Math.ceil(cars.length / ADMIN_CARS_PER_PAGE));
  const totalEnquiryPages = Math.max(1, Math.ceil(enquiries.length / ADMIN_ENQUIRIES_PER_PAGE));

  useEffect(() => {
    if (currentPageCars > totalCarPages) {
      setCurrentPageCars(totalCarPages);
    }
  }, [cars.length, totalCarPages, currentPageCars]);

  useEffect(() => {
    if (currentPageEnquiries > totalEnquiryPages) {
      setCurrentPageEnquiries(totalEnquiryPages);
    }
  }, [enquiries.length, totalEnquiryPages, currentPageEnquiries]);

  const startIndexCars = (currentPageCars - 1) * ADMIN_CARS_PER_PAGE;
  const paginatedCars = cars.slice(startIndexCars, startIndexCars + ADMIN_CARS_PER_PAGE);

  const startIndexEnquiries = (currentPageEnquiries - 1) * ADMIN_ENQUIRIES_PER_PAGE;
  const paginatedEnquiries = enquiries.slice(startIndexEnquiries, startIndexEnquiries + ADMIN_ENQUIRIES_PER_PAGE);

  return (
    <main className="admin-page page-width">
      {/* 1. Header Row */}
      <div className="admin-heading-row">
        <div>
          <span className="section-kicker">Live Database Workspace</span>
          <h1>Manage your cars</h1>
          <p>Add, edit or remove vehicle listings directly in MongoDB.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn button-green"
            onClick={handleOpenAdd}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' , padding: "revert" }}
          >
            <FiPlus size={17} /> Add a car
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* 2. Notice Box */}
      <div className="admin-notice">
        <strong>MongoDB Protected Panel:</strong>
        <span>
          Authenticated as Admin. All inventory and enquiry changes update MongoDB in real-time
          and reflect across public pages immediately.
        </span>
      </div>

      {/* 3. Status Message Banner */}
      {statusMessage && (
        <p className="admin-message" role="status">
          {statusMessage}
        </p>
      )}

      {/* 4. Tab Switcher */}
      <div className="admin-tabs">
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'cars' ? 'active' : ''}`}
          onClick={() => setActiveTab('cars')}
        >
          Vehicle Inventory <span className="admin-tab-badge">{cars.length}</span>
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'enquiries' ? 'active' : ''}`}
          onClick={() => setActiveTab('enquiries')}
        >
          Customer Enquiries <span className="admin-tab-badge">{enquiries.length}</span>
        </button>
      </div>

      {/* 5. Cars Tab Content */}
      {activeTab === 'cars' && (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Year</th>
                  <th>Mileage</th>
                  <th>Fuel</th>
                  <th>Price</th>
                  <th>Galaxy Pick</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingCars ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>
                      Loading cars from MongoDB...
                    </td>
                  </tr>
                ) : cars.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>
                      No vehicles found in database. Click "Add a car" to create your first listing.
                    </td>
                  </tr>
                ) : (
                  paginatedCars.map((car) => (
                    <tr key={car.slug || car.id || car._id}>
                      <td>
                        <div className="admin-car-cell">
                          <img
                            src={getImageUrl(car.image)}
                            alt=""
                            width={96}
                            height={64}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/car-bmw-B_KIGLdL.jpg';
                            }}
                          />
                          <span>
                            <strong>{car.make}</strong>
                            <small>{car.model}</small>
                          </span>
                        </div>
                      </td>
                      <td>{car.year}</td>
                      <td>{formatMileage(car.mileage)}</td>
                      <td>{car.fuel}</td>
                      <td>
                        <strong className="admin-price">{formatPrice(car.price)}</strong>
                      </td>
                      <td>
                        {car.featured ? (
                          <span className="admin-badge-pick">Galaxy pick</span>
                        ) : (
                          <span className="admin-badge-standard">Standard</span>
                        )}
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <button
                            type="button"
                            className="btn btn-outline admin-action-btn-edit"
                            onClick={() => handleOpenEdit(car)}
                          >
                            <FiEdit size={14} /> Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost admin-action-btn-delete"
                            onClick={() => handleDeleteCar(car)}
                            title="Delete Vehicle"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {cars.length > 0 && (
            <Pagination
              currentPage={currentPageCars}
              totalPages={totalCarPages}
              totalRecords={cars.length}
              pageSize={ADMIN_CARS_PER_PAGE}
              onPageChange={(page) => setCurrentPageCars(page)}
              itemName="vehicles"
            />
          )}
          <p className="admin-storage-note" style={{ marginTop: '14px', fontSize: '13px' }}>
            Database has {cars.length} {cars.length === 1 ? 'car' : 'cars'}.
          </p>
        </>
      )}

      {/* 6. Enquiries Tab Content */}
      {activeTab === 'enquiries' && (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Car Interested In</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loadingEnquiries ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>
                      Loading customer enquiries...
                    </td>
                  </tr>
                ) : enquiries.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>
                      No customer enquiries received yet. Messages submitted from the Contact page
                      will appear here.
                    </td>
                  </tr>
                ) : (
                  paginatedEnquiries.map((enq) => (
                    <tr key={enq._id}>
                      <td>
                        <strong className="admin-enquiry-name">{enq.name}</strong>
                      </td>
                      <td>
                        <a href={`tel:${enq.phone}`} className="admin-enquiry-phone">{enq.phone}</a>
                      </td>
                      <td>{enq.email || <em style={{ color: '#94a3b8' }}>None</em>}</td>
                      <td>
                        <strong className="admin-enquiry-vehicle">{enq.vehicle || <em style={{ color: '#94a3b8' }}>General</em>}</strong>
                      </td>
                      <td className="admin-enquiry-msg">
                        {enq.message}
                      </td>
                      <td className="admin-enquiry-date">
                        {new Date(enq.createdAt).toLocaleDateString('en-GB')}
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <button
                            type="button"
                            className="btn btn-ghost admin-action-btn-delete"
                            onClick={() => handleDeleteEnquiry(enq._id)}
                            title="Delete Enquiry"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {enquiries.length > 0 && (
            <Pagination
              currentPage={currentPageEnquiries}
              totalPages={totalEnquiryPages}
              totalRecords={enquiries.length}
              pageSize={ADMIN_ENQUIRIES_PER_PAGE}
              onPageChange={(page) => setCurrentPageEnquiries(page)}
              itemName="enquiries"
            />
          )}
        </>
      )}

      {/* 7. Modal Dialog for Add / Edit Car */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-header">
              <div className="modal-header-text">
                <span className="modal-kicker-badge">
                  {editingId ? 'Vehicle Management' : 'Inventory Management'}
                </span>
                <h2 id="modal-title">{editingId ? 'Edit Vehicle Listing' : 'Add New Vehicle'}</h2>
                <p className="modal-subtitle">
                  {editingId
                    ? 'Update the specifications, pricing, and images for this listing.'
                    : 'Fill in the specifications, pricing, and upload images to add to the inventory.'}
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close dialog"
                title="Close (Esc)"
              >
                <FiX size={19} />
              </button>
            </div>

            {formError && (
              <div className="modal-error-banner" role="alert">
                <FiAlertCircle size={18} className="modal-error-icon" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div className="admin-fields-grid">
                <div className="form-field">
                  <label htmlFor="car-make">
                    Make <span className="field-required">*</span>
                  </label>
                  <input
                    id="car-make"
                    required
                    maxLength={50}
                    value={formData.make}
                    onChange={(e) =>
                      setFormData({ ...formData, make: e.target.value })
                    }
                    placeholder="e.g. BMW"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="car-model">
                    Model <span className="field-required">*</span>
                  </label>
                  <input
                    id="car-model"
                    required
                    maxLength={100}
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    placeholder="e.g. 3 Series 320d M Sport"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="car-year">
                    Year <span className="field-required">*</span>
                  </label>
                  <input
                    id="car-year"
                    type="number"
                    min="1900"
                    max="2035"
                    required
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="car-mileage">
                    Mileage (miles) <span className="field-required">*</span>
                  </label>
                  <input
                    id="car-mileage"
                    type="number"
                    min="0"
                    required
                    value={formData.mileage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mileage: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="car-transmission">Transmission</label>
                  <select
                    id="car-transmission"
                    value={formData.transmission}
                    onChange={(e) =>
                      setFormData({ ...formData, transmission: e.target.value })
                    }
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="car-fuel">Fuel Type</label>
                  <select
                    id="car-fuel"
                    value={formData.fuel}
                    onChange={(e) =>
                      setFormData({ ...formData, fuel: e.target.value })
                    }
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="car-price">
                    Price (£) <span className="field-required">*</span>
                  </label>
                  <input
                    id="car-price"
                    type="number"
                    min="1"
                    required
                   value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="e.g. 18950"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="car-body">Body Style</label>
                  <select
                    id="car-body"
                    value={formData.body}
                    onChange={(e) =>
                      setFormData({ ...formData, body: e.target.value })
                    }
                  >
                    <option value="Saloon">Saloon</option>
                    <option value="Estate">Estate</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Convertible">Convertible</option>
                  </select>
                </div>

                {/* Description */}
                <div className="form-field admin-description-field">
                  <label htmlFor="car-description">
                    Description <span className="field-required">*</span>
                  </label>
                  <textarea
                    id="car-description"
                    rows="3"
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Brief description of vehicle condition, styling, specifications and features."
                  />
                </div>

                {/* Featured Toggle Card */}
                <div className="admin-feature-toggle-card">
                  <label className="admin-feature-toggle-label" htmlFor="car-featured-toggle">
                    <input
                      id="car-featured-toggle"
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                    />
                    <div className="toggle-switch-ui" aria-hidden="true"></div>
                    <div className="toggle-text-group">
                      <span className="toggle-title">Feature as Galaxy Pick</span>
                      <span className="toggle-desc">
                        Highlights this vehicle prominently in the featured collection on the homepage.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Images Section */}
                <div className="form-field admin-description-field admin-images-section">
                  <div className="images-section-header">
                    <div>
                      <label className="images-section-title">Vehicle Images</label>
                      <span className="images-section-hint">
                        First image is used as the primary cover thumbnail.
                      </span>
                    </div>
                    {formData.images.length > 0 && (
                      <span className="images-count-badge">
                        {formData.images.length} {formData.images.length === 1 ? 'image' : 'images'}
                      </span>
                    )}
                  </div>

                  {/* Thumbnail gallery preview */}
                  {formData.images.length > 0 && (
                    <div className="image-preview-grid">
                      {formData.images.map((img, idx) => (
                        <div
                          key={idx}
                          className={`image-preview-item ${idx === 0 ? 'primary-preview' : ''}`}
                        >
                          <img src={getImageUrl(img)} alt={`Preview ${idx + 1}`} />
                          <button
                            type="button"
                            className="remove-img-btn"
                            onClick={() => handleRemoveImage(idx)}
                            title="Remove image"
                            aria-label={`Remove image ${idx + 1}`}
                          >
                            <FiX size={12} />
                          </button>
                          {idx === 0 && <span className="primary-badge">Cover</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* File upload trigger */}
                  <div className="image-uploader-controls">
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      className="modal-upload-btn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FiUpload size={15} /> Upload image files
                    </button>

                    <span className="image-uploader-divider">
                      or add image by URL:
                    </span>
                  </div>

                  {/* Add Image URL bar */}
                  <div className="image-url-bar">
                    <input
                      type="url"
                      placeholder="Paste image URL (e.g. /images/car-bmw-B_KIGLdL.jpg or https://...)"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                    />
                    <button
                      type="button"
                      className="modal-add-url-btn"
                      onClick={handleAddImageUrl}
                    >
                      Add URL
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="admin-form-actions">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="modal-submit-btn"
                >
                  {saving ? (
                    <>
                      <span className="modal-spinner" aria-hidden="true"></span>
                      Saving to MongoDB…
                    </>
                  ) : (
                    <>
                      <FiSave size={16} /> Save listing
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

