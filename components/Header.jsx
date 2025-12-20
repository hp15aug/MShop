"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, LogOut, ChevronDown } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import AuthModal from './AuthModal';

export default function Header() {
    const [user, setUser] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [generationsLeft, setGenerationsLeft] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const supabase = createClient();

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
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo / Brand */}
                    <Link href="/" className="text-xl font-light tracking-tight text-gray-900">
                        <span className="font-semibold">Vision</span> Shirt
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:text-gray-900 transition-colors relative">
                            <ShoppingBag size={20} />
                            {/* Cart Badge (Mock) */}
                            {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4">
                                {generationsLeft !== null && (
                                    <span className="text-sm text-gray-500 hidden sm:inline-block">
                                        {generationsLeft} generations left
                                    </span>
                                )}

                                <div className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-1 focus:outline-none group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm group-hover:bg-indigo-200 transition-colors">
                                            {user.email?.charAt(0).toUpperCase()}
                                        </div>
                                        <ChevronDown
                                            size={16}
                                            className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {isDropdownOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setIsDropdownOpen(false)}
                                            ></div>
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                                                <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100 truncate">
                                                    {user.email}
                                                </div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <LogOut size={16} className="mr-2" />
                                                    Logout
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                                title="Login"
                            >
                                <User size={20} />
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
