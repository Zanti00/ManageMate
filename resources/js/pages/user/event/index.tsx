import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SearchInput } from '@/components/ui/search-input';
import AppLayout from '@/layouts/app-layout';
import user from '@/routes/user';
import { type BreadcrumbItem } from '@/types';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuCheckboxItemProps,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { Eye } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Event',
        href: user.event.index().url,
    },
];

type Checked = DropdownMenuCheckboxItemProps['checked'];

export default function UserEvent() {
    const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true);
    const [showActivityBar, setShowActivityBar] =
        React.useState<Checked>(false);
    const [showPanel, setShowPanel] = React.useState<Checked>(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="m-4 flex flex-col rounded-lg bg-white p-4">
                <div className="flex flex-[1] flex-col gap-y-4">
                    <div className="flex flex-row justify-between">
                        <strong className="flex flex-[3] flex-row">
                            All events
                        </strong>
                        <div className="flex flex-[2] flex-row gap-x-5">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">Sort by</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>
                                        Appearance
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem
                                        checked={showStatusBar}
                                        onCheckedChange={setShowStatusBar}
                                    >
                                        Status Bar
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={showActivityBar}
                                        onCheckedChange={setShowActivityBar}
                                        disabled
                                    >
                                        Activity Bar
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={showPanel}
                                        onCheckedChange={setShowPanel}
                                    >
                                        Panel
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <SearchInput></SearchInput>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-5">
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
            </div>
        </AppLayout>
    );
}
