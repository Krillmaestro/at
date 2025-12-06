// Login Page - Dark theme with orange accents

import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { SkiIcon } from '../components/ui/Icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Log in - AlpineVideo</title>
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

        {/* Login Card */}
        <div className="w-full max-w-md bg-bg-secondary border border-border-color rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-text-primary text-center mb-2">
            Welcome back
          </h1>
          <p className="text-text-secondary text-center mb-8">
            Log in to access your videos
          </p>

          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-lg">
              <p className="text-error text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={isLoading}
            >
              Log in
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link
              href="/signup"
              className="text-orange-500 hover:text-orange-400 transition-colors"
            >
              Create account
            </Link>
            <Link
              href="/forgot-password"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <Link
          href="/"
          className="mt-8 text-text-secondary hover:text-text-primary transition-colors text-sm"
        >
          &larr; Back to home
        </Link>
      </div>
    </>
  );
}
