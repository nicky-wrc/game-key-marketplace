import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { CreditCard, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/ToastContainer';

function TopUp() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ดึงยอดเงินปัจจุบัน
  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      if(!token) return;
      const res = await axiosInstance.get('/api/wallet/me');
      setBalance(res.data.wallet_balance);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTopUp = async (amount) => {
    if(!window.confirm(`ยืนยันการเติมเงิน ${amount} บาท?`)) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.post('/api/wallet/topup', 
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(`เติมเงิน ${amount} บาทสำเร็จ! 🎉`, 'success');
      fetchBalance(); // อัปเดตยอดเงินทันที
    } catch (err) {
      showToast('เติมเงินล้มเหลว', 'error');
    } finally {
      setLoading(false);
    }
  };

  const amounts = [50, 90, 150, 300, 500, 1000]; // ตัวเลือกราคา

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header ยอดเงิน */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 mb-8 shadow-lg flex justify-between items-center text-white">
          <div>
            <h2 className="text-xl opacity-90 mb-2">ยอดเงินคงเหลือ (Points)</h2>
            <div className="text-5xl font-bold flex items-center gap-2">
              <Wallet className="w-10 h-10" />
              ฿{Number(balance).toLocaleString()}
            </div>
          </div>
          <button onClick={() => navigate('/')} className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-full transition font-bold">
            กลับหน้าแรก
          </button>
        </div>

        {/* เลือกจำนวนเงิน */}
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
          <CreditCard className="text-red-600" /> เลือกจำนวนเงินที่ต้องการเติม
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {amounts.map((amt) => (
            <button
              key={amt}
              onClick={() => handleTopUp(amt)}
              disabled={loading}
              className="bg-white hover:bg-red-50 border-2 border-gray-300 hover:border-red-500 rounded-xl p-6 transition duration-200 transform hover:-translate-y-1 group shadow-md"
            >
              <div className="text-3xl font-bold text-gray-800 group-hover:text-red-600">
                {amt} ฿
              </div>
              <div className="text-sm text-gray-600 mt-2">เติมเงินทันที</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopUp;