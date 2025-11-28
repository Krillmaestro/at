import { useEffect, useState } from 'react';

export default function ProgressIndicator({ steps, currentStep }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const targetProgress = ((currentStep + 1) / steps.length) * 100;
    const timer = setTimeout(() => {
      setProgress(targetProgress);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentStep, steps.length]);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold">Analyzing your page...</h3>
          <span className="text-slate-400 text-sm">{Math.round(progress)}%</span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isComplete = index < currentStep;

            return (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-white/10 border border-white/20'
                    : isComplete
                    ? 'opacity-60'
                    : 'opacity-30'
                }`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isComplete
                    ? 'bg-green-500/20'
                    : isActive
                    ? 'bg-blue-500/20'
                    : 'bg-white/5'
                }`}>
                  {isComplete ? (
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isActive ? (
                    <div className="relative">
                      <span className="text-lg">{step.icon}</span>
                      <div className="absolute -inset-1 bg-blue-500/30 rounded-full animate-ping" />
                    </div>
                  ) : (
                    <span className="text-lg opacity-50">{step.icon}</span>
                  )}
                </div>

                {/* Label */}
                <div>
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-white' : isComplete ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {step.label}
                  </p>
                  {isActive && (
                    <p className="text-xs text-blue-400 animate-pulse">In progress...</p>
                  )}
                  {isComplete && (
                    <p className="text-xs text-green-400">Complete</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
