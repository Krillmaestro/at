import { useState, useRef } from 'react';
import Head from 'next/head';
import GradeCircle from '../components/analyzer/GradeCircle';
import ScoreCard from '../components/analyzer/ScoreCard';
import AnalysisCard from '../components/analyzer/AnalysisCard';
import ProgressIndicator from '../components/analyzer/ProgressIndicator';

export default function Analyzer() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [industry, setIndustry] = useState('');
  const [goal, setGoal] = useState('Generate Leads');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [pageData, setPageData] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const resultsRef = useRef(null);

  const steps = [
    { label: 'Connecting to page', icon: '🌐' },
    { label: 'Extracting content', icon: '📄' },
    { label: 'Analyzing design', icon: '🎨' },
    { label: 'Reviewing copy', icon: '✍️' },
    { label: 'Checking SEO', icon: '🔍' },
    { label: 'Building strategy', icon: '🚀' },
    { label: 'Generating report', icon: '📊' }
  ];

  const industries = [
    'SaaS', 'E-commerce', 'Real Estate', 'Coaching', 'Healthcare',
    'Finance', 'Education', 'Travel', 'Food & Restaurant', 'B2B Services',
    'Agency', 'Fitness', 'Legal', 'Technology', 'Consulting', 'Other'
  ];

  const goals = [
    'Generate Leads', 'Drive Sales', 'Get Sign-ups',
    'Book Appointments', 'Download Resource', 'Build Awareness', 'Other'
  ];

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url) return;

    setIsAnalyzing(true);
    setError(null);
    setCurrentStep(0);
    setAnalysisResults(null);
    setEmailSent(false);

    try {
      // Step 1: Connecting
      setCurrentStep(0);
      await new Promise(resolve => setTimeout(resolve, 400));

      // Step 2: Fetch page data
      setCurrentStep(1);
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          industry,
          goal,
          email: email || null,
          n8nWebhookUrl: n8nWebhookUrl || null
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to fetch page data');
      }

      const data = await response.json();
      setPageData(data.pageData);

      // Steps 3-6: Analysis phases
      for (let i = 2; i <= 5; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
      }

      // Step 7: Generate results
      setCurrentStep(6);
      await new Promise(resolve => setTimeout(resolve, 500));

      const results = generateAnalysis(data.pageData);
      setAnalysisResults(results);

      // If email was provided and n8n webhook configured, mark as sent
      if (email && n8nWebhookUrl) {
        setEmailSent(true);
      }

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateAnalysis = (data) => {
    const designScore = calculateDesignScore(data);
    const copyScore = calculateCopyScore(data);
    const seoScore = calculateSEOScore(data);
    const conversionScore = calculateConversionScore(data);
    const mobileScore = calculateMobileScore(data);
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
    let score = 4;
    if (data.h1_headings?.length > 0) score += 1;
    if (data.image_count > 3) score += 1;
    if (data.has_mobile_viewport) score += 1.5;
    if (data.cta_buttons?.length > 0) score += 1;
    if (data.form_count > 0) score += 1;
    if (data.video_count > 0) score += 0.5;
    return Math.min(10, Math.round(score));
  };

  const calculateCopyScore = (data) => {
    let score = 4;
    if (data.h1_headings?.length > 0 && data.h1_headings[0]?.length < 70) score += 1.5;
    if (data.h2_headings?.length >= 3) score += 1;
    if (data.word_count > 300 && data.word_count < 2500) score += 1;
    if (data.cta_buttons?.length >= 2) score += 1;
    if (data.has_urgency) score += 1;
    if (data.has_social_proof) score += 0.5;
    return Math.min(10, Math.round(score));
  };

  const calculateSEOScore = (data) => {
    let score = 3;
    if (data.page_title !== 'No title found') score += 1.5;
    if (data.page_title?.length <= 60 && data.page_title?.length > 20) score += 1;
    if (data.meta_description !== 'No meta description') score += 1.5;
    if (data.meta_description?.length <= 160 && data.meta_description?.length > 50) score += 1;
    if (data.h1_headings?.length === 1) score += 1;
    if (data.images_with_alt / (data.image_count || 1) > 0.5) score += 0.5;
    if (data.has_ssl) score += 0.5;
    return Math.min(10, Math.round(score));
  };

  const calculateConversionScore = (data) => {
    let score = 3;
    if (data.cta_buttons?.length > 0) score += 2;
    if (data.cta_buttons?.length >= 3) score += 1;
    if (data.form_count > 0) score += 2;
    if (data.has_social_proof) score += 1;
    if (data.has_urgency) score += 0.5;
    if (data.has_pricing) score += 0.5;
    return Math.min(10, Math.round(score));
  };

  const calculateMobileScore = (data) => {
    let score = 4;
    if (data.has_mobile_viewport) score += 4;
    if (data.html_size_kb < 500) score += 1;
    if (data.image_count < 20) score += 1;
    return Math.min(10, Math.round(score));
  };

  const calculateTrustScore = (data) => {
    let score = 4;
    if (data.has_ssl) score += 2;
    if (data.has_social_proof) score += 2;
    if (data.has_trust_badges) score += 1;
    if (data.social_links?.length > 0) score += 0.5;
    if (data.detected_tech?.google_analytics) score += 0.5;
    return Math.min(10, Math.round(score));
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
      data.has_mobile_viewport ? '✅ Mobile-responsive viewport configured' : '❌ Missing mobile viewport - critical issue!',
      data.image_count > 0 ? `✅ ${data.image_count} images found${data.video_count > 0 ? ` + ${data.video_count} videos` : ''}` : '❌ No images found - add visual content',
      data.cta_buttons?.length > 0 ? `✅ ${data.cta_buttons.length} call-to-action elements detected` : '❌ No clear CTA buttons found',
      data.form_count > 0 ? `✅ ${data.form_count} form(s) for lead capture` : '⚠️ No forms found - consider adding lead capture',
      data.h1_headings?.length === 1 ? '✅ Proper heading hierarchy (single H1)' : `⚠️ ${data.h1_headings?.length || 0} H1 headings (should be exactly 1)`,
      `📐 Page size: ${data.html_size_kb}KB ${data.html_size_kb < 200 ? '(excellent)' : data.html_size_kb < 500 ? '(good)' : '(consider optimizing)'}`
    ],
    recommendations: [
      !data.has_mobile_viewport && 'Add mobile viewport meta tag immediately',
      data.cta_buttons?.length < 2 && 'Add more prominent CTA buttons, especially above the fold',
      data.image_count < 3 && 'Add more visual content to engage visitors',
      data.form_count === 0 && 'Add a lead capture form with minimal fields',
      data.video_count === 0 && 'Consider adding an explainer video',
      'Ensure sufficient whitespace between sections'
    ].filter(Boolean).slice(0, 5)
  });

  const generateCopyAnalysis = (data, score) => ({
    title: 'Copywriting & Messaging',
    icon: '✍️',
    score,
    findings: [
      data.h1_headings?.length > 0 ? `✅ Headline: "${data.h1_headings[0]?.substring(0, 50)}${data.h1_headings[0]?.length > 50 ? '...' : ''}"` : '❌ No H1 headline found',
      data.word_count > 300 ? `✅ Content depth: ${data.word_count.toLocaleString()} words` : `⚠️ Light content: only ${data.word_count} words`,
      data.has_urgency ? '✅ Urgency/scarcity elements detected' : '⚠️ No urgency triggers - consider adding',
      data.cta_buttons?.length > 0 ? `✅ CTAs: ${data.cta_buttons.slice(0, 3).map(c => `"${c}"`).join(', ')}` : '❌ No actionable CTA copy',
      data.h2_headings?.length >= 3 ? `✅ Good structure with ${data.h2_headings.length} subheadings` : '⚠️ Add more subheadings for scannability'
    ],
    recommendations: [
      data.h1_headings?.length === 0 && 'Add a compelling headline addressing visitor pain points',
      !data.has_urgency && 'Add urgency elements (limited time offers, scarcity)',
      data.word_count < 300 && 'Expand copy with benefits, objection handling, and proof',
      'Focus on benefits over features in your copy',
      'Use action-oriented CTA text (Get, Start, Discover, Unlock)',
      !data.has_social_proof && 'Add testimonials or case studies near CTAs'
    ].filter(Boolean).slice(0, 5)
  });

  const generateSEOAnalysis = (data, score) => ({
    title: 'SEO & Technical',
    icon: '🔍',
    score,
    findings: [
      data.page_title !== 'No title found'
        ? `✅ Title: "${data.page_title.substring(0, 45)}${data.page_title.length > 45 ? '...' : ''}" (${data.page_title.length} chars)`
        : '❌ Missing title tag - critical for SEO',
      data.meta_description !== 'No meta description'
        ? `✅ Meta description (${data.meta_description.length} chars) ${data.meta_description.length > 160 ? '- too long!' : ''}`
        : '❌ Missing meta description',
      data.has_ssl ? '✅ SSL/HTTPS active (secure)' : '❌ No SSL - major security & SEO issue!',
      data.detected_tech?.google_analytics ? '✅ Google Analytics tracking enabled' : '⚠️ No analytics detected',
      `🖼️ Image optimization: ${data.images_with_alt}/${data.image_count} images have alt text`
    ],
    recommendations: [
      data.page_title === 'No title found' && 'Add a descriptive title tag (50-60 characters)',
      data.page_title?.length > 60 && 'Shorten title to under 60 characters',
      data.meta_description === 'No meta description' && 'Add compelling meta description (150-160 chars)',
      !data.has_ssl && 'Install SSL certificate immediately (affects rankings & trust)',
      !data.detected_tech?.google_analytics && 'Install Google Analytics to track performance',
      data.images_with_alt < data.image_count && 'Add descriptive alt text to all images'
    ].filter(Boolean).slice(0, 5)
  });

  const generateStrategyAnalysis = (data, score, grade) => ({
    title: 'Strategic Overview',
    icon: '🚀',
    score,
    grade,
    summary: `Your landing page scores ${score}/10 overall (Grade: ${grade}). ${
      score >= 7
        ? 'Solid foundation with clear optimization opportunities.'
        : score >= 5
        ? 'Several areas need attention to maximize conversions.'
        : 'Significant improvements needed for effective conversions.'
    }`,
    priorities: [
      {
        priority: 1,
        title: !data.has_ssl ? 'Install SSL certificate' : data.cta_buttons?.length === 0 ? 'Add clear CTAs' : 'Optimize CTA placement & copy',
        impact: 'High',
        effort: !data.has_ssl ? 'Low' : 'Medium',
        lift: !data.has_ssl ? '10-15%' : '15-25%'
      },
      {
        priority: 2,
        title: !data.has_social_proof ? 'Add social proof (testimonials)' : 'Enhance existing social proof',
        impact: 'High',
        effort: 'Medium',
        lift: '10-20%'
      },
      {
        priority: 3,
        title: data.form_count === 0 ? 'Add lead capture form' : 'Optimize form conversion',
        impact: 'High',
        effort: data.form_count === 0 ? 'Medium' : 'Low',
        lift: '15-30%'
      },
      {
        priority: 4,
        title: 'Improve headline copy',
        impact: 'High',
        effort: 'Low',
        lift: '10-30%'
      },
      {
        priority: 5,
        title: 'A/B test key page elements',
        impact: 'High',
        effort: 'Medium',
        lift: '20-40%'
      }
    ],
    strengths: [
      data.has_mobile_viewport && 'Mobile-responsive design',
      data.has_ssl && 'Secure HTTPS connection',
      data.form_count > 0 && 'Lead capture form present',
      data.cta_buttons?.length > 0 && 'Clear call-to-action elements',
      data.has_social_proof && 'Social proof present',
      data.detected_tech?.google_analytics && 'Analytics tracking enabled',
      data.has_trust_badges && 'Trust badges displayed'
    ].filter(Boolean),
    weaknesses: [
      !data.has_mobile_viewport && 'Not mobile-optimized',
      !data.has_ssl && 'No SSL/HTTPS security',
      data.form_count === 0 && 'No lead capture form',
      data.cta_buttons?.length === 0 && 'No clear call-to-action',
      !data.has_social_proof && 'No testimonials or social proof',
      !data.detected_tech?.google_analytics && 'No analytics tracking',
      !data.has_urgency && 'No urgency elements'
    ].filter(Boolean)
  });

  const handleNewAnalysis = () => {
    setUrl('');
    setPageData(null);
    setAnalysisResults(null);
    setError(null);
    setEmailSent(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>Landing Page Analyzer | Free Professional Audit | Evervise</title>
        <meta name="description" content="Get a free professional landing page audit powered by AI. Analyze design, copy, SEO, and conversion potential in 90 seconds." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-[#0a0a0f]">
        {/* Gradient Orbs Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-500/30 rounded-full blur-[128px]" />
          <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-[128px]" />
        </div>

        {/* Navigation */}
        <nav className="relative z-10 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <span className="text-white text-xl font-bold">E</span>
                </div>
                <span className="text-white text-xl font-semibold">Evervise</span>
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                title="Settings"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Settings Panel */}
        {showSettings && (
          <div className="relative z-10 border-b border-white/5 bg-white/5 backdrop-blur-xl">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <h3 className="text-white font-semibold mb-4">n8n Integration Settings</h3>
              <div>
                <label className="block text-slate-400 text-sm mb-2">
                  n8n Webhook URL (for email reports)
                </label>
                <input
                  type="url"
                  value={n8nWebhookUrl}
                  onChange={(e) => setN8nWebhookUrl(e.target.value)}
                  placeholder="https://your-n8n-instance.com/webhook/..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-slate-500 text-xs mt-2">
                  Paste your n8n form webhook URL here to enable email reports
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <header className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-full px-4 py-2 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-slate-300 text-sm">Free AI-Powered Analysis</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                Analyze Your
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Landing Page
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                Get instant insights on design, copy, SEO, and conversion potential.
                Results displayed live on this dashboard.
              </p>
            </div>

            {/* Analysis Form */}
            <form onSubmit={handleAnalyze} className="max-w-3xl mx-auto">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                {/* URL Input - Large */}
                <div className="mb-6">
                  <label className="block text-white text-sm font-medium mb-2">
                    Landing Page URL <span className="text-pink-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://yourwebsite.com/landing-page"
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                      disabled={isAnalyzing}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Email Input */}
                <div className="mb-6">
                  <label className="block text-white text-sm font-medium mb-2">
                    Email Address <span className="text-slate-500">(optional - for detailed report)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    disabled={isAnalyzing}
                  />
                </div>

                {/* Two Column Options */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Industry</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                      disabled={isAnalyzing}
                    >
                      <option value="" className="bg-slate-900">Select industry</option>
                      {industries.map(ind => (
                        <option key={ind} value={ind} className="bg-slate-900">{ind}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Primary Goal</label>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                      disabled={isAnalyzing}
                    >
                      {goals.map(g => (
                        <option key={g} value={g} className="bg-slate-900">{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isAnalyzing || !url}
                  className={`w-full py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                    isAnalyzing || !url
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-xl hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    <>
                      <span className="mr-2">🔍</span> Analyze Landing Page
                    </>
                  )}
                </button>

                {/* Trust indicators */}
                <div className="mt-6 flex flex-wrap justify-center gap-6 text-slate-500 text-sm">
                  <span className="flex items-center"><span className="mr-2">🔒</span> Secure</span>
                  <span className="flex items-center"><span className="mr-2">⚡</span> Instant Results</span>
                  <span className="flex items-center"><span className="mr-2">💰</span> 100% Free</span>
                </div>
              </div>
            </form>

            {/* Progress Indicator */}
            {isAnalyzing && (
              <div className="mt-8">
                <ProgressIndicator steps={steps} currentStep={currentStep} />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="max-w-3xl mx-auto mt-6">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-center">
                  <span className="font-medium">Error:</span> {error}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Results Section */}
        {analysisResults && pageData && (
          <section ref={resultsRef} className="relative z-10 py-16 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Results Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
                  <span className="text-green-400">✓</span>
                  <span className="text-green-400 text-sm font-medium">Analysis Complete</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                  Your Results
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  {pageData.page_title !== 'No title found' ? pageData.page_title : pageData.url}
                </p>
                {emailSent && email && (
                  <p className="text-purple-400 text-sm mt-4">
                    📧 Detailed report sent to {email}
                  </p>
                )}
              </div>

              {/* Screenshot & Grade Row */}
              <div className="grid lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2">
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold flex items-center">
                        <span className="mr-2">📸</span> Page Preview
                      </h3>
                      <a
                        href={pageData.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 text-sm hover:text-purple-300 transition-colors"
                      >
                        Visit Page →
                      </a>
                    </div>
                    <div className="rounded-xl overflow-hidden bg-slate-800/50 aspect-video">
                      <img
                        src={pageData.screenshot_url}
                        alt="Landing page screenshot"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-slate-400"><div class="text-center"><span class="text-4xl block mb-2">🖼️</span>Preview unavailable</div></div>';
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <GradeCircle grade={analysisResults.grade} score={analysisResults.overallScore} />
                </div>
              </div>

              {/* Score Cards Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                {Object.entries(analysisResults.scores).map(([key, data]) => (
                  <ScoreCard key={key} label={data.label} score={data.score} />
                ))}
              </div>

              {/* Analysis Cards */}
              <div className="grid lg:grid-cols-2 gap-6 mb-12">
                <AnalysisCard data={analysisResults.design} />
                <AnalysisCard data={analysisResults.copy} />
                <AnalysisCard data={analysisResults.seo} />

                {/* Strategy Card */}
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                    <div className="flex items-center mb-6">
                      <span className="text-3xl mr-3">🚀</span>
                      <h3 className="text-2xl font-bold text-white">Strategic Priorities</h3>
                    </div>
                    <p className="text-slate-300 text-lg mb-8">{analysisResults.strategy.summary}</p>

                    <div className="grid lg:grid-cols-5 gap-4 mb-8">
                      {analysisResults.strategy.priorities.map((p, i) => (
                        <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                              {p.priority}
                            </span>
                            <span className="text-green-400 text-sm font-semibold">+{p.lift}</span>
                          </div>
                          <p className="text-white text-sm font-medium mb-2">{p.title}</p>
                          <div className="flex items-center space-x-2 text-xs text-slate-400">
                            <span className={p.impact === 'High' ? 'text-green-400' : 'text-yellow-400'}>{p.impact}</span>
                            <span>•</span>
                            <span>{p.effort}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-green-500/5 rounded-xl p-4 border border-green-500/10">
                        <h4 className="text-green-400 font-semibold mb-3">💪 Strengths</h4>
                        <ul className="space-y-2">
                          {analysisResults.strategy.strengths.length > 0 ? (
                            analysisResults.strategy.strengths.map((s, i) => (
                              <li key={i} className="text-slate-300 text-sm flex items-start">
                                <span className="text-green-400 mr-2">✓</span> {s}
                              </li>
                            ))
                          ) : (
                            <li className="text-slate-500 text-sm">No major strengths identified</li>
                          )}
                        </ul>
                      </div>
                      <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/10">
                        <h4 className="text-red-400 font-semibold mb-3">⚠️ Areas to Improve</h4>
                        <ul className="space-y-2">
                          {analysisResults.strategy.weaknesses.length > 0 ? (
                            analysisResults.strategy.weaknesses.map((w, i) => (
                              <li key={i} className="text-slate-300 text-sm flex items-start">
                                <span className="text-red-400 mr-2">✗</span> {w}
                              </li>
                            ))
                          ) : (
                            <li className="text-slate-500 text-sm">No critical issues found</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Page Stats */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-12">
                <h3 className="text-white font-semibold mb-6">📊 Page Statistics</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { label: 'Words', value: pageData.word_count?.toLocaleString(), icon: '📝' },
                    { label: 'Images', value: pageData.image_count, icon: '🖼️' },
                    { label: 'Forms', value: pageData.form_count, icon: '📋' },
                    { label: 'CTAs', value: pageData.cta_buttons?.length, icon: '👆' },
                    { label: 'Videos', value: pageData.video_count || 0, icon: '🎬' },
                    { label: 'Page Size', value: `${pageData.html_size_kb}KB`, icon: '📦' }
                  ].map((stat, i) => (
                    <div key={i} className="text-center bg-white/5 rounded-xl p-4">
                      <span className="text-xl mb-1 block">{stat.icon}</span>
                      <span className="text-2xl font-bold text-white">{stat.value}</span>
                      <span className="block text-slate-400 text-xs mt-1">{stat.label}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-slate-400 text-sm font-medium mb-3">Detected Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {pageData.detected_tech?.framework && (
                      <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                        {pageData.detected_tech.framework}
                      </span>
                    )}
                    {pageData.detected_tech?.css && (
                      <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                        {pageData.detected_tech.css}
                      </span>
                    )}
                    {pageData.detected_tech?.google_analytics && (
                      <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm">
                        Google Analytics
                      </span>
                    )}
                    {pageData.detected_tech?.facebook_pixel && (
                      <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                        Facebook Pixel
                      </span>
                    )}
                    {pageData.detected_tech?.hubspot && (
                      <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm">
                        HubSpot
                      </span>
                    )}
                    {!pageData.detected_tech?.framework && !pageData.detected_tech?.google_analytics && (
                      <span className="text-slate-500 text-sm">No common technologies detected</span>
                    )}
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-10 text-center">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Want Us To Implement These Improvements?
                </h3>
                <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                  Our team of experts can optimize your landing page and boost conversions.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a
                    href="mailto:mark.marin@evervise.com?subject=Landing Page Optimization Quote"
                    className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all hover:scale-105 inline-flex items-center justify-center"
                  >
                    Get a Quote →
                  </a>
                  <button
                    onClick={handleNewAnalysis}
                    className="bg-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all inline-flex items-center justify-center"
                  >
                    Analyze Another Page
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/5 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-2">
                <span className="text-white text-sm font-bold">E</span>
              </div>
              <span className="text-white font-semibold">Evervise</span>
            </div>
            <p className="text-slate-500 text-sm">
              Digital Marketing & Automation Experts
            </p>
            <div className="flex justify-center space-x-4 text-slate-500 text-sm mt-4">
              <a href="https://evervise.ai" className="hover:text-white transition-colors">Website</a>
              <span>•</span>
              <a href="mailto:mark.marin@evervise.com" className="hover:text-white transition-colors">Contact</a>
              <span>•</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
