'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type YouTubePreviewProps = {
  duration: string;
  label: string;
  outlet: string;
  poster: string;
  title: string;
  videoId: string;
};

export default function YouTubePreview({
  duration,
  label,
  outlet,
  poster,
  title,
  videoId,
}: YouTubePreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isPlaying) {
      playerRef.current?.focus();
    }
  }, [isPlaying]);

  return (
    <div className="youtubePreview">
      {isPlaying ? (
        <iframe
          ref={playerRef}
          className="youtubePreviewPlayer"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          tabIndex={0}
        />
      ) : (
        <button
          className="youtubePreviewButton"
          type="button"
          aria-label={`Play interview: ${label}, ${duration}, ${outlet}`}
          onClick={() => setIsPlaying(true)}
        >
          <Image
            src={poster}
            alt=""
            fill
            sizes="(max-width: 580px) calc(100vw - 48px), (max-width: 850px) calc(100vw - 80px), 590px"
          />
          <span className="youtubePreviewShade" aria-hidden="true" />
          <span className="youtubePreviewPlay" aria-hidden="true">▶</span>
          <span className="youtubePreviewLabel">
            <b>Play interview</b>
            <small>{duration} · {outlet}</small>
          </span>
        </button>
      )}
    </div>
  );
}
