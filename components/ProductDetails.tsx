"use client";

import { useState } from 'react';
import { Share2, Check, Loader2, Ruler } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProductDetailsProps {
    design: {
        id: string;
        prompt_text: string;
        base_color: string;
        user_email: string;
        image_url: string;
    };
}

import OrderSuccessModal from './OrderSuccessModal';

import SizeGuideModal from './SizeGuideModal';

export default function ProductDetails({ design }: ProductDetailsProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [isOrdering, setIsOrdering] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [shippingDetails, setShippingDetails] = useState({
        name: '',
        address: '',
        phone: ''
    });
    const [orderId, setOrderId] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const router = useRouter();

    const handleBuyNowClick = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        setShowAddressForm(true);
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsOrdering(true);
        try {
            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    designId: design.id,
                    size: selectedSize,
                    shipmentDetails: shippingDetails
                }),
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || 'Failed to place order');
            }

            setOrderId(data.order.id);
            setShowAddressForm(false);
            setShowSuccessModal(true);

        } catch (error) {
            console.error("Order Error:", error);
            alert(`Failed to place order: ${(error as Error).message}`);
        } finally {
            setIsOrdering(false);
        }
    };

    const colors = [
        { name: 'Classic Black', hex: '#000000' },
        { name: 'Crisp White', hex: '#FFFFFF' },
        { name: 'Navy Blue', hex: '#1E3A8A' },
        { name: 'Crimson Red', hex: '#DC2626' },
        { name: 'Forest Green', hex: '#059669' },
    ];
    const colorHex = colors.find(c => c.name === design.base_color)?.hex || design.base_color;

    return (
        <div className="mt-10 lg:mt-0 lg:pl-8">
            <OrderSuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                orderId={orderId}
            />

            <SizeGuideModal
                isOpen={isSizeGuideOpen}
                onClose={() => setIsSizeGuideOpen(false)}
            />

            {showAddressForm ? (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Details</h2>
                    <form onSubmit={handlePlaceOrder} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                required
                                value={shippingDetails.name}
                                onChange={(e) => setShippingDetails({ ...shippingDetails, name: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                            <textarea
                                id="address"
                                required
                                rows={3}
                                value={shippingDetails.address}
                                onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                                placeholder="123 Main St, City, Country"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                required
                                value={shippingDetails.phone}
                                onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                                placeholder="+1 234 567 8900"
                            />
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={() => setShowAddressForm(false)}
                                className="flex-1 bg-white text-gray-900 border border-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isOrdering}
                                className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isOrdering ? <Loader2 className="animate-spin" /> : 'Place Order'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-2">{design.prompt_text.toUpperCase()} T-SHIRT</h1>
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
                                style={{ backgroundColor: colorHex === 'White' ? '#FFFFFF' : colorHex }}
                                title={design.base_color}
                            />
                            <span className="text-sm text-gray-600">{design.base_color}</span>
                        </div>
                    </div>

                    {/* Size Selector */}
                    <div className="mb-10">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-medium text-gray-900">Size</h3>
                            <button
                                onClick={() => setIsSizeGuideOpen(true)}
                                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium flex items-center gap-1"
                            >
                                <Ruler size={14} />
                                Size Guide
                            </button>
                        </div>
                        <div className="grid grid-cols-6 gap-3">
                            {['XS', 'S', 'M', 'L', 'XL', '2X'].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`flex items-center justify-center py-3 border rounded-lg text-sm font-medium transition-all
                                        ${selectedSize === size
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
                        <button
                            onClick={handleBuyNowClick}
                            disabled={isOrdering || !selectedSize}
                            className="flex-1 bg-gray-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            Buy Now
                        </button>
                        <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
                            <Share2 size={24} />
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-12 border-t border-gray-100 pt-8 space-y-4">
                        <div className="flex gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500" />
                                <span>100% Cotton</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500" />
                                <span>Machine Washable</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
