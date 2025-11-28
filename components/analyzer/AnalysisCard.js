import { useState } from 'react';

export default function AnalysisCard({ data }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getScoreColor = (score) => {
    if (score >= 8) return 'from-green-500 to-emerald-500';
    if (score >= 6) return 'from-blue-500 to-cyan-500';
    if (score >= 4) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-orange-500';
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center">
          <span className="text-3xl mr-4">{data.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-white">{data.title}</h3>
            <p className="text-slate-400 text-sm mt-1">
              Score: <span className={`font-semibold bg-gradient-to-r ${getScoreColor(data.score)} bg-clip-text text-transparent`}>
                {data.score}/10
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* Mini Score Circle */}
          <div className="w-12 h-12 rounded-full flex items-center justify-center relative">
            <svg className="w-12 h-12 -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="4"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke={data.score >= 6 ? '#10b981' : data.score >= 4 ? '#f59e0b' : '#ef4444'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${data.score * 12.56} 125.6`}
              />
            </svg>
            <span className="absolute text-white text-sm font-bold">{data.score}</span>
          </div>
          {/* Expand Icon */}
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Content */}
      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-6 pb-6 border-t border-white/10 pt-6">
          {/* Findings */}
          <div className="mb-6">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
              Key Findings
            </h4>
            <ul className="space-y-2">
              {data.findings.map((finding, i) => (
                <li key={i} className="text-slate-300 text-sm flex items-start">
                  <span className="mr-2 mt-0.5">{finding.startsWith('✅') || finding.startsWith('❌') || finding.startsWith('⚠️') ? '' : '•'}</span>
                  {finding}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          {data.recommendations && data.recommendations.length > 0 && (
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                Recommendations
              </h4>
              <ul className="space-y-2">
                {data.recommendations.map((rec, i) => (
                  <li key={i} className="text-slate-300 text-sm flex items-start bg-white/5 rounded-lg p-3">
                    <span className="text-green-400 mr-2 font-bold">{i + 1}.</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
