"use client"
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ArrowRight, Sparkles, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function DesignGallery() {
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchDesigns = async () => {
            const { data, error } = await supabase
                .from('designs')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setDesigns(data);
            }
            setLoading(false);
        };

        fetchDesigns();
    }, []);

    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-6 py-24">
                <div className="flex justify-between items-end mb-12">
                    <div className="h-8 w-48 bg-gray-100 rounded-lg animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-4">
                            <div className="aspect-[4/5] bg-gray-100 rounded-xl animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                                <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (designs.length === 0) return null;

    return (
        <section className="w-full max-w-7xl mx-auto px-6 py-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm tracking-wide uppercase">
                        <Sparkles size={14} />
                        <span>Curated Collection</span>
                    </div>
                    <h2 className="text-4xl font-light tracking-tight text-gray-900">Latest Creations</h2>
                </div>
                <Link
                    href="/catalogue"
                    className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                    View all designs
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                {designs.map((design) => (
                    <Link key={design.id} href={`/product/${design.id}`} className="group block cursor-pointer">
                        {/* Image Card */}
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-gray-50 mb-6">
                            <img
                                src={design.image_url}
                                alt={design.prompt_text}
                                className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                            />

                            {/* Overlay & Action */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                <div className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-sm text-gray-900 hover:bg-white hover:scale-110 transition-all">
                                    <ArrowUpRight size={18} />
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-start gap-4">
                                <h3 className="text-base font-medium text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                    {design.prompt_text}
                                </h3>
                                <span className="text-base font-medium text-gray-900 shrink-0">$49.99</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500 capitalize">{design.base_color} Edition</p>

                                {/* Color Dot */}
                                <div
                                    className="w-3 h-3 rounded-full border border-gray-200 shadow-sm"
                                    style={{ backgroundColor: design.base_color === 'White' ? '#FFFFFF' : design.base_color }}
                                />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
