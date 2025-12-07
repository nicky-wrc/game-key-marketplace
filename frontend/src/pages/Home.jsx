import { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingCart, Search, Gift, CreditCard, Box, User, LogOut, ShieldAlert, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0); 
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')); 

  useEffect(() => {
    fetchGames();
    if (user) {
      fetchUserBalance(); 
    }
  }, []);

  const fetchUserBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await axios.get('http://localhost:5000/api/wallet/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBalance(res.data.wallet_balance); 
    } catch (err) {
      console.error("Failed to fetch balance", err);
    }
  };

  const fetchGames = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/games');
      setGames(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDailyReward = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('กรุณาล็อกอินก่อน');

    try {
      const res = await axios.post('http://localhost:5000/api/wallet/daily', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message); 
      fetchUserBalance(); 
    } catch (err) {
      alert(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleBuy = async (gameId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('กรุณาเข้าสู่ระบบก่อนซื้อสินค้า');
      navigate('/login');
      return;
    }

    const couponCode = prompt("มีโค้ดส่วนลดไหม? (ถ้าไม่มีให้กด OK ข้ามไปเลย)");

    if (!window.confirm('ยืนยันการซื้อสินค้านี้?')) return;

    try {
      const res = await axios.post(
        'http://localhost:5000/api/transactions/buy',
        { 
            game_id: gameId,
            coupon_code: couponCode
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const paidAmount = res.data.price_paid !== undefined ? res.data.price_paid : '...';
      alert(`ซื้อสำเร็จ! 🎉 (จ่ายไป ฿${paidAmount})\nรหัสเกมของคุณคือ: ${res.data.game_code}`);
      
      fetchUserBalance(); 
    } catch (err) {
      alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการซื้อ');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      
      {/* 1. Top Bar */}
      <div className="bg-red-800 text-white text-xs py-2 px-4 flex justify-between items-center">
         <span>ติดต่อเรา | Facebook Fanpage</span>
         <div className="flex gap-4">
            {user ? (
                <>
                    <span>ยินดีต้อนรับ, {user.username}</span>
                    <button onClick={handleLogout} className="hover:text-gray-300">ออกจากระบบ</button>
                </>
            ) : (
                <>
                    <button onClick={() => navigate('/login')} className="hover:text-gray-300">เข้าสู่ระบบ</button>
                    <span>|</span>
                    <button onClick={() => navigate('/register')} className="hover:text-gray-300">สมัครสมาชิก</button>
                </>
            )}
         </div>
      </div>

      {/* 2. Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-black rounded-xl flex items-center justify-center shadow-lg shadow-red-500/40 transform group-hover:rotate-12 transition duration-300">
                    <Gamepad2 className="w-7 h-7 text-white" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-black tracking-tighter text-gray-900 italic leading-none">
                        NICKY<span className="text-red-600">KEY</span>
                    </h1>
                    <p className="text-[10px] font-bold text-gray-400 tracking-[0.25em] group-hover:text-red-600 transition duration-300">
                        GAME STORE CENTER
                    </p>
                </div>
            </div>

            {/* Menu Links */}
            <div className="hidden md:flex gap-6 text-sm font-bold text-gray-700">
                <button onClick={() => navigate('/')} className="hover:text-red-600 transition">หน้าหลัก</button>
                <button onClick={() => navigate('/topup')} className="hover:text-red-600 transition">เติมเงิน</button>
                <button onClick={() => navigate('/gacha')} className="hover:text-red-600 transition flex items-center gap-1"><Gift size={16}/> สุ่มของรางวัล</button>
                <button onClick={() => navigate('/inventory')} className="hover:text-red-600 transition">คลังของฉัน</button>
                <button onClick={handleDailyReward} className="text-yellow-600 hover:text-yellow-700 transition flex items-center gap-1 animate-pulse">🎁 รับฟรี</button>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
                <div className="relative hidden lg:block">
                    <input type="text" placeholder="ค้นหา..." className="bg-gray-100 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-48" />
                    <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2" />
                </div>
                
                {user && (
                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-200 transition" onClick={() => navigate('/profile')}>
                        <CreditCard className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-bold text-red-600">฿{Number(balance).toLocaleString()}</span>
                    </div>
                )}

                {user && user.role === 'admin' && (
                  <button onClick={() => navigate('/admin')} className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-700 shadow flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Admin
                  </button>
                )}
            </div>
        </div>
      </nav>

      {/* 3. Hero Banner */}
      <div className="relative bg-gradient-to-r from-red-900 to-black h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-[url('https://wallpapers.com/images/hd/gaming-background-h193859385.jpg')] bg-cover bg-center"></div>
          
          <div className="relative z-10 text-center text-white px-4">
              <h2 className="text-5xl md:text-6xl font-black mb-4 drop-shadow-lg italic">ลุ้นไอดี <span className="text-yellow-400">เทพมากมาย</span></h2>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">แหล่งรวมรหัสเกมราคาถูก บริการเติมเกม 24 ชม. ปลอดภัย 100%</p>
              
              <button 
                onClick={() => navigate('/gacha')}
                className="bg-gradient-to-b from-red-500 to-red-700 text-white text-2xl font-bold px-10 py-4 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:scale-105 transition transform border-4 border-red-400"
              >
                คลิกเพื่อสุ่ม
              </button>
          </div>
      </div>

      {/* 4. Category Grid (เมนูทางลัด) */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div onClick={() => navigate('/gacha')} className="bg-white p-4 rounded-xl shadow-lg hover:-translate-y-2 transition cursor-pointer border-b-4 border-red-500 group">
                  <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:bg-red-600 transition">
                      <Gift className="text-red-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">สุ่มของรางวัล</h3>
                  <p className="text-xs text-gray-500">Random Prize</p>
              </div>
              <div onClick={() => navigate('/topup')} className="bg-white p-4 rounded-xl shadow-lg hover:-translate-y-2 transition cursor-pointer border-b-4 border-yellow-500 group">
                  <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:bg-yellow-500 transition">
                      <CreditCard className="text-yellow-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">เติมเงินเข้าระบบ</h3>
                  <p className="text-xs text-gray-500">Top-up Wallet</p>
              </div>
              <div onClick={() => navigate('/')} className="bg-white p-4 rounded-xl shadow-lg hover:-translate-y-2 transition cursor-pointer border-b-4 border-blue-500 group">
                   <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 transition">
                      <Box className="text-blue-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">ไอดีเกมออนไลน์</h3>
                  <p className="text-xs text-gray-500">Game ID Shop</p>
              </div>
              {/* Card 4: แก้ไขตรงนี้แล้ว (เด้งไป Profile) */}
              <div onClick={() => navigate('/profile')} className="bg-white p-4 rounded-xl shadow-lg hover:-translate-y-2 transition cursor-pointer border-b-4 border-green-500 group">
                   <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-600 transition">
                      <User className="text-green-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">ข้อมูลส่วนตัว</h3>
                  <p className="text-xs text-gray-500">Profile & Stock</p>
              </div>
          </div>
      </div>

      {/* 5. Game List */}
      <main className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
            <h3 className="text-2xl font-bold text-gray-800 uppercase italic">
              สินค้า <span className="text-red-600">แนะนำ</span>
            </h3>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-20">กำลังโหลดข้อมูลสินค้า...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <div key={game.game_id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300 group border border-gray-100">
                <div className="h-48 overflow-hidden relative">
                    <img 
                        src={game.image_url} 
                        alt={game.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm uppercase">
                        {game.platform}
                    </div>
                </div>

                <div className="p-5">
                  <h4 className="font-extrabold text-lg text-gray-800 truncate mb-1">{game.name}</h4>
                  <p className="text-xs text-gray-500 mb-4 h-8 line-clamp-2">{game.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-gray-400 line-through">฿{Number(game.price * 1.2).toFixed(0)}</p>
                        <p className="text-xl font-black text-red-600">฿{Number(game.price).toLocaleString()}</p>
                    </div>
                    
                    <button 
                      onClick={() => handleBuy(game.game_id)}
                      className="bg-red-600 text-white p-3 rounded-xl hover:bg-red-700 transition active:scale-95 shadow-lg shadow-red-200"
                      title="ใส่ตะกร้า"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 text-center border-t-4 border-red-600">
          <h2 className="text-2xl font-bold mb-2">NICKY<span className="text-red-600">KEY</span></h2>
          <p className="text-gray-500 text-sm">Copyright © 2025 GameKey Market. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Home;