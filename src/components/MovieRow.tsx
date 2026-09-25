"use client";

import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "@/types/movie";
import { MovieCard } from "./MovieCard";

interface MovieRowProps {
  title: string;
  icon?: string;
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  watchlist: Movie[];
  onToggleWatchlist: (movie: Movie) => void;
  isArabic: boolean;
}

export const MovieRow: React.FC<MovieRowProps> = ({
  title,
  icon,
  movies,
  onPlay,
  watchlist,
  onToggleWatchlist,
  isArabic,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const scrollAmount = 640;
      rowRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section style={{ margin: "28px 0", position: "relative" }}>
      {/* Row Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {icon && <span style={{ fontSize: "1.3rem" }}>{icon}</span>}
          <h2
            className="font-display"
            style={{
              fontSize: "1.35rem",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.3px",
            }}
          >
            {title}
          </h2>
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--accent-yellow)",
              background: "rgba(255, 183, 3, 0.12)",
              padding: "2px 8px",
              borderRadius: "12px",
            }}
          >
            {movies.length}
          </span>
        </div>
      </div>

      {/* Row Container with Navigation Arrows */}
      <div style={{ position: "relative", width: "100%" }}>
        {/* Left Arrow Button */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            style={{
              position: "absolute",
              left: "10px",
              top: "40%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(7, 9, 14, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0,0,0,0.7)",
              backdropFilter: "blur(8px)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1)")}
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Horizontal Carousel */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="row-scroll-container"
          style={{
            paddingLeft: "28px",
            paddingRight: "28px",
          }}
        >
          {movies.map((movie) => {
            const isSaved = watchlist.some((w) => w.identifier === movie.identifier);
            return (
              <MovieCard
                key={movie.identifier}
                movie={movie}
                onPlay={onPlay}
                isInWatchlist={isSaved}
                onToggleWatchlist={onToggleWatchlist}
                isArabic={isArabic}
              />
            );
          })}
        </div>

        {/* Right Arrow Button */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            style={{
              position: "absolute",
              right: "10px",
              top: "40%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(7, 9, 14, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0,0,0,0.7)",
              backdropFilter: "blur(8px)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1)")}
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </section>
  );
};
