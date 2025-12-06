// UploadZone Component - Drag and drop video upload

import { useState, useRef, useCallback } from 'react';
import { UploadIcon, VideoIcon, CloseIcon } from '../ui/Icons';
import Button from '../ui/Button';

export default function UploadZone({
  onFileSelect,
  accept = 'video/*',
  maxSize = 500 * 1024 * 1024, // 500MB default
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  // Format file size
  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Validate file
  const validateFile = (file) => {
    if (!file.type.startsWith('video/')) {
      return 'Please select a video file';
    }
    if (file.size > maxSize) {
      return `File too large. Maximum size is ${formatSize(maxSize)}`;
    }
    return null;
  };

  // Handle file selection
  const handleFile = useCallback((file) => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreview(url);

    // Notify parent
    if (onFileSelect) {
      onFileSelect(file);
    }
  }, [onFileSelect, maxSize]);

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  // Open file picker
  const openFilePicker = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {!selectedFile ? (
        // Drop Zone
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFilePicker}
          className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
            transition-all duration-200
            ${isDragging
              ? 'border-orange-500 bg-orange-500/10'
              : 'border-border-color hover:border-orange-500/50 hover:bg-bg-tertiary'
            }
          `}
        >
          <div className="flex flex-col items-center">
            <div
              className={`
                w-16 h-16 rounded-2xl flex items-center justify-center mb-4
                transition-colors
                ${isDragging ? 'bg-orange-500 text-white' : 'bg-bg-tertiary text-orange-500'}
              `}
            >
              <UploadIcon className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {isDragging ? 'Drop your video here' : 'Drag & drop your video'}
            </h3>

            <p className="text-text-secondary mb-4">
              or click to browse your files
            </p>

            <p className="text-sm text-text-muted">
              Supports MP4, MOV, AVI, WebM (max {formatSize(maxSize)})
            </p>
          </div>
        </div>
      ) : (
        // File Preview
        <div className="border border-border-color rounded-2xl overflow-hidden">
          {/* Video Preview */}
          <div className="relative aspect-video bg-black">
            <video
              src={preview}
              className="w-full h-full object-contain"
              controls={false}
            />

            {/* Remove Button */}
            <button
              onClick={clearSelection}
              className="absolute top-4 right-4 w-10 h-10 bg-black/70 hover:bg-black rounded-full flex items-center justify-center transition-colors"
              title="Remove video"
            >
              <CloseIcon className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* File Info */}
          <div className="p-4 bg-bg-secondary flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-bg-tertiary rounded-lg flex items-center justify-center">
                <VideoIcon className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="font-medium text-text-primary truncate max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-text-secondary">
                  {formatSize(selectedFile.size)}
                </p>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={clearSelection}>
              Change
            </Button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-error/10 border border-error/30 rounded-lg">
          <p className="text-error text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
