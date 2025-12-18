"use client";
import { useState } from 'react';

export default function ProductImage({ src, alt }: { src: string, alt: string }) {
    const [zoom, setZoom] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setPosition({ x, y });
    };

    return (
        <div
            className="aspect-[4/5] w-full bg-gray-50 rounded-2xl overflow-hidden relative cursor-crosshair"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMouseMove}
        >
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover object-center transition-transform duration-200 ease-out ${zoom ? 'scale-[2.5]' : 'scale-100'}`}
                style={zoom ? { transformOrigin: `${position.x}% ${position.y}%` } : undefined}
            />
        </div>
    );
}
