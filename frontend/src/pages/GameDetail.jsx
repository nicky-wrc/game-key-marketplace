import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingCart, Package, Eye, CheckCircle, AlertCircle, Ticket, X, Heart, Star, MessageSquare } from 'lucide-react';
import { showToast } from '../components/ToastContainer';
import StarRating from '../components/StarRating';
import ReviewCard from '../components/ReviewCard';

function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [game, setGame] = useState(null);
  const [relatedGames, setRelatedGames] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponValid, setCouponValid] = useState(false);
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchGameDetail();
    fetchGameStocks();
    fetchReviews();
    if (user) {
      checkWishlist();
    }
  }, [id]);

  const fetchGameDetail = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/games/${id}`);
      setGame(res.data.game);
      setRelatedGames(res.data.relatedGames || []);
    } catch (err) {
      console.error(err);
    }
  };

  const checkWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get(`http://localhost:5000/api/wishlist/check/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInWishlist(res.data.inWishlist);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      showToast('กรุณาเข้าสู่ระบบก่อน', 'warning');
      navigate('/login');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:5000/api/wishlist/toggle/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInWishlist(res.data.inWishlist);
      showToast(res.data.message, 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'เกิดข้อผิดพลาด', 'error');
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewLoading(true);
      const res = await axios.get(`http://localhost:5000/api/reviews/game/${id}`);
      setReviews(res.data.reviews);
      setReviewStats(res.data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      showToast('กรุณาเข้าสู่ระบบก่อน', 'warning');
      navigate('/login');
      return;
    }

    if (!reviewRating) {
      showToast('กรุณาให้คะแนน', 'warning');
      return;
    }

    setSubmittingReview(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/reviews/game/${id}`, {
        rating: reviewRating,
        comment: reviewComment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('รีวิวสำเร็จ!', 'success');
      setShowReviewForm(false);
      setReviewComment('');
      setReviewRating(5);
      fetchReviews();
    } catch (err) {
      showToast(err.response?.data?.error || 'เกิดข้อผิดพลาด', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    try {
      await axios.post(`http://localhost:5000/api/reviews/${reviewId}/helpful`);
      fetchReviews();
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

  // 🔹 ฟังก์ชันเช็คคูปอง
  const handleCheckCoupon = async () => {
    if (!couponCode.trim()) {
      showToast('กรุณากรอกโค้ดคูปอง', 'warning');
      return;
    }

    setCheckingCoupon(true);
    try {
      const res = await axios.post('http://localhost:5000/api/coupons/check', {
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
      const res = await axios.post(
        'http://localhost:5000/api/transactions/buy',
        { 
          code_id: codeId,
          coupon_code: couponValid ? couponCode.toUpperCase() : null
        },
        { headers: { Authorization: `Bearer ${token}` } }
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
      const res = await axios.post(
        'http://localhost:5000/api/transactions/buy',
        { 
          game_id: id,
          coupon_code: couponValid ? couponCode.toUpperCase() : null
        },
        { headers: { Authorization: `Bearer ${token}` } }
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-800 text-xl">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-800 text-xl">ไม่พบข้อมูลเกมนี้</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-red-800 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-200 hover:text-white transition mb-4"
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
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {game.platform}
                </div>
                {game.category_name_th && (
                  <div className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {game.category_name_th}
                  </div>
                )}
                {game.avg_rating > 0 && (
                  <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-400/50">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 font-bold text-sm">
                      {parseFloat(game.avg_rating).toFixed(1)}
                    </span>
                    <span className="text-gray-300 text-xs">
                      ({game.review_count || 0})
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl font-black text-white">
                  {game.name}
                </h1>
                {user && (
                  <button
                    onClick={toggleWishlist}
                    className={`p-3 rounded-full transition ${
                      inWishlist
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    title={inWishlist ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
                  >
                    <Heart size={24} className={inWishlist ? 'fill-current' : ''} />
                  </button>
                )}
              </div>
              <p className="text-gray-200 mb-6 leading-relaxed max-w-2xl">
                {game.description}
              </p>
              
              <div className="flex items-center gap-6 bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div>
                  <div className="text-sm text-gray-300 mb-1">ราคาเริ่มต้น</div>
                  <div className="text-3xl font-black text-white">
                    ฿{Number(game.price).toLocaleString()}
                  </div>
                </div>
                <div className="h-12 w-px bg-white/30"></div>
                <div>
                  <div className="text-sm text-gray-300 mb-1">ไอดีทั้งหมด</div>
                  <div className="text-3xl font-black text-white flex items-center gap-2">
                    <Package size={28} />
                    {stocks.length} รายการ
                  </div>
                </div>
              </div>

              {/* ส่วนใส่คูปอง */}
              <div className="mt-6 bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border-2 border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <Ticket className="text-red-600" size={20} />
                  <h3 className="text-lg font-bold text-gray-800">ใช้คูปองส่วนลด</h3>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="กรอกโค้ดคูปอง..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-white border-2 border-gray-300 px-4 py-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-500 font-mono font-bold"
                    disabled={checkingCoupon}
                  />
                  {couponValid ? (
                    <button
                      onClick={clearCoupon}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 font-bold"
                    >
                      <X size={18} />
                      ล้าง
                    </button>
                  ) : (
                    <button
                      onClick={handleCheckCoupon}
                      disabled={checkingCoupon || !couponCode.trim()}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                    >
                      {checkingCoupon ? 'กำลังเช็ค...' : 'เช็ค'}
                    </button>
                  )}
                </div>
                {couponValid && (
                  <div className="mt-3 bg-green-100 border-2 border-green-300 p-3 rounded-lg">
                    <p className="text-green-700 font-bold">
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
                  className="mt-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl font-black transition active:scale-95 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-red-500"
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

      {/* Stock Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
          <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
          รายการไอดีที่มีจำหน่าย (เลือกซื้อเฉพาะชิ้น)
        </h2>

        {stocks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-gray-200">
            <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-xl">ไอดีหมดชั่วคราว กรุณาติดตามอัปเดต</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stocks.map((stock) => (
              <div 
                key={stock.code_id}
                className="bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-red-500 transition duration-300 group shadow-lg hover:shadow-red-500/20"
              >
                {/* Image */}
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  {stock.image_url ? (
                    <img 
                      src={stock.image_url}
                      alt={stock.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Quick View Button */}
                  <button
                    onClick={() => openDetailModal(stock)}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-lg hover:bg-red-600 hover:text-white text-gray-800 transition opacity-0 group-hover:opacity-100 shadow-lg"
                    title="ดูรายละเอียด"
                  >
                    <Eye size={18} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 truncate text-gray-800 group-hover:text-red-600 transition">
                    {stock.title || `${game.name} ID`}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 h-10 line-clamp-2">
                    {stock.description || 'พร้อมใช้งานทันที'}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-black text-red-600">
                      ฿{Number(stock.price).toLocaleString()}
                    </div>
                    <button
                      onClick={() => handleBuySpecific(stock.code_id)}
                      disabled={purchasing}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-xl font-black transition active:scale-95 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border-2 border-red-500"
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

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
            <MessageSquare className="w-6 h-6 text-red-600" />
            รีวิวจากผู้ใช้
            {reviewStats && (
              <span className="text-lg text-gray-500 font-normal">
                ({reviewStats.total_reviews || 0} รีวิว)
              </span>
            )}
          </h2>
          {user && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2 rounded-xl font-black transition shadow-lg border-2 border-red-500"
            >
              เขียนรีวิว
            </button>
          )}
        </div>

        {/* Review Stats */}
        {reviewStats && reviewStats.total_reviews > 0 && (
          <div className="bg-white rounded-xl p-6 mb-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-5xl font-black text-yellow-500 mb-2">
                  {parseFloat(reviewStats.avg_rating).toFixed(1)}
                </div>
                <StarRating rating={parseFloat(reviewStats.avg_rating)} size={24} />
                <div className="text-sm text-gray-500 mt-2">
                  จาก {reviewStats.total_reviews} รีวิว
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviewStats[`${star}_star`] || 0;
                  const percentage = reviewStats.total_reviews > 0 
                    ? (count / reviewStats.total_reviews) * 100 
                    : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-20">
                        <span className="text-sm text-gray-600">{star}</span>
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && (
          <div className="bg-white rounded-xl p-6 mb-6 border-2 border-gray-200 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800">เขียนรีวิว</h3>
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-2 font-bold">คะแนน</label>
              <StarRating
                rating={reviewRating}
                interactive={true}
                onRatingChange={setReviewRating}
                size={32}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-2 font-bold">ความคิดเห็น</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="เขียนรีวิวของคุณ..."
                className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-500"
                rows={4}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2 rounded-lg font-black transition disabled:opacity-50 shadow-lg border-2 border-red-500"
              >
                {submittingReview ? 'กำลังส่ง...' : 'ส่งรีวิว'}
              </button>
              <button
                onClick={() => {
                  setShowReviewForm(false);
                  setReviewComment('');
                  setReviewRating(5);
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-bold transition"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        )}

        {/* Reviews List */}
        {reviewLoading ? (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-gray-200">
            <div className="text-gray-600">กำลังโหลดรีวิว...</div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-gray-200">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">ยังไม่มีรีวิว</p>
            {user && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="mt-4 text-red-600 hover:text-red-700 font-bold"
              >
                เขียนรีวิวแรก
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.review_id}
                review={review}
                onHelpful={handleMarkHelpful}
              />
            ))}
          </div>
        )}
      </div>

      {/* Related Games */}
      {relatedGames.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
            <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
            เกมที่คุณอาจสนใจ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {relatedGames.map((relatedGame) => (
              <div
                key={relatedGame.game_id}
                onClick={() => navigate(`/games/${relatedGame.game_id}`)}
                className="bg-white rounded-xl overflow-hidden border-2 border-gray-200 hover:border-red-500 transition cursor-pointer group shadow-lg hover:shadow-red-500/20"
              >
                <div className="h-32 overflow-hidden">
                  <img
                    src={relatedGame.image_url}
                    alt={relatedGame.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-2 line-clamp-2 text-gray-800 group-hover:text-red-600 transition">
                    {relatedGame.name}
                  </h3>
                  {relatedGame.avg_rating > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs text-gray-500">
                        {parseFloat(relatedGame.avg_rating).toFixed(1)}
                      </span>
                    </div>
                  )}
                  <div className="text-red-600 font-black">
                    ฿{Number(relatedGame.price).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedStock && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeDetailModal}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-red-500 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className="h-80 bg-gray-100 relative">
              {selectedStock.image_url ? (
                <img 
                  src={selectedStock.image_url}
                  alt={selectedStock.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-32 h-32 text-gray-400" />
                </div>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <h2 className="text-3xl font-black mb-4 text-gray-800 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
                {selectedStock.title || `${game.name} ID`}
              </h2>
              
              <div className="bg-gray-50 p-4 rounded-xl mb-6 border-2 border-gray-200">
                <div className="text-sm text-gray-600 mb-2 font-bold">รายละเอียดไอดี</div>
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {selectedStock.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                </p>
              </div>

              <div className="flex items-center justify-between bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl mb-4 border-2 border-red-200">
                <div>
                  <div className="text-sm text-gray-600 mb-1 font-bold">ราคา</div>
                  {couponValid ? (
                    <div>
                      <div className="text-lg text-gray-500 line-through mb-1">
                        ฿{Number(selectedStock.price).toLocaleString()}
                      </div>
                      <div className="text-4xl font-black text-red-600">
                        ฿{Math.max(0, Number(selectedStock.price) - couponDiscount).toLocaleString()}
                      </div>
                      <div className="text-sm text-green-600 mt-1 font-bold">
                        ส่วนลด ฿{couponDiscount.toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-4xl font-black text-red-600">
                      ฿{Number(selectedStock.price).toLocaleString()}
                    </div>
                  )}
                </div>
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>

              {/* ส่วนใส่คูปองใน Modal */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl mb-6 border-2 border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <Ticket className="text-red-600" size={18} />
                  <h3 className="text-sm font-bold text-gray-800">ใช้คูปองส่วนลด</h3>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="กรอกโค้ดคูปอง..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-white border-2 border-gray-300 px-3 py-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-500 font-mono text-sm font-bold"
                    disabled={checkingCoupon}
                  />
                  {couponValid ? (
                    <button
                      onClick={clearCoupon}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition flex items-center gap-1 text-sm font-bold"
                    >
                      <X size={16} />
                      ล้าง
                    </button>
                  ) : (
                    <button
                      onClick={handleCheckCoupon}
                      disabled={checkingCoupon || !couponCode.trim()}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm"
                    >
                      {checkingCoupon ? '...' : 'เช็ค'}
                    </button>
                  )}
                </div>
                {couponValid && (
                  <div className="mt-2 bg-green-100 border-2 border-green-300 p-2 rounded-lg">
                    <p className="text-green-700 font-bold text-sm">
                      ✅ ส่วนลด {couponDiscount.toLocaleString()} บาท
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={closeDetailModal}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-bold transition"
                >
                  ปิด
                </button>
                <button
                  onClick={() => handleBuySpecific(selectedStock.code_id)}
                  disabled={purchasing}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-xl font-black transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border-2 border-red-500"
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