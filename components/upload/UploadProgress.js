// UploadProgress Component - Shows upload and compression progress

import { CheckIcon, VideoIcon } from '../ui/Icons';

export default function UploadProgress({
  uploadProgress = 0,
  compressionProgress = 0,
  status = 'idle', // 'idle' | 'uploading' | 'compressing' | 'complete' | 'error'
  error = null,
}) {
  const steps = [
    {
      id: 'upload',
      label: 'Uploading',
      progress: uploadProgress,
      isActive: status === 'uploading',
      isComplete: ['compressing', 'complete'].includes(status),
    },
    {
      id: 'compress',
      label: 'Compressing',
      progress: compressionProgress,
      isActive: status === 'compressing',
      isComplete: status === 'complete',
    },
  ];

  if (status === 'idle') return null;

  return (
    <div className="card">
      {/* Status Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`
            w-10 h-10 rounded-full flex items-center justify-center
            ${status === 'complete'
              ? 'bg-success'
              : status === 'error'
              ? 'bg-error'
              : 'bg-orange-500'
            }
          `}
        >
          {status === 'complete' ? (
            <CheckIcon className="w-5 h-5 text-white" />
          ) : status === 'error' ? (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <VideoIcon className="w-5 h-5 text-white" />
          )}
        </div>

        <div>
          <h3 className="font-medium text-text-primary">
            {status === 'uploading' && 'Uploading video...'}
            {status === 'compressing' && 'Compressing video...'}
            {status === 'complete' && 'Upload complete!'}
            {status === 'error' && 'Upload failed'}
          </h3>
          <p className="text-sm text-text-secondary">
            {status === 'uploading' && 'Please wait while your video uploads'}
            {status === 'compressing' && 'Optimizing for smooth playback'}
            {status === 'complete' && 'Your video is ready to view'}
            {status === 'error' && error}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      {status !== 'error' && status !== 'complete' && (
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id}>
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-sm font-medium ${
                    step.isComplete
                      ? 'text-success'
                      : step.isActive
                      ? 'text-text-primary'
                      : 'text-text-muted'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-sm text-text-secondary">
                  {step.isComplete ? (
                    <CheckIcon className="w-4 h-4 text-success inline" />
                  ) : step.isActive ? (
                    `${Math.round(step.progress)}%`
                  ) : (
                    'Waiting...'
                  )}
                </span>
              </div>

              <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    step.isComplete
                      ? 'bg-success w-full'
                      : step.isActive
                      ? 'bg-orange-500'
                      : 'bg-bg-elevated w-0'
                  }`}
                  style={{ width: step.isActive ? `${step.progress}%` : undefined }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Success animation */}
      {status === 'complete' && (
        <div className="flex items-center justify-center py-4">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center animate-scaleIn">
            <CheckIcon className="w-8 h-8 text-success" />
          </div>
        </div>
      )}
    </div>
  );
}
