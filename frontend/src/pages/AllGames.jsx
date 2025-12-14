import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Search, Grid3x3, List, Package, Gamepad2, Filter, ArrowUpDown, Heart, X } from 'lucide-react';
import { showToast } from '../components/ToastContainer';
import { GameCardSkeleton } from '../components/LoadingSkeleton';
import Pagination from '../components/Pagination';

function AllGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [categories, setCategories] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchCategories();
    if (user) {
      fetchWishlist();
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedPlatform, selectedCategory, sortBy, minPrice, maxPrice]);

  useEffect(() => {
    fetchGames();
  }, [currentPage, searchQuery, selectedPlatform, selectedCategory, sortBy, minPrice, maxPrice]);

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get('http://localhost:5000/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // แปลง array ของ game objects เป็น array ของ game_id
      const wishlistIds = res.data.map(game => game.game_id);
      setWishlist(wishlistIds);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };

  const toggleWishlist = async (gameId, e) => {
    if (e) e.stopPropagation();
    
    if (!user) {
      showToast('กรุณาเข้าสู่ระบบก่อน', 'warning');
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('กรุณาเข้าสู่ระบบก่อน', 'warning');
        navigate('/login');
        return;
      }

      const isInWishlist = wishlist.includes(gameId);
      
      // เรียก API เพื่อ toggle wishlist
      const res = await axios.post(`http://localhost:5000/api/wishlist/toggle/${gameId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // อัปเดต state ตาม response
      if (res.data.inWishlist) {
        setWishlist([...wishlist, gameId]);
      } else {
        setWishlist(wishlist.filter(id => id !== gameId));
      }

      showToast(res.data.message || (isInWishlist ? 'ลบออกจากรายการโปรดแล้ว' : 'เพิ่มในรายการโปรดแล้ว'), 
        isInWishlist ? 'info' : 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'เกิดข้อผิดพลาด', 'error');
    }
  };

  const getPlatforms = () => {
    return ['Steam', 'PlayStation', 'Xbox', 'Nintendo', 'Epic Games'];
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
      // ลบหมวดหมู่ซ้ำ
      const uniqueCategories = res.data.filter((cat, index, self) => 
        index === self.findIndex(c => c.category_id === cat.category_id)
      );
      setCategories(uniqueCategories);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGames = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        ...(searchQuery && { search: searchQuery }),
        ...(selectedPlatform && { platform: selectedPlatform }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(sortBy && { sort: sortBy })
      });

      const res = await axios.get(`http://localhost:5000/api/games?${params}`);
      const gamesData = res.data.games || [];
      // ลบเกมซ้ำโดยใช้ game_id เป็น key
      const uniqueGames = gamesData.filter((game, index, self) => 
        index === self.findIndex(g => g.game_id === game.game_id)
      );
      setGames(uniqueGames);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition mb-6"
          >
            <ArrowLeft size={20} />
            <span>กลับหน้าหลัก</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                <Gamepad2 className="w-10 h-10" />
                ไอดีเกมออนไลน์ทั้งหมด
              </h1>
              <p className="text-gray-300">
                เลือกซื้อเกมที่คุณชอบ มีให้เลือก {games.length} เกม
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-white/10 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition ${viewMode === 'grid' ? 'bg-white text-red-600' : 'text-white hover:bg-white/20'}`}
                title="แสดงแบบตาราง"
              >
                <Grid3x3 size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition ${viewMode === 'list' ? 'bg-white text-red-600' : 'text-white hover:bg-white/20'}`}
                title="แสดงแบบรายการ"
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white shadow-md border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ค้นหาเกม..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-700 font-medium"
              />
            </div>

            {/* Platform Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-700 font-medium appearance-none bg-white cursor-pointer"
              >
                <option value="">ทุกแพลตฟอร์ม</option>
                {getPlatforms().map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-700 font-medium appearance-none bg-white cursor-pointer"
              >
                <option value="">ทุกหมวดหมู่</option>
                {categories.map(cat => (
                  <option key={cat.category_id} value={cat.category_id}>{cat.name_th}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-700 font-medium appearance-none bg-white cursor-pointer"
              >
                <option value="newest">ใหม่ล่าสุด</option>
                <option value="price_low">ราคา: ต่ำ → สูง</option>
                <option value="price_high">ราคา: สูง → ต่ำ</option>
                <option value="name">ชื่อ: A → Z</option>
                <option value="rating">คะแนนสูงสุด</option>
                <option value="popular">ยอดนิยม</option>
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <input
                type="number"
                placeholder="ราคาต่ำสุด"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-700 font-medium"
              />
            </div>
            <div className="relative">
              <input
                type="number"
                placeholder="ราคาสูงสุด"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-700 font-medium"
              />
            </div>
          </div>
          
          {(searchQuery || selectedPlatform || selectedCategory || minPrice || maxPrice) && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {pagination ? `พบ ${pagination.totalGames} รายการ` : 'กำลังค้นหา...'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedPlatform('');
                  setSelectedCategory('');
                  setMinPrice('');
                  setMaxPrice('');
                  setSortBy('newest');
                }}
                className="text-sm text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
              >
                <X size={16} />
                ล้างทั้งหมด
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Games Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <GameCardSkeleton key={i} />
            ))}
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-xl">ไม่พบเกมที่ค้นหา</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-red-600 hover:text-red-700 font-bold"
            >
              ล้างการค้นหา
            </button>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {games.map((game) => (
                  <div
                    key={game.game_id}
                    className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300 group border border-gray-100 cursor-pointer"
                    onClick={() => navigate(`/games/${game.game_id}`)}
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={game.image_url}
                        alt={game.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      />
                      <div className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm uppercase">
                        {game.platform}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(game.game_id, e);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-full transition ${
                          wishlist.includes(game.game_id)
                            ? 'bg-red-600 text-white'
                            : 'bg-white/80 text-gray-600 hover:bg-white'
                        }`}
                        title={wishlist.includes(game.game_id) ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
                      >
                        <Heart 
                          size={18} 
                          className={wishlist.includes(game.game_id) ? 'fill-current' : ''}
                        />
                      </button>
                    </div>

                    <div className="p-5">
                      <h4 className="font-extrabold text-lg text-gray-800 truncate mb-1">
                        {game.name}
                      </h4>
                      <p className="text-xs text-gray-500 mb-4 h-8 line-clamp-2">
                        {game.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-gray-400 line-through">
                            ฿{Number(game.price * 1.2).toFixed(0)}
                          </p>
                          <p className="text-xl font-black text-red-600">
                            ฿{Number(game.price).toLocaleString()}
                          </p>
                        </div>
                        <button className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition active:scale-95 shadow-lg text-sm font-bold">
                          ดูเพิ่ม
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {games.map((game) => (
                  <div
                    key={game.game_id}
                    className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group border border-gray-100 cursor-pointer"
                    onClick={() => navigate(`/games/${game.game_id}`)}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="md:w-64 h-48 md:h-auto overflow-hidden relative flex-shrink-0">
                        <img
                          src={game.image_url}
                          alt={game.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                        />
                        <div className="absolute top-3 left-3 bg-black/80 text-white text-xs font-bold px-3 py-1 rounded backdrop-blur-sm uppercase">
                          {game.platform}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(game.game_id, e);
                          }}
                          className={`absolute top-3 right-3 p-2 rounded-full transition ${
                            wishlist.includes(game.game_id)
                              ? 'bg-red-600 text-white'
                              : 'bg-white/80 text-gray-600 hover:bg-white'
                          }`}
                          title={wishlist.includes(game.game_id) ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
                        >
                          <Heart 
                            size={18} 
                            className={wishlist.includes(game.game_id) ? 'fill-current' : ''}
                          />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-extrabold text-2xl text-gray-800 mb-2">
                            {game.name}
                          </h4>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {game.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-400 line-through">
                              ฿{Number(game.price * 1.2).toFixed(0)}
                            </p>
                            <p className="text-3xl font-black text-red-600">
                              ฿{Number(game.price).toLocaleString()}
                            </p>
                          </div>
                          <button className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition active:scale-95 shadow-lg font-bold">
                            ดูรายละเอียด
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AllGames;