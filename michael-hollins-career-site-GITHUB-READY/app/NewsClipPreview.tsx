'use client';

import type Hls from 'hls.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { clampTimedClipPosition } from './timedClipPlayback';

type NewsClipPreviewProps = {
  streamUrl: string;
  clipStart?: number;
  clipEnd?: number;
  title: string;
};

type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

const INITIAL_PLAY_LABEL = 'Play the 23-second News Channel Nebraska interview excerpt';
const HLS_MIME_TYPE = 'application/vnd.apple.mpegurl';

export default function NewsClipPreview({
  streamUrl,
  clipStart = 15,
  clipEnd = 38,
  title,
}: NewsClipPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const loadAttemptRef = useRef(0);
  const shouldStartRef = useRef(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [statusMessage, setStatusMessage] = useState('');

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
    } catch {
      setStatusMessage('The excerpt is ready. Press replay to begin.');
      setPlaybackState('paused');
    }
  }, [clipStart]);

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
      destroyHls();

      const video = videoRef.current;
      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
    };
  }, [destroyHls]);

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
        onPlaying={() => setPlaybackState('playing')}
        onPause={() => {
          if (playbackState === 'playing') setPlaybackState('paused');
        }}
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
        <button
          className="newsClipControl"
          type="button"
          aria-label={playbackState === 'playing' ? 'Pause interview excerpt' : 'Replay interview excerpt'}
          onClick={handlePlaybackToggle}
        >
          {playbackState === 'playing' ? 'Pause' : 'Replay'}
        </button>
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
