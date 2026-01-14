import React from 'react';

export type ImageSlotValue = string | null;

export type UseImageSlotsOptions = {
    slotCount: number;
    initialExisting?: ImageSlotValue[];
    maxFileSizeBytes?: number;
    maxFileSizeMessage?: string;
    existingPreviewResolver?: (path: string) => string;
};

export type UseImageSlotsResult = {
    files: (File | null)[];
    existingImages: ImageSlotValue[];
    imagePreviews: (string | null)[];
    imageError: string | null;
    setImageError: React.Dispatch<React.SetStateAction<string | null>>;
    fileInputs: React.MutableRefObject<(HTMLInputElement | null)[]>;
    handleCardClick: (index: number) => void;
    handleImageChange: (index: number, files: FileList | null) => void;
    handleRemoveImage: (index: number) => void;
    hasNewUploads: boolean;
};

const DEFAULT_SIZE_MESSAGE = 'Images must be 1MB or smaller.';

const useImageSlots = ({
    slotCount,
    initialExisting = [],
    maxFileSizeBytes,
    maxFileSizeMessage = DEFAULT_SIZE_MESSAGE,
    existingPreviewResolver,
}: UseImageSlotsOptions): UseImageSlotsResult => {
    const resolveExistingPreview = React.useCallback(
        (path: string) => {
            if (!path) return null;
            if (existingPreviewResolver) {
                return existingPreviewResolver(path);
            }

            return path;
        },
        [existingPreviewResolver],
    );

    const normalizeExisting = React.useCallback(
        (values: ImageSlotValue[] = []) => {
            const normalized = Array(slotCount).fill(null) as ImageSlotValue[];

            values.slice(0, slotCount).forEach((value, index) => {
                normalized[index] = value ?? null;
            });

            return normalized;
        },
        [slotCount],
    );

    const normalizedExisting = React.useMemo(
        () => normalizeExisting(initialExisting ?? []),
        [initialExisting, normalizeExisting],
    );

    const [files, setFiles] = React.useState<(File | null)[]>(() =>
        Array(slotCount).fill(null),
    );
    const [existingImages, setExistingImages] =
        React.useState<ImageSlotValue[]>(normalizedExisting);
    const [imagePreviews, setImagePreviews] = React.useState<(string | null)[]>(
        () =>
            normalizedExisting.map((path) =>
                path ? resolveExistingPreview(path) : null,
            ),
    );
    const [imageError, setImageError] = React.useState<string | null>(null);
    const fileInputs = React.useRef<(HTMLInputElement | null)[]>([]);

    const releasePreview = React.useCallback((preview?: string | null) => {
        if (preview?.startsWith('blob:')) {
            URL.revokeObjectURL(preview);
        }
    }, []);

    React.useEffect(() => {
        return () => {
            imagePreviews.forEach((preview) => releasePreview(preview));
        };
    }, [imagePreviews, releasePreview]);

    React.useEffect(() => {
        setFiles(Array(slotCount).fill(null));
        setExistingImages(normalizedExisting);
        setImagePreviews((previous) => {
            previous.forEach((preview) => releasePreview(preview));

            return normalizedExisting.map((path) =>
                path ? resolveExistingPreview(path) : null,
            );
        });
    }, [normalizedExisting, resolveExistingPreview, releasePreview, slotCount]);

    const handleCardClick = React.useCallback((index: number) => {
        fileInputs.current[index]?.click();
    }, []);

    const handleImageChange = React.useCallback(
        (index: number, filesList: FileList | null) => {
            const file = filesList?.[0];
            if (!file) return;

            if (maxFileSizeBytes && file.size > maxFileSizeBytes) {
                setImageError(maxFileSizeMessage);
                return;
            }

            setImageError(null);

            setFiles((current) => {
                const next = [...current];
                next[index] = file;
                return next;
            });

            setExistingImages((current) => {
                const next = [...current];
                next[index] = null;
                return next;
            });

            setImagePreviews((current) => {
                const next = [...current];
                releasePreview(next[index]);
                next[index] = URL.createObjectURL(file);
                return next;
            });
        },
        [maxFileSizeBytes, maxFileSizeMessage, releasePreview],
    );

    const handleRemoveImage = React.useCallback(
        (index: number) => {
            setFiles((current) => {
                const next = [...current];
                next[index] = null;
                return next;
            });

            setExistingImages((current) => {
                const next = [...current];
                next[index] = null;
                return next;
            });

            setImagePreviews((current) => {
                const next = [...current];
                releasePreview(next[index]);
                next[index] = null;
                return next;
            });
        },
        [releasePreview],
    );

    const hasNewUploads = React.useMemo(
        () => files.some((file) => Boolean(file)),
        [files],
    );

    return {
        files,
        existingImages,
        imagePreviews,
        imageError,
        setImageError,
        fileInputs,
        handleCardClick,
        handleImageChange,
        handleRemoveImage,
        hasNewUploads,
    };
};

export default useImageSlots;
