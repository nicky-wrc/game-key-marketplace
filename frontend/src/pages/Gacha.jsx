import { useEffect, useState } from 'react';
import axios from 'axios';
import { Gift, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Gacha() {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false); // สถานะกำลังหมุน
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoxes();
  }, []);

  const fetchBoxes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/gacha');
      setBoxes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpin = async (boxId, price) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('กรุณาเข้าสู่ระบบก่อนสุ่ม');
      navigate('/login');
      return;
    }

    if (!window.confirm(`ยืนยันการสุ่มในราคา ${price} บาท?`)) return;

    setSpinning(true);

    try {
      // 1. หน่วงเวลา 2 วินาที (เพื่อความตื่นเต้น เหมือนตู้กำลังหมุน)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 2. ยิง API สุ่มจริง
      const res = await axios.post(
        'http://localhost:5000/api/gacha/spin',
        { box_id: boxId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3. แสดงผลรางวัล
      const prize = res.data.prize;
      if (prize.type === 'salt') {
        alert(`😢 เกลือจ้า! (คุณได้: ${prize.name})\nเงินคงเหลือ: ฿${res.data.remaining_balance}`);
      } else {
        alert(`🎉 ยินดีด้วย!! คุณได้: ${prize.name}\nข้อมูลของรางวัล: ${prize.prize_data}`);
      }
      
      // (Optional) อาจจะสั่งให้ Navbar อัปเดตยอดเงินตรงนี้ได้ ถ้าเราทำ Context (ตอนนี้กด Refresh หน้าเอาก่อน)

    } catch (err) {
      alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการสุ่ม');
    } finally {
      setSpinning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4 animate-pulse">
          🎲 Mystery Gacha Shop
        </h1>
        <p className="text-gray-400">วัดดวงเสี่ยงโชค ลุ้นรับรหัสเทพในราคาหลักสิบ!</p>
        <button onClick={() => navigate('/')} className="mt-4 text-sm text-gray-500 hover:text-white underline">
          กลับหน้าหลัก
        </button>
      </div>

      {/* Gacha Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {loading ? (
          <p className="text-center col-span-3">กำลังโหลดตู้กาชา...</p>
        ) : (
          boxes.map((box) => (
            <div key={box.box_id} className="bg-gray-800 border-2 border-purple-500/30 rounded-2xl overflow-hidden hover:border-purple-500 transition duration-300 shadow-lg shadow-purple-500/20 transform hover:-translate-y-2">
              
              {/* Image Cover */}
              <div className="h-56 bg-gray-700 relative overflow-hidden group">
                {box.image_url ? (
                   <img src={box.image_url} alt={box.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                ) : (
                   <div className="flex items-center justify-center h-full"><Gift className="w-16 h-16 text-purple-400" /></div>
                )}
                
                {/* Price Tag */}
                <div className="absolute top-4 right-4 bg-yellow-500 text-black font-bold px-3 py-1 rounded-full shadow-lg">
                  ฿{box.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2 text-purple-300">{box.name}</h3>
                <p className="text-sm text-gray-400 mb-6">{box.description || 'ลุ้นรับรางวัลใหญ่!'}</p>

                <button
                  onClick={() => handleSpin(box.box_id, box.price)}
                  disabled={spinning}
                  className={`w-full py-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 
                    ${spinning 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 active:scale-95'
                    }`}
                >
                  {spinning ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" /> กำลังสุ่ม...
                    </span>
                  ) : (
                    'สุ่มเลย! 🎲'
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Gacha;