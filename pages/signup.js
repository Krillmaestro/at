// Signup Page - Local Version (auto-login)

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Button from '../components/ui/Button';
import { SkiIcon, CheckIcon } from '../components/ui/Icons';

export default function Signup() {
  const router = useRouter();

  // Auto-redirect to dashboard in local mode
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <Head>
        <title>Sign up - AlpineVideo</title>
      </Head>

      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 group">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center group-hover:shadow-glow transition-shadow">
            <SkiIcon className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-text-primary">
            Alpine<span className="text-orange-500">Video</span>
          </span>
        </Link>

        {/* Auto-signup Card */}
        <div className="w-full max-w-md bg-bg-secondary border border-border-color rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckIcon className="w-8 h-8 text-success" />
          </div>

          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Local Mode Active
          </h1>
          <p className="text-text-secondary mb-6">
            No account needed - redirecting to dashboard...
          </p>

          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />

          <Link href="/dashboard">
            <Button variant="primary" className="w-full">
              Go to Dashboard Now
            </Button>
          </Link>
        </div>

        {/* Info Banner */}
        <div className="mt-8 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl max-w-md">
          <p className="text-sm text-orange-400 text-center">
            <strong>Local Mode:</strong> All data is stored in your browser.
            No server or account needed!
          </p>
        </div>
      </div>
    </>
  );
}
