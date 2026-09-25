"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Heart, Trash2, Play, ArrowLeft, Popcorn, ChevronRight, Moon, Sun } from "lucide-react";
import { Movie, KidProfile } from "@/types/movie";
import { MoviePlayerModal } from "@/components/MoviePlayerModal";

const PROFILES: KidProfile[] = [
  { id: "leo", name: "Leo", avatar: "🦁", color: "#ffb703" },
  { id: "astro", name: "Astro", avatar: "🚀", color: "#05d9e8" },
  { id: "penny", name: "Penny", avatar: "🐼", color: "#ff2a6d" },
  { id: "dino", name: "Dino", avatar: "🦖", color: "#10b981" },
];

export default function FavoritesPage() {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [currentProfile, setCurrentProfile] = useState<KidProfile>(PROFILES[0]);
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [isArabic, setIsArabic] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("kidsflix_theme") as "dark" | "light" | null;
    if (savedTheme) setTheme(savedTheme);
    const savedLang = localStorage.getItem("kidsflix_lang");
    if (savedLang === "ar") setIsArabic(true);
    const savedProfileId = localStorage.getItem("kidsflix_profile");
    if (savedProfileId) {
      const profile = PROFILES.find((p) => p.id === savedProfileId);
      if (profile) setCurrentProfile(profile);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const saved = localStorage.getItem(`kidsflix_watchlist_${currentProfile.id}`);
      setWatchlist(saved ? JSON.parse(saved) : []);
    } catch {
      setWatchlist([]);
    }
  }, [currentProfile, mounted]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("kidsflix_theme", theme);
  }, [theme]);

  const saveWatchlist = useCallback(
    (newList: Movie[]) => {
      setWatchlist(newList);
      localStorage.setItem(`kidsflix_watchlist_${currentProfile.id}`, JSON.stringify(newList));
    },
    [currentProfile.id]
  );

  const removeFromWatchlist = (movie: Movie) =>
    saveWatchlist(watchlist.filter((m) => m.identifier !== movie.identifier));

  const clearAll = () => { saveWatchlist([]); setConfirmClearAll(false); };

  const toggleWatchlist = (movie: Movie) => {
    const exists = watchlist.some((m) => m.identifier === movie.identifier);
    saveWatchlist(exists ? watchlist.filter((m) => m.identifier !== movie.identifier) : [...watchlist, movie]);
  };

  if (!mounted) return null;

  const hdBg = theme === "dark"
    ? "linear-gradient(135deg,#07090e 0%,#0d1117 50%,#111827 100%)"
    : "linear-gradient(135deg,#f0f4ff 0%,#e8edf8 100%)";

  return (
    <div style={{ minHeight: "100vh", background: hdBg, color: theme === "dark" ? "#fff" : "#1a1a2e", fontFamily: "'Outfit','Fredoka',sans-serif", transition: "background 0.3s" }}>

      {/* ── Sticky Header ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", background: theme === "dark" ? "rgba(7,9,14,0.88)" : "rgba(240,244,255,0.88)", borderBottom: theme === "dark" ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.08)" }}>
        <div style={{ maxWidth: "1480px", margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>

          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <button onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: "6px", background: theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", border: theme === "dark" ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.1)", borderRadius: "12px", padding: "8px 14px", color: theme === "dark" ? "#fff" : "#1a1a2e", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}>
              <ArrowLeft size={16} />{isArabic ? "الرئيسية" : "Home"}
            </button>
            <div onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg,#ff2a6d,#ff8e53)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(255,42,109,0.4)" }}>
                <Popcorn size={22} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: "1.3rem", fontWeight: 900, background: "linear-gradient(90deg,#ff2a6d,#ff8e53,#05d9e8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.1 }}>KidsFlix</div>
                <div style={{ fontSize: "0.65rem", color: "#f59e0b", fontWeight: 700 }}>{isArabic ? "قائمتي المفضلة" : "My Favorites"}</div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {PROFILES.map((p) => (
              <button key={p.id} onClick={() => { setCurrentProfile(p); localStorage.setItem("kidsflix_profile", p.id); }} title={p.name}
                style={{ width: "36px", height: "36px", borderRadius: "50%", border: currentProfile.id === p.id ? `2px solid ${p.color}` : "2px solid transparent", background: currentProfile.id === p.id ? `${p.color}22` : "rgba(255,255,255,0.06)", fontSize: "1.1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", boxShadow: currentProfile.id === p.id ? `0 0 10px ${p.color}55` : "none" }}>
                {p.avatar}
              </button>
            ))}
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ width: "38px", height: "38px", borderRadius: "50%", background: theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", border: theme === "dark" ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.1)", color: theme === "dark" ? "#05d9e8" : "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{ maxWidth: "1480px", margin: "0 auto", padding: "32px 24px 100px" }}>

        {/* Page title */}
        <div style={{ marginBottom: "32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "18px", background: "rgba(255,42,109,0.12)", border: "1px solid rgba(255,42,109,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Heart size={28} fill="rgba(255,42,109,0.7)" color="#ff2a6d" />
            </div>
            <div>
              <h1 style={{ fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 900, margin: "0 0 4px", lineHeight: 1.1 }}>
                {isArabic ? `${currentProfile.avatar} ${currentProfile.name} — المفضلة` : `${currentProfile.avatar} ${currentProfile.name}'s Favorites`}
              </h1>
              <p style={{ margin: 0, fontSize: "0.88rem", color: theme === "dark" ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>
                {isArabic ? `${watchlist.length} فيلم محفوظ` : `${watchlist.length} saved ${watchlist.length === 1 ? "film" : "films"}`}
              </p>
            </div>
          </div>

          {watchlist.length > 0 && (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(5,217,232,0.12)", border: "1px solid rgba(5,217,232,0.3)", borderRadius: "12px", padding: "9px 16px", color: "#05d9e8", fontSize: "0.83rem", fontWeight: 700, cursor: "pointer" }}>
                {isArabic ? "تصفح المزيد" : "Browse More"}<ChevronRight size={14} />
              </button>
              {confirmClearAll ? (
                <>
                  <button onClick={clearAll} style={{ background: "rgba(255,42,109,0.18)", border: "1px solid rgba(255,42,109,0.45)", borderRadius: "12px", padding: "9px 14px", color: "#ff2a6d", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>
                    {isArabic ? "تأكيد الحذف" : "Confirm"}
                  </button>
                  <button onClick={() => setConfirmClearAll(false)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "9px 14px", color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", cursor: "pointer" }}>
                    {isArabic ? "إلغاء" : "Cancel"}
                  </button>
                </>
              ) : (
                <button onClick={() => setConfirmClearAll(true)} style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,42,109,0.08)", border: "1px solid rgba(255,42,109,0.2)", borderRadius: "12px", padding: "9px 14px", color: "#ff2a6d", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>
                  <Trash2 size={13} />{isArabic ? "مسح الكل" : "Clear All"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Empty state */}
        {watchlist.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "52vh", gap: "24px", textAlign: "center", padding: "40px 20px" }}>
            <div style={{ width: "110px", height: "110px", borderRadius: "50%", background: "rgba(255,42,109,0.1)", border: "2px solid rgba(255,42,109,0.2)", display: "flex", alignItems: "center", justifyContent: "center", animation: "hpulse 2.5s ease-in-out infinite" }}>
              <Heart size={50} color="rgba(255,42,109,0.35)" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.7rem", fontWeight: 800, margin: "0 0 10px" }}>{isArabic ? "قائمتك فارغة 🍿" : "Your list is empty 🍿"}</h2>
              <p style={{ fontSize: "0.95rem", color: theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", margin: "0 0 8px", maxWidth: "380px" }}>
                {isArabic ? `اضغط على ❤️ على أي فيلم لحفظه هنا لـ ${currentProfile.name}!` : `Tap ❤️ on any film to save it here for ${currentProfile.name}!`}
              </p>
            </div>
            <button onClick={() => router.push("/")} style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "linear-gradient(135deg,#ff2a6d,#ff8e53)", border: "none", borderRadius: "16px", padding: "14px 28px", color: "#fff", fontSize: "1rem", fontWeight: 800, cursor: "pointer", boxShadow: "0 6px 20px rgba(255,42,109,0.4)" }}>
              <Play size={18} fill="#fff" />{isArabic ? "استكشف الأفلام الآن" : "Explore Films Now"}
            </button>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
              {[["🎬", isArabic ? "رسوم متحركة" : "Animation"], ["⚓", "Popeye"], ["🏰", isArabic ? "حكايات" : "Fairytales"], ["🚀", isArabic ? "فضاء" : "Sci-Fi"]].map(([icon, label]) => (
                <button key={label} onClick={() => router.push("/")} style={{ background: theme === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)", border: theme === "dark" ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.08)", borderRadius: "20px", padding: "8px 14px", color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.55)", fontSize: "0.83rem", fontWeight: 600, cursor: "pointer" }}>
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="fav-grid">
            {watchlist.map((movie) => (
              <div key={movie.identifier} className="fav-card">
                <div className="fav-poster" onClick={() => setActiveMovie(movie)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setActiveMovie(movie)}>
                  <img src={`https://archive.org/services/img/${movie.identifier}`} alt={String(movie.title)} className="fav-img"
                    onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='280'%3E%3Crect width='200' height='280' fill='%230d1117'/%3E%3Ctext x='100' y='145' text-anchor='middle' fill='%23ff2a6d' font-size='48'%3E🎬%3C/text%3E%3C/svg%3E"; }} />
                  <div className="fav-shade" />
                  <div className="fav-play-overlay"><div className="fav-play-btn"><Play size={20} fill="#fff" color="#fff" /></div></div>
                  {movie.year && <div className="fav-year">{movie.year}</div>}
                </div>
                <div className="fav-footer">
                  <p className="fav-title">{String(movie.title)}</p>
                  <div className="fav-btns">
                    <button className="fav-play-btn-sm" onClick={() => setActiveMovie(movie)}><Play size={11} fill="currentColor" />{isArabic ? "تشغيل" : "Play"}</button>
                    <button className="fav-del-btn" onClick={() => removeFromWatchlist(movie)} title={isArabic ? "إزالة" : "Remove"}><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {activeMovie && (
        <MoviePlayerModal movie={activeMovie} onClose={() => setActiveMovie(null)} isInWatchlist={watchlist.some((w) => w.identifier === activeMovie.identifier)} onToggleWatchlist={toggleWatchlist} onPlayNext={(m) => setActiveMovie(m)} relatedMovies={watchlist.filter((m) => m.identifier !== activeMovie.identifier).slice(0, 8)} isArabic={isArabic} />
      )}

      <style jsx>{`
        @keyframes hpulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.06);opacity:.7} }
        .fav-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:18px}
        @media(max-width:1280px){.fav-grid{grid-template-columns:repeat(5,minmax(0,1fr));gap:16px}}
        @media(max-width:1024px){.fav-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}}
        @media(max-width:768px){.fav-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}}
        @media(max-width:480px){.fav-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}}
        .fav-card{border-radius:14px;overflow:hidden;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);box-shadow:0 4px 16px rgba(0,0,0,.4);transition:all .28s cubic-bezier(.2,.8,.2,1);-webkit-tap-highlight-color:transparent}
        .fav-card:hover{transform:translateY(-6px) scale(1.02);border-color:rgba(255,42,109,.6);box-shadow:0 14px 28px rgba(0,0,0,.7),0 0 20px rgba(255,42,109,.3)}
        @media(max-width:768px){.fav-card:hover{transform:none}.fav-card:active{transform:scale(.96);border-color:rgba(255,42,109,.6)}}
        .fav-poster{position:relative;width:100%;padding-top:140%;background:#0d1117;overflow:hidden;cursor:pointer}
        .fav-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .4s}
        .fav-card:hover .fav-img{transform:scale(1.07)}
        .fav-shade{position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(7,9,14,.9) 100%);z-index:1}
        .fav-play-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .25s;z-index:2}
        .fav-card:hover .fav-play-overlay{opacity:1}
        @media(max-width:768px){.fav-play-overlay{opacity:1}}
        .fav-play-btn{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#ff2a6d,#ff8e53);display:flex;align-items:center;justify-content:center;box-shadow:0 0 22px rgba(255,42,109,.8)}
        .fav-year{position:absolute;top:8px;left:8px;background:rgba(0,0,0,.7);border:1px solid rgba(255,255,255,.15);border-radius:6px;padding:2px 7px;font-size:.7rem;font-weight:700;color:rgba(255,255,255,.9);z-index:3}
        .fav-footer{padding:10px}
        .fav-title{font-size:.76rem;font-weight:700;margin:0 0 8px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;color:rgba(255,255,255,.9)}
        .fav-btns{display:flex;align-items:center;gap:6px}
        .fav-play-btn-sm{display:flex;align-items:center;gap:5px;background:linear-gradient(135deg,#ff2a6d,#ff8e53);border:none;border-radius:8px;padding:6px 10px;color:#fff;font-size:.73rem;font-weight:700;cursor:pointer;flex:1;justify-content:center;touch-action:manipulation}
        .fav-del-btn{width:30px;height:30px;border-radius:8px;border:1px solid rgba(255,42,109,.25);background:rgba(255,42,109,.08);color:rgba(255,42,109,.8);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;touch-action:manipulation}
        .fav-del-btn:hover{background:rgba(255,42,109,.2);color:#ff2a6d}
      `}</style>
    </div>
  );
}
