export default function AnalysisSection({ title, content, icon, color }) {
  const colorClasses = {
    pink: 'border-pink-500/30 bg-pink-500/5',
    blue: 'border-blue-500/30 bg-blue-500/5',
    green: 'border-green-500/30 bg-green-500/5',
    purple: 'border-purple-500/30 bg-purple-500/5'
  }

  const iconBgClasses = {
    pink: 'bg-pink-500/20 text-pink-400',
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    purple: 'bg-purple-500/20 text-purple-400'
  }

  // Formatera innehållet för bättre läsbarhet
  const formatContent = (text) => {
    if (!text) return 'Ingen analys tillgänglig.'

    // Dela upp i sektioner baserat på emojis och rubriker
    const sections = text.split(/(?=📊|🎨|✍️|🔍|🚀|💡|⚡|🔥|⚠️|💪|🛠️|📈|💬|🎯)/)

    return sections.map((section, index) => {
      const lines = section.trim().split('\n')
      const firstLine = lines[0]
      const rest = lines.slice(1).join('\n')

      // Kolla om första raden är en rubrik
      const isHeader = /^[📊🎨✍️🔍🚀💡⚡🔥⚠️💪🛠️📈💬🎯]/.test(firstLine)

      if (isHeader) {
        return (
          <div key={index} className="mb-6">
            <h4 className="text-white font-semibold text-lg mb-3 flex items-center">
              {firstLine}
            </h4>
            <div className="text-gray-300 whitespace-pre-line leading-relaxed pl-4 border-l-2 border-white/10">
              {formatText(rest)}
            </div>
          </div>
        )
      }

      return (
        <div key={index} className="text-gray-300 whitespace-pre-line leading-relaxed mb-4">
          {formatText(section)}
        </div>
      )
    })
  }

  // Formatera text med highlightning av viktiga delar
  const formatText = (text) => {
    if (!text) return null

    // Highlighta poäng (X/10)
    const parts = text.split(/(\d+\/10)/g)

    return parts.map((part, i) => {
      if (/\d+\/10/.test(part)) {
        const score = parseInt(part)
        let colorClass = 'text-red-400'
        if (score >= 8) colorClass = 'text-emerald-400'
        else if (score >= 6) colorClass = 'text-blue-400'
        else if (score >= 4) colorClass = 'text-yellow-400'

        return (
          <span key={i} className={`font-bold ${colorClass}`}>
            {part}
          </span>
        )
      }

      // Highlighta viktiga fraser
      return part.split(/(\*\*[^*]+\*\*)/).map((subPart, j) => {
        if (/\*\*[^*]+\*\*/.test(subPart)) {
          return (
            <strong key={`${i}-${j}`} className="text-white">
              {subPart.replace(/\*\*/g, '')}
            </strong>
          )
        }
        return subPart
      })
    })
  }

  return (
    <div className={`rounded-xl border ${colorClasses[color]} p-6`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-xl ${iconBgClasses[color]} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>

      <div className="prose prose-invert max-w-none">
        {formatContent(content)}
      </div>
    </div>
  )
}
