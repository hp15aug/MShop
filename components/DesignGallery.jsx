"use client"
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

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
            <div className="w-full max-w-7xl mx-auto px-4 py-12">
                <h2 className="text-2xl font-light text-gray-900 mb-8">Latest Creations</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (designs.length === 0) return null;

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-16">
            <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-light tracking-tight text-gray-900">Browse Catalogue</h2>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hidden md:block">View all designs &rarr;</a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                {designs.map((design) => (
                    <a key={design.id} href={`/product/${design.id}`} className="group relative">
                        <div className="aspect-[4/5] w-full overflow-hidden rounded-lg bg-gray-100 relative">
                            <img
                                src={design.image_url}
                                alt={design.prompt_text}
                                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Overlay for better text readability if needed, or just hover effect */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                        </div>
                        <div className="mt-4 flex justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    <span aria-hidden="true" className="absolute inset-0" />
                                    <span className="line-clamp-1" title={design.prompt_text}>{design.prompt_text.toUpperCase()} T-SHIRT</span>
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 capitalize">{design.base_color} T-Shirt</p>
                            </div>
                            <p className="text-lg font-medium text-gray-900">$49.99</p>
                        </div>
                        <div className="mt-2 flex gap-2">
                            <div
                                className="w-4 h-4 rounded-full border border-gray-200"
                                style={{ backgroundColor: design.base_color === 'White' ? '#FFFFFF' : design.base_color }}
                                title={design.base_color}
                            />
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
