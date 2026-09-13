type HeroVideo = Pick<HTMLVideoElement, 'pause' | 'play'>;

type HeroMotionState = {
  isVisible: boolean;
  prefersReducedMotion: boolean;
};

export function reconcileHeroVideoPlayback(
  video: HeroVideo,
  { isVisible, prefersReducedMotion }: HeroMotionState,
) {
  if (prefersReducedMotion || !isVisible) {
    video.pause();
    return;
  }

  void video.play().catch(() => undefined);
}
