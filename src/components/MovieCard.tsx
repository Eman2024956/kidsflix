"use client";

import React, { useState } from "react";
import { Play, Heart, Download, Film } from "lucide-react";
import { Movie } from "@/types/movie";

interface MovieCardProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  isInWatchlist: boolean;
  onToggleWatchlist: (movie: Movie) => void;
  isArabic: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onPlay,
  isInWatchlist,
  onToggleWatchlist,
  isArabic,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Formatter for large download counts (e.g., 2.3M, 450K)
  const formatDownloads = (num?: number) => {
    if (!num) return null;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num;
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        flexShrink: 0,
        width: "210px",
        borderRadius: "16px",
        overflow: "hidden",
        backgroundColor: "var(--bg-elevated)",
        boxShadow: isHovered
          ? "0 14px 30px -4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 42, 109, 0.35)"
          : "var(--shadow-card)",
        transform: isHovered ? "translateY(-8px) scale(1.03)" : "none",
        transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
        cursor: "pointer",
        border: isHovered
          ? "1px solid rgba(255, 42, 109, 0.6)"
          : "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      {/* Poster Media Box (16:9 or 3:4 aspect ratio) */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "135%", // Poster aspect ratio
          backgroundColor: "#111625",
          overflow: "hidden",
        }}
        onClick={() => onPlay(movie)}
      >
        {imageError ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              background: "linear-gradient(135deg, #1c2438 0%, #0d121d 100%)",
              textAlign: "center",
            }}
          >
            <Film size={36} color="var(--accent-pink)" style={{ marginBottom: "8px" }} />
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#fff" }}>
              {movie.title}
            </span>
          </div>
        ) : (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            loading="lazy"
            onError={() => setImageError(true)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: isHovered ? "scale(1.08)" : "scale(1)",
              transition: "transform 0.4s ease",
            }}
          />
        )}

        {/* Shading Gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 60%, rgba(7,9,14,0.95) 100%)",
          }}
        />

        {/* Free Archive Badge */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(7, 9, 14, 0.75)",
            backdropFilter: "blur(6px)",
            borderRadius: "6px",
            padding: "3px 7px",
            fontSize: "0.65rem",
            fontWeight: 800,
            color: "var(--accent-cyan)",
            border: "1px solid rgba(5, 217, 232, 0.3)",
          }}
        >
          IA 🍿
        </div>

        {/* Watchlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist(movie);
          }}
          title={
            isInWatchlist
              ? isArabic
                ? "إزالة من المفضلة"
                : "Remove from list"
              : isArabic
              ? "أضف إلى المفضلة"
              : "Add to list"
          }
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: isInWatchlist
              ? "rgba(255, 42, 109, 0.9)"
              : "rgba(7, 9, 14, 0.7)",
            backdropFilter: "blur(6px)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#ffffff",
            transition: "all 0.2s ease",
          }}
        >
          <Heart
            size={16}
            fill={isInWatchlist ? "#ffffff" : "transparent"}
            color={isInWatchlist ? "#ffffff" : "rgba(255,255,255,0.8)"}
          />
        </button>

        {/* Center Hover Play Icon */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "scale(1)" : "scale(0.8)",
            transition: "all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "var(--gradient-kids)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(255, 42, 109, 0.8)",
            }}
          >
            <Play size={22} fill="#ffffff" color="#ffffff" style={{ marginLeft: "3px" }} />
          </div>
        </div>

        {/* Bottom Year and Info on poster */}
        <div
          style={{
            position: "absolute",
            bottom: "8px",
            left: "10px",
            right: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
          }}
        >
          <span style={{ fontWeight: 700, color: "var(--accent-yellow)" }}>
            ★ {movie.rating || "4.5"}
          </span>
          {movie.year && (
            <span style={{ background: "rgba(255,255,255,0.15)", padding: "1px 6px", borderRadius: "4px" }}>
              {movie.year}
            </span>
          )}
        </div>
      </div>

      {/* Card Metadata Details */}
      <div style={{ padding: "12px 14px 14px 14px" }} onClick={() => onPlay(movie)}>
        <h3
          className="font-display"
          style={{
            fontSize: "0.95rem",
            fontWeight: 700,
            lineHeight: 1.3,
            color: isHovered ? "var(--accent-cyan)" : "#ffffff",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginBottom: "6px",
            transition: "color 0.2s ease",
          }}
          title={movie.title}
        >
          {movie.title}
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.72rem",
            color: "var(--text-dim)",
          }}
        >
          <span>{movie.runtime || "Animation"}</span>
          {movie.downloads ? (
            <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <Download size={11} />
              {formatDownloads(movie.downloads)}
            </span>
          ) : (
            <span style={{ color: "var(--accent-green)" }}>
              {isArabic ? "مشاهدة مجانية" : "Free Stream"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
