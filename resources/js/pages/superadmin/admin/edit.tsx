import Heading from '@/components/heading';
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
import { ArrowLeft } from 'lucide-react';

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
    organization_id: number | string;
};

type OrganizationOption = {
    id: number;
    name: string;
};

interface Props {
    admin: Admin;
    organizations?: OrganizationOption[];
}

export default function AdminEdit({ admin, organizations }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        id: admin.id,
        username: admin.username,
        first_name: admin.first_name,
        middle_name: admin.middle_name,
        last_name: admin.last_name,
        position_title: admin.position_title,
        email: admin.email,
        phone_number: admin.phone_number,
        organization_id: admin.organization_id
            ? String(admin.organization_id)
            : '',
    });

    const handleSubmit = () => {
        put(superadmin.admin.update.url(admin.id), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-4 p-8">
                <div className="mb-2">
                    <Button
                        variant="ghost"
                        className="flex cursor-pointer gap-2 hover:bg-transparent hover:font-bold hover:text-foreground"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft />
                        Back
                    </Button>
                </div>
                <Heading
                    title="Edit Admin"
                    description="Update the admin details and save your changes"
                />
                <Card className="mr-52 flex flex-col p-8">
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
                                        {(organizations || []).map((org) => (
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
                                        setData(
                                            'position_title',
                                            e.target.value,
                                        )
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
                                        router.visit(
                                            superadmin.admin.index.url(),
                                        );
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
            </div>
        </AppLayout>
    );
}
