// useKeyboardShortcuts Hook - Video player keyboard controls

import { useEffect, useCallback } from 'react';

export default function useKeyboardShortcuts({
  togglePlay,
  stepFrame,
  skip,
  changeSpeed,
  toggleMute,
  toggleFullscreen,
  playbackSpeed,
  enabled = true,
}) {
  const speeds = [0.25, 0.5, 0.75, 1];

  const handleKeyDown = useCallback((e) => {
    // Don't trigger if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    switch (e.key.toLowerCase()) {
      case ' ': // Space - Play/Pause
      case 'k':
        e.preventDefault();
        togglePlay();
        break;

      case 'arrowleft': // Left arrow - Step back 1 frame
        e.preventDefault();
        if (e.shiftKey) {
          skip(-5); // Skip 5 seconds
        } else {
          stepFrame(-1);
        }
        break;

      case 'arrowright': // Right arrow - Step forward 1 frame
        e.preventDefault();
        if (e.shiftKey) {
          skip(5); // Skip 5 seconds
        } else {
          stepFrame(1);
        }
        break;

      case 'j': // J - Skip back 5 seconds
        e.preventDefault();
        skip(-5);
        break;

      case 'l': // L - Skip forward 5 seconds
        e.preventDefault();
        skip(5);
        break;

      case 's': // S - Cycle speed
        e.preventDefault();
        const currentIndex = speeds.indexOf(playbackSpeed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        changeSpeed(speeds[nextIndex]);
        break;

      case 'm': // M - Toggle mute
        e.preventDefault();
        toggleMute();
        break;

      case 'f': // F - Toggle fullscreen
        e.preventDefault();
        toggleFullscreen();
        break;

      case '1':
        e.preventDefault();
        changeSpeed(0.25);
        break;

      case '2':
        e.preventDefault();
        changeSpeed(0.5);
        break;

      case '3':
        e.preventDefault();
        changeSpeed(0.75);
        break;

      case '4':
        e.preventDefault();
        changeSpeed(1);
        break;

      default:
        break;
    }
  }, [togglePlay, stepFrame, skip, changeSpeed, toggleMute, toggleFullscreen, playbackSpeed]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);

  return {
    shortcuts: [
      { key: 'Space/K', action: 'Play/Pause' },
      { key: '←/→', action: 'Step frame' },
      { key: 'Shift + ←/→', action: 'Skip 5s' },
      { key: 'J/L', action: 'Skip 5s' },
      { key: 'S', action: 'Cycle speed' },
      { key: '1-4', action: 'Set speed' },
      { key: 'M', action: 'Mute' },
      { key: 'F', action: 'Fullscreen' },
    ],
  };
}
