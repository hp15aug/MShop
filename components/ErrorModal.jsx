"use client"
import { AlertCircle, X } from 'lucide-react';

export default function ErrorModal({ isOpen, onClose, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-8 flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
                        <AlertCircle size={32} strokeWidth={2} />
                    </div>

                    <h3 className="text-2xl font-light text-gray-900">Oops!</h3>

                    <p className="text-gray-500">
                        {message || "Something went wrong. Please try again."}
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
