// Watch Page - Single video player view (Local Version)

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Layout, PageContainer } from '../../components/layout';
import { VideoPlayer } from '../../components/video';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import {
  CompareIcon,
  CalendarIcon,
  LocationIcon,
  UserIcon,
  ChevronDownIcon,
} from '../../components/ui/Icons';
import { localVideos } from '../../lib/localStorage';

export default function WatchPage() {
  const router = useRouter();
  const { id } = router.query;
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load video from local storage
  useEffect(() => {
    if (!id) return;

    // Initialize demo data if needed
    localVideos.initializeDemoData();

    // Find the video
    const foundVideo = localVideos.getById(id);

    if (foundVideo) {
      setVideo(foundVideo);
    } else {
      // Fallback demo video
      setVideo({
        id,
        title: 'Demo Video',
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        athlete_name: 'Demo Athlete',
        run_date: new Date().toISOString().split('T')[0],
        location: 'Demo Location',
        discipline: 'training',
      });
    }
    setIsLoading(false);
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading || !video) {
    return (
      <Layout title="Loading - AlpineVideo">
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${video.title} - AlpineVideo`}>
      <PageContainer className="max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
          <Link href="/dashboard" className="hover:text-text-primary transition-colors">
            Videos
          </Link>
          <ChevronDownIcon className="w-4 h-4 -rotate-90" />
          <span className="text-text-primary truncate">{video.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <VideoPlayer
              src={video.src}
              title={video.title}
              className="aspect-video"
            />

            {/* Keyboard Shortcuts */}
            <div className="mt-4 p-4 bg-bg-secondary rounded-xl border border-border-color">
              <h4 className="text-sm font-medium text-text-secondary mb-2">
                Keyboard Shortcuts
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-0.5 bg-bg-tertiary rounded text-text-muted">Space</kbd>
                  <span className="text-text-secondary">Play/Pause</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-0.5 bg-bg-tertiary rounded text-text-muted">← →</kbd>
                  <span className="text-text-secondary">Step frame</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-0.5 bg-bg-tertiary rounded text-text-muted">S</kbd>
                  <span className="text-text-secondary">Cycle speed</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-0.5 bg-bg-tertiary rounded text-text-muted">F</kbd>
                  <span className="text-text-secondary">Fullscreen</span>
                </div>
              </div>
            </div>
          </div>

          {/* Video Info Sidebar */}
          <div className="space-y-6">
            {/* Title & Actions */}
            <Card>
              <h1 className="text-xl font-semibold text-text-primary mb-4">
                {video.title}
              </h1>

              <div className="space-y-3 mb-6">
                {video.athlete_name && (
                  <div className="flex items-center gap-2 text-text-secondary">
                    <UserIcon className="w-4 h-4" />
                    <span>{video.athlete_name}</span>
                  </div>
                )}
                {video.run_date && (
                  <div className="flex items-center gap-2 text-text-secondary">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{formatDate(video.run_date)}</span>
                  </div>
                )}
                {video.location && (
                  <div className="flex items-center gap-2 text-text-secondary">
                    <LocationIcon className="w-4 h-4" />
                    <span>{video.location}</span>
                  </div>
                )}
              </div>

              {video.discipline && (
                <div className="mb-6">
                  <span className="badge badge-orange capitalize">
                    {video.discipline.replace('_', ' ')}
                  </span>
                </div>
              )}

              <Link href={`/compare?video1=${video.id}`}>
                <Button variant="secondary" className="w-full">
                  <CompareIcon className="w-5 h-5" />
                  Compare with another video
                </Button>
              </Link>
            </Card>

            {/* Notes */}
            {video.notes && (
              <Card>
                <h3 className="text-sm font-medium text-text-secondary mb-2">
                  Coach Notes
                </h3>
                <p className="text-text-primary">
                  {video.notes}
                </p>
              </Card>
            )}
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
}
