import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './SiswaDetail.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SiswaDetail() {
  const [siswa, setSiswa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { ssbId, siswaId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSiswaDetail();
  }, [ssbId, siswaId]);

  const fetchSiswaDetail = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/ssb/${ssbId}/siswa/${siswaId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setSiswa(data.data);
      } else {
        setError(data.message || 'Gagal mengambil detail siswa');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/ssb/${ssbId}/detail`);
  };

  const handleEdit = () => {
    navigate(`/ssb/${ssbId}/siswa/${siswaId}/edit`);
  };

  const handleToggleActive = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/ssb/${ssbId}/siswa/${siswaId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !siswa.isActive
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSiswa({ ...siswa, isActive: !siswa.isActive });
      } else {
        setError(data.message || 'Gagal mengubah status');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    }
  };

  const getPositionIcon = (position) => {
    const icons = {
      'Kiper': '🥅',
      'Bek': '🛡️',
      'Gelandang': '⚙️',
      'Penyerang': '⚽'
    };
    return icons[position] || '⚽';
  };

  if (loading) {
    return (
      <div className="siswa-detail-container">
        <div className="loading">Memuat data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="siswa-detail-container">
        <div className="error-message">{error}</div>
        <button onClick={handleBack} className="back-btn">Kembali</button>
      </div>
    );
  }

  if (!siswa) return null;

  return (
    <div className="siswa-detail-container">
      <div className="siswa-detail-content">
        <div className="siswa-detail-header">
          <button onClick={handleBack} className="back-btn">← Kembali</button>
          <h1>Detail Siswa</h1>
          <button onClick={handleEdit} className="edit-btn">✏️ Edit</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="siswa-detail-grid">
          {/* Foto Siswa */}
          <div className="foto-section">
            <div className="foto-wrapper">
              <img src={siswa.foto} alt={siswa.name} className="foto-siswa" />
              <div className={`status-badge ${siswa.isActive ? 'active' : 'inactive'}`}>
                {siswa.isActive ? '✓ Aktif' : '✗ Tidak Aktif'}
              </div>
            </div>
          </div>

          {/* Info Siswa */}
          <div className="info-section">
            <div className="detail-card">
              <h3>Informasi Pribadi</h3>
              <div className="info-row">
                <span className="info-label">ID:</span>
                <span className="info-value">{siswa.id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Nama:</span>
                <span className="info-value">{siswa.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Umur:</span>
                <span className="info-value">{siswa.age} tahun</span>
              </div>
              <div className="info-row">
                <span className="info-label">Posisi:</span>
                <span className="info-value position-badge">
                  <span className="position-icon-inline">{getPositionIcon(siswa.position)}</span>
                  {siswa.position}
                </span>
              </div>
            </div>

            <div className="detail-card">
              <h3>Status & Informasi SSB</h3>
              
              <div className="info-row">
                <span className="info-label">Status Aktif:</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={siswa.isActive}
                    onChange={handleToggleActive}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="info-row">
                <span className="info-label">ID SSB:</span>
                <span className="info-value">{siswa.ssb_id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Tanggal Daftar:</span>
                <span className="info-value">
                  {new Date(siswa.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Waktu Daftar:</span>
                <span className="info-value">
                  {new Date(siswa.created_at).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SiswaDetail;
