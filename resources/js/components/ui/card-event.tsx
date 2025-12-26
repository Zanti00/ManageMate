import * as React from 'react'
import { Card } from './card'
import { Button } from './button'
import { Eye } from 'lucide-react'
import admin from '@/routes/admin';

import {cn} from '@/lib/utils';
import { Badge } from './badge';
import { Link } from '@inertiajs/react';

function EventCard ({className, ...props} : React.ComponentProps<"div">){
    return (
        <Card className={cn("w-[30%] flex-col bg-gray-100 p-3",
            className
        )}
            {...props}
            >
                        <div className="relative h-48 w-full overflow-hidden rounded-2xl">
                            <img
                                src="https://i.pinimg.com/736x/49/b8/18/49b818123608412cca0ed827b89cb632.jpg"
                                alt="Description of image"
                                className="h-full w-full object-cover"
                            />
                            {/* Badge positioned at top-right */}
                            <div className="absolute top-2 right-2 pr-2 pt-2">
                                <Badge variant="approved">Approved</Badge>
                            </div>
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
                        
                        <Link href={admin.event.view().url}>
                            <Button className="border border-foreground w-full">
                                <Eye />
                                View
                            </Button>
                        </Link>
                    </Card>
    )
}

export {EventCard}