# HexiNova — Frontend

A React frontend built strictly against the API contract you provided. Nothing beyond that
contract is implemented — no likes, comments, follow, chat, notifications, stories, dashboard
stats, profile editing, or search.

## Stack

- React 19 + Vite
- React Router DOM v7 (declarative `<Routes>`/`<Route>` API)
- Axios, `withCredentials: true`, cookie-only auth (no JWT in localStorage)
- Context API (no Redux)
- Tailwind CSS, dark theme

## Getting started

```bash
npm install
cp .env.example .env   # VITE_API_BASE_URL defaults to http://localhost:3000/api
npm run dev
```

## What's implemented, and exactly against which endpoint

| Feature | Endpoint | Page / component |
|---|---|---|
| Register | `POST /auth/register` | `pages/Register.jsx` |
| Login (sets httpOnly cookie) | `POST /auth/login` | `pages/Login.jsx` — redirects to `/feed` on success |
| Logout | `POST /auth/logout` | `components/Navbar` |
| Session check | `GET /auth/me` | `context/AuthContext.jsx` (drives `ProtectedRoute`/`AdminRoute`) |
| List posts | `GET /posts` | `pages/Feed.jsx` at `/feed` |
| Create post (`caption`, `image`) | `POST /posts` (multipart) | `components/CreatePostModal` |
| Delete post | `DELETE /posts/:id` | `components/PostCard` (own posts only) |
| Block user | `PATCH /admin/user/block/:id` | `pages/AdminUsers.jsx` |
| Unblock user | `PATCH /admin/user/unblock/:id` | `pages/AdminUsers.jsx` |
| List blocked words | `GET /admin/blocked-words` | `pages/AdminBlockedWords.jsx` |
| Add blocked word | `POST /admin/blocked-words` | `pages/AdminBlockedWords.jsx` |
| Remove blocked word | `DELETE /admin/blocked-words/:id` | `pages/AdminBlockedWords.jsx` |

## Routing

| Path | Access | Page |
|---|---|---|
| `/` | Public | Home — animated intro/landing page, no login required |
| `/login`, `/register` | Public | Auth |
| `/feed` | Authenticated | The posts feed (create/view/delete own posts) |
| `/admin/users` | Admin only | Block/unblock by user ID |
| `/admin/blocked-words` | Admin only | Blocked-word CRUD |
| `*` | Public | 404 |

Clicking the HexiNova logo/name always goes to `/` (the public intro page). After a successful
login, users are redirected to `/feed`; the navbar also has a persistent "Feed" link once
authenticated.

### About the Home page

`pages/Home.jsx` makes **zero API calls** — it's pure decorative/marketing content (animated
headline, feature cards, a fake preview card with a looping typing effect). It's built with a
single imperative `useEffect` that wires up the 3D scene tilt, cursor-reactive letter
distortion, magnetic buttons, and scroll-triggered reveals, with a full cleanup function so it
behaves correctly under React StrictMode's dev-only double-invoke. All cursor/tilt/particle
effects are gated behind a `pointer: coarse` check and degrade to a simple, clean layout on
touch devices. Its styles live in `pages/Home.css`, scoped entirely under a `.home-page`
ancestor class so nothing leaks onto other routes.

The navbar (`components/Navbar/Navbar.jsx`) has its own small set of micro-interactions —
entrance slide-in, a coin-flip on the logo, a scroll-triggered background/shadow change, and a
centered-underline hover on nav links — layered on top of its real auth-aware logic (Log
in/Sign up vs. Feed/Admin/Logout).

## Known gap (flagged with a `TODO` in code)

Your contract doesn't include a "list users" endpoint (e.g. `GET /admin/users`). Because of
that, `pages/AdminUsers.jsx` can only block/unblock a user by manually entering their `_id` —
there's no searchable table. See the `TODO` comment at the top of that file and in
`api/admin.api.js`. Wire it up to a real listing endpoint once one exists.

## Explicitly NOT implemented

Per your spec, none of the following exist anywhere in this codebase, since no endpoint was
provided for them: likes, comments, follow/unfollow, chat, notifications, stories, admin
dashboard statistics, profile editing, and search.

## Field names (matched exactly, no assumptions)

- Post image: `image` (not `imageUrl`)
- Post image file reference: `imageFileId` (received from the API, not currently rendered —
  it's an ImageKit reference, not a display field)
- Author avatar: `profilePicture` (not `avatarUrl`)
- Author display name: `fullName`, falling back to `username` when empty
  (`utils/helpers.js` → `getAuthorDisplayName`)

## Design system

Dark theme using your exact palette:

- Background `#0F172A`, cards `#1E293B`, border `#334155`
- Primary `#3B82F6`, accent `#06B6D4`, success `#22C55E`, danger `#EF4444`
- Rounded corners, smooth transitions, mobile-first responsive layout
- Post images use a responsive aspect ratio (no fixed giant heights) so cards resize cleanly
  across desktop, tablet, and mobile

## Project structure

```
src/
  api/            axiosInstance.js + auth.api.js, post.api.js, admin.api.js
  components/     one folder per reusable component
  context/        AuthContext (backed by GET /auth/me), ToastContext (client-side UI feedback)
  hooks/          useAuth, useToast
  layouts/        MainLayout, AdminLayout
  pages/          Login, Register, Feed, AdminUsers, AdminBlockedWords, NotFound
  routes/         ProtectedRoute, AdminRoute
  utils/          constants.js, helpers.js
```
