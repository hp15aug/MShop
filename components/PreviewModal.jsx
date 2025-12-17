"use client"
import { X, Check, RefreshCw } from 'lucide-react';

export default function PreviewModal({ isOpen, onClose, imageUrl, onAccept, onRetry, loading }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">

                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Your Design Preview</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 flex flex-col items-center bg-gray-50">
                    {imageUrl ? (
                        <div className="relative w-full aspect-square bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center overflow-hidden">
                            <img
                                src={imageUrl}
                                alt="Generated Design"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-full aspect-square bg-gray-100 rounded-xl animate-pulse flex items-center justify-center text-gray-400">
                            Generating...
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={onRetry}
                        disabled={loading}
                        className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                        Try Again
                    </button>
                    <button
                        onClick={onAccept}
                        disabled={loading || !imageUrl}
                        className="flex-1 py-3 px-4 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                    >
                        <Check size={18} />
                        Accept & Continue
                    </button>
                </div>

            </div>
        </div>
    );
}