import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function EditProfile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const updateData = {
        name: formData.name,
        email: formData.email
      };
      
      // Hanya kirim password jika diisi
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`${API_BASE_URL}/user/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.data));
        alert('Profil berhasil diperbarui');
        navigate('/dashboard');
      } else {
        setError(data.message || 'Gagal memperbarui profil');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== 'HAPUS') {
      alert('Ketik HAPUS untuk konfirmasi');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/user/me`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Akun berhasil dihapus');
        navigate('/');
      } else {
        alert(data.message || 'Gagal menghapus akun');
      }
    } catch (err) {
      alert('Gagal terhubung ke server');
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-content">
        <div className="edit-header">
          <button onClick={handleBack} className="back-btn">← Kembali</button>
          <h1>Edit Profil</h1>
        </div>

        <div className="profile-box">
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Nama</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password Baru (Opsional)</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Kosongkan jika tidak ingin mengubah"
              />
              <small>Minimal 6 karakter. Kosongkan jika tidak ingin mengubah password.</small>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>

          {/* Danger Zone */}
          <div className="danger-zone">
            <h3>Zona Berbahaya</h3>
            <p>Tindakan di bawah ini bersifat permanen dan tidak dapat dibatalkan.</p>
            
            {!showDeleteConfirm ? (
              <button 
                onClick={() => setShowDeleteConfirm(true)} 
                className="show-delete-btn"
              >
                Hapus Akun
              </button>
            ) : (
              <div className="delete-confirm-box">
                <div className="warning-box">
                  <p>⚠️ Peringatan!</p>
                  <p>Semua data Anda akan dihapus permanen.</p>
                </div>
                <div className="form-group">
                  <label>Ketik <strong>HAPUS</strong> untuk konfirmasi</label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Ketik HAPUS"
                  />
                </div>
                <div className="delete-actions">
                  <button 
                    onClick={() => { setShowDeleteConfirm(false); setConfirmText(''); }} 
                    className="cancel-btn"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleDeleteAccount} 
                    className="delete-btn"
                    disabled={confirmText !== 'HAPUS'}
                  >
                    Hapus Akun Saya
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
