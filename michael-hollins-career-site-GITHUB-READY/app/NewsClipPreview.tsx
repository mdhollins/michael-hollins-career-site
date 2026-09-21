'use client';

import type Hls from 'hls.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  clampTimedClipPosition,
  millisecondsUntilClipBoundary,
} from './timedClipPlayback';

type NewsClipPreviewProps = {
  streamUrl: string;
  clipStart?: number;
  clipEnd?: number;
  title: string;
  sourceLabel: string;
};

type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

const INITIAL_PLAY_LABEL = 'Play the 23-second News Channel Nebraska interview excerpt';
const HLS_MIME_TYPE = 'application/vnd.apple.mpegurl';

export default function NewsClipPreview({
  streamUrl,
  clipStart = 15,
  clipEnd = 38,
  title,
  sourceLabel,
}: NewsClipPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const boundaryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadAttemptRef = useRef(0);
  const shouldStartRef = useRef(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const clearBoundaryTimer = useCallback(() => {
    if (boundaryTimerRef.current === null) return;

    clearTimeout(boundaryTimerRef.current);
    boundaryTimerRef.current = null;
  }, []);

  const scheduleBoundaryTimer = useCallback(() => {
    clearBoundaryTimer();

    const video = videoRef.current;
    if (!video || video.paused || video.readyState < 2) return;

    const delay = millisecondsUntilClipBoundary(
      video.currentTime,
      clipEnd,
      video.playbackRate,
    );
    boundaryTimerRef.current = setTimeout(() => {
      boundaryTimerRef.current = null;
      const activeVideo = videoRef.current;
      if (!activeVideo || activeVideo.paused) return;

      activeVideo.currentTime = clipStart;
    }, delay);
  }, [clearBoundaryTimer, clipEnd, clipStart]);

  const destroyHls = useCallback(() => {
    hlsRef.current?.destroy();
    hlsRef.current = null;
  }, []);

  const playFromBeginning = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = clipStart;
    try {
      await video.play();
      setStatusMessage('');
      setPlaybackState('playing');
      scheduleBoundaryTimer();
    } catch {
      setStatusMessage('The excerpt is ready. Press play to begin.');
      setPlaybackState('paused');
    }
  }, [clipStart, scheduleBoundaryTimer]);

  const loadClip = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    const loadAttempt = loadAttemptRef.current + 1;
    loadAttemptRef.current = loadAttempt;
    shouldStartRef.current = true;
    destroyHls();
    video.pause();
    video.removeAttribute('src');
    video.load();
    setPlaybackState('loading');
    setStatusMessage('Loading interview excerpt…');

    if (video.canPlayType(HLS_MIME_TYPE)) {
      video.src = streamUrl;
      video.load();
      return;
    }

    try {
      const { default: HlsPlayer } = await import('hls.js');
      if (loadAttempt !== loadAttemptRef.current) return;
      if (!HlsPlayer.isSupported()) {
        throw new Error('HLS playback is not supported in this browser.');
      }

      const hls = new HlsPlayer();
      hlsRef.current = hls;
      hls.on(HlsPlayer.Events.MEDIA_ATTACHED, () => {
        if (loadAttempt === loadAttemptRef.current) {
          hls.loadSource(streamUrl);
        }
      });
      hls.on(HlsPlayer.Events.ERROR, (_event, data) => {
        if (!data.fatal || loadAttempt !== loadAttemptRef.current) return;

        shouldStartRef.current = false;
        hls.destroy();
        if (hlsRef.current === hls) hlsRef.current = null;
        setPlaybackState('error');
        setStatusMessage('The excerpt could not load. You can retry or watch the full story below.');
      });
      hls.attachMedia(video);
    } catch {
      if (loadAttempt !== loadAttemptRef.current) return;
      shouldStartRef.current = false;
      setPlaybackState('error');
      setStatusMessage('The excerpt could not load. You can retry or watch the full story below.');
    }
  }, [destroyHls, streamUrl]);

  useEffect(() => {
    return () => {
      loadAttemptRef.current += 1;
      shouldStartRef.current = false;
      clearBoundaryTimer();
      destroyHls();

      const video = videoRef.current;
      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
    };
  }, [clearBoundaryTimer, destroyHls]);

  useEffect(() => {
    if (playbackState !== 'playing') return;

    const video = videoRef.current;
    if (!video || typeof video.requestVideoFrameCallback !== 'function') return;

    let frameRequest = 0;
    const watchFrame = (_now: DOMHighResTimeStamp, metadata: VideoFrameCallbackMetadata) => {
      if (metadata.mediaTime >= clipEnd - 0.045) {
        video.currentTime = clipStart;
      }
      frameRequest = video.requestVideoFrameCallback(watchFrame);
    };

    frameRequest = video.requestVideoFrameCallback(watchFrame);
    return () => video.cancelVideoFrameCallback(frameRequest);
  }, [clipEnd, clipStart, playbackState]);

  const handleLoadedMetadata = () => {
    if (!shouldStartRef.current) return;
    shouldStartRef.current = false;
    void playFromBeginning();
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextTime = clampTimedClipPosition(video.currentTime, clipStart, clipEnd);
    if (nextTime !== video.currentTime) {
      video.currentTime = nextTime;
    }
  };

  const handlePlaybackToggle = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playbackState === 'playing') {
      clearBoundaryTimer();
      video.pause();
      return;
    }

    void playFromBeginning();
  };

  const handleMediaError = () => {
    if (playbackState === 'idle') return;

    shouldStartRef.current = false;
    destroyHls();
    setPlaybackState('error');
    setStatusMessage('The excerpt could not load. You can retry or watch the full story below.');
  };

  return (
    <div className="newsClipPreview" data-state={playbackState} aria-busy={playbackState === 'loading'}>
      <span className="newsClipSourceLabel">{sourceLabel}</span>
      <video
        ref={videoRef}
        className="newsClipVideo"
        preload="none"
        playsInline
        controls={playbackState !== 'idle' && playbackState !== 'loading'}
        aria-label={title}
        data-stream-src={streamUrl}
        data-clip-start={clipStart}
        data-clip-end={clipEnd}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onError={handleMediaError}
        onPlaying={() => {
          setPlaybackState('playing');
          scheduleBoundaryTimer();
        }}
        onPause={() => {
          clearBoundaryTimer();
          if (playbackState === 'playing') setPlaybackState('paused');
        }}
        onWaiting={clearBoundaryTimer}
        onSeeked={scheduleBoundaryTimer}
        onRateChange={scheduleBoundaryTimer}
        onEnded={() => void playFromBeginning()}
      />

      {playbackState === 'idle' ? (
        <button
          className="newsClipPlayButton"
          type="button"
          aria-label={INITIAL_PLAY_LABEL}
          onClick={() => void loadClip()}
        >
          <span aria-hidden="true">▶</span>
          <span>Play 23-second interview excerpt</span>
        </button>
      ) : null}

      {playbackState === 'loading' ? (
        <p className="newsClipStatus" role="status">{statusMessage}</p>
      ) : null}

      {playbackState === 'playing' || playbackState === 'paused' ? (
        <>
          {playbackState === 'paused' && statusMessage ? (
            <p className="newsClipPausedStatus" role="status">{statusMessage}</p>
          ) : null}
          <button
            className="newsClipControl"
            type="button"
            aria-label={playbackState === 'playing'
              ? 'Pause interview excerpt'
              : statusMessage
                ? 'Play interview excerpt'
                : 'Replay interview excerpt'}
            onClick={handlePlaybackToggle}
          >
            {playbackState === 'playing' ? 'Pause' : statusMessage ? 'Play' : 'Replay'}
          </button>
        </>
      ) : null}

      {playbackState === 'error' ? (
        <div className="newsClipFallback" role="alert">
          <p>{statusMessage}</p>
          <button type="button" onClick={() => void loadClip()}>Retry excerpt</button>
        </div>
      ) : null}
    </div>
  );
}
