import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Database, ShieldAlert, Package, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [activeTab, setActiveTab] = useState('game');
  const [games, setGames] = useState([]);
  const navigate = useNavigate();
  
  // State เพิ่มเกม
  const [gameForm, setGameForm] = useState({ 
    name: '', platform: '', description: '', price: '', imageFile: null 
  });
  
  // State เติมของ (เปลี่ยน image_url เป็น imageFile)
  const [stockForm, setStockForm] = useState({ 
    game_id: '', code: '', price: '', 
    title: '', description: '', imageFile: null, is_public: false 
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      alert('หน้านี้สำหรับผู้ดูแลระบบเท่านั้น!');
      navigate('/');
      return;
    }
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/games');
      setGames(res.data);
    } catch (err) { console.error(err); }
  };

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
      alert('เพิ่มเกมสำเร็จ! 🎉');
      setGameForm({ name: '', platform: '', description: '', price: '', imageFile: null }); 
      fetchGames(); 
    } catch (err) { 
      alert('Error: ' + (err.response?.data?.message || 'เพิ่มเกมไม่สำเร็จ')); 
    }
  };

  // [แก้ใหม่] ฟังก์ชันเติมสต็อกแบบรองรับไฟล์
  const handleAddStock = async (e) => {
    e.preventDefault();
    if(!stockForm.game_id) return alert('กรุณาเลือกเกมก่อน');
    
    const formData = new FormData();
    formData.append('game_id', stockForm.game_id);
    formData.append('code', stockForm.code);
    formData.append('price', stockForm.price);
    formData.append('is_public', stockForm.is_public);
    
    // ถ้าเป็นการขายแยกชิ้น ให้ส่งข้อมูลเพิ่มเติม
    if (stockForm.is_public) {
        formData.append('title', stockForm.title);
        formData.append('description', stockForm.description);
        if (stockForm.imageFile) {
            formData.append('image', stockForm.imageFile);
        }
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/add-stock', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('เพิ่มสินค้าสำเร็จ! 📦');
      // รีเซ็ตค่า
      setStockForm({ ...stockForm, code: '', title: '', description: '', imageFile: null, is_public: false });
    } catch (err) { 
      alert('Error: ' + (err.response?.data?.message || 'เติมของไม่สำเร็จ')); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
            <h1 className="text-3xl font-bold flex items-center gap-3 text-red-500">
              <ShieldAlert className="w-8 h-8" /> 
              Admin Control Panel
            </h1>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white transition bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700">
                <ArrowLeft size={20} /> กลับหน้าร้าน
            </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab('game')} className={`flex-1 py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition text-lg shadow-lg ${activeTab === 'game' ? 'bg-gradient-to-r from-red-600 to-red-800 text-white border-2 border-red-400' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
            <Plus size={24} /> เพิ่มเกมใหม่ (New Game)
          </button>
          <button onClick={() => setActiveTab('stock')} className={`flex-1 py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition text-lg shadow-lg ${activeTab === 'stock' ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white border-2 border-blue-400' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
            <Database size={24} /> เติมสต็อกสินค้า (Add Stock)
          </button>
        </div>

        {/* Content */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Package size={300} /></div>

          {/* TAB 1: เพิ่มเกม */}
          {activeTab === 'game' && (
            <form onSubmit={handleAddGame} className="space-y-6 relative z-10">
              <h2 className="text-2xl font-bold mb-6 text-red-400 border-l-4 border-red-500 pl-4">กรอกข้อมูลเกมใหม่</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">ชื่อเกม</label>
                    <input required placeholder="Ex. Valorant" className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg focus:border-red-500 outline-none transition" 
                        value={gameForm.name} onChange={e => setGameForm({...gameForm, name: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">แพลตฟอร์ม</label>
                    <input required placeholder="Ex. Steam" className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg focus:border-red-500 outline-none transition" 
                        value={gameForm.platform} onChange={e => setGameForm({...gameForm, platform: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">ราคาขาย (บาท)</label>
                    <input required type="number" placeholder="0.00" className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg focus:border-red-500 outline-none transition" 
                        value={gameForm.price} onChange={e => setGameForm({...gameForm, price: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">อัปโหลดรูปปกเกม</label>
                    <input type="file" accept="image/*" className="w-full bg-gray-900 border border-gray-600 p-2 rounded-lg focus:border-red-500 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer" 
                        onChange={e => setGameForm({...gameForm, imageFile: e.target.files[0]})} />
                </div>
              </div>
              <div>
                  <label className="block text-sm text-gray-400 mb-1">รายละเอียดเกม</label>
                  <textarea required placeholder="คำอธิบายเกม..." className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg h-32 focus:border-red-500 outline-none transition" 
                    value={gameForm.description} onChange={e => setGameForm({...gameForm, description: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-red-500/30 transition transform hover:-translate-y-1">+ บันทึกเกมลงหน้าร้าน</button>
            </form>
          )}

          {/* TAB 2: เติมสต็อก (แก้ใหม่แล้ว) */}
          {activeTab === 'stock' && (
            <form onSubmit={handleAddStock} className="space-y-6 relative z-10">
              <h2 className="text-2xl font-bold mb-6 text-blue-400 border-l-4 border-blue-500 pl-4">ลงสินค้า / เติม Key</h2>
              
              <div className="flex items-center gap-2 mb-4 bg-gray-900 p-3 rounded-lg border border-gray-600">
                  <input type="checkbox" id="is_public" className="w-5 h-5 accent-blue-500 cursor-pointer"
                    checked={stockForm.is_public}
                    onChange={e => setStockForm({...stockForm, is_public: e.target.checked})}
                  />
                  <label htmlFor="is_public" className="text-white font-bold cursor-pointer">
                      นี่คือการขายไอดีแยกชิ้น? (เช่น ID ไก่ตัน, บ้านเวล 20)
                  </label>
              </div>

              <div>
                  <label className="block text-sm text-gray-400 mb-1">เลือกหมวดหมู่เกม</label>
                  <select required className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg focus:border-blue-500 outline-none cursor-pointer"
                    value={stockForm.game_id} onChange={e => setStockForm({...stockForm, game_id: e.target.value})}
                  >
                    <option value="">-- กรุณาเลือกเกม --</option>
                    {games.map(g => (
                      <option key={g.game_id} value={g.game_id}>{g.name} (ราคาขาย: {g.price} บ.)</option>
                    ))}
                  </select>
              </div>

              {stockForm.is_public && (
                  <div className="space-y-4 p-4 bg-gray-900/50 rounded-xl border border-blue-500/30">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">ชื่อสินค้า (เช่น ID ไก่ตัน ผลโมจิ)</label>
                        <input required placeholder="ชื่อสินค้า..." className="w-full bg-gray-800 border border-gray-600 p-3 rounded-lg text-white outline-none focus:border-blue-500"
                            value={stockForm.title} onChange={e => setStockForm({...stockForm, title: e.target.value})} />
                      </div>
                      
                      {/* [แก้ตรงนี้] เปลี่ยน Input URL เป็น File Upload */}
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">อัปโหลดรูปไอดี</label>
                        <input type="file" accept="image/*"
                            className="w-full bg-gray-800 border border-gray-600 p-2 rounded-lg text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" 
                            onChange={e => setStockForm({...stockForm, imageFile: e.target.files[0]})} 
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">รายละเอียดไอดี</label>
                        <textarea placeholder="เช่น มีดาบโซโล, หมัด God..." className="w-full bg-gray-800 border border-gray-600 p-3 rounded-lg h-24 text-white outline-none focus:border-blue-500"
                            value={stockForm.description} onChange={e => setStockForm({...stockForm, description: e.target.value})} />
                      </div>
                  </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">รหัสลับ / ID-Pass</label>
                    <input required placeholder="User: pass" className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg font-mono text-green-400 outline-none focus:border-blue-500"
                        value={stockForm.code} onChange={e => setStockForm({...stockForm, code: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">ราคาขาย (บาท)</label>
                    <input required type="number" className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg outline-none focus:border-blue-500"
                        value={stockForm.price} onChange={e => setStockForm({...stockForm, price: e.target.value})} />
                  </div>
              </div>
              
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-lg shadow-lg transition">
                {stockForm.is_public ? 'ลงขายไอดีนี้' : 'เติม Key เข้าสต็อกกลาง'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default Admin;