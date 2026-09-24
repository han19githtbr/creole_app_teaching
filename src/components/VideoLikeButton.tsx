"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useSession, signIn } from "next-auth/react";

interface VideoLikeButtonProps {
  videoId: string;
  initialLikesCount: number;
  initialHasLiked: boolean;
}

export function VideoLikeButton({
  videoId,
  initialLikesCount,
  initialHasLiked,
}: VideoLikeButtonProps) {
  const { status } = useSession();
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (status !== "authenticated") {
      signIn("google");
      return;
    }

    if (loading) return;

    // Optimistic UI update
    const nextLiked = !hasLiked;
    const nextCount = nextLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
    setHasLiked(nextLiked);
    setLikesCount(nextCount);
    if (nextLiked) setAnimating(true);

    setLoading(true);
    try {
      const res = await fetch(`/api/videos/${videoId}/like`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Erro ao curtir.");
      const data = await res.json();
      setHasLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch {
      // Revert on error
      setHasLiked(hasLiked);
      setLikesCount(likesCount);
    } finally {
      setLoading(false);
      setTimeout(() => setAnimating(false), 400);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={loading}
      className={`group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
        hasLiked
          ? "bg-[#fef2f2] text-[#e11d48] border border-[#fecdd3] dark:bg-[#4c0519]/30 dark:border-[#9f1239]"
          : "bg-[var(--surface-2)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--border-soft)] hover:text-[var(--text)]"
      }`}
    >
      <Heart
        className={`h-4 w-4 transition-transform duration-200 ${
          hasLiked ? "fill-current text-[#e11d48]" : "text-[var(--text-muted)] group-hover:text-[var(--text)]"
        } ${animating ? "scale-125" : ""}`}
      />
      <span>{hasLiked ? "Curtido" : "Curtir"}</span>
      <span
        className={`ml-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
          hasLiked
            ? "bg-[#f43f5e] text-white"
            : "bg-[var(--border)] text-[var(--text-secondary)]"
        }`}
      >
        {likesCount}
      </span>
    </button>
  );
}
