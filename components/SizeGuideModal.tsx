"use client";

import { useState } from 'react';
import { X, Ruler, Info } from 'lucide-react';

interface SizeGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
    const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

    if (!isOpen) return null;

    const measurements = {
        inches: [
            { size: 'XS', chest: '31-33', length: '27', shoulder: '16.5' },
            { size: 'S', chest: '34-36', length: '28', shoulder: '17' },
            { size: 'M', chest: '37-40', length: '29', shoulder: '18' },
            { size: 'L', chest: '41-44', length: '30', shoulder: '19' },
            { size: 'XL', chest: '45-48', length: '31', shoulder: '20' },
            { size: '2X', chest: '49-52', length: '32', shoulder: '21' },
        ],
        cm: [
            { size: 'XS', chest: '79-84', length: '68.5', shoulder: '42' },
            { size: 'S', chest: '86-91', length: '71', shoulder: '43' },
            { size: 'M', chest: '94-101', length: '73.5', shoulder: '46' },
            { size: 'L', chest: '104-112', length: '76', shoulder: '48' },
            { size: 'XL', chest: '114-122', length: '79', shoulder: '51' },
            { size: '2X', chest: '124-132', length: '81', shoulder: '53' },
        ]
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <Ruler size={20} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Size Guide</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">

                    {/* Unit Toggle */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-gray-100 p-1 rounded-xl inline-flex">
                            <button
                                onClick={() => setUnit('inches')}
                                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${unit === 'inches'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Inches
                            </button>
                            <button
                                onClick={() => setUnit('cm')}
                                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${unit === 'cm'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Centimeters
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 mb-8">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Size</th>
                                    <th className="px-6 py-4">Chest</th>
                                    <th className="px-6 py-4">Length</th>
                                    <th className="px-6 py-4">Shoulder</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {measurements[unit].map((row) => (
                                    <tr key={row.size} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-gray-900">{row.size}</td>
                                        <td className="px-6 py-4 text-gray-600">{row.chest}</td>
                                        <td className="px-6 py-4 text-gray-600">{row.length}</td>
                                        <td className="px-6 py-4 text-gray-600">{row.shoulder}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Measurement Tips */}
                    <div className="bg-indigo-50/50 rounded-xl p-5 flex gap-4 items-start">
                        <Info className="text-indigo-600 shrink-0 mt-0.5" size={20} />
                        <div className="space-y-2">
                            <h4 className="font-medium text-indigo-900">How to Measure</h4>
                            <ul className="text-sm text-indigo-800/80 space-y-1 list-disc list-inside">
                                <li><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</li>
                                <li><strong>Length:</strong> Measure from the highest point of the shoulder down to the hem.</li>
                                <li><strong>Fit Tip:</strong> If you're in between sizes, we recommend sizing up for a relaxed fit.</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
