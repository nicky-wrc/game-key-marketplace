import { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingCart, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')); // ดึงชื่อคนล็อกอินมาโชว์

  useEffect(() => {
    fetchGames();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          GameKey Market
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input type="text" placeholder="ค้นหาเกม..." className="bg-transparent border-none focus:outline-none ml-2 text-sm" />
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-medium">สวัสดี, {user.username}</span>
              <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600">ออกจากระบบ</button>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
              เข้าสู่ระบบ
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-purple-900 text-white py-12 px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">แหล่งรวมรหัสเกมราคาถูก</h2>
        <p className="text-purple-200">ซื้อง่าย ได้รหัสทันที ปลอดภัย 100%</p>
      </header>

      {/* Game Grid */}
      <main className="max-w-6xl mx-auto p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          🔥 เกมยอดนิยม
        </h3>

        {loading ? (
          <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <div key={game.game_id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                {/* Image */}
                <div className="h-48 overflow-hidden relative group">
                    <img 
                        src={game.image_url} 
                        alt={game.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {game.platform}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h4 className="font-bold text-lg text-gray-800 truncate">{game.name}</h4>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2 h-10">{game.description}</p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-purple-600 font-bold text-lg">฿{game.price}</span>
                    <button className="bg-gray-900 text-white p-2 rounded-full hover:bg-purple-600 transition">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;