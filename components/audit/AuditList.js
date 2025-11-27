export default function AuditList({ audits, selectedAudit, onSelect, getGradeColor }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-4 sticky top-8">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <span className="mr-2">📋</span>
        Dina analyser
      </h3>

      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {audits.map((audit) => (
          <button
            key={audit.id}
            onClick={() => onSelect(audit)}
            className={`w-full text-left p-4 rounded-xl transition-all ${
              selectedAudit?.id === audit.id
                ? 'bg-purple-500/20 border border-purple-500/50'
                : 'bg-white/5 border border-transparent hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`text-2xl font-bold ${getGradeColor(audit.grade)}`}
              >
                {audit.grade || '-'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {audit.page_title || 'Landningssida'}
                </p>
                <p className="text-gray-400 text-xs truncate">
                  {audit.url}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-gray-500 text-xs">
                {new Date(audit.created_at).toLocaleDateString('sv-SE')}
              </span>
              <span className="text-gray-500 text-xs">
                {audit.score}/100
              </span>
            </div>
          </button>
        ))}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  )
}
