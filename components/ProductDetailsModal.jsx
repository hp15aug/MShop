import React, { useState, useEffect } from 'react';
import { X, DollarSign, Tag, FileText, Loader2, Sparkles } from 'lucide-react';

const ProductDetailsModal = ({ isOpen, onClose, onSave, defaultPrompt, isSaving }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(25);
    const [description, setDescription] = useState('');
    const [isSuggestingName, setIsSuggestingName] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setName('');
            setPrice(25);
            setDescription(defaultPrompt || '');
        }
    }, [isOpen, defaultPrompt]);

    if (!isOpen) return null;

    const handleSuggestName = async () => {
        setIsSuggestingName(true);
        try {
            const response = await fetch('/api/suggest-name', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: description || defaultPrompt }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setName(data.suggestedName);
        } catch (error) {
            console.error("Suggestion Error:", error);
        } finally {
            setIsSuggestingName(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            name,
            price: parseFloat(price),
            description: description.trim() || defaultPrompt
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                        disabled={isSaving}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Name Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Tag size={16} />
                            Product Name
                        </label>
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Cyberpunk City Tee"
                                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                            <button
                                type="button"
                                onClick={handleSuggestName}
                                disabled={isSuggestingName || !description}
                                className="absolute right-2 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Suggest Name with AI"
                            >
                                {isSuggestingName ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    <Sparkles size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Price Input */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <DollarSign size={16} />
                            Price
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <input
                                    type="range"
                                    min="20"
                                    max="40"
                                    step="1"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>$20</span>
                                    <span>$40</span>
                                </div>
                            </div>
                            <div className="w-20 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    min="20"
                                    max="40"
                                    value={price}
                                    onChange={(e) => setPrice(Math.min(40, Math.max(20, Number(e.target.value))))}
                                    className="w-full pl-6 pr-2 py-2 bg-white border border-gray-200 rounded-lg text-center font-medium focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <FileText size={16} />
                            Description <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={defaultPrompt}
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                        />
                        <p className="text-xs text-gray-400">
                            Defaults to your prompt if left empty.
                        </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={!name.trim() || isSaving}
                            className="w-full py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl font-medium shadow-lg shadow-gray-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Saving Product...
                                </>
                            ) : (
                                'Save Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductDetailsModal;
