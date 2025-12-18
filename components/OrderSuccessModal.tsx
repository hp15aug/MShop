"use client";

import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OrderSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string | null;
}

export default function OrderSuccessModal({ isOpen, onClose, orderId }: OrderSuccessModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    const handleContinueShopping = () => {
        onClose();
        router.push('/');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-8 flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 animate-bounce">
                        <Check size={40} strokeWidth={3} />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-3xl font-bold text-gray-900">Order Placed!</h3>
                        <p className="text-gray-500 text-lg">
                            Thank you for your purchase.
                        </p>
                    </div>

                    {orderId && (
                        <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 w-full">
                            <p className="text-sm text-gray-500 mb-1">Order ID</p>
                            <p className="font-mono text-gray-900 font-medium break-all select-all">
                                {orderId}
                            </p>
                        </div>
                    )}

                    <div className="w-full pt-2">
                        <button
                            onClick={handleContinueShopping}
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-gray-200"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
