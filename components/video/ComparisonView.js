// ComparisonView Component - Side-by-side video comparison

import { useRef, useState, useCallback, useEffect } from 'react';
import {
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  LinkIcon,
} from '../ui/Icons';

const SPEEDS = [0.25, 0.5, 0.75, 1];

export default function ComparisonView({
  video1Src,
  video2Src,
  video1Title,
  video2Title,
}) {
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isSynced, setIsSynced] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [syncOffset, setSyncOffset] = useState(0); // Offset for video 2

  // Update time display
  useEffect(() => {
    const interval = setInterval(() => {
      if (video1Ref.current) {
        setCurrentTime(video1Ref.current.currentTime);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Set duration when videos load
  const handleLoadedMetadata = (videoNum) => (e) => {
    if (videoNum === 1) {
      setDuration(e.target.duration);
    }
  };

  // Play/Pause both videos
  const togglePlay = useCallback(() => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;

    if (isPlaying) {
      v1?.pause();
      v2?.pause();
    } else {
      v1?.play();
      v2?.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Seek both videos
  const seek = useCallback((time) => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;

    if (v1) v1.currentTime = Math.max(0, time);
    if (v2 && isSynced) {
      v2.currentTime = Math.max(0, time + syncOffset);
    }
    setCurrentTime(time);
  }, [isSynced, syncOffset]);

  // Seek by percentage
  const seekPercent = useCallback((percent) => {
    const time = (percent / 100) * duration;
    seek(time);
  }, [duration, seek]);

  // Step frames
  const stepFrame = useCallback((frames) => {
    const frameTime = 1 / 30; // Assume 30fps
    seek(currentTime + frames * frameTime);
  }, [currentTime, seek]);

  // Change speed for both videos
  const changeSpeed = useCallback((speed) => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;

    if (v1) v1.playbackRate = speed;
    if (v2) v2.playbackRate = speed;
    setPlaybackSpeed(speed);
  }, []);

  // Set sync point for video 2
  const setSyncPoint = useCallback(() => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;

    if (v1 && v2) {
      const offset = v2.currentTime - v1.currentTime;
      setSyncOffset(offset);
    }
  }, []);

  // Handle scrubber change
  const handleScrubberChange = (e) => {
    seekPercent(parseFloat(e.target.value));
  };

  // Keep videos in sync during playback
  useEffect(() => {
    if (!isSynced || !isPlaying) return;

    const syncVideos = () => {
      const v1 = video1Ref.current;
      const v2 = video2Ref.current;

      if (v1 && v2) {
        const targetTime = v1.currentTime + syncOffset;
        const diff = Math.abs(v2.currentTime - targetTime);

        // Re-sync if drift is too large
        if (diff > 0.1) {
          v2.currentTime = targetTime;
        }
      }
    };

    const interval = setInterval(syncVideos, 500);
    return () => clearInterval(interval);
  }, [isSynced, isPlaying, syncOffset]);

  // Format time
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-bg-secondary rounded-2xl border border-border-color overflow-hidden">
      {/* Videos Grid */}
      <div className="comparison-grid p-4 pb-0">
        {/* Video 1 */}
        <div className="relative">
          {video1Title && (
            <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-black/70 rounded text-sm text-white">
              {video1Title}
            </div>
          )}
          <video
            ref={video1Ref}
            src={video1Src}
            className="w-full aspect-video bg-black rounded-lg object-contain"
            playsInline
            onLoadedMetadata={handleLoadedMetadata(1)}
          />
        </div>

        {/* Video 2 */}
        <div className="relative">
          {video2Title && (
            <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-black/70 rounded text-sm text-white">
              {video2Title}
            </div>
          )}
          {video2Src ? (
            <video
              ref={video2Ref}
              src={video2Src}
              className="w-full aspect-video bg-black rounded-lg object-contain"
              playsInline
              onLoadedMetadata={handleLoadedMetadata(2)}
            />
          ) : (
            <div className="w-full aspect-video bg-bg-tertiary rounded-lg flex items-center justify-center">
              <p className="text-text-muted">Select a video to compare</p>
            </div>
          )}
        </div>
      </div>

      {/* Unified Controls */}
      <div className="p-4">
        {/* Progress Bar */}
        <div className="relative h-1.5 bg-bg-elevated rounded-full mb-4 cursor-pointer group">
          <div
            className="h-full bg-orange-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleScrubberChange}
            className="video-scrubber absolute inset-0 w-full opacity-0 cursor-pointer"
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ left: `calc(${progress}% - 8px)` }}
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="btn-icon text-text-primary hover:text-orange-500"
              title="Play/Pause"
            >
              {isPlaying ? (
                <PauseIcon className="w-6 h-6" />
              ) : (
                <PlayIcon className="w-6 h-6" />
              )}
            </button>

            <button
              onClick={() => stepFrame(-1)}
              className="btn-icon text-text-secondary hover:text-text-primary"
              title="Previous frame"
            >
              <SkipBackIcon className="w-5 h-5" />
            </button>

            <button
              onClick={() => stepFrame(1)}
              className="btn-icon text-text-secondary hover:text-text-primary"
              title="Next frame"
            >
              <SkipForwardIcon className="w-5 h-5" />
            </button>

            <span className="text-sm text-text-secondary font-mono ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Center - Sync Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSynced(!isSynced)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
                transition-colors
                ${isSynced
                  ? 'bg-orange-500 text-white'
                  : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
                }
              `}
              title="Toggle sync"
            >
              <LinkIcon className="w-4 h-4" />
              {isSynced ? 'Synced' : 'Independent'}
            </button>

            {isSynced && (
              <button
                onClick={setSyncPoint}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors"
                title="Set current position as sync point"
              >
                Set Sync Point
              </button>
            )}
          </div>

          {/* Right - Speed Controls */}
          <div className="flex items-center gap-1">
            {SPEEDS.map((speed) => (
              <button
                key={speed}
                onClick={() => changeSpeed(speed)}
                className={`speed-btn ${
                  playbackSpeed === speed
                    ? 'speed-btn-active'
                    : 'speed-btn-inactive'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
