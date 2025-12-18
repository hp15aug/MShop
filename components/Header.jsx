"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import AuthModal from './AuthModal';

export default function Header() {
    const [user, setUser] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
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
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm">
                                    {user.email?.charAt(0).toUpperCase()}
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
