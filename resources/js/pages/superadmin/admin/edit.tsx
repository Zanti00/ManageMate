import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import superadmin from '@/routes/superadmin';
import { BreadcrumbItem } from '@/types';
import { Form, router, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Admin',
        href: superadmin.admin.edit.url(0), // change the parameter into real admin id later
    },
];

type Admin = {
    id: number;
    username: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    position_title: string;
    email: string;
    phone_number: string;
    is_deleted: string;
};

interface Props {
    admin: Admin;
}

export default function AdminEdit({ admin }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        id: admin.id,
        username: admin.username,
        first_name: admin.first_name,
        middle_name: admin.middle_name,
        last_name: admin.last_name,
        position_title: admin.position_title,
        email: admin.email,
        phone_number: admin.phone_number,
    });

    const handleSubmit = () => {
        put(superadmin.admin.update.url(admin.id), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="my-8 mr-52 ml-8 flex flex-col p-8">
                <Form className="space-y-6">
                    <CardTitle>Admin Contact Information</CardTitle>
                    <div className="flex flex-row gap-8">
                        <div className="gap flex flex-col gap-2">
                            <Label>First Name *</Label>
                            <Input
                                value={data.first_name}
                                onChange={(e) =>
                                    setData('first_name', e.target.value)
                                }
                                type="text"
                                required
                                placeholder="Enter first name"
                            />
                            {errors.first_name && (
                                <span className="text-sm text-red-500">
                                    {errors.first_name}
                                </span>
                            )}
                        </div>
                        <div className="gap flex flex-col gap-2">
                            <Label>Middle Name </Label>
                            <Input
                                value={data.middle_name}
                                onChange={(e) =>
                                    setData('middle_name', e.target.value)
                                }
                                type="text"
                                placeholder="Enter middle name"
                            />
                            {errors.middle_name && (
                                <span className="text-sm text-red-500">
                                    {errors.middle_name}
                                </span>
                            )}
                        </div>
                        <div className="gap flex flex-col gap-2">
                            <Label>Last Name *</Label>
                            <Input
                                value={data.last_name}
                                onChange={(e) =>
                                    setData('last_name', e.target.value)
                                }
                                type="text"
                                required
                                placeholder="Enter last name"
                            />
                            {errors.last_name && (
                                <span className="text-sm text-red-500">
                                    {errors.last_name}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-row gap-8">
                        <div className="gap flex flex-col gap-2">
                            <Label>Position Title *</Label>
                            <Input
                                value={data.position_title}
                                onChange={(e) =>
                                    setData('position_title', e.target.value)
                                }
                                type="text"
                                required
                                placeholder="Enter title"
                            />
                            {errors.position_title && (
                                <span className="text-sm text-red-500">
                                    {errors.position_title}
                                </span>
                            )}
                        </div>
                        <div className="gap flex flex-col gap-2">
                            <Label>Contact Email *</Label>
                            <Input
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                type="email"
                                required
                                placeholder="Enter email"
                            />
                            {errors.email && (
                                <span className="text-sm text-red-500">
                                    {errors.email}
                                </span>
                            )}
                        </div>
                        <div className="gap flex flex-col gap-2">
                            <Label>Phone Number *</Label>
                            <Input
                                value={data.phone_number}
                                onChange={(e) =>
                                    setData('phone_number', e.target.value)
                                }
                                type="text"
                                required
                                placeholder="Enter phone number"
                            />
                            {errors.phone_number && (
                                <span className="text-sm text-red-500">
                                    {errors.phone_number}
                                </span>
                            )}
                        </div>
                    </div>
                    <CardTitle>Account Settings</CardTitle>
                    <div className="flex flex-row gap-8">
                        <div className="gap flex flex-col gap-2">
                            <Label>Username *</Label>
                            <Input
                                value={data.username}
                                onChange={(e) =>
                                    setData('username', e.target.value)
                                }
                                type="text"
                                required
                                placeholder="Enter username"
                            />
                            {errors.username && (
                                <span className="text-sm text-red-500">
                                    {errors.username}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <Button
                            type="button"
                            disabled={processing}
                            onClick={handleSubmit}
                        >
                            Done
                        </Button>
                        <Button
                            onClick={() => {
                                if (window.history.length > 1) {
                                    window.history.back();
                                } else {
                                    router.visit(superadmin.admin.index.url());
                                }
                            }}
                            className="bg-gray-100 text-black"
                            type="button"
                        >
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card>
        </AppLayout>
    );
}
