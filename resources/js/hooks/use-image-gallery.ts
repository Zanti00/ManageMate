import { useCallback, useEffect, useMemo, useState } from 'react';

const DEFAULT_PLACEHOLDER =
    'https://readdy.ai/api/search-image?query=modern%20technology%20conference%20summit%20with%20large%20screens%20displaying%20innovative%20tech%20presentations%20students%20and%20professionals%20networking%20in%20bright%20spacious%20university%20auditorium%20with%20stage%20and%20seating&width=1200&height=400&seq=tech-summit-detail-001&orientation=landscape';

type UseImageGalleryOptions = {
    images?: Array<string | null | undefined>;
    imagePath?: string | null;
    fallbackImage?: string;
    resetKey?: string | number;
};

export function useImageGallery({
    images = [],
    imagePath,
    fallbackImage = DEFAULT_PLACEHOLDER,
    resetKey,
}: UseImageGalleryOptions = {}) {
    const galleryImages = useMemo(() => {
        const normalized = images.filter((path): path is string => !!path);

        if (normalized.length > 0) {
            return normalized;
        }

        if (imagePath) {
            return [imagePath];
        }

        return [fallbackImage];
    }, [images, imagePath, fallbackImage]);

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const resetSignal = resetKey ?? galleryImages.join('|');

    useEffect(() => {
        setActiveImageIndex(0);
        setLightboxOpen(false);
    }, [resetSignal]);

    const goToPreviousImage = useCallback(() => {
        setActiveImageIndex((prev) =>
            prev === 0 ? galleryImages.length - 1 : prev - 1,
        );
    }, [galleryImages.length]);

    const goToNextImage = useCallback(() => {
        setActiveImageIndex((prev) =>
            prev === galleryImages.length - 1 ? 0 : prev + 1,
        );
    }, [galleryImages.length]);

    const resolveImageUrl = useCallback((path: string) => {
        return path.startsWith('http') ? path : `/storage/${path}`;
    }, []);

    const openLightbox = useCallback(() => setLightboxOpen(true), []);
    const closeLightbox = useCallback(() => setLightboxOpen(false), []);

    return {
        displayImages: galleryImages,
        activeImageIndex,
        goToPreviousImage,
        goToNextImage,
        setActiveImageIndex,
        resolveImageUrl,
        lightboxOpen,
        openLightbox,
        closeLightbox,
        hasMultipleImages: galleryImages.length > 1,
    };
}
