// Landing Page - Dartfish-inspired dark theme with orange accents

import Link from 'next/link';
import Head from 'next/head';
import {
  SkiIcon,
  PlayIcon,
  CompareIcon,
  UploadIcon,
  CheckIcon
} from '../components/ui/Icons';
import Button from '../components/ui/Button';

export default function Home() {
  const features = [
    {
      icon: <PlayIcon className="w-8 h-8" />,
      title: 'Frame-by-Frame Playback',
      description: 'Analyze every movement with precise 0.25x, 0.5x, 0.75x speed control and frame stepping.',
    },
    {
      icon: <CompareIcon className="w-8 h-8" />,
      title: 'Side-by-Side Comparison',
      description: 'Compare two runs simultaneously with synchronized playback and sync points.',
    },
    {
      icon: <UploadIcon className="w-8 h-8" />,
      title: 'Easy Video Upload',
      description: 'Drag and drop videos - they are automatically compressed for fast streaming.',
    },
  ];

  const benefits = [
    'Built specifically for alpine skiing',
    'No software to install - works in your browser',
    'Athletes access only their own videos',
    'Works on any device - phone, tablet, or computer',
    'Simple enough for any coach to use',
    'Affordable pricing for club teams',
  ];

  return (
    <>
      <Head>
        <title>AlpineVideo - Video Analysis for Ski Racing</title>
        <meta name="description" content="The simplest, fastest way to compare ski runs. Video analysis built specifically for alpine skiing coaches and athletes." />
      </Head>

      <div className="min-h-screen bg-bg-primary">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-lg border-b border-border-color">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                  <SkiIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-text-primary">
                  Alpine<span className="text-orange-500">Video</span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/login" className="nav-link font-medium">
                  Log in
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-full mb-8">
                <SkiIcon className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-500">
                  Built for Alpine Skiing
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6">
                The Simplest Way to{' '}
                <span className="text-gradient">Compare Ski Runs</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
                Professional video analysis without the complexity.
                Upload, compare, and improve - it is that simple.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button variant="primary" size="lg">
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="secondary" size="lg">
                    See Features
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Video Preview */}
            <div className="mt-16 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent z-10 pointer-events-none" />
              <div className="relative rounded-2xl overflow-hidden border border-border-color shadow-2xl shadow-orange-500/10">
                <div className="aspect-video bg-bg-secondary flex items-center justify-center">
                  {/* Placeholder for demo video/image */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <PlayIcon className="w-10 h-10 text-orange-500" />
                    </div>
                    <p className="text-text-muted">Video comparison demo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-bg-secondary">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                Everything You Need, Nothing You Don&apos;t
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Focused on what matters most for ski coaches: quick, easy video comparison.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="card-hover p-6 text-center group"
                >
                  <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-6">
                  Why Teams Switch to AlpineVideo
                </h2>
                <p className="text-lg text-text-secondary mb-8">
                  Dartfish and other tools are powerful, but often too complex and expensive
                  for club-level teams. We built something simpler.
                </p>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckIcon className="w-4 h-4 text-orange-500" />
                      </div>
                      <span className="text-text-primary">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Comparison UI Preview */}
              <div className="relative">
                <div className="absolute -inset-4 bg-orange-500/5 rounded-3xl" />
                <div className="relative bg-bg-secondary rounded-2xl border border-border-color p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="aspect-video bg-bg-tertiary rounded-lg flex items-center justify-center">
                      <span className="text-text-muted text-sm">Run 1</span>
                    </div>
                    <div className="aspect-video bg-bg-tertiary rounded-lg flex items-center justify-center">
                      <span className="text-text-muted text-sm">Run 2</span>
                    </div>
                  </div>
                  {/* Fake scrubber */}
                  <div className="h-1 bg-bg-tertiary rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-orange-500 rounded-full" />
                  </div>
                  {/* Fake speed controls */}
                  <div className="flex items-center justify-center gap-2 mt-4">
                    {['0.25x', '0.5x', '0.75x', '1x'].map((speed, i) => (
                      <span
                        key={speed}
                        className={`px-3 py-1 text-xs rounded-full ${
                          i === 1
                            ? 'bg-orange-500 text-white'
                            : 'bg-bg-tertiary text-text-muted'
                        }`}
                      >
                        {speed}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-bg-secondary to-bg-primary">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-6">
              Ready to Improve Your Team&apos;s Performance?
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              Join ski teams who have simplified their video analysis workflow.
            </p>
            <Link href="/signup">
              <Button variant="primary" size="lg">
                Start Your Free Trial
              </Button>
            </Link>
            <p className="mt-4 text-sm text-text-muted">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-border-color">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <SkiIcon className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-text-primary">
                  Alpine<span className="text-orange-500">Video</span>
                </span>
              </div>
              <p className="text-sm text-text-muted">
                &copy; {new Date().getFullYear()} AlpineVideo. Built for ski racing.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
