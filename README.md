# AnimeVerse 🎬

A modern, full-stack anime discovery and tracking web application built with **React**, **Vite**, and **Tailwind CSS**, featuring high-performance **GraphQL** data fetching and cloud-synced watchlists via **Supabase**.

---

## ✨ Key Features

- **Trending & Airing Anime:** Real-time discovery powered by GraphQL, featuring current season releases and all-time top-rated masterpieces.
- **Fast & Resilient GraphQL Data:** Native CORS support and generous rate limits with seamless MyAnimeList (`idMal`) ID mapping across all pages.
- **Detailed Anime Profiles:** Rich details in a single query—synopsis, main character gallery, official YouTube trailers, broadcast info, studio credits, and genres.
- **Title Search & Genre Filtering:** Instant search by title or genre category with full pagination controls.
- **Cloud-Synced Watchlist:** Save favorite titles with status tracking ("Plan to Watch", "Watching", etc.) backed by Supabase with Row-Level Security (RLS).
- **User Authentication:** Secure email authentication, session management, and protected routes via Supabase Auth.
- **Cinematic Dark UI:** Polished, responsive cinema-inspired interface styled with Tailwind CSS.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, React Router v7, React Icons
- **Data Source:** AniList GraphQL API (with MyAnimeList `idMal` mapping)
- **Backend & Database:** Supabase (PostgreSQL, Supabase Auth, Row-Level Security)
- **Carousels & Sliders:** React Slick
- **Deployment:** Vercel

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/animeverse.git
cd animeverse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or `http://localhost:5173`).

---

## 📦 Available Scripts

- `npm run dev` - Start the local Vite development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint code quality checks

---

## 🗄️ Database Schema (Supabase)

The watchlist feature uses a PostgreSQL table secured by Row-Level Security:

```sql
create table public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  anime_id integer not null,
  title text not null,
  image_url text,
  score numeric,
  episodes integer,
  type text,
  status text default 'plan_to_watch',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security
alter table public.watchlist enable row level security;

create policy "Users can view their own watchlist"
  on public.watchlist for select
  using (auth.uid() = user_id);

create policy "Users can insert into their own watchlist"
  on public.watchlist for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own watchlist"
  on public.watchlist for update
  using (auth.uid() = user_id);

create policy "Users can delete from their own watchlist"
  on public.watchlist for delete
  using (auth.uid() = user_id);
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
