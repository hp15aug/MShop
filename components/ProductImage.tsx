"use client";
import { useState, useRef, useEffect } from "react";

export default function ProductImage({
    src,
    alt,
}: {
    src: string;
    alt: string;
}) {
    const [showZoom, setShowZoom] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const lensRef = useRef<HTMLDivElement>(null);
    const zoomRef = useRef<HTMLDivElement>(null);

    const frameRef = useRef<number | null>(null);
    const boundsRef = useRef<DOMRect | null>(null);

    // Configuration
    const ZOOM = 2.5;
    const LENS = 110;

    useEffect(() => {
        if (imgRef.current) {
            boundsRef.current = imgRef.current.getBoundingClientRect();
        }
    }, [showZoom]);

    const handleMove = (e: React.MouseEvent) => {
        const bounds = boundsRef.current;
        const lens = lensRef.current;
        const zoom = zoomRef.current;

        if (!bounds || !lens || !zoom) return;

        const { clientX, clientY } = e;

        if (frameRef.current) cancelAnimationFrame(frameRef.current);

        frameRef.current = requestAnimationFrame(() => {
            const { left, top, width, height } = bounds;

            let x = clientX - left;
            let y = clientY - top;

            x = Math.max(0, Math.min(x, width));
            y = Math.max(0, Math.min(y, height));

            const lensX = Math.max(
                0,
                Math.min(x - LENS / 2, width - LENS)
            );
            const lensY = Math.max(
                0,
                Math.min(y - LENS / 2, height - LENS)
            );

            // Move lens
            lens.style.transform = `translate(${lensX}px, ${lensY}px)`;

            // Convert to percentages (prevents whitespace issue)
            const percentX = lensX / (width - LENS);
            const percentY = lensY / (height - LENS);

            zoom.style.backgroundPosition = `${percentX * 100}% ${percentY * 100}%`;
        });
    };

    return (
        <div ref={containerRef} className="relative w-full z-20">
            {/* Image */}
            <div
                className="relative aspect-[4/5] rounded-2xl bg-gray-50 overflow-hidden cursor-crosshair"
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleMove}
            >
                <img
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    className="h-full w-full object-cover"
                    draggable={false}
                />

                {/* Lens */}
                <div
                    ref={lensRef}
                    className={`pointer-events-none absolute rounded-full border border-indigo-500/50 bg-indigo-500/20 backdrop-blur-sm transition-opacity duration-100 ${showZoom ? "opacity-100" : "opacity-0"
                        }`}
                    style={{
                        width: LENS,
                        height: LENS,
                        transform: "translate(-9999px, -9999px)",
                    }}
                />
            </div>

            {/* Zoom Window */}
            {showZoom && (
                <div
                    ref={zoomRef}
                    className="absolute top-0 left-[105%] hidden h-full w-[120%] rounded-2xl border border-gray-100 bg-white shadow-2xl lg:block"
                    style={{
                        backgroundImage: `url(${src})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: `${ZOOM * 100}%`,
                        backgroundPosition: "50% 50%",
                    }}
                />
            )}
        </div>
    );
}
