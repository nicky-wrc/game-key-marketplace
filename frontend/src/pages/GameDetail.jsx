import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingCart, Package, Eye, CheckCircle, AlertCircle } from 'lucide-react';

function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [game, setGame] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchGameDetail();
    fetchGameStocks();
  }, [id]);

  const fetchGameDetail = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/games');
      const foundGame = res.data.find(g => g.game_id === parseInt(id));
      setGame(foundGame);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGameStocks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/games/${id}/stock`);
      setStocks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 ฟังก์ชันซื้อไอดีเฉพาะชิ้น (ส่ง code_id)
  const handleBuySpecific = async (codeId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('กรุณาเข้าสู่ระบบก่อนซื้อสินค้า');
      navigate('/login');
      return;
    }

    if (!window.confirm('ยืนยันการซื้อไอดีนี้?')) return;

    setPurchasing(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/transactions/buy',
        { code_id: codeId }, // ส่ง code_id แทน game_id
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert(`ซื้อสำเร็จ! 🎉\nรหัสเกมของคุณคือ:\n${res.data.game_code}`);
      fetchGameStocks(); // รีเฟรชสต็อก
      closeDetailModal();
    } catch (err) {
      alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการซื้อ');
    } finally {
      setPurchasing(false);
    }
  };

  // 🔹 ฟังก์ชันซื้อแบบสุ่ม (ส่ง game_id)
  const handleBuyRandom = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('กรุณาเข้าสู่ระบบก่อนซื้อสินค้า');
      navigate('/login');
      return;
    }

    if (!window.confirm('ยืนยันการซื้อแบบสุ่ม?')) return;

    setPurchasing(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/transactions/buy',
        { game_id: id }, // ส่ง game_id สำหรับสุ่ม
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert(`ซื้อสำเร็จ! 🎉\nรหัสเกมของคุณคือ:\n${res.data.game_code}`);
      fetchGameStocks();
    } catch (err) {
      alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการซื้อ');
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">ไม่พบข้อมูลเกมนี้</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 to-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
          >
            <ArrowLeft size={20} />
            <span>กลับหน้าหลัก</span>
          </button>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Game Cover */}
            <div className="w-full md:w-64 h-80 bg-gray-800 rounded-xl overflow-hidden shadow-2xl border-2 border-red-500/30">
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
              <h1 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-600">
                {game.name}
              </h1>
              <p className="text-gray-400 mb-6 leading-relaxed max-w-2xl">
                {game.description}
              </p>
              
              <div className="flex items-center gap-6 bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <div>
                  <div className="text-sm text-gray-400 mb-1">ราคาเริ่มต้น</div>
                  <div className="text-3xl font-bold text-red-400">
                    ฿{Number(game.price).toLocaleString()}
                  </div>
                </div>
                <div className="h-12 w-px bg-gray-700"></div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">ไอดีทั้งหมด</div>
                  <div className="text-3xl font-bold text-green-400 flex items-center gap-2">
                    <Package size={28} />
                    {stocks.length} รายการ
                  </div>
                </div>
              </div>

              {/* ปุ่มซื้อแบบสุ่ม */}
              {stocks.length > 0 && (
                <button
                  onClick={handleBuyRandom}
                  disabled={purchasing}
                  className="mt-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold transition active:scale-95 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {purchasing ? (
                    <>
                      <AlertCircle className="animate-spin" size={20} />
                      กำลังซื้อ...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      ซื้อแบบสุ่ม (฿{Number(game.price).toLocaleString()})
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
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
            <p className="text-gray-400 text-xl">ไอดีหมดชั่วคราว กรุณาติดตามอัปเดต</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stocks.map((stock) => (
              <div 
                key={stock.code_id}
                className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-red-500 transition duration-300 group shadow-lg hover:shadow-red-500/20"
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
                  
                  <p className="text-sm text-gray-400 mb-4 h-10 line-clamp-2">
                    {stock.description || 'พร้อมใช้งานทันที'}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-black text-red-400">
                      ฿{Number(stock.price).toLocaleString()}
                    </div>
                    <button
                      onClick={() => handleBuySpecific(stock.code_id)}
                      disabled={purchasing}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold transition active:scale-95 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-red-500/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className="h-80 bg-gray-900 relative">
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
              
              <div className="bg-gray-900/50 p-4 rounded-xl mb-6 border border-gray-700">
                <div className="text-sm text-gray-400 mb-2">รายละเอียดไอดี</div>
                <p className="text-white leading-relaxed whitespace-pre-line">
                  {selectedStock.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                </p>
              </div>

              <div className="flex items-center justify-between bg-gradient-to-r from-red-900/50 to-pink-900/50 p-6 rounded-xl mb-6 border border-red-500/30">
                <div>
                  <div className="text-sm text-gray-400 mb-1">ราคา</div>
                  <div className="text-4xl font-black text-red-400">
                    ฿{Number(selectedStock.price).toLocaleString()}
                  </div>
                </div>
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={closeDetailModal}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-bold transition"
                >
                  ปิด
                </button>
                <button
                  onClick={() => handleBuySpecific(selectedStock.code_id)}
                  disabled={purchasing}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {purchasing ? (
                    <>
                      <AlertCircle className="animate-spin" size={20} />
                      กำลังซื้อ...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      ซื้อเลย
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