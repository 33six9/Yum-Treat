# YumTreat Backend

Express + MongoDB (Mongoose) API for the YumTreat frontend. Authentication
is handled by **Firebase Authentication** (email/password + Google) —
this API never sees a password; it only verifies Firebase ID tokens.

## Requirements
- Node.js 18+
- A MongoDB database (local `mongod`, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- A [Firebase project](https://console.firebase.google.com/) with **Email/Password**
  and **Google** sign-in providers enabled (Authentication -> Sign-in method)

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — your MongoDB connection string
- `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` —
  from Firebase console: **Project settings -> Service accounts -> Generate
  new private key**. Copy `project_id`, `client_email`, and `private_key`
  from the downloaded JSON (keep the `\n` line breaks in `private_key` as-is).
- `ADMIN_EMAILS` — comma-separated emails that get promoted to the `admin`
  role automatically the first time (or next time) they sign in.

Run the server — that's it, no separate seed step needed:

```bash
npm run dev      # with nodemon, auto-restarts on changes
# or
npm start
```

The API listens on `http://localhost:5000` by default. On startup, if the
database is completely empty, it automatically seeds ~7 categories and ~54
food items for you — you'll see `Database was empty — auto-seeded...` in
the logs the first time. It's a no-op on every subsequent restart once data
exists, so it's always safe to leave running.

There's no user seeding step either — create an account through the
frontend's sign-up/Google sign-in, then add that email to `ADMIN_EMAILS`
in `.env` (and sign in again) to make it an admin.

If you ever want to reset back to the demo data on purpose (wipe +
re-populate), the standalone script is still there:

```bash
npm run seed            # wipe + re-populate categories/foods
npm run seed:destroy    # wipe categories/foods, leave the database empty
```

## How auth works

1. The frontend signs the user in/up directly against Firebase (email/password
   or Google) using the Firebase client SDK — no request to this backend.
2. Firebase issues an ID token; the frontend attaches it as
   `Authorization: Bearer <idToken>` on every API request.
3. `requireAuth` (in `src/middleware/auth.js`) verifies that token with the
   Firebase Admin SDK, then finds-or-creates a matching local `User` document
   (by `firebaseUid`) so the app has a place to store `role` and other
   app-specific fields Firebase doesn't track.
4. `requireAdmin` restricts a route to users whose local record has
   `role: "admin"`.

## API overview

| Method | Route                              | Auth        | Notes |
|--------|-------------------------------------|-------------|-------|
| GET    | `/api/auth/account`                 | Bearer      | verifies token, syncs & returns current user profile |
| GET    | `/api/foods`                        | –           | list all foods |
| GET    | `/api/foods/:id`                    | –           | single food |
| POST   | `/api/foods/add`                    | Bearer+admin| admin dashboard |
| PUT    | `/api/foods/update/:id`             | Bearer+admin| admin dashboard |
| DELETE | `/api/foods/delete/:id`             | Bearer+admin| admin dashboard |
| GET    | `/api/categories`                   | –           | list categories |
| POST   | `/api/orders/place`                 | Bearer      | places an order; prices/totals computed server-side |
| GET    | `/api/orders/my-orders`             | Bearer      | current user's orders |
| GET    | `/api/orders/admin`                 | Bearer+admin| `?status=&search=&from=&to=&page=&limit=&sort=` |
| GET    | `/api/orders/admin/stats`           | Bearer+admin| status counts, revenue, today's order count |
| PATCH  | `/api/orders/update-status/:id`     | Bearer+admin| `{ status, cancelReason? }` |
| PATCH  | `/api/orders/cancel/:id`            | Bearer      | customer cancels their own (still-preparing) order |
| PATCH  | `/api/orders/complete/:id`          | Bearer      | customer confirms receipt |
| GET    | `/api/reviews/`                     | Bearer      | all reviews |
| GET    | `/api/reviews/user/:userID`         | Bearer      | reviews by a user |
| GET    | `/api/reviews/product/:productID`   | –           | reviews for a food item (public, so guests can see reviews on a dish page) |
| POST   | `/api/reviews/` or `/add-review`    | Bearer      | add a review |

`Bearer` = send `Authorization: Bearer <firebaseIdToken>`.

## Data model notes

- `User.firebaseUid` is the link back to the Firebase account; there is no
  password field anymore.
- `Food.category` stores the **category name** (e.g. `"Pizza"`), not an
  id — this matches how the frontend's menu filtering works. If you add
  foods manually, use the same category names returned by
  `GET /api/categories`.
- `Food.imageUrl` / `Category.img` are filenames (no extension) that must
  exist under `frontend/public/images/`.
- `Order.status` is one of `preparing | ready | out_for_delivery | delivered
  | cancel`, and every transition is appended to `Order.statusHistory` for a
  real timeline. Once an order is `delivered` or `cancel`, its status is
  locked.
- `Order.products[]` stores a **snapshot** (`name`, `price`, `imageUrl`) of
  each item at order time, not just a reference — so a receipt stays
  accurate even if a food's price changes later. `Order.subtotal`/`payed`
  are computed server-side from live `Food.currentPrice` values at the
  moment the order is placed; the client never supplies the total.

## Project structure

```
backend/
  server.js                    entrypoint
  src/
    config/db.js                MongoDB connection
    config/firebaseAdmin.js     Firebase Admin SDK init
    middleware/auth.js          Firebase token verification + admin guard
    middleware/errorHandler.js
    models/                     Mongoose schemas
    controllers/                route handlers
    routes/                     route -> controller wiring
    seed/seed.js                demo categories/foods
```
