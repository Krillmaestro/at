import { useEffect, useState } from 'react';

export default function GradeCircle({ grade, score }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      const increment = score / 30;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= score) {
          setAnimatedScore(score);
          clearInterval(interval);
        } else {
          setAnimatedScore(Math.round(current * 10) / 10);
        }
      }, 50);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return { from: '#10b981', to: '#059669', ring: '#10b981' };
    if (grade.startsWith('B')) return { from: '#3b82f6', to: '#2563eb', ring: '#3b82f6' };
    if (grade.startsWith('C')) return { from: '#f59e0b', to: '#d97706', ring: '#f59e0b' };
    if (grade.startsWith('D')) return { from: '#f97316', to: '#ea580c', ring: '#f97316' };
    return { from: '#ef4444', to: '#dc2626', ring: '#ef4444' };
  };

  const colors = getGradeColor(grade);
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (animatedScore / 10) * circumference;

  return (
    <div className={`bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 h-full flex flex-col items-center justify-center transform transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <h3 className="text-white font-semibold mb-6 text-center">Overall Grade</h3>

      {/* Grade Circle */}
      <div className="relative w-48 h-48 mb-6">
        {/* Background Circle */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="90"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          {/* Progress Circle */}
          <circle
            cx="96"
            cy="96"
            r="90"
            fill="none"
            stroke={`url(#gradeGradient)`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.from} />
              <stop offset="100%" stopColor={colors.to} />
            </linearGradient>
          </defs>
        </svg>

        {/* Grade Letter */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-6xl font-bold"
            style={{
              background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {grade}
          </span>
          <span className="text-slate-400 text-sm mt-1">{animatedScore.toFixed(1)}/10</span>
        </div>
      </div>

      {/* Score Description */}
      <p className="text-slate-300 text-center text-sm max-w-xs">
        {grade.startsWith('A') && 'Excellent! Your page is performing well.'}
        {grade.startsWith('B') && 'Good foundation with room for improvement.'}
        {grade.startsWith('C') && 'Average performance. Several areas need work.'}
        {grade.startsWith('D') && 'Below average. Significant improvements needed.'}
        {grade === 'F' && 'Needs substantial work to be effective.'}
      </p>

      {/* Mini Stats */}
      <div className="mt-6 flex items-center space-x-6 text-sm">
        <div className="text-center">
          <span className="text-white font-semibold block">{Math.round(animatedScore * 10)}</span>
          <span className="text-slate-400 text-xs">Score</span>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div className="text-center">
          <span className="text-white font-semibold block">6</span>
          <span className="text-slate-400 text-xs">Categories</span>
        </div>
      </div>
    </div>
  );
}
