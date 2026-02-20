import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SSBCreate.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SSBCreate() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/ssb`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name })
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Gagal membuat SSB');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="ssb-create-container">
      <div className="ssb-create-content">
        <div className="ssb-create-header">
          <button onClick={handleBack} className="back-btn">← Kembali</button>
          <h1>Tambah SSB Baru</h1>
        </div>

        <form onSubmit={handleSubmit} className="ssb-create-form">
          <div className="form-group">
            <label htmlFor="name">Nama SSB</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama SSB"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SSBCreate;
