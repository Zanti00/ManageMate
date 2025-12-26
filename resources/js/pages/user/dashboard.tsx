import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { SearchInput } from '@/components/ui/search-input';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/user';
import { type BreadcrumbItem } from '@/types';
import { Eye } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);
    React.useEffect(() => {
        if (!api) {
            return;
        }
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);
        api.on('select', () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-5 p-4">
                <div className="flex flex-col">
                    <Card>
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-[2] flex-row">
                                <div className="flex flex-col">
                                    <CardTitle className="">Names</CardTitle>
                                    <CardContent>System Admin</CardContent>
                                </div>
                            </div>
                            <div className="flex flex-[1] flex-col px-6">
                                <SearchInput></SearchInput>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="flex flex-row">
                    <div className="flex-[1]">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="w-[350px] rounded-lg bg-white shadow-md"
                        />
                    </div>

                    <div className="flex flex-[3]">
                        <div className="mx-auto max-w-md">
                            <Carousel
                                setApi={setApi}
                                className="w-full max-w-md"
                            >
                                <CarouselContent>
                                    {Array.from({ length: 5 }).map(
                                        (_, index) => (
                                            <CarouselItem key={index}>
                                                <Card>
                                                    <CardContent className="flex aspect-video items-center justify-center p-6">
                                                        <span className="text-4xl font-semibold">
                                                            {index + 1}
                                                        </span>
                                                    </CardContent>
                                                    <div className="py-2 text-center text-sm text-muted-foreground">
                                                        {current} of {count}
                                                    </div>
                                                </Card>
                                            </CarouselItem>
                                        ),
                                    )}
                                </CarouselContent>
                                <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2" />
                                <CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2" />
                            </Carousel>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-5 rounded-2xl bg-white p-3 shadow-md">
                    <Card className="w-[30%] flex-col bg-gray-100 p-3">
                        <div className="h-48 w-full overflow-hidden rounded-2xl">
                            <img
                                src="https://i.pinimg.com/736x/49/b8/18/49b818123608412cca0ed827b89cb632.jpg"
                                alt="Description of image"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex flex-row">
                            <strong className="max-w-[12ch] truncate">
                                Kyuseries
                            </strong>
                        </div>
                        <div className="flex flex-col gap-y-3">
                            <div className="flex flex-row gap-x-16">
                                <p>200</p>
                                <p>FREE</p>
                            </div>
                            <hr></hr>
                            <div className="flex flex-row gap-x-1">
                                <p>Venue :</p>
                                <p>Interfaith Chapel</p>
                            </div>
                            <div className="flex flex-row gap-x-1">
                                <p>Date :</p>
                                <p>12 April 2025</p>
                            </div>
                            <div className="flex flex-row gap-x-1">
                                <p>Time :</p>
                                <p>9:00PM to 11:30PM</p>
                            </div>
                        </div>
                        <Button className="border border-foreground">
                            <Eye />
                            View
                        </Button>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
