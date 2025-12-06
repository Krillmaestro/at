// Upload Page - Upload new videos (Local Version)

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout, PageContainer, PageHeader } from '../components/layout';
import { UploadZone, UploadProgress, VideoMetadataForm } from '../components/upload';
import Card from '../components/ui/Card';
import { localVideos } from '../lib/localStorage';

export default function UploadPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [error, setError] = useState(null);
  const [athletes, setAthletes] = useState([]);

  // Load athletes from existing videos
  useEffect(() => {
    localVideos.initializeDemoData();
    const existingAthletes = localVideos.getAthletes();
    setAthletes(existingAthletes);
  }, []);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setUploadStatus('idle');
    setError(null);
  };

  const handleSubmit = async (metadata) => {
    if (!selectedFile) {
      setError('Please select a video first');
      return;
    }

    try {
      setUploadStatus('uploading');
      setUploadProgress(0);

      // Create blob URL for the video file
      const videoUrl = URL.createObjectURL(selectedFile);

      // Simulate upload progress (instant for local files)
      for (let i = 0; i <= 100; i += 20) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setUploadProgress(i);
      }

      setUploadStatus('compressing');
      setCompressionProgress(0);

      // Simulate compression progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 80));
        setCompressionProgress(i);
      }

      // Find athlete name from selected ID
      const athleteName = metadata.athlete_id
        ? athletes.find((a) => a.id === metadata.athlete_id)?.full_name || metadata.athlete_id
        : null;

      // Save video to localStorage
      const newVideo = localVideos.add({
        title: metadata.title || selectedFile.name,
        src: videoUrl,
        thumbnail_path: null,
        duration_seconds: null, // Could be extracted from video element
        athlete_name: athleteName,
        run_date: metadata.run_date || new Date().toISOString().split('T')[0],
        location: metadata.location || null,
        discipline: metadata.discipline || null,
        notes: metadata.notes || null,
      });

      setUploadStatus('complete');

      // Redirect to the new video after success
      setTimeout(() => {
        router.push(`/watch/${newVideo.id}`);
      }, 1500);
    } catch (err) {
      setUploadStatus('error');
      setError(err.message || 'Upload failed');
    }
  };

  return (
    <Layout title="Upload Video - AlpineVideo">
      <PageContainer>
        <PageHeader
          title="Upload Video"
          description="Add a new video to your library"
        />

        <div className="max-w-3xl mx-auto space-y-8">
          {/* Upload Zone */}
          <Card>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Select Video
            </h2>
            <UploadZone onFileSelect={handleFileSelect} />
          </Card>

          {/* Progress (shows during upload) */}
          {uploadStatus !== 'idle' && (
            <UploadProgress
              uploadProgress={uploadProgress}
              compressionProgress={compressionProgress}
              status={uploadStatus}
              error={error}
            />
          )}

          {/* Metadata Form */}
          {selectedFile && uploadStatus === 'idle' && (
            <Card>
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                Video Details
              </h2>
              <VideoMetadataForm
                athletes={athletes}
                onSubmit={handleSubmit}
                isLoading={uploadStatus !== 'idle'}
              />
            </Card>
          )}
        </div>
      </PageContainer>
    </Layout>
  );
}
