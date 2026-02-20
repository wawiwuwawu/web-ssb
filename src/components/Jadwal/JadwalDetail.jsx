import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './JadwalDetail.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function JadwalDetail() {
  const [jadwal, setJadwal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id, jadwalId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJadwalDetail();
  }, [jadwalId]);

  const fetchJadwalDetail = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/ssb/${id}/jadwal-latihan/${jadwalId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setJadwal(data.data);
      } else {
        setError(data.message || 'Gagal mengambil detail jadwal');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/ssb/${id}/detail`);
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
      <div className="jadwal-detail-container">
        <div className="loading">Memuat data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jadwal-detail-container">
        <div className="error-message">{error}</div>
        <button onClick={handleBack} className="back-btn">Kembali</button>
      </div>
    );
  }

  if (!jadwal) return null;

  return (
    <div className="jadwal-detail-container">
      <div className="jadwal-detail-content">
        <div className="jadwal-detail-header">
          <button onClick={handleBack} className="back-btn">← Kembali</button>
          <h1>Detail Jadwal Latihan</h1>
        </div>

        <div className="jadwal-detail-grid">
          {/* Info Jadwal */}
          <div className="detail-card jadwal-info-card">
            <div className="jadwal-info-header">
              <div className="day-badge">{jadwal.day}</div>
              <div className="age-badge-large">{jadwal.age_grouping}</div>
            </div>
            
            <div className="time-info">
              <div className="time-icon">🕒</div>
              <div className="time-details">
                <div className="time-label">Waktu Latihan</div>
                <div className="time-value">
                  {jadwal.time_start.substring(0, 5)} - {jadwal.time_end.substring(0, 5)}
                </div>
              </div>
            </div>

            <div className="jadwal-meta">
              <div className="meta-item">
                <span className="meta-label">Dibuat:</span>
                <span className="meta-value">
                  {new Date(jadwal.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Statistik Siswa */}
          <div className="detail-card stats-card">
            <h3>Statistik</h3>
            <div className="stat-box">
              <div className="stat-big">
                <span className="stat-number">{jadwal.jumlah_siswa}</span>
                <span className="stat-text">Siswa Terdaftar</span>
              </div>
            </div>
          </div>

          {/* Daftar Siswa */}
          <div className="detail-card full-width">
            <div className="siswa-header">
              <h3>Daftar Siswa Terdaftar</h3>
              <div className="siswa-count-badge">{jadwal.jumlah_siswa} Siswa</div>
            </div>
            
            {jadwal.siswa.length === 0 ? (
              <div className="empty-siswa">
                <p>Belum ada siswa yang terdaftar di jadwal ini</p>
              </div>
            ) : (
              <div className="siswa-grid">
                {jadwal.siswa.map((siswa) => (
                  <div key={siswa.id} className="siswa-card">
                    <div className="siswa-foto-wrapper">
                      <img src={siswa.foto} alt={siswa.name} className="siswa-foto" />
                    </div>
                    <div className="siswa-info">
                      <h4 className="siswa-name">{siswa.name}</h4>
                      <div className="siswa-details">
                        <span className="age-badge">{siswa.age} tahun</span>
                        <span className="position-badge">
                          <span className="position-icon">{getPositionIcon(siswa.position)}</span>
                          {siswa.position}
                        </span>
                      </div>
                    </div>
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

export default JadwalDetail;
