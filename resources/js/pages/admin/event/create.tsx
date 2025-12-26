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
import { ChevronDownIcon } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Event',
        href: admin.event.create().url,
    },
];

export default function AdminCreateEvent() {
    // Start date states
    const [startOpen, setStartOpen] = React.useState(false);
    const [startDate, setStartDate] = React.useState<Date | undefined>(
        undefined,
    );

    // End date states
    const [endOpen, setEndOpen] = React.useState(false);
    const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);

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
                            <Input placeholder="Enter title"></Input>
                            <Label>Description *</Label>
                            <Textarea placeholder="Enter description"></Textarea>
                        </div>
                    </div>
                </div>
                <div className="flex h-full flex-col justify-between">
                    <div className="flex flex-row gap-x-24">
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
                                                onSelect={(date) => {
                                                    setStartDate(date);
                                                    setStartOpen(false);
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
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
                                                onSelect={(date) => {
                                                    setEndDate(date);
                                                    setEndOpen(false);
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
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
                                        defaultValue="10:30:00"
                                        className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                    />
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
                                        defaultValue="10:30:00"
                                        className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-6">
                            <CardTitle>Location & Price</CardTitle>
                            <div className="flex flex-row gap-x-3">
                                <div className="flex flex-col gap-y-3">
                                    <Label>Location *</Label>
                                    <Input placeholder="Enter location"></Input>
                                </div>
                                <div className="flex flex-col gap-y-3">
                                    <Label>Price *</Label>
                                    <Input placeholder="Enter price"></Input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row place-content-end gap-x-3">
                        <Button>Create Event</Button>
                        <Button>Cancel</Button>
                    </div>
                </div>
            </Card>
        </AppLayout>
    );
}
