import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { ArrowLeft, ShoppingBag, Heart, Share2 } from 'lucide-react';
import Link from 'next/link';

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
                        <div className="aspect-[4/5] w-full bg-gray-50 rounded-2xl overflow-hidden relative">
                            <img
                                src={design.image_url}
                                alt={design.prompt_text}
                                className="w-full h-full object-cover object-center"
                            />
                        </div>
                    </div>

                    {/* Product Info (Right) */}
                    <div className="mt-10 lg:mt-0 lg:pl-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-2">Custom Design T-Shirt</h1>
                            <p className="text-lg text-gray-500 capitalize">{design.base_color} Edition</p>
                            <div className="mt-4 flex items-end gap-4">
                                <p className="text-3xl font-medium text-gray-900">$49.99</p>
                                <p className="text-sm text-gray-500 mb-1.5">MRP incl. of all taxes</p>
                            </div>
                        </div>

                        <div className="prose prose-sm text-gray-500 mb-8">
                            <p>
                                A unique, AI-generated design featuring "{design.prompt_text}".
                                Printed on high-quality, 100% organic cotton.
                                Designed by {design.user_email?.split('@')[0] || 'Community Member'}.
                            </p>
                        </div>

                        {/* Color Selector */}
                        <div className="mb-8">
                            <h3 className="text-sm font-medium text-gray-900 mb-4">Color</h3>
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded-full border border-gray-200 ring-2 ring-offset-2 ring-gray-900"
                                    style={{ backgroundColor: design.base_color === 'White' ? '#FFFFFF' : design.base_color }}
                                />
                                <span className="text-sm text-gray-600">{design.base_color}</span>
                            </div>
                        </div>

                        {/* Size Selector */}
                        <div className="mb-10">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">Size Guide</a>
                            </div>
                            <div className="grid grid-cols-6 gap-3">
                                {['XS', 'S', 'M', 'L', 'XL', '2X'].map((size) => (
                                    <button
                                        key={size}
                                        className={`flex items-center justify-center py-3 border rounded-lg text-sm font-medium transition-all
                                            ${size === 'L'
                                                ? 'border-gray-900 bg-gray-900 text-white'
                                                : 'border-gray-200 text-gray-900 hover:border-gray-300'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button className="flex-1 bg-gray-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-gray-200">
                                Add to Cart
                            </button>
                            <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
                                <Share2 size={24} />
                            </button>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-12 border-t border-gray-100 pt-8 space-y-4">
                            <div className="flex gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <CheckIcon />
                                    <span>100% Cotton</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckIcon />
                                    <span>Machine Washable</span>
                                </div>
                            </div>
                        </div>

                    </div>
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
