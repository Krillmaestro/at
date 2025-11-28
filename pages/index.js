import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to analyzer page after a brief moment
    const timer = setTimeout(() => {
      router.push('/analyzer');
    }, 100);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <Head>
        <title>Evervise | Landing Page Analyzer</title>
        <meta name="description" content="Free professional landing page audit powered by AI. Analyze design, copy, SEO, and conversion potential in 90 seconds." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        {/* Loading Animation */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
              <span className="text-white text-3xl font-bold">E</span>
            </div>
          </div>
          <h1 className="text-white text-2xl font-semibold mb-4">Evervise</h1>
          <p className="text-slate-400">Loading Landing Page Analyzer...</p>

          {/* Loading Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </>
  );
}
