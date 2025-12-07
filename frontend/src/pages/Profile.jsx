import { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Mail, Shield, Lock, CreditCard, ShoppingBag, LogOut, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ totalSpent: 0, totalItems: 0 });
  
  // Form เปลี่ยนรหัสผ่าน
  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
    fetchHistoryStats();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }

      const res = await axios.get('http://localhost:5000/api/wallet/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (err) { console.error(err); }
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
      return alert('รหัสผ่านใหม่ไม่ตรงกัน');
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/auth/change-password', {
        oldPassword: passForm.oldPassword,
        newPassword: passForm.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('เปลี่ยนรหัสผ่านสำเร็จ!');
      setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!profile) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <h1 className="text-3xl font-black text-gray-800 mb-8 flex items-center gap-2">
          <User className="w-8 h-8 text-red-600" /> ข้อมูลส่วนตัว (My Profile)
        </h1>

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

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;