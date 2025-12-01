/**
 * Assets Page
 * View and manage all imported assets
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { supabase } from '../../lib/supabaseClient';

export default function AssetsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedAssets, setSelectedAssets] = useState([]);

  useEffect(() => {
    loadAssets();
  }, [filter]);

  async function loadAssets() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      let query = supabase
        .from('assets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data } = await query;
      setAssets(data || []);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(assetId) {
    setSelectedAssets((prev) =>
      prev.includes(assetId)
        ? prev.filter((id) => id !== assetId)
        : [...prev, assetId]
    );
  }

  function selectAll() {
    if (selectedAssets.length === assets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(assets.map((a) => a.id));
    }
  }

  async function handleBulkAction(action) {
    if (selectedAssets.length === 0) return;

    const { data: { session } } = await supabase.auth.getSession();

    if (action === 'analyze') {
      await fetch('/api/jobs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          type: 'ai_analysis',
          config: { assetIds: selectedAssets },
          runImmediately: true,
        }),
      });
      router.push('/jobs');
    } else if (action === 'create-ads') {
      router.push(`/upload?mode=create&assets=${selectedAssets.join(',')}`);
    } else if (action === 'delete') {
      if (confirm(`Delete ${selectedAssets.length} assets?`)) {
        for (const id of selectedAssets) {
          await supabase.from('assets').delete().eq('id', id);
        }
        setSelectedAssets([]);
        loadAssets();
      }
    }
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
          <p className="text-gray-500 mt-1">{assets.length} total assets</p>
        </div>
        <button
          onClick={() => router.push('/upload?mode=sync')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Sync Folder
        </button>
      </div>

      {/* Filters & Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          {['all', 'pending', 'analyzed', 'uploaded', 'failed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {selectedAssets.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{selectedAssets.length} selected</span>
            <button
              onClick={() => handleBulkAction('analyze')}
              className="px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg"
            >
              Analyze
            </button>
            <button
              onClick={() => handleBulkAction('create-ads')}
              className="px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg"
            >
              Create Ads
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Assets Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assets yet</h3>
          <p className="text-gray-500 mb-4">Sync a Google Drive folder to import your creative assets</p>
          <button
            onClick={() => router.push('/upload?mode=sync')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sync a folder
          </button>
        </div>
      ) : (
        <>
          {/* Select All */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedAssets.length === assets.length && assets.length > 0}
                onChange={selectAll}
                className="w-4 h-4 text-blue-600 rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-600">Select all</span>
            </label>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {assets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                selected={selectedAssets.includes(asset.id)}
                onSelect={() => toggleSelect(asset.id)}
                onClick={() => router.push(`/assets/${asset.id}`)}
              />
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}

function AssetCard({ asset, selected, onSelect, onClick }) {
  const isVideo = asset.mime_type.startsWith('video/');

  return (
    <div
      className={`relative group rounded-xl overflow-hidden bg-gray-100 border-2 transition-all ${
        selected ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
      }`}
    >
      {/* Checkbox */}
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 text-blue-600 rounded border-gray-300 bg-white shadow"
        />
      </div>

      {/* Thumbnail */}
      <div className="aspect-square cursor-pointer" onClick={onClick}>
        {asset.thumbnail_url ? (
          <img
            src={asset.thumbnail_url}
            alt={asset.file_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>

      {/* Video indicator */}
      {isVideo && (
        <div className="absolute bottom-2 right-2 bg-black/60 rounded px-1.5 py-0.5">
          <VideoIcon className="w-4 h-4 text-white" />
        </div>
      )}

      {/* AI analyzed indicator */}
      {asset.ai_analysis && (
        <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1">
          <AIIcon className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Info */}
      <div className="p-2 bg-white">
        <p className="text-xs font-medium text-gray-900 truncate">{asset.file_name}</p>
        <div className="flex items-center justify-between mt-1">
          <StatusBadge status={asset.status} />
        </div>
      </div>
    </div>
  );
}

// Icons
function ImageIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function VideoIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
    </svg>
  );
}

function AIIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}
