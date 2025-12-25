"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Shirt, Send, LogIn, Loader2, Sparkles, Check, Palette } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import AuthModal from './AuthModal';
import PreviewModal from './PreviewModal';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';
import ProductDetailsModal from './ProductDetailsModal';

const HeroSection = ({ onDesignSaved }) => {
    // State management
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [prompt, setPrompt] = useState('');
    const textareaRef = useRef(null);
    const [user, setUser] = useState(null);

    // UI State
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Data State
    const [generatedImage, setGeneratedImage] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);

    const supabase = createClient();
    const router = useRouter();

    // Auth Listener
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Color Palette
    const colors = [
        { name: 'Classic Black', hex: '#000000', class: 'bg-black' },
        { name: 'Crisp White', hex: '#FFFFFF', class: 'bg-white border-gray-200' },
        { name: 'Navy Blue', hex: '#1E3A8A', class: 'bg-blue-900' },
        { name: 'Crimson Red', hex: '#DC2626', class: 'bg-red-600' },
        { name: 'Forest Green', hex: '#059669', class: 'bg-emerald-600' },
    ];

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 300)}px`;
        }
    }, [prompt]);

    const handleEnhancePrompt = async () => {
        if (!prompt.trim()) return;
        setIsEnhancing(true);
        try {
            const response = await fetch('/api/enhance-prompt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setPrompt(data.enhancedPrompt);
        } catch (error) {
            console.error("Enhancement Error:", error);
            // Optionally show a toast or small error, but don't block flow
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setIsPreviewOpen(true);
        setGeneratedImage(null);

        try {
            const selectedColorName = colors.find(c => c.hex === selectedColor)?.name || 'Black';

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, color: selectedColorName }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            let imageString = data.image;
            if (!imageString.startsWith('data:image')) {
                imageString = `data:image/png;base64,${imageString}`;
            }

            setGeneratedImage(imageString);
            window.dispatchEvent(new Event('generation_created'));

        } catch (error) {
            console.error("Generation Error:", error);
            setErrorMessage(error.message || 'Failed to generate design. Please try again.');
            setIsErrorModalOpen(true);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAccept = () => {
        setIsPreviewOpen(false);
        setIsProductDetailsOpen(true);
    };

    const handleFinalSave = async (details) => {
        setIsSaving(true);
        try {
            const selectedColorName = colors.find(c => c.hex === selectedColor)?.name || 'Black';

            const response = await fetch('/api/save-design', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    base64Image: generatedImage,
                    prompt,
                    color: selectedColorName,
                    ...details // name, price, description
                }),
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || 'Failed to process order');
            }

            router.push(`/product/${data.design.id}`);

            setIsProductDetailsOpen(false);
            setPrompt('');
            setGeneratedImage(null);
            if (onDesignSaved) onDesignSaved();

        } catch (error) {
            console.error("Save Error:", error);
            alert(`Failed to save design: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <section className="relative min-h-[90vh] mt-20 flex flex-col items-center justify-center overflow-hidden bg-white selection:bg-indigo-50 selection:text-indigo-900">
            {/* Background Elements - Subtle & Premium */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-white to-white opacity-80"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
            </div>

            {/* Modals */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={() => setIsAuthModalOpen(false)} />
            <PreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} imageUrl={generatedImage} loading={isGenerating} onAccept={handleAccept} onRetry={handleGenerate} />
            <ProductDetailsModal
                isOpen={isProductDetailsOpen}
                onClose={() => setIsProductDetailsOpen(false)}
                onSave={handleFinalSave}
                defaultPrompt={prompt}
                isSaving={isSaving}
            />
            <SuccessModal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} />
            <ErrorModal isOpen={isErrorModalOpen} onClose={() => setIsErrorModalOpen(false)} message={errorMessage} />

            <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center text-center space-y-12 md:space-y-16">

                {/* Typography & Value Prop */}
                <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs font-medium text-gray-600 mb-4">
                        <Sparkles size={12} className="text-indigo-500" />
                        <span>AI-Powered Fashion Design</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-gray-900 leading-[1.1]">
                        Wear Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">Imagination</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
                        Transform your ideas into premium custom apparel instantly.
                        <br className="hidden md:block" />
                        Professional quality, sustainably made, uniquely yours.
                    </p>
                </div>

                {/* Interactive Core */}
                <div className="w-full max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">

                    {/* Left: Product Preview */}
                    <div className="relative group flex justify-center order-2 md:order-1">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/50 to-blue-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="relative transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-2">
                            {/* Shadow for depth */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/5 blur-xl rounded-full"></div>
                            <Shirt
                                size={320}
                                strokeWidth={0.5}
                                fill={selectedColor}
                                color={selectedColor === '#FFFFFF' ? '#e5e7eb' : selectedColor}
                                className="drop-shadow-2xl transition-colors duration-500"
                            />
                        </div>
                    </div>

                    {/* Right: Controls */}
                    <div className="flex flex-col space-y-8 order-1 md:order-2 text-left">

                        {/* Color Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                <Palette size={14} className="text-gray-400" />
                                Select Base Color
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {colors.map((color) => (
                                    <button
                                        key={color.hex}
                                        onClick={() => setSelectedColor(color.hex)}
                                        className={`group relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border border-black/10 ${selectedColor === color.hex
                                            ? 'ring-2 ring-offset-2 ring-gray-900 scale-110'
                                            : 'hover:scale-110 hover:ring-1 hover:ring-offset-1 hover:ring-gray-200'
                                            } ${color.class}`}
                                        title={color.name}
                                    >
                                        {selectedColor === color.hex && (
                                            <Check size={14} className={`stroke-2 ${color.hex === '#FFFFFF' ? 'text-gray-900' : 'text-white'}`} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input & Action */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-900">
                                Describe Your Design
                            </label>
                            <form onSubmit={handleGenerate} className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                                <div className="relative flex items-center">
                                    <textarea
                                        ref={textareaRef}
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleGenerate(e);
                                            }
                                        }}
                                        placeholder={user ? "A cyberpunk cat " : "Login to start creating"}
                                        disabled={!user || isGenerating}
                                        rows={1}
                                        className="w-full pl-6 pr-32 py-5 text-lg bg-white border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed resize-none overflow-hidden min-h-[72px] max-h-[300px]"
                                    />

                                    <div className="absolute right-2 bottom-2 flex items-center gap-2">
                                        {user ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={handleEnhancePrompt}
                                                    disabled={!prompt.trim() || isGenerating || isEnhancing}
                                                    className="h-14 w-14 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-95"
                                                    title="Enhance with AI"
                                                >
                                                    {isEnhancing ? (
                                                        <Loader2 className="animate-spin" size={20} />
                                                    ) : (
                                                        <Sparkles size={20} />
                                                    )}
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={!prompt.trim() || isGenerating || isEnhancing}
                                                    className="h-14 px-6 bg-gray-900 hover:bg-black text-white rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-95 font-medium"
                                                >
                                                    {isGenerating ? (
                                                        <Loader2 className="animate-spin" size={18} />
                                                    ) : (
                                                        <>
                                                            {/* <span></span> */}
                                                            <Send size={16} />
                                                        </>
                                                    )}
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setIsAuthModalOpen(true)}
                                                className="h-14 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 font-medium"
                                            >
                                                <span>Login</span>
                                                <LogIn size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                            <p className="text-xs text-gray-400 pl-1">
                                Try: "Vintage japanese poster style" or "Minimalist geometric mountains"
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;