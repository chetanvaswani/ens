"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchENSData, ENSData } from "@/lib/ens";
import ThemeToggle from "@/components/ThemeToggle";
import EthLoader from "@/components/EthLoader";

export default function ENSPage() {
  const params = useParams();
  const [ensData, setEnsData] = useState<ENSData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ensName = params.name as string;

  useEffect(() => {
    if (ensName) {
      loadENSData();
    }
  }, [ensName]);

  const loadENSData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchENSData(ensName);
      setEnsData(data);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch ENS data. Please check the name and try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen" style={{ background: "var(--background)" }}>
      {/* Dotted Background */}
      <div className="dot-pattern"></div>
      
      {/* Back Button */}
      <div className="pt-6 pl-6">
        <Link href="/">
          <button
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer hover:scale-105 animate-fade-in"
            style={{ 
              background: "var(--card)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-md)"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back
          </button>
        </Link>
      </div>
      
      <ThemeToggle />
      <main className="px-6 lg:px-8 flex flex-col h-screen w-screen justify-center items-center">
        <div className="mx-auto max-w-5xl w-full">
          {/* Loading State */}
          {loading && (
            <EthLoader text={`Loading ${ensName}.eth`} />
          )}

          {/* Error Message */}
          {!loading && error && (
            <div className="mb-8 max-w-2xl mx-auto animate-fade-in">
              <div 
                className="rounded-lg px-6 py-4 flex items-center gap-3" 
                style={{ 
                  background: "var(--destructive)",
                  color: "var(--destructive-foreground)"
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className="font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {!loading && ensData && (
            <div className="space-y-6 animate-fade-in">
              {/* Basic Info Card */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                    Basic Information
                  </h2>
                  <span className="badge">Verified</span>
                </div>
                <div className="space-y-4">
                  <div className="info-box">
                    <span className="block text-xs font-semibold uppercase mb-2" style={{ color: "var(--muted-foreground)" }}>
                      ENS Name
                    </span>
                    <p className="text-lg font-mono font-semibold" style={{ color: "var(--foreground)" }}>
                      {ensData.name}
                    </p>
                  </div>
                  {ensData.address && (
                    <div className="info-box">
                      <span className="block text-xs font-semibold uppercase mb-2" style={{ color: "var(--muted-foreground)" }}>
                        Ethereum Address
                      </span>
                      <p className="font-mono text-sm break-all" style={{ color: "var(--foreground)" }}>
                        {ensData.address}
                      </p>
                    </div>
                  )}
                  {ensData.owner && (
                    <div className="info-box">
                      <span className="block text-xs font-semibold uppercase mb-2" style={{ color: "var(--muted-foreground)" }}>
                        Owner
                      </span>
                      <p className="font-mono text-sm break-all" style={{ color: "var(--foreground)" }}>
                        {ensData.owner}
                      </p>
                    </div>
                  )}
                  {ensData.resolver && (
                    <div className="info-box">
                      <span className="block text-xs font-semibold uppercase mb-2" style={{ color: "var(--muted-foreground)" }}>
                        Resolver
                      </span>
                      <p className="font-mono text-sm break-all" style={{ color: "var(--foreground)" }}>
                        {ensData.resolver}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Avatar & Profile */}
              {(ensData.avatar || Object.keys(ensData.textRecords).length > 0) && (
                <div className="card">
                  <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
                    Profile
                  </h2>
                  {ensData.avatar && (
                    <div className="mb-6 flex justify-center">
                      <div className="info-box inline-block p-2">
                        <img
                          src={ensData.avatar}
                          alt={`${ensData.name} avatar`}
                          className="rounded-lg object-cover"
                          style={{ width: "120px", height: "120px" }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {Object.keys(ensData.textRecords).length > 0 && (
                    <div className="space-y-3">
                      {Object.entries(ensData.textRecords).map(([key, value]) => (
                        <div key={key} className="info-box">
                          <span className="block text-xs font-semibold uppercase mb-2" style={{ color: "var(--muted-foreground)" }}>
                            {key}
                          </span>
                          <p className="text-sm break-all" style={{ color: "var(--foreground)" }}>
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Multichain Addresses */}
              {Object.keys(ensData.multichainAddresses).length > 0 && (
                <div className="card">
                  <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
                    Multichain Addresses
                  </h2>
                  <div className="space-y-3">
                    {Object.entries(ensData.multichainAddresses).map(([chain, address]) => (
                      <div key={chain} className="info-box">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold uppercase" style={{ color: "var(--muted-foreground)" }}>
                            {chain}
                          </span>
                          <span className="badge text-xs">{chain}</span>
                        </div>
                        <p className="font-mono text-sm break-all" style={{ color: "var(--foreground)" }}>
                          {address}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Hash */}
              {ensData.contentHash && (
                <div className="card">
                  <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
                    Content Hash
                  </h2>
                  <div className="info-box">
                    <p className="font-mono text-sm break-all" style={{ color: "var(--foreground)" }}>
                      {ensData.contentHash}
                    </p>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!ensData.address &&
                !ensData.resolver &&
                Object.keys(ensData.textRecords).length === 0 &&
                Object.keys(ensData.multichainAddresses).length === 0 &&
                !ensData.contentHash && (
                  <div className="card text-center py-12">
                    <svg 
                      className="mx-auto mb-4 h-16 w-16" 
                      style={{ color: "var(--muted-foreground)" }} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium mb-2" style={{ color: "var(--foreground)" }}>
                      No data found
                    </p>
                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                      This ENS name might not be registered or has no records set
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

