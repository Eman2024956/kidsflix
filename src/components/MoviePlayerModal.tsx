"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  X,
  Heart,
  Download,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Film,
} from "lucide-react";
import { Movie, MovieDetailResponse } from "@/types/movie";

interface MoviePlayerModalProps {
  movie: Movie;
  onClose: () => void;
  isInWatchlist: boolean;
  onToggleWatchlist: (movie: Movie) => void;
  onPlayNext: (movie: Movie) => void;
  relatedMovies: Movie[];
  isArabic: boolean;
}

export const MoviePlayerModal: React.FC<MoviePlayerModalProps> = ({
  movie,
  onClose,
  isInWatchlist,
  onToggleWatchlist,
  onPlayNext,
  relatedMovies,
  isArabic,
}) => {
  const [details, setDetails] = useState<MovieDetailResponse | null>(null);
  const [playerMode, setPlayerMode] = useState<"embed" | "direct">("embed");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Fetch metadata details for identifier
  useEffect(() => {
    let isMounted = true;

    fetch(`/api/movie/${encodeURIComponent(movie.identifier)}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (data?.movie) {
            setDetails(data.movie);
            // If direct video url is available, we can support direct
            if (data.movie.videoUrl) {
              setPlayerMode("direct");
            } else {
              setPlayerMode("embed");
            }
          }
        }
      })
      .catch((err) => {
        console.warn("Failed fetching movie details:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [movie.identifier]);

  const videoStreamUrl = details?.videoUrl || movie.videoUrl;
  const embedStreamUrl = movie.embedUrl || `https://archive.org/embed/${movie.identifier}`;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "rgba(3, 5, 8, 0.92)",
        backdropFilter: "blur(14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-modal"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1060px",
          maxHeight: "92vh",
          backgroundColor: "#0d111b",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "var(--shadow-modal)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "1.4rem" }}>🎬</span>
            <div>
              <h2
                className="font-display"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  color: "#ffffff",
                  lineHeight: 1.2,
                }}
              >
                {movie.title}
              </h2>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {movie.year} • {isArabic ? "أرشيف مجاني" : "Public Domain Animation"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Player Switcher if direct video exists */}
            {videoStreamUrl && (
              <div
                style={{
                  display: "flex",
                  background: "rgba(255, 255, 255, 0.08)",
                  borderRadius: "20px",
                  padding: "3px",
                }}
              >
                <button
                  onClick={() => setPlayerMode("direct")}
                  style={{
                    background: playerMode === "direct" ? "var(--accent-pink)" : "transparent",
                    color: "#fff",
                    border: "none",
                    borderRadius: "16px",
                    padding: "4px 10px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  HTML5
                </button>
                <button
                  onClick={() => setPlayerMode("embed")}
                  style={{
                    background: playerMode === "embed" ? "var(--accent-pink)" : "transparent",
                    color: "#fff",
                    border: "none",
                    borderRadius: "16px",
                    padding: "4px 10px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  IA Player
                </button>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="btn-icon"
              style={{ width: "36px", height: "36px" }}
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Video Player Screen Container (16:9) */}
        <div
          id="player-container"
          style={{
            position: "relative",
            width: "100%",
            backgroundColor: "#000000",
            paddingTop: "56.25%", // 16:9 ratio
          }}
        >
          {playerMode === "direct" && videoStreamUrl ? (
            <video
              ref={videoRef}
              src={videoStreamUrl}
              controls
              autoPlay
              poster={movie.posterUrl}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                outline: "none",
              }}
            />
          ) : (
            <iframe
              src={embedStreamUrl}
              title={movie.title}
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          )}
        </div>

        {/* Info & Meta Section */}
        <div style={{ padding: "24px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <span className="badge badge-free">
                <ShieldCheck size={14} />
                {isArabic ? "مجاني وقانوني" : "100% Free Public Domain"}
              </span>
              <span className="badge badge-kids">
                <Sparkles size={14} />
                {isArabic ? "مناسب للأطفال" : "Kid Safe"}
              </span>
              <span className="badge badge-hd">
                <Film size={14} />
                Archive.org
              </span>
              {details?.year && (
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  {isArabic ? "سنة الإنتاج:" : "Year:"} {details.year}
                </span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* Watchlist Toggle */}
              <button
                onClick={() => onToggleWatchlist(movie)}
                className="btn-secondary"
                style={{ padding: "8px 18px", fontSize: "0.85rem" }}
              >
                <Heart
                  size={16}
                  fill={isInWatchlist ? "var(--accent-pink)" : "transparent"}
                  color={isInWatchlist ? "var(--accent-pink)" : "#fff"}
                />
                <span>
                  {isInWatchlist
                    ? isArabic
                      ? "في قائمتي"
                      : "In Watchlist"
                    : isArabic
                    ? "أضف للمفضلة"
                    : "Add to List"}
                </span>
              </button>

              {/* Download / Archive Link */}
              {videoStreamUrl && (
                <a
                  href={videoStreamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="btn-secondary"
                  style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                >
                  <Download size={16} />
                  <span>{isArabic ? "تحميل MP4" : "Download MP4"}</span>
                </a>
              )}

              <a
                href={`https://archive.org/details/${movie.identifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ padding: "8px 14px", fontSize: "0.85rem" }}
                title="View on Internet Archive"
              >
                <ExternalLink size={16} />
                <span>Archive.org</span>
              </a>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: "24px" }}>
            <h4
              style={{
                fontSize: "0.9rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "var(--accent-cyan)",
                marginBottom: "6px",
                fontWeight: 700,
              }}
            >
              {isArabic ? "نبذة عن الفيلم" : "Synopsis"}
            </h4>
            <p
              style={{
                fontSize: "0.95rem",
                lineHeight: 1.65,
                color: "var(--text-muted)",
              }}
            >
              {details?.description || movie.description}
            </p>
          </div>

          {/* Up Next / More Like This Carousel */}
          {relatedMovies && relatedMovies.length > 0 && (
            <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "20px" }}>
              <h3
                className="font-display"
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: "14px",
                }}
              >
                {isArabic ? "كرتون مقترح بعد ذلك 🍿" : "Up Next: Keep Binging 🍿"}
              </h3>
              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  overflowX: "auto",
                  paddingBottom: "10px",
                  scrollbarWidth: "none",
                }}
              >
                {relatedMovies
                  .filter((m) => m.identifier !== movie.identifier)
                  .slice(0, 6)
                  .map((rel) => (
                    <div
                      key={rel.identifier}
                      onClick={() => onPlayNext(rel)}
                      style={{
                        flexShrink: 0,
                        width: "160px",
                        cursor: "pointer",
                        borderRadius: "12px",
                        overflow: "hidden",
                        background: "var(--bg-elevated)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.borderColor = "var(--accent-pink)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                      }}
                    >
                      <div style={{ position: "relative", width: "100%", paddingTop: "120%" }}>
                        <img
                          src={rel.posterUrl}
                          alt={rel.title}
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div style={{ padding: "8px 10px" }}>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            color: "#fff",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {rel.title}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "var(--accent-yellow)" }}>
                          {rel.year || "Classic"}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
