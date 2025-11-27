export default function PageStats({ audit }) {
  const stats = [
    {
      label: 'Ordantal',
      value: audit?.word_count?.toLocaleString('sv-SE') || '0',
      icon: '📝'
    },
    {
      label: 'CTA:er',
      value: audit?.cta_buttons?.length || 0,
      icon: '🔘'
    },
    {
      label: 'Formulär',
      value: audit?.form_count || 0,
      icon: '📋'
    },
    {
      label: 'Bilder',
      value: audit?.image_count || 0,
      icon: '🖼️'
    },
    {
      label: 'Bilder med alt',
      value: audit?.images_with_alt || 0,
      icon: '🏷️'
    },
    {
      label: 'Mobil viewport',
      value: audit?.has_mobile_viewport ? 'Ja' : 'Nej',
      icon: '📱',
      status: audit?.has_mobile_viewport ? 'success' : 'error'
    }
  ]

  const tech = audit?.detected_tech || {}
  const detectedTechs = Object.entries(tech)
    .filter(([_, detected]) => detected)
    .map(([name]) => {
      const names = {
        react: 'React',
        bootstrap: 'Bootstrap',
        tailwind: 'Tailwind',
        google_analytics: 'Google Analytics',
        facebook_pixel: 'Facebook Pixel'
      }
      return names[name] || name
    })

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <span className="mr-2">📈</span>
        Sidstatistik
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-slate-800/50 rounded-xl p-4 border border-white/5 text-center"
          >
            <span className="text-2xl mb-2 block">{stat.icon}</span>
            <p className={`text-xl font-bold ${
              stat.status === 'success' ? 'text-emerald-400' :
              stat.status === 'error' ? 'text-red-400' : 'text-white'
            }`}>
              {stat.value}
            </p>
            <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {detectedTechs.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
          <p className="text-gray-400 text-sm mb-2">Upptäckt teknik:</p>
          <div className="flex flex-wrap gap-2">
            {detectedTechs.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
