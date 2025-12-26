import { type BreadcrumbItem, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { CalendarIcon } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

function formatDate(date: Date | undefined) {
    if (!date) {
        return '';
    }
    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}
function isValidDate(date: Date | undefined) {
    if (!date) {
        return false;
    }
    return !isNaN(date.getTime());
}

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | undefined>(
        new Date('2003-05-03'),
    );
    const [month, setMonth] = React.useState<Date | undefined>(date);
    const [value, setValue] = React.useState(formatDate(date));
    const { auth } = usePage<SharedData>().props;

    const [studentNumber, setStudentNumber] = useState('2023-00063-CM-0');
    const [email, setEmail] = useState('mobaraqcamar@test.com');
    const [firstName, setFirstName] = useState('Zanti');
    const [lastName, setLastName] = useState('Man');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout>
                <div className="mx-40 flex flex-col">
                    <p>Account Details</p>
                    <hr></hr>
                    <div className="mt-2 mr-24 flex flex-col gap-y-4">
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col">
                                <p>Student Number</p>
                                <Input
                                    value={studentNumber}
                                    onChange={(e) =>
                                        setStudentNumber(e.target.value)
                                    }
                                ></Input>
                            </div>
                            <div className="flex flex-col">
                                <p>Email</p>
                                <Input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                ></Input>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col">
                                <p>First Name</p>
                                <Input
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                ></Input>
                            </div>
                            <div className="flex flex-col">
                                <p>Last Name</p>
                                <Input
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                ></Input>
                            </div>
                        </div>
                        <div className="flex flex-row">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="date" className="px-1">
                                    Date of Birth
                                </Label>
                                <div className="relative flex gap-2">
                                    <Input
                                        id="date"
                                        value={value}
                                        placeholder="June 01, 2025"
                                        className="bg-background pr-10"
                                        onChange={(e) => {
                                            const date = new Date(
                                                e.target.value,
                                            );
                                            setValue(e.target.value);
                                            if (isValidDate(date)) {
                                                setDate(date);
                                                setMonth(date);
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'ArrowDown') {
                                                e.preventDefault();
                                                setOpen(true);
                                            }
                                        }}
                                    />
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="date-picker"
                                                variant="ghost"
                                                className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                            >
                                                <CalendarIcon className="size-3.5" />
                                                <span className="sr-only">
                                                    Select date
                                                </span>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto overflow-hidden p-0"
                                            align="end"
                                            alignOffset={-8}
                                            sideOffset={10}
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                captionLayout="dropdown"
                                                month={month}
                                                onMonthChange={setMonth}
                                                onSelect={(selectedDate) => {
                                                    setDate(selectedDate);
                                                    setValue(
                                                        formatDate(
                                                            selectedDate,
                                                        ),
                                                    );
                                                    setOpen(false);
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row place-content-end">
                        <Button>Save</Button>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
