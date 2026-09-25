# KidsFlix 🍿 | نيتفلكس للأطفال
> **100% Free, Safe, & Ad-Free Streaming Platform for Kids & Families**  
> Powered by the **Internet Archive** ([archive.org](https://archive.org)) Advanced Search and Metadata APIs.

---

## 🌟 Overview

**KidsFlix** is a high-performance, cinematic Netflix-grade streaming platform designed specifically for children and families. It streams verified Public Domain and Creative Commons classic animations, retro game adventures, space & science explorations, comedy, and cinema art directly from the **Internet Archive** without requiring any API keys.

---

## 🚀 Key Features

### 1. 🎬 Massive 140,000+ Library & Smart Pagination
- **Over 140,000 Free Titles**: Access the entire Internet Archive catalog across multiple kid-safe subjects.
- **Interactive Pagination**: Browse through 2,000+ to 140,000+ titles with page jumps, previous/next controls, and customizable page sizes (24, 48, 72 items per page).
- **Exact Category Counters**: Real-time counts reflecting the true size of every category on archive.org.

### 2. 🎨 6-Column Video Grid Table & Netflix Rows Switcher
- **Dedicated 6-Column Grid Table**: 6 uniform columns per row on desktop screens with hover glow, poster badges, and instant play overlays.
- **Netflix Carousel Rows**: Seamless horizontal scrolling rows for browsing by curated topics.
- **Sort Controls**: Instant sorting by Most Popular (Downloads), Highest Rated, or Release Year.

### 3. 🌓 Light / Dark Mode Toggle
- **Daylight Kids Mode (Light)**: Vibrant, clean, high-contrast daylight theme.
- **Cinema Mode (Dark)**: Sleek dark aesthetic with glowing neon accents.
- **Persistent Preferences**: Theme selection is saved to browser storage.

### 4. 🗂️ 11 Rich Kid-Friendly Categories
- 🎬 **Animation** (148,000+ classic cartoons & open movies)
- 🚀 **Space & Sci-Fi** (41,000+ planets, rockets, and astronomy adventures)
- 🐾 **Animals & Nature** (35,000+ wildlife and forest friends)
- 😂 **Comedy & Laughs** (138,000+ slapstick and family humor)
- 🧠 **Learn & Science** (550,000+ educational discoveries)
- 🎮 **Retro Games** (89,000+ classic 16-bit RPGs & Nintendo gameplay)
- 🎨 **Art & Stop Motion** (76,000+ puppetoons & vintage fantasy art)
- 📽️ **Real Film** (29,000+ live-action comedy legends like Buster Keaton and Laurel & Hardy)
- ⚓ **Popeye The Sailor** (1,300+ classic cartoons)
- 🦸 **Superheroes** (3,300+ Golden Age Superman and action shorts)
- 🏰 **Fairytales** (27,000+ Cinderella, Casper, and bedtime stories)
- ❤️ **My List** (Personal watchlist saved per kid profile)

### 5. 🍿 Dual-Engine Cinema Player Modal
- **Direct HTML5 Player**: Clean, ad-free streaming with native playback controls.
- **Archive.org Embed Player**: Instant fallback to official player for 100% compatibility.
- **MP4 Direct Download**: Kids can download public domain films for offline viewing.
- **"Up Next" Carousel**: Auto-suggests the next cartoon for binge-watching.

### 6. 🌐 Bilingual & Kids Profiles
- **Arabic & English Support**: Instant toggle with proper RTL layout support.
- **Kid Profiles**: Switch between cute avatars (🦁 Leo, 🚀 Astro, 🐼 Penny, 🦖 Dino).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, TypeScript)
- **Styling**: Vanilla CSS & Modern Design System (Glassmorphism, CSS variables, Google Fonts: *Outfit* & *Fredoka*)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Source**: [Internet Archive Advanced Search & Metadata APIs](https://archive.org)
- **Deployment**: [Vercel](https://vercel.com)

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm start
```

---

## ☁️ Vercel Deployment

Deploy directly using the Vercel CLI or Git integration:

```bash
# Login to Vercel
npx vercel login

# Deploy to production
npx vercel --prod
```

Or connect the GitHub repository `git@github.com:Eman2024956/kidsflix.git` to your Vercel Dashboard for automated CI/CD deployments.

---

## 📂 Project Architecture

```
kidsnetflix/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── movies/route.ts      # Archive.org search with pagination & category queries
│   │   │   └── movie/[id]/route.ts  # Metadata API for MP4 video resolution
│   │   ├── globals.css              # Light/Dark tokens, animations & responsive styles
│   │   ├── layout.tsx               # Root layout, fonts & viewport configuration
│   │   └── page.tsx                 # Main application with 6-col grid & pagination
│   ├── components/
│   │   ├── Navbar.tsx               # Header with search, categories, theme toggle, profiles
│   │   ├── HeroBanner.tsx           # Full-width spotlight trailer banner
│   │   ├── VideoGridTable.tsx       # 6-column grid table with pagination controls
│   │   ├── MovieCard.tsx            # Card with hover elevation, play icon, bookmark
│   │   ├── MovieRow.tsx             # Horizontal Netflix carousel row
│   │   └── MoviePlayerModal.tsx     # Cinema player modal (Direct HTML5 + Embed)
│   ├── data/
│   │   └── curatedCartoons.ts       # Verified classic cartoons dataset
│   └── types/
│       └── movie.ts                 # TypeScript interfaces
├── .vercelignore                    # Vercel deployment rules
├── next.config.ts                   # Archive.org remote image configuration
└── package.json
```

---

## 📜 License & Copyright

All media displayed on **KidsFlix** is hosted by the **Internet Archive** ([archive.org](https://archive.org)) and is in the **Public Domain** or licensed under **Creative Commons**.
