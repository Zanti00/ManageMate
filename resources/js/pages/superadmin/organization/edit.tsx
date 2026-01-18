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

const baseBreadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Organizations',
        href: '/superadmin/organization',
    },
];

type OrgType = 'academic' | 'non-academic';

type Organization = {
    id: number;
    name: string;
    abbreviation?: string;
    type?: OrgType | string;
    email?: string;
    address?: string;
};

interface Props {
    organization: Organization;
}

export default function OrganizationEdit({ organization }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        ...baseBreadcrumbs,
        {
            title: 'Edit Organization',
            href: `/superadmin/organization/${organization.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        id: organization.id,
        name: organization.name,
        abbreviation: organization.abbreviation ?? '',
        type: (organization.type as OrgType) ?? '',
        email: organization.email ?? '',
        address: organization.address ?? '',
    });

    const handleSubmit = () => {
        put(superadmin.organization.update(organization.id).url, {
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
                    title="Edit Organization"
                    description="Update the organization details and save your changes"
                />
                <Card className="mr-52 flex flex-col p-8">
                    <Form className="space-y-6">
                        <CardTitle>Organization Details</CardTitle>
                        <div className="flex flex-row gap-8">
                            <div className="flex flex-col gap-2">
                                <Label>Organization Name *</Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    type="text"
                                    required
                                    placeholder="Enter organization name"
                                />
                                {errors.name && (
                                    <span className="text-sm text-red-500">
                                        {errors.name}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Organization Abbreviation *</Label>
                                <Input
                                    value={data.abbreviation}
                                    onChange={(e) =>
                                        setData('abbreviation', e.target.value)
                                    }
                                    type="text"
                                    required
                                    placeholder="Enter abbreviation"
                                />
                                {errors.abbreviation && (
                                    <span className="text-sm text-red-500">
                                        {errors.abbreviation}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Organization Type *</Label>
                                <Select
                                    value={data.type}
                                    onValueChange={(value) =>
                                        setData('type', value as OrgType)
                                    }
                                    required
                                >
                                    <SelectTrigger className="w-[220px]">
                                        <SelectValue placeholder="Select organization type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="academic">
                                            Academic
                                        </SelectItem>
                                        <SelectItem value="non-academic">
                                            Non-Academic
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && (
                                    <span className="text-sm text-red-500">
                                        {errors.type}
                                    </span>
                                )}
                            </div>
                        </div>

                        <CardTitle>Contact Information</CardTitle>
                        <div className="flex flex-row gap-8">
                            <div className="flex flex-col gap-2">
                                <Label>Email *</Label>
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
                        </div>

                        <div className="flex flex-row gap-8">
                            <div className="flex flex-col gap-2">
                                <Label>Address *</Label>
                                <Input
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    type="text"
                                    required
                                    placeholder="Enter address"
                                />
                                {errors.address && (
                                    <span className="text-sm text-red-500">
                                        {errors.address}
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
                                Save Changes
                            </Button>
                            <Button
                                onClick={() => {
                                    if (window.history.length > 1) {
                                        window.history.back();
                                    } else {
                                        router.visit(
                                            '/superadmin/organization',
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
