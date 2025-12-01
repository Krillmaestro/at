/**
 * Status Badge Component
 * Displays job/asset status with appropriate colors
 */

const statusConfig = {
  // Job statuses
  pending: { color: 'bg-gray-100 text-gray-700', label: 'Pending' },
  running: { color: 'bg-blue-100 text-blue-700', label: 'Running' },
  completed: { color: 'bg-green-100 text-green-700', label: 'Completed' },
  failed: { color: 'bg-red-100 text-red-700', label: 'Failed' },
  cancelled: { color: 'bg-gray-100 text-gray-500', label: 'Cancelled' },

  // Asset statuses
  downloading: { color: 'bg-yellow-100 text-yellow-700', label: 'Downloading' },
  analyzing: { color: 'bg-purple-100 text-purple-700', label: 'Analyzing' },
  analyzed: { color: 'bg-indigo-100 text-indigo-700', label: 'Analyzed' },
  uploading: { color: 'bg-blue-100 text-blue-700', label: 'Uploading' },
  uploaded: { color: 'bg-green-100 text-green-700', label: 'Uploaded' },

  // Creative statuses
  draft: { color: 'bg-gray-100 text-gray-700', label: 'Draft' },
  created: { color: 'bg-green-100 text-green-700', label: 'Created' },

  // Ad statuses
  PAUSED: { color: 'bg-yellow-100 text-yellow-700', label: 'Paused' },
  ACTIVE: { color: 'bg-green-100 text-green-700', label: 'Active' },
};

export default function StatusBadge({ status, className = '' }) {
  const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-700', label: status };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${className}`}>
      {config.label}
    </span>
  );
}

export function StatusDot({ status, className = '' }) {
  const colorMap = {
    pending: 'bg-gray-400',
    running: 'bg-blue-500 animate-pulse',
    completed: 'bg-green-500',
    failed: 'bg-red-500',
    cancelled: 'bg-gray-400',
  };

  const color = colorMap[status] || 'bg-gray-400';

  return (
    <span className={`inline-block w-2 h-2 rounded-full ${color} ${className}`} />
  );
}
