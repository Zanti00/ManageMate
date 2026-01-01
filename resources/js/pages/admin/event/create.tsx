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

    const { data, setData, post, processing, errors } = useForm({
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
    });

    const handleSubmit = () => {
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
                            <Card className="col-span-3 bg-gray-100"></Card>
                            <Card className="col-span-1 bg-gray-100"></Card>
                            <Card className="col-span-1 bg-gray-100"></Card>
                            <Card className="col-span-1 bg-gray-100"></Card>
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
