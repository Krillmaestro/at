// Dashboard Page - Video Library

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import { Layout, PageContainer, PageHeader, Sidebar } from '../components/layout';
import { VideoThumbnail } from '../components/video';
import Button from '../components/ui/Button';
import { UploadIcon, SearchIcon, FilterIcon } from '../components/ui/Icons';

// Demo videos for testing the UI
const DEMO_VIDEOS = [
  {
    id: '1',
    title: 'Slalom Run 1 - Morning Training',
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
    thumbnail_path: null,
    duration_seconds: 21,
    athlete_name: 'Erik Lindqvist',
    run_date: '2024-12-05',
    location: 'Åre',
    discipline: 'slalom',
  },
  {
    id: '5',
    title: 'Downhill Training',
    thumbnail_path: null,
    duration_seconds: 58,
    athlete_name: 'Anna Svensson',
    run_date: '2024-12-02',
    location: 'Trysil',
    discipline: 'downhill',
  },
  {
    id: '6',
    title: 'Giant Slalom - Competition Run',
    thumbnail_path: null,
    duration_seconds: 42,
    athlete_name: 'Marcus Berg',
    run_date: '2024-12-01',
    location: 'Hemsedal',
    discipline: 'giant_slalom',
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState(DEMO_VIDEOS);
  const [filteredVideos, setFilteredVideos] = useState(DEMO_VIDEOS);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAthlete, setSelectedAthlete] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get unique athletes from videos
  const athletes = [...new Set(videos.map((v) => v.athlete_name))].map((name, i) => ({
    id: String(i + 1),
    full_name: name,
  }));

  // Auth check
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session?.user) router.push('/login');
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  // Filter videos
  useEffect(() => {
    let result = videos;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(query) ||
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
