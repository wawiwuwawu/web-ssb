import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './SiswaCreate.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SiswaCreate() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [position, setPosition] = useState('Kiper');
  const [foto, setFoto] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const navigate = useNavigate();
  const { ssbId } = useParams();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      // Create preview URL
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

    if (!foto) {
      setError('Foto siswa harus diupload');
      return;
    }

    setLoading(true);

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
      formData.append('foto', foto);

      const response = await fetch(`${API_BASE_URL}/ssb/${ssbId}/siswa`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Navigate back to SSB detail page
        navigate(`/ssb/${ssbId}/detail`);
      } else {
        setError(data.message || 'Gagal menambahkan siswa');
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

  return (
    <div className="siswa-create-container">
      <div className="siswa-create-content">
        <div className="siswa-create-header">
          <button onClick={handleBack} className="back-btn">← Kembali</button>
          <h1>Tambah Siswa Baru</h1>
        </div>

        <form onSubmit={handleSubmit} className="siswa-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Nama Lengkap</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama siswa"
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">Posisi</label>
            <select
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              disabled={loading}
            >
              <option value="Kiper">🥅 Kiper</option>
              <option value="Bek">🛡️ Bek</option>
              <option value="Gelandang">⚙️ Gelandang</option>
              <option value="Penyerang">⚽ Penyerang</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="foto">Foto Siswa</label>
            <input
              type="file"
              id="foto"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
            />
            {previewUrl && (
              <div className="foto-preview">
                <img src={previewUrl} alt="Preview" />
              </div>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Siswa'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SiswaCreate;
