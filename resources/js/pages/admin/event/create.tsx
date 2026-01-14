import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import useImageSlots from '@/hooks/use-image-slots';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';
import { router, useForm } from '@inertiajs/react';
import dayjs from 'dayjs';
import { ChevronDownIcon } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Event',
        href: admin.event.create().url,
    },
];

type EventFormData = {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    registration_start_date: string;
    registration_end_date: string;
    registration_start_time: string;
    registration_end_time: string;
    location: string;
    price: string;
    images: (File | null)[];
};

const imageSlots = [
    {
        id: 0,
        colSpan: 3,
        label: 'Cover image',
        helper: 'Click to upload (max 1MB)',
    },
    {
        id: 1,
        colSpan: 1,
        label: 'Gallery 1',
        helper: 'Click to upload (max 1MB)',
    },
    {
        id: 2,
        colSpan: 1,
        label: 'Gallery 2',
        helper: 'Click to upload (max 1MB)',
    },
    {
        id: 3,
        colSpan: 1,
        label: 'Gallery 3',
        helper: 'Click to upload (max 1MB)',
    },
];

const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB

export default function AdminCreateEvent() {
    // Event Info
    const [startOpen, setStartOpen] = React.useState(false);
    const [startDate, setStartDate] = React.useState<Date | undefined>(
        undefined,
    );
    const [endOpen, setEndOpen] = React.useState(false);
    const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);

    // Registration Info
    const [registrationStartOpen, registrationSetStartOpen] =
        React.useState(false);
    const [registrationStartDate, registrationSetStartDate] = React.useState<
        Date | undefined
    >(undefined);
    const [registrationEndOpen, registrationSetEndOpen] = React.useState(false);
    const [registrationEndDate, registrationSetEndDate] = React.useState<
        Date | undefined
    >(undefined);

    const {
        files,
        imagePreviews,
        imageError,
        fileInputs,
        handleCardClick,
        handleImageChange,
        handleRemoveImage,
    } = useImageSlots({
        slotCount: imageSlots.length,
        maxFileSizeBytes: MAX_IMAGE_SIZE,
    });

    const { data, setData, post, processing, errors, transform } =
        useForm<EventFormData>({
            title: '',
            description: '',
            start_date: '',
            end_date: '',
            start_time: '10:30:00',
            end_time: '11:00:00',
            registration_start_date: '',
            registration_end_date: '',
            registration_start_time: '10:30:00',
            registration_end_time: '11:00:00',
            location: '',
            price: '0',
            images: [],
        });

    React.useEffect(() => {
        setData('images', files);
    }, [files, setData]);

    const handleSubmit = () => {
        transform((formData) => ({
            ...formData,
            images: formData.images.filter(Boolean),
        }));

        post(admin.event.store.url(), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="m-4 flex h-full flex-col gap-y-6 p-6 shadow-md">
                <div className="flex flex-col gap-y-3">
                    <CardTitle>Basic Information</CardTitle>
                    <div className="flex flex-row justify-between gap-x-3">
                        <div className="grid w-[50%] grid-cols-3 gap-4">
                            {imageSlots.map((slot) => (
                                <React.Fragment key={slot.id}>
                                    <input
                                        ref={(el) => {
                                            fileInputs.current[slot.id] = el;
                                        }}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) =>
                                            handleImageChange(
                                                slot.id,
                                                e.target.files,
                                            )
                                        }
                                    />
                                    <Card
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => handleCardClick(slot.id)}
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === 'Enter' ||
                                                e.key === ' '
                                            ) {
                                                e.preventDefault();
                                                handleCardClick(slot.id);
                                            }
                                        }}
                                        className={`${slot.colSpan === 3 ? 'col-span-3' : 'col-span-1'} relative aspect-square w-full cursor-pointer overflow-hidden border border-dashed border-gray-300 bg-gray-50 p-0 hover:border-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2`}
                                    >
                                        {imagePreviews[slot.id] ? (
                                            <div className="h-full w-full">
                                                <img
                                                    src={
                                                        imagePreviews[
                                                            slot.id
                                                        ] as string
                                                    }
                                                    alt={slot.label}
                                                    className="h-full w-full object-contain"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute top-2 right-2 bg-white/80 text-xs"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveImage(
                                                            slot.id,
                                                        );
                                                    }}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex h-full flex-col items-center justify-center gap-1 p-2 text-sm text-gray-500">
                                                <span className="font-medium text-gray-700">
                                                    {slot.label}
                                                </span>
                                                <span>{slot.helper}</span>
                                            </div>
                                        )}
                                    </Card>
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="flex w-full flex-col gap-y-3">
                            <Label>Event Title *</Label>
                            <Input
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                type="text"
                                required
                                placeholder="Enter title"
                            ></Input>
                            {errors.title && (
                                <span className="text-sm text-red-500">
                                    {errors.title}
                                </span>
                            )}
                            <Label>Description *</Label>
                            <Textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                required
                                placeholder="Enter description"
                            ></Textarea>
                            {errors.description && (
                                <span className="text-sm text-red-500">
                                    {errors.description}
                                </span>
                            )}
                            {imageError && (
                                <span className="text-sm text-red-500">
                                    {imageError}
                                </span>
                            )}
                            {errors.images && (
                                <span className="text-sm text-red-500">
                                    {errors.images}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex h-full flex-col justify-between">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-y-6">
                            <CardTitle>Date & Time</CardTitle>
                            <div className="flex flex-row gap-x-3">
                                <div className="flex flex-col gap-y-3">
                                    <Label>Start Date *</Label>
                                    <Popover
                                        open={startOpen}
                                        onOpenChange={setStartOpen}
                                    >
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                id="startDate"
                                                className="w-48 justify-between font-normal"
                                            >
                                                {startDate
                                                    ? startDate.toLocaleDateString()
                                                    : 'Select start date'}
                                                <ChevronDownIcon />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto overflow-hidden p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={startDate}
                                                captionLayout="dropdown"
                                                fromYear={dayjs().year()}
                                                toYear={dayjs().year() + 1}
                                                onSelect={(date) => {
                                                    setStartDate(date);
                                                    setStartOpen(false);
                                                    setData(
                                                        'start_date',
                                                        date
                                                            ? dayjs(
                                                                  date,
                                                              ).format(
                                                                  'YYYY-MM-DD',
                                                              )
                                                            : '',
                                                    );
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.start_date && (
                                        <span className="text-sm text-red-500">
                                            {errors.start_date}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-y-3">
                                    <Label>End Date *</Label>
                                    <Popover
                                        open={endOpen}
                                        onOpenChange={setEndOpen}
                                    >
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                id="endDate"
                                                className="w-48 justify-between font-normal"
                                            >
                                                {endDate
                                                    ? endDate.toLocaleDateString()
                                                    : 'Select end date'}
                                                <ChevronDownIcon />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto overflow-hidden p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={endDate}
                                                captionLayout="dropdown"
                                                fromYear={dayjs().year()}
                                                toYear={dayjs().year() + 1}
                                                onSelect={(date) => {
                                                    setEndDate(date);
                                                    setEndOpen(false);
                                                    setData(
                                                        'end_date',
                                                        date
                                                            ? dayjs(
                                                                  date,
                                                              ).format(
                                                                  'YYYY-MM-DD',
                                                              )
                                                            : '',
                                                    );
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.end_date && (
                                        <span className="text-sm text-red-500">
                                            {errors.end_date}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-row gap-x-3">
                                <div className="flex flex-col gap-y-3">
                                    <Label
                                        htmlFor="time-picker"
                                        className="px-1"
                                    >
                                        Start Time *
                                    </Label>
                                    <Input
                                        type="time"
                                        id="time-picker"
                                        step="1"
                                        value={data.start_time}
                                        className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                        onChange={(e) =>
                                            setData(
                                                'start_time',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.start_time && (
                                        <span className="text-sm text-red-500">
                                            {errors.start_time}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-y-3">
                                    <Label
                                        htmlFor="time-picker"
                                        className="px-1"
                                    >
                                        End Time *
                                    </Label>
                                    <Input
                                        type="time"
                                        id="time-picker"
                                        step="1"
                                        value={data.end_time}
                                        className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                        onChange={(e) =>
                                            setData(
                                                'end_time',
                                                e.target.value ||
                                                    e.target.defaultValue,
                                            )
                                        }
                                    />
                                    {errors.end_time && (
                                        <span className="text-sm text-red-500">
                                            {errors.end_time}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-6">
                            <CardTitle>Location & Price</CardTitle>
                            <div className="flex flex-row gap-x-3">
                                <div className="flex flex-col gap-y-3">
                                    <Label>Location *</Label>
                                    <Input
                                        value={data.location}
                                        onChange={(e) =>
                                            setData('location', e.target.value)
                                        }
                                        type="text"
                                        required
                                        placeholder="Enter location"
                                    ></Input>
                                    {errors.location && (
                                        <span className="text-sm text-red-500">
                                            {errors.location}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-y-3">
                                    <Label>Price *</Label>
                                    <Input
                                        value={data.price}
                                        onChange={(e) =>
                                            setData('price', e.target.value)
                                        }
                                        type="number"
                                        required
                                        placeholder="Enter price"
                                    ></Input>
                                    {errors.price && (
                                        <span className="text-sm text-red-500">
                                            {errors.price}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-6">
                            <CardTitle>Registration Date & Time</CardTitle>
                            <div className="flex flex-row gap-x-3">
                                <div className="flex flex-col gap-y-3">
                                    <Label>Start Date *</Label>
                                    <Popover
                                        open={registrationStartOpen}
                                        onOpenChange={registrationSetStartOpen}
                                    >
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                id="registrationStartDate"
                                                className="w-48 justify-between font-normal"
                                            >
                                                {registrationStartDate
                                                    ? registrationStartDate.toLocaleDateString()
                                                    : 'Select start date'}
                                                <ChevronDownIcon />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto overflow-hidden p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={registrationStartDate}
                                                captionLayout="dropdown"
                                                fromYear={dayjs().year()}
                                                toYear={dayjs().year() + 1}
                                                onSelect={(date) => {
                                                    registrationSetStartDate(
                                                        date,
                                                    );
                                                    registrationSetStartOpen(
                                                        false,
                                                    );
                                                    setData(
                                                        'registration_start_date',
                                                        date
                                                            ? dayjs(
                                                                  date,
                                                              ).format(
                                                                  'YYYY-MM-DD',
                                                              )
                                                            : '',
                                                    );
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.registration_start_date && (
                                        <span className="text-sm text-red-500">
                                            {errors.registration_start_date}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-y-3">
                                    <Label>End Date *</Label>
                                    <Popover
                                        open={registrationEndOpen}
                                        onOpenChange={registrationSetEndOpen}
                                    >
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                id="registrationEndDate"
                                                className="w-48 justify-between font-normal"
                                            >
                                                {registrationEndDate
                                                    ? registrationEndDate.toLocaleDateString()
                                                    : 'Select end date'}
                                                <ChevronDownIcon />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto overflow-hidden p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={registrationEndDate}
                                                captionLayout="dropdown"
                                                fromYear={dayjs().year()}
                                                toYear={dayjs().year() + 1}
                                                onSelect={(date) => {
                                                    registrationSetEndDate(
                                                        date,
                                                    );
                                                    registrationSetEndOpen(
                                                        false,
                                                    );
                                                    setData(
                                                        'registration_end_date',
                                                        date
                                                            ? dayjs(
                                                                  date,
                                                              ).format(
                                                                  'YYYY-MM-DD',
                                                              )
                                                            : '',
                                                    );
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.registration_end_date && (
                                        <span className="text-sm text-red-500">
                                            {errors.registration_end_date}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-row gap-x-3">
                                <div className="flex flex-col gap-y-3">
                                    <Label
                                        htmlFor="time-picker"
                                        className="px-1"
                                    >
                                        Start Time *
                                    </Label>
                                    <Input
                                        type="time"
                                        id="time-picker"
                                        step="1"
                                        value={data.registration_start_time}
                                        className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                        onChange={(e) =>
                                            setData(
                                                'registration_start_time',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.registration_start_time && (
                                        <span className="text-sm text-red-500">
                                            {errors.registration_start_time}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-y-3">
                                    <Label
                                        htmlFor="time-picker"
                                        className="px-1"
                                    >
                                        End Time *
                                    </Label>
                                    <Input
                                        type="time"
                                        id="time-picker"
                                        step="1"
                                        value={data.registration_end_time}
                                        className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                        onChange={(e) =>
                                            setData(
                                                'registration_end_time',
                                                e.target.value ||
                                                    e.target.defaultValue,
                                            )
                                        }
                                    />
                                    {errors.registration_end_time && (
                                        <span className="text-sm text-red-500">
                                            {errors.registration_end_time}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row place-content-end gap-x-3">
                        <Button
                            type="button"
                            disabled={processing}
                            onClick={handleSubmit}
                        >
                            Create Event
                        </Button>
                        <Button
                            onClick={() => {
                                if (window.history.length > 1) {
                                    window.history.back();
                                } else {
                                    router.visit(admin.event.index.url());
                                }
                            }}
                            className="bg-gray-100 text-black"
                            type="button"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Card>
        </AppLayout>
    );
}
