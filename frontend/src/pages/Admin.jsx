import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Database, ShieldAlert, Package, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [activeTab, setActiveTab] = useState('game'); // 'game' หรือ 'stock'
  const [games, setGames] = useState([]);
  const navigate = useNavigate();
  
  // [แก้จุดที่ 1] เปลี่ยน state จาก image_url เป็น imageFile (ค่าเริ่มต้น null)
  const [gameForm, setGameForm] = useState({ 
    name: '', platform: '', description: '', price: '', imageFile: null 
  });
  
  const [stockForm, setStockForm] = useState({ 
    game_id: '', code: '', price: '' 
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

  // [แก้จุดที่ 2] ฟังก์ชันส่งข้อมูลแบบ FormData (รองรับไฟล์)
  const handleAddGame = async (e) => {
    e.preventDefault();
    if(!confirm('ยืนยันการเพิ่มเกมใหม่?')) return;
    
    // สร้างตู้คอนเทนเนอร์ (FormData) สำหรับขนของ
    const formData = new FormData();
    formData.append('name', gameForm.name);
    formData.append('platform', gameForm.platform);
    formData.append('description', gameForm.description);
    formData.append('price', gameForm.price);
    
    // ถ้ามีการเลือกไฟล์ ให้ยัดใส่กล่องไปด้วย (ชื่อ 'image' ต้องตรงกับ Backend)
    if (gameForm.imageFile) {
        formData.append('image', gameForm.imageFile);
    }

    try {
      const token = localStorage.getItem('token');
      // Axios จะจัดการ Header ให้อัตโนมัติเมื่อส่ง FormData
      await axios.post('http://localhost:5000/api/admin/add-game', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('เพิ่มเกมสำเร็จ! 🎉');
      // ล้างฟอร์ม
      setGameForm({ name: '', platform: '', description: '', price: '', imageFile: null }); 
      fetchGames(); 
    } catch (err) { 
      alert('Error: ' + (err.response?.data?.message || 'เพิ่มเกมไม่สำเร็จ')); 
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    if(!stockForm.game_id) return alert('กรุณาเลือกเกมก่อน');
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/add-stock', stockForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('เติมสต็อกสำเร็จ! 📦 พร้อมขายแล้ว');
      setStockForm({ ...stockForm, code: '' }); 
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
            <button 
                onClick={() => navigate('/')} 
                className="flex items-center gap-2 text-gray-400 hover:text-white transition bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700"
            >
                <ArrowLeft size={20} /> กลับหน้าร้าน
            </button>
        </div>

        {/* Tabs Menu */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('game')}
            className={`flex-1 py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition text-lg shadow-lg
              ${activeTab === 'game' 
                ? 'bg-gradient-to-r from-red-600 to-red-800 text-white transform scale-105 border-2 border-red-400' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
          >
            <Plus size={24} /> เพิ่มเกมใหม่ (New Game)
          </button>
          
          <button 
            onClick={() => setActiveTab('stock')}
            className={`flex-1 py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition text-lg shadow-lg
              ${activeTab === 'stock' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white transform scale-105 border-2 border-blue-400' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
          >
            <Database size={24} /> เติมสต็อกสินค้า (Add Stock)
          </button>
        </div>

        {/* Main Content Box */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
              <Package size={300} />
          </div>

          {/* TAB 1: เพิ่มเกม */}
          {activeTab === 'game' && (
            <form onSubmit={handleAddGame} className="space-y-6 relative z-10">
              <h2 className="text-2xl font-bold mb-6 text-red-400 border-l-4 border-red-500 pl-4">กรอกข้อมูลเกมใหม่</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">ชื่อเกม</label>
                    <input required placeholder="Ex. Valorant, GTA V" 
                        className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition" 
                        value={gameForm.name} onChange={e => setGameForm({...gameForm, name: e.target.value})} 
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">แพลตฟอร์ม</label>
                    <input required placeholder="Ex. Steam, Origin, Riot" 
                        className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition" 
                        value={gameForm.platform} onChange={e => setGameForm({...gameForm, platform: e.target.value})} 
                    />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">ราคาขาย (บาท)</label>
                    <input required type="number" placeholder="0.00" 
                        className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition" 
                        value={gameForm.price} onChange={e => setGameForm({...gameForm, price: e.target.value})} 
                    />
                </div>
                
                {/* [แก้จุดที่ 3] เปลี่ยนช่อง URL เป็นช่องอัปโหลดไฟล์ */}
                <div>
                    <label className="block text-sm text-gray-400 mb-1">อัปโหลดรูปปกเกม</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        className="w-full bg-gray-900 border border-gray-600 p-2 rounded-lg focus:border-red-500 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer" 
                        onChange={e => setGameForm({...gameForm, imageFile: e.target.files[0]})} 
                    />
                </div>
              </div>

              <div>
                  <label className="block text-sm text-gray-400 mb-1">รายละเอียดเกม</label>
                  <textarea required placeholder="คำอธิบายเกม..." 
                    className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg h-32 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition" 
                    value={gameForm.description} onChange={e => setGameForm({...gameForm, description: e.target.value})} 
                  />
              </div>
              
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-red-500/30 transition transform hover:-translate-y-1">
                + บันทึกเกมลงหน้าร้าน
              </button>
            </form>
          )}

          {/* TAB 2: เติมสต็อก (เหมือนเดิม) */}
          {activeTab === 'stock' && (
            <form onSubmit={handleAddStock} className="space-y-6 relative z-10">
              <h2 className="text-2xl font-bold mb-6 text-blue-400 border-l-4 border-blue-500 pl-4">เติม Key/ID ลงในระบบ</h2>
              
              <div>
                  <label className="block text-sm text-gray-400 mb-1">เลือกเกมที่จะเติม</label>
                  <select required 
                    className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg focus:border-blue-500 outline-none cursor-pointer"
                    value={stockForm.game_id} onChange={e => setStockForm({...stockForm, game_id: e.target.value})}
                  >
                    <option value="">-- กรุณาเลือกเกม --</option>
                    {games.map(g => (
                      <option key={g.game_id} value={g.game_id}>{g.name} (ราคาขาย: {g.price} บ.)</option>
                    ))}
                  </select>
              </div>

              <div>
                  <label className="block text-sm text-gray-400 mb-1">รหัสเกม / ไอดี-พาส (สินค้าที่จะส่งให้ลูกค้า)</label>
                  <textarea required placeholder="เช่น AAAA-BBBB-CCCC-DDDD หรือ User: admin / Pass: 1234" 
                    className="w-full bg-gray-900 border border-gray-600 p-4 rounded-lg h-40 font-mono text-green-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    value={stockForm.code} onChange={e => setStockForm({...stockForm, code: e.target.value})} 
                  />
                  <p className="text-xs text-gray-500 mt-2">* ข้อมูลนี้จะถูกส่งให้ลูกค้าทันทีเมื่อชำระเงินสำเร็จ</p>
              </div>
              
              <div>
                  <label className="block text-sm text-gray-400 mb-1">ต้นทุน (บาท) *ใส่เพื่อบันทึกเฉยๆ</label>
                  <input required type="number" placeholder="0.00" 
                    className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg focus:border-blue-500 outline-none transition" 
                    value={stockForm.price} onChange={e => setStockForm({...stockForm, price: e.target.value})} 
                  />
              </div>
              
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/30 transition transform hover:-translate-y-1">
                ยืนยันการเติมสต็อก
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default Admin;