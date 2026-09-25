"use client";

import React, { useState } from "react";
import {
  Play,
  Heart,
  Download,
  Grid,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react";
import { Movie } from "@/types/movie";

interface VideoGridTableProps {
  movies: Movie[];
  title: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (newRows: number) => void;
  isLoading?: boolean;
  onPlay: (movie: Movie) => void;
  watchlist: Movie[];
  onToggleWatchlist: (movie: Movie) => void;
  isArabic: boolean;
}

export const VideoGridTable: React.FC<VideoGridTableProps> = ({
  movies,
  title,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  isLoading = false,
  onPlay,
  watchlist,
  onToggleWatchlist,
  isArabic,
}) => {
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "year">("popular");

  // Category Icon mapper
  const getCategoryBadge = (cat?: string) => {
    switch (cat?.toLowerCase()) {
      case "scifi":
        return { label: isArabic ? "فضاء" : "Sci-Fi", icon: "🚀", color: "#38bdf8" };
      case "animals":
        return { label: isArabic ? "طبيعة" : "Animals", icon: "🐾", color: "#22c55e" };
      case "comedy":
        return { label: isArabic ? "ضحك" : "Comedy", icon: "😂", color: "#f43f5e" };
      case "science":
        return { label: isArabic ? "علوم" : "Science", icon: "🧠", color: "#a855f7" };
      case "game":
        return { label: isArabic ? "ألعاب" : "Games", icon: "🎮", color: "#8b5cf6" };
      case "art":
        return { label: isArabic ? "فنون" : "Art", icon: "🎨", color: "#06b6d4" };
      case "realfilm":
        return { label: isArabic ? "سينما" : "Real Film", icon: "📽️", color: "#f59e0b" };
      case "superheroes":
        return { label: isArabic ? "أبطال" : "Heroes", icon: "🦸", color: "#ef4444" };
      case "popeye":
        return { label: isArabic ? "باباي" : "Popeye", icon: "⚓", color: "#3b82f6" };
      case "fairytales":
        return { label: isArabic ? "خيال" : "Tales", icon: "🏰", color: "#a855f7" };
      default:
        return { label: isArabic ? "كرتون" : "Animation", icon: "🎬", color: "#10b981" };
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatDownloads = (num?: number) => {
    if (!num) return null;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num;
  };

  // Sort logic
  const sortedMovies = [...movies].sort((a, b) => {
    if (sortBy === "rating") {
      return (Number(b.rating) || 0) - (Number(a.rating) || 0);
    }
    if (sortBy === "year") {
      return (Number(b.year) || 0) - (Number(a.year) || 0);
    }
    return (b.downloads || 0) - (a.downloads || 0);
  });

  // Calculate pagination visible range
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const startIdx = (currentPage - 1) * rowsPerPage + 1;
  const endIdx = Math.min(currentPage * rowsPerPage, totalCount);

  return (
    <div id="grid-table-top" className="grid-table-wrapper">
      {/* Header Bar: Title, Counters, Sort Controls */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "rgba(255, 42, 109, 0.15)",
              border: "1px solid rgba(255, 42, 109, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Grid size={24} color="var(--accent-pink)" />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h2
                className="font-display"
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: "-0.3px",
                }}
              >
                {title}
              </h2>
              {/* Massive Library Counter Badge */}
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  color: "#fff",
                  background: "var(--gradient-kids)",
                  padding: "3px 12px",
                  borderRadius: "14px",
                  boxShadow: "0 2px 10px rgba(255, 42, 109, 0.35)",
                }}
              >
                {formatNumber(totalCount)} {isArabic ? "فيلم متاح" : "Films Available"}
              </span>

              {isLoading && (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "var(--accent-cyan)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                  }}
                >
                  <Loader2 size={16} className="animate-spin" />
                  {isArabic ? "جارٍ التحميل..." : "Fetching movies..."}
                </span>
              )}
            </div>

            <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginTop: "4px" }}>
              {isArabic
                ? `عرض الفيديوهات من ${startIdx} إلى ${endIdx} من إجمالي ${formatNumber(totalCount)} فيلم (الصفحة ${currentPage} من ${totalPages})`
                : `Showing ${startIdx}–${endIdx} of ${formatNumber(totalCount)} items (Page ${currentPage} of ${totalPages})`}
            </div>
          </div>
        </div>

        {/* Controls: Per Page & Sort By */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {/* Rows per page selector (multiples of 6) */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {isArabic ? "لكل صفحة:" : "Per page:"}
            </span>
            <select
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                padding: "6px 10px",
                borderRadius: "10px",
                fontSize: "0.82rem",
                fontWeight: 700,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value={24} style={{ background: "#0f1422" }}>24</option>
              <option value={48} style={{ background: "#0f1422" }}>48 (8x6)</option>
              <option value={72} style={{ background: "#0f1422" }}>72 (12x6)</option>
            </select>
          </div>

          {/* Sort selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
              <SlidersHorizontal size={14} />
              {isArabic ? "ترتيب:" : "Sort:"}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "popular" | "rating" | "year")}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                padding: "6px 12px",
                borderRadius: "10px",
                fontSize: "0.82rem",
                fontWeight: 600,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="popular" style={{ background: "#0f1422" }}>
                {isArabic ? "الأكثر تحميلاً 🔥" : "Most Popular 🔥"}
              </option>
              <option value="rating" style={{ background: "#0f1422" }}>
                {isArabic ? "الأعلى تقييماً ⭐" : "Highest Rated ⭐"}
              </option>
              <option value="year" style={{ background: "#0f1422" }}>
                {isArabic ? "سنة الإنتاج 📅" : "Release Year 📅"}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* 6-Column Video Grid Table */}
      <div className={`six-col-grid ${isLoading ? "grid-loading" : ""}`}>
        {sortedMovies.map((movie) => {
          const isSaved = watchlist.some((w) => w.identifier === movie.identifier);
          const badge = getCategoryBadge(movie.category);

          return (
            <div
              key={movie.identifier}
              className="grid-card"
              onClick={() => onPlay(movie)}
            >
              {/* Poster Box */}
              <div className="grid-card-media">
                <img
                  src={movie.posterUrl}
                  alt={String(movie.title || "Film")}
                  loading="lazy"
                  className="grid-card-img"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />

                {/* Shading overlay */}
                <div className="grid-card-shade" />

                {/* Category Pill on top-left */}
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    background: "rgba(7, 9, 14, 0.8)",
                    backdropFilter: "blur(6px)",
                    borderRadius: "12px",
                    padding: "3px 8px",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    color: badge.color,
                    border: `1px solid ${badge.color}44`,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    zIndex: 2,
                  }}
                >
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </div>

                {/* Watchlist Bookmark Heart */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWatchlist(movie);
                  }}
                  title={isSaved ? "Remove from list" : "Add to list"}
                  className="grid-card-heart"
                  style={{
                    background: isSaved ? "rgba(255, 42, 109, 0.9)" : "rgba(7, 9, 14, 0.7)",
                  }}
                >
                  <Heart
                    size={14}
                    fill={isSaved ? "#ffffff" : "transparent"}
                    color={isSaved ? "#ffffff" : "rgba(255,255,255,0.8)"}
                  />
                </button>

                {/* Play Button Overlay */}
                <div className="grid-card-play-hover">
                  <div className="grid-play-circle">
                    <Play size={20} fill="#ffffff" color="#ffffff" style={{ marginLeft: "2px" }} />
                  </div>
                </div>

                {/* Rating & Year Badges at bottom of poster */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    left: "8px",
                    right: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.72rem",
                    zIndex: 2,
                  }}
                >
                  <span style={{ color: "var(--accent-yellow)", fontWeight: 800, display: "flex", alignItems: "center", gap: "2px" }}>
                    ★ {movie.rating || "4.6"}
                  </span>
                  {movie.year && (
                    <span
                      style={{
                        background: "rgba(255, 255, 255, 0.16)",
                        padding: "1px 6px",
                        borderRadius: "4px",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    >
                      {movie.year}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Meta Content */}
              <div style={{ padding: "10px 12px 12px 12px" }}>
                <h3
                  className="font-display"
                  title={String(movie.title || "")}
                  style={{
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    lineHeight: 1.3,
                    color: "#ffffff",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginBottom: "6px",
                  }}
                >
                  {String(movie.title || "Classic Film")}
                </h3>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "0.7rem",
                    color: "var(--text-dim)",
                  }}
                >
                  <span>{movie.runtime || "Feature"}</span>
                  {movie.downloads ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                      <Download size={11} />
                      {formatDownloads(movie.downloads)}
                    </span>
                  ) : (
                    <span style={{ color: "var(--accent-cyan)", fontWeight: 700 }}>Free IA</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Bar for 2000+ films */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "8px",
            marginTop: "40px",
            padding: "20px",
            background: "rgba(15, 20, 34, 0.7)",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* First Page */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || isLoading}
            className="pagination-btn"
            title={isArabic ? "الصفحة الأولى" : "First Page"}
          >
            <ChevronsLeft size={18} />
          </button>

          {/* Previous Page */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="pagination-btn"
            title={isArabic ? "الصفحة السابقة" : "Previous Page"}
          >
            <ChevronLeft size={18} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>{isArabic ? "السابق" : "Prev"}</span>
          </button>

          {/* Page numbers */}
          {getPageNumbers().map((num) => {
            const isActive = num === currentPage;
            return (
              <button
                key={num}
                onClick={() => onPageChange(num)}
                disabled={isLoading}
                className={`pagination-num-btn ${isActive ? "active" : ""}`}
              >
                {num}
              </button>
            );
          })}

          {/* Ellipsis if not near the end */}
          {currentPage < totalPages - 2 && (
            <span style={{ color: "var(--text-dim)", padding: "0 4px" }}>...</span>
          )}

          {/* Last Page number */}
          {totalPages > 5 && !getPageNumbers().includes(totalPages) && (
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={isLoading}
              className={`pagination-num-btn ${totalPages === currentPage ? "active" : ""}`}
            >
              {totalPages}
            </button>
          )}

          {/* Next Page */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="pagination-btn"
            title={isArabic ? "الصفحة التالية" : "Next Page"}
          >
            <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>{isArabic ? "التالي" : "Next"}</span>
            <ChevronRight size={18} />
          </button>

          {/* Last Page */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || isLoading}
            className="pagination-btn"
            title={isArabic ? "الصفحة الأخيرة" : "Last Page"}
          >
            <ChevronsRight size={18} />
          </button>
        </div>
      )}

      <style jsx>{`
        /* Grid table wrapper */
        .grid-table-wrapper {
          max-width: 1480px;
          margin: 0 auto;
          padding: 20px 24px 80px 24px;
        }

        @media (max-width: 768px) {
          .grid-table-wrapper {
            padding: 12px 12px 100px 12px;
          }
        }

        /* Exactly 6 columns on desktop */
        .six-col-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 18px;
          transition: opacity 0.2s ease;
        }

        .grid-loading {
          opacity: 0.6;
          pointer-events: none;
        }

        @media (max-width: 1280px) {
          .six-col-grid {
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 16px;
          }
        }

        @media (max-width: 1024px) {
          .six-col-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 14px;
          }
        }

        @media (max-width: 768px) {
          .six-col-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 10px;
          }
        }

        @media (max-width: 480px) {
          .six-col-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }
        }

        .grid-card {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          background-color: var(--bg-elevated);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
          cursor: pointer;
          transition: all 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .grid-card:hover {
          transform: translateY(-6px) scale(1.02);
          border-color: rgba(255, 42, 109, 0.7);
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 42, 109, 0.4);
        }

        @media (max-width: 768px) {
          .grid-card {
            border-radius: 10px;
          }
          .grid-card:hover {
            transform: none;
          }
          .grid-card:active {
            transform: scale(0.96);
            border-color: rgba(255, 42, 109, 0.7);
          }
        }

        .grid-card-media {
          position: relative;
          width: 100%;
          padding-top: 140%; /* 2:3 aspect ratio */
          background-color: #121726;
          overflow: hidden;
        }

        .grid-card-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .grid-card:hover .grid-card-img {
          transform: scale(1.08);
        }

        .grid-card-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.2) 55%, rgba(7,9,14,0.95) 100%);
          z-index: 1;
        }

        .grid-card-heart {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(6px);
          z-index: 3;
          transition: transform 0.2s ease;
          touch-action: manipulation;
        }

        .grid-card-heart:hover {
          transform: scale(1.15);
        }

        .grid-card-play-hover {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: scale(0.85);
          transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 2;
          pointer-events: none;
        }

        .grid-card:hover .grid-card-play-hover {
          opacity: 1;
          transform: scale(1);
        }

        @media (max-width: 768px) {
          .grid-card-play-hover {
            opacity: 1;
            transform: scale(0.7);
          }
        }

        .grid-play-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--gradient-kids);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(255, 42, 109, 0.85);
        }

        /* Pagination buttons */
        .pagination-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #ffffff;
          padding: 8px 14px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        .pagination-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.18);
          transform: translateY(-2px);
        }

        .pagination-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .pagination-btn span {
            display: none;
          }
          .pagination-btn {
            padding: 8px;
          }
        }

        .pagination-num-btn {
          min-width: 38px;
          height: 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #ffffff;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          touch-action: manipulation;
        }

        .pagination-num-btn:hover:not(.active) {
          background: rgba(255, 255, 255, 0.18);
        }

        .pagination-num-btn.active {
          background: var(--gradient-kids);
          border-color: rgba(255, 42, 109, 0.6);
          box-shadow: 0 4px 15px rgba(255, 42, 109, 0.45);
        }

        @media (max-width: 480px) {
          .pagination-num-btn {
            min-width: 32px;
            height: 32px;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};
