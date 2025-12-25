"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, LogOut, Search, Sparkles } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import AuthModal from './AuthModal';

export default function Header() {
    const [user, setUser] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [generationsLeft, setGenerationsLeft] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                fetchGenerationCount(user.id);
            }
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchGenerationCount(session.user.id);
            } else {
                setGenerationsLeft(null);
            }
        });

        const handleGenerationCreated = () => {
            if (user) {
                fetchGenerationCount(user.id);
            }
        };

        window.addEventListener('generation_created', handleGenerationCreated);

        return () => {
            subscription.unsubscribe();
            window.removeEventListener('generation_created', handleGenerationCreated);
        };
    }, [user]);

    const fetchGenerationCount = async (userId) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { count, error } = await supabase
            .from('generations')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', today.toISOString());

        if (!error && count !== null) {
            setGenerationsLeft(Math.max(0, 5 - count));
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsDropdownOpen(false);
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? 'bg-white/90 backdrop-blur-xl border-gray-200 py-3 shadow-sm' : 'bg-white/50 backdrop-blur-md border-transparent py-5'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    {/* Left: Brand */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-105">
                                <span className="font-bold text-lg">V</span>
                            </div>
                            <span className="text-lg font-semibold tracking-tight text-gray-900">Vision Shirt</span>
                        </Link>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button className="p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100">
                            <Search size={20} strokeWidth={1.5} />
                        </button>

                        <button className="p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 relative">
                            <ShoppingBag size={20} strokeWidth={1.5} />
                        </button>

                        <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

                        {user ? (
                            <div className="flex items-center gap-3 pl-1">
                                {generationsLeft !== null && (
                                    <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
                                        <Sparkles size={12} />
                                        {generationsLeft} left
                                    </div>
                                )}

                                <div className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-2 focus:outline-none group"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-medium text-sm border border-indigo-200 group-hover:shadow-md transition-all">
                                            {user.email?.charAt(0).toUpperCase()}
                                        </div>
                                    </button>

                                    {isDropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 origin-top-right">
                                                <div className="px-4 py-3 border-b border-gray-50">
                                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Signed in as</p>
                                                    <p className="text-sm text-gray-900 font-medium truncate mt-0.5">{user.email}</p>
                                                </div>
                                                <div className="py-1">
                                                    <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                        <User size={16} className="mr-3 text-gray-400" />
                                                        Profile
                                                    </Link>
                                                    <Link href="/orders" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                        <ShoppingBag size={16} className="mr-3 text-gray-400" />
                                                        Orders
                                                    </Link>
                                                </div>
                                                <div className="py-1 border-t border-gray-50">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                    >
                                                        <LogOut size={16} className="mr-3" />
                                                        Sign out
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="ml-2 px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-full transition-all shadow-sm hover:shadow-md"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onAuthSuccess={() => setIsAuthModalOpen(false)}
            />
        </>
    );
} 