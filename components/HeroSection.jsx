"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shirt, Send, LogIn, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import AuthModal from './AuthModal';
import PreviewModal from './PreviewModal';
import SuccessModal from './SuccessModal';

const HeroSection = ({ onDesignSaved }) => {
    // State management
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [prompt, setPrompt] = useState('');
    const [user, setUser] = useState(null);

    // UI State
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    // Data State
    const [generatedImage, setGeneratedImage] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

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
        { name: 'Classic Black', hex: '#000000' },
        { name: 'Crisp White', hex: '#FFFFFF' },
        { name: 'Navy Blue', hex: '#1E3A8A' },
        { name: 'Crimson Red', hex: '#DC2626' },
        { name: 'Forest Green', hex: '#059669' },
    ];

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

            // FIX: Ensure consistency. If API returns raw base64, prepend the PNG data URI prefix.
            // If it already has it, this check prevents double prefixing.
            let imageString = data.image;
            if (!imageString.startsWith('data:image')) {
                imageString = `data:image/png;base64,${imageString}`;
            }

            setGeneratedImage(imageString);

            // Dispatch event to update header count
            window.dispatchEvent(new Event('generation_created'));

        } catch (error) {
            console.error("Generation Error:", error);
            alert('Failed to generate design. Please try again.');
            setGeneratedImage('/tshirt.png');
            setIsPreviewOpen(true);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAccept = () => {
        handleSaveOrder();
    };

    const handleSaveOrder = async () => {
        setIsSaving(true);
        try {
            const selectedColorName = colors.find(c => c.hex === selectedColor)?.name || 'Black';

            const response = await fetch('/api/save-design', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    base64Image: generatedImage, // Sends the full data URI (validated in handleGenerate)
                    prompt,
                    color: selectedColorName,
                }),
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || 'Failed to process order');
            }

            // Redirect to Product Page
            router.push(`/product/${data.design.id}`);

            // Reset Flow (optional, since we are redirecting)
            setIsPreviewOpen(false);
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
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans text-gray-800">
            {/* Modals */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onAuthSuccess={() => setIsAuthModalOpen(false)}
            />

            <PreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                imageUrl={generatedImage}
                loading={isGenerating}
                onAccept={handleAccept}
                onRetry={handleGenerate}
            />

            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
            />



            {/* Main Content */}
            <div className="w-full max-w-xl flex flex-col items-center space-y-12">

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-light tracking-tight text-gray-900">Design Your Style</h1>
                    <p className="text-gray-500">Select a color and describe your vision.</p>
                </div>

                {/* T-Shirt Preview Area */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-linear-to-tr from-gray-200 to-gray-100 rounded-full blur-2xl opacity-50 group-hover:scale-110 transition-transform duration-700"></div>

                    <div className="relative drop-shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2">
                        <Shirt
                            size={200}
                            strokeWidth={0.75}
                            fill={selectedColor}
                            color={selectedColor === '#FFFFFF' ? '#e5e7eb' : selectedColor}
                            className="transition-colors duration-500 ease-in-out"
                        />
                        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-noise"></div>
                    </div>
                </div>

                {/* Color Palette */}
                <div className="flex items-center space-x-4 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100">
                    {colors.map((color) => (
                        <button
                            key={color.hex}
                            onClick={() => setSelectedColor(color.hex)}
                            className={`w-8 h-8 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-transform duration-200 hover:scale-110 ${selectedColor === color.hex ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' : ''
                                }`}
                            style={{ backgroundColor: color.hex }}
                            aria-label={`Select ${color.name}`}
                            title={color.name}
                        />
                    ))}
                </div>

                {/* Prompt Input Form */}
                <form onSubmit={handleGenerate} className="w-full relative max-w-2xl group">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={user ? "Describe your design " : "Login to create designs"}
                        disabled={!user || isGenerating}
                        className="w-full pl-8 pr-16 py-6 text-lg bg-white border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-gray-700 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />

                    {user ? (
                        <button
                            type="submit"
                            disabled={!prompt.trim() || isGenerating}
                            className="absolute right-3 top-3 bottom-3 aspect-square bg-gray-900 hover:bg-gray-800 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                            title="Generate Design"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsAuthModalOpen(true)}
                            className="absolute right-3 top-3 bottom-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 font-medium"
                        >
                            <span className="mr-2">Login</span>
                            <LogIn size={18} />
                        </button>
                    )}
                </form>

            </div>
        </div>
    );
};

export default HeroSection;