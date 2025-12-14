const db = require('../db');

// ดึงเกมทั้งหมด (พร้อม pagination, search, filter)
exports.getAllGames = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            search = '',
            category = '',
            platform = '',
            minPrice = '',
            maxPrice = '',
            sort = 'newest'
        } = req.query;

        const offset = (page - 1) * limit;
        let whereConditions = ['1=1'];
        let queryParams = [];
        let paramIndex = 1;

        // Search by name
        if (search) {
            whereConditions.push(`LOWER(g.name) LIKE LOWER($${paramIndex})`);
            queryParams.push(`%${search}%`);
            paramIndex++;
        }

        // Filter by category
        if (category) {
            whereConditions.push(`g.category_id = $${paramIndex}`);
            queryParams.push(category);
            paramIndex++;
        }

        // Filter by platform
        if (platform) {
            whereConditions.push(`LOWER(g.platform) = LOWER($${paramIndex})`);
            queryParams.push(platform);
            paramIndex++;
        }

        // Filter by price range
        if (minPrice) {
            whereConditions.push(`g.price >= $${paramIndex}`);
            queryParams.push(minPrice);
            paramIndex++;
        }
        if (maxPrice) {
            whereConditions.push(`g.price <= $${paramIndex}`);
            queryParams.push(maxPrice);
            paramIndex++;
        }

        // Sorting
        let orderBy = 'g.created_at DESC';
        switch (sort) {
            case 'price_low':
                orderBy = 'g.price ASC';
                break;
            case 'price_high':
                orderBy = 'g.price DESC';
                break;
            case 'name':
                orderBy = 'g.name ASC';
                break;
            case 'rating':
                orderBy = 'avg_rating DESC';
                break;
            case 'popular':
                orderBy = 'review_count DESC';
                break;
            default:
                orderBy = 'g.created_at DESC';
        }

        // Main query
        const gamesQuery = `
            SELECT DISTINCT ON (g.game_id) g.*,
                   c.name as category_name,
                   c.name_th as category_name_th,
                   COALESCE(AVG(r.rating), 0) as avg_rating,
                   COUNT(DISTINCT r.review_id) as review_count,
                   COUNT(DISTINCT gc.code_id) FILTER (WHERE gc.status = 'available') as stock_count
            FROM games g
            LEFT JOIN categories c ON g.category_id = c.category_id
            LEFT JOIN reviews r ON g.game_id = r.game_id
            LEFT JOIN game_codes gc ON g.game_id = gc.game_id
            WHERE ${whereConditions.join(' AND ')}
            GROUP BY g.game_id, c.category_id, c.name, c.name_th
            ORDER BY g.game_id, ${orderBy}
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;

        queryParams.push(limit, offset);
        const result = await db.query(gamesQuery, queryParams);

        // Count total
        const countQuery = `
            SELECT COUNT(DISTINCT g.game_id)
            FROM games g
            WHERE ${whereConditions.join(' AND ')}
        `;
        const countResult = await db.query(countQuery, queryParams.slice(0, -2));
        const totalGames = parseInt(countResult.rows[0].count);

        res.json({
            games: result.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalGames / limit),
                totalGames,
                limit: parseInt(limit)
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ดึงเกมแนะนำ (Featured)
exports.getFeaturedGames = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const result = await db.query(`
            SELECT DISTINCT ON (g.game_id) g.*,
                   c.name as category_name,
                   c.name_th as category_name_th,
                   COALESCE(AVG(r.rating), 0) as avg_rating,
                   COUNT(DISTINCT r.review_id) as review_count,
                   COUNT(DISTINCT gc.code_id) FILTER (WHERE gc.status = 'available') as stock_count
            FROM games g
            LEFT JOIN categories c ON g.category_id = c.category_id
            LEFT JOIN reviews r ON g.game_id = r.game_id
            LEFT JOIN game_codes gc ON g.game_id = gc.game_id
            WHERE g.is_featured = TRUE
            GROUP BY g.game_id, c.category_id, c.name, c.name_th
            ORDER BY g.game_id, g.created_at DESC
            LIMIT $1
        `, [limit]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ดึงเกมยอดนิยม (Popular - based on sales/reviews)
exports.getPopularGames = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const result = await db.query(`
            SELECT DISTINCT ON (g.game_id) g.*,
                   c.name as category_name,
                   c.name_th as category_name_th,
                   COALESCE(AVG(r.rating), 0) as avg_rating,
                   COUNT(DISTINCT r.review_id) as review_count,
                   COUNT(DISTINCT t.transaction_id) as sales_count,
                   COUNT(DISTINCT gc.code_id) FILTER (WHERE gc.status = 'available') as stock_count
            FROM games g
            LEFT JOIN categories c ON g.category_id = c.category_id
            LEFT JOIN reviews r ON g.game_id = r.game_id
            LEFT JOIN game_codes gc ON g.game_id = gc.game_id
            LEFT JOIN transactions t ON g.game_id = t.game_id
            GROUP BY g.game_id, c.category_id, c.name, c.name_th
            ORDER BY g.game_id, sales_count DESC, review_count DESC, avg_rating DESC
            LIMIT $1
        `, [limit]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ดึงเกมใหม่ (New Releases)
exports.getNewGames = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const result = await db.query(`
            SELECT g.*,
                   c.name as category_name,
                   c.name_th as category_name_th,
                   COALESCE(AVG(r.rating), 0) as avg_rating,
                   COUNT(DISTINCT r.review_id) as review_count,
                   COUNT(DISTINCT gc.code_id) FILTER (WHERE gc.status = 'available') as stock_count
            FROM games g
            LEFT JOIN categories c ON g.category_id = c.category_id
            LEFT JOIN reviews r ON g.game_id = r.game_id
            LEFT JOIN game_codes gc ON g.game_id = gc.game_id
            GROUP BY g.game_id, c.category_id
            ORDER BY g.created_at DESC
            LIMIT $1
        `, [limit]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ดึงเกมตาม ID (พร้อมข้อมูลเพิ่มเติม)
exports.getGameById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(`
            SELECT g.*,
                   c.name as category_name,
                   c.name_th as category_name_th,
                   COALESCE(AVG(r.rating), 0) as avg_rating,
                   COUNT(DISTINCT r.review_id) as review_count,
                   COUNT(DISTINCT gc.code_id) FILTER (WHERE gc.status = 'available') as stock_count
            FROM games g
            LEFT JOIN categories c ON g.category_id = c.category_id
            LEFT JOIN reviews r ON g.game_id = r.game_id
            LEFT JOIN game_codes gc ON g.game_id = gc.game_id
            WHERE g.game_id = $1
            GROUP BY g.game_id, c.category_id
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // ดึงเกมที่เกี่ยวข้อง (same category)
        const relatedGames = await db.query(`
            SELECT g.*,
                   COALESCE(AVG(r.rating), 0) as avg_rating,
                   COUNT(DISTINCT r.review_id) as review_count
            FROM games g
            LEFT JOIN reviews r ON g.game_id = r.game_id
            WHERE g.category_id = $1 AND g.game_id != $2
            GROUP BY g.game_id
            ORDER BY RANDOM()
            LIMIT 6
        `, [result.rows[0].category_id, id]);

        res.json({
            game: result.rows[0],
            relatedGames: relatedGames.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ดึงสต็อกรายเกม (รายการไอดีที่ขายแยก)
exports.getGameStock = async (req, res) => {
    const { id } = req.params; 
    try {
        const result = await db.query(
            `SELECT code_id, title, description, price, image_url, region
             FROM game_codes 
             WHERE game_id = $1 AND status = 'available' AND is_public = TRUE
             ORDER BY price ASC`,
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};