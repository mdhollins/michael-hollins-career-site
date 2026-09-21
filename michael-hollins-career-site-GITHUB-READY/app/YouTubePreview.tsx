'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type YouTubePreviewProps = {
  buttonText?: string;
  duration: string;
  endSeconds?: number;
  label: string;
  loop?: boolean;
  muted?: boolean;
  outlet: string;
  playLabel?: string;
  poster: string;
  startSeconds?: number;
  title: string;
  videoId: string;
};

export default function YouTubePreview({
  buttonText = 'Play interview',
  duration,
  endSeconds,
  label,
  loop = false,
  muted = false,
  outlet,
  playLabel = 'interview',
  poster,
  startSeconds,
  title,
  videoId,
}: YouTubePreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);

  const playerParams = [
    'autoplay=1',
    'rel=0',
    'playsinline=1',
    ...(startSeconds === undefined ? [] : [`start=${startSeconds}`]),
    ...(endSeconds === undefined ? [] : [`end=${endSeconds}`]),
    ...(loop ? ['loop=1', `playlist=${videoId}`] : []),
    ...(muted ? ['mute=1'] : []),
  ].join('&');

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
          src={`https://www.youtube-nocookie.com/embed/${videoId}?${playerParams}`}
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
          aria-label={`Play ${playLabel}: ${label}, ${duration}, ${outlet}`}
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
            <b>{buttonText}</b>
            <small>{duration} · {outlet}</small>
          </span>
        </button>
      )}
    </div>
  );
}
