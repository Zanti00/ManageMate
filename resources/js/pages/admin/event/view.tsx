import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'View Event',
        href: admin.event.view.url(),
    },
];

export default function AdminEventView() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col overflow-hidden rounded-lg p-8">
                <img
                    className="h-64 w-full rounded-t-md object-cover object-top"
                    src="https://readdy.ai/api/search-image?query=modern%20technology%20conference%20summit%20with%20large%20screens%20displaying%20innovative%20tech%20presentations%20students%20and%20professionals%20networking%20in%20bright%20spacious%20university%20auditorium%20with%20stage%20and%20seating&width=1200&height=400&seq=tech-summit-detail-001&orientation=landscape"
                />
                <div className="flex flex-col gap-y-6">
                    <Card className="rounded-t-none p-6 shadow-md">
                        <div className="flex flex-row">
                            <div className="flex flex-col gap-y-3">
                                <div className="flex flex-row">
                                    <Badge variant={'approved'}>Approved</Badge>
                                </div>
                                <div className="flex flex-row">
                                    <Label className="text-4xl font-extrabold">
                                        CommIts General Assembly 2025
                                    </Label>
                                </div>
                                <div className="flex flex-row text-gray-800">
                                    <p>
                                        Join us for an exciting day of
                                        technological innovation and networking.
                                        This summit brings together industry
                                        leaders, students, and tech enthusiasts
                                        to explore the latest trends in
                                        artificial intelligence, machine
                                        learning, blockchain, and emerging
                                        technologies. Featuring keynote speakers
                                        from leading tech companies, interactive
                                        workshops, and networking sessions.
                                        Whether you're a student looking to
                                        learn about cutting-edge technology or a
                                        professional seeking to expand your
                                        network, this event offers valuable
                                        insights and opportunities. Participants
                                        will have the chance to engage in
                                        hands-on demonstrations, attend panel
                                        discussions, and connect with potential
                                        employers and collaborators.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <Button className="bg-red-900 text-white">
                                    Generate Report
                                </Button>
                            </div>
                        </div>
                    </Card>
                    <div className="grid grid-cols-4 gap-4">
                        <Card>
                            <div className="flex flex-col p-4">
                                <Label className="text-2xl font-extrabold">
                                    245
                                </Label>
                                <Label className="text-gray-800">
                                    Registered Attendees
                                </Label>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex flex-col p-4">
                                <Label className="text-2xl font-extrabold">
                                    245
                                </Label>
                                <Label className="text-gray-800">
                                    Registered Attendees
                                </Label>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex flex-col p-4">
                                <Label className="text-2xl font-extrabold">
                                    245
                                </Label>
                                <Label className="text-gray-800">
                                    Registered Attendees
                                </Label>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex flex-col p-4">
                                <Label className="text-2xl font-extrabold">
                                    245
                                </Label>
                                <Label className="text-gray-800">
                                    Registered Attendees
                                </Label>
                            </div>
                        </Card>
                    </div>
                    <Tabs defaultValue="overview">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="statistics">
                                Statistics
                            </TabsTrigger>
                            <TabsTrigger value="attendees">
                                Attendees
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent className="bg-white" value="overview">
                            Overview
                        </TabsContent>
                        <TabsContent value="statistics">Statistics</TabsContent>
                        <TabsContent value="attendees">Attendees</TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}
