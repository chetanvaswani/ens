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
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Dotted Background */}
      <div className="dot-pattern"></div>
      <ThemeToggle />
      <main className="h-screen w-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl h-full animate-fade-in flex flex-col justify-center gap-12">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="mb-8 text-7xl font-bold md:text-8xl tracking-tight bg-linear-to-br from-[rgb(216,121,67)] to-[rgb(82,117,117)] bg-clip-text text-transparent">
              ENS Lookup
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Discover blockchain data for Ethereum Name Service domains
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch}>
            <div className="w-full">
              {/* Input Container */}
              <div 
                className={`flex items-center overflow-hidden transition-all duration-200 h-15 bg-card rounded-[18px] shadow-lg ${
                  isFocused ? 'ring-2 ring-ring ring-offset-0 shadow-[0_0_0_4px_rgba(216,121,67,0.1)]' : 'border-2 border-border'
                }`}
              >
                <input
                  type="text"
                  value={ensName}
                  onChange={(e) => setEnsName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="vitalik"
                  className="flex-1 h-full bg-transparent outline-none text-2xl font-medium px-10 py-4 text-foreground placeholder:text-muted-foreground"
                  autoFocus
                />
                <button
                  type="submit"
                  className={`flex h-full items-center justify-center px-12 py-4 text-2xl font-bold cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-95 bg-primary text-primary-foreground ${
                    isFocused ? 'border-l-2 border-ring' : 'border-l-2 border-border'
                  }`}
                >
                  .eth
                </button>
              </div>

              {/* Keyboard hint */}
              <div className="mt-3 text-center">
                <span className="text-sm text-muted-foreground opacity-70">
                  Press <kbd className="px-2.5 py-1.5 rounded text-sm font-mono mx-1 bg-muted border border-border">Enter ↵</kbd> or click <span className="font-bold text-primary">.eth</span> to search
                </span>
              </div>
            </div>
          </form>

          {/* Graph Button */}
          <div className="flex justify-center">
            <Link href="/graph">
              <button className="group flex items-center gap-4 px-12 py-6 rounded-2xl font-bold text-lg transition-all duration-300 cursor-pointer hover:scale-105 active:scale-100 overflow-hidden shadow-lg bg-linear-to-br from-[rgb(216,121,67)] to-[rgb(82,117,117)] text-white">
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
