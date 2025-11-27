export default function PriorityList({ strategyAnalysis }) {
  // Försök parsa topp 5 prioriteringar från strategianalysen
  const parsePriorities = (analysis) => {
    if (!analysis) return []

    const priorities = []

    // Leta efter numrerade prioriteringar
    const priorityPattern = /(\d)\.\s*\[?([^\]\n]+)\]?\s*(?:Påverkan|Impact):\s*\[?(Hög|Medel|Låg|High|Medium|Low)\]?\s*\|\s*(?:Insats|Effort):\s*\[?(Enkel|Medel|Svår|Easy|Medium|Hard)\]?/gi

    let match
    while ((match = priorityPattern.exec(analysis)) !== null && priorities.length < 5) {
      priorities.push({
        number: parseInt(match[1]),
        title: match[2].trim(),
        impact: translateImpact(match[3]),
        effort: translateEffort(match[4])
      })
    }

    // Om vi inte hittade med regex, försök med enklare mönster
    if (priorities.length === 0) {
      const simplePattern = /(\d)\.\s*([^\n]+)/g
      let simpleMatch
      while ((simpleMatch = simplePattern.exec(analysis)) !== null && priorities.length < 5) {
        const title = simpleMatch[2].trim()
        if (title.length > 10 && title.length < 200) {
          priorities.push({
            number: parseInt(simpleMatch[1]),
            title: title,
            impact: 'Hög',
            effort: 'Medel'
          })
        }
      }
    }

    return priorities.slice(0, 5)
  }

  const translateImpact = (impact) => {
    const translations = {
      'High': 'Hög',
      'Medium': 'Medel',
      'Low': 'Låg'
    }
    return translations[impact] || impact
  }

  const translateEffort = (effort) => {
    const translations = {
      'Easy': 'Enkel',
      'Medium': 'Medel',
      'Hard': 'Svår'
    }
    return translations[effort] || effort
  }

  const getImpactColor = (impact) => {
    if (impact === 'Hög' || impact === 'High') return 'bg-emerald-500/20 text-emerald-400'
    if (impact === 'Medel' || impact === 'Medium') return 'bg-yellow-500/20 text-yellow-400'
    return 'bg-gray-500/20 text-gray-400'
  }

  const getEffortColor = (effort) => {
    if (effort === 'Enkel' || effort === 'Easy') return 'bg-emerald-500/20 text-emerald-400'
    if (effort === 'Medel' || effort === 'Medium') return 'bg-yellow-500/20 text-yellow-400'
    return 'bg-red-500/20 text-red-400'
  }

  const priorities = parsePriorities(strategyAnalysis)

  if (priorities.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <span className="mr-2">🔥</span>
          Topp Prioriteringar
        </h3>
        <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5 text-center">
          <p className="text-gray-400">Se strategifliken för detaljerade prioriteringar</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <span className="mr-2">🔥</span>
        Topp 5 Prioriteringar
      </h3>

      <div className="space-y-3">
        {priorities.map((priority, index) => (
          <div
            key={index}
            className="bg-slate-800/50 rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                {priority.number}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium mb-2">{priority.title}</p>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${getImpactColor(priority.impact)}`}>
                    Påverkan: {priority.impact}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${getEffortColor(priority.effort)}`}>
                    Insats: {priority.effort}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
