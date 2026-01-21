import { Clock3, MapPin } from "lucide-react";
import { Card } from "./card";
import { cn } from "@/lib/utils"
import { formatDate, formatDateRange } from "@/utils/date-format";

// type FilterValues = 'Today' | 'ThisWeek';

type Event = {
    id: number;
    title: string;
    location: string;
    price: number;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    submit_date: number;
    attendees?: number;
};

type Props = { event: Event; imageUrl?: string } & React.ComponentProps<"div">;

function HorizontalEventCard({ event, imageUrl, className }: Props) {
    return (
        <Card className={cn("p-3 hover:shadow-lg", className)}>
            <div className="grid grid-cols-5 gap-3">
                <div className="col-span-1 flex items-center justify-center ">
                    <img
                        src={imageUrl || "https://readdy.ai/api/search-image?query=exciting%20university%20basketball%20game%20in%20modern%20indoor%20arena%20with%20students%20cheering%20players%20competing%20on%20court%20under%20bright%20stadium%20lights%20energetic%20atmosphere&width=300&height=200&seq=basketball-user-001&orientation=landscape"}
                        className="w-32 h-32 rounded-xl"
                    />
                </div>
                <div className="flex flex-col col-span-2 gap-2">
                    <strong>{event.title}</strong>
                    <div className="flex flex-row gap-x-2 items-center">
                        <Clock3 size={12} />
                        <p className='text-xs text-gray-800'>{formatDateRange(event.start_date, event.end_date)}</p>
                    </div>
                    <div className="flex flex-row gap-x-2 items-center">
                        <MapPin size={12} />
                        <p className='text-xs text-gray-800'>{event.location}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export { HorizontalEventCard }