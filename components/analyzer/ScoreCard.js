import { useEffect, useState } from 'react';

export default function ScoreCard({ label, score }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      const increment = score / 20;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= score) {
          setAnimatedScore(score);
          clearInterval(interval);
        } else {
          setAnimatedScore(Math.round(current));
        }
      }, 50);
      return () => clearInterval(interval);
    }, 200);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (score) => {
    if (score >= 8) return { bg: 'from-green-500/20 to-emerald-500/20', text: 'text-green-400', bar: 'from-green-500 to-emerald-500' };
    if (score >= 6) return { bg: 'from-blue-500/20 to-cyan-500/20', text: 'text-blue-400', bar: 'from-blue-500 to-cyan-500' };
    if (score >= 4) return { bg: 'from-yellow-500/20 to-amber-500/20', text: 'text-yellow-400', bar: 'from-yellow-500 to-amber-500' };
    return { bg: 'from-red-500/20 to-orange-500/20', text: 'text-red-400', bar: 'from-red-500 to-orange-500' };
  };

  const colors = getScoreColor(score);

  const getIcon = (label) => {
    const icons = {
      'Design & UX': '🎨',
      'Copy & Messaging': '✍️',
      'SEO & Technical': '🔍',
      'Conversion Potential': '📈',
      'Mobile Experience': '📱',
      'Trust & Credibility': '🛡️'
    };
    return icons[label] || '📊';
  };

  return (
    <div className={`bg-gradient-to-br ${colors.bg} backdrop-blur-xl rounded-xl p-6 border border-white/10 transform transition-all duration-500 hover:scale-105 hover:shadow-lg ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{getIcon(label)}</span>
        <span className={`text-3xl font-bold ${colors.text}`}>{animatedScore}/10</span>
      </div>

      {/* Label */}
      <h4 className="text-white font-medium mb-3">{label}</h4>

      {/* Progress Bar */}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colors.bar} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${animatedScore * 10}%` }}
        />
      </div>

      {/* Status */}
      <p className="text-slate-400 text-sm mt-3">
        {score >= 8 && 'Excellent'}
        {score >= 6 && score < 8 && 'Good'}
        {score >= 4 && score < 6 && 'Needs Work'}
        {score < 4 && 'Critical'}
      </p>
    </div>
  );
}
