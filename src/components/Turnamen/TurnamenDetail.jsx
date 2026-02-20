import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './TurnamenDetail.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function TurnamenDetail() {
  const [turnamen, setTurnamen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id, turnamenId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTurnamenDetail();
  }, [turnamenId]);

  const fetchTurnamenDetail = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/ssb/${id}/jadwal-turnamen/${turnamenId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setTurnamen(data.data);
      } else {
        setError(data.message || 'Gagal mengambil detail turnamen');
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

  const handleEdit = () => {
    navigate(`/ssb/${id}/turnamen/${turnamenId}/edit`);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus turnamen "${turnamen.nama_turnamen}"? Tindakan ini tidak dapat dibatalkan.`
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/ssb/${id}/jadwal-turnamen/${turnamenId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        navigate(`/ssb/${id}/detail`);
      } else {
        setError(data.message || 'Gagal menghapus turnamen');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    }
  };

  if (loading) {
    return (
      <div className="turnamen-detail-container">
        <div className="loading">Memuat data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="turnamen-detail-container">
        <div className="error-message">{error}</div>
        <button onClick={handleBack} className="back-btn">Kembali</button>
      </div>
    );
  }

  if (!turnamen) return null;

  return (
    <div className="turnamen-detail-container">
      <div className="turnamen-detail-content">
        <div className="turnamen-detail-header">
          <button onClick={handleBack} className="back-btn">← Kembali</button>
          <h1>Detail Turnamen</h1>
          <div className="action-buttons">
            <button onClick={handleEdit} className="edit-btn">✏️ Edit</button>
            <button onClick={handleDelete} className="delete-btn">🗑️ Hapus</button>
          </div>
        </div>

        <div className="turnamen-detail-grid">
          {/* Info Turnamen */}
          <div className="detail-card turnamen-info-card">
            <div className="turnamen-trophy-header">
              <div className="trophy-icon">🏆</div>
              <h2 className="turnamen-title">{turnamen.nama_turnamen}</h2>
            </div>
            
            <div className="turnamen-details-list">
              <div className="detail-row">
                <div className="detail-icon">📅</div>
                <div className="detail-content">
                  <div className="detail-label">Tanggal</div>
                  <div className="detail-value">
                    {new Date(turnamen.tanggal).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-icon">🕒</div>
                <div className="detail-content">
                  <div className="detail-label">Waktu</div>
                  <div className="detail-value">
                    {turnamen.time_start.substring(0, 5)} - {turnamen.time_end.substring(0, 5)} WIB
                  </div>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-icon">📍</div>
                <div className="detail-content">
                  <div className="detail-label">Lokasi</div>
                  <div className="detail-value">{turnamen.location}</div>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-icon">👥</div>
                <div className="detail-content">
                  <div className="detail-label">Kelompok Umur</div>
                  <div className="detail-value">
                    <span className="age-badge-detail">{turnamen.age_grouping}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Tambahan */}
          <div className="detail-card meta-card">
            <h3>Informasi Tambahan</h3>
            <div className="meta-info">
              <div className="meta-item">
                <span className="meta-label">Dibuat pada:</span>
                <span className="meta-value">
                  {new Date(turnamen.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
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

export default TurnamenDetail;
