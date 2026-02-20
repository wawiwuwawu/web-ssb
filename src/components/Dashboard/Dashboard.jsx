import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Dashboard() {
  const [user, setUser] = useState(null);
  const [ssbList, setSSBList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/');
      return;
    }

    setUser(JSON.parse(userData));
    fetchSSBList();
  }, [navigate]);

  const fetchSSBList = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/ssb`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setSSBList(data.data);
      } else {
        setError(data.message || 'Gagal mengambil data SSB');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleCreateSSB = () => {
    navigate('/ssb/create');
  };

  const handleViewDetail = (id) => {
    navigate(`/ssb/${id}/detail`);
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-info">
            <h1>Dashboard</h1>
            <button 
              className="user-badge" 
              onClick={handleEditProfile}
            >
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </button>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        {/* SSB Section */}
        <div className="ssb-section">
          <div className="section-header">
            <h2>Sekolah Sepak Bola (SSB)</h2>
            <button onClick={handleCreateSSB} className="create-btn">
              + Tambah SSB
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Memuat data SSB...</div>
          ) : ssbList.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⚽</div>
              <p>Belum ada SSB yang terdaftar</p>
              <button onClick={handleCreateSSB} className="create-btn-empty">
                Buat SSB Pertama
              </button>
            </div>
          ) : (
            <div className="ssb-grid">
              {ssbList.map((ssb) => (
                <div key={ssb.id} className="ssb-card" onClick={() => handleViewDetail(ssb.id)}>
                  <div className="ssb-card-header">
                    <h3>{ssb.name}</h3>
                  </div>
                  <div className="ssb-card-body">
                    <div className="ssb-stat">
                      <span className="stat-label">Jumlah Siswa:</span>
                      <span className="stat-value">{ssb.jumlah_siswa}</span>
                    </div>
                    <div className="ssb-date">
                      Dibuat: {new Date(ssb.created_at).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
