import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Scan QR',
        href: admin.scanQr.index.url(),
    },
];

export default function AdminScanQr() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="m-4 h-full shadow-md"></Card>
        </AppLayout>
    );
}
