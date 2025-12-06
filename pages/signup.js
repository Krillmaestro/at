// Signup Page - Dark theme with orange accents

import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { SkiIcon, CheckIcon } from '../components/ui/Icons';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <>
        <Head>
          <title>Check your email - AlpineVideo</title>
        </Head>

        <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckIcon className="w-10 h-10 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-4">
              Check your email
            </h1>
            <p className="text-text-secondary mb-8">
              We sent a confirmation link to <strong className="text-text-primary">{email}</strong>.
              Click the link to activate your account.
            </p>
            <Link href="/login">
              <Button variant="primary">
                Go to login
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Sign up - AlpineVideo</title>
      </Head>

      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 group">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center group-hover:shadow-glow transition-shadow">
            <SkiIcon className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-text-primary">
            Alpine<span className="text-orange-500">Video</span>
          </span>
        </Link>

        {/* Signup Card */}
        <div className="w-full max-w-md bg-bg-secondary border border-border-color rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-text-primary text-center mb-2">
            Create your account
          </h1>
          <p className="text-text-secondary text-center mb-8">
            Start analyzing your ski runs today
          </p>

          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-lg">
              <p className="text-error text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="Your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

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
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-orange-500 hover:text-orange-400 transition-colors"
            >
              Log in
            </Link>
          </p>
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
