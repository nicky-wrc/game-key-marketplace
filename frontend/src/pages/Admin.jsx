import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Database, ShieldAlert, Package, ArrowLeft, Edit2, Trash2, Eye, X, Ticket, BarChart3, Gift, Gamepad2, CreditCard, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/ToastContainer';

function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [games, setGames] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [gachaBoxes, setGachaBoxes] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [editingGame, setEditingGame] = useState(null);
  const [editingStock, setEditingStock] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [editingGachaBox, setEditingGachaBox] = useState(null);
  const navigate = useNavigate();
  
  // State เพิ่มเกม
  const [gameForm, setGameForm] = useState({ 
    name: '', platform: '', description: '', price: '', imageFile: null 
  });
  
  // State เติมของ
  const [stockForm, setStockForm] = useState({ 
    game_id: '', code: '', price: '', 
    title: '', description: '', imageFile: null, is_public: false 
  });

  // State เพิ่มคูปอง
  const [couponForm, setCouponForm] = useState({ 
    code: '', discount_amount: '', usage_limit: '' 
  });

  // State เพิ่ม Gacha Box
  const [gachaBoxForm, setGachaBoxForm] = useState({ 
    name: '', description: '', price: '', imageFile: null 
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      alert('หน้านี้สำหรับผู้ดูแลระบบเท่านั้น!');
      navigate('/');
      return;
    }
    fetchGames();
    fetchStocks();
    fetchCoupons();
    fetchGachaBoxes();
    fetchDashboardStats();
  }, []);

  const fetchGames = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/games', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGames(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchStocks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/stocks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStocks(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/coupons', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCoupons(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchGachaBoxes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/gacha-boxes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGachaBoxes(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardStats(res.data);
    } catch (err) { console.error(err); }
  };

  // ===== เพิ่มเกม =====
  const handleAddGame = async (e) => {
    e.preventDefault();
    if(!confirm('ยืนยันการเพิ่มเกมใหม่?')) return;
    
    const formData = new FormData();
    formData.append('name', gameForm.name);
    formData.append('platform', gameForm.platform);
    formData.append('description', gameForm.description);
    formData.append('price', gameForm.price);
    if (gameForm.imageFile) formData.append('image', gameForm.imageFile);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/add-game', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('เพิ่มเกมสำเร็จ! 🎉', 'success');
      setGameForm({ name: '', platform: '', description: '', price: '', imageFile: null }); 
      fetchGames(); 
    } catch (err) { 
      showToast(err.response?.data?.message || 'เพิ่มเกมไม่สำเร็จ', 'error'); 
    }
  };

  // ===== แก้ไขเกม =====
  const handleUpdateGame = async (e) => {
    e.preventDefault();
    if(!confirm('ยืนยันการแก้ไขเกมนี้?')) return;
    
    const formData = new FormData();
    formData.append('name', editingGame.name);
    formData.append('platform', editingGame.platform);
    formData.append('description', editingGame.description);
    formData.append('price', editingGame.price);
    formData.append('existing_image', editingGame.image_url);
    if (editingGame.newImageFile) formData.append('image', editingGame.newImageFile);

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/games/${editingGame.game_id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('แก้ไขเกมสำเร็จ! ✅', 'success');
      setEditingGame(null);
      fetchGames();
    } catch (err) {
      showToast(err.response?.data?.message || 'แก้ไขไม่สำเร็จ', 'error');
    }
  };

  // ===== ลบเกม =====
  const handleDeleteGame = async (id, name) => {
    if(!confirm(`ยืนยันการลบเกม "${name}"?\n⚠️ สต็อกที่เกี่ยวข้องจะถูกลบด้วย!`)) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/games/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('ลบเกมสำเร็จ! 🗑️', 'success');
      fetchGames();
      fetchStocks();
    } catch (err) {
      showToast(err.response?.data?.message || 'ลบไม่สำเร็จ', 'error');
    }
  };

  // ===== เพิ่มสต็อก =====
  const handleAddStock = async (e) => {
    e.preventDefault();
    if(!stockForm.game_id) {
      showToast('กรุณาเลือกเกมก่อน', 'warning');
      return;
    }
    
    const formData = new FormData();
    formData.append('game_id', stockForm.game_id);
    formData.append('code', stockForm.code);
    formData.append('price', stockForm.price);
    formData.append('is_public', stockForm.is_public);
    
    if (stockForm.is_public) {
        formData.append('title', stockForm.title);
        formData.append('description', stockForm.description);
        if (stockForm.imageFile) formData.append('image', stockForm.imageFile);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/add-stock', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('เพิ่มสินค้าสำเร็จ! 📦', 'success');
      setStockForm({ game_id: stockForm.game_id, code: '', price: '', title: '', description: '', imageFile: null, is_public: false });
      fetchStocks();
    } catch (err) { 
      showToast(err.response?.data?.message || 'เติมของไม่สำเร็จ', 'error'); 
    }
  };

  // ===== แก้ไขสต็อก =====
  const handleUpdateStock = async (e) => {
    e.preventDefault();
    if(!confirm('ยืนยันการแก้ไขสต็อกนี้?')) return;
    
    const formData = new FormData();
    formData.append('code', editingStock.code);
    formData.append('price', editingStock.price);
    formData.append('title', editingStock.title || '');
    formData.append('description', editingStock.description || '');
    formData.append('is_public', editingStock.is_public);
    formData.append('status', editingStock.status);
    formData.append('existing_image', editingStock.image_url);
    if (editingStock.newImageFile) formData.append('image', editingStock.newImageFile);

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/stocks/${editingStock.code_id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('แก้ไขสต็อกสำเร็จ! ✅', 'success');
      setEditingStock(null);
      fetchStocks();
    } catch (err) {
      showToast(err.response?.data?.message || 'แก้ไขไม่สำเร็จ', 'error');
    }
  };

  // ===== ลบสต็อก =====
  const handleDeleteStock = async (id) => {
    if(!confirm('ยืนยันการลบสต็อกนี้?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/stocks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('ลบสต็อกสำเร็จ! 🗑️', 'success');
      fetchStocks();
    } catch (err) {
      showToast(err.response?.data?.message || 'ลบไม่สำเร็จ', 'error');
    }
  };

  // ===== เพิ่มคูปอง =====
  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if(!confirm('ยืนยันการเพิ่มคูปองใหม่?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/add-coupon', couponForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('เพิ่มคูปองสำเร็จ! 🎫', 'success');
      setCouponForm({ code: '', discount_amount: '', usage_limit: '' });
      fetchCoupons();
    } catch (err) { 
      showToast(err.response?.data?.message || 'เพิ่มคูปองไม่สำเร็จ', 'error'); 
    }
  };

  // ===== แก้ไขคูปอง =====
  const handleUpdateCoupon = async (e) => {
    e.preventDefault();
    if(!confirm('ยืนยันการแก้ไขคูปองนี้?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/coupons/${editingCoupon.coupon_id}`, {
        code: editingCoupon.code,
        discount_amount: editingCoupon.discount_amount,
        usage_limit: editingCoupon.usage_limit
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('แก้ไขคูปองสำเร็จ! ✅', 'success');
      setEditingCoupon(null);
      fetchCoupons();
    } catch (err) {
      showToast(err.response?.data?.message || 'แก้ไขไม่สำเร็จ', 'error');
    }
  };

  // ===== ลบคูปอง =====
  const handleDeleteCoupon = async (id) => {
    if(!confirm('ยืนยันการลบคูปองนี้?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('ลบคูปองสำเร็จ! 🗑️', 'success');
      fetchCoupons();
    } catch (err) {
      showToast(err.response?.data?.message || 'ลบไม่สำเร็จ', 'error');
    }
  };

  // ===== เพิ่ม Gacha Box =====
  const handleAddGachaBox = async (e) => {
    e.preventDefault();
    if(!confirm('ยืนยันการเพิ่มกล่องใหม่?')) return;
    
    const formData = new FormData();
    formData.append('name', gachaBoxForm.name);
    formData.append('description', gachaBoxForm.description);
    formData.append('price', gachaBoxForm.price);
    if (gachaBoxForm.imageFile) formData.append('image', gachaBoxForm.imageFile);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/add-gacha-box', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('เพิ่มกล่องสำเร็จ! 🎁', 'success');
      setGachaBoxForm({ name: '', description: '', price: '', imageFile: null });
      fetchGachaBoxes();
    } catch (err) { 
      showToast(err.response?.data?.message || 'เพิ่มกล่องไม่สำเร็จ', 'error'); 
    }
  };

  // ===== แก้ไข Gacha Box =====
  const handleUpdateGachaBox = async (e) => {
    e.preventDefault();
    if(!confirm('ยืนยันการแก้ไขกล่องนี้?')) return;
    
    const formData = new FormData();
    formData.append('name', editingGachaBox.name);
    formData.append('description', editingGachaBox.description);
    formData.append('price', editingGachaBox.price);
    formData.append('existing_image', editingGachaBox.image_url);
    if (editingGachaBox.newImageFile) formData.append('image', editingGachaBox.newImageFile);

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/gacha-boxes/${editingGachaBox.box_id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('แก้ไขกล่องสำเร็จ! ✅', 'success');
      setEditingGachaBox(null);
      fetchGachaBoxes();
    } catch (err) {
      showToast(err.response?.data?.message || 'แก้ไขไม่สำเร็จ', 'error');
    }
  };

  // ===== ลบ Gacha Box =====
  const handleDeleteGachaBox = async (id) => {
    if(!confirm('ยืนยันการลบกล่องนี้?\n⚠️ ของในกล่องจะถูกลบด้วย!')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/gacha-boxes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('ลบกล่องสำเร็จ! 🗑️', 'success');
      fetchGachaBoxes();
    } catch (err) {
      showToast(err.response?.data?.message || 'ลบไม่สำเร็จ', 'error');
    }
  };

  const [balance, setBalance] = useState(0);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      
      {/* Top Bar */}
      <div className="bg-red-800 text-white text-xs py-2 px-4 flex justify-between items-center">
        <span>Admin Control Panel | ระบบจัดการร้านค้า</span>
        <div className="flex gap-4">
          <span>ยินดีต้อนรับ, {user?.username}</span>
          <button onClick={handleLogout} className="hover:text-gray-300">ออกจากระบบ</button>
        </div>
      </div>

      {/* Navbar */}
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
                ADMIN PANEL
              </p>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                <CreditCard className="w-4 h-4 text-red-600" />
                <span className="text-sm font-bold text-red-600">฿{Number(balance).toLocaleString()}</span>
              </div>
            )}
            <button onClick={() => navigate('/')} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 shadow flex items-center gap-2">
              <ArrowLeft size={16} />
              กลับหน้าร้าน
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
            <h1 className="text-4xl font-black text-gray-800 uppercase italic flex items-center gap-3">
              <ShieldAlert className="w-10 h-10 text-red-600" /> 
              Admin <span className="text-red-600">Control Panel</span>
            </h1>
          </div>
          <p className="text-gray-600 ml-6">จัดการระบบร้านค้า เกม สต็อก คูปอง และ Gacha Boxes</p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`py-4 rounded-xl font-bold flex flex-col justify-center items-center gap-2 transition text-sm shadow-lg border-2 ${
              activeTab === 'dashboard' 
                ? 'bg-gradient-to-br from-red-600 to-red-800 text-white border-red-400 shadow-red-500/30' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:bg-red-50'
            }`}
          >
            <BarChart3 size={24} /> 
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('manage-games')} 
            className={`py-4 rounded-xl font-bold flex flex-col justify-center items-center gap-2 transition text-sm shadow-lg border-2 ${
              activeTab === 'manage-games' 
                ? 'bg-gradient-to-br from-red-600 to-red-800 text-white border-red-400 shadow-red-500/30' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:bg-red-50'
            }`}
          >
            <Eye size={24} /> 
            <span>จัดการเกม</span>
          </button>
          <button 
            onClick={() => setActiveTab('add-game')} 
            className={`py-4 rounded-xl font-bold flex flex-col justify-center items-center gap-2 transition text-sm shadow-lg border-2 ${
              activeTab === 'add-game' 
                ? 'bg-gradient-to-br from-red-600 to-red-800 text-white border-red-400 shadow-red-500/30' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:bg-red-50'
            }`}
          >
            <Plus size={24} /> 
            <span>เพิ่มเกม</span>
          </button>
          <button 
            onClick={() => setActiveTab('manage-stocks')} 
            className={`py-4 rounded-xl font-bold flex flex-col justify-center items-center gap-2 transition text-sm shadow-lg border-2 ${
              activeTab === 'manage-stocks' 
                ? 'bg-gradient-to-br from-red-600 to-red-800 text-white border-red-400 shadow-red-500/30' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:bg-red-50'
            }`}
          >
            <Database size={24} /> 
            <span>จัดการสต็อก</span>
          </button>
          <button 
            onClick={() => setActiveTab('add-stock')} 
            className={`py-4 rounded-xl font-bold flex flex-col justify-center items-center gap-2 transition text-sm shadow-lg border-2 ${
              activeTab === 'add-stock' 
                ? 'bg-gradient-to-br from-red-600 to-red-800 text-white border-red-400 shadow-red-500/30' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:bg-red-50'
            }`}
          >
            <Package size={24} /> 
            <span>เติมสต็อก</span>
          </button>
          <button 
            onClick={() => setActiveTab('manage-coupons')} 
            className={`py-4 rounded-xl font-bold flex flex-col justify-center items-center gap-2 transition text-sm shadow-lg border-2 ${
              activeTab === 'manage-coupons' 
                ? 'bg-gradient-to-br from-red-600 to-red-800 text-white border-red-400 shadow-red-500/30' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:bg-red-50'
            }`}
          >
            <Ticket size={24} /> 
            <span>คูปอง</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('manage-gacha')} 
            className={`py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition text-sm shadow-lg border-2 ${
              activeTab === 'manage-gacha' 
                ? 'bg-gradient-to-br from-red-600 to-red-800 text-white border-red-400 shadow-red-500/30' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:bg-red-50'
            }`}
          >
            <Gift size={24} /> 
            <span>จัดการ Gacha</span>
          </button>
          <button 
            onClick={() => setActiveTab('add-gacha')} 
            className={`py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition text-sm shadow-lg border-2 ${
              activeTab === 'add-gacha' 
                ? 'bg-gradient-to-br from-red-600 to-red-800 text-white border-red-400 shadow-red-500/30' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:bg-red-50'
            }`}
          >
            <Plus size={24} /> 
            <span>เพิ่ม Gacha Box</span>
          </button>
        </div>

        {/* Content */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          {/* TAB: Dashboard */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
                Dashboard & สถิติ
              </h2>
              
              {!dashboardStats ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
                </div>
              ) : (
                <>
                  {/* Overview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-xl shadow-lg text-white border-2 border-red-400">
                      <div className="text-red-100 text-sm mb-2 font-bold">ยอดขายรวม</div>
                      <div className="text-3xl font-black">฿{Number(dashboardStats.overview.totalSales).toLocaleString()}</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg text-white border-2 border-blue-400">
                      <div className="text-blue-100 text-sm mb-2 font-bold">จำนวนผู้ใช้</div>
                      <div className="text-3xl font-black">{dashboardStats.overview.totalUsers.toLocaleString()}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl shadow-lg text-white border-2 border-purple-400">
                      <div className="text-purple-100 text-sm mb-2 font-bold">จำนวนเกม</div>
                      <div className="text-3xl font-black">{dashboardStats.overview.totalGames.toLocaleString()}</div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-6 rounded-xl shadow-lg text-white border-2 border-yellow-400">
                      <div className="text-yellow-100 text-sm mb-2 font-bold">การซื้อทั้งหมด</div>
                      <div className="text-3xl font-black">{dashboardStats.overview.totalTransactions.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 hover:border-red-300 transition">
                      <div className="text-gray-600 text-sm mb-2 font-bold">สต็อกทั้งหมด</div>
                      <div className="text-2xl font-black text-gray-800">{dashboardStats.overview.totalStocks.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 mt-2">
                        ขายได้: <span className="text-green-600 font-bold">{dashboardStats.overview.soldStocks}</span> | คงเหลือ: <span className="text-blue-600 font-bold">{dashboardStats.overview.availableStocks}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 hover:border-red-300 transition">
                      <div className="text-gray-600 text-sm mb-2 font-bold">คูปองทั้งหมด</div>
                      <div className="text-2xl font-black text-gray-800">{dashboardStats.overview.totalCoupons.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 mt-2">
                        ใช้แล้ว: <span className="text-red-600 font-bold">{dashboardStats.overview.usedCoupons}</span> | ใช้งานได้: <span className="text-green-600 font-bold">{dashboardStats.overview.totalCoupons - dashboardStats.overview.usedCoupons}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 hover:border-red-300 transition">
                      <div className="text-gray-600 text-sm mb-2 font-bold">อัตราการขาย</div>
                      <div className="text-2xl font-black text-red-600">
                        {dashboardStats.overview.totalStocks > 0 
                          ? ((dashboardStats.overview.soldStocks / dashboardStats.overview.totalStocks) * 100).toFixed(1)
                          : 0}%
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {dashboardStats.overview.soldStocks} / {dashboardStats.overview.totalStocks} ชิ้น
                      </div>
                    </div>
                  </div>

                  {/* Top Games */}
                  <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 mb-8">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                      <div className="w-1 h-6 bg-red-600 rounded-full"></div>
                      🏆 เกมที่ขายดีที่สุด (Top 5)
                    </h3>
                    {dashboardStats.topGames.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">ยังไม่มีข้อมูลการขาย</p>
                    ) : (
                      <div className="space-y-3">
                        {dashboardStats.topGames.map((game, index) => (
                          <div key={game.game_id} className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 hover:border-red-300 transition shadow-sm">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white shadow-lg ${
                                index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 
                                index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' : 
                                index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' : 
                                'bg-gradient-to-br from-gray-500 to-gray-700'
                              }`}>
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-bold text-gray-800">{game.name}</div>
                                <div className="text-sm text-gray-500">{game.platform}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-green-600 font-black text-lg">฿{Number(game.revenue).toLocaleString()}</div>
                              <div className="text-xs text-gray-500">{game.sales_count} ครั้ง</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Daily Revenue */}
                  <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                      <div className="w-1 h-6 bg-red-600 rounded-full"></div>
                      📊 รายได้รายวัน (7 วันล่าสุด)
                    </h3>
                    {dashboardStats.dailyRevenue.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">ยังไม่มีข้อมูล</p>
                    ) : (
                      <div className="space-y-3">
                        {dashboardStats.dailyRevenue.map((day, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 hover:border-red-300 transition shadow-sm">
                            <div>
                              <div className="font-bold text-gray-800">{new Date(day.date).toLocaleDateString('th-TH')}</div>
                              <div className="text-sm text-gray-500">{day.transaction_count} รายการ</div>
                            </div>
                            <div className="text-green-600 font-black text-lg">฿{Number(day.revenue).toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB: จัดการเกม */}
          {activeTab === 'manage-games' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
                จัดการเกมทั้งหมด
              </h2>
              
              {games.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">ยังไม่มีเกมในระบบ</p>
                </div>
              ) : (
                <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-red-600 text-white text-sm">
                      <tr>
                        <th className="p-4">รูป</th>
                        <th className="p-4">ชื่อเกม</th>
                        <th className="p-4">แพลตฟอร์ม</th>
                        <th className="p-4">ราคา</th>
                        <th className="p-4 text-center">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {games.map((game) => (
                        <tr key={game.game_id} className="hover:bg-red-50 transition">
                          <td className="p-4">
                            <img src={game.image_url} alt={game.name} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                          </td>
                          <td className="p-4 font-bold text-gray-800">{game.name}</td>
                          <td className="p-4 text-gray-600 text-sm">{game.platform}</td>
                          <td className="p-4 text-red-600 font-black">฿{Number(game.price).toLocaleString()}</td>
                          <td className="p-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button onClick={() => setEditingGame(game)} className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition shadow-sm" title="แก้ไข">
                                <Edit2 size={16} className="text-white" />
                              </button>
                              <button onClick={() => handleDeleteGame(game.game_id, game.name)} className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition shadow-sm" title="ลบ">
                                <Trash2 size={16} className="text-white" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: เพิ่มเกม */}
          {activeTab === 'add-game' && (
            <form onSubmit={handleAddGame} className="space-y-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
                เพิ่มเกมใหม่
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm text-gray-700 mb-2 font-bold">ชื่อเกม</label>
                    <input required placeholder="Ex. Valorant" className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none transition text-gray-800" 
                        value={gameForm.name} onChange={e => setGameForm({...gameForm, name: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm text-gray-700 mb-2 font-bold">แพลตฟอร์ม</label>
                    <input required placeholder="Ex. Steam" className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none transition text-gray-800" 
                        value={gameForm.platform} onChange={e => setGameForm({...gameForm, platform: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm text-gray-700 mb-2 font-bold">ราคาขาย (บาท)</label>
                    <input required type="number" placeholder="0.00" className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none transition text-gray-800" 
                        value={gameForm.price} onChange={e => setGameForm({...gameForm, price: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm text-gray-700 mb-2 font-bold">อัปโหลดรูปปกเกม</label>
                    <input type="file" accept="image/*" className="w-full bg-gray-50 border-2 border-gray-300 p-2 rounded-lg focus:border-red-500 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer transition" 
                        onChange={e => setGameForm({...gameForm, imageFile: e.target.files[0]})} />
                </div>
              </div>
              <div>
                  <label className="block text-sm text-gray-700 mb-2 font-bold">รายละเอียดเกม</label>
                  <textarea required placeholder="คำอธิบายเกม..." className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg h-32 focus:border-red-500 outline-none transition text-gray-800" 
                    value={gameForm.description} onChange={e => setGameForm({...gameForm, description: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 rounded-xl font-black text-lg shadow-lg hover:shadow-red-500/30 transition transform hover:-translate-y-1 border-2 border-red-500">+ บันทึกเกมลงหน้าร้าน</button>
            </form>
          )}

          {/* TAB: จัดการสต็อก */}
          {activeTab === 'manage-stocks' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
                จัดการสต็อกทั้งหมด
              </h2>
              
              {stocks.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">ยังไม่มีสต็อกในระบบ</p>
                </div>
              ) : (
                <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-red-600 text-white">
                      <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">เกม</th>
                        <th className="p-4">รหัส</th>
                        <th className="p-4">ราคา</th>
                        <th className="p-4">สถานะ</th>
                        <th className="p-4">ประเภท</th>
                        <th className="p-4 text-center">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stocks.map((stock) => (
                        <tr key={stock.code_id} className="hover:bg-red-50 transition">
                          <td className="p-4 text-gray-500 font-mono">#{stock.code_id}</td>
                          <td className="p-4 font-bold text-gray-800">{stock.game_name}</td>
                          <td className="p-4 font-mono text-xs text-green-600 bg-green-50 px-2 py-1 rounded">{stock.code.substring(0, 15)}...</td>
                          <td className="p-4 text-red-600 font-black">฿{Number(stock.price).toLocaleString()}</td>
                          <td className="p-4">
                            <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                              stock.status === 'available' 
                                ? 'bg-green-100 text-green-700 border border-green-300' 
                                : 'bg-red-100 text-red-700 border border-red-300'
                            }`}>
                              {stock.status === 'available' ? 'พร้อมขาย' : 'ขายแล้ว'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                              stock.is_public 
                                ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                                : 'bg-gray-100 text-gray-700 border border-gray-300'
                            }`}>
                              {stock.is_public ? 'ขายแยก' : 'สุ่ม'}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button onClick={() => setEditingStock(stock)} className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition shadow-sm" title="แก้ไข">
                                <Edit2 size={14} className="text-white" />
                              </button>
                              <button onClick={() => handleDeleteStock(stock.code_id)} className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition shadow-sm" title="ลบ">
                                <Trash2 size={14} className="text-white" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: เติมสต็อก */}
          {activeTab === 'add-stock' && (
            <form onSubmit={handleAddStock} className="space-y-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
                เติมสต็อกสินค้า
              </h2>
              
              <div className="flex items-center gap-3 mb-4 bg-red-50 p-4 rounded-xl border-2 border-red-200">
                  <input type="checkbox" id="is_public" className="w-5 h-5 accent-red-600 cursor-pointer"
                    checked={stockForm.is_public}
                    onChange={e => setStockForm({...stockForm, is_public: e.target.checked})}
                  />
                  <label htmlFor="is_public" className="text-gray-800 font-bold cursor-pointer">
                      นี่คือการขายไอดีแยกชิ้น?
                  </label>
              </div>
              <div>
                  <label className="block text-sm text-gray-700 mb-2 font-bold">เลือกเกม</label>
                  <select required className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none cursor-pointer text-gray-800"
                    value={stockForm.game_id} onChange={e => setStockForm({...stockForm, game_id: e.target.value})}
                  >
                    <option value="">-- กรุณาเลือกเกม --</option>
                    {games.map(g => (
                      <option key={g.game_id} value={g.game_id}>{g.name}</option>
                    ))}
                  </select>
              </div>
              {stockForm.is_public && (
                  <div className="space-y-4 p-6 bg-red-50 rounded-xl border-2 border-red-200">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2 font-bold">ชื่อสินค้า</label>
                        <input required placeholder="ชื่อสินค้า..." className="w-full bg-white border-2 border-gray-300 p-3 rounded-lg text-gray-800 outline-none focus:border-red-500"
                            value={stockForm.title} onChange={e => setStockForm({...stockForm, title: e.target.value})} />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-700 mb-2 font-bold">อัปโหลดรูปไอดี</label>
                        <input type="file" accept="image/*"
                            className="w-full bg-white border-2 border-gray-300 p-2 rounded-lg text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer transition" 
                            onChange={e => setStockForm({...stockForm, imageFile: e.target.files[0]})} 
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2 font-bold">รายละเอียดไอดี</label>
                        <textarea placeholder="รายละเอียด..." className="w-full bg-white border-2 border-gray-300 p-3 rounded-lg h-24 text-gray-800 outline-none focus:border-red-500"
                            value={stockForm.description} onChange={e => setStockForm({...stockForm, description: e.target.value})} />
                      </div>
                  </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-bold">รหัสลับ / ID-Pass</label>
                    <input required placeholder="User: pass" className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg font-mono text-green-700 outline-none focus:border-red-500"
                        value={stockForm.code} onChange={e => setStockForm({...stockForm, code: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-bold">ราคาขาย (บาท)</label>
                    <input required type="number" placeholder="0.00" className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg outline-none focus:border-red-500 text-gray-800"
                        value={stockForm.price} onChange={e => setStockForm({...stockForm, price: e.target.value})} />
                  </div>
              </div>
              
              <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 rounded-xl font-black text-lg shadow-lg hover:shadow-red-500/30 transition transform hover:-translate-y-1 border-2 border-red-500">
                {stockForm.is_public ? 'ลงขายไอดีนี้' : 'เติม Key เข้าสต็อกกลาง'}
              </button>
            </form>
          )}

          {/* TAB: จัดการคูปอง */}
          {activeTab === 'manage-coupons' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
                จัดการคูปองทั้งหมด
              </h2>
              
              {coupons.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">ยังไม่มีคูปองในระบบ</p>
                </div>
              ) : (
                <div className="overflow-x-auto mb-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-red-600 text-white">
                      <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">โค้ดคูปอง</th>
                        <th className="p-4">ส่วนลด (บาท)</th>
                        <th className="p-4">ใช้แล้ว/จำกัด</th>
                        <th className="p-4">สถานะ</th>
                        <th className="p-4 text-center">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {coupons.map((coupon) => (
                        <tr key={coupon.coupon_id} className="hover:bg-red-50 transition">
                          <td className="p-4 text-gray-500 font-mono">#{coupon.coupon_id}</td>
                          <td className="p-4 font-mono text-red-600 font-black text-lg">{coupon.code}</td>
                          <td className="p-4 text-green-600 font-black">฿{Number(coupon.discount_amount).toLocaleString()}</td>
                          <td className="p-4">
                            <span className="text-gray-700 font-bold">
                              {coupon.used_count} / {coupon.usage_limit}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                              coupon.used_count >= coupon.usage_limit 
                                ? 'bg-red-100 text-red-700 border border-red-300' 
                                : 'bg-green-100 text-green-700 border border-green-300'
                            }`}>
                              {coupon.used_count >= coupon.usage_limit ? 'เต็มแล้ว' : 'ใช้งานได้'}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button onClick={() => setEditingCoupon(coupon)} className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition shadow-sm" title="แก้ไข">
                                <Edit2 size={14} className="text-white" />
                              </button>
                              <button onClick={() => handleDeleteCoupon(coupon.coupon_id)} className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition shadow-sm" title="ลบ">
                                <Trash2 size={14} className="text-white" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Form เพิ่มคูปอง */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border-2 border-red-200">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                  <div className="w-1 h-6 bg-red-600 rounded-full"></div>
                  เพิ่มคูปองใหม่
                </h3>
                <form onSubmit={handleAddCoupon} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2 font-bold">โค้ดคูปอง</label>
                      <input required placeholder="Ex. SAVE50" className="w-full bg-white border-2 border-gray-300 p-3 rounded-lg font-mono text-red-600 focus:border-red-500 outline-none font-bold" 
                        value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2 font-bold">ส่วนลด (บาท)</label>
                      <input required type="number" placeholder="0.00" className="w-full bg-white border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none text-gray-800" 
                        value={couponForm.discount_amount} onChange={e => setCouponForm({...couponForm, discount_amount: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2 font-bold">จำนวนครั้งที่ใช้ได้</label>
                      <input required type="number" placeholder="100" className="w-full bg-white border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none text-gray-800" 
                        value={couponForm.usage_limit} onChange={e => setCouponForm({...couponForm, usage_limit: e.target.value})} />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-xl font-black text-lg shadow-lg hover:shadow-red-500/30 transition transform hover:-translate-y-1 border-2 border-red-500">
                    + เพิ่มคูปอง
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB: จัดการ Gacha Boxes */}
          {activeTab === 'manage-gacha' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
                จัดการ Gacha Boxes
              </h2>
              
              {gachaBoxes.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">ยังไม่มีกล่องในระบบ</p>
                </div>
              ) : (
                <div className="overflow-x-auto mb-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-red-600 text-white text-sm">
                      <tr>
                        <th className="p-4">รูป</th>
                        <th className="p-4">ชื่อกล่อง</th>
                        <th className="p-4">รายละเอียด</th>
                        <th className="p-4">ราคา</th>
                        <th className="p-4 text-center">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {gachaBoxes.map((box) => (
                        <tr key={box.box_id} className="hover:bg-red-50 transition">
                          <td className="p-4">
                            {box.image_url ? (
                              <img src={box.image_url} alt={box.name} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Gift className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="p-4 font-bold text-gray-800">{box.name}</td>
                          <td className="p-4 text-gray-600 text-sm max-w-xs truncate">{box.description || '-'}</td>
                          <td className="p-4 text-red-600 font-black">฿{Number(box.price).toLocaleString()}</td>
                          <td className="p-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button onClick={() => setEditingGachaBox(box)} className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition shadow-sm" title="แก้ไข">
                                <Edit2 size={16} className="text-white" />
                              </button>
                              <button onClick={() => handleDeleteGachaBox(box.box_id)} className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition shadow-sm" title="ลบ">
                                <Trash2 size={16} className="text-white" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: เพิ่ม Gacha Box */}
          {activeTab === 'add-gacha' && (
            <form onSubmit={handleAddGachaBox} className="space-y-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
                เพิ่ม Gacha Box ใหม่
              </h2>
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-bold">ชื่อกล่อง</label>
                <input required placeholder="Ex. Premium Box" className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none transition text-gray-800" 
                  value={gachaBoxForm.name} onChange={e => setGachaBoxForm({...gachaBoxForm, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-bold">รายละเอียด</label>
                <textarea required placeholder="คำอธิบายกล่อง..." className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg h-32 focus:border-red-500 outline-none transition text-gray-800" 
                  value={gachaBoxForm.description} onChange={e => setGachaBoxForm({...gachaBoxForm, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-bold">ราคา (บาท)</label>
                  <input required type="number" placeholder="0.00" className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none transition text-gray-800" 
                    value={gachaBoxForm.price} onChange={e => setGachaBoxForm({...gachaBoxForm, price: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-bold">อัปโหลดรูปปกกล่อง</label>
                  <input type="file" accept="image/*" className="w-full bg-gray-50 border-2 border-gray-300 p-2 rounded-lg focus:border-red-500 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer transition" 
                    onChange={e => setGachaBoxForm({...gachaBoxForm, imageFile: e.target.files[0]})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 rounded-xl font-black text-lg shadow-lg hover:shadow-red-500/30 transition transform hover:-translate-y-1 border-2 border-red-500">+ บันทึกกล่อง</button>
            </form>
          )}
        </div>
      </div>

      {/* Modal แก้ไขเกม */}
      {editingGame && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setEditingGame(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 border-2 border-red-500 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
                แก้ไขเกม
              </h3>
              <button onClick={() => setEditingGame(null)} className="text-gray-400 hover:text-red-600 transition">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateGame} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-bold">ชื่อเกม</label>
                <input required className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none text-gray-800" 
                  value={editingGame.name} onChange={e => setEditingGame({...editingGame, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-bold">แพลตฟอร์ม</label>
                  <input required className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none text-gray-800" 
                    value={editingGame.platform} onChange={e => setEditingGame({...editingGame, platform: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-bold">ราคา</label>
                  <input required type="number" className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none text-gray-800" 
                    value={editingGame.price} onChange={e => setEditingGame({...editingGame, price: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-bold">รายละเอียด</label>
                <textarea required className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg h-24 focus:border-red-500 outline-none text-gray-800" 
                  value={editingGame.description} onChange={e => setEditingGame({...editingGame, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-bold">เปลี่ยนรูป (ถ้าต้องการ)</label>
                <input type="file" accept="image/*" className="w-full bg-gray-50 border-2 border-gray-300 p-2 rounded-lg text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer transition" 
                  onChange={e => setEditingGame({...editingGame, newImageFile: e.target.files[0]})} />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setEditingGame(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-xl font-bold text-gray-800 transition">ยกเลิก</button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-3 rounded-xl font-black text-white shadow-lg transition">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal แก้ไขสต็อก */}
      {editingStock && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setEditingStock(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 border-2 border-red-500 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
                แก้ไขสต็อก
              </h3>
              <button onClick={() => setEditingStock(null)} className="text-gray-400 hover:text-red-600 transition">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateStock} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-bold">รหัส</label>
                <input required className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg font-mono text-red-600 focus:border-red-500 outline-none font-bold" 
                  value={editingStock.code} onChange={e => setEditingStock({...editingStock, code: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-bold">ราคา</label>
                  <input required type="number" className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none text-gray-800" 
                    value={editingStock.price} onChange={e => setEditingStock({...editingStock, price: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-bold">สถานะ</label>
                  <select required className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none text-gray-800"
                    value={editingStock.status} onChange={e => setEditingStock({...editingStock, status: e.target.value})}>
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-bold">ชื่อสินค้า (ถ้ามี)</label>
                <input className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none text-gray-800" 
                  value={editingStock.title || ''} onChange={e => setEditingStock({...editingStock, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-bold">รายละเอียด (ถ้ามี)</label>
                <textarea className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg h-20 focus:border-red-500 outline-none text-gray-800" 
                  value={editingStock.description || ''} onChange={e => setEditingStock({...editingStock, description: e.target.value})} />
              </div>
              <div className="flex items-center gap-3 bg-red-50 p-4 rounded-xl border-2 border-red-200">
                <input type="checkbox" id="edit_is_public" className="w-5 h-5 accent-red-600 cursor-pointer"
                  checked={editingStock.is_public}
                  onChange={e => setEditingStock({...editingStock, is_public: e.target.checked})}
                />
                <label htmlFor="edit_is_public" className="text-gray-800 font-bold cursor-pointer">
                  ขายแยกชิ้น?
                </label>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-bold">เปลี่ยนรูป (ถ้าต้องการ)</label>
                <input type="file" accept="image/*" className="w-full bg-gray-50 border-2 border-gray-300 p-2 rounded-lg text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer transition" 
                  onChange={e => setEditingStock({...editingStock, newImageFile: e.target.files[0]})} />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setEditingStock(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-xl font-bold text-gray-800 transition">ยกเลิก</button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-3 rounded-xl font-black text-white shadow-lg transition">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal แก้ไขคูปอง */}
      {editingCoupon && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setEditingCoupon(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 border-2 border-red-500 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
                แก้ไขคูปอง
              </h3>
              <button onClick={() => setEditingCoupon(null)} className="text-gray-400 hover:text-red-600 transition">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateCoupon} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-bold">โค้ดคูปอง</label>
                <input required className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg font-mono text-red-600 focus:border-red-500 outline-none font-bold" 
                  value={editingCoupon.code} onChange={e => setEditingCoupon({...editingCoupon, code: e.target.value.toUpperCase()})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-bold">ส่วนลด (บาท)</label>
                  <input required type="number" className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none text-gray-800" 
                    value={editingCoupon.discount_amount} onChange={e => setEditingCoupon({...editingCoupon, discount_amount: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-bold">จำนวนครั้งที่ใช้ได้</label>
                  <input required type="number" className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none text-gray-800" 
                    value={editingCoupon.usage_limit} onChange={e => setEditingCoupon({...editingCoupon, usage_limit: e.target.value})} />
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border-2 border-red-200">
                <p className="text-sm text-gray-800 font-bold">
                  <strong>ใช้แล้ว:</strong> <span className="text-red-600">{editingCoupon.used_count}</span> / <span className="text-gray-600">{editingCoupon.usage_limit}</span> ครั้ง
                </p>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setEditingCoupon(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-xl font-bold text-gray-800 transition">ยกเลิก</button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-3 rounded-xl font-black text-white shadow-lg transition">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal แก้ไข Gacha Box */}
      {editingGachaBox && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setEditingGachaBox(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 border-2 border-red-500 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
                แก้ไข Gacha Box
              </h3>
              <button onClick={() => setEditingGachaBox(null)} className="text-gray-400 hover:text-red-600 transition">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateGachaBox} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-bold">ชื่อกล่อง</label>
                <input required className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none text-gray-800" 
                  value={editingGachaBox.name} onChange={e => setEditingGachaBox({...editingGachaBox, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-bold">รายละเอียด</label>
                <textarea required className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg h-24 focus:border-red-500 outline-none text-gray-800" 
                  value={editingGachaBox.description} onChange={e => setEditingGachaBox({...editingGachaBox, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-bold">ราคา</label>
                <input required type="number" className="w-full bg-gray-50 border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none text-gray-800" 
                  value={editingGachaBox.price} onChange={e => setEditingGachaBox({...editingGachaBox, price: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-bold">เปลี่ยนรูป (ถ้าต้องการ)</label>
                <input type="file" accept="image/*" className="w-full bg-gray-50 border-2 border-gray-300 p-2 rounded-lg text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer transition" 
                  onChange={e => setEditingGachaBox({...editingGachaBox, newImageFile: e.target.files[0]})} />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setEditingGachaBox(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-xl font-bold text-gray-800 transition">ยกเลิก</button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-3 rounded-xl font-black text-white shadow-lg transition">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
