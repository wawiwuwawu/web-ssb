import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './TurnamenCreate.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function TurnamenCreate() {
  const [namaTurnamen, setNamaTurnamen] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [timeStart, setTimeStart] = useState('08:00');
  const [timeEnd, setTimeEnd] = useState('17:00');
  const [ageGrouping, setAgeGrouping] = useState('U-12');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!namaTurnamen.trim()) {
      setError('Nama turnamen harus diisi');
      return;
    }

    if (!tanggal) {
      setError('Tanggal turnamen harus diisi');
      return;
    }

    if (!timeStart || !timeEnd) {
      setError('Waktu mulai dan selesai harus diisi');
      return;
    }

    if (timeStart >= timeEnd) {
      setError('Waktu selesai harus lebih besar dari waktu mulai');
      return;
    }

    if (!location.trim()) {
      setError('Lokasi turnamen harus diisi');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/ssb/${id}/jadwal-turnamen`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama_turnamen: namaTurnamen,
          tanggal: tanggal,
          time_start: timeStart + ':00',
          time_end: timeEnd + ':00',
          age_grouping: ageGrouping,
          location: location,
        }),
      });

      const data = await response.json();

      if (data.success) {
        navigate(`/ssb/${id}/detail`);
      } else {
        setError(data.message || 'Gagal menambahkan jadwal turnamen');
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

  return (
    <div className="turnamen-create-container">
      <div className="turnamen-create-content">
        <div className="turnamen-create-header">
          <button onClick={handleBack} className="back-btn">← Kembali</button>
          <h1>Tambah Jadwal Turnamen</h1>
        </div>

        <form onSubmit={handleSubmit} className="turnamen-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="namaTurnamen">Nama Turnamen</label>
            <input
              type="text"
              id="namaTurnamen"
              value={namaTurnamen}
              onChange={(e) => setNamaTurnamen(e.target.value)}
              placeholder="Contoh: Piala Walikota 2026"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tanggal">Tanggal Turnamen</label>
            <input
              type="date"
              id="tanggal"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="timeStart">Waktu Mulai</label>
              <input
                type="time"
                id="timeStart"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                  }
                }}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="timeEnd">Waktu Selesai</label>
              <input
                type="time"
                id="timeEnd"
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                  }
                }}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="ageGrouping">Kelompok Umur</label>
            <select
              id="ageGrouping"
              value={ageGrouping}
              onChange={(e) => setAgeGrouping(e.target.value)}
              disabled={loading}
            >
              <option value="U-10">U-10 (Under 10)</option>
              <option value="U-12">U-12 (Under 12)</option>
              <option value="U-15">U-15 (Under 15)</option>
              <option value="U-17">U-17 (Under 17)</option>
              <option value="U-20">U-20 (Under 20)</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location">Lokasi Turnamen</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Stadion Utama"
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Jadwal Turnamen'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TurnamenCreate;
