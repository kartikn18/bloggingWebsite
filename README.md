# Social Connect

A full-stack social blogging platform where users can create posts with images, like/unlike posts, and view a personalized dashboard — built with Node.js, TypeScript, PostgreSQL, Redis, and Cloudinary.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express 5 |
| Database | PostgreSQL (via Kysely query builder) |
| Caching | Redis (via ioredis) |
| File Storage | Cloudinary |
| Auth | JWT (access token + refresh token) |
| Templating | EJS |
| Validation | Zod |
| File Uploads | Multer (memory storage) |
| Dev Server | Nodemon + ts-node |

---

## Features

- **Auth** — register and login with rate limiting (blocks IP after 3 failed attempts for 5 minutes)
- **JWT sessions** — access token (24h) stored in `localStorage`, refresh token (7d) in an `httpOnly` cookie
- **Create posts** — title, content, and one or more images (uploaded to Cloudinary)
- **Image display** — uploaded images render inline on the dashboard feed
- **Like / Unlike** — toggle-based; each user can like a post once (enforced by `UNIQUE(user_id, post_id)` at the database level)
- **Dashboard feed** — shows all posts from all users with images and like counts
- **My posts** — cached per-user dashboard (Redis, 5 min TTL) showing only your own posts
- **Profile page** — shows post count and total likes received
- **Edit posts** — owners can update the title and content of their own posts
- **Input validation** — Zod schema on registration (email, strong password, username rules)

---

## Project Structure

```
├── main.ts                        # App entry point
├── views/
│   ├── partials/head.ejs
│   ├── login.ejs
│   ├── signup.ejs
│   ├── dashboard.ejs
│   └── profile.ejs
├── public/
│   ├── css/app.css
│   └── js/api.js                  # Client-side auth helpers
└── src/
    ├── config/
    │   ├── db.ts                  # Kysely + PostgreSQL pool
    │   ├── redis.ts               # ioredis client
    │   ├── cloudinary.ts          # Cloudinary SDK config
    │   └── multer.ts              # Memory storage, 5MB limit
    ├── schema/
    │   └── db.ts                  # Kysely table types
    ├── migrations/
    │   └── SCHEMA.SQL             # Raw SQL table definitions
    ├── models/
    │   ├── user.model.ts
    │   └── posts.model.ts
    ├── services/
    │   ├── user.services.ts
    │   └── posts.services.ts
    ├── controller/
    │   ├── user.controller.ts
    │   └── posts.controller.ts
    ├── routes/
    │   ├── auth.routes.ts
    │   ├── posts.routes.ts
    │   └── views.routes.ts
    ├── middleware/
    │   ├── islogin.ts             # JWT verification
    │   ├── loginattempts.ts       # IP-based rate limiting
    │   └── validate.ts            # Zod request body validation
    ├── types/
    │   ├── auth.types.ts
    │   └── posts.types.ts
    └── utils/
        ├── jwt.ts                 # Token generation helpers
        └── upload.ts              # Cloudinary upload via stream
```

---

## Database Schema

```sql
-- Users
users (id, username, email, password_hash, created_at, updated_at)

-- Posts
post (id, user_id → users, likes, title, content, images, created_at, updated_at)

-- Post images (linked to a post)
blogsimages_url (id, post_id → post, image_url, created_at, updated_at)

-- Like junction table — enforces one like per user per post
likes (id, user_id → users, post_id → post, created_at, UNIQUE(user_id, post_id))
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Redis
- A [Cloudinary](https://cloudinary.com) account (free tier works)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd <project-folder>
npm install
```

### 2. Set up environment variables

Create a `.env` file in the project root:

```env
# Server
PORT=3000
NODE_ENV=development

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=socialconnect
DB_USER=postgres
DB_PASSWORD=yourpassword

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# JWT
JWT_SECRET=your_super_secret_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Create the database tables

Connect to your PostgreSQL instance and run the SQL in `src/migrations/SCHEMA.SQL`:

```bash
psql -U postgres -d socialconnect -f src/migrations/SCHEMA.SQL
```

### 4. Start the dev server

```bash
npm start
```

The app will be available at `http://localhost:3000`.

---

## API Reference

### Auth

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login, returns access token + sets refresh cookie |

### Posts

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/posts/` | No | Get all posts (with images) |
| GET | `/posts/mine` | Yes | Get current user's posts (Redis cached) |
| POST | `/posts/createPost` | Yes | Create a post with images (multipart) |
| PUT | `/posts/updatePost/:id` | Yes | Update post title and content |
| POST | `/posts/likePost/:id` | Yes | Toggle like/unlike on a post |

### Views

| Route | Description |
|---|---|
| `/login-page` | Login page |
| `/signup-page` | Registration page |
| `/dashboard` | Main feed + post creation |
| `/profile-page` | User profile and their posts |

---

## Key Implementation Details

### Like toggle
When a user clicks Like, the server checks the `likes` table for an existing `(user_id, post_id)` row. If found it deletes the row and decrements the count (unlike); if not found it inserts and increments (like). The `UNIQUE(user_id, post_id)` constraint on the `likes` table acts as a safety net at the database level.

### Image uploads
Multer is configured with `memoryStorage` — files never touch disk. The buffer is piped directly to Cloudinary via `upload_stream`. The returned `secure_url` is stored in `blogsimages_url` linked to the post's id.

### Caching
Dashboard posts (`GET /posts/mine`) are cached in Redis under the key `dashboardposts:<userid>` with a 5-minute TTL. The cache is invalidated whenever the user creates a new post.

### Rate limiting
The login route tracks failed attempts in Redis under `attempts:<ip>`. After 3 failures the IP is blocked for 5 minutes via a `blocked:<ip>` key. A successful login clears the attempts counter.

### Password rules
Zod enforces: minimum 8 characters, at least one uppercase letter, one lowercase letter, one digit, and one special character (`@$!%*?&`).

---

## Environment Notes

- `NODE_ENV=production` enables the `secure` flag on the refresh token cookie.
- Both the access token and refresh token are signed with the same `JWT_SECRET`. In a production setup you would use separate secrets or asymmetric keys.
- The `likes` counter on the `post` table is a denormalised cache of the `likes` junction table row count. They are kept in sync by the toggle logic in `PostModel.likepost`.