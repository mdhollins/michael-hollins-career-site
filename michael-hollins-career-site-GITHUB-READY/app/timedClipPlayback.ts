export function clampTimedClipPosition(
  currentTime: number,
  clipStart: number,
  clipEnd: number,
) {
  if (currentTime < clipStart || currentTime >= clipEnd) {
    return clipStart;
  }

  return currentTime;
}

const CLIP_BOUNDARY_GUARD_MS = 45;

export function millisecondsUntilClipBoundary(
  currentTime: number,
  clipEnd: number,
  playbackRate: number,
) {
  const safePlaybackRate = Number.isFinite(playbackRate) && playbackRate > 0
    ? playbackRate
    : 1;
  const remainingMilliseconds = ((clipEnd - currentTime) / safePlaybackRate) * 1_000;

  return Math.max(0, Math.round(remainingMilliseconds - CLIP_BOUNDARY_GUARD_MS));
}
