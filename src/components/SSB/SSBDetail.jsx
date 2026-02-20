import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './SSBDetail.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SSBDetail() {
  const [ssb, setSSB] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSSBDetail();
  }, [id]);

  const fetchSSBDetail = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/ssb/${id}/detail`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setSSB(data.data);
      } else {
        setError(data.message || 'Gagal mengambil detail SSB');
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
      <div className="ssb-detail-container">
        <div className="loading">Memuat data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ssb-detail-container">
        <div className="error-message">{error}</div>
        <button onClick={handleBack} className="back-btn">Kembali</button>
      </div>
    );
  }

  if (!ssb) return null;

  return (
    <div className="ssb-detail-container">
      <div className="ssb-detail-content">
        <div className="ssb-detail-header">
          <button onClick={handleBack} className="back-btn">← Kembali</button>
          <h1>{ssb.name}</h1>
        </div>

        <div className="ssb-detail-grid">
          {/* Info Dasar */}
          <div className="detail-card">
            <h3>Informasi Dasar</h3>
            <div className="info-row">
              <span className="info-label">ID:</span>
              <span className="info-value">{ssb.id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Nama SSB:</span>
              <span className="info-value">{ssb.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Dibuat:</span>
              <span className="info-value">
                {new Date(ssb.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          {/* Statistik Siswa */}
          <div className="detail-card">
            <h3>Statistik Siswa</h3>
            <div className="stat-box">
              <div className="stat-big">
                <span className="stat-number">{ssb.jumlah_siswa}</span>
                <span className="stat-text">Total Siswa</span>
              </div>
            </div>
          </div>

          {/* Statistik Posisi */}
          <div className="detail-card full-width">
            <h3>Statistik Posisi</h3>
            <div className="position-grid">
              <div className="position-card">
                <span className="position-icon">🥅</span>
                <span className="position-name">Kiper</span>
                <span className="position-count">{ssb.statistik_posisi.kiper}</span>
              </div>
              <div className="position-card">
                <span className="position-icon">🛡️</span>
                <span className="position-name">Bek</span>
                <span className="position-count">{ssb.statistik_posisi.bek}</span>
              </div>
              <div className="position-card">
                <span className="position-icon">⚙️</span>
                <span className="position-name">Gelandang</span>
                <span className="position-count">{ssb.statistik_posisi.gelandang}</span>
              </div>
              <div className="position-card">
                <span className="position-icon">⚽</span>
                <span className="position-name">Penyerang</span>
                <span className="position-count">{ssb.statistik_posisi.penyerang}</span>
              </div>
            </div>
          </div>

          {/* Daftar Siswa */}
          <div className="detail-card full-width">
            <div className="siswa-header">
              <h3>Daftar Siswa</h3>
              <button onClick={() => navigate(`/ssb/${id}/siswa/create`)} className="add-siswa-btn">
                + Tambah Siswa
              </button>
            </div>
            {ssb.siswa.length === 0 ? (
              <div className="empty-siswa">
                <p>Belum ada siswa terdaftar di SSB ini</p>
              </div>
            ) : (
              <div className="siswa-list">
                {ssb.siswa.map((siswa, index) => (
                  <div 
                    key={index} 
                    className="siswa-item clickable"
                    onClick={() => navigate(`/ssb/${id}/siswa/${siswa.id}`)}
                  >
                    <div className="siswa-foto-wrapper">
                      <img src={siswa.foto} alt={siswa.name} className="siswa-foto" />
                      <div className={`siswa-status-badge ${siswa.isActive ? 'active' : 'inactive'}`}>
                        {siswa.isActive ? '✓' : '✗'}
                      </div>
                    </div>
                    <div className="siswa-info">
                      <span className="siswa-name">{siswa.name}</span>
                      <div className="siswa-meta">
                        <span className="siswa-age">{siswa.age} tahun</span>
                        <span className="siswa-position">
                          <span className="position-icon-small">{getPositionIcon(siswa.position)}</span>
                          {siswa.position}
                        </span>
                      </div>
                    </div>
                    <span className="view-arrow">→</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SSBDetail;
