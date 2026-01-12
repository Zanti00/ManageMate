import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import superadmin from '@/routes/superadmin';
import { BreadcrumbItem } from '@/types';
import { Form, router, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Admin',
        href: superadmin.admin.create.url(),
    },
];

type OrganizationOption = {
    id: number;
    name: string;
};

interface Props {
    organizations?: OrganizationOption[];
}

export default function CreateAdmin({ organizations = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        position_title: '',
        email: '',
        phone_number: '',
        password: '',
        organization_id: '',
    });

    const handleSubmit = () => {
        post(superadmin.admin.store.url(), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="my-8 mr-52 ml-8 flex flex-col p-8">
                <Form className="space-y-6">
                    <div className="flex flex-row gap-8">
                        <div className="gap flex flex-col gap-2">
                            <Label>Organization *</Label>
                            <Select
                                value={data.organization_id}
                                onValueChange={(value) =>
                                    setData('organization_id', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select organization" />
                                </SelectTrigger>
                                <SelectContent>
                                    {organizations.map((org) => (
                                        <SelectItem
                                            key={org.id}
                                            value={org.id.toString()}
                                        >
                                            {org.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.organization_id && (
                                <span className="text-sm text-red-500">
                                    {errors.organization_id}
                                </span>
                            )}
                        </div>
                    </div>
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
                        <div className="gap flex flex-col gap-2">
                            <Label>Temporary Password *</Label>
                            <Input
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                type="password"
                                required
                                placeholder="Enter password"
                            />
                            {errors.password && (
                                <span className="text-sm text-red-500">
                                    {errors.password}
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
                            Create Account
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
