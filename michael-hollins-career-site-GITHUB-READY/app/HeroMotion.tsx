'use client';

import { useEffect, useRef, useState } from 'react';
import { reconcileHeroVideoPlayback } from './heroMotionPlayback';

type HeroMotionProps = {
  alt: string;
  poster: string;
  src: string;
};

export default function HeroMotion({ alt, poster, src }: HeroMotionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => {
      setPrefersReducedMotion(motionPreference.matches);
    };

    updateMotionPreference();
    motionPreference.addEventListener('change', updateMotionPreference);

    return () => {
      motionPreference.removeEventListener('change', updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        reconcileHeroVideoPlayback(video, {
          isVisible: entry.isIntersecting,
          prefersReducedMotion,
        });
      },
      { threshold: 0.01 },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <img className="heroPhoto" src={poster} alt={alt} />;
  }

  return (
    <video
      ref={videoRef}
      className="heroPhoto"
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
