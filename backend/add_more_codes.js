const db = require('./db');

async function addMoreGameCodes() {
  try {
    console.log('🎮 Starting to add more game codes...\n');

    // ดึงเกมทั้งหมด
    const gamesResult = await db.query('SELECT game_id, name, platform FROM games ORDER BY game_id');
    const games = gamesResult.rows;
    
    console.log(`Found ${games.length} games\n`);

    let totalCodesAdded = 0;

    for (const game of games) {
      // ตรวจสอบว่ามีรหัสอยู่แล้วกี่ตัว
      const existingCodes = await db.query(
        'SELECT COUNT(*) as count FROM game_codes WHERE game_id = $1',
        [game.game_id]
      );
      const existingCount = parseInt(existingCodes.rows[0].count);

      // ถ้ามีน้อยกว่า 20 รหัส ให้เพิ่มให้ครบ 20-30 รหัส
      const targetCount = 25; // เป้าหมาย 25 รหัสต่อเกม
      const codesToAdd = Math.max(0, targetCount - existingCount);

      if (codesToAdd > 0) {
        console.log(`Adding ${codesToAdd} codes for: ${game.name} (${game.platform})`);

        const codes = [];
        const sellerIds = [1, 2]; // admin และ seller

        for (let i = 0; i < codesToAdd; i++) {
          const sellerId = sellerIds[Math.floor(Math.random() * sellerIds.length)];
          const isPublic = Math.random() > 0.7; // 30% เป็น public (ขายแยก)
          const region = Math.random() > 0.5 ? 'Global' : 'Asia';
          
          // สร้างรหัส fake
          const codePrefix = game.name.substring(0, 5).toUpperCase().replace(/\s/g, '');
          const platformPrefix = game.platform.substring(0, 3).toUpperCase();
          const randomCode = Math.random().toString(36).substring(2, 15).toUpperCase();
          const code = `${codePrefix}-${platformPrefix}-${randomCode}`;

          // ราคา (อาจจะถูกกว่าเกมเล็กน้อย)
          const basePrice = parseFloat(game.price) || 100;
          const priceVariation = basePrice * (0.85 + Math.random() * 0.15); // ±15%
          const price = Math.round(priceVariation * 100) / 100;

          codes.push({
            game_id: game.game_id,
            seller_id: sellerId,
            code: code,
            price: price,
            status: 'available',
            is_public: isPublic,
            region: region
          });
        }

        // Insert codes
        for (const codeData of codes) {
          await db.query(
            `INSERT INTO game_codes (game_id, seller_id, code, price, status, is_public, region)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              codeData.game_id,
              codeData.seller_id,
              codeData.code,
              codeData.price,
              codeData.status,
              codeData.is_public,
              codeData.region
            ]
          );
        }

        totalCodesAdded += codesToAdd;
        console.log(`  ✅ Added ${codesToAdd} codes`);
      } else {
        console.log(`  ⏭️  ${game.name} already has ${existingCount} codes, skipping`);
      }
    }

    console.log(`\n✅ Total codes added: ${totalCodesAdded}`);
    
    // สถิติ
    const totalCodes = await db.query('SELECT COUNT(*) as count FROM game_codes');
    const availableCodes = await db.query("SELECT COUNT(*) as count FROM game_codes WHERE status = 'available'");
    
    console.log(`\n📊 Statistics:`);
    console.log(`   - Total game codes: ${totalCodes.rows[0].count}`);
    console.log(`   - Available codes: ${availableCodes.rows[0].count}`);

  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

addMoreGameCodes()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });

