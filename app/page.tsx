"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const [ensName, setEnsName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (ensName.trim()) {
      router.push(`/${ensName.trim()}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e as any);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Dotted Background */}
      <div className="dot-pattern"></div>
      <ThemeToggle />
      <main className="h-screen w-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl h-full animate-fade-in flex flex-col justify-center gap-12">
          {/* Hero Section */}
          <div className="mb-20 text-center">
            <h1 className="mb-8 text-7xl font-bold md:text-8xl gradient-text tracking-tight">
              ENS Lookup
            </h1>
            <p className="text-xl md:text-2xl" style={{ color: "var(--muted-foreground)" }}>
              Discover blockchain data for Ethereum Name Service domains
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch}>
            <div className="w-full">
              {/* Input Container */}
              <div 
                className="flex items-center overflow-hidden transition-all duration-200 h-15"
                style={{ 
                  background: "var(--card)",
                  border: `2px solid ${isFocused ? "var(--ring)" : "var(--border)"}`,
                  borderRadius: "calc(var(--radius) * 1.5)",
                  boxShadow: isFocused 
                    ? "var(--shadow-xl), 0 0 0 4px rgba(216, 121, 67, 0.1)" 
                    : "var(--shadow-lg)"
                }}
              >
                <input
                  type="text"
                  value={ensName}
                  onChange={(e) => setEnsName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="vitalik"
                  className="flex-1 h-full bg-transparent outline-none text-2xl font-medium px-10 py-4"
                  style={{ color: "var(--foreground)" }}
                  autoFocus
                />
                <button
                  type="submit"
                  className="flex h-full items-center justify-center px-12 py-4 text-2xl font-bold cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-95"
                  style={{ 
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                    borderLeft: `2px solid ${isFocused ? "var(--ring)" : "var(--border)"}`
                  }}
                >
                  .eth
                </button>
              </div>

              {/* Keyboard hint */}
              <div className="mt-10 text-center">
                <span className="text-sm" style={{ color: "var(--muted-foreground)", opacity: 0.7 }}>
                  Press <kbd className="px-2.5 py-1.5 rounded text-sm font-mono mx-1" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>Enter ↵</kbd> or click <span className="font-bold" style={{ color: "var(--primary)" }}>.eth</span> to search
                </span>
              </div>

            </div>
          </form>

          {/* Graph Button */}
          <div className="flex justify-center">
            <Link href="/graph">
                <button
                  className="group flex items-center gap-4 px-12 py-6 rounded-2xl font-bold text-lg transition-all duration-300 cursor-pointer hover:scale-105 active:scale-100 overflow-hidden"
                  style={{ 
                    background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                    color: "var(--primary-foreground)",
                    boxShadow: "var(--shadow-lg)"
                  }}
                >
                <svg 
                  width="28" 
                  height="28" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                <span>View ENS Graph</span>
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
