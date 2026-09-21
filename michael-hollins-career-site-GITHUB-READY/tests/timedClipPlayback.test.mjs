import assert from 'node:assert/strict';
import test from 'node:test';

let clampTimedClipPosition;

try {
  ({ clampTimedClipPosition } = await import('../app/timedClipPlayback.ts'));
} catch {
  // The first TDD run intentionally exercises the not-yet-implemented module.
}

test('starts the excerpt at its requested in point', () => {
  assert.equal(clampTimedClipPosition(0, 15, 38), 15);
});

test('leaves playback untouched inside the requested excerpt', () => {
  assert.equal(clampTimedClipPosition(24, 15, 38), 24);
});

test('loops the excerpt when playback reaches its out point', () => {
  assert.equal(clampTimedClipPosition(38, 15, 38), 15);
  assert.equal(clampTimedClipPosition(45, 15, 38), 15);
});
