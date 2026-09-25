"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroBanner } from "@/components/HeroBanner";
import { MovieRow } from "@/components/MovieRow";
import { VideoGridTable } from "@/components/VideoGridTable";
import { MoviePlayerModal } from "@/components/MoviePlayerModal";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { PwaRegistrar } from "@/components/PwaRegistrar";
import { CURATED_CARTOONS } from "@/data/curatedCartoons";
import { Movie, KidProfile } from "@/types/movie";
import { Film, Search, Grid, Rows3 } from "lucide-react";

const PROFILES: KidProfile[] = [
  { id: "leo", name: "Leo", avatar: "🦁", color: "#ffb703" },
  { id: "astro", name: "Astro", avatar: "🚀", color: "#05d9e8" },
  { id: "penny", name: "Penny", avatar: "🐼", color: "#ff2a6d" },
  { id: "dino", name: "Dino", avatar: "🦖", color: "#10b981" },
];

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>(CURATED_CARTOONS);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [featuredMovie, setFeaturedMovie] = useState<Movie>(CURATED_CARTOONS[0]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [currentProfile, setCurrentProfile] = useState<KidProfile>(PROFILES[0]);
  const [isArabic, setIsArabic] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "rows">("grid"); // 6-column grid table as default!
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Load theme preference
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("kidsflix_theme") as "dark" | "light";
      if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
        setTimeout(() => setTheme(savedTheme), 0);
      }
    } catch (e) {
      console.warn("Theme storage error", e);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("kidsflix_theme", nextTheme);
      document.documentElement.setAttribute("data-theme", nextTheme);
    } catch (e) {
      console.warn("Theme set error", e);
    }
  };

  // Pagination states for 2000+ films
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(50);
  const [rowsPerPage, setRowsPerPage] = useState<number>(48);
  const [totalFound, setTotalFound] = useState<number>(128190);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load watchlist from localStorage
  useEffect(() => {
    try {
      const savedList = localStorage.getItem(`kidsflix_watchlist_${currentProfile.id}`);
      if (savedList) {
        const parsed = JSON.parse(savedList);
        setTimeout(() => setWatchlist(parsed), 0);
      }
    } catch (e) {
      console.warn("Storage load error", e);
    }
  }, [currentProfile.id]);

  const saveWatchlist = (newList: Movie[]) => {
    setWatchlist(newList);
    try {
      localStorage.setItem(`kidsflix_watchlist_${currentProfile.id}`, JSON.stringify(newList));
    } catch (e) {
      console.warn("Storage save error", e);
    }
  };

  const toggleWatchlist = (movie: Movie) => {
    const exists = watchlist.some((m) => m.identifier === movie.identifier);
    if (exists) {
      saveWatchlist(watchlist.filter((m) => m.identifier !== movie.identifier));
    } else {
      saveWatchlist([...watchlist, movie]);
    }
  };

  // Reset to page 1 on category or search change
  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    setSearchQuery("");
    setCurrentPage(1);
    setIsLoading(true);
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
    setIsLoading(true);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setIsLoading(true);
    if (typeof window !== "undefined") {
      const elem = document.getElementById("grid-table-top");
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleRowsPerPageChange = (newRows: number) => {
    setRowsPerPage(newRows);
    setCurrentPage(1);
    setIsLoading(true);
  };

  // Fetch movies from /api/movies based on active category, search, and page
  useEffect(() => {
    if (activeCategory === "watchlist") return;

    let isSubscribed = true;

    const params = new URLSearchParams();
    if (activeCategory !== "all") {
      params.set("category", activeCategory);
    }
    if (searchQuery) {
      params.set("q", searchQuery);
    }
    params.set("page", String(currentPage));
    params.set("rows", String(rowsPerPage));

    fetch(`/api/movies?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (isSubscribed && data.success && Array.isArray(data.movies)) {
          setMovies(data.movies);
          if (data.numFound) setTotalFound(data.numFound);
          if (data.totalPages) setTotalPages(data.totalPages);

          if (currentPage === 1 && data.movies.length > 0 && !searchQuery && activeCategory === "all") {
            setFeaturedMovie(data.movies[0]);
          }
        }
      })
      .catch((err) => console.warn("Failed fetching from /api/movies:", err))
      .finally(() => {
        if (isSubscribed) setIsLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [activeCategory, searchQuery, currentPage, rowsPerPage]);

  // Dynamic Category Counters representing archive.org numbers
  const categoryCounts = useMemo(() => {
    return {
      all: totalFound > 2000 ? totalFound : 2400,
      animation: 148917,
      scifi: 41444,
      animals: 35829,
      comedy: 138465,
      science: 555795,
      game: 89242,
      art: 76061,
      realfilm: 29220,
      popeye: 1331,
      superheroes: 3330,
      fairytales: 27965,
    };
  }, [totalFound]);

  // Displayed movies for current category
  const displayedCategoryMovies = useMemo(() => {
    if (activeCategory === "watchlist") return watchlist;
    return movies;
  }, [movies, activeCategory, watchlist]);

  // Category Title
  const getCategoryTitle = () => {
    switch (activeCategory) {
      case "scifi":
        return isArabic ? "🚀 الفضاء ومغامرات الخيال العلمي" : "🚀 Space & Sci-Fi Adventures";
      case "animals":
        return isArabic ? "🐾 عالم الحيوانات والطبيعة الساحرة" : "🐾 Animals & Nature Discoveries";
      case "comedy":
        return isArabic ? "😂 الضحك والمقالب والكوميديا العائلية" : "😂 Comedy, Laughs & Slapstick";
      case "science":
        return isArabic ? "🧠 العلوم والمعرفة والاستكشاف للأطفال" : "🧠 Learning, Science & Discovery";
      case "game":
        return isArabic ? "🎮 عالم الألعاب والفيديو جيم" : "🎮 Retro Gaming & Adventures";
      case "art":
        return isArabic ? "🎨 الفنون والرسوم المتحركة التجريبية" : "🎨 Art & Stop-Motion Cinema";
      case "realfilm":
        return isArabic ? "📽️ الأفلام السينمائية الحقيقية والكوميديا" : "📽️ Real Film & Live Action Classics";
      case "popeye":
        return isArabic ? "⚓ مغامرات باباي رجل البحار" : "⚓ Popeye The Sailor Classics";
      case "superheroes":
        return isArabic ? "🦸 أبطال العصر الذهبي" : "🦸 Classic Superheroes";
      case "fairytales":
        return isArabic ? "🏰 حكايات وخيال للأطفال" : "🏰 Vintage Fairytales & Legends";
      case "animation":
        return isArabic ? "🎬 رسوم متحركة وأفلام كرتون" : "🎬 Animation & Open Cartoons";
      case "watchlist":
        return isArabic ? `❤️ قائمة ${currentProfile.name} المفضلة` : `❤️ ${currentProfile.name}'s Watchlist`;
      default:
        return isArabic ? "🍿 جميع الفيديوهات والأفلام" : "🍿 All Available Media";
    }
  };

  const currentCategoryCount = useMemo(() => {
    if (activeCategory === "watchlist") return watchlist.length;
    if (searchQuery) return movies.length;
    return (categoryCounts as Record<string, number>)[activeCategory] || totalFound;
  }, [activeCategory, categoryCounts, totalFound, watchlist.length, searchQuery, movies.length]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-main)",
        direction: isArabic ? "rtl" : "ltr",
      }}
    >
      {/* Navigation Bar with Category Counters, Total Counter & Theme Toggle */}
      <Navbar
        onSearch={handleSearch}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        categoryCounts={categoryCounts}
        totalVideosCount={totalFound}
        watchlistCount={watchlist.length}
        currentProfile={currentProfile}
        profiles={PROFILES}
        onSelectProfile={(p) => setCurrentProfile(p)}
        isArabic={isArabic}
        onToggleLanguage={() => setIsArabic(!isArabic)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main>
        {/* Search Results Mode */}
        {searchQuery ? (
          <div style={{ maxWidth: "1480px", margin: "0 auto", padding: "40px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
              <Search size={22} color="var(--accent-cyan)" />
              <h1 className="font-display" style={{ fontSize: "1.8rem", fontWeight: 800 }}>
                {isArabic ? `نتائج البحث عن "${searchQuery}"` : `Search Results for "${searchQuery}"`}
              </h1>
              <span className="badge badge-kids">{movies.length} {isArabic ? "فيديو" : "videos"}</span>
            </div>

            {movies.length === 0 && !isLoading ? (
              <div className="glass-panel" style={{ padding: "60px 20px", textAlign: "center", borderRadius: "20px" }}>
                <Film size={48} color="var(--accent-pink)" style={{ marginBottom: "16px" }} />
                <h3 className="font-display" style={{ fontSize: "1.3rem", marginBottom: "8px" }}>
                  {isArabic ? "لم يتم العثور على نتائج" : "No videos found"}
                </h3>
                <p style={{ color: "var(--text-muted)" }}>
                  {isArabic
                    ? "جرّب البحث عن كلمات أخرى مثل Popeye أو Zelda أو Keaton"
                    : "Try searching for Popeye, Zelda, Chaplin, or Bunny."}
                </p>
              </div>
            ) : (
              <VideoGridTable
                movies={movies}
                title={isArabic ? "نتائج البحث" : "Search Results"}
                totalCount={totalFound}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                isLoading={isLoading}
                onPlay={(m) => setActiveMovie(m)}
                watchlist={watchlist}
                onToggleWatchlist={toggleWatchlist}
                isArabic={isArabic}
              />
            )}
          </div>
        ) : (
          /* Normal View (Hero Banner + 6-Column Grid Table & Carousel Switcher) */
          <>
            {/* Hero Spotlight */}
            {featuredMovie && activeCategory === "all" && currentPage === 1 && (
              <HeroBanner
                movie={featuredMovie}
                onPlay={(m) => setActiveMovie(m)}
                onMoreInfo={(m) => setActiveMovie(m)}
                isInWatchlist={watchlist.some((w) => w.identifier === featuredMovie.identifier)}
                onToggleWatchlist={toggleWatchlist}
                isArabic={isArabic}
              />
            )}

            {/* View Mode Switcher Header */}
            <div
              style={{
                maxWidth: "1480px",
                margin: "0 auto",
                padding: "24px 24px 0 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              {/* Category Title & Video Count Summary */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "1.8rem" }}>🍿</span>
                <div>
                  <h2 className="font-display" style={{ fontSize: "1.6rem", fontWeight: 800 }}>
                    {getCategoryTitle()}
                  </h2>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-dim)" }}>
                    {isArabic
                      ? `يعرض ${displayedCategoryMovies.length} فيديو في هذه الصفحة من إجمالي أكثر من ${currentCategoryCount.toLocaleString()} فيلم متاح مجاناً`
                      : `Displaying ${displayedCategoryMovies.length} items on this page from over ${currentCategoryCount.toLocaleString()} free films`}
                  </div>
                </div>
              </div>

              {/* View Switcher: 6-Column Grid Table vs Netflix Carousel Rows */}
              <div
                style={{
                  display: "flex",
                  background: "rgba(255, 255, 255, 0.08)",
                  padding: "4px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                }}
              >
                <button
                  onClick={() => setViewMode("grid")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: viewMode === "grid" ? "var(--gradient-kids)" : "transparent",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "6px 14px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Grid size={15} />
                  <span>{isArabic ? "جدول 6 أعمدة (مع ترقيم الصفحات)" : "6-Col Grid Table (Pagination)"}</span>
                </button>

                <button
                  onClick={() => setViewMode("rows")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: viewMode === "rows" ? "var(--gradient-kids)" : "transparent",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "6px 14px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Rows3 size={15} />
                  <span>{isArabic ? "صفوف نتفلكس" : "Netflix Rows"}</span>
                </button>
              </div>
            </div>

            {/* Content Display: 6-Column Grid Table with Pagination OR Horizontal Rows */}
            {viewMode === "grid" || activeCategory !== "all" ? (
              <VideoGridTable
                movies={displayedCategoryMovies}
                title={getCategoryTitle()}
                totalCount={currentCategoryCount}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                isLoading={isLoading}
                onPlay={(m) => setActiveMovie(m)}
                watchlist={watchlist}
                onToggleWatchlist={toggleWatchlist}
                isArabic={isArabic}
              />
            ) : (
              /* Netflix Horizontal Carousel Rows */
              <div style={{ position: "relative", zIndex: 20, marginTop: "16px" }}>
                <MovieRow
                  title={isArabic ? "🎬 الرسوم المتحركة الأكثر مشاهدة" : "🎬 Top Animation & Cartoons"}
                  movies={movies.filter((m) => m.category === "animation" || m.category === "Featured")}
                  onPlay={(m) => setActiveMovie(m)}
                  watchlist={watchlist}
                  onToggleWatchlist={toggleWatchlist}
                  isArabic={isArabic}
                />

                <MovieRow
                  title={isArabic ? "🎮 الألعاب ومغامرات الفيديو جيم" : "🎮 Retro Gaming & Epic Quests"}
                  movies={movies.filter((m) => m.category === "game")}
                  onPlay={(m) => setActiveMovie(m)}
                  watchlist={watchlist}
                  onToggleWatchlist={toggleWatchlist}
                  isArabic={isArabic}
                />

                <MovieRow
                  title={isArabic ? "🎨 فنون ورسوم إبداعية (Stop Motion)" : "🎨 Art & Stop-Motion Cinema"}
                  movies={movies.filter((m) => m.category === "art")}
                  onPlay={(m) => setActiveMovie(m)}
                  watchlist={watchlist}
                  onToggleWatchlist={toggleWatchlist}
                  isArabic={isArabic}
                />

                <MovieRow
                  title={isArabic ? "📽️ أفلام سينمائية حقيقية وكوميديا" : "📽️ Real Film & Live Action"}
                  movies={movies.filter((m) => m.category === "realfilm")}
                  onPlay={(m) => setActiveMovie(m)}
                  watchlist={watchlist}
                  onToggleWatchlist={toggleWatchlist}
                  isArabic={isArabic}
                />

                <MovieRow
                  title={isArabic ? "⚓ كلاسيكيات باباي رجل البحار" : "⚓ Popeye The Sailor Classics"}
                  movies={movies.filter((m) => m.category === "popeye")}
                  onPlay={(m) => setActiveMovie(m)}
                  watchlist={watchlist}
                  onToggleWatchlist={toggleWatchlist}
                  isArabic={isArabic}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Video Streaming Modal */}
      {activeMovie && (
        <MoviePlayerModal
          movie={activeMovie}
          onClose={() => setActiveMovie(null)}
          isInWatchlist={watchlist.some((w) => w.identifier === activeMovie.identifier)}
          onToggleWatchlist={toggleWatchlist}
          onPlayNext={(m) => setActiveMovie(m)}
          relatedMovies={movies}
          isArabic={isArabic}
        />
      )}

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "40px 24px",
          marginTop: "60px",
          backgroundColor: "#05070a",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div
            className="font-display"
            style={{
              fontSize: "1.4rem",
              fontWeight: 800,
              background: "var(--gradient-kids)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "10px",
            }}
          >
            KidsFlix • نيتفلكس للأطفال
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "16px" }}>
            {isArabic
              ? "مكتبة وسائط مجانية متكاملة للأطفال تضم أكثر من 140,000 فيلم ورسوم متحركة وألعاب وفنون من أرشيف الإنترنت مع تصفح وترقيم كامل للصفحات."
              : "Access over 140,000+ public domain animations, retro games, art cinema, and live action films with full pagination support."}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              fontSize: "0.8rem",
              color: "var(--text-dim)",
              flexWrap: "wrap",
            }}
          >
            <span>🎬 148,000+ Cartoons</span>
            <span>•</span>
            <span>🎮 89,000+ Games</span>
            <span>•</span>
            <span>🎨 76,000+ Art Cinema</span>
            <span>•</span>
            <span>📽️ 29,000+ Real Films</span>
          </div>
        </div>
      </footer>

      {/* PWA Service Worker & Install Banner */}
      <PwaRegistrar isArabic={isArabic} />

      {/* Mobile Bottom Navigation Bar (Visible on phone/tablet) */}
      <MobileBottomNav
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        watchlistCount={watchlist.length}
        isArabic={isArabic}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSearch={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement | null;
          if (searchInput) {
            searchInput.focus();
          }
        }}
      />
    </div>
  );
}
