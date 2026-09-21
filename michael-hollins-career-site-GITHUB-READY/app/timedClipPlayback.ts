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
