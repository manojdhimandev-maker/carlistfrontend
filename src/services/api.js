import axios from 'axios';

// ─── Backend base URL ───────────────────────────────────────────────────────
// In development: leave VITE_API_URL empty → Vite proxy forwards /api to localhost:5000
// In production:  set VITE_API_URL=https://your-backend.onrender.com
const rawUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
export const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl.slice(0, -4) : rawUrl;

// ─── Axios instance ──────────────────────────────────────────────────────────
const API = axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL}/api` : '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Attach admin token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Image URL resolver ──────────────────────────────────────────────────────
// Handles: /uploads/... paths (from Render backend), /images/... (local public),
//          and full https:// URLs (external images)
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/car-bmw-B_KIGLdL.jpg';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath; // already a full URL
  }
  if (imagePath.startsWith('/uploads') && API_BASE_URL) {
    return `${API_BASE_URL}${imagePath}`; // prepend Render backend domain
  }
  return imagePath; // local /images/... served from public folder
};

// ─── Formatters ──────────────────────────────────────────────────────────────
export const formatPrice = (amount) => {
  if (amount === undefined || amount === null) return '£0';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatMileage = (miles) => {
  if (miles === undefined || miles === null) return '0 miles';
  return `${new Intl.NumberFormat('en-GB').format(miles)} miles`;
};

// ─── Cars API ────────────────────────────────────────────────────────────────
export const getCars = async (params = {}) => {
  const cleanParams = {};
  Object.keys(params).forEach((key) => {
    if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
      cleanParams[key] = params[key];
    }
  });
  const res = await API.get('/cars', { params: cleanParams });
  return res.data;
};

export const getCarById = async (id) => {
  const res = await API.get(`/cars/${id}`);
  return res.data;
};

export const createCar = async (carData) => {
  const res = await API.post('/cars', carData);
  return res.data;
};

export const updateCar = async (id, carData) => {
  const res = await API.put(`/cars/${id}`, carData);
  return res.data;
};

export const deleteCar = async (id) => {
  const res = await API.delete(`/cars/${id}`);
  return res.data;
};

export const uploadImages = async (formData) => {
  const res = await API.post('/cars/upload-images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// ─── Enquiries API ───────────────────────────────────────────────────────────
export const submitEnquiry = async (enquiryData) => {
  const res = await API.post('/enquiries', enquiryData);
  return res.data;
};

export const getEnquiries = async () => {
  const res = await API.get('/enquiries');
  return res.data;
};

export const deleteEnquiry = async (id) => {
  const res = await API.delete(`/enquiries/${id}`);
  return res.data;
};

// ─── Admin Auth API ──────────────────────────────────────────────────────────
export const loginAdmin = async (credentials) => {
  const res = await API.post('/admin/login', credentials);
  return res.data;
};

export const logoutAdmin = async () => {
  const res = await API.post('/admin/logout');
  return res.data;
};

export const getAdminMe = async () => {
  const res = await API.get('/admin/me');
  return res.data;
};

export default API;
