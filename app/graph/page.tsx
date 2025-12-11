"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import type { ForceGraphProps } from "react-force-graph-2d";
import ThemeToggle from "@/components/ThemeToggle";
import { fetchENSData } from "@/lib/ens";

const ForceGraph2D = dynamic(
  () => import("react-force-graph-2d").then((mod) => mod.default),
  { ssr: false }
) as ComponentType<ForceGraphProps>;

type Edge = {
  id: number;
  user_id: string;
  ens_from: string;
  ens_to: string;
  created_at: string;
};

export default function GraphPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [ensFrom, setEnsFrom] = useState("");
  const [ensTo, setEnsTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatars, setAvatars] = useState<Record<string, string | undefined>>({});
  const [images, setImages] = useState<Record<string, HTMLImageElement | undefined>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storageKey = "ens-user-id";
    let existing = window.localStorage.getItem(storageKey);

    if (!existing) {
      const generated =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `user-${Math.random().toString(36).slice(2)}`;

      window.localStorage.setItem(storageKey, generated);
      existing = generated;
    }

    setUserId(existing);
  }, []);

  useEffect(() => {
    if (!userId) return;
    void fetchEdges();
  }, [userId]);

  const graphData = useMemo(() => {
    const nodesMap = new Map<string, { id: string }>();
    edges.forEach((edge) => {
      nodesMap.set(edge.ens_from, { id: edge.ens_from });
      nodesMap.set(edge.ens_to, { id: edge.ens_to });
    });

    const links = edges.map((edge) => ({
      source: edge.ens_from,
      target: edge.ens_to,
    }));

    return {
      nodes: Array.from(nodesMap.values()),
      links,
    };
  }, [edges]);

  useEffect(() => {
    const loadAvatars = async () => {
      const nodeIds = graphData.nodes.map((n) => n.id as string);
      const missing = nodeIds.filter((id) => avatars[id] === undefined);
      if (!missing.length) return;

      const updates: Record<string, string | undefined> = {};
      for (const id of missing) {
        try {
          const name = id.endsWith(".eth") ? id.slice(0, -4) : id;
          const data = await fetchENSData(name);
          updates[id] = data.avatar;
        } catch (e) {
          updates[id] = undefined;
        }
      }
      setAvatars((prev) => ({ ...prev, ...updates }));
    };

    void loadAvatars();
  }, [graphData.nodes, avatars]);

  useEffect(() => {
    const toLoad = Object.entries(avatars).filter(
      ([id, url]) => url && !images[id]
    );
    if (!toLoad.length) return;

    toLoad.forEach(([id, url]) => {
      if (!url) return;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      img.onload = () =>
        setImages((prev) => ({ ...prev, [id]: img }));
      img.onerror = () =>
        setImages((prev) => ({ ...prev, [id]: undefined }));
    });
  }, [avatars, images]);

  const fetchEdges = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/social?userId=${encodeURIComponent(userId ?? "")}`);
      const json = await res.json();
      if (!json.ok) {
        throw new Error(json.error || "Failed to load graph");
      }
      setEdges(json.edges ?? []);
    } catch (err: any) {
      setError(err?.message || "Failed to load graph");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEdge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (!ensFrom.trim() || !ensTo.trim()) {
      setError("Both ENS names are required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ens_from: ensFrom.trim(),
          ens_to: ensTo.trim(),
        }),
      });
      const json = await res.json();
      if (!json.ok) {
        throw new Error(json.error || "Failed to add connection");
      }
      setEnsFrom("");
      setEnsTo("");
      await fetchEdges();
    } catch (err: any) {
      setError(err?.message || "Failed to add connection");
    } finally {
      setSaving(false);
    }
  };

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

          {/* Form + Graph */}
          <div className="rounded-2xl p-8 bg-card border-2 border-border shadow-xl space-y-6">
            <form onSubmit={handleAddEdge} className="flex flex-col md:flex-row gap-4 items-start md:items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-semibold mb-2 text-foreground">From ENS</label>
                <input
                  type="text"
                  value={ensFrom}
                  onChange={(e) => setEnsFrom(e.target.value)}
                  placeholder="alice.eth"
                  className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground"
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm font-semibold mb-2 text-foreground">To ENS</label>
                <input
                  type="text"
                  value={ensTo}
                  onChange={(e) => setEnsTo(e.target.value)}
                  placeholder="bob.eth"
                  className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground"
                />
              </div>
              <button
                type="submit"
                disabled={saving || !userId}
                className="rounded-lg bg-primary text-primary-foreground px-6 py-3 font-semibold hover:brightness-110 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Add Connection"}
              </button>
            </form>

            {error && (
              <div className="rounded-lg border border-destructive bg-destructive/10 text-destructive px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="rounded-xl border border-border bg-muted min-h-[500px] overflow-hidden">
              {loading ? (
                <div className="h-[500px] flex items-center justify-center text-muted-foreground">
                  Loading graph...
                </div>
              ) : (
                <ForceGraph2D
                  graphData={graphData}
                  nodeLabel={(node: any) => node.id}
                  nodeAutoColorBy="id"
                  linkDirectionalArrowLength={6}
                  linkDirectionalParticles={2}
                  nodeCanvasObject={(node: any, ctx) => {
                    const size = 12;
                    const img = images[node.id];
                    if (img) {
                      ctx.save();
                      ctx.beginPath();
                      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
                      ctx.closePath();
                      ctx.clip();
                      ctx.drawImage(img, node.x - size, node.y - size, size * 2, size * 2);
                      ctx.restore();
                    } else {
                      ctx.beginPath();
                      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
                      ctx.fillStyle = "#d87943";
                      ctx.fill();
                      ctx.font = "10px sans-serif";
                      ctx.fillStyle = "#ffffff";
                      const label = (node.id as string).slice(0, 1).toUpperCase();
                      ctx.fillText(label, node.x - 3, node.y + 3);
                    }
                  }}
                  width={undefined}
                  height={500}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

