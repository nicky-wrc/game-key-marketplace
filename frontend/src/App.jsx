import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home'; 
import TopUp from './pages/TopUp';
import Gacha from './pages/Gacha';
import Inventory from './pages/Inventory';
import Admin from './pages/Admin';
import Profile from './pages/Profile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />  {/* บอกว่าถ้าเข้าหน้าแรก ให้โชว์ Home ใหม่สวยๆ */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/topup" element={<TopUp />} />
      <Route path="/gacha" element={<Gacha />} />
      <Route path="/inventory" element={<Inventory />} />

      <Route path="/admin" element={<Admin />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;