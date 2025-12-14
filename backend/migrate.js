const db = require('./db');
const fs = require('fs');
const path = require('path');

async function migrate() {
  try {
    console.log('🚀 Starting database migration...\n');

    // อ่าน database.sql
    const sqlFile = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
    
    // แยกคำสั่ง SQL แต่ละคำสั่ง (ระวัง semicolon ใน subqueries)
    // แบ่งตาม pattern: CREATE TABLE, CREATE INDEX, INSERT INTO
    const statements = [];
    let currentStatement = '';
    const lines = sqlFile.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // ข้าม comment lines
      if (trimmed.startsWith('--') || trimmed.length === 0) {
        continue;
      }
      
      currentStatement += line + '\n';
      
      // ถ้าเจอ semicolon และ statement ไม่ว่าง ให้เพิ่มเข้า array
      if (trimmed.endsWith(';') && currentStatement.trim().length > 10) {
        statements.push(currentStatement.trim());
        currentStatement = '';
      }
    }
    
    // เพิ่ม statement สุดท้ายถ้ามี
    if (currentStatement.trim().length > 10) {
      statements.push(currentStatement.trim());
    }

    console.log(`Found ${statements.length} SQL statements\n`);

    // รันแต่ละคำสั่ง
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // ข้าม comment lines
      if (statement.startsWith('--') || statement.length < 10) {
        continue;
      }

      try {
        // ใช้ IF NOT EXISTS สำหรับ CREATE TABLE
        let safeStatement = statement;
        
        // แทนที่ CREATE TABLE เป็น CREATE TABLE IF NOT EXISTS
        if (statement.match(/^CREATE TABLE/i)) {
          const tableName = statement.match(/CREATE TABLE\s+(\w+)/i)?.[1];
          if (tableName) {
            // ตรวจสอบว่ามี table อยู่แล้วหรือไม่
            const exists = await db.query(`
              SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = $1
              )
            `, [tableName.toLowerCase()]);
            
            if (exists.rows[0].exists) {
              console.log(`⏭️  Table ${tableName} already exists, skipping...`);
              continue;
            }
          }
          safeStatement = statement.replace(/^CREATE TABLE/i, 'CREATE TABLE IF NOT EXISTS');
        }
        
        // แทนที่ CREATE INDEX เป็น CREATE INDEX IF NOT EXISTS
        if (statement.match(/^CREATE INDEX/i)) {
          const indexName = statement.match(/CREATE INDEX\s+(\w+)/i)?.[1];
          if (indexName) {
            // ตรวจสอบว่ามี index อยู่แล้วหรือไม่
            const exists = await db.query(`
              SELECT EXISTS (
                SELECT FROM pg_indexes 
                WHERE schemaname = 'public' 
                AND indexname = $1
              )
            `, [indexName.toLowerCase()]);
            
            if (exists.rows[0].exists) {
              console.log(`⏭️  Index ${indexName} already exists, skipping...`);
              continue;
            }
          }
          safeStatement = statement.replace(/^CREATE INDEX/i, 'CREATE INDEX IF NOT EXISTS');
        }

        await db.query(safeStatement);
        console.log(`✅ Statement ${i + 1} executed successfully`);
      } catch (err) {
        // ถ้า table/index มีอยู่แล้ว ข้ามไป
        if (err.code === '42P07' || err.code === '23505') {
          console.log(`⏭️  Statement ${i + 1} skipped (already exists)`);
        } else {
          console.error(`❌ Error in statement ${i + 1}:`, err.message);
          // ไม่ throw error เพื่อให้รันต่อ
        }
      }
    }

    console.log('\n✅ Migration completed!');
    
    // ตรวจสอบ tables ที่มี
    const tablesResult = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n📊 Current tables in database:');
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

// รัน migration
migrate()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });

