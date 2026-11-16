import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiMail } from 'react-icons/fi';
import { loginAdmin } from '../services/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@fawmondgalaxy.co.uk');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginAdmin({ email, password });
      if (res.success && res.token) {
        localStorage.setItem('adminToken', res.token);
        localStorage.setItem('adminUser', JSON.stringify(res.admin));
        navigate('/admin');
      } else {
        setError(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError(
        err.response?.data?.message || 'Authentication failed. Please verify credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-wrap">
      <div className="admin-login-card">
        <span className="section-kicker">Security Portal</span>
        <h1>Admin Sign In</h1>
        <p>Enter your credentials to access vehicle inventory management.</p>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#fee2e2',
              border: '1px solid #f87171',
              borderRadius: '6px',
              color: '#b91c1c',
              fontSize: '13px',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-field">
            <label htmlFor="admin-email" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
              <FiMail size={14} /> Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@fawmondgalaxy.co.uk"
            />
          </div>

          <div className="form-field">
            <label
              htmlFor="admin-password"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}
            >
              <FiLock size={14} /> Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn button-green login-submit-btn"
          >
            {loading ? 'Authenticating…' : 'Sign in to Dashboard'}
          </button>
        </form>

        {/* <div style={{ marginTop: '20px', fontSize: '11px', color: 'var(--muted-foreground)', textAlign: 'center' }}>
          Default seed credentials: <strong>admin@fawmondgalaxy.co.uk</strong> / <strong>admin123</strong>
        </div> */}
      </div>
    </main>
  );
}

