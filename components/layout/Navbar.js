// Navbar Component - Main navigation bar

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import {
  SkiIcon,
  UploadIcon,
  VideoIcon,
  CompareIcon,
  UserIcon,
  LogoutIcon,
  MenuIcon,
  CloseIcon,
} from '../ui/Icons';

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigation = [
    { name: 'Videos', href: '/dashboard', icon: VideoIcon },
    { name: 'Upload', href: '/upload', icon: UploadIcon },
    { name: 'Compare', href: '/compare', icon: CompareIcon },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const isActive = (path) => router.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-bg-primary/90 backdrop-blur-lg border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center group-hover:shadow-glow transition-shadow">
              <SkiIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary hidden sm:block">
              Alpine<span className="text-orange-500">Video</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                    ${isActive(item.href)
                      ? 'bg-orange-500/20 text-orange-500'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {/* Desktop User Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-bg-tertiary transition-colors"
              >
                <div className="w-8 h-8 bg-bg-tertiary rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-text-secondary" />
                </div>
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-bg-secondary border border-border-color rounded-xl shadow-lg z-20 animate-scaleIn origin-top-right">
                    <div className="py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                      >
                        <LogoutIcon className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-bg-tertiary transition-colors"
            >
              {mobileMenuOpen ? (
                <CloseIcon className="w-6 h-6 text-text-primary" />
              ) : (
                <MenuIcon className="w-6 h-6 text-text-primary" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-bg-secondary border-t border-border-color animate-slideUp">
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive(item.href)
                      ? 'bg-orange-500/20 text-orange-500'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            <hr className="border-border-color my-2" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
            >
              <LogoutIcon className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
