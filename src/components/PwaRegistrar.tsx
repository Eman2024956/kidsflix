"use client";

import React, { useEffect, useState } from "react";
import { DownloadCloud, X, Sparkles, Share2 } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const PwaRegistrar: React.FC<{ isArabic?: boolean }> = ({ isArabic = false }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("KidsFlix Service Worker registered successfully:", reg.scope);
          })
          .catch((err) => {
            console.warn("KidsFlix Service Worker registration failed:", err);
          });
      });
    }

    // Check if already in standalone (installed) mode
    if (
      typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone)
    ) {
      setTimeout(() => setIsInstalled(true), 0);
      return;
    }

    // Check if iOS device
    const userAgent = typeof window !== "undefined" ? window.navigator.userAgent.toLowerCase() : "";
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    if (isAppleDevice) {
      setTimeout(() => {
        setIsIOS(true);
        const dismissed = localStorage.getItem("kidsflix_pwa_dismissed");
        if (!dismissed) {
          setShowInstallBanner(true);
        }
      }, 0);
    }

    // 2. Capture beforeinstallprompt for Android/Chrome/Edge/Desktop
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const dismissed = localStorage.getItem("kidsflix_pwa_dismissed");
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // App installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    try {
      localStorage.setItem("kidsflix_pwa_dismissed", "true");
    } catch {
      // ignore
    }
  };

  if (isInstalled || !showInstallBanner) return null;

  return (
    <div
      className="glass-panel"
      style={{
        position: "fixed",
        bottom: "80px",
        right: "20px",
        zIndex: 99,
        maxWidth: "360px",
        width: "calc(100% - 40px)",
        padding: "14px 16px",
        borderRadius: "20px",
        background: "rgba(15, 20, 34, 0.96)",
        border: "1px solid rgba(255, 42, 109, 0.4)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 42, 109, 0.3)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        backdropFilter: "blur(20px)",
        animation: "modalFadeIn 0.35s ease forwards",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          overflow: "hidden",
          flexShrink: 0,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
        }}
      >
        <img src="/icon-192.png" alt="KidsFlix" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: "5px" }}>
          <span>{isArabic ? "تطبيق كيدزفلكس" : "KidsFlix App"}</span>
          <Sparkles size={13} color="var(--accent-yellow)" />
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
          {isIOS ? (
            isArabic ? (
              <span>اضغط زر المشاركة <Share2 size={11} style={{ display: "inline" }} /> ثم &quot;إضافة للشاشة الرئيسية&quot;</span>
            ) : (
              <span>Tap Share <Share2 size={11} style={{ display: "inline" }} /> then &quot;Add to Home Screen&quot;</span>
            )
          ) : isArabic ? (
            "ثبّت التطبيق لمشاهدة سريعة بدون إنترنت"
          ) : (
            "Install for instant offline & full screen"
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {!isIOS && deferredPrompt && (
          <button
            onClick={handleInstallClick}
            className="btn-primary"
            style={{
              padding: "8px 14px",
              fontSize: "0.78rem",
              borderRadius: "12px",
              whiteSpace: "nowrap",
            }}
          >
            <DownloadCloud size={14} />
            <span>{isArabic ? "تثبيت" : "Install"}</span>
          </button>
        )}

        <button
          onClick={handleDismiss}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-dim)",
            cursor: "pointer",
            padding: "4px",
          }}
          title="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

