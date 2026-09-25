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

---

## 🔌 API curl Command Reference

KidsFlix exposes two internal Next.js API routes that proxy the Internet Archive. Below is a full reference of every supported parameter with ready-to-paste `curl` examples.

---

### 1. `GET /api/movies` — Search & Browse Films

**Base URL (local):** `http://localhost:3000/api/movies`  
**Base URL (production):** `https://kidsnetflix.vercel.app/api/movies`

#### Query Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `category` | string | — | Filter by category slug (see list below) |
| `q` | string | — | Free-text keyword search |
| `page` | number | `1` | Page number (1-indexed) |
| `rows` | number | `48` | Results per page (`24`, `48`, `72`) |

#### Supported `category` values

| Slug | Description |
|---|---|
| `animation` | Classic cartoons & animated films |
| `scifi` | Space, rockets & science fiction |
| `animals` | Wildlife, nature & animal stories |
| `comedy` | Slapstick & family humor |
| `science` | Educational & discovery films |
| `game` | Retro gameplay & speedruns |
| `art` | Stop-motion, puppetoons & art cinema |
| `realfilm` | Live-action classic cinema (Keaton, Chaplin) |
| `popeye` | Popeye The Sailor cartoons |
| `superheroes` | Golden Age Superman & action shorts |
| `fairytales` | Fairytales, Cinderella, Casper |
| `classic` | Classic cartoon collections |

---

#### curl Examples

```bash
# ── 1. Fetch default Animation page (first 48 results) ──
curl "http://localhost:3000/api/movies"

# ── 2. Fetch page 3 of animations, 24 per page ──
curl "http://localhost:3000/api/movies?page=3&rows=24"

# ── 3. Browse by category: Sci-Fi & Space ──
curl "http://localhost:3000/api/movies?category=scifi"

# ── 4. Browse retro game videos, page 2 ──
curl "http://localhost:3000/api/movies?category=game&page=2&rows=48"

# ── 5. Popeye cartoons, page 1 ──
curl "http://localhost:3000/api/movies?category=popeye"

# ── 6. Fairytales, 72 results per page ──
curl "http://localhost:3000/api/movies?category=fairytales&rows=72"

# ── 7. Animals & Nature, page 4 ──
curl "http://localhost:3000/api/movies?category=animals&page=4"

# ── 8. Free-text search: "Popeye" across all categories ──
curl "http://localhost:3000/api/movies?q=popeye"

# ── 9. Free-text search: "Superman" ──
curl "http://localhost:3000/api/movies?q=superman"

# ── 10. Free-text search: "Keaton" – page 2 ──
curl "http://localhost:3000/api/movies?q=keaton&page=2"

# ── 11. Art & Stop-Motion, page 1, 24 per page ──
curl "http://localhost:3000/api/movies?category=art&rows=24"

# ── 12. Comedy & Laughs, sorted (most popular is default) ──
curl "http://localhost:3000/api/movies?category=comedy&rows=48"

# ── 13. Real Film classics, page 5 ──
curl "http://localhost:3000/api/movies?category=realfilm&page=5&rows=24"

# ── 14. Science & Educational, page 1 ──
curl "http://localhost:3000/api/movies?category=science"

# ── 15. Pretty-print JSON response with jq ──
curl -s "http://localhost:3000/api/movies?category=animation&rows=6" | jq '.'

# ── 16. Extract only titles from response ──
curl -s "http://localhost:3000/api/movies?category=popeye&rows=10" | jq '[.movies[].title]'

# ── 17. Count total found in a category ──
curl -s "http://localhost:3000/api/movies?category=scifi" | jq '.numFound'

# ── 18. Production: Sci-Fi page 1 (Vercel) ──
curl "https://kidsnetflix.vercel.app/api/movies?category=scifi"

# ── 19. Production: search "Bunny" on Vercel ──
curl "https://kidsnetflix.vercel.app/api/movies?q=bunny"

# ── 20. Save full animation page to file ──
curl -s "http://localhost:3000/api/movies?category=animation&rows=48" -o animation_page1.json
```

---

#### Sample Response Shape

```json
{
  "success": true,
  "count": 48,
  "page": 1,
  "rows": 48,
  "numFound": 148000,
  "totalPages": 100,
  "source": "archive.org",
  "movies": [
    {
      "identifier": "popeye_the_sailor_1933",
      "title": "Popeye the Sailor",
      "description": "Classic 1933 animation...",
      "year": "1933",
      "downloads": 542819,
      "rating": 4.5,
      "runtime": "7m",
      "posterUrl": "https://archive.org/services/img/popeye_the_sailor_1933",
      "embedUrl": "https://archive.org/embed/popeye_the_sailor_1933",
      "category": "animation",
      "tags": ["Public Domain", "Kids"]
    }
  ]
}
```

---

### 2. `GET /api/movie/[id]` — Single Film Metadata

Fetches full metadata, MP4 video file list, and direct streaming URL for a specific Archive.org item.

