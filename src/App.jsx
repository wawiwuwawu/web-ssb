import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth/Auth';
import Dashboard from './components/Dashboard/Dashboard';
import EditProfile from './components/Profile/EditProfile';
import SSBCreate from './components/SSB/SSBCreate';
import SSBDetail from './components/SSB/SSBDetail';
import SiswaCreate from './components/Siswa/SiswaCreate';
import SiswaDetail from './components/Siswa/SiswaDetail';
import SiswaEdit from './components/Siswa/SiswaEdit';
import JadwalCreate from './components/Jadwal/JadwalCreate';
import JadwalDetail from './components/Jadwal/JadwalDetail';
import JadwalEdit from './components/Jadwal/JadwalEdit';
import TurnamenCreate from './components/Turnamen/TurnamenCreate';
import TurnamenDetail from './components/Turnamen/TurnamenDetail';
import TurnamenEdit from './components/Turnamen/TurnamenEdit';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/ssb/create" element={<SSBCreate />} />
        <Route path="/ssb/:id/detail" element={<SSBDetail />} />
        <Route path="/ssb/:id/jadwal/create" element={<JadwalCreate />} />
        <Route path="/ssb/:id/jadwal/:jadwalId" element={<JadwalDetail />} />
        <Route path="/ssb/:id/jadwal/:jadwalId/edit" element={<JadwalEdit />} />
        <Route path="/ssb/:id/turnamen/create" element={<TurnamenCreate />} />
        <Route path="/ssb/:id/turnamen/:turnamenId" element={<TurnamenDetail />} />
        <Route path="/ssb/:id/turnamen/:turnamenId/edit" element={<TurnamenEdit />} />
        <Route path="/ssb/:ssbId/siswa/create" element={<SiswaCreate />} />
        <Route path="/ssb/:ssbId/siswa/:siswaId" element={<SiswaDetail />} />
        <Route path="/ssb/:ssbId/siswa/:siswaId/edit" element={<SiswaEdit />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
