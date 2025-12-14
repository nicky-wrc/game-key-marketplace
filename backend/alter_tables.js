const db = require('./db');

async function alterTables() {
  try {
    console.log('🔧 Starting table alterations...\n');

    // ตรวจสอบและเพิ่ม columns ใน games table
    const gamesColumns = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'games' 
      AND table_schema = 'public'
    `);
    
    const existingColumns = gamesColumns.rows.map(r => r.column_name);
    console.log('Current games columns:', existingColumns.join(', '));

    // เพิ่ม category_id ถ้ายังไม่มี
    if (!existingColumns.includes('category_id')) {
      console.log('Adding category_id column...');
      await db.query(`
        ALTER TABLE games 
        ADD COLUMN category_id INT REFERENCES categories(category_id) ON DELETE SET NULL
      `);
      console.log('✅ Added category_id');
    }

    // เพิ่ม price ถ้ายังไม่มี
    if (!existingColumns.includes('price')) {
      console.log('Adding price column...');
      await db.query(`
        ALTER TABLE games 
        ADD COLUMN price DECIMAL(10, 2) NOT NULL DEFAULT 0.00
      `);
      console.log('✅ Added price');
    }

    // เพิ่ม original_price ถ้ายังไม่มี
    if (!existingColumns.includes('original_price')) {
      console.log('Adding original_price column...');
      await db.query(`
        ALTER TABLE games 
        ADD COLUMN original_price DECIMAL(10, 2)
      `);
      console.log('✅ Added original_price');
    }

    // เพิ่ม is_featured ถ้ายังไม่มี
    if (!existingColumns.includes('is_featured')) {
      console.log('Adding is_featured column...');
      await db.query(`
        ALTER TABLE games 
        ADD COLUMN is_featured BOOLEAN DEFAULT FALSE
      `);
      console.log('✅ Added is_featured');
    }

    // เพิ่ม release_date ถ้ายังไม่มี
    if (!existingColumns.includes('release_date')) {
      console.log('Adding release_date column...');
      await db.query(`
        ALTER TABLE games 
        ADD COLUMN release_date DATE
      `);
      console.log('✅ Added release_date');
    }

    // เพิ่ม developer ถ้ายังไม่มี
    if (!existingColumns.includes('developer')) {
      console.log('Adding developer column...');
      await db.query(`
        ALTER TABLE games 
        ADD COLUMN developer VARCHAR(100)
      `);
      console.log('✅ Added developer');
    }

    // เพิ่ม publisher ถ้ายังไม่มี
    if (!existingColumns.includes('publisher')) {
      console.log('Adding publisher column...');
      await db.query(`
        ALTER TABLE games 
        ADD COLUMN publisher VARCHAR(100)
      `);
      console.log('✅ Added publisher');
    }

    // ตรวจสอบและเพิ่ม columns ใน game_codes table
    const codesColumns = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'game_codes' 
      AND table_schema = 'public'
    `);
    
    const existingCodesColumns = codesColumns.rows.map(r => r.column_name);

    // เพิ่ม is_public ถ้ายังไม่มี
    if (!existingCodesColumns.includes('is_public')) {
      console.log('Adding is_public column to game_codes...');
      await db.query(`
        ALTER TABLE game_codes 
        ADD COLUMN is_public BOOLEAN DEFAULT TRUE
      `);
      console.log('✅ Added is_public to game_codes');
    }

    // เพิ่ม title ถ้ายังไม่มี
    if (!existingCodesColumns.includes('title')) {
      console.log('Adding title column to game_codes...');
      await db.query(`
        ALTER TABLE game_codes 
        ADD COLUMN title VARCHAR(100)
      `);
      console.log('✅ Added title to game_codes');
    }

    // เพิ่ม description ถ้ายังไม่มี
    if (!existingCodesColumns.includes('description')) {
      console.log('Adding description column to game_codes...');
      await db.query(`
        ALTER TABLE game_codes 
        ADD COLUMN description TEXT
      `);
      console.log('✅ Added description to game_codes');
    }

    // เพิ่ม image_url ถ้ายังไม่มี
    if (!existingCodesColumns.includes('image_url')) {
      console.log('Adding image_url column to game_codes...');
      await db.query(`
        ALTER TABLE game_codes 
        ADD COLUMN image_url TEXT
      `);
      console.log('✅ Added image_url to game_codes');
    }

    // เพิ่ม region ถ้ายังไม่มี
    if (!existingCodesColumns.includes('region')) {
      console.log('Adding region column to game_codes...');
      await db.query(`
        ALTER TABLE game_codes 
        ADD COLUMN region VARCHAR(50) DEFAULT 'Global'
      `);
      console.log('✅ Added region to game_codes');
    }

    // ตรวจสอบและเพิ่ม columns ใน transactions table
    const transColumns = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'transactions' 
      AND table_schema = 'public'
    `);
    
    const existingTransColumns = transColumns.rows.map(r => r.column_name);

    // เพิ่ม game_id ถ้ายังไม่มี
    if (!existingTransColumns.includes('game_id')) {
      console.log('Adding game_id column to transactions...');
      await db.query(`
        ALTER TABLE transactions 
        ADD COLUMN game_id INT REFERENCES games(game_id)
      `);
      console.log('✅ Added game_id to transactions');
    }

    // เพิ่ม original_amount ถ้ายังไม่มี
    if (!existingTransColumns.includes('original_amount')) {
      console.log('Adding original_amount column to transactions...');
      await db.query(`
        ALTER TABLE transactions 
        ADD COLUMN original_amount DECIMAL(10, 2)
      `);
      console.log('✅ Added original_amount to transactions');
    }

    // เพิ่ม discount_amount ถ้ายังไม่มี
    if (!existingTransColumns.includes('discount_amount')) {
      console.log('Adding discount_amount column to transactions...');
      await db.query(`
        ALTER TABLE transactions 
        ADD COLUMN discount_amount DECIMAL(10, 2) DEFAULT 0.00
      `);
      console.log('✅ Added discount_amount to transactions');
    }

    // เพิ่ม coupon_code ถ้ายังไม่มี
    if (!existingTransColumns.includes('coupon_code')) {
      console.log('Adding coupon_code column to transactions...');
      await db.query(`
        ALTER TABLE transactions 
        ADD COLUMN coupon_code VARCHAR(50)
      `);
      console.log('✅ Added coupon_code to transactions');
    }

    // เพิ่ม details ถ้ายังไม่มี
    if (!existingTransColumns.includes('details')) {
      console.log('Adding details column to transactions...');
      await db.query(`
        ALTER TABLE transactions 
        ADD COLUMN details TEXT
      `);
      console.log('✅ Added details to transactions');
    }

    // ตรวจสอบและเพิ่ม columns ใน users table
    const usersColumns = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND table_schema = 'public'
    `);
    
    const existingUsersColumns = usersColumns.rows.map(r => r.column_name);

    // เพิ่ม wallet_balance ถ้ายังไม่มี
    if (!existingUsersColumns.includes('wallet_balance')) {
      console.log('Adding wallet_balance column to users...');
      await db.query(`
        ALTER TABLE users 
        ADD COLUMN wallet_balance DECIMAL(10, 2) DEFAULT 0.00
      `);
      console.log('✅ Added wallet_balance to users');
    }

    // เพิ่ม last_daily_claim ถ้ายังไม่มี
    if (!existingUsersColumns.includes('last_daily_claim')) {
      console.log('Adding last_daily_claim column to users...');
      await db.query(`
        ALTER TABLE users 
        ADD COLUMN last_daily_claim TIMESTAMP
      `);
      console.log('✅ Added last_daily_claim to users');
    }

    // เพิ่ม avatar_url ถ้ายังไม่มี
    if (!existingUsersColumns.includes('avatar_url')) {
      console.log('Adding avatar_url column to users...');
      await db.query(`
        ALTER TABLE users 
        ADD COLUMN avatar_url TEXT
      `);
      console.log('✅ Added avatar_url to users');
    }

    // ตรวจสอบและเพิ่ม columns ใน mystery_boxes table
    const boxesColumns = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'mystery_boxes' 
      AND table_schema = 'public'
    `);
    
    const existingBoxesColumns = boxesColumns.rows.map(r => r.column_name);

    if (!existingBoxesColumns.includes('name_th')) {
      console.log('Adding name_th column to mystery_boxes...');
      await db.query(`
        ALTER TABLE mystery_boxes 
        ADD COLUMN name_th VARCHAR(100)
      `);
      console.log('✅ Added name_th to mystery_boxes');
    }

    if (!existingBoxesColumns.includes('description_th')) {
      console.log('Adding description_th column to mystery_boxes...');
      await db.query(`
        ALTER TABLE mystery_boxes 
        ADD COLUMN description_th TEXT
      `);
      console.log('✅ Added description_th to mystery_boxes');
    }

    if (!existingBoxesColumns.includes('rarity')) {
      console.log('Adding rarity column to mystery_boxes...');
      await db.query(`
        ALTER TABLE mystery_boxes 
        ADD COLUMN rarity VARCHAR(20) DEFAULT 'common'
      `);
      console.log('✅ Added rarity to mystery_boxes');
    }

    if (!existingBoxesColumns.includes('is_active')) {
      console.log('Adding is_active column to mystery_boxes...');
      await db.query(`
        ALTER TABLE mystery_boxes 
        ADD COLUMN is_active BOOLEAN DEFAULT TRUE
      `);
      console.log('✅ Added is_active to mystery_boxes');
    }

    // ตรวจสอบและเพิ่ม columns ใน box_items table
    const itemsColumns = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'box_items' 
      AND table_schema = 'public'
    `);
    
    const existingItemsColumns = itemsColumns.rows.map(r => r.column_name);

    if (!existingItemsColumns.includes('item_type')) {
      console.log('Adding item_type column to box_items...');
      await db.query(`
        ALTER TABLE box_items 
        ADD COLUMN item_type VARCHAR(50) DEFAULT 'game_code'
      `);
      console.log('✅ Added item_type to box_items');
    }

    if (!existingItemsColumns.includes('prize_data')) {
      console.log('Adding prize_data column to box_items...');
      await db.query(`
        ALTER TABLE box_items 
        ADD COLUMN prize_data TEXT
      `);
      console.log('✅ Added prize_data to box_items');
    }

    if (!existingItemsColumns.includes('drop_rate')) {
      console.log('Adding drop_rate column to box_items...');
      await db.query(`
        ALTER TABLE box_items 
        ADD COLUMN drop_rate DECIMAL(5, 2) NOT NULL DEFAULT 0.00
      `);
      console.log('✅ Added drop_rate to box_items');
    }

    if (!existingItemsColumns.includes('rarity')) {
      console.log('Adding rarity column to box_items...');
      await db.query(`
        ALTER TABLE box_items 
        ADD COLUMN rarity VARCHAR(20) DEFAULT 'common'
      `);
      console.log('✅ Added rarity to box_items');
    }

    if (!existingItemsColumns.includes('image_url')) {
      console.log('Adding image_url column to box_items...');
      await db.query(`
        ALTER TABLE box_items 
        ADD COLUMN image_url TEXT
      `);
      console.log('✅ Added image_url to box_items');
    }

    // ตรวจสอบและเพิ่ม columns ใน coupons table
    const couponsColumns = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'coupons' 
      AND table_schema = 'public'
    `);
    
    const existingCouponsColumns = couponsColumns.rows.map(r => r.column_name);

    if (!existingCouponsColumns.includes('discount_type')) {
      console.log('Adding discount_type column to coupons...');
      await db.query(`
        ALTER TABLE coupons 
        ADD COLUMN discount_type VARCHAR(20) DEFAULT 'fixed'
      `);
      console.log('✅ Added discount_type to coupons');
    }

    if (!existingCouponsColumns.includes('min_purchase')) {
      console.log('Adding min_purchase column to coupons...');
      await db.query(`
        ALTER TABLE coupons 
        ADD COLUMN min_purchase DECIMAL(10, 2) DEFAULT 0.00
      `);
      console.log('✅ Added min_purchase to coupons');
    }

    if (!existingCouponsColumns.includes('max_discount')) {
      console.log('Adding max_discount column to coupons...');
      await db.query(`
        ALTER TABLE coupons 
        ADD COLUMN max_discount DECIMAL(10, 2)
      `);
      console.log('✅ Added max_discount to coupons');
    }

    if (!existingCouponsColumns.includes('usage_limit')) {
      console.log('Adding usage_limit column to coupons...');
      await db.query(`
        ALTER TABLE coupons 
        ADD COLUMN usage_limit INT DEFAULT 100
      `);
      console.log('✅ Added usage_limit to coupons');
    }

    if (!existingCouponsColumns.includes('used_count')) {
      console.log('Adding used_count column to coupons...');
      await db.query(`
        ALTER TABLE coupons 
        ADD COLUMN used_count INT DEFAULT 0
      `);
      console.log('✅ Added used_count to coupons');
    }

    if (!existingCouponsColumns.includes('start_date')) {
      console.log('Adding start_date column to coupons...');
      await db.query(`
        ALTER TABLE coupons 
        ADD COLUMN start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      console.log('✅ Added start_date to coupons');
    }

    if (!existingCouponsColumns.includes('end_date')) {
      console.log('Adding end_date column to coupons...');
      await db.query(`
        ALTER TABLE coupons 
        ADD COLUMN end_date TIMESTAMP
      `);
      console.log('✅ Added end_date to coupons');
    }

    if (!existingCouponsColumns.includes('is_active')) {
      console.log('Adding is_active column to coupons...');
      await db.query(`
        ALTER TABLE coupons 
        ADD COLUMN is_active BOOLEAN DEFAULT TRUE
      `);
      console.log('✅ Added is_active to coupons');
    }

    console.log('\n✅ All table alterations completed!');

  } catch (err) {
    console.error('❌ Alteration failed:', err);
    process.exit(1);
  }
}

// รัน alterations
alterTables()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });

