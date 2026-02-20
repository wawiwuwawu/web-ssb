import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './JadwalCreate.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function JadwalCreate() {
  const [day, setDay] = useState('Senin');
  const [timeStart, setTimeStart] = useState('16:00');
  const [timeEnd, setTimeEnd] = useState('18:00');
  const [ageGrouping, setAgeGrouping] = useState('U-12');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!timeStart || !timeEnd) {
      setError('Waktu mulai dan selesai harus diisi');
      return;
    }

    if (timeStart >= timeEnd) {
      setError('Waktu selesai harus lebih besar dari waktu mulai');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/ssb/${id}/jadwal-latihan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          day,
          time_start: timeStart + ':00',
          time_end: timeEnd + ':00',
          age_grouping: ageGrouping,
        }),
      });

      const data = await response.json();

      if (data.success) {
        navigate(`/ssb/${id}/detail`);
      } else {
        setError(data.message || 'Gagal menambahkan jadwal latihan');
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
    <div className="jadwal-create-container">
      <div className="jadwal-create-content">
        <div className="jadwal-create-header">
          <button onClick={handleBack} className="back-btn">← Kembali</button>
          <h1>Tambah Jadwal Latihan</h1>
        </div>

        <form onSubmit={handleSubmit} className="jadwal-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="day">Hari</label>
            <select
              id="day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              disabled={loading}
            >
              <option value="Senin">Senin</option>
              <option value="Selasa">Selasa</option>
              <option value="Rabu">Rabu</option>
              <option value="Kamis">Kamis</option>
              <option value="Jumat">Jumat</option>
              <option value="Sabtu">Sabtu</option>
              <option value="Minggu">Minggu</option>
            </select>
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

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Jadwal'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default JadwalCreate;
