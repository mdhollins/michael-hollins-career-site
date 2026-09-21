'use client';

import { useEffect, useRef, useState } from 'react';

type LazyLoopVideoProps = {
  src: string;
  poster: string;
  label: string;
  className?: string;
};

export default function LazyLoopVideo({ src, poster, label, className = '' }: LazyLoopVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPausedRef = useRef(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!userPausedRef.current) {
            setShouldLoad(true);
            void video.play().catch(() => undefined);
          }
        } else {
          video.pause();
        }
      },
      { rootMargin: '300px 0px', threshold: 0.01 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      userPausedRef.current = true;
      video.pause();
    } else {
      userPausedRef.current = false;
      setShouldLoad(true);
      void video.play().catch(() => undefined);
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        className={className}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        {shouldLoad && <source src={src} type="video/mp4" />}
      </video>
      <button className="loopVideoToggle" type="button" onClick={togglePlayback} aria-label={`${isPlaying ? 'Pause' : 'Play'} ${label} video`}>
        {isPlaying ? 'Pause video' : 'Play video'}
      </button>
    </>
  );
}
