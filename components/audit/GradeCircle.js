export default function GradeCircle({ grade, score }) {
  const getGradientColors = (grade) => {
    if (!grade) return ['#6b7280', '#9ca3af']
    if (grade.startsWith('A')) return ['#10b981', '#34d399']
    if (grade.startsWith('B')) return ['#3b82f6', '#60a5fa']
    if (grade.startsWith('C')) return ['#f59e0b', '#fbbf24']
    if (grade.startsWith('D')) return ['#f97316', '#fb923c']
    return ['#ef4444', '#f87171']
  }

  const [color1, color2] = getGradientColors(grade)

  return (
    <div className="relative">
      <div
        className="w-40 h-40 rounded-full flex flex-col items-center justify-center"
        style={{
          background: `conic-gradient(${color1} ${(score || 0) * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
        }}
      >
        <div className="w-32 h-32 rounded-full bg-slate-900 flex flex-col items-center justify-center">
          <span
            className="text-5xl font-bold"
            style={{ color: color1 }}
          >
            {grade || '-'}
          </span>
          <span className="text-gray-400 text-sm">{score || 0}/100</span>
        </div>
      </div>
      <div
        className="absolute -inset-2 rounded-full opacity-20 blur-xl"
        style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}
      />
    </div>
  )
}
