'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui';
import { Avatar } from '@/components/ui';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-200 border-b ${scrolled ? 'bg-white/80 backdrop-blur-md border-gray-200 shadow-sm' : 'bg-white border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
              NH
            </div>
            <span className="font-bold text-lg text-gray-900">NextHire</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/leaderboard" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Leaderboard
            </Link>
            <Link href="/trainers" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Trainers
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 hover:bg-gray-50/80 p-2 rounded-btn transition"
                >
                  <Avatar src={user.profile_photo || undefined} name={user.email} size="sm" />
                  <span className="text-sm font-medium text-gray-700">{user.email}</span>
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-card shadow-lg">
                    <Link
                      href={
                        user.role === 'student'
                          ? '/student/dashboard'
                          : user.role === 'trainer'
                            ? '/trainer/dashboard'
                            : user.role === 'company'
                              ? '/company/dashboard'
                              : '/admin/dashboard'
                      }
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-red-50 font-medium"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none p-2"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-xl absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/leaderboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              onClick={() => setShowMobileMenu(false)}
            >
              Leaderboard
            </Link>
            <Link
              href="/trainers"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              onClick={() => setShowMobileMenu(false)}
            >
              Trainers
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center px-5 mb-3">
                  <Avatar src={user.profile_photo || undefined} name={user.email} size="sm" />
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-gray-800">{user.email}</div>
                    <div className="text-sm font-medium leading-none text-gray-500 mt-1 capitalize">{user.role}</div>
                  </div>
                </div>
                <div className="px-2 space-y-1">
                  <Link
                    href={
                      user.role === 'student'
                        ? '/student/dashboard'
                        : user.role === 'trainer'
                          ? '/trainer/dashboard'
                          : user.role === 'company'
                            ? '/company/dashboard'
                            : '/admin/dashboard'
                    }
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowMobileMenu(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-danger-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col px-5 space-y-3">
                <Link href="/auth/login" onClick={() => setShowMobileMenu(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setShowMobileMenu(false)}>
                  <Button className="w-full justify-center">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
