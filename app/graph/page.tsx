"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function GraphPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Dotted Background */}
      <div className="dot-pattern"></div>
      
      <ThemeToggle />
      
      {/* Back Button */}
      <div className="pt-6 pl-6 z-10">
        <Link href="/">
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer hover:scale-105 animate-fade-in bg-card text-foreground border border-border shadow-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back
          </button>
        </Link>
      </div>

      <main className="flex-1 flex items-center justify-center px-6 lg:px-8">
        <div className="w-full max-w-6xl animate-fade-in">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-6 text-7xl font-bold md:text-8xl tracking-tight bg-linear-to-br from-[rgb(216,121,67)] to-[rgb(82,117,117)] bg-clip-text text-transparent">
              ENS Graph
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Visualize ENS domain relationships and connections
            </p>
          </div>

          {/* Graph Container - Placeholder */}
          <div className="rounded-2xl p-12 min-h-[600px] flex items-center justify-center bg-card border-2 border-border shadow-xl">
            <div className="text-center">
              <svg 
                className="mx-auto mb-6 text-primary" 
                width="80" 
                height="80" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              <h2 className="text-3xl font-bold mb-4 text-foreground">
                Graph Visualization Coming Soon
              </h2>
              <p className="text-lg text-muted-foreground">
                This feature will display ENS domain relationships in an interactive graph
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

