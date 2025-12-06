// useVideoPlayer Hook - Core video player logic

import { useState, useRef, useCallback, useEffect } from 'react';

export default function useVideoPlayer(videoRef) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);
  const animationRef = useRef(null);

  // Update current time during playback
  const updateTime = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateTime);
    }
  }, [videoRef, isPlaying]);

  // Start/stop time updates based on play state
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateTime);
    } else {
      cancelAnimationFrame(animationRef.current);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, updateTime]);

  // Play/Pause toggle
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(err => {
        console.error('Playback failed:', err);
        setError('Failed to play video');
      });
    }
    setIsPlaying(!isPlaying);
  }, [videoRef, isPlaying]);

  // Seek to specific time
  const seek = useCallback((time) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(time, duration));
    setCurrentTime(videoRef.current.currentTime);
  }, [videoRef, duration]);

  // Seek by percentage (0-100)
  const seekPercent = useCallback((percent) => {
    const time = (percent / 100) * duration;
    seek(time);
  }, [duration, seek]);

  // Step forward/backward by frames
  const stepFrame = useCallback((frames = 1) => {
    if (!videoRef.current) return;
    // Assume 30fps if not specified
    const fps = 30;
    const frameTime = 1 / fps;
    const newTime = currentTime + (frames * frameTime);
    seek(newTime);
  }, [videoRef, currentTime, seek]);

  // Skip forward/backward by seconds
  const skip = useCallback((seconds) => {
    seek(currentTime + seconds);
  }, [currentTime, seek]);

  // Set playback speed
  const changeSpeed = useCallback((speed) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  }, [videoRef]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [videoRef, isMuted]);

  // Set volume
  const changeVolume = useCallback((newVolume) => {
    if (!videoRef.current) return;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  }, [videoRef, isMuted]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error('Fullscreen failed:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Video event handlers
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  }, [videoRef]);

  const handlePlay = useCallback(() => setIsPlaying(true), []);
  const handlePause = useCallback(() => setIsPlaying(false), []);
  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);
  const handleWaiting = useCallback(() => setIsLoading(true), []);
  const handleCanPlay = useCallback(() => setIsLoading(false), []);
  const handleError = useCallback((e) => {
    setError('Failed to load video');
    setIsLoading(false);
    console.error('Video error:', e);
  }, []);

  // Format time helper
  const formatTime = useCallback((time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return {
    // State
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackSpeed,
    isFullscreen,
    isLoading,
    error,
    progress,

    // Refs
    containerRef,

    // Actions
    togglePlay,
    seek,
    seekPercent,
    stepFrame,
    skip,
    changeSpeed,
    toggleMute,
    changeVolume,
    toggleFullscreen,

    // Event handlers (attach to video element)
    videoEventHandlers: {
      onLoadedMetadata: handleLoadedMetadata,
      onPlay: handlePlay,
      onPause: handlePause,
      onEnded: handleEnded,
      onWaiting: handleWaiting,
      onCanPlay: handleCanPlay,
      onError: handleError,
    },

    // Helpers
    formatTime,
  };
}
