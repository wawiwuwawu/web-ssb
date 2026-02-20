import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './SSBDetail.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SSBDetail() {
  const [ssb, setSSB] = useState(null);
  const [jadwalLatihan, setJadwalLatihan] = useState([]);
  const [jadwalTurnamen, setJadwalTurnamen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSSBDetail();
    fetchJadwalLatihan();
    fetchJadwalTurnamen();
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

  const fetchJadwalLatihan = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/ssb/${id}/jadwal-latihan`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setJadwalLatihan(data.data);
      }
    } catch (err) {
      console.error('Gagal mengambil jadwal latihan:', err);
    }
  };

  const fetchJadwalTurnamen = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/ssb/${id}/jadwal-turnamen`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setJadwalTurnamen(data.data);
      }
    } catch (err) {
      console.error('Gagal mengambil jadwal turnamen:', err);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus SSB "${ssb.name}"? Semua data siswa juga akan terhapus. Tindakan ini tidak dapat dibatalkan.`
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/ssb/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        // Navigate back to dashboard after successful delete
        navigate('/dashboard');
      } else {
        setError(data.message || 'Gagal menghapus SSB');
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
          <h1>{ssb.name}</h1>          <button onClick={handleDelete} className="delete-ssb-btn">🗑️ Hapus SSB</button>        </div>

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
          {/* Jadwal Latihan */}
          <div className="detail-card full-width">
            <div className="jadwal-header">
              <h3>Jadwal Latihan</h3>
              <button onClick={() => navigate(`/ssb/${id}/jadwal/create`)} className="add-jadwal-btn">
                + Tambah Jadwal
              </button>
            </div>
            {jadwalLatihan.length === 0 ? (
              <div className="empty-jadwal">
                <p>Belum ada jadwal latihan. Klik tombol "Tambah Jadwal" untuk membuat jadwal baru.</p>
              </div>
            ) : (
              <div className="jadwal-grid">
                {jadwalLatihan.map((jadwal) => (
                  <div 
                    key={jadwal.id} 
                    className="jadwal-card clickable"
                    onClick={() => navigate(`/ssb/${id}/jadwal/${jadwal.id}`)}
                  >
                    <div className="jadwal-card-header">
                      <div className="day-badge-card">{jadwal.day}</div>
                      <div className="age-badge-card">{jadwal.age_grouping}</div>
                    </div>
                    <div className="jadwal-card-time">
                      <div className="time-icon-large">🕒</div>
                      <div className="time-display">
                        <div className="time-label">Waktu Latihan</div>
                        <div className="time-value">
                          {jadwal.time_start.substring(0, 5)} - {jadwal.time_end.substring(0, 5)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Jadwal Turnamen */}
          <div className="detail-card full-width">
            <div className="turnamen-header">
              <h3>Jadwal Turnamen</h3>
              <button onClick={() => navigate(`/ssb/${id}/turnamen/create`)} className="add-turnamen-btn">
                + Tambah Turnamen
              </button>
            </div>
            {jadwalTurnamen.length === 0 ? (
              <div className="empty-turnamen">
                <p>Belum ada jadwal turnamen. Klik tombol "Tambah Turnamen" untuk membuat jadwal baru.</p>
              </div>
            ) : (
              <div className="turnamen-grid">
                {jadwalTurnamen.map((turnamen) => (
                  <div 
                    key={turnamen.id} 
                    className="turnamen-card"
                    onClick={() => navigate(`/ssb/${id}/turnamen/${turnamen.id}`)}
                  >
                    <div className="turnamen-card-header">
                      <div className="turnamen-trophy">🏆</div>
                      <h4 className="turnamen-name">{turnamen.nama_turnamen}</h4>
                    </div>
                    <div className="turnamen-details">
                      <div className="turnamen-info-row">
                        <span className="info-icon">📅</span>
                        <span className="info-text">
                          {new Date(turnamen.tanggal).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="turnamen-info-row">
                        <span className="info-icon">🕒</span>
                        <span className="info-text">
                          {turnamen.time_start.substring(0, 5)} - {turnamen.time_end.substring(0, 5)}
                        </span>
                      </div>
                      <div className="turnamen-info-row">
                        <span className="info-icon">📍</span>
                        <span className="info-text">{turnamen.location}</span>
                      </div>
                      <div className="turnamen-age-group">
                        <span className="age-badge-turnamen">{turnamen.age_grouping}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              <div className="siswa-grid">
                {ssb.siswa.map((siswa, index) => (
                  <div 
                    key={index} 
                    className="siswa-card clickable"
                    onClick={() => navigate(`/ssb/${id}/siswa/${siswa.id}`)}
                  >
                    <div className="siswa-foto-wrapper">
                      <img src={siswa.foto} alt={siswa.name} className="siswa-foto" />
                      <div className={`siswa-status-badge ${siswa.isActive ? 'active' : 'inactive'}`}>
                        {siswa.isActive ? '✓' : '✗'}
                      </div>
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

export default SSBDetail;
