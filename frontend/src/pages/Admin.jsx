import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Database, ShieldAlert, Package, ArrowLeft, Edit2, Trash2, Eye, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [activeTab, setActiveTab] = useState('manage-games');
  const [games, setGames] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [editingGame, setEditingGame] = useState(null);
  const [editingStock, setEditingStock] = useState(null);
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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      alert('หน้านี้สำหรับผู้ดูแลระบบเท่านั้น!');
      navigate('/');
      return;
    }
    fetchGames();
    fetchStocks();
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
      alert('เพิ่มเกมสำเร็จ! 🎉');
      setGameForm({ name: '', platform: '', description: '', price: '', imageFile: null }); 
      fetchGames(); 
    } catch (err) { 
      alert('Error: ' + (err.response?.data?.message || 'เพิ่มเกมไม่สำเร็จ')); 
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
      alert('แก้ไขเกมสำเร็จ! ✅');
      setEditingGame(null);
      fetchGames();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'แก้ไขไม่สำเร็จ'));
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
      alert('ลบเกมสำเร็จ! 🗑️');
      fetchGames();
      fetchStocks();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'ลบไม่สำเร็จ'));
    }
  };

  // ===== เพิ่มสต็อก =====
  const handleAddStock = async (e) => {
    e.preventDefault();
    if(!stockForm.game_id) return alert('กรุณาเลือกเกมก่อน');
    
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
      alert('เพิ่มสินค้าสำเร็จ! 📦');
      setStockForm({ game_id: stockForm.game_id, code: '', price: '', title: '', description: '', imageFile: null, is_public: false });
      fetchStocks();
    } catch (err) { 
      alert('Error: ' + (err.response?.data?.message || 'เติมของไม่สำเร็จ')); 
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
      alert('แก้ไขสต็อกสำเร็จ! ✅');
      setEditingStock(null);
      fetchStocks();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'แก้ไขไม่สำเร็จ'));
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
      alert('ลบสต็อกสำเร็จ! 🗑️');
      fetchStocks();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'ลบไม่สำเร็จ'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button onClick={() => setActiveTab('manage-games')} className={`py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition text-sm shadow-lg ${activeTab === 'manage-games' ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white border-2 border-purple-400' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            <Eye size={20} /> จัดการเกม
          </button>
          <button onClick={() => setActiveTab('add-game')} className={`py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition text-sm shadow-lg ${activeTab === 'add-game' ? 'bg-gradient-to-r from-red-600 to-red-800 text-white border-2 border-red-400' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            <Plus size={20} /> เพิ่มเกม
          </button>
          <button onClick={() => setActiveTab('manage-stocks')} className={`py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition text-sm shadow-lg ${activeTab === 'manage-stocks' ? 'bg-gradient-to-r from-green-600 to-green-800 text-white border-2 border-green-400' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            <Database size={20} /> จัดการสต็อก
          </button>
          <button onClick={() => setActiveTab('add-stock')} className={`py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition text-sm shadow-lg ${activeTab === 'add-stock' ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white border-2 border-blue-400' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            <Package size={20} /> เติมสต็อก
          </button>
        </div>

        {/* Content */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
          {/* TAB: จัดการเกม */}
          {activeTab === 'manage-games' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-purple-400 border-l-4 border-purple-500 pl-4">จัดการเกมทั้งหมด</h2>
              
              {games.length === 0 ? (
                <p className="text-gray-400 text-center py-10">ยังไม่มีเกมในระบบ</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-purple-900/30 text-purple-300 text-sm">
                      <tr>
                        <th className="p-3">รูป</th>
                        <th className="p-3">ชื่อเกม</th>
                        <th className="p-3">แพลตฟอร์ม</th>
                        <th className="p-3">ราคา</th>
                        <th className="p-3 text-center">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {games.map((game) => (
                        <tr key={game.game_id} className="hover:bg-gray-700/30">
                          <td className="p-3">
                            <img src={game.image_url} alt={game.name} className="w-16 h-16 object-cover rounded-lg" />
                          </td>
                          <td className="p-3 font-bold text-white">{game.name}</td>
                          <td className="p-3 text-gray-400 text-sm">{game.platform}</td>
                          <td className="p-3 text-green-400 font-bold">฿{Number(game.price).toLocaleString()}</td>
                          <td className="p-3 text-center">
                            <div className="flex gap-2 justify-center">
                              <button onClick={() => setEditingGame(game)} className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition" title="แก้ไข">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleDeleteGame(game.game_id, game.name)} className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition" title="ลบ">
                                <Trash2 size={16} />
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
              <h2 className="text-2xl font-bold mb-6 text-red-400 border-l-4 border-red-500 pl-4">เพิ่มเกมใหม่</h2>
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

          {/* TAB: จัดการสต็อก */}
          {activeTab === 'manage-stocks' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-green-400 border-l-4 border-green-500 pl-4">จัดการสต็อกทั้งหมด</h2>
              
              {stocks.length === 0 ? (
                <p className="text-gray-400 text-center py-10">ยังไม่มีสต็อกในระบบ</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-green-900/30 text-green-300">
                      <tr>
                        <th className="p-3">ID</th>
                        <th className="p-3">เกม</th>
                        <th className="p-3">รหัส</th>
                        <th className="p-3">ราคา</th>
                        <th className="p-3">สถานะ</th>
                        <th className="p-3">ประเภท</th>
                        <th className="p-3 text-center">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {stocks.map((stock) => (
                        <tr key={stock.code_id} className="hover:bg-gray-700/30">
                          <td className="p-3 text-gray-400">#{stock.code_id}</td>
                          <td className="p-3 font-medium">{stock.game_name}</td>
                          <td className="p-3 font-mono text-xs text-green-400">{stock.code.substring(0, 15)}...</td>
                          <td className="p-3 text-yellow-400 font-bold">฿{Number(stock.price).toLocaleString()}</td>
                          <td className="p-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${stock.status === 'available' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {stock.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${stock.is_public ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                              {stock.is_public ? 'ขายแยก' : 'สุ่ม'}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex gap-2 justify-center">
                              <button onClick={() => setEditingStock(stock)} className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition" title="แก้ไข">
                                <Edit2 size={14} />
                              </button>
                              <button onClick={() => handleDeleteStock(stock.code_id)} className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition" title="ลบ">
                                <Trash2 size={14} />
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
              <h2 className="text-2xl font-bold mb-6 text-blue-400 border-l-4 border-blue-500 pl-4">เติมสต็อกสินค้า</h2>
              
              <div className="flex items-center gap-2 mb-4 bg-gray-900 p-3 rounded-lg border border-gray-600">
                  <input type="checkbox" id="is_public" className="w-5 h-5 accent-blue-500 cursor-pointer"
                    checked={stockForm.is_public}
                    onChange={e => setStockForm({...stockForm, is_public: e.target.checked})}
                  />
                  <label htmlFor="is_public" className="text-white font-bold cursor-pointer">
                      นี่คือการขายไอดีแยกชิ้น?
                  </label>
              </div>
              <div>
                  <label className="block text-sm text-gray-400 mb-1">เลือกหมวดหมู่เกม</label>
                  <select required className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg focus:border-blue-500 outline-none cursor-pointer"
                    value={stockForm.game_id} onChange={e => setStockForm({...stockForm, game_id: e.target.value})}
                  >
                    <option value="">-- กรุณาเลือกเกม --</option>
                    {games.map(g => (
                      <option key={g.game_id} value={g.game_id}>{g.name}</option>
                    ))}
                  </select>
              </div>
              {stockForm.is_public && (
                  <div className="space-y-4 p-4 bg-gray-900/50 rounded-xl border border-blue-500/30">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">ชื่อสินค้า</label>
                        <input required placeholder="ชื่อสินค้า..." className="w-full bg-gray-800 border border-gray-600 p-3 rounded-lg text-white outline-none focus:border-blue-500"
                            value={stockForm.title} onChange={e => setStockForm({...stockForm, title: e.target.value})} />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">อัปโหลดรูปไอดี</label>
                        <input type="file" accept="image/*"
                            className="w-full bg-gray-800 border border-gray-600 p-2 rounded-lg text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" 
                            onChange={e => setStockForm({...stockForm, imageFile: e.target.files[0]})} 
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">รายละเอียดไอดี</label>
                        <textarea placeholder="รายละเอียด..." className="w-full bg-gray-800 border border-gray-600 p-3 rounded-lg h-24 text-white outline-none focus:border-blue-500"
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
                    <input required type="number" placeholder="0.00" className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg outline-none focus:border-blue-500"
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

      {/* Modal แก้ไขเกม */}
      {editingGame && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setEditingGame(null)}>
          <div className="bg-gray-800 rounded-2xl max-w-2xl w-full p-8 border-2 border-purple-500/30" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-purple-400">แก้ไขเกม</h3>
              <button onClick={() => setEditingGame(null)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateGame} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">ชื่อเกม</label>
                <input required className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg focus:border-purple-500 outline-none" 
                  value={editingGame.name} onChange={e => setEditingGame({...editingGame, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">แพลตฟอร์ม</label>
                  <input required className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg focus:border-purple-500 outline-none" 
                    value={editingGame.platform} onChange={e => setEditingGame({...editingGame, platform: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">ราคา</label>
                  <input required type="number" className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg focus:border-purple-500 outline-none" 
                    value={editingGame.price} onChange={e => setEditingGame({...editingGame, price: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">รายละเอียด</label>
                <textarea required className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg h-24 focus:border-purple-500 outline-none" 
                  value={editingGame.description} onChange={e => setEditingGame({...editingGame, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">เปลี่ยนรูป (ถ้าต้องการ)</label>
                <input type="file" accept="image/*" className="w-full bg-gray-900 border border-gray-600 p-2 rounded-lg text-sm text-gray-300" 
                  onChange={e => setEditingGame({...editingGame, newImageFile: e.target.files[0]})} />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setEditingGame(null)} className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-bold">ยกเลิก</button>
                <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-bold">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal แก้ไขสต็อก */}
      {editingStock && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setEditingStock(null)}>
          <div className="bg-gray-800 rounded-2xl max-w-2xl w-full p-8 border-2 border-green-500/30" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-green-400">แก้ไขสต็อก</h3>
              <button onClick={() => setEditingStock(null)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateStock} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">รหัส</label>
                <input required className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg font-mono text-green-400 focus:border-green-500 outline-none" 
                  value={editingStock.code} onChange={e => setEditingStock({...editingStock, code: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">ราคา</label>
                  <input required type="number" className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg focus:border-green-500 outline-none" 
                    value={editingStock.price} onChange={e => setEditingStock({...editingStock, price: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">สถานะ</label>
                  <select required className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg focus:border-green-500 outline-none"
                    value={editingStock.status} onChange={e => setEditingStock({...editingStock, status: e.target.value})}>
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">ชื่อสินค้า (ถ้ามี)</label>
                <input className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg focus:border-green-500 outline-none" 
                  value={editingStock.title || ''} onChange={e => setEditingStock({...editingStock, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">รายละเอียด (ถ้ามี)</label>
                <textarea className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg h-20 focus:border-green-500 outline-none" 
                  value={editingStock.description || ''} onChange={e => setEditingStock({...editingStock, description: e.target.value})} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="edit_is_public" className="w-5 h-5 accent-green-500"
                  checked={editingStock.is_public}
                  onChange={e => setEditingStock({...editingStock, is_public: e.target.checked})}
                />
                <label htmlFor="edit_is_public" className="text-white font-bold cursor-pointer">
                  ขายแยกชิ้น?
                </label>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">เปลี่ยนรูป (ถ้าต้องการ)</label>
                <input type="file" accept="image/*" className="w-full bg-gray-900 border border-gray-600 p-2 rounded-lg text-sm text-gray-300" 
                  onChange={e => setEditingStock({...editingStock, newImageFile: e.target.files[0]})} />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setEditingStock(null)} className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-bold">ยกเลิก</button>
                <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-xl font-bold">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
