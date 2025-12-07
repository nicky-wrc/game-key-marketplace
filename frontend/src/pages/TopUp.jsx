import { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
      const res = await axios.get('http://localhost:5000/api/wallet/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
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
      await axios.post('http://localhost:5000/api/wallet/topup', 
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('เติมเงินสำเร็จ! 🎉');
      fetchBalance(); // อัปเดตยอดเงินทันที
    } catch (err) {
      alert('เติมเงินล้มเหลว');
    } finally {
      setLoading(false);
    }
  };

  const amounts = [50, 90, 150, 300, 500, 1000]; // ตัวเลือกราคา

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header ยอดเงิน */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 shadow-lg flex justify-between items-center">
          <div>
            <h2 className="text-xl opacity-80 mb-2">ยอดเงินคงเหลือ (Points)</h2>
            <div className="text-5xl font-bold flex items-center gap-2">
              <Wallet className="w-10 h-10" />
              ฿{Number(balance).toLocaleString()}
            </div>
          </div>
          <button onClick={() => navigate('/')} className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-full transition">
            กลับหน้าแรก
          </button>
        </div>

        {/* เลือกจำนวนเงิน */}
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <CreditCard className="text-purple-400" /> เลือกจำนวนเงินที่ต้องการเติม
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {amounts.map((amt) => (
            <button
              key={amt}
              onClick={() => handleTopUp(amt)}
              disabled={loading}
              className="bg-gray-800 hover:bg-purple-900 border-2 border-gray-700 hover:border-purple-500 rounded-xl p-6 transition duration-200 transform hover:-translate-y-1 group"
            >
              <div className="text-3xl font-bold text-white group-hover:text-purple-300">
                {amt} ฿
              </div>
              <div className="text-sm text-gray-400 mt-2">เติมเงินทันที</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopUp;