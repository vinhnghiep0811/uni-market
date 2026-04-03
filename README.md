# 🛒 Uni Market

Uni Market is a student marketplace platform where users can buy and sell used items such as textbooks, electronics, and dorm essentials.  
The platform focuses on simplicity, allowing direct contact between buyers and sellers (via Zalo, Facebook, etc.), with offline transactions.

---

## Features

- **Authentication**
  - Google OAuth login
  - JWT-based authentication (Access + Refresh Token)
  - Secure HTTP-only cookies

- **Listings**
  - Create, update, delete listings
  - Upload product images (MinIO - S3 compatible)
  - Categories: textbooks, electronics, dorm items, etc.

- **Browsing**
  - Pagination & filtering
  - Listing detail view
  - User contact info display

- **Favorites**
  - Save / unsave listings

- **Protected Routes**
  - Only authenticated users can create listings

---

## Tech Stack

### Backend
- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Google OAuth

### Frontend
- Next.js (App Router)
- React
- TailwindCSS

### Storage & Infrastructure
- MinIO (S3-compatible object storage)
- Docker & Docker Compose
- Nginx (reverse proxy)
- VPS Deployment

---

## ⚙️ Environment Variables

### Backend (`.env`)

```env
DATABASE_URL=postgresql://user:password@postgres:5432/unimarket

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

GOOGLE_CLIENT_ID=your_google_client_id

MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=uni-market
MINIO_USE_SSL=false
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

---

## Running with Docker

### Development

```bash
docker compose -f deploy/docker-compose.dev.yml up --build
```

Services:
- Frontend: http://localhost:3000  
- Backend: http://localhost:3001  
- MinIO Console: http://localhost:9001  

---

### Production

```bash
docker compose -f deploy/docker-compose.prod.yml up -d --build
```

---

## Authentication Flow

1. User logs in with Google  
2. Backend verifies Google ID token  
3. Returns:
   - Access Token (stored in memory)
   - Refresh Token (stored in HTTP-only cookie)  
4. Frontend:
   - Calls `/auth/me` to get user info  
   - Uses `/auth/refresh` when access token expires  

---

## API Overview

### Auth
- `POST /auth/google`
- `GET /auth/me`
- `POST /auth/refresh`
- `POST /auth/logout`

### Listings
- `GET /listings`
- `GET /listings/:id`
- `POST /listings`
- `PATCH /listings/:id`
- `DELETE /listings/:id`

---

## File Storage (MinIO)

- Files stored as:
  ```
  s3://uni-market/<file>
  ```
- Backend generates presigned URLs for secure access

---

## Future Improvements

- 💬 Real-time chat between buyer & seller  
- 💳 Online payment integration  
- ⭐ Seller rating system  
- 🔍 Advanced search & recommendation system  
- 📱 Mobile UI improvements  

---

## Author

Nghiep Le  

---

## License

This project is for educational and portfolio purposes.
