# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack game key marketplace where users buy/sell game codes. Features include wallet system, gacha mechanics, coupon discounts, and admin dashboard.

## Development Commands

### Frontend (in `frontend/`)
```bash
npm install
npm run dev      # Vite dev server at http://localhost:5173
npm run build    # Production build to dist/
npm run lint     # ESLint check
```

### Backend (in `backend/`)
```bash
npm install
npm run dev      # Nodemon with auto-restart at http://localhost:5000
npm start        # Production server
```

### Database Setup
1. Configure `backend/.env`:
   ```
   DB_USER=<username>
   DB_HOST=localhost
   DB_DATABASE=<database_name>
   DB_PASSWORD=<password>
   DB_PORT=5432
   JWT_SECRET=<secret_key>
   PORT=5000
   ```
2. Run `backend/database.sql` in PostgreSQL to create schema

## Architecture

### Backend (Express + PostgreSQL)
- **MVC pattern**: `controllers/` for business logic, `routes/` for endpoints, `middleware/` for auth/admin checks
- **db.js**: PostgreSQL connection pool - use `db.query()` for all database operations
- **Authentication**: JWT tokens (1hr expiry) verified via `authMiddleware.js`
- **Admin access**: Additional `adminMiddleware.js` checks `role='admin'`
- **File uploads**: Multer stores images in `uploads/`, served via static middleware

### Frontend (React 19 + Vite + Tailwind)
- **pages/**: Route-level components (Home, Login, Admin, GameDetail, etc.)
- **components/**: Reusable UI (Toast, LoadingSkeleton)
- **Routing**: React Router v7 in App.jsx
- **State**: React hooks + localStorage for wishlist persistence
- **API calls**: Axios with JWT in Authorization header

## API Routes

| Prefix | Purpose | Auth Required |
|--------|---------|---------------|
| `/api/auth` | Login, register, change password | Partial |
| `/api/games` | Game listings, stock info | No |
| `/api/wallet` | Balance, top-up | Yes |
| `/api/transactions` | Buy games, purchase history | Yes |
| `/api/gacha` | Gacha boxes, play | Yes |
| `/api/coupons` | Validate coupons | No |
| `/api/admin` | Dashboard, manage games/coupons/gacha | Admin only |

## Key Patterns

**Adding a new API endpoint:**
1. Create function in `backend/controllers/`
2. Add route in `backend/routes/` with appropriate middleware
3. Mount route in `backend/server.js`

**Database tables** (defined in `database.sql`):
- `users` - accounts with roles (user/seller/admin)
- `games` - game metadata
- `game_codes` - individual keys with status tracking
- `transactions` - purchase records
- `coupons` - discount codes with usage limits
- `gacha_boxes` - random box configurations

**Toast notifications**: Use `showToast(message, type)` prop passed through App.jsx - types: success, error, warning, info
