import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { ArrowLeft, ShoppingBag, Heart, Share2 } from 'lucide-react';
import Link from 'next/link';

import ProductImage from '@/components/ProductImage';

import ProductDetails from '@/components/ProductDetails';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: design, error } = await supabase
        .from('designs')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !design) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Navigation */}
            <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back to Catalogue</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Heart size={20} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <ShoppingBag size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">

                    {/* Image Gallery (Left) */}
                    <div className="product-image-gallery flex flex-col-reverse lg:flex-row gap-4">
                        {/* Thumbnail Strip (Mock) */}
                        <div className="hidden lg:flex flex-col gap-4 w-20">

                            <button className={`aspect-square rounded-lg border-2 border-transparent overflow-hidden hover:border-gray-300 transition-all`}>
                                <img src={design.image_url} alt="Thumbnail" className="w-full h-full object-cover" />
                            </button>

                        </div>

                        {/* Main Image */}
                        <ProductImage src={design.image_url} alt={design.prompt_text} />
                    </div>

                    {/* Product Info (Right) */}
                    <ProductDetails design={design} />
                </div>
            </main>
        </div>
    );
}

function CheckIcon() {
    return (
        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    )
}
