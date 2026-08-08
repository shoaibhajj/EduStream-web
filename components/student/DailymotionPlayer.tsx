"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  videoId: string;
  replayLabel: string;
  endedLabel: string;
  durationSeconds?: number | null;
};

export function DailymotionPlayer({
  videoId,
  replayLabel,
  endedLabel,
  durationSeconds,
}: Props) {
  const playerId = process.env.NEXT_PUBLIC_DAILYMOTION_PLAYER_ID || "x1lwfu";
  const [ended, setEnded] = useState(false);
  const [instanceKey, setInstanceKey] = useState(0);
  const [started, setStarted] = useState(false);
  const timerRef = useRef<number | null>(null);

  const src = useMemo(() => {
    const params = new URLSearchParams({
      video: videoId,
      autoplay: "0",
      "endscreen-enable": "false",
    });

    return `https://geo.dailymotion.com/player/${playerId}.html?${params.toString()}`;
  }, [playerId, videoId]);

  useEffect(() => {
    if (
      !started ||
      typeof durationSeconds !== "number" ||
      durationSeconds <= 0
    ) {
      return;
    }

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    const hideBeforeEndMs = Math.max(0, durationSeconds * 1000 - 1200);

    timerRef.current = window.setTimeout(() => {
      setEnded(true);
    }, hideBeforeEndMs);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [started, durationSeconds, instanceKey]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const handleReplay = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setEnded(false);
    setStarted(false);
    setInstanceKey((prev) => prev + 1);
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      {!ended && (
        <iframe
          key={`${videoId}-${instanceKey}`}
          src={src}
          title="Dailymotion player"
          allow="autoplay; fullscreen; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
          onLoad={() => {
            setStarted(true);
          }}
        />
      )}

      {ended && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-black/85">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-white/80">{endedLabel}</p>
            <Button type="button" onClick={handleReplay}>
              {replayLabel}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
