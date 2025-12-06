// Compare Page - Side-by-side video comparison

import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Layout, PageContainer, PageHeader } from '../components/layout';
import { ComparisonView, VideoThumbnail } from '../components/video';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { ChevronDownIcon, VideoIcon } from '../components/ui/Icons';

// Demo videos
const DEMO_VIDEOS = [
  {
    id: '1',
    title: 'Slalom Run 1 - Morning Training',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail_path: null,
    duration_seconds: 23,
    athlete_name: 'Erik Lindqvist',
    run_date: '2024-12-05',
    location: 'Åre',
    discipline: 'slalom',
  },
  {
    id: '2',
    title: 'Giant Slalom - Gate Analysis',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail_path: null,
    duration_seconds: 45,
    athlete_name: 'Anna Svensson',
    run_date: '2024-12-04',
    location: 'Sälen',
    discipline: 'giant_slalom',
  },
  {
    id: '3',
    title: 'Super-G Practice Run',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail_path: null,
    duration_seconds: 31,
    athlete_name: 'Marcus Berg',
    run_date: '2024-12-03',
    location: 'Åre',
    discipline: 'super_g',
  },
  {
    id: '4',
    title: 'Slalom Run 2 - Afternoon Session',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail_path: null,
    duration_seconds: 21,
    athlete_name: 'Erik Lindqvist',
    run_date: '2024-12-05',
    location: 'Åre',
    discipline: 'slalom',
  },
];

export default function ComparePage() {
  const router = useRouter();
  const { video1: video1Id, video2: video2Id } = router.query;

  const [selectedVideo1, setSelectedVideo1] = useState(null);
  const [selectedVideo2, setSelectedVideo2] = useState(null);
  const [isSelectingVideo, setIsSelectingVideo] = useState(null); // 1 or 2
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Set initial videos from URL params
  useMemo(() => {
    if (video1Id) {
      const v = DEMO_VIDEOS.find((v) => v.id === video1Id);
      if (v) setSelectedVideo1(v);
    }
    if (video2Id) {
      const v = DEMO_VIDEOS.find((v) => v.id === video2Id);
      if (v) setSelectedVideo2(v);
    }
  }, [video1Id, video2Id]);

  const openVideoSelector = (slot) => {
    setIsSelectingVideo(slot);
    setShowVideoModal(true);
  };

  const handleSelectVideo = (video) => {
    if (isSelectingVideo === 1) {
      setSelectedVideo1(video);
    } else {
      setSelectedVideo2(video);
    }
    setShowVideoModal(false);
    setIsSelectingVideo(null);
  };

  // Available videos for selection (exclude already selected)
  const availableVideos = DEMO_VIDEOS.filter((v) => {
    if (isSelectingVideo === 1) {
      return v.id !== selectedVideo2?.id;
    }
    return v.id !== selectedVideo1?.id;
  });

  return (
    <Layout title="Compare Videos - AlpineVideo">
      <PageContainer>
        <PageHeader
          title="Compare Videos"
          description="Play two videos side by side with synchronized controls"
        />

        {/* Video Selection Bar */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {/* Video 1 Selector */}
          <button
            onClick={() => openVideoSelector(1)}
            className={`
              flex items-center gap-3 p-4 rounded-xl border-2 border-dashed
              transition-colors text-left
              ${selectedVideo1
                ? 'border-orange-500/50 bg-orange-500/5'
                : 'border-border-color hover:border-orange-500/30'
              }
            `}
          >
            <div className={`
              w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
              ${selectedVideo1 ? 'bg-orange-500' : 'bg-bg-tertiary'}
            `}>
              <VideoIcon className={`w-6 h-6 ${selectedVideo1 ? 'text-white' : 'text-text-muted'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-secondary mb-0.5">Video 1</p>
              <p className="font-medium text-text-primary truncate">
                {selectedVideo1?.title || 'Select a video...'}
              </p>
            </div>
            <ChevronDownIcon className="w-5 h-5 text-text-muted flex-shrink-0" />
          </button>

          {/* Video 2 Selector */}
          <button
            onClick={() => openVideoSelector(2)}
            className={`
              flex items-center gap-3 p-4 rounded-xl border-2 border-dashed
              transition-colors text-left
              ${selectedVideo2
                ? 'border-orange-500/50 bg-orange-500/5'
                : 'border-border-color hover:border-orange-500/30'
              }
            `}
          >
            <div className={`
              w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
              ${selectedVideo2 ? 'bg-orange-500' : 'bg-bg-tertiary'}
            `}>
              <VideoIcon className={`w-6 h-6 ${selectedVideo2 ? 'text-white' : 'text-text-muted'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-secondary mb-0.5">Video 2</p>
              <p className="font-medium text-text-primary truncate">
                {selectedVideo2?.title || 'Select a video...'}
              </p>
            </div>
            <ChevronDownIcon className="w-5 h-5 text-text-muted flex-shrink-0" />
          </button>
        </div>

        {/* Comparison View */}
        {selectedVideo1 || selectedVideo2 ? (
          <ComparisonView
            video1Src={selectedVideo1?.src}
            video2Src={selectedVideo2?.src}
            video1Title={selectedVideo1?.title}
            video2Title={selectedVideo2?.title}
          />
        ) : (
          <div className="text-center py-20 bg-bg-secondary rounded-2xl border border-border-color">
            <div className="w-16 h-16 bg-bg-tertiary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <VideoIcon className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Select videos to compare
            </h3>
            <p className="text-text-secondary">
              Click the selectors above to choose two videos
            </p>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 p-4 bg-bg-secondary rounded-xl border border-border-color">
          <h4 className="text-sm font-medium text-text-primary mb-3">Tips for comparison</h4>
          <ul className="text-sm text-text-secondary space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-orange-500">•</span>
              Use the <strong>Sync</strong> button to link both videos together
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">•</span>
              Set <strong>Sync Points</strong> at the same gate or moment in both videos
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">•</span>
              Use <strong>0.25x speed</strong> for detailed technique analysis
            </li>
          </ul>
        </div>
      </PageContainer>

      {/* Video Selection Modal */}
      <Modal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        title={`Select Video ${isSelectingVideo}`}
        size="xl"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          {availableVideos.map((video) => (
            <VideoThumbnail
              key={video.id}
              video={video}
              selectable
              selected={
                (isSelectingVideo === 1 && selectedVideo1?.id === video.id) ||
                (isSelectingVideo === 2 && selectedVideo2?.id === video.id)
              }
              onClick={() => handleSelectVideo(video)}
            />
          ))}
        </div>
      </Modal>
    </Layout>
  );
}
