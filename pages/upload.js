/**
 * Upload Page
 * Create new jobs: sync folder, analyze assets, or create ads
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

export default function UploadPage() {
  const router = useRouter();
  const { mode = 'full' } = router.query;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [folders, setFolders] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Source
    sourceType: 'folder', // 'folder' or 'manual'
    folderId: '',
    folderUrl: '',
    selectedFolderId: '',

    // Step 2: Account
    adAccountId: '',

    // Step 3: Campaign Settings
    campaignName: '',
    objective: 'OUTCOME_SALES',
    dailyBudget: 500,
    optimizationGoal: 'OFFSITE_CONVERSIONS',
    customEventType: 'ADD_TO_CART',
    destinationUrl: '',

    // Step 4: Ad Copy (optional, AI will generate if empty)
    primaryText: '',
    headline: '',
    description: '',
    callToAction: 'LEARN_MORE',

    // Options
    runAIAnalysis: true,
    useAISuggestions: true,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    // Load ad accounts
    const { data: accountsData } = await supabase
      .from('ad_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true);
    setAccounts(accountsData || []);

    // Load saved folders
    const { data: foldersData } = await supabase
      .from('drive_folders')
      .select('*')
      .eq('user_id', user.id);
    setFolders(foldersData || []);

    // Load settings defaults
    const { data: settings } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (settings) {
      setFormData((prev) => ({
        ...prev,
        adAccountId: settings.default_ad_account_id || '',
        destinationUrl: settings.default_destination_url || '',
        dailyBudget: settings.default_daily_budget || 500,
      }));
    }
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      // Determine job type based on mode
      let jobType = 'full_pipeline';
      if (mode === 'sync') jobType = 'sync_folder';
      if (mode === 'analyze') jobType = 'ai_analysis';
      if (mode === 'create') jobType = 'create_ads';

      // Build job config
      const config = {
        folderId: formData.folderUrl
          ? extractFolderId(formData.folderUrl)
          : formData.selectedFolderId,
        adAccountId: formData.adAccountId,
        campaignConfig: {
          name: formData.campaignName || `Campaign_${new Date().toISOString().slice(0, 10)}`,
          objective: formData.objective,
        },
        adSetConfig: {
          name: `AdSet_${new Date().toISOString().slice(0, 10)}`,
          dailyBudget: formData.dailyBudget,
          optimizationGoal: formData.optimizationGoal,
          customEventType: formData.customEventType,
          destinationUrl: formData.destinationUrl,
        },
        adCopy: formData.useAISuggestions
          ? null
          : {
              primaryText: formData.primaryText,
              headline: formData.headline,
              description: formData.description,
              callToAction: formData.callToAction,
              destinationUrl: formData.destinationUrl,
            },
        runAIAnalysis: formData.runAIAnalysis,
      };

      // Create job via API
      const response = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          type: jobType,
          config,
          runImmediately: true,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create job');
      }

      // Redirect to job status page
      router.push(`/jobs/${result.job.id}`);
    } catch (error) {
      console.error('Error creating job:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  function extractFolderId(url) {
    const match = url.match(/folders\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : url;
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'sync' && 'Sync Google Drive Folder'}
            {mode === 'analyze' && 'Analyze Assets with AI'}
            {mode === 'create' && 'Create Meta Ads'}
            {mode === 'full' && 'Create Ads from Google Drive'}
          </h1>
          <p className="text-gray-500 mt-1">
            {mode === 'sync' && 'Import new images and videos from your Google Drive folder'}
            {mode === 'analyze' && 'Run AI analysis on your pending assets'}
            {mode === 'create' && 'Generate Meta ads from your analyzed assets'}
            {mode === 'full' && 'Complete pipeline: sync, analyze, and create ads'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {['Source', 'Account', 'Settings', 'Review'].map((label, index) => (
              <div key={label} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step > index + 1
                      ? 'bg-blue-600 text-white'
                      : step === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > index + 1 ? '✓' : index + 1}
                </div>
                <span className={`ml-2 text-sm ${step === index + 1 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {label}
                </span>
                {index < 3 && <div className="w-16 h-0.5 bg-gray-200 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Step 1: Source */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Select Source</h2>

              {/* Saved Folders */}
              {folders.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Saved Folders</label>
                  <div className="grid grid-cols-2 gap-3">
                    {folders.map((folder) => (
                      <button
                        key={folder.id}
                        onClick={() => setFormData({ ...formData, selectedFolderId: folder.folder_id })}
                        className={`p-4 rounded-lg border text-left transition-all ${
                          formData.selectedFolderId === folder.folder_id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <FolderIcon className="w-6 h-6 text-yellow-500 mb-2" />
                        <p className="font-medium text-gray-900">{folder.folder_name || 'Folder'}</p>
                        <p className="text-xs text-gray-500 truncate">{folder.folder_id}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Or enter URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or enter Google Drive Folder URL
                </label>
                <input
                  type="text"
                  value={formData.folderUrl}
                  onChange={(e) => setFormData({ ...formData, folderUrl: e.target.value, selectedFolderId: '' })}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 2: Account */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Select Ad Account</h2>

              {accounts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No ad accounts configured</p>
                  <button
                    onClick={() => router.push('/settings')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Add an ad account
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {accounts.map((account) => (
                    <button
                      key={account.id}
                      onClick={() => setFormData({ ...formData, adAccountId: account.id })}
                      className={`w-full p-4 rounded-lg border text-left transition-all ${
                        formData.adAccountId === account.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{account.name}</p>
                          <p className="text-sm text-gray-500">ID: {account.meta_account_id}</p>
                        </div>
                        {formData.adAccountId === account.id && (
                          <CheckIcon className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Settings */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Campaign Settings</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                  <input
                    type="text"
                    value={formData.campaignName}
                    onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                    placeholder="My Campaign"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Daily Budget (cents)</label>
                  <input
                    type="number"
                    value={formData.dailyBudget}
                    onChange={(e) => setFormData({ ...formData, dailyBudget: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Optimization Goal</label>
                  <select
                    value={formData.optimizationGoal}
                    onChange={(e) => setFormData({ ...formData, optimizationGoal: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="OFFSITE_CONVERSIONS">Conversions</option>
                    <option value="LINK_CLICKS">Link Clicks</option>
                    <option value="IMPRESSIONS">Impressions</option>
                    <option value="REACH">Reach</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Conversion Event</label>
                  <select
                    value={formData.customEventType}
                    onChange={(e) => setFormData({ ...formData, customEventType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ADD_TO_CART">Add to Cart</option>
                    <option value="PURCHASE">Purchase</option>
                    <option value="LEAD">Lead</option>
                    <option value="COMPLETE_REGISTRATION">Complete Registration</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination URL</label>
                  <input
                    type="url"
                    value={formData.destinationUrl}
                    onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
                    placeholder="https://yourwebsite.com/landing-page"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* AI Options */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">AI Options</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.runAIAnalysis}
                      onChange={(e) => setFormData({ ...formData, runAIAnalysis: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Run AI analysis on new assets</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.useAISuggestions}
                      onChange={(e) => setFormData({ ...formData, useAISuggestions: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Use AI-generated ad copy suggestions</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Review & Start</h2>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Source</span>
                  <span className="text-gray-900 font-medium">
                    {formData.folderUrl ? 'Custom folder URL' : 'Saved folder'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ad Account</span>
                  <span className="text-gray-900 font-medium">
                    {accounts.find((a) => a.id === formData.adAccountId)?.name || 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Daily Budget</span>
                  <span className="text-gray-900 font-medium">${(formData.dailyBudget / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Optimization</span>
                  <span className="text-gray-900 font-medium">{formData.optimizationGoal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">AI Analysis</span>
                  <span className="text-gray-900 font-medium">{formData.runAIAnalysis ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> All ads will be created in PAUSED status. Review them in Meta Ads Manager before activating.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              Back
            </button>

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {loading && (
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                Start Job
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Icons
function FolderIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
