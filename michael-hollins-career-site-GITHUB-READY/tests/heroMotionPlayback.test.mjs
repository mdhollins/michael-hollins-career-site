import assert from 'node:assert/strict';
import test from 'node:test';

let reconcileHeroVideoPlayback;

try {
  ({ reconcileHeroVideoPlayback } = await import('../app/heroMotionPlayback.ts'));
} catch {
  // The first TDD run intentionally exercises the not-yet-implemented module.
}

function recordingVideo() {
  const events = [];

  return {
    events,
    video: {
      pause() {
        events.push('pause');
      },
      play() {
        events.push('play');
        return Promise.resolve();
      },
    },
  };
}

test('plays the hero video when motion is allowed and the hero is visible', () => {
  const { video, events } = recordingVideo();

  reconcileHeroVideoPlayback(video, {
    isVisible: true,
    prefersReducedMotion: false,
  });

  assert.deepEqual(events, ['play']);
});

test('pauses the hero video when the hero leaves the viewport', () => {
  const { video, events } = recordingVideo();

  reconcileHeroVideoPlayback(video, {
    isVisible: false,
    prefersReducedMotion: false,
  });

  assert.deepEqual(events, ['pause']);
});

test('pauses the hero video when reduced motion is preferred', () => {
  const { video, events } = recordingVideo();

  reconcileHeroVideoPlayback(video, {
    isVisible: true,
    prefersReducedMotion: true,
  });

  assert.deepEqual(events, ['pause']);
});