**Local:** `http://localhost:3000/api/movie/{identifier}`  
**Production:** `https://kidsnetflix.vercel.app/api/movie/{identifier}`

#### Path Parameters

| Parameter | Description |
|---|---|
| `id` | Archive.org item identifier (e.g. `popeye_the_sailor_1933`) |

---

#### curl Examples

```bash
# ── 1. Get metadata for Popeye (1933) ──
curl "http://localhost:3000/api/movie/popeye_the_sailor_1933"

# ── 2. Get metadata for Big Buck Bunny ──
curl "http://localhost:3000/api/movie/BigBuckBunny_328"

# ── 3. Get metadata for Sintel (Blender film) ──
curl "http://localhost:3000/api/movie/Sintel"

# ── 4. Get metadata for Superman (1941) ──
curl "http://localhost:3000/api/movie/Superman1941"

# ── 5. Get metadata for Steamboat Willie ──
curl "http://localhost:3000/api/movie/steamboat_willie"

# ── 6. Get metadata for Gulliver's Travels ──
curl "http://localhost:3000/api/movie/GulliversTravels1939"

# ── 7. Pretty-print with jq ──
curl -s "http://localhost:3000/api/movie/BigBuckBunny_328" | jq '.'

# ── 8. Get only the direct MP4 video URL ──
curl -s "http://localhost:3000/api/movie/Sintel" | jq '.movie.videoUrl'

# ── 9. Get the embed URL ──
curl -s "http://localhost:3000/api/movie/popeye_the_sailor_1933" | jq '.movie.embedUrl'

# ── 10. List all available MP4 files ──
curl -s "http://localhost:3000/api/movie/BigBuckBunny_328" | jq '[.movie.files[].name]'

# ── 11. Check if content is blocked (Kid-Safe Shield) ──
curl -s "http://localhost:3000/api/movie/some_identifier" | jq '.movie.blocked'

# ── 12. Get title + year only ──
curl -s "http://localhost:3000/api/movie/Superman1941" | jq '{title: .movie.title, year: .movie.year}'

# ── 13. Production: Big Buck Bunny metadata ──
curl "https://kidsnetflix.vercel.app/api/movie/BigBuckBunny_328"

# ── 14. Test Kid-Safe block reason ──
curl -s "http://localhost:3000/api/movie/some_identifier" | jq '.movie.blockReason'

# ── 15. Save metadata to file ──
curl -s "http://localhost:3000/api/movie/Sintel" -o sintel_metadata.json
```

---

#### Sample Response (Unblocked)

```json
{
  "success": true,
  "movie": {
    "identifier": "BigBuckBunny_328",
    "title": "Big Buck Bunny",
    "description": "Big Buck Bunny tells the story of a giant rabbit...",
    "year": "2008",
    "licenseurl": "https://creativecommons.org/licenses/by/3.0/",
    "embedUrl": "https://archive.org/embed/BigBuckBunny_328",
    "posterUrl": "https://archive.org/services/img/BigBuckBunny_328",
    "videoUrl": "https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4",
    "files": [
      { "name": "BigBuckBunny_512kb.mp4", "format": "MPEG4", "size": "62000000" }
    ]
  }
}
```

#### Sample Response (Kid-Safe Blocked)

```json
{
  "success": true,
  "movie": {
    "identifier": "some_flagged_item",
    "title": "Blocked Content",
    "blocked": true,
    "blockReason": "This item contains content some may find inappropriate or offensive.",
    "embedUrl": "",
    "files": []
  }
}
```

---

### 3. Direct Internet Archive API (No Key Required)

KidsFlix proxies these — but you can also query Archive.org directly:

```bash
# ── Advanced Search: Animation, page 1, 10 results ──
curl "https://archive.org/advancedsearch.php?q=mediatype:movies+AND+subject:animation+-subject:deemphasize&fl[]=identifier&fl[]=title&fl[]=description&rows=10&page=1&output=json" | jq '.response.docs[].title'

# ── Search for Popeye cartoons ──
curl "https://archive.org/advancedsearch.php?q=title:popeye+mediatype:movies&fl[]=identifier&fl[]=title&rows=5&output=json" | jq '.response.docs'

# ── Get metadata for a specific item ──
curl "https://archive.org/metadata/BigBuckBunny_328" | jq '.metadata.title'

# ── List all files for an item ──
curl "https://archive.org/metadata/Sintel" | jq '[.files[] | select(.name | endswith(".mp4")) | .name]'

# ── Get total count for animation category ──
curl "https://archive.org/advancedsearch.php?q=mediatype:movies+AND+subject:animation&rows=0&output=json" | jq '.response.numFound'

# ── Search Science & Educational films ──
curl "https://archive.org/advancedsearch.php?q=mediatype:movies+AND+(subject:educational+OR+subject:science)+-subject:deemphasize&fl[]=identifier&fl[]=title&rows=5&output=json" | jq '.response.docs[].title'
```

---

