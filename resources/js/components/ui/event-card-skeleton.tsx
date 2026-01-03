import { Card } from './card';
import { Skeleton } from './skeleton';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
}

export function EventCardSkeleton({ className }: Props) {
    return (

            <Skeleton className="h-105 w-full bg-gray-200 rounded-2xl gap-6 flex flex-col" >

                <div className="relative h-72 w-full overflow-hidden">
                    <Skeleton className="h-72 w-full object-cover rounded-none rounded-t-2xl bg-gray-100">
                    </Skeleton>
                </div>

                <div className="flex flex-col gap-4 p-4">
                    <div className="flex flex-col gap-4">
                        <Skeleton className="h-3 w-2/3 bg-gray-100"></Skeleton>
                        <div className="flex flex-row gap-2">
                            <Skeleton className="h-2 w-2 rounded-2xl bg-gray-100"></Skeleton>
                            <Skeleton className='h-2 w-1/3 bg-gray-100'></Skeleton>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Skeleton className="h-2 w-2 rounded-2xl bg-gray-100"></Skeleton>
                            <Skeleton className='h-2 w-1/3 bg-gray-100'></Skeleton>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Skeleton className="h-2 w-2 rounded-2xl bg-gray-100"></Skeleton>
                            <Skeleton className='h-2 w-1/3 bg-gray-100'></Skeleton>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Skeleton className="h-2 w-2 rounded-2xl bg-gray-100"></Skeleton>
                            <Skeleton className='h-2 w-1/3 bg-gray-100'></Skeleton>
                        </div>
                    </div>

                    <div className="flex flex-row">
                        <Skeleton className='w-full bg-gray-100 h-10'></Skeleton>
                    </div>
                </div>

            
            </Skeleton>

    );
}
