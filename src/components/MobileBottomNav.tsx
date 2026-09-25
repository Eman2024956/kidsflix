"use client";

import React from "react";
import { Popcorn, LayoutGrid, Heart, Search, Sun, Moon } from "lucide-react";

interface MobileBottomNavProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  watchlistCount: number;
  isArabic: boolean;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenSearch: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeCategory,
  onSelectCategory,
  watchlistCount,
  isArabic,
  theme,
  onToggleTheme,
  onOpenSearch,
}) => {
  return (
    <nav className="mobile-bottom-nav">
      {/* 1. Home */}
      <button
        onClick={() => {
          onSelectCategory("all");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className={`mobile-nav-btn ${activeCategory === "all" ? "active" : ""}`}
        aria-label="Home"
      >
        <div className="mobile-nav-icon">
          <Popcorn size={22} />
        </div>
        <span className="mobile-nav-label">{isArabic ? "الرئيسية" : "Home"}</span>
      </button>

      {/* 2. Categories */}
      <button
        onClick={() => {
          const catSection = document.getElementById("categories-carousel");
          if (catSection) {
            catSection.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            onSelectCategory("animation");
          }
        }}
        className={`mobile-nav-btn ${activeCategory !== "all" && activeCategory !== "watchlist" ? "active" : ""}`}
        aria-label="Categories"
      >
        <div className="mobile-nav-icon">
          <LayoutGrid size={22} />
        </div>
        <span className="mobile-nav-label">{isArabic ? "التصنيفات" : "Explore"}</span>
      </button>

      {/* 3. Search */}
      <button
        onClick={onOpenSearch}
        className="mobile-nav-btn"
        aria-label="Search"
      >
        <div className="mobile-nav-icon">
          <Search size={22} />
        </div>
        <span className="mobile-nav-label">{isArabic ? "بحث" : "Search"}</span>
      </button>

      {/* 4. Watchlist */}
      <button
        onClick={() => onSelectCategory("watchlist")}
        className={`mobile-nav-btn ${activeCategory === "watchlist" ? "active" : ""}`}
        aria-label="My Watchlist"
      >
        <div className="mobile-nav-icon" style={{ position: "relative" }}>
          <Heart size={22} fill={activeCategory === "watchlist" ? "var(--accent-pink)" : "none"} />
          {watchlistCount > 0 && (
            <span className="mobile-nav-badge">{watchlistCount}</span>
          )}
        </div>
        <span className="mobile-nav-label">{isArabic ? "قائمتي" : "My List"}</span>
      </button>

      {/* 5. Theme Toggle */}
      <button
        onClick={onToggleTheme}
        className="mobile-nav-btn"
        aria-label="Toggle Theme"
      >
        <div className="mobile-nav-icon" style={{ color: theme === "light" ? "#f59e0b" : "var(--accent-cyan)" }}>
          {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
        </div>
        <span className="mobile-nav-label">
          {theme === "dark" ? (isArabic ? "نهاري" : "Light") : (isArabic ? "ليلي" : "Dark")}
        </span>
      </button>

      <style jsx>{`
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 85;
          height: 64px;
          background: var(--bg-glass);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-top: 1px solid var(--border-subtle);
          padding-bottom: env(safe-area-inset-bottom, 0px);
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
        }

        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: flex;
            align-items: center;
            justify-content: space-around;
          }
        }

        .mobile-nav-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: var(--text-dim);
          padding: 6px 0;
          cursor: pointer;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          transition: all 0.2s ease;
        }

        .mobile-nav-btn:active {
          transform: scale(0.9);
        }

        .mobile-nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .mobile-nav-label {
          font-size: 0.65rem;
          font-weight: 700;
          margin-top: 3px;
          letter-spacing: 0.2px;
        }

        .mobile-nav-btn.active {
          color: var(--accent-pink);
        }

        .mobile-nav-btn.active .mobile-nav-icon {
          transform: translateY(-2px);
          color: var(--accent-pink);
        }

        .mobile-nav-badge {
          position: absolute;
          top: -4px;
          right: -8px;
          background: var(--accent-pink);
          color: #fff;
          font-size: 0.6rem;
          font-weight: 800;
          min-width: 16px;
          height: 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          box-shadow: 0 2px 6px rgba(255, 42, 109, 0.6);
        }
      `}</style>
    </nav>
  );
};
