"use client";

import React from "react";
import { Play, Plus, Check, Info, ShieldCheck, Film, Sparkles } from "lucide-react";
import { Movie } from "@/types/movie";

interface HeroBannerProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onMoreInfo: (movie: Movie) => void;
  isInWatchlist: boolean;
  onToggleWatchlist: (movie: Movie) => void;
  isArabic: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  movie,
  onPlay,
  onMoreInfo,
  isInWatchlist,
  onToggleWatchlist,
  isArabic,
}) => {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "560px",
        maxHeight: "720px",
        width: "100%",
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
        backgroundColor: "#07090e",
      }}
    >
      {/* Background Poster Image with Ambient Blur and Gradients */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${movie.posterUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          filter: "brightness(0.65) saturate(1.2)",
          transform: "scale(1.05)",
          transition: "transform 8s ease-out",
        }}
      />

      {/* Atmospheric Glow Orbs */}
      <div
        className="glow-orb"
        style={{
          width: "450px",
          height: "450px",
          background: "radial-gradient(circle, rgba(255,42,109,0.3) 0%, transparent 70%)",
          top: "-50px",
          left: "5%",
        }}
      />
      <div
        className="glow-orb"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(5,217,232,0.25) 0%, transparent 70%)",
          bottom: "10%",
          right: "10%",
        }}
      />

      {/* Hero Vignette Gradients */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(7,9,14,0.1) 0%, rgba(7,9,14,0.6) 50%, rgba(7,9,14,0.98) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(7,9,14,0.92) 0%, rgba(7,9,14,0.65) 45%, transparent 100%)",
        }}
      />

      {/* Content Container */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1400px",
          width: "100%",
          margin: "0 auto",
          padding: "40px 28px 60px 28px",
        }}
      >
        <div style={{ maxWidth: "680px" }}>
          {/* Badges Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <span className="badge badge-free">
              <ShieldCheck size={14} />
              {isArabic ? "مجاني 100% بدون إعلانات" : "100% Free Public Domain"}
            </span>
            <span className="badge badge-kids">
              <Sparkles size={14} />
              {isArabic ? "مناسب للأطفال" : "Kid Safe All Ages"}
            </span>
            <span className="badge badge-hd">
              <Film size={14} />
              {isArabic ? "أرشيف الإنترنت" : "Archive.org HD"}
            </span>
            {movie.year && (
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                  marginLeft: "4px",
                }}
              >
                {movie.year}
              </span>
            )}
          </div>

          {/* Movie Title */}
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.8rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: "16px",
              color: "#ffffff",
              textShadow: "0 4px 20px rgba(0,0,0,0.8)",
            }}
          >
            {movie.title}
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)",
              lineHeight: 1.6,
              color: "rgba(255, 255, 255, 0.85)",
              marginBottom: "28px",
              textShadow: "0 2px 8px rgba(0,0,0,0.7)",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {movie.description}
          </p>

          {/* Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
            <button
              onClick={() => onPlay(movie)}
              className="btn-primary"
              style={{ padding: "14px 32px", fontSize: "1.1rem" }}
            >
              <Play size={22} fill="#ffffff" />
              <span>{isArabic ? "شاهد الآن" : "Play Movie"}</span>
            </button>

            <button
              onClick={() => onToggleWatchlist(movie)}
              className="btn-secondary"
              style={{
                background: isInWatchlist ? "rgba(255, 42, 109, 0.25)" : "rgba(255, 255, 255, 0.12)",
                borderColor: isInWatchlist ? "var(--accent-pink)" : "rgba(255, 255, 255, 0.2)",
              }}
            >
              {isInWatchlist ? (
                <>
                  <Check size={18} color="var(--accent-pink)" />
                  <span style={{ color: "var(--accent-pink)" }}>
                    {isArabic ? "في قائمتي" : "In Watchlist"}
                  </span>
                </>
              ) : (
                <>
                  <Plus size={18} />
                  <span>{isArabic ? "أضف لقائمتي" : "Add to List"}</span>
                </>
              )}
            </button>

            <button onClick={() => onMoreInfo(movie)} className="btn-secondary">
              <Info size={18} />
              <span>{isArabic ? "تفاصيل الفيلم" : "Details"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
