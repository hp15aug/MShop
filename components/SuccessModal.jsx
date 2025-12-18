"use client"
import { Check, X } from 'lucide-react';

export default function SuccessModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-8 flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                        <Check size={32} strokeWidth={3} />
                    </div>

                    <h3 className="text-2xl font-light text-gray-900">Design Saved</h3>

                    <p className="text-gray-500">
                        Your masterpiece has been added to the catalogue.
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Continue Browsing
                    </button>
                </div>
            </div>
        </div>
    );
}
