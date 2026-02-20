import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './SiswaEdit.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SiswaEdit() {
  const [siswa, setSiswa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [position, setPosition] = useState('Kiper');
  const [foto, setFoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
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
        const siswaData = data.data;
        setSiswa(siswaData);
        setName(siswaData.name);
        setAge(siswaData.age.toString());
        setPosition(siswaData.position);
        setPreviewUrl(siswaData.foto);
      } else {
        setError(data.message || 'Gagal mengambil detail siswa');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Nama siswa harus diisi');
      return;
    }

    if (!age || age < 1) {
      setError('Umur siswa harus valid');
      return;
    }

    setUpdating(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('age', age);
      formData.append('position', position);
      if (foto) {
        formData.append('foto', foto);
      }

      const response = await fetch(`${API_BASE_URL}/ssb/${ssbId}/siswa/${siswaId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        navigate(`/ssb/${ssbId}/siswa/${siswaId}`);
      } else {
        setError(data.message || 'Gagal mengupdate siswa');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    } finally {
      setUpdating(false);
    }
  };

  const handleBack = () => {
    navigate(`/ssb/${ssbId}/siswa/${siswaId}`);
  };

  if (loading) {
    return (
      <div className="siswa-edit-container">
        <div className="loading">Memuat data...</div>
      </div>
    );
  }

  if (error && !siswa) {
    return (
      <div className="siswa-edit-container">
        <div className="error-message">{error}</div>
        <button onClick={handleBack} className="back-btn">Kembali</button>
      </div>
    );
  }

  return (
    <div className="siswa-edit-container">
      <div className="siswa-edit-content">
        <div className="siswa-edit-header">
          <button onClick={handleBack} className="back-btn">← Kembali</button>
          <h1>Edit Data Siswa</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="edit-grid">
          {/* Preview Foto */}
          <div className="foto-preview-section">
            <div className="preview-wrapper">
              <img src={previewUrl} alt={name} className="preview-foto" />
            </div>
            <div className="foto-upload">
              <label htmlFor="foto" className="foto-label">
                📷 Ganti Foto
              </label>
              <input
                type="file"
                id="foto"
                accept="image/*"
                onChange={handleFileChange}
                disabled={updating}
              />
              <p className="foto-hint">Upload foto baru atau biarkan kosong untuk tetap pakai foto lama</p>
            </div>
          </div>

          {/* Form Edit */}
          <div className="form-section">
            <form onSubmit={handleSubmit} className="edit-form">
              <div className="form-group">
                <label htmlFor="name">Nama Lengkap</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama siswa"
                  disabled={updating}
                />
              </div>

              <div className="form-group">
                <label htmlFor="age">Umur</label>
                <input
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Masukkan umur siswa"
                  min="1"
                  max="100"
                  disabled={updating}
                />
              </div>

              <div className="form-group">
                <label htmlFor="position">Posisi</label>
                <select
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  disabled={updating}
                >
                  <option value="Kiper">🥅 Kiper</option>
                  <option value="Bek">🛡️ Bek</option>
                  <option value="Gelandang">⚙️ Gelandang</option>
                  <option value="Penyerang">⚽ Penyerang</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={updating}>
                  {updating ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
                <button type="button" onClick={handleBack} className="cancel-btn" disabled={updating}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SiswaEdit;
