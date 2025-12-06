// Dashboard Page - Video Library (Local Version)

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layout, PageContainer, PageHeader, Sidebar } from '../components/layout';
import { VideoThumbnail } from '../components/video';
import Button from '../components/ui/Button';
import { UploadIcon, SearchIcon, FilterIcon } from '../components/ui/Icons';
import { localVideos } from '../lib/localStorage';

export default function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAthlete, setSelectedAthlete] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get unique athletes from videos
  const athletes = [...new Set(videos.map((v) => v.athlete_name).filter(Boolean))].map((name, i) => ({
    id: String(i + 1),
    full_name: name,
  }));

  // Load videos from local storage on mount
  useEffect(() => {
    // Initialize demo data if empty, then load all videos
    localVideos.initializeDemoData();
    const allVideos = localVideos.getAll();
    setVideos(allVideos);
    setFilteredVideos(allVideos);
    setIsLoading(false);
  }, []);

  // Filter videos when filters change
  useEffect(() => {
    let result = videos;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.title?.toLowerCase().includes(query) ||
          v.athlete_name?.toLowerCase().includes(query) ||
          v.location?.toLowerCase().includes(query)
      );
    }

    if (selectedAthlete) {
      result = result.filter((v) => v.athlete_name === selectedAthlete);
    }

    if (selectedDiscipline) {
      result = result.filter((v) => v.discipline === selectedDiscipline);
    }

    setFilteredVideos(result);
  }, [videos, searchQuery, selectedAthlete, selectedDiscipline]);

  if (isLoading) {
    return (
      <Layout title="Dashboard - AlpineVideo">
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Videos - AlpineVideo">
      <div className="flex">
        {/* Sidebar (desktop) */}
        <Sidebar
          athletes={athletes}
          selectedAthlete={selectedAthlete}
          onAthleteChange={setSelectedAthlete}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDiscipline={selectedDiscipline}
          onDisciplineChange={setSelectedDiscipline}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <PageContainer>
            <PageHeader
              title="Video Library"
              description={`${filteredVideos.length} videos`}
              actions={
                <>
                  {/* Mobile filter toggle */}
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="lg:hidden btn-icon text-text-secondary"
                  >
                    <FilterIcon className="w-5 h-5" />
                  </button>

                  <Link href="/upload">
                    <Button variant="primary">
                      <UploadIcon className="w-5 h-5" />
                      Upload Video
                    </Button>
                  </Link>
                </>
              }
            />

            {/* Local Mode Banner */}
            <div className="mb-6 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <p className="text-sm text-orange-400">
                <strong>Local Mode:</strong> Videos are stored in your browser. No server needed!
              </p>
            </div>

            {/* Mobile Filters */}
            {showMobileFilters && (
              <div className="lg:hidden mb-6 p-4 bg-bg-secondary rounded-xl border border-border-color animate-slideUp">
                <div className="space-y-4">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Search videos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input pl-10"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={selectedAthlete}
                      onChange={(e) => setSelectedAthlete(e.target.value)}
                      className="input"
                    >
                      <option value="">All Athletes</option>
                      {athletes.map((a) => (
                        <option key={a.id} value={a.full_name}>
                          {a.full_name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedDiscipline}
                      onChange={(e) => setSelectedDiscipline(e.target.value)}
                      className="input"
                    >
                      <option value="">All Disciplines</option>
                      <option value="slalom">Slalom</option>
                      <option value="giant_slalom">Giant Slalom</option>
                      <option value="super_g">Super-G</option>
                      <option value="downhill">Downhill</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Video Grid */}
            {filteredVideos.length > 0 ? (
              <div className="video-grid">
                {filteredVideos.map((video) => (
                  <VideoThumbnail key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-bg-tertiary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-8 h-8 text-text-muted" />
                </div>
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  No videos found
                </h3>
                <p className="text-text-secondary mb-6">
                  {searchQuery || selectedAthlete || selectedDiscipline
                    ? 'Try adjusting your filters'
                    : 'Upload your first video to get started'}
                </p>
                {!searchQuery && !selectedAthlete && !selectedDiscipline && (
                  <Link href="/upload">
                    <Button variant="primary">
                      <UploadIcon className="w-5 h-5" />
                      Upload Video
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </PageContainer>
        </div>
      </div>
    </Layout>
  );
}
