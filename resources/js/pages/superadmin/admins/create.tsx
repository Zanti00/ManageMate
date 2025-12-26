import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import superadmin from '@/routes/superadmin';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Admin',
        href: superadmin.admins.create.url(),
    },
];

export default function CreateAdmin() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="my-8 mr-52 ml-8 flex flex-col p-8">
                <CardTitle>Organization Information</CardTitle>
                <div className="gap flex flex-col gap-2">
                    <Label>Organization Name *</Label>
                    <Input placeholder="Enter name"></Input>
                </div>
                <div className="flex flex-row gap-8">
                    <div className="gap flex flex-col gap-2">
                        <Label>Organization Type *</Label>
                        <Input></Input>
                    </div>
                    <div className="gap flex flex-col gap-2">
                        <Label>Organization Email *</Label>
                        <Input placeholder="Enter email"></Input>
                    </div>
                </div>
                <div className="gap flex flex-col gap-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Enter description"></Textarea>
                </div>
                <CardTitle>Admin Contact Information</CardTitle>
                <div className="flex flex-row gap-8">
                    <div className="gap flex flex-col gap-2">
                        <Label>Full Name *</Label>
                        <Input placeholder="Enter full name"></Input>
                    </div>
                    <div className="gap flex flex-col gap-2">
                        <Label>Position Title *</Label>
                        <Input placeholder="Enter title"></Input>
                    </div>
                </div>
                <div className="flex flex-row gap-8">
                    <div className="gap flex flex-col gap-2">
                        <Label>Contact Email *</Label>
                        <Input placeholder="Enter email"></Input>
                    </div>
                    <div className="gap flex flex-col gap-2">
                        <Label>Phone Number *</Label>
                        <Input placeholder="Enter phone number"></Input>
                    </div>
                </div>
                <CardTitle>Admin Contact Information</CardTitle>
                <div className="flex flex-row gap-8">
                    <div className="gap flex flex-col gap-2">
                        <Label>Username *</Label>
                        <Input placeholder="Enter username"></Input>
                    </div>
                    <div className="gap flex flex-col gap-2">
                        <Label>Temporary Password *</Label>
                        <Input placeholder="Enter password"></Input>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <Button>Create Account</Button>
                    <Button className="bg-gray-100 text-black">Cancel</Button>
                </div>
            </Card>
        </AppLayout>
    );
}
