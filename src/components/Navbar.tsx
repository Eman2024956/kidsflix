"use client";

import React, { useState } from "react";
import { Search, Popcorn, X, ChevronDown, Check, Sun, Moon } from "lucide-react";
import { KidProfile } from "@/types/movie";

interface NavbarProps {
  onSearch: (query: string) => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  categoryCounts: Record<string, number>;
  totalVideosCount: number;
  watchlistCount: number;
  currentProfile: KidProfile;
  profiles: KidProfile[];
  onSelectProfile: (profile: KidProfile) => void;
  isArabic: boolean;
  onToggleLanguage: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearch,
  activeCategory,
  onSelectCategory,
  categoryCounts,
  totalVideosCount,
  watchlistCount,
  currentProfile,
  profiles,
  onSelectProfile,
  isArabic,
  onToggleLanguage,
  theme,
  onToggleTheme,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    onSearch("");
    setIsSearchOpen(false);
  };

  const formatCount = (count?: number) => {
    if (!count) return "0";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toLocaleString();
  };

  const categories = [
    { id: "all", labelEn: "All", labelAr: "الكل", count: totalVideosCount, icon: "🍿" },
    { id: "animation", labelEn: "Animation", labelAr: "رسوم متحركة", count: categoryCounts["animation"] || 0, icon: "🎬" },
    { id: "scifi", labelEn: "Space & Sci-Fi", labelAr: "فضاء وخيال علمي", count: categoryCounts["scifi"] || 0, icon: "🚀" },
    { id: "animals", labelEn: "Animals & Nature", labelAr: "حيوانات وطبيعة", count: categoryCounts["animals"] || 0, icon: "🐾" },
    { id: "comedy", labelEn: "Comedy & Laughs", labelAr: "ضحك ومقالب", count: categoryCounts["comedy"] || 0, icon: "😂" },
    { id: "science", labelEn: "Learn & Science", labelAr: "علوم ومعرفة", count: categoryCounts["science"] || 0, icon: "🧠" },
    { id: "game", labelEn: "Games", labelAr: "ألعاب وفيديو جيم", count: categoryCounts["game"] || 0, icon: "🎮" },
    { id: "art", labelEn: "Art & Stop Motion", labelAr: "فنون وإبداع", count: categoryCounts["art"] || 0, icon: "🎨" },
    { id: "realfilm", labelEn: "Real Film", labelAr: "أفلام حقيقية", count: categoryCounts["realfilm"] || 0, icon: "📽️" },
    { id: "popeye", labelEn: "Popeye", labelAr: "باباي", count: categoryCounts["popeye"] || 0, icon: "⚓" },
    { id: "superheroes", labelEn: "Superheroes", labelAr: "أبطال خارقين", count: categoryCounts["superheroes"] || 0, icon: "🦸" },
    { id: "fairytales", labelEn: "Fairytales", labelAr: "حكايات وخيال", count: categoryCounts["fairytales"] || 0, icon: "🏰" },
    { id: "watchlist", labelEn: "My List", labelAr: "قائمتي", count: watchlistCount, icon: "❤️" },
  ];

  return (
    <header className="glass-nav" style={{ position: "sticky", top: 0, zIndex: 50, width: "100%" }}>
      {/* Top Navbar Row */}
      <div
        style={{
          maxWidth: "1480px",
          margin: "0 auto",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "18px",
        }}
      >
        {/* Brand Logo & Total Video Counter */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            onClick={() => onSelectCategory("all")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                background: "var(--gradient-kids)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 18px rgba(255, 42, 109, 0.45)",
                flexShrink: 0,
              }}
            >
              <Popcorn size={26} color="#fff" />
            </div>
            <div>
              <div
                className="font-display"
                style={{
                  fontSize: "1.45rem",
                  fontWeight: 900,
                  letterSpacing: "-0.5px",
                  lineHeight: 1.1,
                  background: "linear-gradient(90deg, #ff2a6d 0%, #ff8e53 50%, #05d9e8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                KidsFlix
              </div>
              <div
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "var(--accent-yellow)",
                  letterSpacing: "0.4px",
                }}
              >
                {isArabic ? "نيتفلكس للأطفال" : "Internet Archive Kids"}
              </div>
            </div>
          </div>

          {/* Prominent Video Counter Badge */}
          <div
            style={{
              display: "none",
              alignItems: "center",
              gap: "6px",
              background: "rgba(5, 217, 232, 0.12)",
              border: "1px solid rgba(5, 217, 232, 0.3)",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: 800,
              color: "var(--accent-cyan)",
            }}
            className="md-flex"
          >
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-cyan)", display: "inline-block" }} />
            <span>
              {isArabic ? `إجمالي الفيديوهات: ${totalVideosCount.toLocaleString()}` : `Total Archive: ${totalVideosCount.toLocaleString()} Videos`}
            </span>
          </div>
        </div>

        {/* Right Actions: Search, Theme Toggle, Lang, Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: "flex",
              alignItems: "center",
              background: theme === "light" ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.08)",
              border: theme === "light" ? "1px solid rgba(0, 0, 0, 0.12)" : "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "30px",
              padding: "6px 14px",
              transition: "all 0.3s ease",
            }}
          >
            <Search size={18} color="var(--accent-cyan)" />
            <input
              type="text"
              placeholder={isArabic ? "ابحث بين آلاف الفيديوهات..." : "Search 140,000+ videos..."}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onSearch(e.target.value);
              }}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-main)",
                fontSize: "0.85rem",
                marginLeft: "8px",
                width: isSearchOpen ? "180px" : "130px",
                transition: "width 0.3s ease",
              }}
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => {
                if (!searchTerm) setIsSearchOpen(false);
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  color: "var(--text-dim)",
                }}
              >
                <X size={16} />
              </button>
            )}
          </form>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            title={theme === "dark" ? (isArabic ? "تفعيل الوضع الفاتح" : "Switch to Light Mode") : (isArabic ? "تفعيل الوضع الداكن" : "Switch to Dark Mode")}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: theme === "light" ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.08)",
              border: theme === "light" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(255, 255, 255, 0.15)",
              color: theme === "light" ? "#f59e0b" : "var(--accent-cyan)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLanguage}
            title={isArabic ? "Switch to English" : "التبديل إلى العربية"}
            style={{
              background: theme === "light" ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.08)",
              border: theme === "light" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(255, 255, 255, 0.12)",
              color: "var(--text-main)",
              borderRadius: "20px",
              padding: "6px 12px",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {isArabic ? "EN" : "عربي"}
          </button>

          {/* Profile Selector */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: theme === "light" ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.06)",
                border: theme === "light" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(255, 255, 255, 0.12)",
                padding: "4px 10px 4px 6px",
                borderRadius: "30px",
                cursor: "pointer",
                color: "var(--text-main)",
              }}
            >
              <span style={{ fontSize: "1.3rem" }}>{currentProfile.avatar}</span>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  display: "none",
                }}
                className="profile-name-span"
              >
                {currentProfile.name}
              </span>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {/* Profile Dropdown */}
            {isProfileDropdownOpen && (
              <div
                className="glass-panel animate-modal"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "120%",
                  width: "200px",
                  borderRadius: "16px",
                  padding: "12px",
                  boxShadow: "var(--shadow-modal)",
                  zIndex: 60,
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--text-dim)",
                    padding: "4px 8px 8px 8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {isArabic ? "من يشاهد الآن؟" : "Kids Profile"}
                </div>
                {profiles.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProfile(p);
                      setIsProfileDropdownOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 10px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      background: p.id === currentProfile.id ? "rgba(255, 42, 109, 0.15)" : "transparent",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "1.4rem" }}>{p.avatar}</span>
                      <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)" }}>{p.name}</span>
                    </div>
                    {p.id === currentProfile.id && <Check size={16} color="var(--accent-pink)" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories Bar with Dynamic Counters */}
      <div
        id="categories-carousel"
        style={{
          borderTop: theme === "light" ? "1px solid rgba(0, 0, 0, 0.06)" : "1px solid rgba(255, 255, 255, 0.06)",
          padding: "8px 16px",
          background: theme === "light" ? "rgba(255, 255, 255, 0.7)" : "rgba(10, 14, 24, 0.6)",
        }}
      >
        <div
          style={{
            maxWidth: "1480px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            overflowX: "auto",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            paddingBottom: "4px",
          }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                style={{
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: isActive
                    ? "var(--gradient-kids)"
                    : theme === "light"
                    ? "rgba(0, 0, 0, 0.04)"
                    : "rgba(255, 255, 255, 0.06)",
                  color: isActive ? "#ffffff" : "var(--text-main)",
                  border: isActive
                    ? "1px solid rgba(255, 42, 109, 0.6)"
                    : theme === "light"
                    ? "1px solid rgba(0, 0, 0, 0.08)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: isActive ? 800 : 600,
                  cursor: "pointer",
                  boxShadow: isActive ? "0 4px 15px rgba(255, 42, 109, 0.4)" : "none",
                  transition: "all 0.2s ease",
                  touchAction: "manipulation",
                }}
              >
                <span>{cat.icon}</span>
                <span>{isArabic ? cat.labelAr : cat.labelEn}</span>
                {/* Category Counter Pill */}
                <span
                  style={{
                    background: isActive ? "rgba(0, 0, 0, 0.25)" : "rgba(255, 183, 3, 0.15)",
                    color: isActive ? "#ffffff" : "var(--accent-yellow)",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    padding: "1px 7px",
                    borderRadius: "10px",
                  }}
                >
                  {formatCount(cat.count)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .md-flex {
            display: flex !important;
          }
          .profile-name-span {
            display: inline !important;
          }
        }
        @media (max-width: 640px) {
          .navbar-top-row {
            padding: 10px 14px !important;
            gap: 10px !important;
          }
        }
      `}</style>
    </header>
  );
};
