// VideoThumbnail Component - Video card for library grid

import Link from 'next/link';
import { PlayIcon, CalendarIcon, LocationIcon, UserIcon } from '../ui/Icons';

export default function VideoThumbnail({
  video,
  onClick,
  selected = false,
  selectable = false,
}) {
  const {
    id,
    title,
    thumbnail_path,
    duration_seconds,
    athlete_name,
    run_date,
    location,
    discipline,
  } = video;

  // Format duration
  const formatDuration = (seconds) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('sv-SE', {
      month: 'short',
      day: 'numeric',
    });
  };

  const CardContent = () => (
    <div
      className={`
        card-hover group overflow-hidden
        ${selected ? 'border-orange-500 shadow-glow' : ''}
        ${selectable ? 'cursor-pointer' : ''}
      `}
      onClick={selectable ? onClick : undefined}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-bg-tertiary -m-4 mb-3 overflow-hidden">
        {thumbnail_path ? (
          <img
            src={thumbnail_path}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-12 h-12 bg-bg-elevated rounded-full flex items-center justify-center">
              <PlayIcon className="w-6 h-6 text-text-muted" />
            </div>
          </div>
        )}

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 rounded text-xs text-white font-mono">
          {formatDuration(duration_seconds)}
        </div>

        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-glow">
            <PlayIcon className="w-7 h-7 text-white ml-0.5" />
          </div>
        </div>

        {/* Selection Indicator */}
        {selectable && (
          <div
            className={`
              absolute top-2 right-2 w-6 h-6 rounded-full border-2
              flex items-center justify-center transition-colors
              ${selected
                ? 'bg-orange-500 border-orange-500'
                : 'border-white/50 bg-black/30'
              }
            `}
          >
            {selected && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="pt-2">
        <h3 className="font-medium text-text-primary truncate mb-2">
          {title || 'Untitled Video'}
        </h3>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
          {athlete_name && (
            <span className="flex items-center gap-1">
              <UserIcon className="w-3 h-3" />
              {athlete_name}
            </span>
          )}
          {run_date && (
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              {formatDate(run_date)}
            </span>
          )}
          {location && (
            <span className="flex items-center gap-1">
              <LocationIcon className="w-3 h-3" />
              {location}
            </span>
          )}
        </div>

        {discipline && (
          <div className="mt-2">
            <span className="badge badge-orange capitalize">
              {discipline.replace('_', ' ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // If selectable, don't wrap in Link
  if (selectable) {
    return <CardContent />;
  }

  // Otherwise, link to watch page
  return (
    <Link href={`/watch/${id}`}>
      <CardContent />
    </Link>
  );
}
