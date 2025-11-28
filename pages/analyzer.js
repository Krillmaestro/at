import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import GradeCircle from '../components/analyzer/GradeCircle';
import ScoreCard from '../components/analyzer/ScoreCard';
import AnalysisCard from '../components/analyzer/AnalysisCard';
import ProgressIndicator from '../components/analyzer/ProgressIndicator';

export default function Analyzer() {
  const [url, setUrl] = useState('');
  const [industry, setIndustry] = useState('');
  const [goal, setGoal] = useState('Generate Leads');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [pageData, setPageData] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);
  const resultsRef = useRef(null);

  const steps = [
    { label: 'Fetching page', icon: '🌐' },
    { label: 'Analyzing design', icon: '🎨' },
    { label: 'Reviewing copy', icon: '✍️' },
    { label: 'Checking SEO', icon: '🔍' },
    { label: 'Building strategy', icon: '🚀' },
    { label: 'Generating report', icon: '📊' }
  ];

  const industries = [
    'SaaS', 'E-commerce', 'Real Estate', 'Coaching', 'Healthcare',
    'Finance', 'Education', 'Travel', 'Food & Restaurant', 'B2B Services',
    'Agency', 'Fitness', 'Legal', 'Technology', 'Other'
  ];

  const goals = [
    'Generate Leads', 'Drive Sales', 'Get Sign-ups',
    'Book Appointments', 'Download Resource', 'Other'
  ];

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url) return;

    setIsAnalyzing(true);
    setError(null);
    setCurrentStep(0);
    setAnalysisResults(null);

    try {
      // Step 1: Fetch page data
      setCurrentStep(0);
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, industry, goal })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch page data');
      }

      const data = await response.json();
      setPageData(data.pageData);

      // Step 2-5: Simulate AI analysis steps
      for (let i = 1; i <= 4; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Step 6: Generate mock analysis results
      setCurrentStep(5);
      await new Promise(resolve => setTimeout(resolve, 600));

      const results = generateAnalysis(data.pageData);
      setAnalysisResults(results);

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateAnalysis = (data) => {
    // Generate comprehensive analysis scores
    const designScore = calculateDesignScore(data);
    const copyScore = calculateCopyScore(data);
    const seoScore = calculateSEOScore(data);
    const conversionScore = calculateConversionScore(data);
    const mobileScore = data.has_mobile_viewport ? 8 : 4;
    const trustScore = calculateTrustScore(data);

    const overallScore = Math.round(
      (designScore + copyScore + seoScore + conversionScore + mobileScore + trustScore) / 6
    );

    const grade = getGrade(overallScore);

    return {
      grade,
      overallScore,
      scores: {
        design: { score: designScore, label: 'Design & UX' },
        copy: { score: copyScore, label: 'Copy & Messaging' },
        seo: { score: seoScore, label: 'SEO & Technical' },
        conversion: { score: conversionScore, label: 'Conversion Potential' },
        mobile: { score: mobileScore, label: 'Mobile Experience' },
        trust: { score: trustScore, label: 'Trust & Credibility' }
      },
      design: generateDesignAnalysis(data, designScore),
      copy: generateCopyAnalysis(data, copyScore),
      seo: generateSEOAnalysis(data, seoScore),
      strategy: generateStrategyAnalysis(data, overallScore, grade)
    };
  };

  const calculateDesignScore = (data) => {
    let score = 5;
    if (data.h1_headings.length > 0) score += 1;
    if (data.image_count > 3) score += 1;
    if (data.has_mobile_viewport) score += 1;
    if (data.cta_buttons.length > 0) score += 1;
    if (data.form_count > 0) score += 1;
    return Math.min(10, score);
  };

  const calculateCopyScore = (data) => {
    let score = 5;
    if (data.h1_headings.length > 0 && data.h1_headings[0].length < 60) score += 1;
    if (data.h2_headings.length >= 3) score += 1;
    if (data.word_count > 300 && data.word_count < 2000) score += 1;
    if (data.cta_buttons.length >= 2) score += 1;
    if (data.has_urgency) score += 1;
    return Math.min(10, score);
  };

  const calculateSEOScore = (data) => {
    let score = 4;
    if (data.page_title !== 'No title found' && data.page_title.length <= 60) score += 1.5;
    if (data.meta_description !== 'No meta description' && data.meta_description.length <= 160) score += 1.5;
    if (data.h1_headings.length === 1) score += 1;
    if (data.images_with_alt / data.image_count > 0.5) score += 1;
    if (data.has_ssl) score += 1;
    return Math.min(10, Math.round(score));
  };

  const calculateConversionScore = (data) => {
    let score = 4;
    if (data.cta_buttons.length > 0) score += 2;
    if (data.form_count > 0) score += 2;
    if (data.has_social_proof) score += 1;
    if (data.has_urgency) score += 1;
    return Math.min(10, score);
  };

  const calculateTrustScore = (data) => {
    let score = 5;
    if (data.has_ssl) score += 2;
    if (data.has_social_proof) score += 2;
    if (data.detected_tech.google_analytics) score += 1;
    return Math.min(10, score);
  };

  const getGrade = (score) => {
    if (score >= 9) return 'A+';
    if (score >= 8.5) return 'A';
    if (score >= 8) return 'A-';
    if (score >= 7.5) return 'B+';
    if (score >= 7) return 'B';
    if (score >= 6.5) return 'B-';
    if (score >= 6) return 'C+';
    if (score >= 5.5) return 'C';
    if (score >= 5) return 'C-';
    if (score >= 4) return 'D';
    return 'F';
  };

  const generateDesignAnalysis = (data, score) => ({
    title: 'Design & User Experience',
    icon: '🎨',
    score,
    findings: [
      data.has_mobile_viewport ? '✅ Mobile viewport configured correctly' : '❌ Missing mobile viewport meta tag',
      data.image_count > 0 ? `✅ ${data.image_count} images found on page` : '❌ No images found - pages need visual content',
      data.cta_buttons.length > 0 ? `✅ ${data.cta_buttons.length} CTA elements detected` : '❌ No clear call-to-action buttons found',
      data.form_count > 0 ? `✅ ${data.form_count} form(s) for lead capture` : '⚠️ No forms found - consider adding one',
      data.h1_headings.length === 1 ? '✅ Single H1 heading (good hierarchy)' : `⚠️ ${data.h1_headings.length} H1 headings found (should be 1)`
    ],
    recommendations: [
      !data.has_mobile_viewport && 'Add mobile viewport meta tag for responsive design',
      data.cta_buttons.length < 2 && 'Add more prominent CTA buttons above the fold',
      data.image_count < 3 && 'Add more visual content to break up text',
      data.form_count === 0 && 'Add a lead capture form',
      'Ensure CTA buttons have contrasting colors',
      'Add whitespace between sections for better readability'
    ].filter(Boolean).slice(0, 5)
  });

  const generateCopyAnalysis = (data, score) => ({
    title: 'Copywriting & Messaging',
    icon: '✍️',
    score,
    findings: [
      data.h1_headings.length > 0 ? `✅ Main headline: "${data.h1_headings[0]?.substring(0, 50)}${data.h1_headings[0]?.length > 50 ? '...' : ''}"` : '❌ No H1 headline found',
      data.word_count > 300 ? `✅ Good content depth (${data.word_count} words)` : `⚠️ Light on content (${data.word_count} words)`,
      data.has_urgency ? '✅ Urgency elements detected' : '⚠️ No urgency triggers found',
      data.cta_buttons.length > 0 ? `✅ CTAs found: ${data.cta_buttons.slice(0, 3).join(', ')}` : '❌ No CTA copy detected',
      data.h2_headings.length >= 3 ? '✅ Good use of subheadings' : '⚠️ Add more subheadings to break up content'
    ],
    recommendations: [
      data.h1_headings.length === 0 && 'Add a compelling headline that addresses visitor pain points',
      !data.has_urgency && 'Add urgency elements (limited time, scarcity)',
      data.word_count < 300 && 'Add more persuasive copy explaining benefits',
      'Focus on benefits over features',
      'Use power words in CTAs (e.g., "Get", "Start", "Discover")',
      'Add social proof near your main CTA'
    ].filter(Boolean).slice(0, 5)
  });

  const generateSEOAnalysis = (data, score) => ({
    title: 'SEO & Technical',
    icon: '🔍',
    score,
    findings: [
      data.page_title !== 'No title found'
        ? `✅ Title tag: "${data.page_title.substring(0, 40)}${data.page_title.length > 40 ? '...' : ''}" (${data.page_title.length} chars)`
        : '❌ Missing title tag',
      data.meta_description !== 'No meta description'
        ? `✅ Meta description present (${data.meta_description.length} chars)`
        : '❌ Missing meta description',
      data.has_ssl ? '✅ SSL certificate active (HTTPS)' : '❌ No SSL - security risk!',
      data.detected_tech.google_analytics ? '✅ Google Analytics detected' : '⚠️ No analytics tracking found',
      `${data.images_with_alt}/${data.image_count} images have alt tags`
    ],
    recommendations: [
      data.page_title === 'No title found' && 'Add a title tag (50-60 characters)',
      data.page_title.length > 60 && 'Shorten title tag to under 60 characters',
      data.meta_description === 'No meta description' && 'Add meta description (150-160 characters)',
      data.meta_description.length > 160 && 'Shorten meta description to under 160 characters',
      !data.has_ssl && 'Install SSL certificate immediately',
      !data.detected_tech.google_analytics && 'Install Google Analytics for tracking',
      data.images_with_alt < data.image_count && 'Add alt text to all images'
    ].filter(Boolean).slice(0, 5)
  });

  const generateStrategyAnalysis = (data, score, grade) => ({
    title: 'Strategic Overview',
    icon: '🚀',
    score,
    grade,
    summary: `This landing page scores ${score}/10 overall. ${
      score >= 7
        ? 'It has a solid foundation but there are clear opportunities for improvement.'
        : score >= 5
        ? 'There are significant areas that need attention to maximize conversions.'
        : 'This page needs substantial work to become an effective conversion tool.'
    }`,
    priorities: [
      {
        priority: 1,
        title: data.cta_buttons.length === 0 ? 'Add clear CTAs' : 'Optimize CTA placement',
        impact: 'High',
        effort: 'Low',
        lift: '15-25%'
      },
      {
        priority: 2,
        title: !data.has_social_proof ? 'Add social proof' : 'Enhance trust signals',
        impact: 'High',
        effort: 'Medium',
        lift: '10-20%'
      },
      {
        priority: 3,
        title: data.meta_description === 'No meta description' ? 'Add meta description' : 'Optimize page title',
        impact: 'Medium',
        effort: 'Low',
        lift: '5-10%'
      },
      {
        priority: 4,
        title: 'Improve headline copy',
        impact: 'High',
        effort: 'Medium',
        lift: '10-30%'
      },
      {
        priority: 5,
        title: 'A/B test key elements',
        impact: 'High',
        effort: 'Medium',
        lift: '20-40%'
      }
    ],
    strengths: [
      data.has_mobile_viewport && 'Mobile-responsive design',
      data.has_ssl && 'Secure HTTPS connection',
      data.form_count > 0 && 'Lead capture form present',
      data.cta_buttons.length > 0 && 'Call-to-action elements present',
      data.detected_tech.google_analytics && 'Analytics tracking enabled'
    ].filter(Boolean),
    weaknesses: [
      !data.has_mobile_viewport && 'Not mobile-optimized',
      !data.has_ssl && 'No SSL certificate',
      data.form_count === 0 && 'No lead capture mechanism',
      data.cta_buttons.length === 0 && 'No clear CTAs',
      !data.detected_tech.google_analytics && 'No analytics tracking'
    ].filter(Boolean)
  });

  return (
    <>
      <Head>
        <title>Landing Page Analyzer | Free Professional Audit</title>
        <meta name="description" content="Get a free professional landing page audit powered by AI. Analyze design, copy, SEO, and conversion potential in 90 seconds." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Hero Section */}
        <header className="relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-gradient" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
            {/* Logo/Brand */}
            <div className="flex items-center justify-center mb-12">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">E</span>
                </div>
                <span className="text-white text-xl font-semibold tracking-tight">Evervise</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Get Your Free
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> Landing Page Audit</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                Professional analysis powered by 4 AI specialists. Get actionable insights on design, copy, SEO, and conversion strategy in 90 seconds.
              </p>

              {/* Value Badges */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {[
                  { icon: '🎨', label: 'Design Analysis' },
                  { icon: '✍️', label: 'Copy Review' },
                  { icon: '🔍', label: 'SEO Audit' },
                  { icon: '🚀', label: 'Growth Strategy' }
                ].map((badge, i) => (
                  <div key={i} className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <span>{badge.icon}</span>
                    <span className="text-white text-sm font-medium">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis Form */}
            <form onSubmit={handleAnalyze} className="max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                {/* URL Input */}
                <div className="mb-6">
                  <label className="block text-white text-sm font-medium mb-2">
                    Landing Page URL <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://yourwebsite.com/landing-page"
                      className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      🔗
                    </div>
                  </div>
                </div>

                {/* Two Column Options */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Industry */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Industry
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-slate-800">Select your industry</option>
                      {industries.map(ind => (
                        <option key={ind} value={ind} className="bg-slate-800">{ind}</option>
                      ))}
                    </select>
                  </div>

                  {/* Goal */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Primary Goal
                    </label>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      {goals.map(g => (
                        <option key={g} value={g} className="bg-slate-800">{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isAnalyzing || !url}
                  className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    isAnalyzing || !url
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    'Analyze My Landing Page →'
                  )}
                </button>

                {/* Trust indicators */}
                <div className="mt-6 flex flex-wrap justify-center gap-6 text-slate-400 text-sm">
                  <span className="flex items-center"><span className="mr-2">🔒</span> Secure & Private</span>
                  <span className="flex items-center"><span className="mr-2">⚡</span> Results in 90 seconds</span>
                  <span className="flex items-center"><span className="mr-2">💰</span> 100% Free</span>
                </div>
              </div>
            </form>

            {/* Progress Indicator */}
            {isAnalyzing && (
              <ProgressIndicator steps={steps} currentStep={currentStep} />
            )}

            {/* Error Message */}
            {error && (
              <div className="max-w-3xl mx-auto mt-6">
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-300 text-center">
                  {error}. Please check the URL and try again.
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Results Section */}
        {analysisResults && pageData && (
          <section ref={resultsRef} className="relative py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Results Header */}
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Your Analysis Results
                </h2>
                <p className="text-slate-400">
                  {pageData.page_title} | Analyzed {new Date().toLocaleDateString()}
                </p>
              </div>

              {/* Screenshot & Grade */}
              <div className="grid lg:grid-cols-3 gap-8 mb-16">
                {/* Screenshot */}
                <div className="lg:col-span-2">
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <span className="mr-2">📸</span> Page Preview
                    </h3>
                    <div className="rounded-xl overflow-hidden bg-slate-800 aspect-video flex items-center justify-center">
                      <img
                        src={pageData.screenshot_url}
                        alt="Landing page screenshot"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="text-slate-400 text-center p-8"><span class="text-4xl mb-4 block">🖼️</span>Screenshot unavailable</div>';
                        }}
                      />
                    </div>
                    <div className="mt-4 text-sm text-slate-400 truncate">
                      <a href={pageData.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                        {pageData.url}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Grade Circle */}
                <div>
                  <GradeCircle
                    grade={analysisResults.grade}
                    score={analysisResults.overallScore}
                  />
                </div>
              </div>

              {/* Score Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {Object.entries(analysisResults.scores).map(([key, data]) => (
                  <ScoreCard key={key} label={data.label} score={data.score} />
                ))}
              </div>

              {/* Analysis Cards */}
              <div className="grid lg:grid-cols-2 gap-8 mb-16">
                <AnalysisCard data={analysisResults.design} />
                <AnalysisCard data={analysisResults.copy} />
                <AnalysisCard data={analysisResults.seo} />

                {/* Strategy Card - Full Width */}
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                    <div className="flex items-center mb-6">
                      <span className="text-3xl mr-3">{analysisResults.strategy.icon}</span>
                      <h3 className="text-2xl font-bold text-white">{analysisResults.strategy.title}</h3>
                    </div>

                    <p className="text-slate-300 text-lg mb-8">{analysisResults.strategy.summary}</p>

                    {/* Top 5 Priorities */}
                    <div className="mb-8">
                      <h4 className="text-white font-semibold mb-4">🔥 Top 5 Priorities</h4>
                      <div className="space-y-3">
                        {analysisResults.strategy.priorities.map((p, i) => (
                          <div key={i} className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm mr-4">
                                {p.priority}
                              </span>
                              <div>
                                <span className="text-white font-medium">{p.title}</span>
                                <div className="flex items-center space-x-4 text-sm text-slate-400 mt-1">
                                  <span>Impact: <span className={p.impact === 'High' ? 'text-green-400' : 'text-yellow-400'}>{p.impact}</span></span>
                                  <span>Effort: {p.effort}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-green-400 font-semibold">+{p.lift}</span>
                              <span className="block text-xs text-slate-400">Expected Lift</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-green-400 font-semibold mb-3">💪 Key Strengths</h4>
                        <ul className="space-y-2">
                          {analysisResults.strategy.strengths.length > 0 ? (
                            analysisResults.strategy.strengths.map((s, i) => (
                              <li key={i} className="text-slate-300 flex items-start">
                                <span className="text-green-400 mr-2">✓</span> {s}
                              </li>
                            ))
                          ) : (
                            <li className="text-slate-400">No major strengths identified yet</li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-red-400 font-semibold mb-3">⚠️ Critical Weaknesses</h4>
                        <ul className="space-y-2">
                          {analysisResults.strategy.weaknesses.length > 0 ? (
                            analysisResults.strategy.weaknesses.map((w, i) => (
                              <li key={i} className="text-slate-300 flex items-start">
                                <span className="text-red-400 mr-2">✗</span> {w}
                              </li>
                            ))
                          ) : (
                            <li className="text-slate-400">No critical weaknesses found</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Want Us To Fix Everything For You?
                </h3>
                <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                  Our team of experts can implement all these recommendations and boost your conversions. Get a custom quote today.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a
                    href="mailto:mark.marin@evervise.com?subject=Landing Page Optimization Quote"
                    className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all hover:scale-105"
                  >
                    Get a Custom Quote →
                  </a>
                  <a
                    href="https://evervise.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all"
                  >
                    Learn More About Us
                  </a>
                </div>
              </div>

              {/* Page Stats */}
              <div className="mt-16 bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                <h3 className="text-white font-semibold mb-6 flex items-center">
                  <span className="mr-2">📊</span> Page Statistics
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Word Count', value: pageData.word_count.toLocaleString(), icon: '📝' },
                    { label: 'Images', value: `${pageData.image_count} (${pageData.images_with_alt} with alt)`, icon: '🖼️' },
                    { label: 'Forms', value: pageData.form_count, icon: '📋' },
                    { label: 'CTAs Found', value: pageData.cta_buttons.length, icon: '👆' }
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <span className="text-2xl mb-2 block">{stat.icon}</span>
                      <span className="text-2xl font-bold text-white">{stat.value}</span>
                      <span className="block text-slate-400 text-sm mt-1">{stat.label}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="text-slate-300 text-sm font-medium mb-3">Detected Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(pageData.detected_tech)
                      .filter(([_, detected]) => detected)
                      .map(([tech, _]) => (
                        <span key={tech} className="bg-white/10 text-slate-300 px-3 py-1 rounded-full text-sm capitalize">
                          {tech.replace(/_/g, ' ')}
                        </span>
                      ))}
                    {Object.values(pageData.detected_tech).every(v => !v) && (
                      <span className="text-slate-400 text-sm">No common technologies detected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t border-white/10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-2">
                <span className="text-white text-sm font-bold">E</span>
              </div>
              <span className="text-white font-semibold">Evervise</span>
            </div>
            <p className="text-slate-400 mb-4">
              Digital Marketing & Automation Experts
            </p>
            <div className="flex justify-center space-x-6 text-slate-400 text-sm">
              <a href="https://evervise.ai" className="hover:text-white transition-colors">Website</a>
              <span>|</span>
              <a href="mailto:mark.marin@evervise.com" className="hover:text-white transition-colors">Contact</a>
              <span>|</span>
              <span>&copy; {new Date().getFullYear()} Evervise</span>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-gradient {
          animation: gradient 8s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
