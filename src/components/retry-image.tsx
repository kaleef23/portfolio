"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import Image, { ImageProps } from "next/image";

interface RetryImageProps extends Omit<ImageProps, "src" | "alt"> {
    src: string;
    alt: string;
    maxRetries?: number;
    retryDelay?: number; // ms
    className?: string;
    setIsPortrait?: Dispatch<SetStateAction<boolean | null>>;
}

export default function RetryImage({
    src,
    alt,
    maxRetries = 3,
    retryDelay = 1500,
    className,
    setIsPortrait,
    ...props
}: RetryImageProps) {
    const [currentSrc, setCurrentSrc] = useState(src);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    // Retry logic
    useEffect(() => {
        if (error && retryCount < maxRetries) {
            const timer = setTimeout(() => {
                setCurrentSrc(`${src}?retry=${retryCount}`); // bust cache
                setError(false);
                setLoading(true);
                setRetryCount((c) => c + 1);
            }, retryDelay);

            return () => clearTimeout(timer);
        }
    }, [error, retryCount, maxRetries, retryDelay, src]);

    return (
        <div className="relative flex items-center justify-center">
            {loading && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                    <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-transparent animate-spin"></div>
                </div>
            )}

            {error && retryCount >= maxRetries && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <span className="text-gray-500 text-sm">Failed to load</span>
                </div>
            )}

            <Image
                {...props}
                src={currentSrc}
                alt={alt}
                className={`${className} ${loading ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}
                onLoadingComplete={(img) => {
                    setLoading(false);
                    // const isPortraitValue = img.naturalHeight > img.naturalWidth;
                    // console.log('Image loaded:', {
                    //     naturalWidth: img.naturalWidth,
                    //     naturalHeight: img.naturalHeight,
                    //     isPortrait: isPortraitValue
                    // });
                    // setIsPortrait?.(isPortraitValue);
                }}
                onError={() => {
                    setError(true);
                    setLoading(false);
                }}
            />
        </div>
    );
}
