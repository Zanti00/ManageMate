import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import notification from '@/routes/user/notification';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notification',
        href: notification.index().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="m-4 flex flex-col rounded-2xl bg-white p-4 shadow-md">
                <Card className="flex flex-row gap-4 bg-white p-4 shadow-md">
                    <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                            <img
                                src="https://lh3.googleusercontent.com/9J2K04YPnp8pcKLsF5GVRTZMZXFdeLAUaLSmWbNh_6k9q_4OqK8hdo5uqo1GDJlgY6Yew0phZJmHCHtZ=w544-h544-l90-rj"
                                alt="Event icon"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-2 text-sm text-gray-600">
                            <p>EVENT NAME</p>
                            <p>•</p>
                            <p>NOW</p>
                        </div>
                        <div className="flex flex-row">
                            <strong>Subject Title</strong>
                        </div>
                        <div className="flex flex-row">
                            <p className="text-gray-600">Description</p>
                        </div>
                    </div>
                </Card>
                <Card className="flex flex-row gap-4 bg-white p-4 shadow-md">
                    <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                            <img
                                src="https://lh3.googleusercontent.com/9J2K04YPnp8pcKLsF5GVRTZMZXFdeLAUaLSmWbNh_6k9q_4OqK8hdo5uqo1GDJlgY6Yew0phZJmHCHtZ=w544-h544-l90-rj"
                                alt="Event icon"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-2 text-sm text-gray-600">
                            <p>EVENT NAME</p>
                            <p>•</p>
                            <p>NOW</p>
                        </div>
                        <div className="flex flex-row">
                            <strong>Subject Title</strong>
                        </div>
                        <div className="flex flex-row">
                            <p className="text-gray-600">Description</p>
                        </div>
                    </div>
                </Card>
            </Card>
        </AppLayout>
    );
}
