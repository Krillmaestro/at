// VideoPlayer Component - Main video player with custom controls

import { useRef, useState } from 'react';
import useVideoPlayer from '../../hooks/useVideoPlayer';
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';
import {
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  FullscreenIcon,
  ExitFullscreenIcon,
  VolumeIcon,
  VolumeMuteIcon,
} from '../ui/Icons';

const SPEEDS = [0.25, 0.5, 0.75, 1];

export default function VideoPlayer({
  src,
  poster,
  title,
  onTimeUpdate,
  externalControls, // For comparison mode - receives external state
  className = '',
}) {
  const videoRef = useRef(null);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimeout = useRef(null);

  const player = useVideoPlayer(videoRef);
  const {
    isPlaying,
    currentTime,
    duration,
    isMuted,
    playbackSpeed,
    isFullscreen,
    isLoading,
    error,
    progress,
    containerRef,
    togglePlay,
    seekPercent,
    stepFrame,
    skip,
    changeSpeed,
    toggleMute,
    toggleFullscreen,
    videoEventHandlers,
    formatTime,
  } = player;

  // Keyboard shortcuts
  useKeyboardShortcuts({
    togglePlay,
    stepFrame,
    skip,
    changeSpeed,
    toggleMute,
    toggleFullscreen,
    playbackSpeed,
    enabled: !externalControls,
  });

  // Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(hideControlsTimeout.current);
    if (isPlaying) {
      hideControlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  // Notify parent of time changes
  const handleTimeUpdate = () => {
    if (onTimeUpdate && videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  // Handle scrubber change
  const handleScrubberChange = (e) => {
    const percent = parseFloat(e.target.value);
    seekPercent(percent);
  };

  // Handle click on progress bar
  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    seekPercent(percent);
  };

  if (error) {
    return (
      <div className={`video-container aspect-video flex items-center justify-center ${className}`}>
        <div className="text-center">
          <p className="text-error mb-2">Failed to load video</p>
          <p className="text-text-muted text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`video-container group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain bg-black"
        playsInline
        onTimeUpdate={handleTimeUpdate}
        {...videoEventHandlers}
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Center Play Button (when paused) */}
      {!isPlaying && !isLoading && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
        >
          <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center shadow-glow-lg">
            <PlayIcon className="w-10 h-10 text-white ml-1" />
          </div>
        </button>
      )}

      {/* Controls Overlay */}
      <div
        className={`
          video-controls transition-opacity duration-300
          ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {/* Progress Bar */}
        <div
          className="relative h-1 bg-bg-elevated rounded-full mb-4 cursor-pointer group/progress"
          onClick={handleProgressClick}
        >
          {/* Progress */}
          <div
            className="h-full bg-orange-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
          {/* Scrubber Input (invisible, for better UX) */}
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleScrubberChange}
            className="video-scrubber absolute inset-0 w-full opacity-0 cursor-pointer"
          />
          {/* Thumb indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity pointer-events-none"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="btn-icon text-white"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? (
                <PauseIcon className="w-6 h-6" />
              ) : (
                <PlayIcon className="w-6 h-6" />
              )}
            </button>

            {/* Frame Step Back */}
            <button
              onClick={() => stepFrame(-1)}
              className="btn-icon text-white"
              title="Previous frame (←)"
            >
              <SkipBackIcon className="w-5 h-5" />
            </button>

            {/* Frame Step Forward */}
            <button
              onClick={() => stepFrame(1)}
              className="btn-icon text-white"
              title="Next frame (→)"
            >
              <SkipForwardIcon className="w-5 h-5" />
            </button>

            {/* Volume */}
            <button
              onClick={toggleMute}
              className="btn-icon text-white"
              title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
            >
              {isMuted ? (
                <VolumeMuteIcon className="w-5 h-5" />
              ) : (
                <VolumeIcon className="w-5 h-5" />
              )}
            </button>

            {/* Time Display */}
            <span className="text-sm text-white ml-2 font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Speed Controls */}
            <div className="flex items-center gap-1 mr-2">
              {SPEEDS.map((speed) => (
                <button
                  key={speed}
                  onClick={() => changeSpeed(speed)}
                  className={`speed-btn ${
                    playbackSpeed === speed
                      ? 'speed-btn-active'
                      : 'speed-btn-inactive'
                  }`}
                  title={`${speed}x speed`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="btn-icon text-white"
              title={isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'}
            >
              {isFullscreen ? (
                <ExitFullscreenIcon className="w-5 h-5" />
              ) : (
                <FullscreenIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Title (if provided) */}
        {title && (
          <div className="absolute top-4 left-4 right-4">
            <h3 className="text-white font-medium truncate">{title}</h3>
          </div>
        )}
      </div>
    </div>
  );
}
