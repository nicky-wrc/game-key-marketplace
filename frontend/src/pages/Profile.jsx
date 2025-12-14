import { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Mail, Shield, Lock, CreditCard, ShoppingBag, LogOut, Save, ArrowLeft, Heart, MessageSquare, Star, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/ToastContainer';
import StarRating from '../components/StarRating';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ totalSpent: 0, totalItems: 0 });
  const [wishlistGames, setWishlistGames] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  
  // Form เปลี่ยนรหัสผ่าน
  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  
  // Form แก้ไข Profile
  const [profileForm, setProfileForm] = useState({ username: '', email: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
    fetchHistoryStats();
    fetchWishlist();
    fetchReviews();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get('http://localhost:5000/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlistGames(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromWishlist = async (gameId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/wishlist/${gameId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('ลบออกจากรายการโปรดแล้ว', 'info');
      fetchWishlist();
    } catch (err) {
      showToast(err.response?.data?.error || 'เกิดข้อผิดพลาด', 'error');
    }
  };

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get('http://localhost:5000/api/reviews/user/my-reviews', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('ยืนยันการลบรีวิวนี้?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('ลบรีวิวสำเร็จ', 'success');
      fetchReviews();
    } catch (err) {
      showToast(err.response?.data?.error || 'เกิดข้อผิดพลาด', 'error');
    }
  };

  const handleUpdateReview = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/reviews/${reviewId}`, {
        rating: editRating,
        comment: editComment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('แก้ไขรีวิวสำเร็จ', 'success');
      setEditingReview(null);
      fetchReviews();
    } catch (err) {
      showToast(err.response?.data?.error || 'เกิดข้อผิดพลาด', 'error');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/auth/profile', profileForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('อัพเดทโปรไฟล์สำเร็จ', 'success');
      setProfile(res.data.user);
      setProfileForm({ username: '', email: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'เกิดข้อผิดพลาด', 'error');
    }
  };

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { 
        navigate('/login'); 
        return; 
      }

      // ดึง profile data
      const res = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // ถ้า profile มี wallet_balance อยู่แล้วใช้เลย
      if (res.data && res.data.wallet_balance !== undefined) {
        setProfile(res.data);
      } else {
        // ถ้าไม่มี wallet_balance ให้ดึงแยก
        try {
          const walletRes = await axios.get('http://localhost:5000/api/wallet/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProfile({ ...res.data, wallet_balance: walletRes.data.wallet_balance || 0 });
        } catch (walletErr) {
          // ถ้า wallet API error ให้ใช้ค่า default
          setProfile({ ...res.data, wallet_balance: 0 });
        }
      }
    } catch (err) { 
      console.error('Profile fetch error:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        showToast('กรุณาเข้าสู่ระบบใหม่', 'warning');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        showToast('ไม่สามารถโหลดข้อมูลได้', 'error');
      }
    }
  };

  const fetchHistoryStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/transactions/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // คำนวณยอดซื้อรวม และจำนวนของที่ซื้อ
      const history = res.data;
      const spent = history.reduce((sum, item) => sum + parseFloat(item.amount), 0);
      setStats({ totalSpent: spent, totalItems: history.length });
    } catch (err) { console.error(err); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      showToast('รหัสผ่านใหม่ไม่ตรงกัน', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/auth/change-password', {
        oldPassword: passForm.oldPassword,
        newPassword: passForm.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showToast('เปลี่ยนรหัสผ่านสำเร็จ!', 'success');
      setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-2">
            <User className="w-8 h-8 text-red-600" /> ข้อมูลส่วนตัว (My Profile)
          </h1>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition bg-white px-4 py-2 rounded-lg hover:bg-gray-50 shadow-sm border border-gray-200">
            <ArrowLeft size={20} /> กลับหน้าหลัก
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Profile Card */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-red-600 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-red-100">
                    <User className="w-12 h-12 text-gray-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{profile.username}</h2>
                <p className="text-gray-500 text-sm mb-4">{profile.email}</p>
                
                <div className="inline-block bg-gray-100 px-4 py-1 rounded-full text-xs font-bold text-gray-600 uppercase tracking-wider mb-6">
                    MEMBER ROLE: <span className={profile.user_id === 1 || profile.role === 'admin' ? "text-red-600" : "text-blue-600"}>
                        {profile.role || 'USER'}
                    </span>
                </div>

                <button onClick={handleLogout} className="w-full bg-red-50 text-red-600 py-2 rounded-lg font-bold hover:bg-red-100 transition flex items-center justify-center gap-2">
                    <LogOut size={18} /> ออกจากระบบ
                </button>
            </div>

            {/* Wallet Summary */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg text-white">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">ยอดเงินคงเหลือ</span>
                    <CreditCard className="text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-yellow-400">฿{Number(profile.wallet_balance).toLocaleString()}</div>
                <button onClick={() => navigate('/topup')} className="mt-4 w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm font-bold transition">
                    + เติมเงินเพิ่ม
                </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Stats & Edit Password */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><ShoppingBag size={20} /></div>
                        <span className="text-gray-500 text-sm font-bold">สินค้าที่ซื้อไป</span>
                    </div>
                    <div className="text-2xl font-black text-gray-800">{stats.totalItems} รายการ</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600"><CreditCard size={20} /></div>
                        <span className="text-gray-500 text-sm font-bold">ยอดใช้จ่ายรวม</span>
                    </div>
                    <div className="text-2xl font-black text-gray-800">฿{stats.totalSpent.toLocaleString()}</div>
                </div>
            </div>

            {/* Edit Profile Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <User className="text-red-600" size={20} /> แก้ไขข้อมูลส่วนตัว
                </h3>
                <div className="space-y-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
                            placeholder={profile.username}
                            value={profileForm.username}
                            onChange={e => setProfileForm({...profileForm, username: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                        <input 
                            type="email" 
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
                            placeholder={profile.email}
                            value={profileForm.email}
                            onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                        />
                    </div>
                    <button 
                        onClick={handleUpdateProfile}
                        disabled={!profileForm.username && !profileForm.email}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        บันทึกการเปลี่ยนแปลง
                    </button>
                </div>
            </div>

            {/* Change Password Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Lock className="text-red-600" size={20} /> เปลี่ยนรหัสผ่าน
                </h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านเดิม</label>
                        <input type="password" required 
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
                            value={passForm.oldPassword}
                            onChange={e => setPassForm({...passForm, oldPassword: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านใหม่</label>
                            <input type="password" required 
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
                                value={passForm.newPassword}
                                onChange={e => setPassForm({...passForm, newPassword: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่านใหม่</label>
                            <input type="password" required 
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
                                value={passForm.confirmPassword}
                                onChange={e => setPassForm({...passForm, confirmPassword: e.target.value})}
                            />
                        </div>
                    </div>
                    
                    <button type="submit" className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition flex items-center gap-2">
                        <Save size={18} /> บันทึกการเปลี่ยนแปลง
                    </button>
                </form>
            </div>

            {/* Wishlist Section */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Heart className="text-red-600 fill-current" size={20} /> รายการโปรดของฉัน
                </h3>
                {wishlistGames.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">ยังไม่มีเกมในรายการโปรด</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlistGames.map((game) => (
                      <div 
                        key={game.game_id}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-red-500 transition cursor-pointer group"
                        onClick={() => navigate(`/games/${game.game_id}`)}
                      >
                        <div className="flex items-start gap-3">
                          <img 
                            src={game.image_url} 
                            alt={game.name}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-800 truncate mb-1">{game.name}</h4>
                            <p className="text-xs text-gray-500 mb-2">{game.platform}</p>
                            {game.avg_rating > 0 && (
                              <div className="flex items-center gap-1 mb-2">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-xs text-gray-500">
                                  {parseFloat(game.avg_rating).toFixed(1)} ({game.review_count || 0})
                                </span>
                              </div>
                            )}
                            <p className="text-red-600 font-bold">฿{Number(game.price).toLocaleString()}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromWishlist(game.game_id);
                            }}
                            className="text-gray-400 hover:text-red-600 transition"
                            title="ลบออกจากรายการโปรด"
                          >
                            <Heart size={18} className="fill-current text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* My Reviews Section */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <MessageSquare className="text-red-600" size={20} /> รีวิวของฉัน
                </h3>
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">ยังไม่มีรีวิว</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.review_id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        {editingReview === review.review_id ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">คะแนน</label>
                              <StarRating
                                rating={editRating}
                                interactive={true}
                                onRatingChange={setEditRating}
                                size={24}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">ความคิดเห็น</label>
                              <textarea
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
                                rows={3}
                              />
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleUpdateReview(review.review_id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition"
                              >
                                บันทึก
                              </button>
                              <button
                                onClick={() => {
                                  setEditingReview(null);
                                  setEditComment('');
                                  setEditRating(5);
                                }}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-400 transition"
                              >
                                ยกเลิก
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={review.game_image}
                                  alt={review.game_name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div>
                                  <h4 className="font-bold text-gray-800">{review.game_name}</h4>
                                  <p className="text-sm text-gray-500">{review.platform}</p>
                                </div>
                              </div>
                              <StarRating rating={review.rating} size={20} />
                            </div>
                            {review.comment && (
                              <p className="text-gray-700 mb-4 whitespace-pre-wrap">{review.comment}</p>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {new Date(review.created_at).toLocaleDateString('th-TH', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingReview(review.review_id);
                                    setEditRating(review.rating);
                                    setEditComment(review.comment || '');
                                  }}
                                  className="text-blue-600 hover:text-blue-700 transition flex items-center gap-1 text-sm"
                                >
                                  <Edit size={16} />
                                  แก้ไข
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(review.review_id)}
                                  className="text-red-600 hover:text-red-700 transition flex items-center gap-1 text-sm"
                                >
                                  <Trash2 size={16} />
                                  ลบ
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;