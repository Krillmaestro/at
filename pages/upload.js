// Upload Page - Upload new videos

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout, PageContainer, PageHeader } from '../components/layout';
import { UploadZone, UploadProgress, VideoMetadataForm } from '../components/upload';
import Card from '../components/ui/Card';

export default function UploadPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [error, setError] = useState(null);

  // Mock athletes for demo
  const athletes = [
    { id: '1', full_name: 'Erik Lindqvist' },
    { id: '2', full_name: 'Anna Svensson' },
    { id: '3', full_name: 'Marcus Berg' },
  ];

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

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setUploadProgress(i);
      }

      setUploadStatus('compressing');
      setCompressionProgress(0);

      // Simulate compression progress
      for (let i = 0; i <= 100; i += 5) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        setCompressionProgress(i);
      }

      setUploadStatus('complete');

      // Redirect to dashboard after success
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
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
