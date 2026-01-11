import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import superadmin from '@/routes/superadmin';
import { formatDate } from '@/utils/date-format';
import { Link, router, useForm } from '@inertiajs/react';
import { Calendar, Mail, MapPin, MoreVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './dropdown-menu';

export type OrgStatus = 'Active' | 'Inactive';

export type OrganizationCardProps = {
    id: number;
    name: string;
    abbreviation?: string;
    type?: string;
    email?: string;
    address?: string;
    created_at?: string;
    is_deleted?: string;
    status?: OrgStatus;
};

export function OrganizationCard({
    id,
    name,
    abbreviation,
    type,
    email,
    address,
    created_at,
    is_deleted,
    status = 'Active',
}: OrganizationCardProps) {
    const { delete: destroy } = useForm();
    const created = created_at ? formatDate(created_at) : '—';
    const displayStatus = is_deleted === '1' ? 'Inactive' : status;

    return (
        
        <Card className="flex h-full flex-col justify-between p-4">
            <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-4 mb-2">
                    <img
                        className="h-12 w-12 bg-amber-100 rounded-full flex-shrink-0"
                        alt="Avatar"
                    />

                    <div className="flex flex-col text-gray-400 min-w-0 flex-1">
                        <div className="flex flex-row items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <CardTitle className="truncate cursor-help" title={name}>
                            {name}
                            </CardTitle>
                        </div>

                        <Badge variant={displayStatus === "Active" ? "active" : "rejected"}>
                            {displayStatus}
                        </Badge>
                        </div>

                        <div className="flex flex-row">
                        <Label className="truncate">
                            {abbreviation} | {type}
                        </Label>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row gap-2">
                    <div className="flex flex-col">
                        <Mail 
                        className='stroke-gray-400'
                        size={16}
                        />
                    </div>
                    <div className="flex flex-col">
                        <p className='text-gray-400 text-xs'>Email</p>
                        <p className='text-xs'>{email}</p>
                    </div>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="flex flex-col">
                        <MapPin 
                        className='stroke-gray-400'
                        size={16}
                        />
                    </div>
                    <div className="flex flex-col">
                        <p className='text-gray-400 text-xs'>Address</p>
                        <p className='text-xs'>{address}</p>
                    </div>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="flex flex-col">
                        <Calendar 
                        className='stroke-gray-400'
                        size={16}
                        />
                    </div>
                    <div className="flex flex-col">
                        <p className='text-gray-400 text-xs'>Created Date</p>
                        <p className='text-xs'>{created}</p>
                    </div>
                </div>
            </div>

            <div className=" flex flex-row gap-2 w-full">
                <Link href={superadmin.organization.show(id).url} className="w-full">
                    <Button className="w-full">
                        View
                    </Button>
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="border border-foreground bg-white px-3" aria-label="More options">
                            <MoreVertical className='stroke-foreground' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onSelect={(event) => {
                                event.preventDefault();
                                router.visit(superadmin.organization.edit(id).url);
                            }}
                        >
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            variant="destructive"
                            onSelect={(event) => {
                                event.preventDefault();
                                if (confirm('Are you sure you want to delete this organization?')) {
                                    destroy(superadmin.organization.destroy(id).url);
                                }
                            }}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </Card>
    );
}
