import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { ArrowLeft, ShoppingCart, Package, Eye, CheckCircle, AlertCircle, Ticket, X } from 'lucide-react';
import { showToast } from '../components/ToastContainer';
import ReviewSection from '../components/ReviewSection';

function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [game, setGame] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponValid, setCouponValid] = useState(false);
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [similarGames, setSimilarGames] = useState([]);

  useEffect(() => {
    fetchGameDetail();
    fetchGameStocks();
    fetchSimilarGames();
  }, [id]);

  const fetchSimilarGames = async () => {
    try {
      const res = await axiosInstance.get(`/api/recommendations/similar/${id}`);
      setSimilarGames(res.data || []);
    } catch (err) {
      console.error('Failed to fetch similar games', err);
    }
  };

  useEffect(() => {
    // Save to recently viewed when game is loaded
    if (game) {
      import('../utils/recentlyViewed').then(({ addRecentlyViewed }) => {
        addRecentlyViewed(game);
      });
    }
  }, [game]);

  const fetchGameDetail = async () => {
    try {
      const res = await axiosInstance.get('/api/games');
      const foundGame = res.data.find(g => g.game_id === parseInt(id));
      setGame(foundGame);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGameStocks = async () => {
    try {
      const res = await axiosInstance.get(`/api/games/${id}/stock`);
      setStocks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 ฟังก์ชันเช็คคูปอง
  const handleCheckCoupon = async () => {
    if (!couponCode.trim()) {
      showToast('กรุณากรอกโค้ดคูปอง', 'warning');
      return;
    }

    setCheckingCoupon(true);
    try {
      const res = await axiosInstance.post('/api/coupons/check', {
        code: couponCode.toUpperCase()
      });
      
      setCouponDiscount(res.data.discount);
      setCouponValid(true);
      showToast(`คูปองใช้ได้! ส่วนลด ${res.data.discount} บาท`, 'success');
    } catch (err) {
      setCouponValid(false);
      setCouponDiscount(0);
      showToast(err.response?.data?.message || 'คูปองไม่ถูกต้องหรือใช้ไม่ได้', 'error');
    } finally {
      setCheckingCoupon(false);
    }
  };

  // 🔹 ฟังก์ชันล้างคูปอง
  const clearCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setCouponValid(false);
  };

  // 🔹 ฟังก์ชันซื้อไอดีเฉพาะชิ้น (ส่ง code_id)
  const handleBuySpecific = async (codeId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('กรุณาเข้าสู่ระบบก่อนซื้อสินค้า', 'warning');
      navigate('/login');
      return;
    }

    const stock = stocks.find(s => s.code_id === codeId);
    const originalPrice = stock ? parseFloat(stock.price) : 0;
    const finalPrice = Math.max(0, originalPrice - couponDiscount);
    
    const confirmMsg = couponValid 
      ? `ยืนยันการซื้อไอดีนี้?\nราคาเดิม: ฿${originalPrice.toLocaleString()}\nส่วนลด: ฿${couponDiscount.toLocaleString()}\nราคาสุทธิ: ฿${finalPrice.toLocaleString()}`
      : 'ยืนยันการซื้อไอดีนี้?';

    if (!window.confirm(confirmMsg)) return;

    setPurchasing(true);
    try {
      const res = await axiosInstance.post(
        '/api/transactions/buy',
        { 
          code_id: codeId,
          coupon_code: couponValid ? couponCode.toUpperCase() : null
        },
      );
      
      showToast(`ซื้อสำเร็จ! รหัสเกม: ${res.data.game_code}`, 'success');
      fetchGameStocks(); // รีเฟรชสต็อก
      closeDetailModal();
      clearCoupon();
    } catch (err) {
      showToast(err.response?.data?.message || 'เกิดข้อผิดพลาดในการซื้อ', 'error');
    } finally {
      setPurchasing(false);
    }
  };

  // 🔹 ฟังก์ชันซื้อแบบสุ่ม (ส่ง game_id)
  const handleBuyRandom = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('กรุณาเข้าสู่ระบบก่อนซื้อสินค้า', 'warning');
      navigate('/login');
      return;
    }

    const originalPrice = game ? parseFloat(game.price) : 0;
    const finalPrice = Math.max(0, originalPrice - couponDiscount);
    
    const confirmMsg = couponValid 
      ? `ยืนยันการซื้อแบบสุ่ม?\nราคาเดิม: ฿${originalPrice.toLocaleString()}\nส่วนลด: ฿${couponDiscount.toLocaleString()}\nราคาสุทธิ: ฿${finalPrice.toLocaleString()}`
      : 'ยืนยันการซื้อแบบสุ่ม?';

    if (!window.confirm(confirmMsg)) return;

    setPurchasing(true);
    try {
      const res = await axiosInstance.post(
        '/api/transactions/buy',
        { 
          game_id: id,
          coupon_code: couponValid ? couponCode.toUpperCase() : null
        },
      );
      
      showToast(`ซื้อสำเร็จ! รหัสเกม: ${res.data.game_code}`, 'success');
      fetchGameStocks();
      clearCoupon();
    } catch (err) {
      showToast(err.response?.data?.message || 'เกิดข้อผิดพลาดในการซื้อ', 'error');
    } finally {
      setPurchasing(false);
    }
  };

  const openDetailModal = (stock) => {
    setSelectedStock(stock);
  };

  const closeDetailModal = () => {
    setSelectedStock(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-900 text-xl">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-900 text-xl">ไม่พบข้อมูลเกมนี้</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 text-gray-900 pb-20">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-red-200 transition mb-4"
          >
            <ArrowLeft size={20} />
            <span>กลับหน้าหลัก</span>
          </button>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Game Cover */}
            <div className="w-full md:w-64 h-80 bg-white rounded-xl overflow-hidden shadow-2xl border-2 border-red-500">
              <img 
                src={game.image_url} 
                alt={game.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Game Info */}
            <div className="flex-1">
              <div className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase">
                {game.platform}
              </div>
              <h1 className="text-4xl font-black mb-4 text-white drop-shadow-lg">
                {game.name}
              </h1>
              <p className="text-gray-700 mb-6 leading-relaxed max-w-2xl">
                {game.description}
              </p>
              
              <div className="flex items-center gap-6 bg-white p-6 rounded-xl border-2 border-red-200 shadow-lg">
                <div>
                  <div className="text-sm text-gray-600 mb-1">ราคาเริ่มต้น</div>
                  <div className="text-3xl font-bold text-red-600">
                    ฿{Number(game.price).toLocaleString()}
                  </div>
                </div>
                <div className="h-12 w-px bg-red-200"></div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">ไอดีทั้งหมด</div>
                  <div className="text-3xl font-bold text-red-600 flex items-center gap-2">
                    <Package size={28} />
                    {stocks.length} รายการ
                  </div>
                </div>
              </div>

              {/* ส่วนใส่คูปอง */}
              <div className="mt-6 bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border-2 border-red-300 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <Ticket className="text-red-600" size={20} />
                  <h3 className="text-lg font-bold text-red-600">ใช้คูปองส่วนลด</h3>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="กรอกโค้ดคูปอง..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-white border-2 border-red-200 px-4 py-2 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 font-mono"
                    disabled={checkingCoupon}
                  />
                  {couponValid ? (
                    <button
                      onClick={clearCoupon}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition flex items-center gap-2"
                    >
                      <X size={18} />
                      ล้าง
                    </button>
                  ) : (
                    <button
                      onClick={handleCheckCoupon}
                      disabled={checkingCoupon || !couponCode.trim()}
                      className="bg-yellow-600 hover:bg-yellow-700 px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                    >
                      {checkingCoupon ? 'กำลังเช็ค...' : 'เช็ค'}
                    </button>
                  )}
                </div>
                {couponValid && (
                  <div className="mt-3 bg-green-900/30 border border-green-500/50 p-3 rounded-lg">
                    <p className="text-red-600 font-bold">
                      ✅ คูปองใช้ได้! ส่วนลด {couponDiscount.toLocaleString()} บาท
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      ราคาเดิม: ฿{Number(game.price).toLocaleString()} → ราคาสุทธิ: ฿{Math.max(0, Number(game.price) - couponDiscount).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* ปุ่มซื้อแบบสุ่ม */}
              {stocks.length > 0 && (
                <button
                  onClick={handleBuyRandom}
                  disabled={purchasing}
                  className="mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 px-8 py-4 rounded-xl font-bold transition active:scale-95 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {purchasing ? (
                    <>
                      <AlertCircle className="animate-spin" size={20} />
                      กำลังซื้อ...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      {couponValid 
                        ? `ซื้อแบบสุ่ม (฿${Math.max(0, Number(game.price) - couponDiscount).toLocaleString()})`
                        : `ซื้อแบบสุ่ม (฿${Number(game.price).toLocaleString()})`
                      }
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Games */}
      {similarGames.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-red-600 rounded-full"></div>
            เกมที่คล้ายกัน
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similarGames.map((similarGame) => (
              <div
                key={similarGame.game_id}
                onClick={() => {
                  navigate(`/games/${similarGame.game_id}`);
                  window.location.reload();
                }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer group"
              >
                <div className="h-32 overflow-hidden">
                  <img
                    src={similarGame.image_url}
                    alt={similarGame.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-sm text-gray-800 truncate">{similarGame.name}</h4>
                  <p className="text-xs text-red-600 font-bold mt-1">฿{Number(similarGame.price || 0).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <ReviewSection 
          gameId={id} 
          userId={localStorage.getItem('token') ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])).user_id : null}
        />
      </div>

      {/* Stock Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <div className="w-1 h-8 bg-red-600 rounded-full"></div>
          รายการไอดีที่มีจำหน่าย (เลือกซื้อเฉพาะชิ้น)
        </h2>

        {stocks.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 text-xl">ไอดีหมดชั่วคราว กรุณาติดตามอัปเดต</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stocks.map((stock) => (
              <div 
                key={stock.code_id}
                className="bg-white rounded-2xl overflow-hidden border border-red-200 hover:border-red-500 transition duration-300 group shadow-lg hover:shadow-red-500/20"
              >
                {/* Image */}
                <div className="h-48 bg-gray-700 relative overflow-hidden">
                  {stock.image_url ? (
                    <img 
                      src={stock.image_url}
                      alt={stock.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-600" />
                    </div>
                  )}
                  
                  {/* Quick View Button */}
                  <button
                    onClick={() => openDetailModal(stock)}
                    className="absolute top-3 right-3 bg-black/80 p-2 rounded-lg hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                    title="ดูรายละเอียด"
                  >
                    <Eye size={18} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 truncate group-hover:text-red-400 transition">
                    {stock.title || `${game.name} ID`}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 h-10 line-clamp-2">
                    {stock.description || 'พร้อมใช้งานทันที'}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-black text-red-400">
                      ฿{Number(stock.price).toLocaleString()}
                    </div>
                    <button
                      onClick={() => handleBuySpecific(stock.code_id)}
                      disabled={purchasing}
                      className="bg-red-600 hover:bg-red-700 text-gray-900 px-4 py-2 rounded-xl font-bold transition active:scale-95 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart size={18} />
                      ซื้อ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedStock && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeDetailModal}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-red-500/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className="h-80 bg-gradient-to-br from-red-50 to-gray-100 relative">
              {selectedStock.image_url ? (
                <img 
                  src={selectedStock.image_url}
                  alt={selectedStock.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-32 h-32 text-gray-600" />
                </div>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <h2 className="text-3xl font-black mb-4 text-red-400">
                {selectedStock.title || `${game.name} ID`}
              </h2>
              
              <div className="bg-gradient-to-br from-red-50 to-gray-100/50 p-4 rounded-xl mb-6 border border-red-200">
                <div className="text-sm text-gray-600 mb-2">รายละเอียดไอดี</div>
                <p className="text-gray-900 leading-relaxed whitespace-pre-line">
                  {selectedStock.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                </p>
              </div>

              <div className="flex items-center justify-between bg-gradient-to-r from-red-900/50 to-pink-900/50 p-6 rounded-xl mb-4 border border-red-500/30">
                <div>
                  <div className="text-sm text-gray-600 mb-1">ราคา</div>
                  {couponValid ? (
                    <div>
                      <div className="text-lg text-gray-600 line-through mb-1">
                        ฿{Number(selectedStock.price).toLocaleString()}
                      </div>
                      <div className="text-4xl font-black text-red-400">
                        ฿{Math.max(0, Number(selectedStock.price) - couponDiscount).toLocaleString()}
                      </div>
                      <div className="text-sm text-red-600 mt-1">
                        ส่วนลด ฿{couponDiscount.toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-4xl font-black text-red-400">
                      ฿{Number(selectedStock.price).toLocaleString()}
                    </div>
                  )}
                </div>
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>

              {/* ส่วนใส่คูปองใน Modal */}
              <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl mb-6 border-2 border-red-300 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <Ticket className="text-red-600" size={18} />
                  <h3 className="text-sm font-bold text-red-600">ใช้คูปองส่วนลด</h3>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="กรอกโค้ดคูปอง..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-white border-2 border-red-200 px-3 py-2 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 font-mono text-sm"
                    disabled={checkingCoupon}
                  />
                  {couponValid ? (
                    <button
                      onClick={clearCoupon}
                      className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition flex items-center gap-1 text-sm"
                    >
                      <X size={16} />
                      ล้าง
                    </button>
                  ) : (
                    <button
                      onClick={handleCheckCoupon}
                      disabled={checkingCoupon || !couponCode.trim()}
                      className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm"
                    >
                      {checkingCoupon ? '...' : 'เช็ค'}
                    </button>
                  )}
                </div>
                {couponValid && (
                  <div className="mt-2 bg-green-900/30 border border-green-500/50 p-2 rounded-lg">
                    <p className="text-red-600 font-bold text-sm">
                      ✅ ส่วนลด {couponDiscount.toLocaleString()} บาท
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={closeDetailModal}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-900 py-3 rounded-xl font-bold transition"
                >
                  ปิด
                </button>
                <button
                  onClick={() => handleBuySpecific(selectedStock.code_id)}
                  disabled={purchasing}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-gray-900 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {purchasing ? (
                    <>
                      <AlertCircle className="animate-spin" size={20} />
                      กำลังซื้อ...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      {couponValid 
                        ? `ซื้อเลย (฿${Math.max(0, Number(selectedStock.price) - couponDiscount).toLocaleString()})`
                        : 'ซื้อเลย'
                      }
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameDetail;