import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import supabase from '../lib/supabaseClient'
import GradeCircle from '../components/audit/GradeCircle'
import ScoreCard from '../components/audit/ScoreCard'
import AnalysisSection from '../components/audit/AnalysisSection'
import AuditList from '../components/audit/AuditList'
import PageStats from '../components/audit/PageStats'
import PriorityList from '../components/audit/PriorityList'

export default function AuditDashboard() {
  const [user, setUser] = useState(null)
  const [audits, setAudits] = useState([])
  const [selectedAudit, setSelectedAudit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('oversikt')
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        setUser(data.user)
        fetchAudits(data.user.email)
      } else {
        router.push('/login')
      }
    }

    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (!session?.user) router.push('/login')
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  const fetchAudits = async (email) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('landing_page_audits')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setAudits(data)
      if (data.length > 0) {
        setSelectedAudit(data[0])
      }
    }
    setLoading(false)
  }

  const getGradeColor = (grade) => {
    if (!grade) return 'text-gray-400'
    if (grade.startsWith('A')) return 'text-emerald-500'
    if (grade.startsWith('B')) return 'text-blue-500'
    if (grade.startsWith('C')) return 'text-yellow-500'
    if (grade.startsWith('D')) return 'text-orange-500'
    return 'text-red-500'
  }

  const tabs = [
    { id: 'oversikt', label: 'Översikt', icon: '📊' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'copy', label: 'Copy', icon: '✍️' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'strategi', label: 'Strategi', icon: '🚀' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-white mt-4 text-lg">Laddar analyser...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Landningssideanalys
              </h1>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">
                Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">{user?.email}</span>
              <button
                onClick={() => supabase.auth.signOut()}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                Logga ut
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {audits.length === 0 ? (
          /* Tom state */
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">📊</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Inga analyser ännu</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              När du analyserar din första landningssida kommer resultaten att visas här.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Vänster sidebar - Lista över analyser */}
            <div className="lg:col-span-1">
              <AuditList
                audits={audits}
                selectedAudit={selectedAudit}
                onSelect={setSelectedAudit}
                getGradeColor={getGradeColor}
              />
            </div>

            {/* Huvudinnehåll */}
            <div className="lg:col-span-3 space-y-6">
              {selectedAudit && (
                <>
                  {/* Betygskort */}
                  <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                      <GradeCircle
                        grade={selectedAudit.grade}
                        score={selectedAudit.score}
                      />
                      <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-white mb-2">
                          {selectedAudit.page_title || 'Landningssida'}
                        </h2>
                        <a
                          href={selectedAudit.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 text-sm break-all"
                        >
                          {selectedAudit.url}
                        </a>
                        <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                          <span className="px-3 py-1 bg-slate-700/50 text-gray-300 text-sm rounded-full">
                            {selectedAudit.industry || 'Generell'}
                          </span>
                          <span className="px-3 py-1 bg-slate-700/50 text-gray-300 text-sm rounded-full">
                            {selectedAudit.primary_goal}
                          </span>
                          <span className="px-3 py-1 bg-slate-700/50 text-gray-300 text-sm rounded-full">
                            {new Date(selectedAudit.created_at).toLocaleDateString('sv-SE')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Flikar */}
                  <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
                    <div className="flex border-b border-white/10 overflow-x-auto">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex-1 min-w-[120px] px-6 py-4 text-sm font-medium transition-all ${
                            activeTab === tab.id
                              ? 'bg-purple-500/20 text-purple-300 border-b-2 border-purple-500'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span className="mr-2">{tab.icon}</span>
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="p-6">
                      {activeTab === 'oversikt' && (
                        <div className="space-y-8">
                          <ScoreCard audit={selectedAudit} />
                          <PageStats audit={selectedAudit} />
                          <PriorityList strategyAnalysis={selectedAudit.strategy_analysis} />
                        </div>
                      )}

                      {activeTab === 'design' && (
                        <AnalysisSection
                          title="Design & Användarupplevelse"
                          content={selectedAudit.design_analysis}
                          icon="🎨"
                          color="pink"
                        />
                      )}

                      {activeTab === 'copy' && (
                        <AnalysisSection
                          title="Copywriting & Budskap"
                          content={selectedAudit.copy_analysis}
                          icon="✍️"
                          color="blue"
                        />
                      )}

                      {activeTab === 'seo' && (
                        <AnalysisSection
                          title="SEO & Teknisk Analys"
                          content={selectedAudit.seo_analysis}
                          icon="🔍"
                          color="green"
                        />
                      )}

                      {activeTab === 'strategi' && (
                        <AnalysisSection
                          title="Strategisk Översikt"
                          content={selectedAudit.strategy_analysis}
                          icon="🚀"
                          color="purple"
                        />
                      )}
                    </div>
                  </div>

                  {/* Call-to-action */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Vill du att vi fixar det åt dig?
                    </h3>
                    <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                      Vårt expertteam kan implementera alla dessa rekommendationer och öka dina konverteringar.
                    </p>
                    <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                      Få en offert →
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
