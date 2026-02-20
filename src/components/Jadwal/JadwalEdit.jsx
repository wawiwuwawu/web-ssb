import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './JadwalEdit.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function JadwalEdit() {
  const [day, setDay] = useState('Senin');
  const [timeStart, setTimeStart] = useState('16:00');
  const [timeEnd, setTimeEnd] = useState('18:00');
  const [ageGrouping, setAgeGrouping] = useState('U-12');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id, jadwalId } = useParams();

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
        const jadwal = data.data;
        setDay(jadwal.day);
        setTimeStart(jadwal.time_start.substring(0, 5));
        setTimeEnd(jadwal.time_end.substring(0, 5));
        setAgeGrouping(jadwal.age_grouping);
      } else {
        setError(data.message || 'Gagal mengambil detail jadwal');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

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

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/ssb/${id}/jadwal-latihan/${jadwalId}`, {
        method: 'PUT',
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
        navigate(`/ssb/${id}/jadwal/${jadwalId}`);
      } else {
        setError(data.message || 'Gagal mengupdate jadwal latihan');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate(`/ssb/${id}/jadwal/${jadwalId}`);
  };

  if (loading) {
    return (
      <div className="jadwal-edit-container">
        <div className="loading">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="jadwal-edit-container">
      <div className="jadwal-edit-content">
        <div className="jadwal-edit-header">
          <button onClick={handleBack} className="back-btn">← Kembali</button>
          <h1>Edit Jadwal Latihan</h1>
        </div>

        <form onSubmit={handleSubmit} className="jadwal-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="day">Hari</label>
            <select
              id="day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
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
              disabled={saving}
            >
              <option value="U-10">U-10 (Under 10)</option>
              <option value="U-12">U-12 (Under 12)</option>
              <option value="U-15">U-15 (Under 15)</option>
              <option value="U-17">U-17 (Under 17)</option>
              <option value="U-20">U-20 (Under 20)</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default JadwalEdit;
