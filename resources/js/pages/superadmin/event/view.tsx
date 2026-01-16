import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RegisterModal } from '@/components/ui/register-modal';
import { useImageGallery } from '@/hooks/use-image-gallery';
import AppLayout from '@/layouts/app-layout';
import superadmin from '@/routes/superadmin';
import { BreadcrumbItem } from '@/types';
import { formatDateRange, formatTimeRange } from '@/utils/date-format';
import { getEventStatus } from '@/utils/event-status';
import { formatPrice } from '@/utils/price-format';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'View Event',
        href: superadmin.event.show.url(1),
    },
];

type EventStatus = 'Pending' | 'Active' | 'Rejected' | 'Closed';

type Event = {
    id: number;
    title: string;
    description: string;
    location: string;
    price: number;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    registration_start_date: string;
    registration_end_date: string;
    registration_start_time: string;
    registration_end_time: string;
    status: EventStatus;
    is_featured: string;
    images?: string[];
    image_path?: string | null;
};

interface Props {
    event: Event;
}

export default function ViewEvent({ event }: Props) {
    const [modalOpen, setModalOpen] = useState(false);

    if (!event) {
        return <div className="p-6">Event not found</div>;
    }

    const eventStatus = getEventStatus(event);
    const {
        displayImages,
        activeImageIndex,
        setActiveImageIndex,
        goToPreviousImage,
        goToNextImage,
        resolveImageUrl,
        hasMultipleImages,
        lightboxOpen,
        openLightbox,
        closeLightbox,
    } = useImageGallery({
        images: event.images,
        imagePath: event.image_path,
        resetKey: event.id,
    });

    useEffect(() => {
        if (!hasMultipleImages || lightboxOpen) {
            return;
        }

        const intervalId = window.setInterval(() => {
            goToNextImage();
        }, 2000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [hasMultipleImages, goToNextImage, lightboxOpen]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col overflow-hidden rounded-lg p-8">
                <div
                    className="relative h-64 w-full overflow-hidden rounded-t-md"
                    role="button"
                    tabIndex={0}
                    onClick={openLightbox}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openLightbox();
                        }
                    }}
                    aria-label="Expand image"
                >
                    <img
                        className="h-full w-full cursor-pointer object-cover object-center"
                        src={resolveImageUrl(displayImages[activeImageIndex])}
                        alt={`${event.title} image ${activeImageIndex + 1}`}
                    />
                    {hasMultipleImages && (
                        <>
                            <button
                                className="absolute top-1/2 left-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    goToPreviousImage();
                                }}
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                className="absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    goToNextImage();
                                }}
                                aria-label="Next image"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                                {displayImages.map((_, index) => (
                                    <button
                                        key={`${event.id}-indicator-${index}`}
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setActiveImageIndex(index);
                                        }}
                                        className={`h-2.5 w-2.5 rounded-full ${index === activeImageIndex ? 'bg-white' : 'bg-white/50'}`}
                                        aria-label={`Show image ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <div className="flex flex-col gap-y-6">
                    <Card className="rounded-t-none p-6 shadow-md">
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col gap-y-3">
                                {event.status && (
                                    <div className="flex flex-row">
                                        {eventStatus === 'Closed' && (
                                            <Badge variant="closed">
                                                Closed
                                            </Badge>
                                        )}
                                        {eventStatus === 'Active' && (
                                            <Badge variant="active">
                                                Active
                                            </Badge>
                                        )}
                                        {eventStatus === 'Pending' && (
                                            <Badge variant="pending">
                                                Pending
                                            </Badge>
                                        )}
                                        {eventStatus === 'Rejected' && (
                                            <Badge variant="rejected">
                                                Rejected
                                            </Badge>
                                        )}
                                    </div>
                                )}
                                <div className="flex flex-row">
                                    <Label className="truncate text-4xl font-extrabold">
                                        {event.title}
                                    </Label>
                                </div>
                                <div className="flex flex-row text-gray-800">
                                    <p>{event.description}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2 flex flex-col gap-6">
                            <Card className="flex flex-col px-6">
                                <div className="flex flex-row">
                                    <p className="text-xl font-extrabold">
                                        Event Details
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-row">
                                        <div className="flex flex-col">
                                            <p className="font-medium">Date</p>
                                            <p>
                                                {formatDateRange(
                                                    event.start_date,
                                                    event.end_date,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <div className="flex flex-col">
                                            <p className="font-medium">Time</p>
                                            <p>
                                                {formatTimeRange(
                                                    event.start_time,
                                                    event.end_time,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <div className="flex flex-col">
                                            <p className="font-medium">
                                                Location
                                            </p>
                                            <p>{event.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <div className="flex flex-col">
                                            <p className="font-medium">
                                                Ticket Price
                                            </p>
                                            <p>{formatPrice(event.price)}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                            <Card className="gap-y-6 px-6">
                                <p className="text-xl font-extrabold">
                                    Organizer Information
                                </p>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row">
                                        <div className="flex flex-col">
                                            <p className="font-medium">
                                                Organization
                                            </p>
                                            <p>
                                                Commonwealth Information Society
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <div className="flex flex-col">
                                            <p className="font-medium">Email</p>
                                            <p>commitspupqc@test.com</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <div className="flex flex-col">
                                            <p className="font-medium">Phone</p>
                                            <p>09123456789</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div className="flex flex-col">
                            <Card className="flex flex-col px-6">
                                <Card className="flex flex-col gap-0 bg-orange-50 px-4 py-3">
                                    <div className="flex flex-row">
                                        <p className="font-extrabold text-orange-900">
                                            Registration Time and Date
                                        </p>
                                    </div>
                                    <div className="flex flex-row">
                                        <p className="font-medium text-orange-700">
                                            {formatDateRange(
                                                event.registration_start_date,
                                                event.registration_end_date,
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex flex-row">
                                        <p className="font-small text-orange-700">
                                            {formatTimeRange(
                                                event.registration_start_time,
                                                event.registration_end_time,
                                            )}
                                        </p>
                                    </div>
                                </Card>
                                <div className="flex flex-col gap-2">
                                    <Button
                                        onClick={() =>
                                            router.patch(
                                                `/superadmin/event/${event.id}/approve-event`,
                                            )
                                        }
                                        className="bg-green-600 hover:bg-green-800"
                                        disabled={eventStatus === 'Active'}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            router.patch(
                                                `/superadmin/event/${event.id}/reject-event`,
                                            )
                                        }
                                        className="bg-red-600 hover:bg-red-800"
                                        disabled={eventStatus === 'Rejected'}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            router.patch(
                                                `/superadmin/event/${event.id}/feature-event`,
                                            )
                                        }
                                        className="bg-yellow-400 hover:bg-amber-600"
                                        disabled={
                                            event.is_featured === '1' ||
                                            eventStatus === 'Rejected'
                                        }
                                    >
                                        Feature Event
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
                <RegisterModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    eventTitle={event.title}
                    eventLocation={event.location}
                    eventPrice={formatPrice(event.price)}
                    eventDate={formatDateRange(
                        event.start_date,
                        event.end_date,
                    )}
                    eventTime={formatTimeRange(
                        event.start_time,
                        event.end_time,
                    )}
                />
                {lightboxOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                        <button
                            type="button"
                            className="absolute top-6 right-6 rounded-full bg-black/60 p-2 text-white"
                            aria-label="Close image viewer"
                            onClick={closeLightbox}
                        >
                            <X className="h-5 w-5" />
                        </button>
                        {hasMultipleImages && (
                            <>
                                <button
                                    type="button"
                                    className="absolute top-1/2 left-6 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white"
                                    aria-label="Previous image"
                                    onClick={goToPreviousImage}
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    type="button"
                                    className="absolute top-1/2 right-6 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white"
                                    aria-label="Next image"
                                    onClick={goToNextImage}
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </>
                        )}
                        <img
                            src={resolveImageUrl(
                                displayImages[activeImageIndex],
                            )}
                            alt={`${event.title} image fullscreen`}
                            className="max-h-[80vh] max-w-[90vw] rounded-lg object-contain"
                        />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
