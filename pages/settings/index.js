/**
 * Settings Page
 * Configure ad accounts, folders, and preferences
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('accounts');
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [folders, setFolders] = useState([]);
  const [settings, setSettings] = useState(null);

  // Form states
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [accountForm, setAccountForm] = useState({
    name: '',
    metaAccountId: '',
    metaPageId: '',
    metaPixelId: '',
    accessToken: '',
  });
  const [folderForm, setFolderForm] = useState({
    folderUrl: '',
    folderName: '',
    adAccountId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const [accountsRes, foldersRes, settingsRes] = await Promise.all([
        supabase.from('ad_accounts').select('*').eq('user_id', user.id),
        supabase.from('drive_folders').select('*').eq('user_id', user.id),
        supabase.from('settings').select('*').eq('user_id', user.id).single(),
      ]);

      setAccounts(accountsRes.data || []);
      setFolders(foldersRes.data || []);
      setSettings(settingsRes.data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddAccount(e) {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from('ad_accounts').insert({
        user_id: user.id,
        name: accountForm.name,
        meta_account_id: accountForm.metaAccountId,
        meta_page_id: accountForm.metaPageId,
        meta_pixel_id: accountForm.metaPixelId,
        access_token: accountForm.accessToken,
      });

      if (error) throw error;

      setShowAccountForm(false);
      setAccountForm({ name: '', metaAccountId: '', metaPageId: '', metaPixelId: '', accessToken: '' });
      loadData();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleAddFolder(e) {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const folderId = extractFolderId(folderForm.folderUrl);

      const { error } = await supabase.from('drive_folders').insert({
        user_id: user.id,
        folder_id: folderId,
        folder_name: folderForm.folderName,
        ad_account_id: folderForm.adAccountId || null,
      });

      if (error) throw error;

      setShowFolderForm(false);
      setFolderForm({ folderUrl: '', folderName: '', adAccountId: '' });
      loadData();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleDeleteAccount(id) {
    if (!confirm('Delete this ad account?')) return;
    await supabase.from('ad_accounts').delete().eq('id', id);
    loadData();
  }

  async function handleDeleteFolder(id) {
    if (!confirm('Delete this folder?')) return;
    await supabase.from('drive_folders').delete().eq('id', id);
    loadData();
  }

  function extractFolderId(url) {
    const match = url.match(/folders\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : url;
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Configure your ad accounts and preferences</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'accounts', label: 'Ad Accounts' },
            { id: 'folders', label: 'Drive Folders' },
            { id: 'preferences', label: 'Preferences' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Ad Accounts Tab */}
      {activeTab === 'accounts' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Meta Ad Accounts</h2>
            <button
              onClick={() => setShowAccountForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Account
            </button>
          </div>

          {accounts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500">No ad accounts configured yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {accounts.map((account) => (
                <div key={account.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{account.name}</h3>
                      <div className="mt-2 space-y-1 text-sm text-gray-500">
                        <p>Account ID: {account.meta_account_id}</p>
                        <p>Page ID: {account.meta_page_id}</p>
                        {account.meta_pixel_id && <p>Pixel ID: {account.meta_pixel_id}</p>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAccount(account.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Account Modal */}
          {showAccountForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Ad Account</h3>
                <form onSubmit={handleAddAccount} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                    <input
                      type="text"
                      value={accountForm.name}
                      onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                      placeholder="My Business Account"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Ad Account ID</label>
                    <input
                      type="text"
                      value={accountForm.metaAccountId}
                      onChange={(e) => setAccountForm({ ...accountForm, metaAccountId: e.target.value })}
                      placeholder="123456789"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Page ID</label>
                    <input
                      type="text"
                      value={accountForm.metaPageId}
                      onChange={(e) => setAccountForm({ ...accountForm, metaPageId: e.target.value })}
                      placeholder="123456789"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pixel ID (optional)</label>
                    <input
                      type="text"
                      value={accountForm.metaPixelId}
                      onChange={(e) => setAccountForm({ ...accountForm, metaPixelId: e.target.value })}
                      placeholder="123456789"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
                    <textarea
                      value={accountForm.accessToken}
                      onChange={(e) => setAccountForm({ ...accountForm, accessToken: e.target.value })}
                      placeholder="Your Meta access token"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAccountForm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Drive Folders Tab */}
      {activeTab === 'folders' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Google Drive Folders</h2>
            <button
              onClick={() => setShowFolderForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Folder
            </button>
          </div>

          {folders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500">No folders configured yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {folders.map((folder) => (
                <div key={folder.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {folder.folder_name || 'Unnamed Folder'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">ID: {folder.folder_id}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteFolder(folder.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Folder Modal */}
          {showFolderForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Drive Folder</h3>
                <form onSubmit={handleAddFolder} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Folder Name</label>
                    <input
                      type="text"
                      value={folderForm.folderName}
                      onChange={(e) => setFolderForm({ ...folderForm, folderName: e.target.value })}
                      placeholder="Creative Assets"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Drive Folder URL</label>
                    <input
                      type="text"
                      value={folderForm.folderUrl}
                      onChange={(e) => setFolderForm({ ...folderForm, folderUrl: e.target.value })}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Ad Account (optional)</label>
                    <select
                      value={folderForm.adAccountId}
                      onChange={(e) => setFolderForm({ ...folderForm, adAccountId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">None</option>
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowFolderForm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Folder
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Preferences</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Destination URL</label>
              <input
                type="url"
                defaultValue={settings?.default_destination_url || ''}
                placeholder="https://yourwebsite.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Daily Budget (cents)</label>
              <input
                type="number"
                defaultValue={settings?.default_daily_budget || 500}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slack Webhook URL (for notifications)</label>
              <input
                type="url"
                defaultValue={settings?.slack_webhook_url || ''}
                placeholder="https://hooks.slack.com/services/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoAnalyze"
                defaultChecked={settings?.auto_analyze_assets ?? true}
                className="w-4 h-4 text-blue-600 rounded border-gray-300"
              />
              <label htmlFor="autoAnalyze" className="text-sm text-gray-700">
                Automatically analyze new assets with AI
              </label>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
