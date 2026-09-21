import assert from 'node:assert/strict';
import test from 'node:test';

let clampTimedClipPosition;
let millisecondsUntilClipBoundary;

try {
  ({ clampTimedClipPosition, millisecondsUntilClipBoundary } = await import('../app/timedClipPlayback.ts'));
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

test('schedules a guarded reset before the excerpt out point', () => {
  assert.equal(millisecondsUntilClipBoundary(15, 38, 1), 22_955);
  assert.equal(millisecondsUntilClipBoundary(20, 38, 2), 8_955);
  assert.equal(millisecondsUntilClipBoundary(37.98, 38, 1), 0);
});

test('uses normal playback speed when the reported rate is invalid', () => {
  assert.equal(millisecondsUntilClipBoundary(37, 38, 0), 955);
  assert.equal(millisecondsUntilClipBoundary(37, 38, Number.NaN), 955);
});
