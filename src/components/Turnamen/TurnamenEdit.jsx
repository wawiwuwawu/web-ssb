import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './TurnamenEdit.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function TurnamenEdit() {
  const [namaTurnamen, setNamaTurnamen] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [ageGrouping, setAgeGrouping] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const navigate = useNavigate();
  const { id, turnamenId } = useParams();

  useEffect(() => {
    fetchTurnamenDetail();
  }, [turnamenId]);

  const fetchTurnamenDetail = async () => {
    setFetchLoading(true);
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
        const turnamen = data.data;
        setNamaTurnamen(turnamen.nama_turnamen);
        setTanggal(turnamen.tanggal);
        setTimeStart(turnamen.time_start.substring(0, 5));
        setTimeEnd(turnamen.time_end.substring(0, 5));
        setAgeGrouping(turnamen.age_grouping);
        setLocation(turnamen.location);
      } else {
        setError(data.message || 'Gagal mengambil data turnamen');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!namaTurnamen || !tanggal || !timeStart || !timeEnd || !ageGrouping || !location) {
      setError('Semua field wajib diisi');
      return;
    }

    if (timeStart >= timeEnd) {
      setError('Waktu mulai harus lebih awal dari waktu selesai');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/ssb/${id}/jadwal-turnamen/${turnamenId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama_turnamen: namaTurnamen,
          tanggal: tanggal,
          time_start: timeStart,
          time_end: timeEnd,
          age_grouping: ageGrouping,
          location: location
        }),
      });

      const data = await response.json();

      if (data.success) {
        navigate(`/ssb/${id}/turnamen/${turnamenId}`);
      } else {
        setError(data.message || 'Gagal mengupdate turnamen');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/ssb/${id}/turnamen/${turnamenId}`);
  };

  if (fetchLoading) {
    return (
      <div className="turnamen-edit-container">
        <div className="loading">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="turnamen-edit-container">
      <div className="turnamen-edit-content">
        <div className="turnamen-edit-header">
          <button onClick={handleCancel} className="back-btn">← Kembali</button>
          <h1>Edit Turnamen</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="turnamen-edit-form">
          <div className="form-group">
            <label htmlFor="nama_turnamen">Nama Turnamen</label>
            <input
              type="text"
              id="nama_turnamen"
              value={namaTurnamen}
              onChange={(e) => setNamaTurnamen(e.target.value)}
              placeholder="Contoh: Piala Walikota 2026"
              disabled={loading}
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
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="time_start">Waktu Mulai</label>
              <input
                type="time"
                id="time_start"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
                disabled={loading}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="time_end">Waktu Selesai</label>
              <input
                type="time"
                id="time_end"
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
                disabled={loading}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                  }
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="age_grouping">Kelompok Umur</label>
            <select
              id="age_grouping"
              value={ageGrouping}
              onChange={(e) => setAgeGrouping(e.target.value)}
              disabled={loading}
            >
              <option value="">Pilih Kelompok Umur</option>
              <option value="U-8">U-8</option>
              <option value="U-10">U-10</option>
              <option value="U-12">U-12</option>
              <option value="U-15">U-15</option>
              <option value="U-17">U-17</option>
              <option value="U-19">U-19</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location">Lokasi</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Stadion Utama"
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn" disabled={loading}>
              Batal
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Menyimpan...' : '💾 Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TurnamenEdit;
