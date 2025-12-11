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

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-background overflow-hidden">
      {/* Dotted Background */}
      <div className="dot-pattern"></div>
      
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
      
      <ThemeToggle />
      <main className="px-6 lg:px-8 flex flex-col min-h-screen w-screen items-center justify-start pb-20 overflow-auto pt-10">
        <div className="mx-auto max-w-5xl w-full space-y-8">
          {/* Loading State */}
          {loading && (
            <EthLoader text={`Loading ${ensName}.eth`} />
          )}

          {/* Error Message */}
          {!loading && error && (
            <div className="mb-8 max-w-2xl mx-auto animate-fade-in">
              <div className="rounded-lg px-6 py-4 flex items-center gap-3 bg-destructive text-destructive-foreground">
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
            <div className="space-y-8 animate-fade-in">
              {/* Profile */}
              <div className="bg-card text-card-foreground rounded-[18px] p-6 shadow-md border border-border transition-all duration-300 hover:shadow-lg">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="bg-muted rounded-xl p-2 border border-border inline-block">
                    <img
                      src={ensData.avatar || "/placeholder-avatar.png"}
                      alt={`${ensData.name} avatar`}
                      className="rounded-lg object-cover w-[120px] h-[120px]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-foreground">{ensData.name}</h1>
                    <p className="text-muted-foreground">
                      {ensData.textRecords?.description ||
                        ensData.textRecords?.bio ||
                        ensData.textRecords?.note ||
                        "No description provided."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Addresses + Social + Other Records */}
              <div className="bg-card text-card-foreground rounded-[18px] p-6 shadow-md border border-border transition-all duration-300 hover:shadow-lg space-y-8">
                {/* Addresses */}
                <section className="space-y-3">
                  <h2 className="text-xl font-semibold text-foreground">Addresses</h2>
                  <div className="space-y-3">
                    {ensData.address && (() => {
                      const address = ensData.address;
                      return (
                        <div className="bg-muted rounded-xl p-4 border border-border flex items-center gap-4">
                          <div className="flex-1">
                            <p className="text-xs font-semibold uppercase text-muted-foreground">ETH</p>
                            <p className="font-mono text-sm break-all text-foreground">{address}</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(address)}
                            className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted"
                            aria-label="Copy ETH address"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            Copy
                          </button>
                      </div>
                      );
                    })()}
                    {Object.keys(ensData.multichainAddresses).length > 0 &&
                      Object.entries(ensData.multichainAddresses).map(([chain, address]) => (
                        <div key={chain} className="bg-muted rounded-xl p-4 border border-border flex items-center gap-4">
                          <div className="flex-1">
                            <p className="text-xs font-semibold uppercase text-muted-foreground">{chain}</p>
                            <p className="font-mono text-sm break-all text-foreground">{address}</p>
                    </div>
                          <button
                            onClick={() => copyToClipboard(address)}
                            className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted"
                            aria-label={`Copy ${chain} address`}
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            Copy
                          </button>
                        </div>
                      ))}
                    </div>
                </section>

                {/* Social */}
                <section className="space-y-3">
                  <h2 className="text-xl font-semibold text-foreground">Social</h2>
                  <div className="space-y-3">
                    {Object.entries(ensData.textRecords || {})
                      .filter(([key]) =>
                        [
                          "twitter",
                          "github",
                          "com.twitter",
                          "com.github",
                          "email",
                          "discord",
                          "telegram",
                          "com.discord",
                          "org.telegram",
                          "com.reddit",
                        ].includes(key.toLowerCase())
                      )
                      .map(([key, value]) => {
                        const platform = key.toLowerCase();
                        const labelMap: Record<string, string> = {
                          twitter: "Twitter",
                          "com.twitter": "Twitter",
                          github: "GitHub",
                          "com.github": "GitHub",
                          email: "Email",
                          discord: "Discord",
                          "com.discord": "Discord",
                          telegram: "Telegram",
                          "org.telegram": "Telegram",
                          "com.reddit": "Reddit",
                        };
                        const label = labelMap[platform] || key;

                        const icon = {
                          twitter: (
                            <svg className="w-5 h-5 text-sky-500" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.27 4.27 0 0 0 1.88-2.37 8.3 8.3 0 0 1-2.68 1.02A4.15 4.15 0 0 0 16.1 4c-2.33 0-4.17 1.96-3.86 4.27A11.78 11.78 0 0 1 3.15 5.1a4.13 4.13 0 0 0-.56 2.09c0 1.45.74 2.73 1.87 3.48-.68-.02-1.32-.21-1.88-.52v.05c0 2.03 1.48 3.72 3.44 4.1-.36.1-.75.15-1.15.15-.28 0-.55-.03-.81-.08.55 1.72 2.14 2.97 4.02 3-1.48 1.16-3.35 1.86-5.38 1.86-.35 0-.7-.02-1.04-.06a11.72 11.72 0 0 0 6.29 1.85c7.55 0 11.68-6.47 11.68-12.08 0-.18-.01-.36-.02-.54A8.4 8.4 0 0 0 22.46 6z"/></svg>
                          ),
                          "com.twitter": (
                            <svg className="w-5 h-5 text-sky-500" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.27 4.27 0 0 0 1.88-2.37 8.3 8.3 0 0 1-2.68 1.02A4.15 4.15 0 0 0 16.1 4c-2.33 0-4.17 1.96-3.86 4.27A11.78 11.78 0 0 1 3.15 5.1a4.13 4.13 0 0 0-.56 2.09c0 1.45.74 2.73 1.87 3.48-.68-.02-1.32-.21-1.88-.52v.05c0 2.03 1.48 3.72 3.44 4.1-.36.1-.75.15-1.15.15-.28 0-.55-.03-.81-.08.55 1.72 2.14 2.97 4.02 3-1.48 1.16-3.35 1.86-5.38 1.86-.35 0-.7-.02-1.04-.06a11.72 11.72 0 0 0 6.29 1.85c7.55 0 11.68-6.47 11.68-12.08 0-.18-.01-.36-.02-.54A8.4 8.4 0 0 0 22.46 6z"/></svg>
                          ),
                          github: (
                            <svg className="w-5 h-5 text-foreground" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.42-1.35-1.8-1.35-1.8-1.1-.77.08-.75.08-.75 1.22.09 1.86 1.27 1.86 1.27 1.08 1.9 2.84 1.35 3.53 1.03.11-.8.42-1.35.76-1.66-2.66-.3-5.47-1.36-5.47-6.05 0-1.34.46-2.44 1.24-3.3-.12-.3-.54-1.52.12-3.17 0 0 1-.33 3.3 1.26a11.3 11.3 0 0 1 6 0c2.3-1.59 3.3-1.26 3.3-1.26.66 1.65.24 2.87.12 3.17.78.86 1.24 1.96 1.24 3.3 0 4.7-2.82 5.75-5.5 6.05.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12 12 0 0 0 12 .5Z"/></svg>
                          ),
                          "com.github": (
                            <svg className="w-5 h-5 text-foreground" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.42-1.35-1.8-1.35-1.8-1.1-.77.08-.75.08-.75 1.22.09 1.86 1.27 1.86 1.27 1.08 1.9 2.84 1.35 3.53 1.03.11-.8.42-1.35.76-1.66-2.66-.3-5.47-1.36-5.47-6.05 0-1.34.46-2.44 1.24-3.3-.12-.3-.54-1.52.12-3.17 0 0 1-.33 3.3 1.26a11.3 11.3 0 0 1 6 0c2.3-1.59 3.3-1.26 3.3-1.26.66 1.65.24 2.87.12 3.17.78.86 1.24 1.96 1.24 3.3 0 4.7-2.82 5.75-5.5 6.05.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12 12 0 0 0 12 .5Z"/></svg>
                          ),
                          email: (
                            <svg className="w-5 h-5 text-foreground" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 2v.01L12 13 4 6.01V6h16ZM4 18V8l8 7 8-7v10H4Z"/></svg>
                          ),
                          discord: (
                            <svg className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="currentColor"><path d="M20 0c1.1 0 2 .9 2 2v22l-2.1-1.9-1.2-1.1-1.3-1.2.6 2.3H4c-1.1 0-2-.9-2-2V2c0-1.1.9-2 2-2h16ZM9.5 5c-.1 0-2.6.1-4.1 1.5-.4.4-.7.9-.9 1.5-.2.6-.3 1.3-.3 2.1 0 0 .5 1.3 1.9 3.5 1.4 2.3 2.8 3.4 2.8 3.4h.1l.6-1.4s-.6-.4-.8-.7c-.3-.3-.6-.8-.6-.8l1.4.9.9.6.3.2.3.2c.6.3 1.2.5 1.8.5.6 0 1.2-.2 1.8-.5l.3-.2.3-.2.9-.6 1.4-.9s-.3.5-.6.8c-.2.3-.8.7-.8.7l.6 1.4h.1s1.4-1.1 2.8-3.4C21 11.4 21.5 10 21.5 10c0-.8-.1-1.5-.3-2.1-.2-.6-.5-1.1-.9-1.5C18.8 5.1 16.3 5 16.3 5l-.1.1-.2.2c-1.1-.3-2.1-.4-2.9-.4-.9 0-1.8.1-2.8.4l-.2-.2-.1-.1h-.2Zm.9 6.6c.5 0 .9-.4.9-.9 0-.5-.4-.9-.9-.9-.5 0-.9.4-.9.9 0 .5.4.9.9.9Zm3.2 0c.5 0 .9-.4.9-.9 0-.5-.4-.9-.9-.9-.5 0-.9.4-.9.9 0 .5.4.9.9.9Z"/></svg>
                          ),
                          telegram: (
                            <svg className="w-5 h-5 text-sky-400" viewBox="0 0 24 24" fill="currentColor"><path d="M21.944 2.278a1.5 1.5 0 0 0-1.53-.25L2.54 9.2a1.5 1.5 0 0 0 .14 2.84l4.6 1.53 1.72 5.6a1.5 1.5 0 0 0 2.62.5l2.5-3.15 4.17 3.18a1.5 1.5 0 0 0 2.38-.86l3-14a1.5 1.5 0 0 0-.67-1.68ZM8.37 12.75l9.63-5.92-6.14 7.48a1.5 1.5 0 0 0-.3.6l-.47 2.4-.98-3.18a1.5 1.5 0 0 0-.98-1.02l-.76-.25Z"/></svg>
                          ),
                          "org.telegram": (
                            <svg className="w-5 h-5 text-sky-400" viewBox="0 0 24 24" fill="currentColor"><path d="M21.944 2.278a1.5 1.5 0 0 0-1.53-.25L2.54 9.2a1.5 1.5 0 0 0 .14 2.84l4.6 1.53 1.72 5.6a1.5 1.5 0 0 0 2.62.5l2.5-3.15 4.17 3.18a1.5 1.5 0 0 0 2.38-.86l3-14a1.5 1.5 0 0 0-.67-1.68ZM8.37 12.75l9.63-5.92-6.14 7.48a1.5 1.5 0 0 0-.3.6l-.47 2.4-.98-3.18a1.5 1.5 0 0 0-.98-1.02l-.76-.25Z"/></svg>
                          ),
                          "com.discord": (
                            <svg className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="currentColor"><path d="M20 0c1.1 0 2 .9 2 2v22l-2.1-1.9-1.2-1.1-1.3-1.2.6 2.3H4c-1.1 0-2-.9-2-2V2c0-1.1.9-2 2-2h16ZM9.5 5c-.1 0-2.6.1-4.1 1.5-.4.4-.7.9-.9 1.5-.2.6-.3 1.3-.3 2.1 0 0 .5 1.3 1.9 3.5 1.4 2.3 2.8 3.4 2.8 3.4h.1l.6-1.4s-.6-.4-.8-.7c-.3-.3-.6-.8-.6-.8l1.4.9.9.6.3.2.3.2c.6.3 1.2.5 1.8.5.6 0 1.2-.2 1.8-.5l.3-.2.3-.2.9-.6 1.4-.9s-.3.5-.6.8c-.2.3-.8.7-.8.7l.6 1.4h.1s1.4-1.1 2.8-3.4C21 11.4 21.5 10 21.5 10c0-.8-.1-1.5-.3-2.1-.2-.6-.5-1.1-.9-1.5C18.8 5.1 16.3 5 16.3 5l-.1.1-.2.2c-1.1-.3-2.1-.4-2.9-.4-.9 0-1.8.1-2.8.4l-.2-.2-.1-.1h-.2Zm.9 6.6c.5 0 .9-.4.9-.9 0-.5-.4-.9-.9-.9-.5 0-.9.4-.9.9 0 .5.4.9.9.9Zm3.2 0c.5 0 .9-.4.9-.9 0-.5-.4-.9-.9-.9-.5 0-.9.4-.9.9 0 .5.4.9.9.9Z"/></svg>
                          ),
                          "com.reddit": (
                            <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="currentColor"><path d="M22 11.5c0-1.38-1.12-2.5-2.5-2.5-.66 0-1.26.26-1.71.68-1.03-.66-2.38-1.08-3.9-1.14l.66-3.1 2.16.46a1.5 1.5 0 1 0 .2-.98l-2.72-.58a.5.5 0 0 0-.58.39l-.82 3.86c-1.6.04-3.06.47-4.16 1.14a2.5 2.5 0 0 0-1.71-.68C3.12 9 2 10.12 2 11.5c0 .96.54 1.8 1.32 2.22-.03.18-.05.36-.05.54 0 2.66 3.13 4.74 7.03 4.74s7.03-2.08 7.03-4.74c0-.18-.02-.36-.05-.54A2.48 2.48 0 0 0 22 11.5Zm-13 1a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Zm6.25 3.33c-.58.58-1.7.77-3.25.77-1.55 0-2.67-.19-3.25-.77a.5.5 0 0 1 .7-.7c.33.33 1.16.57 2.55.57 1.39 0 2.22-.24 2.55-.57a.5.5 0 0 1 .7.7ZM16.75 14.5c-.69 0-1.25-.56-1.25-1.25S16.06 12 16.75 12 18 12.56 18 13.25s-.56 1.25-1.25 1.25Z"/></svg>
                          ),
                        }[platform] || (
                          <svg className="w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v16H4z"/></svg>
                        );

                        return (
                          <div key={key} className="bg-muted rounded-xl p-4 border border-border flex items-center gap-3">
                            {icon}
                            <div>
                              <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
                              <p className="text-sm text-foreground break-all">{value}</p>
                            </div>
                          </div>
                        );
                      })}
                </div>
                </section>

                {/* Other Records */}
                <section className="space-y-3">
                  <h2 className="text-xl font-semibold text-foreground">Other Records</h2>
                  <div className="space-y-3">
                    {Object.entries(ensData.textRecords || {})
                      .filter(([key]) => !["description", "bio", "note", "twitter", "github", "email", "discord", "telegram"].includes(key.toLowerCase()))
                      .map(([key, value]) => (
                        <div key={key} className="bg-muted rounded-xl p-4 border border-border">
                          <p className="text-xs font-semibold uppercase text-muted-foreground">{key}</p>
                          <p className="text-sm text-foreground break-all">{value}</p>
                      </div>
                    ))}

                    {ensData.contentHash && (
                      <div className="bg-muted rounded-xl p-4 border border-border">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">Content Hash</p>
                        <p className="text-sm text-foreground break-all">{ensData.contentHash}</p>
                </div>
              )}
                  </div>
                </section>
                </div>

              {/* Empty State */}
              {!ensData.address &&
                !ensData.resolver &&
                Object.keys(ensData.textRecords).length === 0 &&
                Object.keys(ensData.multichainAddresses).length === 0 &&
                !ensData.contentHash && (
                  <div className="bg-card text-card-foreground rounded-[18px] p-6 shadow-md border border-border transition-all duration-300 hover:shadow-lg text-center py-12">
                    <svg 
                      className="mx-auto mb-4 h-16 w-16 text-muted-foreground" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium mb-2 text-foreground">
                      No data found
                    </p>
                    <p className="text-sm text-muted-foreground">
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

